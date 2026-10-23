import collection from "../../collection.config.js";
import { createClient } from "../../lib/supabase/server.js";
import EntryStatus from "../../components/EntryStatus.js";

const GOLD = "#D4AF37";
const GOLD_LIGHT = "#F5D061";
const BRASS = "#B8860B";
const CREAM = "#F2E9D8";
const MUTED = "#C9B98F";

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
    textAlign: "center",
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
  link: {
    display: "block",
    marginTop: 20,
    color: GOLD_LIGHT,
    textAlign: "center",
    textDecoration: "none",
    fontSize: 15,
    fontWeight: 600,
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: "36px 0 0",
    display: "grid",
    gap: 16,
  },
  item: {
    padding: "24px 26px",
    background: "linear-gradient(180deg, #241C0E 0%, #1A1409 100%)",
    border: `1px solid rgba(212,175,55,0.35)`,
    borderRadius: 18,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 10,
  },
  itemTitle: {
    margin: 0,
    fontSize: 20,
  },
  itemLink: {
    color: CREAM,
    textDecoration: "none",
    fontWeight: 700,
  },
  place: {
    color: MUTED,
    fontSize: 14,
    margin: 0,
  },
  edit: {
    color: GOLD,
    fontSize: 14,
    textDecoration: "none",
  },
};

export const metadata = {
  title: `My entries — ${collection.name}`,
};

// Logged-in users only. This server page lists the signed-in user's own entries
// — filtered by owner so a user can only ever see their own rows — with each
// entry's review status in plain words (Khmer first, then English). Row-level
// security still does the real access control on every query.
export default async function MyEntriesPage() {
  let user = null;
  let entries = [];
  try {
    const supabase = await createClient();
    const { data: { user: current } } = await supabase.auth.getUser();
    user = current ?? null;
    if (user) {
      const { data } = await supabase
        .from("entries")
        .select("*")
        .eq("owner", user.id);
      entries = data ?? [];
    }
  } catch {
    // Supabase credentials not configured yet — treat everyone as logged out.
  }

  if (!user) {
    return (
      <main style={styles.wrap}>
        <div style={styles.card}>
          <p style={styles.kicker}>
            KHMER LIVING ARCHIVE • បណ្ណសាររស់នៅខ្មែរ
          </p>
          <h1 style={styles.title}>My entries</h1>
          <p style={styles.text}>
            Log in to see the entries you have contributed and what stage of
            review they are at.
          </p>
          <a href="/login?next=/my-entries" style={styles.link}>
            Log in to view your entries →
          </a>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.wrap}>
      <header>
        <p style={styles.kicker}>
          KHMER LIVING ARCHIVE • បណ្ណសាររស់នៅខ្មែរ
        </p>
        <h1 style={styles.title}>My entries</h1>
        <p style={styles.subtitle}>
          ធាតុរបស់ខ្ញុំ — your contributions and their status
        </p>
      </header>

      {entries.length === 0 ? (
        <div style={styles.card}>
          <p style={styles.text}>
            You have not contributed any entries yet. When you do, you will
            see each one here with its review status.
          </p>
          <a href="/contribute" style={styles.link}>
            Contribute your first entry →
          </a>
        </div>
      ) : (
        <ul style={styles.list}>
          {entries.map((entry) => (
            <li key={entry.id} style={styles.item}>
              <h2 style={styles.itemTitle}>
                <a href={`/entries/${entry.id}`} style={styles.itemLink}>
                  {entry.title}
                </a>
              </h2>
              <EntryStatus status={entry.status} />
              <p style={styles.place}>{entry.place}</p>
              <a href={`/entries/${entry.id}/edit`} style={styles.edit}>
                Edit →
              </a>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
