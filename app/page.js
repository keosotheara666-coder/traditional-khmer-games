import collection from "../collection.config.js";
import GameBrowser from "../components/GameBrowser.js";
import AngkorBackdrop from "../components/AngkorBackdrop.js";
import games from "./traditional-games/games.js";

const GOLD = "#D4AF37";
const GOLD_LIGHT = "#F5D061";
const BRASS = "#B8860B";
const CREAM = "#F2E9D8";
const MUTED = "#C9B98F";

const styles = {
  wrap: {
    maxWidth: 820,
    margin: "0 auto",
    padding: "70px 24px 70px",
  },
  hero: {
    position: "relative",
    textAlign: "center",
    border: `1px solid ${GOLD}`,
    borderRadius: 18,
    padding: "52px 36px 44px",
    background: "linear-gradient(180deg, #241C0E 0%, #1A1409 100%)",
    boxShadow: `0 0 0 6px rgba(212,175,55,0.14), 0 22px 60px rgba(0,0,0,0.55)`,
    overflow: "hidden",
  },
  kicker: {
    fontFamily: "'Courier New', monospace",
    color: GOLD_LIGHT,
    fontSize: 13,
    letterSpacing: 2,
    margin: 0,
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    margin: "20px 0 26px",
  },
  title: {
    fontSize: 44,
    fontWeight: 700,
    margin: 0,
    lineHeight: 1.1,
    color: CREAM,
    textShadow: `0 2px 18px rgba(212,175,55,0.35)`,
  },
  descKhmer: {
    fontSize: 22,
    lineHeight: 1.7,
    color: GOLD_LIGHT,
    margin: "0 auto",
    maxWidth: 620,
    fontWeight: 600,
  },
  divider: {
    width: 120,
    height: 2,
    margin: "22px auto",
    background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
    borderRadius: 2,
  },
  descEn: {
    fontSize: 17,
    lineHeight: 1.6,
    color: MUTED,
    margin: 0,
    maxWidth: 620,
    marginLeft: "auto",
    marginRight: "auto",
  },
  section: {
    margin: "66px 0 0",
    textAlign: "center",
  },
  sectionKicker: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    letterSpacing: 2,
    color: BRASS,
    margin: "0 0 6px",
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: 700,
    margin: 0,
    color: CREAM,
  },
  count: {
    fontFamily: "'Courier New', monospace",
    fontSize: 14,
    color: GOLD,
    marginTop: 40,
    textAlign: "center",
  },
  footer: {
    marginTop: 60,
    paddingTop: 24,
    borderTop: `1px solid rgba(212,175,55,0.35)`,
    fontSize: 13,
    color: MUTED,
    textAlign: "center",
  },
};

export default function Home() {
  return (
    <main style={styles.wrap}>
      <AngkorBackdrop />

      <header style={styles.hero}>
        <p style={styles.kicker}>
          KHMER LIVING ARCHIVE • បណ្ណសាររស់នៅខ្មែរ
        </p>
        <div style={styles.titleRow}>
          <h1 style={styles.title}>Traditional Khmer Games</h1>
        </div>
        {/* Khmer translation first — it is the prioritised language */}
        <p style={styles.descKhmer}>{collection.descriptionKhmer}</p>
        <div style={styles.divider} />
        <p style={styles.descEn}>{collection.description}</p>
      </header>

      <section style={styles.section}>
        <p style={styles.sectionKicker}>Browse the collection • ស្វែងរក</p>
        <h2 style={styles.sectionTitle}>Traditional Khmer Games</h2>
        <GameBrowser games={games} />
      </section>

      <p style={styles.count}>
        traditional games in the archive: {games.length} (for now)
      </p>

      <footer style={styles.footer}>
        Built in ICT 340 — Vibe Coding, American University of Phnom Penh, Fall
        2026. This archive is under construction all semester. Come back in
        December.
      </footer>
    </main>
  );
}
