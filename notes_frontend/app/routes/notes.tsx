import { Outlet } from "@remix-run/react";

// PUBLIC_INTERFACE
export default function NotesLayout() {
  /** Parent layout for notes routes to render nested content in the right-hand pane. */
  return <Outlet />;
}
