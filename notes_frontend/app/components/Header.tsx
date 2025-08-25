import { Form, Link } from "@remix-run/react";
import { ThemeToggle } from "./ThemeToggle";

type Props = {
  user?: { email: string; name?: string } | null;
};

// PUBLIC_INTERFACE
export function Header({ user }: Props) {
  /** Header containing app title, search slot (via route), theme toggle, and auth controls. */
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2 dark:border-gray-800 dark:bg-gray-950">
      <div className="flex items-center gap-3">
        <Link to="/" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Notes
        </Link>
        <span className="rounded bg-[#1976d2]/10 px-2 py-0.5 text-xs font-medium text-[#1976d2]">
          Personal
        </span>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        {user ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-gray-600 dark:text-gray-300 sm:inline">
              {user.name || user.email}
            </span>
            <Form method="post" action="/logout">
              <button
                type="submit"
                className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Logout
              </button>
            </Form>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-md bg-[#1976d2] px-3 py-2 text-sm text-white hover:bg-[#165fae]"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
