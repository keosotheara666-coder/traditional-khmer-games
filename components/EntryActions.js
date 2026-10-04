"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteEntry } from "../app/entries/actions.js";

const GOLD = "#D4AF37";

// Rendered only on an entry owned by the signed-in user. Shows an Edit link
// and a Delete button. Delete asks for confirmation before calling the server
// action, so an accidental click can never remove an entry.
const styles = {
  bar: {
    marginTop: 24,
    display: "flex",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
  },
  edit: {
    padding: "10px 20px",
    borderRadius: 8,
    border: `1px solid ${GOLD}`,
    background: "transparent",
    color: "#F5D061",
    textDecoration: "none",
    fontSize: 14,
    cursor: "pointer",
  },
  delete: {
    padding: "10px 20px",
    borderRadius: 8,
    border: "1px solid #E0805A",
    background: "transparent",
    color: "#E0805A",
    fontSize: 14,
    cursor: "pointer",
  },
  confirm: {
    padding: "14px 18px",
    borderRadius: 8,
    border: `1px solid ${GOLD}`,
    backgroundColor: "#17120A",
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  confirmText: {
    margin: 0,
    color: "#C9B98F",
    fontSize: 14,
  },
  confirmDelete: {
    padding: "9px 16px",
    borderRadius: 8,
    border: "none",
    background: "#E0805A",
    color: "#17120A",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  cancel: {
    padding: "9px 16px",
    borderRadius: 8,
    border: `1px solid ${GOLD}`,
    background: "transparent",
    color: "#F5D061",
    fontSize: 14,
    cursor: "pointer",
  },
  message: {
    color: "#E0805A",
    fontSize: 14,
    margin: 0,
  },
};

export default function EntryActions({ entryId }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function handleDelete() {
    if (busy) return;
    setBusy(true);
    setMessage("");
    const result = await deleteEntry(entryId);
    if (result.error) {
      setBusy(false);
      setMessage(result.error);
      return;
    }
    // The entry is gone; head back to the archive.
    router.push("/");
    router.refresh();
  }

  return (
    <div style={styles.bar}>
      <a href={`/entries/${entryId}/edit`} style={styles.edit}>
        Edit
      </a>

      {confirming ? (
        <div style={styles.confirm} role="alert">
          <p style={styles.confirmText}>
            Delete this entry? This cannot be undone.
          </p>
          <button
            type="button"
            onClick={handleDelete}
            disabled={busy}
            style={styles.confirmDelete}
          >
            {busy ? "Deleting…" : "Yes, delete"}
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            disabled={busy}
            style={styles.cancel}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          style={styles.delete}
        >
          Delete
        </button>
      )}

      {message && <p style={styles.message} role="alert">{message}</p>}
    </div>
  );
}