import { notFound } from "next/navigation";
import collection from "../../../../collection.config.js";
import { createClient } from "../../../../lib/supabase/server.js";
import ContributeForm from "../../../../components/ContributeForm.js";

const GOLD = "#D4AF37";
const CREAM = "#F2E9D8";
const MUTED = "#C9B98F";

const styles = {
  wrap: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "60px 24px 80px",
  },
  denied: {
    maxWidth: 480,
    margin: "0 auto",
    padding: "40px 32px",
    background: "linear-gradient(180deg, #241C0E 0%, #1A1409 100%)",
    border: `1px solid ${GOLD}`,
    borderRadius: 18,
  },
  deniedTitle: {
    fontSize: 26,
    fontWeight: 700,
    margin: "0 0 14px",
    color: CREAM,
    textAlign: "center",
  },
  deniedText: {
    color: MUTED,
    fontSize: 16,
    lineHeight: 1.6,
    textAlign: "center",
  },
  deniedLink: {
    display: "block",
    marginTop: 20,
    color: GOLD,
    textAlign: "center",
  },
};

export const metadata = {
  title: `Edit entry — ${collection.name}`,
};

export default async function EditEntryPage({ params }) {
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

  // Only the owner may edit; the form itself is the same one used for
  // contributing, pre-filled with the entry's current values.
  const isOwner = Boolean(userId) && entry.owner === userId;

  return (
    <main style={styles.wrap}>
      {isOwner ? (
        <ContributeForm entry={entry} />
      ) : (
        <div style={styles.denied}>
          <h1 style={styles.deniedTitle}>You can't edit this entry</h1>
          <p style={styles.deniedText}>
            Only the contributor who created an entry can edit it.
            {userId
              ? " This is not one of your entries."
              : " Please log in as the contributor."}
          </p>
          <a href={`/entries/${id}`} style={styles.deniedLink}>
            ← Back to the entry
          </a>
        </div>
      )}
    </main>
  );
}