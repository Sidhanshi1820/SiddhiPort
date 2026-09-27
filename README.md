# SECOPS.PORTFOLIO — Immersive 3D Portfolio

A scroll-driven WebGL journey: the whole page is one continuous Three.js scene.
As you scroll, the camera flies through a dark sci-fi data corridor, docking at
each portfolio section — hero core → identity → case files → protocol ring →
uplink beacon.

Built with **React 19 + TypeScript + Vite**, **Three.js** (via React Three
Fiber), **GSAP ScrollTrigger** for choreography, **Lenis** for smooth scrolling,
and a custom post-processing stack (bloom, chromatic aberration, vignette).

## Quick start

```bash
npm install
npm run dev      # → http://localhost:5173
npm run build    # typecheck + production build into dist/
npm run preview  # serve the production build locally
```

Requires Node 18+. Best viewed on a desktop browser with a discrete GPU; it
also works on mobile (touch scroll, capped device pixel ratio).

## Make it yours

**All content lives in one file: [`src/data/portfolio.ts`](src/data/portfolio.ts).**
Name, role, stats, the three case files, skills, socials, email — edit there and
the DOM overlay *and* the 3D scene (slab titles/accents, protocol ring labels)
update together. Fields marked `⚠️ PLACEHOLDER` still need your real identity.

Other useful files:

| File | What it controls |
| --- | --- |
| `src/lib/paths.ts` | Camera waypoints, look targets, world positions of every 3D station |
| `src/components/scene/CameraRig.tsx` | Scroll→camera mapping (dwell-and-fly), damping, mouse parallax |
| `src/components/scene/*.tsx` | One file per 3D set piece (hero core, slabs, ring, portal…) |
| `src/styles/global.css` | The whole visual system: colors, type, HUD panels, cursor, preloader |

## How the scroll journey works

- The page is 7 sections × 100vh in normal flow; the WebGL canvas is fixed behind it.
- One ScrollTrigger maps page progress (0→1) to `scrollState.progress`.
- The camera rides a Catmull-Rom spline through one waypoint per section. A
  dwell-and-fly remap holds the camera at each station while that section is on
  screen and glides to the next station near the section boundary.
- GSAP drives the DOM reveals (`[data-reveal]`), the preloader, and the hero
  intro; Lenis smooths the wheel and feeds ScrollTrigger.

## Deploy

`npm run build` produces a static `dist/` folder — host it anywhere
(Netlify, Vercel, GitHub Pages, nginx). No backend needed.

## Note

The previous static version of this site is preserved in [`legacy/`](legacy/).
