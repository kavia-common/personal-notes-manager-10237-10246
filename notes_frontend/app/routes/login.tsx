import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation, useSearchParams } from "@remix-run/react";
import { getUser, login } from "~/utils/auth.server";

// PUBLIC_INTERFACE
export async function loader({ request }: LoaderFunctionArgs) {
  /** Redirect logged-in users away from login page. */
  const user = await getUser(request);
  if (user) return redirect("/");
  return json({});
}

// PUBLIC_INTERFACE
export async function action({ request }: ActionFunctionArgs) {
  /** Handle login form submission via auth server helper. */
  try {
    return await login(request);
  } catch (e) {
    const err = e as { status?: number; data?: { message?: string } };
    const status = err?.status || 400;
    const message = err?.data?.message || "Invalid credentials";
    return json({ error: message }, { status });
  }
}

export default function LoginPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [params] = useSearchParams();
  const redirectTo = params.get("redirectTo") || "/";

  const busy = navigation.state === "submitting";

  return (
    <div className="mx-auto my-10 w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <h1 className="mb-1 text-xl font-semibold">Welcome back</h1>
      <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
        Sign in to your account to continue.
      </p>
      {actionData?.error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {actionData.error}
        </div>
      )}
      <Form method="post" className="flex flex-col gap-3">
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <label className="text-sm">
          Email
          <input
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-[#1976d2]/30 focus:border-[#1976d2] focus:ring-2 dark:border-gray-700 dark:bg-gray-900"
            type="email"
            name="email"
            required
            placeholder="you@example.com"
          />
        </label>
        <label className="text-sm">
          Password
          <input
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-[#1976d2]/30 focus:border-[#1976d2] focus:ring-2 dark:border-gray-700 dark:bg-gray-900"
            type="password"
            name="password"
            required
            placeholder="••••••••"
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="mt-2 inline-flex items-center justify-center rounded-md bg-[#1976d2] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#165fae] disabled:opacity-70"
        >
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </Form>
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
        Don&apos;t have an account?{" "}
        <Link className="text-[#1976d2] hover:underline" to="/register">
          Sign up
        </Link>
      </p>
    </div>
  );
}
