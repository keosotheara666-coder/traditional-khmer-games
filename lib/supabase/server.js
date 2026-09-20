import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server-side Supabase client.
// Import this from Server Components, Server Actions, and Route Handlers.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // When the session is refreshed, the cookie store is updated here.
          // A try/catch keeps things from throwing during Server Component
          // rendering, where the cookie store is read-only. The middleware
          // helper handles cookie writes at the edge instead.
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component; the user remains logged in.
          }
        },
      },
    }
  );
}