import { notFound } from "next/navigation";
import collection from "../../../collection.config.js";
import { createClient } from "../../../lib/supabase/server.js";
import EntryActions from "../../../components/EntryActions.js";

const GOLD = "#D4AF37";
const GOLD_LIGHT = "#F5D061";
const CREAM = "#F2E9D8";
const MUTED = "#C9B98F";

const styles = {
  wrap: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "60px 24px 80px",
  },
  card: {
    padding: "40px 40px 32px",
    background: "linear-gradient(180deg, #241C0E 0%, #1A1409 100%)",
    border: `1px solid ${GOLD}`,
    borderRadius: 18,
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    maxHeight: 360,
    objectFit: "cover",
    borderRadius: 10,
    display: "block",
    border: "1px solid rgba(212,175,55,0.3)",
  },
  title: {
    fontSize: 30,
    fontWeight: 700,
    margin: "22px 0 6px",
    color: CREAM,
  },
  description: {
    fontSize: 17,
    lineHeight: 1.7,
    color: GOLD_LIGHT,
    margin: "0 0 20px",
  },
  label: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    letterSpacing: 1,
    color: GOLD,
    textTransform: "uppercase",
    margin: 0,
  },
  place: {
    fontSize: 16,
    color: MUTED,
    margin: "6px 0 0",
  },
  back: {
    marginTop: 40,
    color: GOLD,
    textDecoration: "none",
    fontFamily: "'Courier New', monospace",
    fontSize: 14,
  },
};

export const metadata = {
  title: `Entry — ${collection.name}`,
};

export default async function EntryPage({ params }) {
  const { id } = await params;

  let entry = null;
  let userId = null;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id ?? null;
    const { data } = await supabase
      .from("entries")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    entry = data;
  } catch {
    // Supabase not configured or entry missing — handled below.
  }

  if (!entry) notFound();

  // Edit and Delete are only shown to the entry's owner.
  const isOwner = Boolean(userId) && entry.owner === userId;

  return (
    <main style={styles.wrap}>
      <article style={styles.card}>
        {entry.photo && (
          <img style={styles.photo} src={entry.photo} alt={entry.title} />
        )}
        <h1 style={styles.title}>{entry.title}</h1>
        <p style={styles.description}>{entry.description}</p>

        <p style={styles.label}>Place</p>
        <p style={styles.place}>{entry.place}</p>
      </article>

      {isOwner && <EntryActions entryId={entry.id} />}

      <p>
        <a href="/" style={styles.back}>
          ← Back to the archive
        </a>
      </p>
    </main>
  );
}