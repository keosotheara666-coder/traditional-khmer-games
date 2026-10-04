# Khmer Living Archive — Traditional Khmer Games

A living archive of Khmer culture, built as the ICT 340 capstone at AUPP. The
current collection documents **traditional Khmer games**. This is part of a
four-feature skeleton (browse & search, contributor accounts, own-your-entries,
submit-review-publish) that grows across the semester. Same skeleton for
everyone; the collection is what makes it yours.

## Tech stack

- **Next.js 15** — App Router (`app/` directory), server-rendered pages.
- **React 19** — plain function components, no class components.
- **JavaScript only** — no TypeScript, ever.
- **No CSS frameworks, component libraries, or state libraries.**
  Styling uses inline `style={{ ... }}` objects (see any page or component) or
  a plain CSS file.
- The **only** dependencies are the three in `package.json`:
  `next`, `react`, and `react-dom`.

## Running it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

Other useful scripts (from `package.json`):

```bash
npm run build   # production build (Next.js)
npm run start   # start the production build
```

## How the project is organised

```
collection.config.js          ← the archive's identity (single source of truth)
app/
  layout.js                   ← root layout: sets page background/theme + <NavMenu>
  page.js                     ← homepage: hero, intro, and the searchable browser
  traditional-games/
    page.js                   ← the "Traditional Khmer Games" listing page
    games.js                  ← THE DATA: every game entry lives here
components/
  NavMenu.js                  ← top navigation bar (Home / Traditional Khmer Games)
  AngkorBackdrop.js           ← decorative backdrop behind the hero
  GameBrowser.js              ← search box + pick-a-game flow (homepage)
  GameList.js                 ← clickable list of results
  GameCard.js                 ← full card, one game, Khmer first then English
public/images/                ← the game photographs
```

### `collection.config.js` — the archive's identity

This is the **single source of truth** for who the archive is. It exports the
collection name, a one-sentence description (in English and Khmer),
the curator, and the source of the knowledge. Every page imports it rather than
hard-coding these values, e.g. in `layout.js` and the page metadata blocks:

```js
title: `${collection.name} — Khmer Living Archive`,
```

If you change the archive's name or description, you only touch this one file.

### The data model — `app/traditional-games/games.js`

Every game is one object with the same shape:

```js
{
  name: "Veay Ka'am",                 // English / romanised name
  khmerName: "វាយក្អម",                 // Khmer name — first-class content
  image: "/images/veay_ka'am.jpg",    // path to the photo
  translit: "Veay Ka'am (Strike the Pot)", // name + short English gloss
  // English sections (shown second, below the Khmer)
  howToPlay, origin, whenPlayed, whyPlayed, importance, whyToday,
  // Khmer sections (shown first — Khmer is the prioritised language)
  howToPlayKhmer, originKhmer, whenPlayedKhmer, whyPlayedKhmer,
  importanceKhmer, whyTodayKhmer,
}
```

The file exports the whole `games` array, which both the homepage
(`app/page.js`) and the games page (`app/traditional-games/page.js`) import.

### How the homepage works — `app/page.js` + `GameBrowser`

1. `app/page.js` renders a hero with the collection's Khmer description first,
   then the English one, then hands the `games` array to `GameBrowser`.
2. **`GameBrowser`** (`components/GameBrowser.js`) is a client component
   (`"use client"`). It keeps a `query` and a `selected` game in state:
   - it builds a `searchableText(game)` from the name, Khmer name, and
     transliteration (the English gloss in parentheses is cut off so a common
     word there can't pad every match);
   - typing filters `games` to those whose searchable text contains the query —
     you can search in English **or** Khmer;
   - clicking a result (`GameList`) opens its full `GameCard`; typing again
     clears the selection.
3. **`GameList`** shows results as clickable buttons with a thumbnail.
4. **`GameCard`** renders the chosen game: photo, name + Khmer name +
   transliteration, then the six labelled sections, showing Khmer first and the
   English original beneath it.

### How the games page works — `app/traditional-games/page.js`

A static listing page. It maps over `games` and renders a `GameCard` for each
one, headed by an intro paragraph (Khmer first, English below) and driven by
the `metadata` block used for the page title/description.

### Khmer-first principle

Khmer text is first-class content, never an edge case. Everywhere the two
languages appear side by side, the Khmer version is written first / shown on
top, and the English original sits below it. Khmer is never stripped,
transliterated, or "fixed" — the data and UI treat it as the primary language.

## Conventions to follow

- One component per file in `components/`, plain function components.
- Keep components to roughly 80 lines or less; if one outgrows that, split it.
- Don't add dependencies. If a task seems to need a package, stop and say so
  instead of installing it.
- Only touch `package.json`, `package-lock.json`, `next.config.mjs`, and
  `.gitignore` when a task explicitly names them.
- Never write an API key, token, or password into any file — this repo is
  public.
- Keep diffs scoped to what the task asked for, and say which file/why before
  touching an extra one.
- Sample data comes from real content, never lorem ipsum.

## Rules of the road

You own what you ship. Every line that lands in this repository is yours to
explain, whoever or whatever wrote it.
