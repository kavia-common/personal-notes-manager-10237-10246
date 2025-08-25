import { Link, useSearchParams } from "@remix-run/react";

type Tag = { id: string; name: string; count?: number };

type Props = {
  tags: Tag[];
  activeTagId?: string | null;
  className?: string;
};

// PUBLIC_INTERFACE
export function Sidebar({ tags, activeTagId, className }: Props) {
  /** Sidebar listing tags and quick filters, updates query parameters to filter notes. */
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";

  return (
    <aside
      className={`h-full w-full max-w-[280px] border-r border-gray-200 p-4 dark:border-gray-800 ${className || ""}`}
    >
      <div className="mb-4">
        <h2 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Tags
        </h2>
        <nav className="flex flex-col gap-1">
          <Link
            to={`/?q=${encodeURIComponent(q)}`}
            className={`rounded px-2 py-1 text-sm transition hover:bg-gray-50 dark:hover:bg-gray-900 ${!activeTagId ? "bg-gray-100 dark:bg-gray-900" : ""}`}
          >
            All
          </Link>
          {tags.map((t) => (
            <Link
              key={t.id}
              to={`/?tag=${encodeURIComponent(t.id)}&q=${encodeURIComponent(q)}`}
              className={`flex items-center justify-between rounded px-2 py-1 text-sm transition hover:bg-gray-50 dark:hover:bg-gray-900 ${activeTagId === t.id ? "bg-gray-100 dark:bg-gray-900" : ""}`}
            >
              <span>#{t.name}</span>
              {typeof t.count === "number" && (
                <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  {t.count}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
        Tip: Use the search above to find notes quickly.
      </div>
    </aside>
  );
}
