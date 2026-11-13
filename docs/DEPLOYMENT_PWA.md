# Deployment & PWA

## 1. Goals

- HTTPS URL playable on cellular outdoors
- Add-to-home-screen / installable PWA
- Zero paid server for v1 static app
- Fast iterate: deploy previews for field tests

## 2. Build

```bash
npm run build
# outputs dist/
```

Vite config should include `vite-plugin-pwa` with:

- `registerType: "autoUpdate"` (or prompt)
- Manifest:
  - `name`: from brand display name
  - `short_name`: `SB GO`
  - `theme_color`: `#990000`
  - `background_color`: `#f7f8fa`
  - `display`: `standalone`
  - `start_url`: `/`
  - icons 192 and 512 PNG

## 3. Hosting options (free tier)

| Host | Notes |
|------|-------|
| Cloudflare Pages | Excellent HTTPS + CDN |
| Vercel | Simple Git deploy |
| Netlify | Simple Git deploy |
| GitHub Pages | Fine for static; ensure SPA fallback |

### SPA fallback

All routes must serve `index.html` (History API). Configure host rewrites accordingly.

## 4. Outdoor test workflow

1. Push branch
2. Host creates preview URL
3. Testers open on phone cellular (not campus-only intranet assumptions)
4. Log GPS issues with site id + accuracy
5. Merge + production deploy when Zone batch passes

## 5. PWA install UX

### Android Chrome

- May show install prompt / “Add to Home screen”
- In-app hint button calling `beforeinstallprompt` when available

### iOS Safari

- No `beforeinstallprompt`
- Show instructions modal: Share → Add to Home Screen
- Test standalone display (`window.matchMedia('(display-mode: standalone)')`)

## 6. Caching policy

| Asset | Strategy |
|-------|----------|
| App shell JS/CSS | Precache with versioned filenames |
| `campus.webp` | Precache or cache-first |
| Site JSON/TS bundled | Comes with app bundle — redeploy to update content |
| Runtime API | None in v1 |

During heavy content sprints, prefer smaller frequent deploys over long-lived stale SW confusion. Document “hard refresh / reinstall” in Settings help.

## 7. Custom domain (optional)

Not required. `*.pages.dev` / `*.vercel.app` is enough. Custom domain ≈ annual DNS cost only.

## 8. Analytics (optional, off by default)

If added later: privacy-first, document in Settings, never required for gameplay.

## 9. Checklist before calling a deploy “field-ready”

- [ ] HTTPS
- [ ] Location permission flow works on iOS + Android
- [ ] Routes deep-linkable after refresh (`/map` refresh OK)
- [ ] Manifest icons valid
- [ ] Demo Mode accessible
- [ ] Version string visible in Settings
