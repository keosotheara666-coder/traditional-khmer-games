"use server";

import { createClient } from "../../lib/supabase/server.js";
// Server-side copy of the form rules (defence in depth — never trust the
// browser). Live in lib/validation.js — a "use server" file may only export
// async functions, and this object wouldn't be allowed to stay here.
import { FIELD_RULES } from "../../lib/validation.js";

export async function createEntry({ title, description, place, photoUrl }) {
  // Owner always comes from the signed-in session, never from the form.
  // The form does not send an owner field at all.
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return {
        error: "You are not signed in. Please log in and try again.",
      };
    }

    // Trim every text field before validating or inserting.
    const trimmed = {
      title: String(title ?? "").trim(),
      description: String(description ?? "").trim(),
      place: String(place ?? "").trim(),
    };

    for (const [field, check] of Object.entries(FIELD_RULES)) {
      const message = check(trimmed[field]);
      if (message) return { error: message };
    }

    // Insert only the columns a contributor fills in (plus owner + photo).
    const { data, error } = await supabase
      .from("entries")
      .insert({
        title: trimmed.title,
        description: trimmed.description,
        place: trimmed.place,
        photo: photoUrl,
        owner: user.id,
      })
      .select("id")
      .single();

    if (error) {
      console.error("createEntry: insert failed", error);
      return { error: "We could not save your entry. Please try again." };
    }

    return { id: data.id };
  } catch (err) {
    console.error("createEntry: unexpected error", err);
    return { error: "We could not save your entry. Please try again." };
  }
}