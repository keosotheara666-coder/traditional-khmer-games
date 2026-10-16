import collection from "../../collection.config.js";
import { isLocalDev } from "../../lib/supabase/admin.js";
import DevConfirmForm from "../../components/DevConfirmForm.js";
import DevResetForm from "../../components/DevResetForm.js";

const GOLD = "#D4AF37";
const GOLD_LIGHT = "#F5D061";
const CREAM = "#F2E9D8";
const MUTED = "#C9B98F";

const styles = {
  wrap: { maxWidth: 720, margin: "0 auto", padding: "60px 24px 80px" },
  card: {
    maxWidth: 460,
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
    margin: "14px 0 10px",
    color: CREAM,
    textAlign: "center",
  },
  intro: {
    color: MUTED,
    fontSize: 14,
    lineHeight: 1.6,
    textAlign: "center",
  },
};

export const metadata = {
  title: `Dev admin — ${collection.name}`,
};

export default async function DevAdminPage() {
  if (!isLocalDev()) {
    return (
      <main style={styles.wrap}>
        <div style={styles.card}>
          <h1 style={styles.title}>Not available</h1>
          <p style={styles.intro}>
            This tool only runs in the local dev server. It is disabled in
            production builds.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.wrap}>
      <div style={styles.card}>
        <p style={styles.kicker}>
          KHMER LIVING ARCHIVE • បណ្ណសាររស់នៅខ្មែរ
        </p>
        <h1 style={styles.title}>Local dev admin</h1>
        <p style={styles.intro}>
          Confirm accounts and reset passwords directly while testing. These
          need SUPABASE_SERVICE_ROLE_KEY in .env.local and are disabled in
          production.
        </p>
      </div>

      <DevConfirmForm />
      <DevResetForm />
    </main>
  );
}