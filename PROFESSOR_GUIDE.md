# Professor's Guide: Updating the PMU E-Sports Website

You don't need to code, install anything or use a database. All website content lives in
simple text files in the **`data/`** folder on GitHub. Edit a file, click **Commit**, and the
live site updates automatically in about **1–2 minutes**, in **both English and Arabic**.

---

## How to edit a file (4 steps)

1. Open the repository on **github.com** and click the **`data`** folder.
2. Click the file you want (see the table below), then click the **✏️ pencil icon** (top right).
3. Make your change. Keep the existing pattern: copy an entry, then change the text inside the quotes.
4. Scroll down, type a short note (e.g. *"Add Valorant Winter Cup"*) and click **Commit changes**.

That's it. GitHub rebuilds and republishes the site on its own. You can watch progress in the
repository's **Actions** tab (a yellow dot means building, a green ✓ means live).

> **Safety net:** if a file has a typo, the update is rejected and **the current site stays online**.
> You'll see a red ❌ next to your commit on GitHub. Click it to see a plain-English message such as
> `data/events.json item #2: date must look like 2026-11-12`. Fix it and commit again.

---

## Which file controls which page

| Website page                     | File                     |
|----------------------------------|--------------------------|
| **Events** (`/events`): tournaments | `data/events.json`    |
| **Events** (`/events`): game poll   | `data/games.json`     |
| **Leaderboard** (`/leaderboard`)    | `data/hall-of-fame.json` |
| **About** (`/about`): leadership cards | `data/roster.json` |
| **About** (`/about`): vision, pillars, stats, plus the tagline, social links, forms and Twitch/Discord | `data/site.json` |

Menu labels, buttons and form questions are part of the design (not content), so they don't need editing.

---

## ✍️ Writing English **and** Arabic (the important part)

Most text fields hold **two versions** in one pair of curly braces, English first:

```json
"title": { "en": "Valorant Winter Cup", "ar": "كأس الشتاء لفالورانت" }
```

- `"en"` is shown when a visitor picks **EN**, `"ar"` when they pick **ع** in the menu bar.
- Type the Arabic **directly inside the quotes**, just like English. GitHub's editor handles Arabic fine;
  it may look right-aligned or "jumpy" while you type, which is normal.
- **Keep the keys `"en"` and `"ar"` exactly as they are** (lowercase, in quotes, in English).

### Text that's the same in both languages
Names that don't get translated (game titles, team names) can be **plain text**:

```json
"game": "Valorant",
"winner": "PMU Falcons"
```

You can switch any field between the two forms at any time:
`"winner": "PMU Falcons"` → `"winner": { "en": "PMU Falcons", "ar": "صقور PMU" }`

### Don't have the Arabic yet?
Leave it out, or leave it empty: `{ "en": "New event", "ar": "" }`. The site **still works** and shows
the English text on the Arabic version. The build log will list it as a reminder (a ⚠ warning, not an error).

### Things to keep in English/Latin characters
Dates (`"2026-12-10"`), times (`"18:00"`), `id`, `status`, `votes`, links and image paths always stay
as they are. Never translate those. The website formats dates in Arabic automatically.

---

## The 5 rules of JSON (the file format)

1. Text goes in **"double quotes"**. Numbers (like `votes`) have **no quotes**.
2. Put a **comma between items**, but **not after the last one**. This includes the comma between `"en": "…"` and `"ar": "…"`.
3. Each entry is wrapped in `{ curly braces }`; a list of entries is wrapped in `[ square brackets ]`.
4. Dates are always written **`YYYY-MM-DD`**, e.g. `"2026-11-12"`. Times use 24-hour format: `"18:00"`.
5. To leave something empty, use `""`, so don't delete the line.

---

## Common tasks

### ➕ Add a new event (`data/events.json`)
Copy an existing block, paste it **above the first one** (right after the `[`), add a comma after your
closing `}`, and edit:

