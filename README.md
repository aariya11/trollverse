# TROLLVERSE

A playful, fully client-side humor and creativity site: random chaos generator, prank share links, a meme studio, a doodle studio (with a draw-battle mode), a tiny games arcade, daily challenges, and a guest profile with achievements.

Everything runs in the browser. There is no account system, no server database, and no tracking. The only "data" the site keeps is a guest identity and progress in your own `localStorage`, plus whatever you deliberately pack into a share link.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Home: chaos launcher, featured modules, daily card |
| `/chaos` | Chaos Engine — 10 generators (jokes, hypotheticals, absurd tests, excuses, fake news, would-you-rather, questions, challenges, drawing prompts, compliments) |
| `/troll-lab` | Five prank link builders: fake loading screen, fake award, fake drama headline, prank card, quiz challenge |
| `/t/[kind]` | The shared prank pages themselves (`loading`, `award`, `drama`, `card`, `quiz`) |
| `/t` | Share-link guide (what each prank does, how to send it kindly) |
| `/meme-studio` | Canvas meme editor: templates, draggable text layers, image upload, PNG export |
| `/draw` | Doodle studio: free drawing, prompts, undo/redo, draw-battle mode with a 60s timer (also reachable via `?prompt=` / `?mode=battle`) |
| `/games` | Doom Button (11 stages) and Gremlin Catch |
| `/daily` | One challenge per day, streak tracking, UTC-midnight countdown |
| `/profile` | Guest identity, achievements, saved stash, local data controls |
| `/explore` | Directory of everything, linking into `/chaos` categories |
| `/about`, `/privacy`, `/terms`, `/community-guidelines`, `/safety`, `/contact`, `/report`, `/cookie-preferences` | Real (not placeholder) policy and safety pages |

## Stack

- Next.js 16 (App Router, Turbopack, `cacheComponents`) + React 19 + TypeScript
- Tailwind CSS v4 (design tokens live in `app/globals.css` via `@theme`)
- No animation library — CSS keyframes + small hooks in `lib/hooks.ts`
- WebAudio-synthesized sounds (off by default, toggle in the header)
- Vitest for unit tests of the pure logic (`lib/`)

## Scripts

```bash
npm run dev        # start dev server
npm run build      # production build (also generates route types)
npm run start      # serve the production build
npm run lint       # eslint (flat config)
npm run typecheck  # tsc --noEmit (requires .next/types from a prior build/dev run)
npm test           # vitest run
npm run test:watch # vitest in watch mode
```

## Environment

Copy `.env.example` to `.env.local` if you want canonical URLs (sitemap/robots/metadata) to point at your real domain:

```
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

Defaults to `https://trollverse.example` when unset. Nothing else is required — there are no secrets.

## How sharing works

Prank links are fully self-contained: the payload is JSON, sanitized, base64url-encoded and carried in the `?d=` query parameter (`lib/share.ts`). There is no server round-trip; opening a link renders the prank entirely from the URL. Oversized or malformed payloads fall back to a "broken link" screen.

## Privacy in one paragraph

Guest identity, progress, achievements and drafts live only in your browser's `localStorage` under the `trollverse:v1:` prefix. Cloud uploads do not exist. The only way content leaves your device is when you copy a share link or export a PNG yourself. See `/privacy`.

## Not built (on purpose, for now)

Accounts, friend lists, and live multiplayer rooms are documented on the relevant pages as not-yet-existing instead of being faked. Everything the site claims to do, it actually does.
