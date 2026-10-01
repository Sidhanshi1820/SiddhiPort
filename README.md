# SECOPS.PORTFOLIO: Immersive 3D Portfolio

A scroll-driven WebGL journey: the whole page is one continuous Three.js scene.
As you scroll, the camera flies through a dark sci-fi corridor, docking at each
portfolio section: glowing hero core → identity → case files (with floating
cyber-security tool models: shield, wi-fi, padlock, network graph, magnifier,
key) → protocols → contact.

Built with **React 19 + TypeScript + Vite**, **Three.js** (via React Three
Fiber), **GSAP ScrollTrigger** for choreography, **Lenis** for smooth
scrolling, and a client-side **AI chat assistant** (Gemini via a server proxy,
with an offline portfolio-matching fallback).

## Quick start

```bash
npm install
npm run dev      # → http://localhost:5173  (/api proxies to :3000)
npm run build    # typecheck + production build into dist/
npm start        # node server.js → http://localhost:3000 (site + chat API)
```

Requires Node 18+. Works on any device: the scene auto-detects weak GPUs
(`src/lib/quality.ts`) and drops resolution/particle counts; smooth scrolling
is disabled for `prefers-reduced-motion` users.

## AI chat assistant

- `POST /api/chat` (server.js) proxies a message to **Google Gemini** using
  the `GEMINI_API_KEY` environment variable. The key never reaches the browser.
- If the key is missing or the call fails, the widget falls back to a built-in
  portfolio matcher (`src/lib/chat.ts`) — the chat always answers something.
- Enable the AI on Render: add `GEMINI_API_KEY` in the service's Environment
  settings. Locally: put it in a `.env` file (gitignored).

## Make it yours

**All content lives in one file: [`src/data/portfolio.ts`](src/data/portfolio.ts).**
Name, role, stats, the three case files, skills, socials and email all live
there; the DOM overlay, the 3D scene props and the chat answers read from it.
Project links currently point at the GitHub profile rather than individual
repositories; swap in real repo URLs as projects go public.

Other useful files:

| File | What it controls |
| --- | --- |
| `src/lib/paths.ts` | Camera waypoints, look targets, world positions of every 3D station |
| `src/components/scene/CameraRig.tsx` | Scroll→camera mapping (dwell-and-fly), damping, mouse parallax |
| `src/components/scene/SceneObjects.tsx` | Hero core + the floating cyber-tool models |
| `src/lib/quality.ts` | Device tier probe (`?quality=low` forces the lightweight tier) |
| `src/styles/global.css` | The whole visual system: colors, type, HUD panels, preloader |
| `scripts/remove-bg.mjs` | Regenerates the transparent hero cutout from `portrait.jpg` |
| `scripts/generate-hero.mjs` | Optional: AI-generates a cinematic hero image (`npm run hero`) |

## How the scroll journey works

- The page is 7 sections × 100svh in normal flow; the WebGL canvas is fixed
  behind it.
- One ScrollTrigger maps page progress (0→1) to `scrollState.progress` and
  drives the top scroll-progress hairline.
- The camera rides a Catmull-Rom spline through one waypoint per section. A
  dwell-and-fly remap holds the camera at each station while that section is on
  screen and glides to the next station near the section boundary.
- GSAP drives the DOM reveals (`[data-reveal]`), the preloader and the hero
  intro; Lenis smooths the wheel and feeds ScrollTrigger.

## Deploy

`npm run build` produces `dist/`; `npm start` runs `server.js`, which serves
`dist/` with SPA fallback plus the `/api/chat` proxy. Deploy as a Render web
service (build: `npm run build`, start: `npm start`). `/health` always returns
the app shell with HTTP 200 — point an uptime monitor at it to keep free
instances awake.

## Note

The previous static version of this site is preserved in [`legacy/`](legacy/).
