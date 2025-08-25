import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

// PUBLIC_INTERFACE
export async function loader({ params }: LoaderFunctionArgs) {
  /** Catch-all route to show 404 not found message. */
  return json({ path: params["*"] }, { status: 404 });
}

export default function NotFound() {
  return (
    <div className="m-auto max-w-lg p-6 text-center">
      <h1 className="mb-2 text-2xl font-bold">404</h1>
      <p className="text-sm text-gray-600 dark:text-gray-300">Page not found.</p>
    </div>
  );
}
