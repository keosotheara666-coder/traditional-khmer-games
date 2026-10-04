import collection from "../../collection.config.js";
import { createClient } from "../../lib/supabase/server.js";
import ContributeForm from "../../components/ContributeForm.js";

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
  loginCard: {
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
    fontSize: 26,
    fontWeight: 700,
    margin: "14px 0 26px",
    color: CREAM,
    textAlign: "center",
  },
  text: {
    color: MUTED,
    fontSize: 16,
    lineHeight: 1.6,
    textAlign: "center",
  },
  loginLink: {
    display: "block",
    marginTop: 20,
    color: GOLD_LIGHT,
    textAlign: "center",
  },
};

export const metadata = {
  title: `Contribute an entry — ${collection.name}`,
};

export default async function ContributePage() {
  let userEmail = null;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    userEmail = user?.email ?? null;
  } catch {
    // Supabase credentials not configured yet — treat everyone as logged out.
  }

  return (
    <main style={styles.wrap}>
      {userEmail ? (
        <ContributeForm />
      ) : (
        <div style={styles.loginCard}>
          <p style={styles.kicker}>
            KHMER LIVING ARCHIVE • បណ្ណសាររស់នៅខ្មែរ
          </p>
          <h1 style={styles.title}>Contribute an entry</h1>
          <p style={styles.text}>
            Only signed-in contributors can add to the archive. Log in and every
            entry you submit will be saved as yours.
          </p>
          <a href="/login" style={styles.loginLink}>
            Log in to contribute →
          </a>
        </div>
      )}
    </main>
  );
}