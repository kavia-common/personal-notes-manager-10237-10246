import type { MetaFunction } from "@remix-run/node";

// PUBLIC_INTERFACE
export const meta: MetaFunction = () => {
  /** Global meta for the application. */
  return [
    { title: "Notes | Personal Notes Manager" },
    { name: "description", content: "Create, edit, and manage personal notes." },
    { name: "theme-color", content: "#1976d2" },
  ];
};
