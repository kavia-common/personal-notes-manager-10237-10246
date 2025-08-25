import { json } from "@remix-run/node";

/**
 * Centralized API client for the frontend.
 * Reads base URL and credentials mode from environment variables.
 */
type ViteEnv = { [key: string]: string | undefined };
const viteEnv = (import.meta as unknown as { env?: ViteEnv })?.env || {};

const API_BASE_URL =
  viteEnv.VITE_API_BASE_URL || process.env.VITE_API_BASE_URL || "http://localhost:4000";

const WITH_CREDENTIALS =
  (viteEnv.VITE_API_WITH_CREDENTIALS || process.env.VITE_API_WITH_CREDENTIALS || "false") ===
  "true";

type SearchParamValue = string | number | boolean | undefined;

// PUBLIC_INTERFACE
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit & { searchParams?: Record<string, SearchParamValue> } = {}
): Promise<T> {
  /** Performs a fetch to the backend REST API, automatically attaching JSON headers and credentials when configured. */
  const url = new URL(path.startsWith("http") ? path : `${API_BASE_URL}${path}`);
  if (options.searchParams) {
    Object.entries(options.searchParams).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    });
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: WITH_CREDENTIALS ? "include" : "same-origin",
  });

  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    // Provide Remix-friendly error
    throw json(
      { message: (data as { message?: string })?.message || res.statusText || "Request failed", status: res.status, data },
      { status: res.status }
    );
  }

  return data as T;
}
