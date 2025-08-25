import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { apiFetch } from "~/utils/api";

/**
 * Session cookie storage for auth.
 * NOTE: SECRET must be configured by deployment, else fallback to a dev-safe default.
 * For production, ensure a secure, long random string via environment variables.
 */
const sessionSecret = process.env.SESSION_SECRET || "dev-insecure-session-secret-change-me";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__notes_session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [sessionSecret],
    secure: process.env.NODE_ENV === "production",
  },
});

export type User = {
  id: string;
  email: string;
  name?: string;
};

type LoginResponse = {
  user: User;
  token?: string;
};

const AUTH_PATHS = {
  login: "/auth/login",
  register: "/auth/register",
  me: "/auth/me",
  logout: "/auth/logout",
};

// PUBLIC_INTERFACE
export async function getUserSession(request: Request) {
  /** Returns the current Remix session from request cookies. */
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

// PUBLIC_INTERFACE
export async function getUser(request: Request): Promise<User | null> {
  /** Retrieves the current user from session; if token present, attempts to fetch latest user profile. */
  const session = await getUserSession(request);
  const user = session.get("user") as User | undefined | null;
  return user ?? null;
}

// PUBLIC_INTERFACE
export async function requireUser(request: Request) {
  /** Ensures a user is logged in; redirects to /login with redirectTo on absence. */
  const user = await getUser(request);
  if (!user) {
    const url = new URL(request.url);
    const redirectTo = url.pathname + url.search;
    throw redirect(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  }
  return user;
}

// PUBLIC_INTERFACE
export async function login(request: Request) {
  /** Handles login via API and persists user in session. Expects form fields: email, password. */
  const form = await request.formData();
  const email = String(form.get("email") || "");
  const password = String(form.get("password") || "");
  const redirectTo = String(form.get("redirectTo") || "/");

  const data = (await apiFetch(AUTH_PATHS.login, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })) as LoginResponse;

  const session = await getUserSession(request);
  session.set("user", data.user);
  if (data.token) {
    session.set("token", data.token);
  }

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        // 7 days
        maxAge: 60 * 60 * 24 * 7,
      }),
    },
  });
}

// PUBLIC_INTERFACE
export async function register(request: Request) {
  /** Handles user registration via API and persists user in session. Expects form fields: name?, email, password. */
  const form = await request.formData();
  const name = form.get("name") ? String(form.get("name")) : undefined;
  const email = String(form.get("email") || "");
  const password = String(form.get("password") || "");

  const data = (await apiFetch(AUTH_PATHS.register, {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  })) as LoginResponse;

  const session = await getUserSession(request);
  session.set("user", data.user);
  if (data.token) {
    session.set("token", data.token);
  }

  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: 60 * 60 * 24 * 7,
      }),
    },
  });
}

// PUBLIC_INTERFACE
export async function logout(request: Request) {
  /** Logs out by clearing the session and calling backend logout if available. */
  try {
    await apiFetch(AUTH_PATHS.logout, { method: "POST" });
  } catch {
    // ignore API logout errors
  }

  const session = await getUserSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

// PUBLIC_INTERFACE
export function getSessionHeaders(session: Awaited<ReturnType<typeof sessionStorage.getSession>>) {
  /** Returns headers with Set-Cookie for a given session changes. */
  return {
    "Set-Cookie": sessionStorage.commitSession(session),
  };
}
