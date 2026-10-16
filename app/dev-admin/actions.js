"use server";

import { createAdminClient, isLocalDev } from "../../lib/supabase/admin.js";

// Local-dev-only account tools. Every action refuses to run unless we are in
// the dev server AND a service-role key is present, so none of this can ever
// be reached from a deployed site.
function blocked(message) {
  return { error: message };
}

async function allowOnlyLocalDev() {
  if (!isLocalDev()) {
    return blocked("This tool only runs in the local dev server.");
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return blocked(
      "Add SUPABASE_SERVICE_ROLE_KEY to .env.local (Supabase → Project " +
        "Settings → API → service_role), then restart the dev server."
    );
  }
  return null;
}

// Resolve an email to a Supabase user (admin API) for the actions below.
async function findUserByEmail(email) {
  const supabase = createAdminClient();
  const { data, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (error) return { supabase, error };
  const user = (data?.users || []).find(
    (u) => (u.email || "").toLowerCase() === email
  );
  return { supabase, user };
}

// Mark an account's email as confirmed so it can sign in without needing the
// confirmation email Supabase sent.
export async function confirmUser({ email }) {
  const guard = await allowOnlyLocalDev();
  if (guard) return guard;

  const value = String(email ?? "").trim().toLowerCase();
  if (!value) return blocked("Enter the email of the account to confirm.");

  const { supabase, user, error } = await findUserByEmail(value);
  if (error) return blocked(error.message);
  if (!user) return blocked(`No account found for ${value}.`);

  const { error: updateError } = await supabase.auth.admin.updateUserById(
    user.id,
    { email_confirm: true }
  );
  if (updateError) return blocked(updateError.message);

  return { ok: `Confirmed ${user.email} — they can now sign in.` };
}

// Set a new password for an account directly, without a reset email.
export async function resetPassword({ email, password }) {
  const guard = await allowOnlyLocalDev();
  if (guard) return guard;

  const value = String(email ?? "").trim().toLowerCase();
  const next = String(password ?? "");
  if (!value) return blocked("Enter the email of the account to reset.");
  if (next.length < 6)
    return blocked("The new password must be at least 6 characters.");

  const { supabase, user, error } = await findUserByEmail(value);
  if (error) return blocked(error.message);
  if (!user) return blocked(`No account found for ${value}.`);

  const { error: updateError } = await supabase.auth.admin.updateUserById(
    user.id,
    { password: next }
  );
  if (updateError) return blocked(updateError.message);

  return { ok: `Password reset for ${user.email}. Sign in with the new one.` };
}