"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client.js";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/traditional-games", label: "Traditional Khmer Games" },
];

const styles = {
  bar: {
    backgroundColor: "#17120A",
    borderBottom: "1px solid rgba(212,175,55,0.4)",
  },
  nav: {
    maxWidth: 840,
    margin: "0 auto",
    padding: "16px 24px",
    display: "flex",
    alignItems: "center",
    gap: 24,
  },
  brand: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    letterSpacing: 1,
    color: "#D4AF37",
  },
  link: {
    color: "#C9B98F",
    textDecoration: "none",
    fontSize: 14,
  },
  linkActive: {
    color: "#F2E9D8",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 600,
  },
  auth: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  userEmail: {
    color: "#F2E9D8",
    fontSize: 14,
  },
  logout: {
    background: "none",
    border: "1px solid #D4AF37",
    color: "#F5D061",
    borderRadius: 6,
    padding: "6px 12px",
    cursor: "pointer",
    fontSize: 13,
  },
};

export default function NavMenu({ userEmail }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <div style={styles.bar}>
      <nav style={styles.nav}>
        <span style={styles.brand}>KHMER LIVING ARCHIVE</span>
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <a
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              style={active ? styles.linkActive : styles.link}
            >
              {link.label}
            </a>
          );
        })}
        <div style={styles.auth}>
          {userEmail ? (
            <>
              <span style={styles.userEmail}>{userEmail}</span>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                style={styles.logout}
              >
                {loggingOut ? "Logging out…" : "Logout"}
              </button>
            </>
          ) : (
            <>
              <a href="/login" style={styles.link}>
                Login
              </a>
              <a href="/signup" style={styles.link}>
                Sign up
              </a>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}