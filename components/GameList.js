"use client";

import { useState } from "react";

const styles = {
  list: {
    margin: "40px 0 0",
    padding: 0,
    listStyle: "none",
    display: "grid",
    gap: 16,
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    padding: 16,
    backgroundColor: "#1E170B",
    border: "1px solid rgba(212,175,55,0.35)",
    borderRadius: 12,
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    width: "100%",
    textAlign: "left",
    fontFamily: "inherit",
    color: "inherit",
    cursor: "pointer",
    transition: "border-color 0.15s ease, transform 0.15s ease",
  },
  itemHover: {
    borderColor: "#C9A227",
    transform: "translateY(-2px)",
  },
  imageWrap: {
    flex: "0 0 auto",
    width: 120,
    height: 120,
    overflow: "hidden",
    borderRadius: 8,
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  nameRow: {
    display: "flex",
    alignItems: "baseline",
    flexWrap: "wrap",
    gap: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 700,
    margin: 0,
  },
  khmer: {
    fontSize: 18,
    color: "#D4AF37",
  },
  translit: {
    fontSize: 13,
    fontFamily: "'Courier New', monospace",
    color: "#C9B98F",
    margin: "6px 0 0",
  },
};

export default function GameList({ games, onSelect }) {
  const [hovered, setHovered] = useState(null);

  return (
    <ul style={styles.list}>
      {games.map((game) => (
        <li key={game.name}>
          <button
            type="button"
            style={{
              ...styles.item,
              borderColor: hovered === game.name
                ? "#C9A227"
                : "rgba(212,175,55,0.35)",
              transform: hovered === game.name ? "translateY(-2px)" : "none",
            }}
            onMouseEnter={() => setHovered(game.name)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect(game)}
          >
            {game.image && (
              <div style={styles.imageWrap}>
                <img style={styles.image} src={game.image} alt={game.name} />
              </div>
            )}
            <div>
              <div style={styles.nameRow}>
                <h3 style={styles.name}>{game.name}</h3>
                <span style={styles.khmer}>{game.khmerName}</span>
              </div>
              <p style={styles.translit}>{game.translit}</p>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
