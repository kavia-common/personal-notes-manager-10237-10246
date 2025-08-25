import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { deleteNote, ensureTag, getNote, updateNote, type Note as NoteType } from "~/services/notes.server";
import { requireUser } from "~/utils/auth.server";

// PUBLIC_INTERFACE
export async function loader({ params, request }: LoaderFunctionArgs) {
  /** Loads a single note for viewing/editing; requires auth. */
  await requireUser(request);
  const id = params.id!;
  const note = await getNote(id);
  return json({ note });
}

// PUBLIC_INTERFACE
export async function action({ params, request }: ActionFunctionArgs) {
  /** Handles note updates and deletions. _method=DELETE to delete, else update. */
  await requireUser(request);
  const id = params.id!;
  const form = await request.formData();
  const method = String(form.get("_method") || "PUT");

  if (method.toUpperCase() === "DELETE") {
    await deleteNote(id);
    return redirect("/");
  }

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

  const updated = await updateNote(id, { title, content, tags: tagIds });
  return json({ note: updated, success: true });
}

export default function NoteDetailsPage() {
  const { note } = useLoaderData<typeof loader>() as { note: NoteType };
  const actionData = useActionData<typeof action>() as { error?: string; success?: boolean } | undefined;
  const navigation = useNavigation();
  const busy = navigation.state === "submitting";

  const tagsAsNames = (note.tags || []).map((t) => t.name).join(", ");

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Edit note</h2>
        <Form
          method="post"
          onSubmit={(e) => {
            if (!confirm("Delete this note?")) e.preventDefault();
          }}
        >
          <input type="hidden" name="_method" value="DELETE" />
          <button
            type="submit"
            className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950"
          >
            Delete
          </button>
        </Form>
      </div>
      {actionData?.error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {actionData.error}
        </div>
      )}
      {actionData?.success && (
        <div className="mb-4 rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
          Saved!
        </div>
      )}
      <Form method="post" className="flex flex-col gap-3">
        <label className="text-sm">
          Title
          <input
            name="title"
            defaultValue={note.title}
            placeholder="Title"
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-[#1976d2]/30 focus:border-[#1976d2] focus:ring-2 dark:border-gray-700 dark:bg-gray-900"
          />
        </label>
        <label className="text-sm">
          Content
          <textarea
            name="content"
            rows={12}
            defaultValue={note.content}
            placeholder="Write your note..."
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-[#1976d2]/30 focus:border-[#1976d2] focus:ring-2 dark:border-gray-700 dark:bg-gray-900"
          />
        </label>
        <label className="text-sm">
          Tags (comma separated)
          <input
            name="tags"
            defaultValue={tagsAsNames}
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
            {busy ? "Saving..." : "Save"}
          </button>
        </div>
      </Form>
    </div>
  );
}