```json
  {
    "id": "valorant-winter-cup-2026",
    "title": { "en": "Valorant Winter Cup", "ar": "كأس الشتاء لفالورانت" },
    "game": "Valorant",
    "date": "2026-12-10",
    "time": "18:00",
    "location": { "en": "PMU Gaming Lab", "ar": "مختبر الألعاب" },
    "format": { "en": "5v5 · Double Elimination", "ar": "5 ضد 5 · خروج مغلوب مزدوج" },
    "prize": { "en": "SAR 2,000", "ar": "2,000 ريال" },
    "status": "upcoming",
    "description": { "en": "Short description shown on the card.", "ar": "وصف قصير يظهر على البطاقة." },
    "registrationUrl": "/join",
    "image": ""
  },
```

- `id`: any unique name using lowercase English letters and dashes (no spaces).
- `status`: must be exactly `"upcoming"`, `"live"` (shows a red LIVE badge) or `"completed"`.
- After the event, change `"upcoming"` → `"completed"`. It moves to the **Past** tab automatically.
- `registrationUrl`: `"/join"` sends students to the club sign-up page; or paste a full `https://…` link.

### 🏆 Record a tournament winner (`data/hall-of-fame.json`)
Add a block. The **most recent date** automatically becomes the big "Reigning Champion" spotlight on the Leaderboard.

```json
  {
    "tournament": { "en": "Valorant Winter Cup", "ar": "كأس الشتاء لفالورانت" },
    "game": "Valorant",
    "date": "2026-12-10",
    "winner": "PMU Falcons",
    "players": ["Abdullah", "Faisal", "Hamad", "Rayan", "Turki"],
    "runnerUp": "Team Nova",
    "prize": { "en": "SAR 2,000", "ar": "2,000 ريال" }
  },
```

### 👤 Change the leadership board (`data/roster.json`)
Each member has an English and Arabic name, role and major:

```json
  {
    "name": { "en": "Ahmed Al-Ghamdi", "ar": "أحمد الغامدي" },
    "role": { "en": "Treasurer", "ar": "أمين الصندوق" },
    "major": { "en": "Accounting", "ar": "المحاسبة" },
    "mainGame": "Tekken 8",
    "photo": "",
    "socials": {}
  },
```

To add a **photo**:
1. Go to the `public/roster/` folder → **Add file → Upload files** → upload e.g. `ahmed.jpg` (square photos look best).
2. Set `"photo": "/roster/ahmed.jpg"`.
Leave `"photo": ""` to show the member's initials instead.

### 🗳️ Start a new game poll (`data/games.json`)
- Change `poll.id` to something new (e.g. `"next-tournament-2027-q1"`). **This lets every student vote again.**
- Edit the `question` (English and Arabic) and the list of `options`. Set each `votes` to `0`.
- To close voting: `"isOpen": false`.
- Each vote is emailed to the club's Formspree inbox. To show official totals, update the `votes` numbers occasionally.

### 🔗 About text, stats and social links (`data/site.json`)
Edit the text inside the quotes (both `en` and `ar`). In `about.pillars`, the `icon` can be one of:
`swords`, `users`, `target`, `trophy`, `gamepad`, `zap`, `sparkles`.

---

## Forms & live embeds (one-time setup in `data/site.json` → `forms` / `live`)

| Setting | What to put |
|---|---|
| `registrationFormspreeId` | The code from your Formspree form URL, e.g. `https://formspree.io/f/`**`xyzabcd`** → `"xyzabcd"` |
| `voteFormspreeId` / `suggestionFormspreeId` | Same; can be the same code as registration |
| `googleFormEmbedUrl` | *(Alternative)* Google Form → Send → `< >` embed tab → copy only the `src="…"` link. If filled, it **replaces** the built-in registration form. |
| `twitchChannel` | The channel name only, e.g. `"pmu_esports"` |
| `discordServerId` | Discord → Server Settings → **Widget** → enable *Server Widget* → copy **Server ID** |

Submissions from the Arabic site arrive in the same inbox, with answers in English and a `language: ar` field.

---

## Mistakes & undo

Every change is saved in GitHub's history. To undo: open the file → **History** (clock icon) →
pick an earlier version → copy its contents back in → commit. Nothing is ever lost.

**Tip:** Not sure your edit is valid? Paste the file's contents into <https://jsonlint.com> first.
