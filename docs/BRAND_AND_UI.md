# Brand & UI Specification

## 1. Direction

**Modern, map-first, Stony Brook–aligned.**  
Clean surfaces, strong typography hierarchy, red primary CTAs. Not archival sepia, not purple gradients, not sticker-bomb AR clutter.

Before shipping publicly, reconcile hex values with the official [Stony Brook brand resources](https://www.stonybrook.edu/brand/) / MARCOM guidance. Tokens below are **working engineering defaults**.

## 2. Color tokens

```css
:root {
  --sbu-red: #990000;
  --sbu-red-dark: #6e0000;
  --sbu-red-soft: #f6e8e8;
  --navy: #003366;
  --ink: #1a1a1a;
  --muted: #5c6570;
  --line: #e2e5ea;
  --surface: #f7f8fa;
  --surface-elevated: #ffffff;
  --success: #0b6e4f;
  --warning: #9a6b00;
  --danger: #a32020;
  --map-dim: rgba(26, 26, 26, 0.28);
  --shadow: 0 8px 24px rgba(26, 26, 26, 0.12);
}
```

### Semantic use

| Token | Use |
|-------|-----|
| `--sbu-red` | Primary buttons, claimed markers, progress accents |
| `--success` | In-range state |
| `--navy` | Secondary headers / links (sparingly) |
| `--surface` | App background |
| `--ink` / `--muted` | Text |

## 3. Typography

- **UI / body:** `DM Sans` or `Source Sans 3` (Google Fonts)  
- **Fallback:** `system-ui, sans-serif`  
- **Avoid** as primary: Inter-as-cliché is acceptable if already in stack; prefer distinctive but readable grotesques  
- Sizes (mobile): 12 / 14 / 16 / 20 / 28  
- Line length on sheets: short paragraphs ≤ ~90 words per blurb

## 4. Elevation & shape

- Radius: 12px sheets, 999px pills only for small chips (use sparingly)
- Hairline borders `--line`; one soft shadow on sheets
- No multi-layer neon glow

## 5. Iconography

- Simple line icons (lucide or similar)
- Claimed = check in red circle
- In range = radar / target
- Building enter = door / arrow-in

## 6. Map visual spec

- Full-bleed map stage under a compact top HUD (completion %, GPS chip)
- Markers:
  - Locked: outlined neutral
  - In range: success fill pulse (respect reduced motion → static ring)
  - Claimed: red fill + check
- Selected marker: larger, sheet open
- Player puck: white center, navy ring, translucent accuracy circle optional

## 7. Motion

| Motion | Spec |
|--------|------|
| Claim | 200–300ms scale + red flash bar |
| Enter building | 250ms fade / subtle zoom |
| Hold | Circular progress 0→1 over `holdMs` |
| Reduced motion | Instant state swap, no pulse |

## 8. Screen layouts

### Home `/`

- Display name (`GAME_DISPLAY_NAME`)
- One sentence pitch
- Primary: Start / Continue
- Secondary: Settings
- No cluttered feature grid

### Map `/map`

- Top HUD: progress ring, demo banner if on
- Map canvas
- Bottom: suggested next chip OR open site sheet
- FAB optional: locate me (re-center)

### Site sheet

- Handle / title / distance
- Blurb
- Claim CTA
- Facts after claim
- Enter building CTA if unlocked

### Indoor

- Floor plan full area
- Top: building title + exit
- Hotspot dots
- Hold overlay modal
- Quiz modal
- Jump transition full screen

### Settings

- Group: Location, Progress, Developer
- Dangerous reset behind confirm

## 9. Component inventory

| Component | Behavior |
|-----------|----------|
| `Button` | primary / secondary / ghost / danger |
| `Chip` | zone, category, state |
| `SiteMarker` | three states |
| `PlayerPuck` | position + accuracy |
| `SiteSheet` | snap points |
| `HoldInteract` | press-and-hold ring |
| `QuizModal` | 3 options |
| `Banner` | demo / gps noisy / permission |
| `ProgressRing` | outdoor % |

## 10. Responsive rules

- Design mobile-first at 390×844
- Max content width 480px centered on large screens (map can stay wider)
- Landscape: keep sheet usable; avoid broken indoor controls

## 11. Voice & tone

- Second person, modern, concise
- Prefer “stop / run / log” over purple fantasy prose on outdoor nodes
- Indoor jump worlds may be slightly more atmospheric while staying readable
