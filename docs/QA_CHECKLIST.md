# QA Checklist

Copy this into PR descriptions or a shared sheet. Check every box before enabling a zone in production.

## A. Boot & PWA

- [ ] Cold load on iPhone Safari cellular
- [ ] Cold load on Android Chrome cellular
- [ ] `/map` refresh does not 404
- [ ] Add to Home Screen launches standalone
- [ ] Display name shows temporary brand correctly

## B. Permissions

- [ ] First-run explanation visible
- [ ] Deny location → recovery instructions
- [ ] Allow location → puck appears
- [ ] Settings shows lat/lng/accuracy

## C. Geofence (per site batch)

For each enabled site:

- [ ] Far away (>2× radius): Claim disabled
- [ ] Inside radius: Claim enabled
- [ ] Claim writes save
- [ ] Kill tab / reopen: still claimed
- [ ] Accuracy banner appears in poor signal without crashing
- [ ] No auto-claim without tap

## D. Demo Mode

- [ ] Banner visible when on
- [ ] Can claim without GPS
- [ ] Can enter both buildings
- [ ] Toggle off restores real gates

## E. Map UX

- [ ] Markers readable; states distinct without color-only reliance
- [ ] Suggested next appears for new saves
- [ ] Site sheet scroll works on small phones
- [ ] Completion % updates

## F. Melville

- [ ] Gate blocks when appropriate
- [ ] Hold can be canceled mid-press
- [ ] Flags persist
- [ ] Jump locked until requirements met
- [ ] World completable
- [ ] Branch completion toast + map badge

## G. Wang

- [ ] Sequential locks work
- [ ] Quiz wrong → retry
- [ ] Quiz right → flag
- [ ] Jump + world completable
- [ ] Stepper matches progress

## H. Stability

- [ ] Rapid GPS updates do not freeze UI
- [ ] Reset progress clears claims and branch flags
- [ ] Corrupt localStorage recovers safely
- [ ] No console errors on happy path

## I. Field sign-off

| Item | Value |
|------|-------|
| Tester | |
| Date | |
| Devices | |
| Zone batch | |
| Weather / canopy notes | |
| Result | PASS / FAIL |
| Bugs filed | |
