# Content Pipeline

How every outdoor site and indoor line of copy gets from idea → enabled in production.

## 1. Roles

| Role | Responsibility |
|------|----------------|
| Surveyor | Captures lat/lng, photos, mapX/mapY, radius feel |
| Writer | Blurb + facts + indoor copy |
| Verifier | Checks facts against sources |
| Engineer | Merges data, deploys, enables flag |

## 2. Outdoor site workflow

```text
Draft row (enabled:false, placeholder:true)
  → Field survey (coords, photos, signage names)
  → Place on campus.webp (plotter)
  → Write blurb/facts
  → Add sources for historical claims
  → Walk-test geofence
  → Peer verify names/facts
  → enabled:true, placeholder:false
  → Deploy + cellular retest
```

## 3. Writing rules

- **Blurb:** 1 sentence, modern, second person or neutral imperative
- **Facts:** 1–3 bullets; no unsourced precise years
- If unsure of a year, write functional truth (“engineering teaching complex”) instead of inventing history
- Do not encourage vandalism (boulders painting must mention permission culture)
- Avoid inner-room secrets that require restricted access

## 4. Photo rules (reference only)

- Public exteriors OK
- Do not photograph into secured labs, residences interiors, or ID-gated areas for gameplay requirements
- Store reference photos outside the repo or in `docs/references/` if needed (watch personal privacy)

## 5. Indoor copy rules

- Short paragraphs (≤ 40 words ideal)
- Hold success always teaches one concrete idea
- Quizzes must be answerable from a public vantage
- Jump worlds may be stylized but must not invent false historical “documents”

## 6. Source preference order

1. SBU University Archives / Libraries timelines  
2. Official university pages (landmarks, Wang, Staller, history)  
3. Building Name Inventory PDF  
4. Secondary news (SBU News, Press) with caution  
5. Wikipedia only as a lead, not final cite  

## 7. Changelog

When enabling a batch of sites, note in PR:

- Zone
- Site ids enabled
- Survey date
- Known GPS issues

## 8. Localization

v1 English only. Keep strings in data files / `copy.ts` for future i18n.
