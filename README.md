# PMU E-Sports Club: Official Website

Next.js 15 (App Router) · Tailwind CSS v4 · Framer Motion · Lucide · next-themes · English/Arabic (RTL) · Git-backed JSON content · Vercel

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run validate   # check /data JSON files
npm run build      # production build (runs validate first)
```

Requires Node.js 20+.

## Project structure

```
.
├── app/
│   ├── globals.css          # Tailwind v4: brand palette, light/dark semantic tokens, RTL + Arabic font rules
│   ├── layout.tsx           # Reads `lang` cookie → <html lang dir>, fonts, providers, Navbar/Footer
│   ├── page.tsx             # /             Hero + overview + live hub
│   ├── events/page.tsx      # /events       Events board + game voting
│   ├── about/page.tsx       # /about        About us + leadership roster
│   ├── leaderboard/page.tsx # /leaderboard  Hall of Fame
│   ├── join/page.tsx        # /join         Registration form
│   ├── not-found.tsx
│   └── icon.png
├── components/
│   ├── layout/              # Navbar, Footer, LanguageToggle, ThemeToggle, SkipLink
│   ├── providers/           # Providers (next-themes + language + motion), LanguageProvider (useLang)
│   ├── sections/            # One component per page section
│   └── ui/                  # Logo, Reveal, SectionHeading, SocialLinks, BrandIcons
├── data/                    # ← THE CMS (bilingual). Edit these on GitHub.
├── lib/
│   ├── i18n/dictionary.ts   # UI strings in EN + AR (AR is type-checked against EN)
│   ├── i18n/server.ts       # getLang() / getDictionary() for server components & metadata
│   ├── content.ts           # Typed loaders + sorting for /data
│   ├── types.ts             # Content schema (Localized = string | { en, ar })
│   └── utils.ts             # cn, pick(), localized dates, Formspree submit
├── public/                  # logo.png, roster/ photos, games/ images
├── scripts/validate-data.mjs  # Pre-build content check (protects the live site)
└── PROFESSOR_GUIDE.md
```

## How i18n and theming work

- **Language:** `LanguageProvider` holds the active language (default `en`). The toggle updates the React
  state, `<html lang/dir>` and a `lang` cookie. The root layout reads that cookie, so the server renders the
  correct language and direction on the first paint, with no flash or hydration mismatch. Pages are therefore
  rendered on demand (dynamic).
- **RTL:** components use logical utilities (`ms-/me-/ps-/pe-/start-/end-/text-start`) plus `rtl:` variants
  (icon flips, gradient directions). Arabic switches to the Cairo font and drops letter-spacing.
- **Theme:** `next-themes` with `attribute="class"` and `defaultTheme="dark"`. Tailwind v4's equivalent of
  `darkMode: "class"` is `@custom-variant dark` in `globals.css`. Colors are semantic tokens (`bg-bg`,
  `text-fg`, `text-muted`, `border-line`, `text-accent`…) that switch values under `.dark`.

## Deploy (GitHub → Vercel)

1. Push this folder to a new GitHub repo.
2. On vercel.com → **Add New → Project** → import the repo → **Deploy** (defaults are correct).
3. Every commit to `main`, including JSON edits made in the GitHub web editor, redeploys automatically.
4. Give the professor **Write** access to the repo (Settings → Collaborators).

## Forms (no backend)

Create a free form at formspree.io and paste its ID into `data/site.json → forms`.
Registration, votes and suggestions all post directly from the browser to Formspree.
Alternatively set `googleFormEmbedUrl` to embed a Google Form instead.

> Voting note: with no database, duplicate votes are prevented per browser (localStorage) and every
> vote lands in the Formspree inbox. Admins copy official totals into `games.json`. For real-time
> shared tallies later, add a small key-value store (e.g. Upstash Redis via the Vercel Marketplace).
