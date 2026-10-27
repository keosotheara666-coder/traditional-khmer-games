"use server";

import { createClient } from "../../lib/supabase/server.js";
// Server-side copy of the form rules (defence in depth — never trust the
// browser). Live in lib/validation.js — a "use server" file may only export
// async functions, and this object wouldn't be allowed to stay here.
import { FIELD_RULES } from "../../lib/validation.js";

export async function createEntry({ title, meaning, description, place, region, photoUrl }) {
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
      meaning: String(meaning ?? "").trim(),
      description: String(description ?? "").trim(),
      place: String(place ?? "").trim(),
      region: String(region ?? "").trim(),
    };

    for (const [field, check] of Object.entries(FIELD_RULES)) {
      const message = check(trimmed[field]);
      if (message) return { error: message };
    }

    // The entries table enforces entries_photo_required — a CHECK that the
    // photo_url column is a non-empty string. The browser form demands one
    // too, but that check is not enforced server-side unless we do it here,
    // so a call that skips the form (or whose upload never completed) fails
    // with a clear message instead of a raw constraint error.
    const photoValue = String(photoUrl ?? "").trim();
    if (!photoValue) {
      return {
        error:
          "Debug — a photo is required: the entries table rejects entries " +
          "without one (check constraint entries_photo_required).",
      };
    }

    // Insert only the columns a contributor fills in (plus owner + photo).
    // photo_url is the column the entries_photo_required CHECK protects (the
    // constraint's name is misleading — it guards the image URL column); we
    // mirror the URL into photo for the UI, which reads entry.photo.
    const { data, error } = await supabase
      .from("entries")
      .insert({
        title: trimmed.title,
        meaning: trimmed.meaning,
        description: trimmed.description,
        place: trimmed.place,
        region: trimmed.region,
        photo: photoValue,
        photo_url: photoValue,
        owner: user.id,
      })
      .select("id")
      .single();

    if (error) {
      // Debug-only: surface the real database error so the insert can be
      // diagnosed, and include the exact photo value that was sent so we can
      // see whether the upload ran and what shape the constraint expects.
      // Replace with a friendly message before shipping.
      console.error("createEntry: insert failed", { error, photoValue });
      const detail = error.message + (error.code ? ` (code: ${error.code})` : "");
      const photoPreview =
        photoValue.length > 80
          ? `${photoValue.slice(0, 80)}… (length ${photoValue.length})`
          : `"${photoValue}"`;
      return {
        error: `Debug — insert failed: ${detail}. Photo sent: ${photoPreview}`,
      };
    }

    return { id: data.id };
  } catch (err) {
    // Debug-only: surface the real error so the failure can be diagnosed.
    // Replace with a friendly message before shipping.
    console.error("createEntry: unexpected error", err);
    const detail =
      err && typeof err.message === "string" ? err.message : String(err);
    return { error: `Debug — unexpected error: ${detail}` };
  }
}