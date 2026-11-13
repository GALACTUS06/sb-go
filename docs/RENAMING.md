# Renaming SB_GO

Temporary identifiers are intentional. Renaming later is low cost if you keep a single brand config.

## What to change

| Location | Example | Difficulty |
|----------|---------|------------|
| `src/config/brand.ts` → `GAME_DISPLAY_NAME` | `"SB GO"` → final title | Trivial |
| `index.html` `<title>` | reads from brand or static | Trivial |
| PWA `manifest.name` / `short_name` | via `vite.config.ts` PWA plugin | Trivial |
| `package.json` `"name"` | `sb-go` | Trivial |
| GitHub repository name | Settings → Rename | Easy (update local `git remote`) |
| Folder name on disk | optional | Easy |
| Marketing copy in `src/data/copy.ts` | search display name | Easy |
| Screenshots / store listings | later native only | Medium |

## Rules

1. Never hardcode the final fantasy title in dozens of components.
2. Use `GAME_ID` (`sb-go`) for storage keys / analytics ids.
3. Use `GAME_DISPLAY_NAME` for all player-visible strings.
4. After rename, bump PWA cache / version so installed icons refresh.

## Storage key stability

If you change `GAME_ID`, old `localStorage` saves will not load (acceptable) unless you add a migration map.
