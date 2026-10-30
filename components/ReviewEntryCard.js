"use client";

import { useState } from "react";
import { createClient } from "../lib/supabase/client.js";

const GOLD = "#D4AF37";
const CREAM = "#F2E9D8";
const MUTED = "#C9B98F";

// [Your Publish label] / [Your Return label].
const PUBLISH_LABEL = "Publish";
const RETURN_LABEL = "Return";

// [Your answer to Q3] — shown when review_entry returns false or errors. The
// RPC only answers true/false, so the message names the likely causes and the
// fix instead of pretending we have a database error to repeat.
const FAILURE_MESSAGE =
  "That review didn't go through — this entry may already have been reviewed " +
  "or your session may have expired. Refresh the page to see the entry's " +
  "current status; if it is still pending, try the review again.";

const styles = {
  item: {
    padding: "24px 26px",
    background: "linear-gradient(180deg, #241C0E 0%, #1A1409 100%)",
    border: "1px solid rgba(212,175,55,0.35)",
    borderRadius: 18,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 10,
  },
  photo: {
    width: "100%",
    maxHeight: 200,
    objectFit: "cover",
    borderRadius: 10,
    display: "block",
    border: "1px solid rgba(212,175,55,0.3)",
  },
  title: {
    margin: 0,
    fontSize: 20,
    color: CREAM,
  },
  label: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    letterSpacing: 1,
    color: GOLD,
    textTransform: "uppercase",
    margin: 0,
  },
  text: {
    fontSize: 15,
    lineHeight: 1.6,
    color: MUTED,
    margin: 0,
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  publish: {
    padding: "10px 20px",
    borderRadius: 8,
    border: "1px solid #7FD1A8",
    background: "#7FD1A8",
    color: "#17120A",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  returned: {
    padding: "10px 20px",
    borderRadius: 8,
    border: "1px solid #E0805A",
    background: "transparent",
    color: "#E0805A",
    fontSize: 14,
    cursor: "pointer",
  },
  failed: {
    color: "#E0805A",
    fontSize: 14,
    lineHeight: 1.5,
    margin: 0,
  },
};

// One pending entry in the review queue. Publish/Return both call the
// review_entry RPC (never a direct update of the entries table). A true
// response removes the card from the queue (this component renders nothing);
// a false response or an error keeps the card in place and shows
// FAILURE_MESSAGE.
export default function ReviewEntryCard({ entry }) {
  // idle → working (a decision is in flight) → done (removed from the queue)
  const [status, setStatus] = useState("idle");
  const [workingDecision, setWorkingDecision] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function decide(decision) {
    if (status === "working") return;
    setStatus("working");
    setWorkingDecision(decision);
    setErrorMessage("");

    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("review_entry", {
        entry_id: entry.id,
        decision,
      });
      if (error) {
        console.error("review_entry returned an error", error);
        setErrorMessage(FAILURE_MESSAGE);
        setStatus("idle");
        return;
      }
      if (data !== true) {
        console.error("review_entry returned false", {
          entryId: entry.id,
          decision,
        });
        setErrorMessage(FAILURE_MESSAGE);
        setStatus("idle");
        return;
      }
      setStatus("done");
    } catch (err) {
      console.error("review_entry threw", err);
      setErrorMessage(FAILURE_MESSAGE);
      setStatus("idle");
    }
  }

  if (status === "done") return null;

  return (
    <li style={styles.item}>
      {entry.photo && (
        <img style={styles.photo} src={entry.photo} alt={entry.title} />
      )}

      <h2 style={styles.title}>{entry.title}</h2>

      <p style={styles.label}>Meaning</p>
      <p style={styles.text}>{entry.meaning}</p>

      <p style={styles.label}>Description</p>
      <p style={styles.text}>{entry.description}</p>

      <p style={styles.label}>Place</p>
      <p style={styles.text}>{entry.place}</p>

      {entry.region && (
        <>
          <p style={styles.label}>Region</p>
          <p style={styles.text}>{entry.region}</p>
        </>
      )}

      <div style={styles.actions}>
        <button
          type="button"
          onClick={() => decide("published")}
          disabled={status === "working"}
          style={styles.publish}
        >
          {status === "working" && workingDecision === "published"
            ? "Publishing…"
            : PUBLISH_LABEL}
        </button>
        <button
          type="button"
          onClick={() => decide("returned")}
          disabled={status === "working"}
          style={styles.returned}
        >
          {status === "working" && workingDecision === "returned"
            ? "Returning…"
            : RETURN_LABEL}
        </button>
      </div>

      {errorMessage && (
        <p role="alert" style={styles.failed}>
          {errorMessage}
        </p>
      )}
    </li>
  );
}