import { createClient } from "@supabase/supabase-js";

// --- Local-dev admin client ------------------------------------------------
// The dev admin tool (app/dev-admin) resets passwords and marks emails as
// confirmed directly through Supabase's admin API, so you can test contributor
// accounts without depending on confirmation / reset emails (which correctly
// point at localhost while you're developing).
//
// This is wrapped in two safety rails:
//   - isLocalDev() is checked by every server action before it does anything,
//     so this can never run under `next build` / `next start`.
//   - The service-role key lives only in .env.local (git-ignored) and is never
//     added to Vercel env, so a deployed build has no key to act on anyway.
export const isLocalDev = () => process.env.NODE_ENV === "development";

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    // Service-role calls are server-side; they don't use (and must not keep)
    // a user session cookie.
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}