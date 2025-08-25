import { Link } from "@remix-run/react";

type Props = {
  to?: string;
};

// PUBLIC_INTERFACE
export function FloatingActionButton({ to = "/notes/new" }: Props) {
  /** Floating action button to create a new note. */
  return (
    <Link
      to={to}
      className="fixed bottom-6 right-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#1976d2] text-white shadow-lg transition hover:bg-[#165fae]"
      aria-label="Create new note"
    >
      +
    </Link>
  );
}
