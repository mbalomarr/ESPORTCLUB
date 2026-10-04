# PMU E-Sports Club: Official Website

Next.js 15 (App Router) · Tailwind CSS v4 · Framer Motion · Lucide · next-themes · English/Arabic (RTL) · Git-backed JSON content · GitHub Pages (static export)

## Run locally

```bash
npm install
npm run dev
```

Requires Node.js 20+.

## Project structure

```
.
├── app/                       # Routes (App Router, statically exported)
│   ├── layout.tsx             # Fonts, providers, Navbar/Footer, pre-paint language boot script
│   ├── page.tsx               # /             Hero, overview, live hub
│   ├── events/page.tsx        # /events       Events board, game voting
│   ├── about/page.tsx         # /about        Vision, pillars, stats, leadership roster
│   ├── leaderboard/page.tsx   # /leaderboard  Hall of Fame
│   ├── join/page.tsx          # /join         Registration form
│   ├── not-found.tsx
│   ├── globals.css            # Tailwind v4 theme: brand palette, light/dark tokens, RTL rules
│   └── icon.png
├── components/
│   ├── ui/                    # Atomic primitives, no app state
│   │   ├── Button.tsx         #   Button, ButtonLink (internal → <Link>, external → new tab)
│   │   ├── Card.tsx           #   Card, cardClass()
│   │   ├── Badge.tsx · IconTile.tsx · Logo.tsx · SocialLinks.tsx · BrandIcons.tsx
│   │   ├── Form.tsx           #   TextField, TextAreaField, SelectField, ChipGroup, RadioCards, FormSection, …
│   │   └── Reveal.tsx · SectionHeading.tsx
│   ├── layout/                # Navbar, MobileNav, Footer, LangToggle, ThemeToggle, SkipLink
│   ├── sections/              # Page sections (Hero, EventsBoard, EventCard, GameVoting, SuggestGameForm, …)
│   └── providers/             # Providers (next-themes + language + motion), LanguageProvider / useLang()
├── lib/
│   ├── content.ts             # Typed, sorted access to /data (the only module that imports JSON)
│   ├── navigation.ts          # Route list + active-link helper shared by Navbar, MobileNav, Footer
│   ├── formspree.ts           # Browser → Formspree submission helpers
│   ├── hooks/use-form-submission.ts  # Shared idle/sending/sent/error state for every form
│   ├── i18n/dictionary.ts     # UI strings, EN + AR (AR is type-checked against EN)
│   ├── i18n/form-options.ts   # Registration choices (English values, localized labels)
│   ├── i18n/localize.ts       # pick(), formatDate(), direction, storage key
│   └── utils.ts               # cn(), asset() (basePath for images), initials()
├── types/                     # Entity types: i18n, event, player, game, site (barrel: "@/types")
├── data/                      # ← THE CMS (bilingual JSON). Edit these on GitHub.
├── public/                    # logo.png, roster/ photos, games/ images, .nojekyll
├── scripts/validate-data.mjs  # Content schema check; runs before every build
├── .github/workflows/deploy.yml
└── PROFESSOR_GUIDE.md
```

**Dependency direction:** `app` → `components/sections` → `components/ui` + `lib` → `types`.
UI primitives never read app state; sections get data from pages via props and text via `useLang()`.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server at http://localhost:3000/ESPORTCLUB/ |
| `npm run validate` | Check `/data/*.json` against the content schema |
| `npm run typecheck` | `tsc --noEmit` (strict, no unused locals/params) |
| `npm run check` | validate + typecheck |
| `npm run build` | Validate, then static export to `./out` |

## How i18n and theming work

- **Language:** `LanguageProvider` holds the active language (default `en`) and saves the choice in
  `localStorage` (`pmu-lang`). Pages are pre-rendered in English. For returning Arabic visitors, a tiny inline
  script in `<head>` sets `lang="ar" dir="rtl"` before first paint and briefly hides the page until React
  swaps the text, which avoids both a flash of English and a hydration mismatch.
- **RTL:** components use logical utilities (`ms-/me-/ps-/pe-/start-/end-/text-start`) plus `rtl:` variants
  (icon flips, gradient directions). Arabic switches to the Cairo font and drops letter-spacing.
- **Theme:** `next-themes` with `attribute="class"` and `defaultTheme="dark"`. Tailwind v4's equivalent of
  `darkMode: "class"` is `@custom-variant dark` in `globals.css`. Colors are semantic tokens (`bg-bg`,
  `text-fg`, `text-muted`, `border-line`, `text-accent`…) that switch values under `.dark`.

## Deploy (GitHub Pages)

Live at **https://mbalomarr.github.io/ESPORTCLUB/**

- `next.config.mjs` uses `output: "export"`, `basePath: "/ESPORTCLUB"`, `trailingSlash: true` and
  unoptimized images, so `npm run build` produces a fully static site in `./out`.
- `.github/workflows/deploy.yml` builds and publishes `./out` on every push to `main`, including JSON edits
  made in the GitHub web editor (live about 2 minutes later; progress shows in the **Actions** tab).
- **One-time setup:** repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
- Site-relative image paths in `/data` (e.g. `/roster/ahmed.jpg`) get the base path added automatically
  by `asset()` in `lib/utils.ts`. If the repo is renamed, update `basePath` in `next.config.mjs`.
- Give the professor **Write** access to the repo (Settings → Collaborators).

## Forms (no backend)

Create a free form at formspree.io and paste its ID into `data/site.json → forms`.
Registration, votes and suggestions all post directly from the browser to Formspree.
Alternatively set `googleFormEmbedUrl` to embed a Google Form instead.

> Voting note: with no database, duplicate votes are prevented per browser (localStorage) and every
> vote lands in the Formspree inbox. Admins copy official totals into `games.json`. For real-time
> shared tallies later, add a small key-value store (e.g. a hosted service such as Supabase or Firebase, called from the browser).
