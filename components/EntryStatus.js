const GOLD = "#D4AF37";

// Plain-word status labels, Khmer first (the prioritised language) and English
// beneath it, matching the archive's bilingual style. An unknown status falls
// back to the raw database value so it never renders as a blank space.
const LABELS = {
  pending: "កំពុងរង់ចាំ · Pending",
  published: "បានផ្សាយ · Published",
  returned: "បានប្រគល់ត្រឡប់ · Returned",
};

const COLORS = {
  pending: "#F5D061",
  published: "#7FD1A8",
  returned: "#E0805A",
};

const styles = {
  status: {
    display: "inline-block",
    fontFamily: "'Courier New', monospace",
    fontSize: 13,
    letterSpacing: 1,
    padding: "5px 12px",
    borderRadius: 999,
    border: "1px solid currentColor",
    margin: 0,
  },
};

export default function EntryStatus({ status }) {
  const label = LABELS[status] ?? String(status);
  const color = COLORS[status] ?? GOLD;
  return <p style={{ ...styles.status, color }}>{label}</p>;
}
