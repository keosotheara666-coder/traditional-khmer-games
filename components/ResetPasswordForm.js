"use client";

import { useEffect, useState } from "react";
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
  message: {
    marginTop: 18,
    padding: "10px 14px",
    border: `1px solid ${GOLD}`,
    borderRadius: 8,
    color: GOLD_LIGHT,
    fontSize: 14,
    textAlign: "center",
  },
  hint: {
    color: MUTED,
    fontSize: 13,
    marginTop: 22,
    textAlign: "center",
  },
  link: {
    color: GOLD_LIGHT,
  },
};

export default function ResetPasswordForm() {
  // working | ready | saving | done | error
  const [status, setStatus] = useState("working");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    // Exchange the recovery token only in the browser, after the page loads.
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const tokenHash = params.get("token_hash");
      const type = params.get("type");

      if (!code && !tokenHash) {
        setError("This reset link is missing its token. Please request a new one.");
        setStatus("error");
        return;
      }

      const supabase = createClient();
      let result;
      try {
        result = code
          ? await supabase.auth.exchangeCodeForSession(code)
          : await supabase.auth.verifyOtp({
              token_hash: tokenHash,
              type: type || "recovery",
            });
        if (result.error) throw result.error;
        setStatus("ready");
      } catch (err) {
        console.log("RESET TOKEN EXCHANGE ERROR:", err);
        setError("This link is invalid or has expired. Please request a new one.");
        setStatus("error");
      }
    })();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setStatus("saving");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      console.log("UPDATE PASSWORD ERROR:", error);
      setError("We could not update your password. Please try again.");
      setStatus("ready");
      return;
    }
    setStatus("done");
  }

  return (
    <main style={styles.wrap}>
      <div style={styles.card}>
        <p style={styles.kicker}>
          KHMER LIVING ARCHIVE • បណ្ណសាររស់នៅខ្មែរ
        </p>
        <h1 style={styles.title}>Set a new password</h1>

        {status === "working" && (
          <p style={styles.message}>Verifying your reset link…</p>
        )}

        {status === "ready" && (
          <form onSubmit={handleSubmit}>
            <label style={styles.label} htmlFor="password">
              New password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />

            <label style={styles.label} htmlFor="confirm">
              Confirm new password
            </label>
            <input
              id="confirm"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              style={styles.input}
            />

            <button type="submit" disabled={status === "saving"} style={styles.button}>
              {status === "saving" ? "Saving…" : "Update password"}
            </button>
          </form>
        )}

        {error && <p role="alert" style={styles.message}>{error}</p>}

        {status === "done" && (
          <p role="status" style={styles.message}>
            Your password was updated. You can now sign in.
          </p>
        )}

        <p style={styles.hint}>
          <a style={styles.link} href="/login">
            Back to sign in
          </a>
        </p>
      </div>
    </main>
  );
}