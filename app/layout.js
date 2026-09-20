import collection from "../collection.config.js";
import NavMenu from "../components/NavMenu.js";
import { createClient } from "../lib/supabase/server.js";

export const metadata = {
  title: `${collection.name} — Khmer Living Archive`,
  description: collection.description,
};

export default async function RootLayout({ children }) {
  let userEmail = null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userEmail = user?.email ?? null;
  } catch {
    // Supabase credentials not configured yet — treat everyone as logged out.
  }

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          backgroundColor: "#17120A",
          color: "#F2E9D8",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          minHeight: "100vh",
        }}
      >
        <NavMenu userEmail={userEmail} />
        {children}
      </body>
    </html>
  );
}
