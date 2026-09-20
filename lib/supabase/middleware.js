import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

// Edge middleware helper that keeps the session cookie in sync on requests.
// It returns a supabaseResponse that a root middleware.js would return.
export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run any code between createServerClient and supabase.auth.getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return supabaseResponse;
}