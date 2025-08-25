import { apiFetch } from "~/utils/api";

export type Tag = { id: string; name: string };
export type Note = {
  id: string;
  title: string;
  content: string;
  tags: Tag[];
  updatedAt?: string;
  createdAt?: string;
};

const NOTES_PATH = "/notes";
const TAGS_PATH = "/tags";

// PUBLIC_INTERFACE
export async function listNotes(params: { q?: string; tag?: string } = {}) {
  /** Fetch list of notes filtered by optional search query and tag id. */
  return (await apiFetch(NOTES_PATH, {
    method: "GET",
    searchParams: { q: params.q || "", tag: params.tag || "" },
  })) as Note[];
}

// PUBLIC_INTERFACE
export async function getNote(id: string) {
  /** Retrieve single note by id. */
  return (await apiFetch(`${NOTES_PATH}/${id}`, { method: "GET" })) as Note;
}

// PUBLIC_INTERFACE
export async function createNote(payload: { title: string; content: string; tags: string[] }) {
  /** Create a new note with title, content, and tags (tag IDs or names depending on backend). */
  return (await apiFetch(NOTES_PATH, {
    method: "POST",
    body: JSON.stringify(payload),
  })) as Note;
}

// PUBLIC_INTERFACE
export async function updateNote(
  id: string,
  payload: { title?: string; content?: string; tags?: string[] }
) {
  /** Update an existing note. */
  return (await apiFetch(`${NOTES_PATH}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  })) as Note;
}

// PUBLIC_INTERFACE
export async function deleteNote(id: string) {
  /** Delete an existing note. */
  await apiFetch(`${NOTES_PATH}/${id}`, { method: "DELETE" });
  return { success: true };
}

// PUBLIC_INTERFACE
export async function listTags() {
  /** Fetch all tags. */
  return (await apiFetch(TAGS_PATH, { method: "GET" })) as Tag[];
}

// PUBLIC_INTERFACE
export async function ensureTag(name: string) {
  /** Create a tag if not exists, returns tag. Backend should idempotently ensure. */
  return (await apiFetch(TAGS_PATH, {
    method: "POST",
    body: JSON.stringify({ name }),
  })) as Tag;
}
