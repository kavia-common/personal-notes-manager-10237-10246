import type { ActionFunctionArgs } from "@remix-run/node";
import { logout } from "~/utils/auth.server";

// PUBLIC_INTERFACE
export async function action({ request }: ActionFunctionArgs) {
  /** Log the user out and redirect to /login. */
  return logout(request);
}

export default function Logout() {
  return null;
}
