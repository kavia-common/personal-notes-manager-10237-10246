import { Link } from "@remix-run/react";

export type Note = {
  id: string;
  title: string;
  content: string;
  tags: { id: string; name: string }[];
  updatedAt?: string;
};

type Props = {
  note: Note;
  active?: boolean;
};

// PUBLIC_INTERFACE
export function NoteCard({ note, active }: Props) {
  /** Card used in the list to show a note preview and link to details. */
  return (
    <Link
      prefetch="intent"
      to={`/notes/${note.id}`}
      className={`block rounded-md border p-3 transition hover:bg-gray-50 dark:hover:bg-gray-900 ${active ? "border-[#1976d2]" : "border-gray-200 dark:border-gray-800"}`}
    >
      <div className="mb-1 flex items-center justify-between">
        <h4 className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
          {note.title || "Untitled"}
        </h4>
        {note.updatedAt && (
          <time
            className="ml-2 shrink-0 text-[10px] text-gray-500 dark:text-gray-400"
            dateTime={note.updatedAt}
            title={new Date(note.updatedAt).toLocaleString()}
          >
            {new Date(note.updatedAt).toLocaleDateString()}
          </time>
        )}
      </div>
      <p className="line-clamp-2 text-xs text-gray-600 dark:text-gray-300">
        {note.content || "No content"}
      </p>
      <div className="mt-2 flex flex-wrap gap-1">
        {note.tags?.map((t) => (
          <span
            key={t.id}
            className="rounded bg-[#ffb300]/15 px-1.5 py-0.5 text-[10px] text-[#ffb300]"
          >
            #{t.name}
          </span>
        ))}
      </div>
    </Link>
  );
}
