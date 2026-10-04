import collection from "../../collection.config.js";
import games from "./games.js";
import GameCard from "../../components/GameCard.js";
import AngkorBackdrop from "../../components/AngkorBackdrop.js";

export const metadata = {
  title: `${collection.name} — Traditional Khmer Games`,
  description:
    "An introduction to eight traditional Khmer games — Teanh Proat, Chol Chhoung, Bos Angkunh, Leak Kanseng, Chab Kon Kleng, Leaf Stealing, Pongroat Kon Kromom and Veay Ka'am — and why they matter to Cambodian culture.",
};

const GOLD = "#D4AF37";
const GOLD_LIGHT = "#F5D061";
const CREAM = "#F2E9D8";
const MUTED = "#C9B98F";

const styles = {
  wrap: {
    maxWidth: 860,
    margin: "0 auto",
    padding: "70px 24px 70px",
  },
  header: {
    textAlign: "center",
    border: `1px solid ${GOLD}`,
    borderRadius: 18,
    padding: "48px 32px 40px",
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
    margin: "20px 0 8px",
  },
  title: {
    fontSize: 40,
    fontWeight: 700,
    margin: 0,
    lineHeight: 1.1,
    color: CREAM,
    textShadow: `0 2px 18px rgba(212,175,55,0.35)`,
  },
  subtitle: {
    fontFamily: "'Courier New', monospace",
    fontSize: 17,
    color: GOLD,
    margin: "0 0 26px",
  },
  intro: {
    fontSize: 17,
    lineHeight: 1.75,
    color: "#F5D061",
    margin: 0,
    maxWidth: 680,
    marginLeft: "auto",
    marginRight: "auto",
  },
  divider: {
    width: 120,
    height: 2,
    margin: "20px auto",
    background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
    borderRadius: 2,
  },
  introEn: {
    fontSize: 16,
    lineHeight: 1.7,
    color: MUTED,
    margin: 0,
    maxWidth: 680,
    marginLeft: "auto",
    marginRight: "auto",
  },
  back: {
    display: "inline-block",
    marginTop: 56,
    color: GOLD,
    textDecoration: "none",
    fontFamily: "'Courier New', monospace",
    fontSize: 14,
  },
  footer: {
    marginTop: 40,
    paddingTop: 24,
    borderTop: `1px solid rgba(212,175,55,0.35)`,
    fontSize: 13,
    color: MUTED,
    textAlign: "center",
  },
};

// Khmer intro first (prioritised), English below it.
const INTRO_KHMER =
  "ល្បែងប្រជាប្រិយរបស់កម្ពុជាត្រូវបានគ្រួសារ និងភូមិខ្មែរលេងអស់ជាច្រើនជំនាន់មកហើយ។ ល្បែងជាច្រើនត្រូវបានភ្ជាប់ទៅនឹងពិធីបុណ្យ និងរដូវកាល — ជាពិសេសបុណ្យចូលឆ្នាំខ្មែរ (ខែមេសា) ដែលមកភ្លាមបន្ទាប់ពីរដូវច្រូតកាត់ នៅពេលដែលសហគមន៍ទាំងមូលមានពេលសម្រាក និងជួបជុំគ្នា។ ល្បែងទាំងនេះកម្រត្រូវការអ្វីធំដុំណាស់៖ ខ្សែពួរមួយ ក្រណាត់មួយ គ្រាប់ពូជពីរបីគ្រាប់តាមរដូវ។ ប៉ុន្តែវាមានតម្លៃលើសពីភាពសប្បាយទៅទៀត។ វាបន្តចម្លងជំនាញ និងទំនៀមទម្លាប់ពីជីដូនជីតាទៅចៅៗ នាំអ្នកជិតខាង និងភូមិទាំងមូលមកជាហ្វូងមនុស្សរីករាយតែមួយ ហើយរក្សាវប្បធម៌ខ្មែរផ្នែកមួយឱ្យរស់នៅសម្រាប់អនាគត។";
const INTRO_EN =
  "Traditional Cambodian games have been played by Khmer families and villages for generations. Many are linked to festivals and the seasons — above all to Khmer New Year (around mid-April), which comes just after the harvest, when the whole community has time to rest and come together. These games rarely need anything grand: a rope, a cloth, a few seeds from the season. But they are far more than fun. They pass on skills and customs from grandparents to grandchildren, bring neighbours and whole villages into one happy crowd, and keep a piece of living Cambodian culture alive for the future.";

export default function TraditionalGamesPage() {
  return (
    <main style={styles.wrap}>
      <AngkorBackdrop />

      <header style={styles.header}>
        <p style={styles.kicker}>KHMER LIVING ARCHIVE • បណ្ណសាររស់នៅខ្មែរ</p>
        <div style={styles.titleRow}>
          <h1 style={styles.title}>Traditional Khmer Games</h1>
        </div>
        <h2 style={styles.subtitle}>ល្បែងប្រជាប្រិយខ្មែរ</h2>

        <p style={styles.intro}>{INTRO_KHMER}</p>
        <div style={styles.divider} />
        <p style={styles.introEn}>{INTRO_EN}</p>
      </header>

      {games.map((game) => (
        <GameCard key={game.name} game={game} />
      ))}

      <a href="/" style={styles.back}>
        ← Back to the archive
      </a>

      <footer style={styles.footer}>
        {collection.name} — curated by {collection.curator}. Part of the Khmer
        Living Archive for ICT 340.
      </footer>
    </main>
  );
}