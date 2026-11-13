# Branch Design — Charles B. Wang Center

Data template: [`../data/wang.template.json`](../data/wang.template.json)

## 1. Fantasy

You enter a **spatial ritual**: courtyard, water, bridge, tower. Unlike Melville’s free archive scanning, Wang teaches with **path order** and one observation quiz. A final seam opens into the **Mirror Garden** memory world.

## 2. Gate conditions

Same pattern as Melville for `/building/wang`:

```text
demoMode
OR (
  wang entrance geofence
  AND outdoor wang-center claimed (if feature flag)
)
```

## 3. Differentiation matrix

| Dimension | Melville | Wang |
|-----------|----------|------|
| Order | Free | **Sequential path** |
| Dominant mechanic | Hold scan | Hold + **quiz** + path |
| Metaphor | Archive / time layers | Garden / arrival ritual |
| Jump world | 1963 library | Mirror garden |

## 4. Floor plan requirements

- Asset: `public/maps/wang-main.webp`
- Emphasize outdoor/indoor public path students actually walk (courtyard, bridge, tower view, gallery edge)
- Labels subtle; hotspots carry names

## 5. Sequential path flow

```text
gate-arrival (hold)
   → courtyard-water (hold)
      → arch-bridge (hold)
         → pagoda-tower (quiz)
            → gallery-wing (hold)
               → jasmine-edge (hold)
                  → mirror-garden (jump) → world wang-mirror
                     → completion
```

Each step lists `requiresFlags` of the previous reward flag.

## 6. Hotspot specifications

### 6.1 `gate-arrival`

| Field | Value |
|-------|-------|
| Interaction | hold 900ms |
| Label | Threshold |
| rewardFlag | `wang.arrival` |
| requiresFlags | none |
| Copy | The Wang Center is not only a building—it is an arrival into a cultural threshold on campus. |

### 6.2 `courtyard-water`

| Field | Value |
|-------|-------|
| requiresFlags | `wang.arrival` |
| Label | Courtyard Water |
| rewardFlag | `wang.water` |
| Copy | Water and planted courts slow the campus rush—space designed for pause as much as passage. |

### 6.3 `arch-bridge`

| Field | Value |
|-------|-------|
| requiresFlags | `wang.water` |
| Label | Arch Bridge |
| rewardFlag | `wang.bridge` |
| Copy | The arched bridge and garden paths borrow temple-garden memory without leaving Long Island. |

### 6.4 `pagoda-tower` (quiz)

| Field | Value |
|-------|-------|
| Interaction | quiz |
| requiresFlags | `wang.bridge` |
| Label | Tower Sightline |
| rewardFlag | `wang.tower` |
| Prompt | What crowning gesture marks the Wang Center’s skyline identity? |
| Options (starter — **verify on site before lock**) | A) An octagonal tower form / B) A Gothic spire / C) A stadium light mast |
| answerIndex | 0 (update if wording changes after photo survey) |
| Hint | Look for the vertical lantern-like tower volume. |
| Success copy | The tower reads as a modern pagoda abstraction—an intentional silhouette. |
| Fail copy | Not quite—study the roofline and try again. |

**Important:** Finalize quiz answers with an on-site photo survey so the prompt matches what players can actually see from the hotspot’s intended standing area. If the standing area cannot see the tower, rewrite the quiz to a visible durable detail (material, bridge, water court).

### 6.5 `gallery-wing`

| Field | Value |
|-------|-------|
| requiresFlags | `wang.tower` |
| Label | Gallery Wing |
| rewardFlag | `wang.gallery` |
| Copy | Galleries and performance spaces make the center a living venue—not a sealed monument. |

### 6.6 `jasmine-edge`

| Field | Value |
|-------|-------|
| requiresFlags | `wang.gallery` |
| Label | Campus Crossroads |
| rewardFlag | `wang.crossroads` |
| Copy | Food, friends, and foot traffic meet culture here—the building stitches daily student life to global arts. |

### 6.7 `mirror-garden` (jump)

| Field | Value |
|-------|-------|
| Interaction | jump |
| requiresFlags | `wang.crossroads` |
| Label | Mirror Seam |
| jumpToWorldId | `wang-mirror` |
| rewardFlag | `wang.jumpStarted` |
| Copy | The garden doubles. Step through. |

## 7. Memory world — `wang-mirror`

Route: `/world/wang-mirror`

| Field | Value |
|-------|-------|
| Title | Mirror Garden |
| Visual | Symmetry, quiet, high negative space, modern still |
| Exit | “Step back” |

### World hotspots

1. **`mirror-lantern`** (hold) → `wang.world.lantern`  
   Copy: *Light held in glass—modern craft echoing paper-screen memory.*

2. **`mirror-still-water`** (hold) → `wang.world.water`  
   Copy: *Reflection is a kind of archive: the campus seen twice.*

3. **`mirror-seal`** (tap) → `wang.world.complete`

## 8. Completion flags

```text
wang.arrival
wang.water
wang.bridge
wang.tower
wang.gallery
wang.crossroads
wang.world.complete
```

Completion toast: “Wang Center branch complete”

## 9. UI specifics

- Show a **path progress** stepper (1–6) on Wang floor HUD (Melville does not need this)
- Locked hotspots appear dim with lock icon; tap explains missing prior flag
- Quiz modal: large options, no timer
- Jump uses same WorldPage shell as Melville with different data

## 10. Engineering checklist

- [ ] Sequential unlock evaluator
- [ ] QuizModal with retry
- [ ] Shared IndoorShell component parameterized by branch id
- [ ] Stepper component
- [ ] On-site quiz verification task in content pipeline

## 11. Content sources (verify)

- Official Wang Center mission / about pages
- Architecture notes (P.H. Tuan; materials; tower/garden metaphors)
- Campus coverage of opening (2002) and cultural programming

## 12. Playtest script (12 minutes)

1. Demo enter Wang  
2. Try to skip ahead → locked messaging  
3. Walk path; fail quiz once → retry  
4. Jump world complete  
5. Confirm map badge  
6. Real entrance geofence test outdoors  
