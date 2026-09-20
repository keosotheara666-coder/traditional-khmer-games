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
};

const isLogin = (mode) => mode === "login";

export default function AuthForm({ mode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

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
        setError("Invalid email or password");
        setBusy(false);
        return;
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError("Could not create account. Please try again.");
        setBusy(false);
        return;
      }
    }

    router.replace("/");
    router.refresh();
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
        </form>

        {error && <p role="alert" style={styles.error}>{error}</p>}

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