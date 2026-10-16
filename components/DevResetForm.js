"use client";

import { useState } from "react";
import { resetPassword } from "../app/dev-admin/actions.js";

const GOLD = "#D4AF37";
const GOLD_LIGHT = "#F5D061";
const CREAM = "#F2E9D8";
const MUTED = "#C9B98F";

const styles = {
  card: {
    maxWidth: 420,
    margin: "24px auto 0",
    padding: "28px 26px",
    background: "linear-gradient(180deg, #241C0E 0%, #1A1409 100%)",
    border: `1px solid ${GOLD}`,
    borderRadius: 18,
  },
  title: {
    fontSize: 17,
    fontWeight: 700,
    margin: 0,
    color: CREAM,
  },
  hint: {
    color: MUTED,
    fontSize: 13,
    margin: "6px 0",
  },
  label: {
    display: "block",
    fontSize: 13,
    color: MUTED,
    margin: "14px 0 6px",
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
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    border: "none",
    background: `linear-gradient(90deg, ${GOLD}, #B8860B)`,
    color: "#17120A",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },
  message: {
    marginTop: 14,
    padding: "10px 14px",
    border: `1px solid ${GOLD}`,
    borderRadius: 8,
    fontSize: 14,
    textAlign: "center",
  },
};

export default function DevResetForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null); // { ok } | { error }

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setResult(null);
    const res = await resetPassword({ email: email.trim(), password });
    setResult(res);
    setBusy(false);
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Reset a user’s password</h2>
      <p style={styles.hint}>
        Sets a fresh password for an account directly, without a reset email.
      </p>

      <form onSubmit={handleSubmit}>
        <label style={styles.label} htmlFor="dev-reset-email">
          Email
        </label>
        <input
          id="dev-reset-email"
          type="email"
          autoComplete="off"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <label style={styles.label} htmlFor="dev-reset-password">
          New password
        </label>
        <input
          id="dev-reset-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" disabled={busy} style={styles.button}>
          {busy ? "Resetting…" : "Reset password"}
        </button>
      </form>

      {result && (
        <p
          role={result.error ? "alert" : "status"}
          style={{
            ...styles.message,
            color: result.error ? GOLD_LIGHT : CREAM,
          }}
        >
          {result.error || result.ok}
        </p>
      )}
    </div>
  );
}