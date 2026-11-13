# SB GO

Location-based campus ARG for **Stony Brook University Main / West Campus**.

Temporary product name: **SB GO** (`sb-go`). Rename later via `src/config/brand.ts` — see [docs/RENAMING.md](docs/RENAMING.md).

## Quick start

```bash
npm install
npm run dev
```

Open the local URL on a phone (same Wi‑Fi) or use Demo Mode in **Settings** for indoor demos.

```bash
npm run build
npm run preview
```

Deploy the `dist/` folder to any static HTTPS host (Cloudflare Pages, Vercel, Netlify, GitHub Pages) for outdoor GPS testing on cellular.

## What works in this build

- Campus map with Zone A–D starter stops (approx. coordinates — tune on site)
- GPS geofence claims + **Demo Mode** / fake position / snap-to-site
- Local save (`localStorage`)
- Melville Library indoor branch (hold + jump world)
- Wang Center indoor branch (sequential path + quiz + jump world)
- PWA manifest + service worker (`vite-plugin-pwa`)

## Documentation

Start with the master guide:

- [docs/DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md)

| Doc | Purpose |
|-----|---------|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Modules & data flow |
| [docs/BRAND_AND_UI.md](docs/BRAND_AND_UI.md) | Visual system |
| [docs/GEOLOCATION_SPEC.md](docs/GEOLOCATION_SPEC.md) | GPS / geofence |
| [docs/DATA_CAMPUS_SITES.md](docs/DATA_CAMPUS_SITES.md) | POI catalog |
| [docs/BRANCH_MELVILLE.md](docs/BRANCH_MELVILLE.md) | Melville design |
| [docs/BRANCH_WANG.md](docs/BRANCH_WANG.md) | Wang design |
| [docs/PHASE_PLAN.md](docs/PHASE_PLAN.md) | Build phases |
| [docs/QA_CHECKLIST.md](docs/QA_CHECKLIST.md) | Testing |
| [docs/DEPLOYMENT_PWA.md](docs/DEPLOYMENT_PWA.md) | Ship / PWA |

Machine-readable templates live in [`data/`](data/).

## Field testing tip

1. Deploy to HTTPS  
2. Enable location on the phone  
3. Walk campus; tune `lat` / `lng` / `radiusM` in `src/data/campusSites.ts`  
4. Use Settings → Demo Mode when presenting indoors  

## Stack

Vite · React · TypeScript · React Router · Zustand · vite-plugin-pwa
