import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData, useLocation, useNavigation, useSearchParams } from "@remix-run/react";
import { Sidebar } from "~/components/Sidebar";
import { FloatingActionButton } from "~/components/FAB";
import { listNotes, listTags, type Note as NoteType, type Tag as TagType } from "~/services/notes.server";
import { requireUser } from "~/utils/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  /** Dashboard loader: requires auth, returns tags and filtered notes for list view. */
  await requireUser(request);
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || undefined;
  const tag = url.searchParams.get("tag") || undefined;
  const [notes, tags] = await Promise.all([listNotes({ q, tag }), listTags()]);
  return json({ notes, tags, q: q || "", tag: tag || null });
}

export default function Index() {
  const { notes, tags, q, tag } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const submitting = navigation.state === "submitting";

  const selectedId = location.pathname.startsWith("/notes/") ? location.pathname.split("/notes/")[1] : null;

  return (
    <>
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="hidden shrink-0 md:block">
          <Sidebar
            tags={(tags as TagType[]).map((t) => ({ ...t }))}
            activeTagId={tag}
            className="min-w-[260px]"
          />
        </div>
        <section className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2 border-b border-gray-200 p-3 dark:border-gray-800">
            <Form method="get" className="flex w-full items-center gap-2">
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search notes..."
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-[#1976d2]/30 focus:border-[#1976d2] focus:ring-2 dark:border-gray-700 dark:bg-gray-900"
              />
              {searchParams.get("tag") && (
                <input type="hidden" name="tag" value={searchParams.get("tag") || ""} />
              )}
              <button
                type="submit"
                className="rounded-md bg-[#1976d2] px-3 py-2 text-sm text-white hover:bg-[#165fae]"
              >
                Search
              </button>
            </Form>
          </div>

          <div className="flex min-h-0 flex-1 overflow-hidden">
            <div className="w-full max-w-[380px] shrink-0 border-r border-gray-200 p-3 dark:border-gray-800">
              <div className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                {submitting ? "Loading..." : `${notes.length} note${notes.length === 1 ? "" : "s"}`}
              </div>
              <ul className="flex flex-col gap-2 overflow-auto pr-1">
                {(notes as NoteType[]).map((n) => (
                  <li key={n.id}>
                    <Link
                      to={`/notes/${n.id}`}
                      prefetch="intent"
                      className={`block rounded-md border p-3 transition hover:bg-gray-50 dark:hover:bg-gray-900 ${selectedId === n.id ? "border-[#1976d2]" : "border-gray-200 dark:border-gray-800"}`}
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <h4 className="truncate text-sm font-semibold">
                          {n.title || "Untitled"}
                        </h4>
                        {n.updatedAt && (
                          <time
                            className="ml-2 shrink-0 text-[10px] text-gray-500 dark:text-gray-400"
                            dateTime={n.updatedAt}
                            title={new Date(n.updatedAt).toLocaleString()}
                          >
                            {new Date(n.updatedAt).toLocaleDateString()}
                          </time>
                        )}
                      </div>
                      <p className="line-clamp-2 text-xs text-gray-600 dark:text-gray-300">
                        {n.content || "No content"}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {n.tags?.map((t) => (
                          <span
                            key={t.id}
                            className="rounded bg-[#ffb300]/15 px-1.5 py-0.5 text-[10px] text-[#ffb300]"
                          >
                            #{t.name}
                          </span>
                        ))}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="min-w-0 flex-1 overflow-auto p-4">
              {selectedId ? (
                <Outlet />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                  Select a note or create a new one.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
      <FloatingActionButton to="/notes/new" />
    </>
  );
}
