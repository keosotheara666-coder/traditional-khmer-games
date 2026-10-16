"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client.js";

const GOLD = "#D4AF37";
const GOLD_LIGHT = "#F5D061";
const BRASS = "#B8860B";
const CREAM = "#F2E9D8";
const MUTED = "#C9B98F";

const styles = {
  wrap: {
    maxWidth: 820,
    margin: "0 auto",
    padding: "70px 24px",
  },
  card: {
    maxWidth: 420,
    margin: "0 auto",
    padding: "40px 32px",
    background: "linear-gradient(180deg, #241C0E 0%, #1A1409 100%)",
    border: `1px solid ${GOLD}`,
    borderRadius: 18,
    boxShadow: "0 0 0 6px rgba(212,175,55,0.14), 0 22px 60px rgba(0,0,0,0.55)",
  },
  kicker: {
    fontFamily: "'Courier New', monospace",
    color: GOLD_LIGHT,
    fontSize: 13,
    letterSpacing: 2,
    margin: 0,
    textAlign: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
    margin: "14px 0 26px",
    color: CREAM,
    textAlign: "center",
  },
  label: {
    display: "block",
    fontSize: 13,
    color: MUTED,
    margin: "16px 0 6px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    borderRadius: 8,
    border: `1px solid ${GOLD}`,
    background: "#17120A",
    color: CREAM,
    fontSize: 15,
  },
  button: {
    width: "100%",
    marginTop: 24,
    padding: 13,
    borderRadius: 8,
    border: "none",
    background: `linear-gradient(90deg, ${GOLD}, ${BRASS})`,
    color: "#17120A",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
  },
  error: {
    marginTop: 18,
    padding: "10px 14px",
    border: `1px solid ${GOLD}`,
    borderRadius: 8,
    color: GOLD_LIGHT,
    fontSize: 14,
    textAlign: "center",
  },
  footer: {
    marginTop: 22,
    fontSize: 13,
    textAlign: "center",
    color: MUTED,
  },
  link: {
    color: GOLD_LIGHT,
  },
  forgotLink: {
    display: "block",
    marginTop: 10,
    textAlign: "right",
    background: "none",
    border: "none",
    color: GOLD_LIGHT,
    fontSize: 12,
    textDecoration: "underline",
    cursor: "pointer",
  },
  infoMessage: {
    marginTop: 18,
    padding: "10px 14px",
    border: `1px solid ${GOLD}`,
    borderRadius: 8,
    color: CREAM,
    fontSize: 14,
    textAlign: "center",
  },
};

const isLogin = (mode) => mode === "login";

// Supabase Auth rate-limits sign-in / signup / reset attempts per IP and per
// account. The 429 errors carry a "rate limit" style message. Rather than echo
// the raw text (which reads like a server bug), show the user what to do and,
// crucially, that retrying now will keep the limit active.
const isRateLimit = (error) =>
  error?.status === 429 || /rate\s*limit|too many requests/i.test(error?.message || "");
const describeError = (error) =>
  isRateLimit(error)
    ? "Too many attempts from this device. Wait a bit before trying again — " +
        "each retry renews the cool-down, so give it a few minutes."
    : error.message;

// Canonical base URL for the links Supabase emails us (recovery AND signup
// confirmation). NEXT_PUBLIC_SITE_URL (set in Vercel) overrides so the emailed
// links always point at the live site; otherwise fall back to wherever the
// request started, so local development keeps working.
const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

export default function AuthForm({ mode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const supabase = createClient();

    if (isLogin(mode)) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.log("LOGIN ERROR:", error);
        setError(describeError(error));
        setBusy(false);
        return;
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Point the confirmation email back at our site. Without this,
          // Supabase uses its dashboard "Site URL", which is often left as
          // localhost — new users never confirm and can't sign in.
          emailRedirectTo: `${siteUrl()}/login`,
        },
      });
      if (error) {
        console.log("SIGNUP ERROR:", error);
        setError(describeError(error));
        setBusy(false);
        return;
      }
      // With email confirmation on (Supabase's default), signUp creates the user
      // and emails a confirmation link but does not open a session. Catch that so
      // we don't redirect the user into a signed-out state that looks like a
      // failed signup.
      if (!data.session) {
        setError(
          "Account created — check your email to confirm it, then sign in. " +
            "You may need to check spam."
        );
        setBusy(false);
        return;
      }
    }

    // After a successful login, return to the page the user was heading to
    // (e.g. /contribute links to /login?next=/contribute). Default back home.
    // Read at submit time from the address bar rather than a Suspense-bound
    // hook, so the /login and /signup pages can still pre-render statically.
    const destination =
      isLogin(mode)
        ? new URLSearchParams(window.location.search).get("next") || "/"
        : "/";

    router.replace(destination);
    router.refresh();
  }

  // Forgot-password: ask Supabase to email a recovery link. Shown only on the
  // login form. We always show the same confirmation regardless of whether the
  // address is registered, so the page does not leak which emails exist.
  async function handleForgotPassword() {
    if (busy || resetSent) return;
    setError("");
    if (!email.trim()) {
      setError("Enter your email address above to request a reset link.");
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${siteUrl()}/reset-password`,
    });
    if (error) {
      console.log("PASSWORD RESET REQUEST ERROR:", error);
    }
    setResetSent(true);
  }

  return (
    <main style={styles.wrap}>
      <div style={styles.card}>
        <p style={styles.kicker}>
          KHMER LIVING ARCHIVE • បណ្ណសាររស់នៅខ្មែរ
        </p>
        <h1 style={styles.title}>
          {isLogin(mode) ? "Sign in" : "Create an account"}
        </h1>

        <form onSubmit={handleSubmit}>
          <label style={styles.label} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <label style={styles.label} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            autoComplete={isLogin(mode) ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <button type="submit" disabled={busy} style={styles.button}>
            {isLogin(mode) ? "Sign in" : "Sign up"}
          </button>

          {isLogin(mode) && (
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={busy || resetSent}
              style={styles.forgotLink}
            >
              Forgot password?
            </button>
          )}
        </form>

        {error && <p role="alert" style={styles.error}>{error}</p>}

        {resetSent && isLogin(mode) && (
          <p role="status" style={styles.infoMessage}>
            If an account exists for {email.trim()}, we've emailed a reset link.
            Open it, choose a new password, then come back and sign in.
          </p>
        )}

        <p style={styles.footer}>
          {isLogin(mode) ? (
            <>
              New here?{" "}
              <a style={styles.link} href="/signup">
                Create an account
              </a>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <a style={styles.link} href="/login">
                Sign in
              </a>
            </>
          )}
        </p>
      </div>
    </main>
  );
}