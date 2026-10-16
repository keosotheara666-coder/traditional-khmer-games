// Shared field-validation rules for entries.
//
// Kept OUT of a "use server" file on purpose: Next.js only allows "use server"
// modules to export async functions (the object below would trip the
// `invalid-use-server-value` check). Both the create and edit actions import
// these, so creating and editing always agree on what makes an entry valid.
export const FIELD_RULES = {
  title: (v) => (v.length === 0 ? "Title is required." : null),
  description: (v) =>
    v.length === 0
      ? "Description is required."
      : v.length < 10
        ? "Description must be at least 10 characters."
        : null,
  place: (v) => (v.length === 0 ? "Place is required." : null),
};