import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { createNote, ensureTag, listTags } from "~/services/notes.server";

// PUBLIC_INTERFACE
export async function loader() {
  /** Loader for new note: requires auth and provides available tags. */
  // Auth requirement handled at parent index route; keeping here is optional
  const tags = await listTags();
  return json({ tags });
}

// PUBLIC_INTERFACE
export async function action({ request }: ActionFunctionArgs) {
  /** Creates a new note; accepts title, content, and comma-separated tags (by name). */
  const form = await request.formData();
  const title = String(form.get("title") || "");
  const content = String(form.get("content") || "");
  const raw = String(form.get("tags") || "").trim();

  let tagIds: string[] = [];
  if (raw) {
    const names = raw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const ensured = await Promise.all(names.map((name) => ensureTag(name)));
    tagIds = ensured.map((t) => t.id);
  }

  const note = await createNote({ title, content, tags: tagIds });
  return redirect(`/notes/${note.id}`);
}

export default function NewNotePage() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>() as { error?: string } | undefined;
  const busy = navigation.state === "submitting";

  return (
    <div className="mx-auto w-full max-w-3xl">
      <h2 className="mb-3 text-lg font-semibold">New note</h2>
      {actionData?.error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {actionData.error}
        </div>
      )}
      <Form method="post" className="flex flex-col gap-3">
        <label className="text-sm">
          Title
          <input
            name="title"
            placeholder="Title"
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-[#1976d2]/30 focus:border-[#1976d2] focus:ring-2 dark:border-gray-700 dark:bg-gray-900"
          />
        </label>
        <label className="text-sm">
          Content
          <textarea
            name="content"
            rows={12}
            placeholder="Write your note..."
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-[#1976d2]/30 focus:border-[#1976d2] focus:ring-2 dark:border-gray-700 dark:bg-gray-900"
          />
        </label>
        <label className="text-sm">
          Tags (comma separated)
          <input
            name="tags"
            placeholder="work, personal, ideas"
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-[#1976d2]/30 focus:border-[#1976d2] focus:ring-2 dark:border-gray-700 dark:bg-gray-900"
          />
        </label>
        <div className="mt-1 flex items-center gap-2">
          <button
            type="submit"
            disabled={busy}
            className="rounded-md bg-[#1976d2] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#165fae] disabled:opacity-70"
          >
            {busy ? "Creating..." : "Create"}
          </button>
        </div>
      </Form>
    </div>
  );
}
