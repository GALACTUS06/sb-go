# SB_GO — Master Development Guide (English)

**Product ID:** `sb-go`  
**Working title:** SB_GO / SB GO  
**Document type:** Digital build specification (Web + PWA)  
**Campus:** Stony Brook University — Main / West Campus  
**Audience for this doc:** Engineers, designers, content authors  

This is the **authoritative** digital development guide. Supplementary docs expand specific subsystems; if a conflict appears, prefer this guide plus the linked specialty doc for that subsystem.

---

## Table of contents

1. [Vision and scope](#1-vision-and-scope)
2. [Locked product decisions](#2-locked-product-decisions)
3. [Player experience](#3-player-experience)
4. [Technology stack](#4-technology-stack)
5. [Repository layout](#5-repository-layout)
6. [Domain model](#6-domain-model)
7. [Geolocation and geofencing](#7-geolocation-and-geofencing)
8. [Main line — campus coverage](#8-main-line--campus-coverage)
9. [Branch — Melville Library](#9-branch--melville-library)
10. [Branch — Wang Center](#10-branch--wang-center)
11. [UI / UX and brand](#11-ui--ux-and-brand)
12. [State, saves, and settings](#12-state-saves-and-settings)
13. [Routing and screens](#13-routing-and-screens)
14. [PWA and deployment](#14-pwa-and-deployment)
15. [Content pipeline](#15-content-pipeline)
16. [Engineering standards](#16-engineering-standards)
17. [Testing and QA](#17-testing-and-qa)
18. [Phased delivery](#18-phased-delivery)
19. [Future native apps](#19-future-native-apps)
20. [Risks and mitigations](#20-risks-and-mitigations)
21. [Definition of done](#21-definition-of-done)
22. [Document map](#22-document-map)

---

## 1. Vision and scope

### 1.1 Product one-liner

Players walk the real Stony Brook main campus with a modern mobile web app, claim GPS-gated story nodes across the grounds, and enter two deep building branches (**Melville Library**, **Wang Center**) with distinct interaction styles.

### 1.2 Goals

| Goal | Meaning in build terms |
|------|------------------------|
| Reason to visit | Outdoor claims require physical presence (geofence) |
| Learn the place | Each node carries short, verified cultural/historical facts |
| Freshman orientation | Broad campus coverage teaches routes and landmarks |
| Cultural fit | Goals, mechanics, rewards, and look align with SBU identity |
| Ship digitally | Playable HTTPS PWA; outdoor test without a tethered laptop |

### 1.3 In scope (v1 digital)

- Web application + Progressive Web App install/add-to-home-screen
- Campus-wide outdoor main line (as complete as practical)
- GPS hard gate for outdoor claims
- Melville indoor branch + Wang indoor branch
- Local save (`localStorage`)
- Demo / debug mode for indoor demos without walking
- Free static hosting (no paid server)

### 1.4 Out of scope (v1)

- True AR / indoor Z-axis GPS / beacons / Wi-Fi fingerprinting
- Physical QR stickers or any campus posting
- User accounts, cloud saves, leaderboards
- Paid VPS / custom backend
- App Store / Play Store release
- East Campus / Hospital as required content
- Course report, ePortfolio, or cardboard prototype requirements (tracked elsewhere by the team)

---

## 2. Locked product decisions

| Topic | Decision |
|-------|----------|
| Primary platform | **Web + PWA** |
| Later native | Optional Capacitor (or similar) wrapping the same web build |
| Outdoor gate | **GPS geofence required** (unless Demo Mode) |
| Indoor positioning | **No GPS floors**; entrance geofence → virtual floor plan |
| Indoor fantasy | Third-person / avatar-on-plan, **hold to interact**, **jump into memory worlds** (scene swap, not AR) |
| Branches first | **Melville + Wang** |
| Main line breadth | **Entire main campus as complete as possible**, shipped by zones |
| Visual style | **Modern**, SBU-aligned red primary, clean map-first UI |
| Name | Temporary **SB_GO**; rename via brand config ([RENAMING.md](./RENAMING.md)) |
| Cost model | Static host free tier; progress on device |

---

## 3. Player experience

### 3.1 Core loop

```text
Launch PWA
  → Campus map (player puck + site markers)
  → Select a target site
  → Walk in the real world
  → Enter geofence (marker becomes In Range)
  → Claim site (facts unlock, progress saved)
  → Optional: Enter Melville / Wang when entrance conditions met
  → Indoor hotspots (hold / quiz / jump)
  → Return to campus map
```

### 3.2 Outdoor site states

| State | Player meaning | UI |
|-------|----------------|----|
| `locked` | Not claimed; out of range | Neutral marker |
| `in_range` | Close enough to claim | Emphasized / green accent |
| `claimed` | Logged | SBU red check / filled marker |

### 3.3 Progression rules

- **Open order:** Any enabled outdoor site may be claimed when in range (no forced sequence).
- **Soft guidance:** `recommendedOrder` powers a “Suggested next” chip for new players.
- **Branch gate:** Enter building only if entrance geofence is satisfied **or** Demo Mode is on. Prefer also requiring the building’s outdoor node claimed (configurable flag `requireOutdoorClaimBeforeEnter`, default `true`).
- **Completion:** `% outdoor claimed`, `melvilleComplete`, `wangComplete`, optional `allComplete`.

### 3.4 Rewards (lightweight)

v1 rewards are **progress cosmetics**, not inventory combat:

- Claim flash + fact card
- Zone completion banners
- Branch completion map accents (border / badge)
- Percentage ring on map HUD

---

## 4. Technology stack

### 4.1 Chosen stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Language | TypeScript | Strict mode on |
| UI | React 18+ | Function components |
| Bundler | Vite | Fast HMR |
| Routing | React Router v6+ | Path-based screens |
| Optional state | Zustand **or** React context | Keep small |
| Persistence | `localStorage` | Schema versioned |
| Location | Browser Geolocation API | `watchPosition` |
| Map rendering | **Custom campus image + normalized coordinates** (default) | Avoid map API keys for v1 |
| Alt map | MapLibre later | Only if image map fails UX review |
| PWA | `vite-plugin-pwa` | Manifest + service worker |
| Hosting | Cloudflare Pages / Vercel / Netlify / GitHub Pages | HTTPS required |
| Package manager | npm (or pnpm if team agrees) | Lockfile committed |

### 4.2 Explicitly not primary for v1

- MIT App Inventor (allowed by some courses; not this product’s ship path)
- Expo Go as daily outdoor test harness (awkward off-Wi‑Fi; optional later)
- Unity / native Kotlin+Swift dual apps

### 4.3 Why Web + PWA for outdoor ARG

Develop on a computer; **test outdoors** by opening the deployed HTTPS URL on cellular data. No laptop tether, no rotating Expo QR session dependency.

### 4.4 Bootstrap commands (reference)

```bash
npm create vite@latest sb-go -- --template react-ts
cd sb-go
npm install
npm install react-router-dom
npm install -D vite-plugin-pwa
# optional: npm install zustand
npm run dev
```

Production:

```bash
npm run build
# deploy dist/ to static host
```

---

## 5. Repository layout

Target application structure (create during Phase 0–1):

```text
sb-go/
  public/
    icons/
    maps/
      campus.webp
      melville-main.webp
      wang-main.webp
    images/
  src/
    config/
      brand.ts
      geo.ts
      features.ts
    data/
      campusSites.ts          # or import JSON
      melville.ts
      wang.ts
      copy.ts
      zones.ts
    domain/
      types.ts
      distance.ts
      geofence.ts
      progress.ts
      completion.ts
    location/
      usePlayerLocation.ts
      permissions.ts
      demoLocation.ts
    storage/
      save.ts
      migrations.ts
    components/
      map/
      ui/
      indoor/
      debug/
    pages/
      HomePage.tsx
      CampusMapPage.tsx
      SitesListPage.tsx
      MelvillePage.tsx
      WangPage.tsx
      WorldPage.tsx
      SettingsPage.tsx
    styles/
      tokens.css
      global.css
    App.tsx
    main.tsx
  data/                       # design-time templates (this repo)
  docs/                       # this documentation set
  index.html
  vite.config.ts
  README.md
```

**Boundary rule:** `domain/` must not import React or `window`. `location/` is the only place that talks to Geolocation. UI imports domain + hooks.

---

## 6. Domain model

See also templates in `/data/*.template.json` and [DATA_CAMPUS_SITES.md](./DATA_CAMPUS_SITES.md).

### 6.1 Brand config

```ts
// src/config/brand.ts
export const GAME_ID = "sb-go";
export const GAME_DISPLAY_NAME = "SB GO";
export const STORAGE_KEY = `${GAME_ID}:progress:v1`;
```

### 6.2 Geo config

```ts
// src/config/geo.ts
export const DEFAULT_RADIUS_M = 50;
export const ENTRANCE_RADIUS_M = 60;
export const ACCURACY_WARN_M = 40;
export const WATCH_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 3000,
  timeout: 10000,
};
```

### 6.3 Feature flags

```ts
// src/config/features.ts
export const features = {
  requireOutdoorClaimBeforeEnter: true,
  showRecommendedNext: true,
  enablePwaInstallHint: true,
  enableDemoModeToggle: true,
};
```

### 6.4 Core types (canonical)

```ts
export type SiteCategory =
  | "academic"
  | "arts"
  | "life"
  | "landmark"
  | "residential"
  | "athletics"
  | "admin"
  | "nature";

export type ZoneId = "A" | "B" | "C" | "D" | "E";

export type CampusSite = {
  id: string;
  name: string;
  zone: ZoneId;
  category: SiteCategory;
  enabled: boolean;
  lat: number;
  lng: number;
  radiusM: number;
  mapX: number; // 0..1 left→right on campus.webp
  mapY: number; // 0..1 top→bottom
  blurb: string;
  facts: string[];
  recommendedOrder?: number;
  unlocksBuilding?: "melville" | "wang";
  isBuildingEntrance?: boolean;
  entranceFor?: "melville" | "wang";
  sources?: string[]; // URLs for content QA
};

export type IndoorInteraction = "hold" | "tap" | "quiz" | "jump";

export type IndoorHotspot = {
  id: string;
  x: number;
  y: number;
  label: string;
  interaction: IndoorInteraction;
  holdMs?: number;
  quiz?: {
    prompt: string;
    options: string[];
    answerIndex: number;
    hint?: string;
  };
  jumpToWorldId?: string;
  requiresFlags?: string[];
  rewardFlag: string;
  copy: string;
};

export type MemoryWorld = {
  id: string;
  title: string;
  backgroundKey: string;
  hotspots: IndoorHotspot[];
  exitLabel: string;
};

export type BuildingBranch = {
  id: "melville" | "wang";
  title: string;
  floorPlanKey: string;
  hotspots: IndoorHotspot[];
  worlds: MemoryWorld[];
  completeWhenFlags: string[];
  sequential?: boolean;
};

export type Progress = {
  version: 1;
  claimedSiteIds: string[];
  melville: { flags: Record<string, boolean> };
  wang: { flags: Record<string, boolean> };
  settings: { demoMode: boolean };
};
```

### 6.5 Distance

Implement haversine in meters in `domain/distance.ts`. Unit tests with known pairs (e.g., Library ↔ Wang approximate walking distance) are recommended.

### 6.6 Geofence helpers

```ts
isInRange(player, site, demoMode): boolean
listInRange(player, sites, demoMode): CampusSite[]
distanceToSite(player, site): number | null
nearestSite(player, sites): { site; meters } | null
```

---

## 7. Geolocation and geofencing

Full detail: [GEOLOCATION_SPEC.md](./GEOLOCATION_SPEC.md).

### 7.1 Permission UX

1. On first map enter, explain why location is needed (one short paragraph).
2. Request permission via `getCurrentPosition` / `watchPosition`.
3. If denied: show recovery steps (iOS Settings → Safari → Location) + enable Demo Mode for non-field demos.
4. Never silently claim sites without range or demo.

### 7.2 Watch lifecycle

- Start watch on `CampusMapPage` mount (or app-level while on outdoor routes).
- Clear watch on unmount / route leave if indoor-only (saves battery).
- Throttle UI updates (~1 Hz) even if GPS fires faster.

### 7.3 Accuracy handling

- If `coords.accuracy > ACCURACY_WARN_M`, show “GPS noisy” banner.
- Still allow claim if `distance <= radiusM` (do not hard-block on accuracy alone).
- Optionally require `distance + accuracy/2 <= radiusM` as a stricter mode behind a flag (default off).

### 7.4 Capturing site coordinates (field procedure)

1. Open Settings → Debug location readout on device.
2. Stand at the intended claim spot outdoors.
3. Record 3 samples over ~30 seconds; average lat/lng.
4. Paste into site data; set initial `radiusM` from table in geo spec.
5. Walk toward/away; adjust radius until false positives are rare.

### 7.5 Demo Mode

- Toggle in Settings.
- When on: all outdoor claims allowed; building enter allowed; debug fake coordinate optional.
- Persist in `Progress.settings.demoMode`.
- Visual banner: **DEMO MODE** so recordings are honest.

---

## 8. Main line — campus coverage

Full catalog: [DATA_CAMPUS_SITES.md](./DATA_CAMPUS_SITES.md) and `data/campusSites.template.json`.

### 8.1 Strategy

Ship **by zone**, not by random buildings:

| Zone | Focus | Priority |
|------|-------|----------|
| A | Academic Mall core + arts/culture hubs | P0 — must |
| B | Landmarks & traditions | P0/P1 |
| C | Residential life | P1 |
| D | Athletics & edge nature | P2 |
| E | Admin / arrival orientation | P2 |

`enabled: false` keeps unfinished POIs in data without showing them.

### 8.2 Outdoor map implementation details

1. Export or crop a north-up campus raster (`public/maps/campus.webp`).
2. Place the image in a letterboxed map stage; record aspect ratio.
3. For each site, compute `mapX/mapY` by clicking a placement tool (build a tiny internal plotter page under `/settings/plotter` during development).
4. Render markers with CSS `left: mapX*100%`, `top: mapY*100%`, translate (-50%, -100%) for pin anchors.
5. Player puck uses a **linear mapping assumption**: convert lat/lng to mapX/mapY via an affine calibration.

### 8.3 Lat/lng → map calibration (required detail)

Because the art is a static image, implement a calibration block in `config/geo.ts` or `data/mapCalibration.ts`:

```ts
export type MapCalibration = {
  // Three or four surveyed control points: lat/lng paired with mapX/mapY
  // Use least-squares affine fit, or simpler bilinear bounds if map is near-rectilinear
  controlPoints: Array<{ lat: number; lng: number; mapX: number; mapY: number }>;
};
```

**Minimum viable approach:** use geographic bounding box of the image corners (NW, NE, SW, SE measured on site or from known GIS). Linear interpolate:

```text
mapX = (lng - lngWest) / (lngEast - lngWest)
mapY = (latNorth - lat) / (latNorth - latSouth)
```

Refine with control points if buildings drift.

### 8.4 Site sheet UX

- Title, live distance, category chip, blurb
- Primary button **Claim** (disabled out of range)
- After claim: facts list, sources optional footnote, Enter Building CTA if applicable

### 8.5 List / zones UX

- `/sites` filters by zone, claimed status, category
- Sort: recommended order, distance, A–Z

---

## 9. Branch — Melville Library

Full design: [BRANCH_MELVILLE.md](./BRANCH_MELVILLE.md), data: `data/melville.template.json`.

### 9.1 Fantasy

Archive dive — hold-scan knowledge nodes; one jump into a 1963 memory layer.

### 9.2 Mechanics differences vs Wang

| | Melville | Wang |
|--|----------|------|
| Structure | Mostly free hotspot order | Prefer sequential path |
| Dominant verb | Hold / scan | Move / align / short quiz |
| Tone | Knowledge, stacks, naming | Space, garden, ritual arrival |

### 9.3 Implementation checklist

- [ ] Floor plan asset
- [ ] Avatar or focus cursor snaps to hotspots
- [ ] `HoldButton` with `holdMs` (default 1000)
- [ ] Flag writes into `progress.melville.flags`
- [ ] Jump route `/world/melville-1963`
- [ ] Completion when `completeWhenFlags` all true
- [ ] Return to map preserves outdoor GPS watch policy

---

## 10. Branch — Wang Center

Full design: [BRANCH_WANG.md](./BRANCH_WANG.md), data: `data/wang.template.json`.

### 10.1 Fantasy

Spatial ritual — courtyard, water, bridge, tower; one mirror-garden jump world.

### 10.2 Sequential gate

If `sequential: true`, hotspot N requires flags from earlier path nodes (`requiresFlags`).

### 10.3 Optional observation quiz

Quizzes ask about **public, durable** visual facts. No stickers. Provide 3 options + optional hint. Wrong answer does not soft-lock; allow retry.

---

## 11. UI / UX and brand

Full tokens and screen specs: [BRAND_AND_UI.md](./BRAND_AND_UI.md).

### 11.1 Principles

- Map-first, modern product UI
- SBU red for primary CTAs and claimed accents
- One job per screen
- Large tap targets (min ~44px)
- Motion: claim pulse, route fade into building, hold ring — stop there

### 11.2 Accessibility

- Visible focus rings
- Do not rely on color alone for claimed vs locked (use icon + label)
- Respect `prefers-reduced-motion`

---

## 12. State, saves, and settings

### 12.1 Save format

- Key: `STORAGE_KEY` from brand config
- JSON `Progress` with `version: 1`
- On load: validate shape; if corrupt, reset with toast
- `migrations.ts` ready for `version: 2+`

### 12.2 Writes

Debounce writes (300ms) after claim/flag changes. Flush immediately on `visibilitychange` hidden / `pagehide`.

### 12.3 Settings page must include

- Demo Mode toggle
- Reset progress (confirm modal)
- GPS status: lat, lng, accuracy, permission state
- Distances to nearest 5 sites
- App version / git sha if available
- Display name (read-only from brand)

---

## 13. Routing and screens

| Path | Page | Responsibilities |
|------|------|------------------|
| `/` | Home | Start / Continue, short pitch |
| `/map` | Campus map | Markers, puck, sheets, suggested next |
| `/sites` | Directory | Filters, search |
| `/building/melville` | Melville | Indoor loop |
| `/building/wang` | Wang | Indoor loop |
| `/world/:worldId` | Memory world | Jump scenes |
| `/settings` | Settings / debug | Demo, GPS, reset |
| `/settings/plotter` | Dev-only plotter | Place mapX/mapY (hide in prod build via flag) |

Guard indoor routes: if not allowed, redirect to `/map` with toast.

---

## 14. PWA and deployment

Full steps: [DEPLOYMENT_PWA.md](./DEPLOYMENT_PWA.md).

### 14.1 Requirements

- HTTPS origin
- Web App Manifest (name, icons 192/512, `theme_color`, `display: standalone`)
- Service worker caches app shell
- Install / Add to Home Screen hints (iOS + Android copy differs)

### 14.2 Outdoor test workflow

```text
Commit → deploy preview URL → walk campus on cellular → file issues → fix → redeploy
```

### 14.3 Environment

- No secrets required for v1
- Optional `import.meta.env.VITE_APP_VERSION`

---

## 15. Content pipeline

Full procedure: [CONTENT_PIPELINE.md](./CONTENT_PIPELINE.md).

Every outdoor site must pass:

1. Real coordinates captured
2. `mapX/mapY` placed
3. Blurb + 1–3 facts
4. Source links where historical claims are made
5. Walk-tested claim
6. `enabled: true`

Preferred sources: University Archives, Building Name Inventory, Campus Landmarks, official building pages, library history timelines.

---

## 16. Engineering standards

### 16.1 TypeScript

- `"strict": true`
- No `any` without comment
- Prefer discriminated unions for interactions

### 16.2 React

- Controlled small components
- Location subscription in dedicated hook
- Avoid putting haversine math inside JSX

### 16.3 Git

- Conventional, short commits
- Do not commit secrets (none expected)
- Large binary maps: compress WebP; avoid 20MB PNG

### 16.4 Code review checklist (per PR)

- [ ] Domain logic unit-tested or manually verified
- [ ] No geofence bypass except Demo Mode
- [ ] Copy tone modern and accurate
- [ ] Mobile layout checked at 390×844

---

## 17. Testing and QA

Use [QA_CHECKLIST.md](./QA_CHECKLIST.md) before each zone release.

### 17.1 Device matrix (minimum)

- iPhone Safari (cellular)
- Android Chrome (cellular)
- Desktop Chrome (Demo Mode only for UI)

### 17.2 Field test script

1. Clear site data / reset progress
2. Deny location once → confirm messaging
3. Allow location → confirm puck moves
4. Approach a site from >2× radius → cannot claim
5. Enter radius → claim → refresh → still claimed
6. Enter Melville/Wang → complete one hold → kill tab → resume
7. Jump world enter/exit
8. Add to Home Screen → relaunch → save intact

---

## 18. Phased delivery

See [PHASE_PLAN.md](./PHASE_PLAN.md) for task-level breakdown.

Summary:

0. Skeleton + deploy  
1. Location core + one test claim  
2. Map UX  
3. Zone A data  
4. Melville  
5. Wang  
6. Zones B–E fill  
7. PWA polish  
8. Hardening  

---

## 19. Future native apps

See [FUTURE_NATIVE.md](./FUTURE_NATIVE.md).

Short version: keep domain pure; later wrap with Capacitor for Android/iOS shells. PWA remains the always-on free surface. iOS store distribution may require Apple Developer Program fees — not needed for v1.

---

## 20. Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Indoor GPS useless | Virtual plans after entrance gate |
| GPS drift / urban canyon | Larger radii, accuracy banner, demo mode |
| iOS permission confusion | Explicit settings copy |
| Scope explosion (whole campus) | Zone `enabled` flags; P0 Zone A first |
| Map image mis-calibration | Control points + plotter page |
| Content inaccuracy | Sources field + archives links |
| Team renames product | Single brand config |
| Service worker serving stale data | Versioned SW; network-first for JSON data during content sprints |

---

## 21. Definition of done (digital v1)

1. Public HTTPS PWA opens on iOS and Android browsers  
2. Outdoor geofence claims work in the field for Zone A (all enabled)  
3. Zones B–E have maximum practical coverage enabled  
4. Melville branch completable (holds + ≥1 jump world)  
5. Wang branch completable (path/quiz + ≥1 jump world)  
6. Progress persists locally; reset works  
7. Demo Mode available for presentations  
8. Modern SBU-aligned UI applied consistently  
9. README explains: install deps, run locally, deploy, add a site, capture GPS  
10. QA checklist signed off for a full mall walk + both buildings  

---

## 22. Document map

| Need | Open |
|------|------|
| Architecture boundaries | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Colors, type, screens | [BRAND_AND_UI.md](./BRAND_AND_UI.md) |
| GPS details | [GEOLOCATION_SPEC.md](./GEOLOCATION_SPEC.md) |
| Every outdoor POI | [DATA_CAMPUS_SITES.md](./DATA_CAMPUS_SITES.md) |
| Melville design + copy | [BRANCH_MELVILLE.md](./BRANCH_MELVILLE.md) |
| Wang design + copy | [BRANCH_WANG.md](./BRANCH_WANG.md) |
| Writing facts | [CONTENT_PIPELINE.md](./CONTENT_PIPELINE.md) |
| Ship URL / PWA | [DEPLOYMENT_PWA.md](./DEPLOYMENT_PWA.md) |
| Tests | [QA_CHECKLIST.md](./QA_CHECKLIST.md) |
| Schedule | [PHASE_PLAN.md](./PHASE_PLAN.md) |
| Rename | [RENAMING.md](./RENAMING.md) |
| Native later | [FUTURE_NATIVE.md](./FUTURE_NATIVE.md) |

---

## Appendix A — Player-facing microcopy bank (starter)

| Key | Copy |
|-----|------|
| permission.title | Enable location to claim campus stops |
| permission.body | SB GO uses your GPS only to detect when you arrive at story locations. Progress stays on this device. |
| claim.disabled | Walk closer to claim this stop |
| claim.enabled | Claim stop |
| claim.done | Logged to your campus run |
| gps.noisy | GPS is noisy here — wait a few seconds or move to open sky |
| demo.banner | Demo Mode on — distance checks bypassed |
| enter.melville | Enter Melville |
| enter.wang | Enter Wang Center |
| branch.locked | Reach the entrance to enter this building |

---

## Appendix B — Coordinate scratch pad

Use while field surveying:

```text
site id:
sample1 lat,lng,acc:
sample2 lat,lng,acc:
sample3 lat,lng,acc:
averaged lat,lng:
chosen radiusM:
mapX / mapY:
tester:
date:
```

---

*End of master development guide.*
