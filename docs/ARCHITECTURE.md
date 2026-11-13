# Architecture

## 1. High-level diagram

```text
┌─────────────────────────────────────────────────────────┐
│                      Presentation                        │
│  pages/ + components/map|ui|indoor|debug                 │
└─────────────┬───────────────────────────┬───────────────┘
              │                           │
              ▼                           ▼
┌─────────────────────────┐   ┌───────────────────────────┐
│ location/               │   │ storage/                  │
│ usePlayerLocation       │   │ save / migrations         │
│ permissions, demo       │   │ localStorage              │
└─────────────┬───────────┘   └─────────────▲─────────────┘
              │                             │
              ▼                             │
┌───────────────────────────────────────────┴─────────────┐
│ domain/                                                  │
│ types, distance, geofence, progress, completion          │
│ (no React, no window)                                    │
└───────────────────────────▲─────────────────────────────┘
                            │
┌───────────────────────────┴─────────────────────────────┐
│ data/ + config/                                          │
│ campusSites, melville, wang, copy, brand, geo, features  │
└─────────────────────────────────────────────────────────┘
```

## 2. Runtime data flow (outdoor claim)

```text
Geolocation event
  → usePlayerLocation updates {lat,lng,accuracy,timestamp}
  → CampusMap computes distances via domain/geofence
  → Marker state locked | in_range | claimed
  → User taps Claim
  → domain/progress.claimSite(progress, siteId)
  → storage.save(progress)
  → UI re-render
```

## 3. Runtime data flow (building enter)

```text
User taps Enter Melville/Wang
  → Guard: demoMode OR (entrance in range AND outdoor claimed if flag)
  → Navigate to /building/...
  → Stop or pause outdoor watch (optional battery policy)
  → Hotspot interactions set flags
  → If jump: navigate /world/:id with return path
  → On completeWhenFlags: mark branch complete in derived selectors
```

## 4. Module responsibilities

| Module | May import | Must not |
|--------|------------|----------|
| `domain/` | other domain, types only | React, DOM, geolocation |
| `data/` | JSON/TS literals | React |
| `location/` | domain, config | pages |
| `storage/` | domain types, brand | pages |
| `components/` | domain selectors, hooks | direct localStorage |
| `pages/` | components, hooks, data | raw haversine duplicates |

## 5. Derived state (do not persist)

Compute on the fly from `Progress` + data files:

- `isSiteClaimed(id)`
- `outdoorCompletionRatio`
- `isMelvilleComplete`
- `isWangComplete`
- `suggestedNextSite(player)`

## 6. Error boundaries

- Location errors → Settings guidance, not blank map
- Save parse errors → reset + toast
- Unknown `worldId` → redirect `/map`
- Missing map asset → visible placeholder + console error

## 7. Performance budgets

- Campus image ≤ ~800KB WebP target
- Aim 60fps marker interactions on mid-tier phones
- Debounce save writes
- Avoid re-rendering all markers on every GPS tick: store player pos in ref + rAF batch, or memo markers by state key

## 8. Security / privacy

- No accounts
- No third-party tracking required
- Location never uploaded in v1
- Document privacy one-liner in Settings: “Location stays on your device.”

## 9. Extensibility points

- New outdoor site = data only
- New indoor hotspot = data only
- New building branch = new data module + page clone of Melville/Wang shell
- Native shell later = Capacitor around same `dist/`
