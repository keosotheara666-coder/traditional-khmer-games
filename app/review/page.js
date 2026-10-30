import collection from "../../collection.config.js";
import { createClient } from "../../lib/supabase/server.js";
import ReviewEntryCard from "../../components/ReviewEntryCard.js";

const GOLD = "#D4AF37";
const GOLD_LIGHT = "#F5D061";
const CREAM = "#F2E9D8";
const MUTED = "#C9B98F";

// [Your answer to Q5] — the only thing a non-reviewer ever sees on /review.
const NOT_REVIEWER_MESSAGE =
  "Only reviewers can open the review queue. If you are a reviewer, sign in " +
  "with your reviewer account and try again.";

// [Your answer to Q4] — shown when the pending queue is empty.
const EMPTY_MESSAGE =
  "There are no entries waiting for review right now. New contributions " +
  "appear here as they are submitted.";

const styles = {
  wrap: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "60px 24px 80px",
  },
  card: {
    maxWidth: 480,
    margin: "0 auto",
    padding: "40px 32px",
    background: "linear-gradient(180deg, #241C0E 0%, #1A1409 100%)",
    border: `1px solid ${GOLD}`,
    borderRadius: 18,
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
    fontSize: 28,
    fontWeight: 700,
    margin: "14px 0 6px",
    color: CREAM,
    textAlign: "center",
  },
  subtitle: {
    color: MUTED,
    fontSize: 15,
    lineHeight: 1.6,
    textAlign: "center",
    margin: 0,
  },
  text: {
    color: MUTED,
    fontSize: 16,
    lineHeight: 1.6,
    textAlign: "center",
    margin: 0,
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: "36px 0 0",
    display: "grid",
    gap: 16,
  },
};

export const metadata = {
  title: `Review — ${collection.name}`,
};

// Reviewers only. The page asks is_reviewer() first and renders nothing but
// NOT_REVIEWER_MESSAGE for everyone else. Reviewers then get every pending
// entry, oldest first. Row-level security still decides who can see what;
// this page does not relax it.
export default async function ReviewPage() {
  let supabase = null;
  try {
    supabase = await createClient();
  } catch {
    // Supabase credentials not configured yet — treated as not a reviewer.
  }

  let isReviewer = false;
  if (supabase) {
    try {
      const { data } = await supabase.rpc("is_reviewer");
      isReviewer = data === true;
    } catch {
      // RPC unavailable (e.g. not signed in) — treated as not a reviewer.
    }
  }

  if (!isReviewer) {
    return (
      <main style={styles.wrap}>
        <div style={styles.card}>
          <p style={styles.kicker}>
            KHMER LIVING ARCHIVE • បណ្ណសាររស់នៅខ្មែរ
          </p>
          <h1 style={styles.title}>Review entries</h1>
          <p style={styles.text}>{NOT_REVIEWER_MESSAGE}</p>
        </div>
      </main>
    );
  }

  let entries = [];
  if (supabase) {
    try {
      const { data } = await supabase
        .from("entries")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: true });
      entries = data ?? [];
    } catch {
      // Query failed — render the empty state below.
    }
  }

  return (
    <main style={styles.wrap}>
      <header>
        <p style={styles.kicker}>
          KHMER LIVING ARCHIVE • បណ្ណសាររស់នៅខ្មែរ
        </p>
        <h1 style={styles.title}>Review entries</h1>
        <p style={styles.subtitle}>
          កំពុងរង់ចាំ — entries waiting for review
        </p>
      </header>

      {entries.length === 0 ? (
        <div style={styles.card}>
          <p style={styles.text}>{EMPTY_MESSAGE}</p>
        </div>
      ) : (
        <ul style={styles.list}>
          {entries.map((entry) => (
            <ReviewEntryCard key={entry.id} entry={entry} />
          ))}
        </ul>
      )}
    </main>
  );
}