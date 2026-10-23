"use server";

import { createClient } from "../../lib/supabase/server.js";
// Reuse the exact same validation rules as the contribute form, so editing
// and creating an entry always agree on what is a valid entry.
import { FIELD_RULES } from "../../lib/validation.js";

// Edit and delete both call .select() afterwards and treat "no row came back"
// as a failed write. That happens, for example, when the row was already
// deleted or when the signed-in user is not its owner — PostgREST simply
// matches zero rows and the update/delete never applies.
export async function updateEntry({ id, title, description, place, photoUrl }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: "You are not signed in. Please log in and try again." };
    }

    // Trim every text field before validating or writing.
    const trimmed = {
      title: String(title ?? "").trim(),
      description: String(description ?? "").trim(),
      place: String(place ?? "").trim(),
    };

    for (const [field, check] of Object.entries(FIELD_RULES)) {
      const message = check(trimmed[field]);
      if (message) return { error: message };
    }

    // Only send a new photo when one was actually chosen; otherwise the old
    // photo is left untouched on the row.
    const patch = {
      title: trimmed.title,
      description: trimmed.description,
      place: trimmed.place,
    };
    if (photoUrl) patch.photo = photoUrl;

    // An owner's edit sends the entry back to "pending" so it goes through
    // review again — unless the caller is a reviewer, who edits without
    // re-queuing. The form never sends a status; it is decided here,
    // server-side. If the RPC call fails we treat the caller as a
    // non-reviewer, which only means the entry returns to the queue.
    const { data: isReviewer } = await supabase.rpc("is_reviewer");
    if (isReviewer !== true) patch.status = "pending";

    // .eq("owner", user.id) scopes the update to the caller's own entry, so a
    // user can never edit someone else's row even if they know its id.
    const { data, error } = await supabase
      .from("entries")
      .update(patch)
      .eq("id", id)
      .eq("owner", user.id)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("updateEntry: update failed", error);
      return { error: "We could not save your changes. Please try again." };
    }
    if (!data) {
      console.error("updateEntry: no row returned after update", { id });
      return { error: "That change wasn't saved" };
    }

    return { id: data.id };
  } catch (err) {
    console.error("updateEntry: unexpected error", err);
    return { error: "That change wasn't saved" };
  }
}

export async function deleteEntry(id) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: "You are not signed in. Please log in and try again." };
    }

    // Same owner-scoping: a deletion only applies to the caller's own row.
    const { data, error } = await supabase
      .from("entries")
      .delete()
      .eq("id", id)
      .eq("owner", user.id)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("deleteEntry: delete failed", error);
      return { error: "We could not delete this entry. Please try again." };
    }
    if (!data) {
      console.error("deleteEntry: no row returned after delete", { id });
      return { error: "That change wasn't saved" };
    }

    return { id: data.id };
  } catch (err) {
    console.error("deleteEntry: unexpected error", err);
    return { error: "That change wasn't saved" };
  }
}