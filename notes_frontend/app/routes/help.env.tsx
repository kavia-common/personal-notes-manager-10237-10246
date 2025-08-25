import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

// PUBLIC_INTERFACE
export async function loader() {
  /** Exposes safe env vars used by client for debugging purposes. Do not include secrets. */
  const viteEnv = (import.meta as unknown as { env?: Record<string, string | undefined> })?.env || {};
  return json({
    VITE_API_BASE_URL: viteEnv.VITE_API_BASE_URL || process.env.VITE_API_BASE_URL || null,
    VITE_API_WITH_CREDENTIALS:
      viteEnv.VITE_API_WITH_CREDENTIALS || process.env.VITE_API_WITH_CREDENTIALS || null,
    NODE_ENV: process.env.NODE_ENV || null,
  });
}

export default function HelpEnv() {
  const data = useLoaderData<typeof loader>();
  return (
    <pre className="m-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm dark:border-gray-800 dark:bg-gray-900">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
