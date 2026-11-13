# Phase Plan

Estimated effort assumes 2–3 builders part-time. Adjust freely; order matters more than dates.

## Phase 0 — Skeleton (0.5–1 day)

**Exit criteria:** HTTPS hello-world deploy opens on a phone.

- [ ] Scaffold Vite React TS
- [ ] React Router shell pages
- [ ] `brand.ts`, `tokens.css`
- [ ] README scripts: `dev`, `build`, `preview`
- [ ] Deploy `dist/` to static host

## Phase 1 — Location core (1–2 days)

**Exit criteria:** One test site claimable in the field OR via Demo Mode.

- [ ] `usePlayerLocation`
- [ ] Haversine + `isInRange`
- [ ] Settings GPS debug panel
- [ ] Demo Mode
- [ ] `Progress` save/load
- [ ] Single hard-coded test site near a convenient door

## Phase 2 — Campus map UX (2–3 days)

**Exit criteria:** Image map with marker states + claim sheet feels good indoors with Demo Mode.

- [ ] `campus.webp` placeholder art
- [ ] Map calibration config
- [ ] Markers + player puck
- [ ] Site sheet
- [ ] Completion ring
- [ ] Dev plotter page for mapX/mapY

## Phase 3 — Zone A data (2–4 days)

**Exit criteria:** Zone A mall walk claims ≥12 enabled sites including Melville + Wang outdoor nodes.

- [ ] Survey coordinates
- [ ] Write blurbs/facts/sources
- [ ] Radii tuned
- [ ] QA checklist Zone A signed

## Phase 4 — Melville branch (2–3 days)

**Exit criteria:** Full branch completable in Demo Mode; entrance gate works once outdoors.

- [ ] Floor plan
- [ ] Hotspots + Hold
- [ ] Jump world `melville-1963`
- [ ] Completion badge

## Phase 5 — Wang branch (2–3 days)

**Exit criteria:** Sequential path + quiz + mirror world completable.

- [ ] Floor plan
- [ ] Sequential gates
- [ ] Quiz verified on site
- [ ] Jump world `wang-mirror`
- [ ] Completion badge

## Phase 6 — Rest of campus (ongoing)

**Exit criteria:** Zones B/C substantially enabled; D/E stretch.

- [ ] Zone B landmarks
- [ ] Zone C residential pins
- [ ] Zone D/E stretch goals
- [ ] Per-batch QA

## Phase 7 — PWA polish (1 day)

- [ ] Manifest/icons
- [ ] Install hints iOS/Android
- [ ] SW strategy verified
- [ ] Settings help copy

## Phase 8 — Hardening (1–2 days)

- [ ] Permission edge cases
- [ ] Performance pass on mid phone
- [ ] Reduced motion
- [ ] Final mall + both buildings field run
- [ ] Definition of Done review ([DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) §21)

## Parallelization

| Track | Owner focus |
|-------|-------------|
| Track Geo | Phases 1, geo QA |
| Track Map/UI | Phases 2, 7 |
| Track Content | Phases 3, 6 |
| Track Indoor | Phases 4–5 |

## Definition of Done gate

Do not call v1 “done” until [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) §21 is satisfied and [QA_CHECKLIST.md](./QA_CHECKLIST.md) has a PASS field sign-off for Zone A + both branches.
