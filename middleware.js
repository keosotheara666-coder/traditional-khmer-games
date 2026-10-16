import { updateSession } from "./lib/supabase/middleware.js";

// Root middleware: on every eligible request it runs the shared Supabase
// helper that keeps the session cookie in sync, so the access token is
// refreshed before it expires. The matcher skips static assets so we do not
// pay for session work on images, fonts, or the Next favicon.
export async function middleware(request) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};