# Branch Design — Melville Library

Data template: [`../data/melville.template.json`](../data/melville.template.json)

## 1. Fantasy

You step from the campus map into a **schematic Melville floor plan**. You are recovering scattered archive echoes: hold-to-scan nodes that teach how the library—and Stony Brook’s knowledge culture—grew. One object opens a **1963 memory world**.

## 2. Gate conditions

Enter route `/building/melville` when:

```text
demoMode
OR (
  entrance geofence for melville satisfied
  AND (if features.requireOutdoorClaimBeforeEnter)
      outdoor site melville-library claimed
)
```

Exit always returns to `/map`.

## 3. Player verbs

| Verb | Implementation |
|------|----------------|
| Move | Tap hotspot to focus / walk avatar to hotspot |
| Hold | Press and hold `holdMs` (1000ms default) to scan |
| Jump | Enter `/world/melville-1963` |
| Read | Short copy panel after success |

Hotspot order is **free** (non-sequential) except the jump node which requires 3 prior flags.

## 4. Floor plan requirements

- Asset: `public/maps/melville-main.webp`
- Readable public areas only (lobby / atrium / iconic stacks edge) — not a full stack CAD
- North arrow optional
- Coordinate space: `x,y` in 0..1

## 5. Hotspot flow

```text
[enter]
   │
   ├─► open-stacks (hold) ─────────────────────┐
   ├─► melville-name (hold) ───────────────────┤
   ├─► expansion-wings (hold) ─────────────────┤── flags ≥3 ──► bridge-echo (jump)
   ├─► reading-room (hold) ────────────────────┤
   ├─► special-collections (hold) ─────────────┘
   │
   └─► completion when flags include all completeWhenFlags
```

## 6. Hotspot specifications

### 6.1 `open-stacks`

| Field | Value |
|-------|-------|
| Interaction | hold (1000ms) |
| Label | Open Stacks Echo |
| rewardFlag | `melville.openStacks` |
| Copy title | Stacks without gatekeepers |
| Copy body | Early campus library culture emphasized open stacks—knowledge meant to be walked, not locked away. |
| UI after | “Echo logged: Open Stacks” |

### 6.2 `melville-name`

| Field | Value |
|-------|-------|
| Interaction | hold |
| Label | The Melville Name |
| rewardFlag | `melville.naming` |
| Copy body | The library honors Frank Melville Jr., father of Ward Melville—the benefactor whose land gift made this campus possible. |

### 6.3 `expansion-wings`

| Field | Value |
|-------|-------|
| Interaction | hold |
| Label | Wings Around the Core |
| rewardFlag | `melville.expansion` |
| Copy body | A later expansion wrapped new wings around the original modular library, growing the building without erasing its first footprint. |

### 6.4 `reading-room`

| Field | Value |
|-------|-------|
| Interaction | hold |
| Label | Reading Room Pulse |
| rewardFlag | `melville.readingRoom` |
| Copy body | For generations of students, this building has been less a monument than a workplace—outlets, hours, and quiet persistence. |

### 6.5 `special-collections`

| Field | Value |
|-------|-------|
| Interaction | hold (optional upgrade to quiz later) |
| Label | Memory Vault |
| rewardFlag | `melville.specialCollections` |
| Copy body | Special Collections & University Archives keep the primary sources behind campus stories—timelines, photos, and institutional memory. |

### 6.6 `bridge-echo` (jump)

| Field | Value |
|-------|-------|
| Interaction | jump |
| requiresFlags | `melville.openStacks`, `melville.naming`, `melville.expansion` |
| Label | Bridge Echo |
| jumpToWorldId | `melville-1963` |
| rewardFlag | `melville.jumpStarted` |
| Locked copy | Scan three archive echoes first. |
| Unlocked copy | A seam opens toward 1963… |

## 7. Memory world — `melville-1963`

Route: `/world/melville-1963`

| Field | Value |
|-------|-------|
| Title | Melville 1963 |
| Tone | Modern UI with a single time chip: “1963” |
| Background | Stylized early library / open floor illustration |
| Exit | “Return to present” → Melville floor |

### World hotspots

1. **`world-card-catalog`** (hold) → flag `melville.world.catalog`  
   Copy: *Before search bars, discovery had drawers and patience.*

2. **`world-modular-plan`** (hold) → flag `melville.world.modular`  
   Copy: *The first library was modular on purpose—built to grow with a young university.*

3. **`world-return-seal`** (tap) → sets `melville.world.complete`, enables exit celebration  

## 8. Completion

`completeWhenFlags`:

```text
melville.openStacks
melville.naming
melville.expansion
melville.readingRoom
melville.specialCollections
melville.world.complete
```

On completion:

- Toast: “Melville branch complete”
- Map badge on library marker
- Optional cosmetic: map HUD corner accent

## 9. UI wireflow (screens)

1. Gate fail → toast + stay on map  
2. Floor plan + 6 dots  
3. Tap hotspot → detail card with Hold / Jump  
4. Hold success → fact card → dismiss  
5. Jump → world → 2 holds → complete → back  
6. When all flags true → completion modal → Return to campus  

## 10. Engineering tasks checklist

- [ ] `HoldInteract` component with cancel on pointer up early
- [ ] Flag merge helper `setFlag(progress, "melville", key)`
- [ ] `requiresFlags` gate for jump
- [ ] World router param validation
- [ ] Persist after each successful interaction
- [ ] Audio optional (mute by default)

## 11. Content sources (verify)

- Library history / archives timelines (SBU Libraries)
- Melville naming articles (Frank Melville Jr.)
- Campus mall / bridge history references for jump flavor only when accurate

## 12. Playtest script (10 minutes)

1. Demo Mode on → enter Melville  
2. Hold two nodes, force-refresh, confirm flags  
3. Attempt jump early → blocked  
4. Finish requirements → jump → complete world  
5. Confirm map shows branch complete  
6. Demo Mode off outdoors → verify entrance gate at real door  
