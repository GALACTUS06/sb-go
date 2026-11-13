# Future Native Apps (Post-v1)

## 1. Principle

Ship **Web + PWA first**. Native is an optional distribution shell, not a rewrite trigger.

## 2. Recommended path: Capacitor

1. Keep Vite build outputting `dist/`
2. Add Capacitor Android / iOS projects
3. Reuse the same JS bundle
4. Map browser Geolocation to native permissions plugins if needed
5. Distribute Android APK / Play; iOS requires Apple Developer Program for store/TestFlight

### Why Capacitor fits

- Minimal rewrite
- Preserves outdoor HTTPS testing workflow during web iteration
- Domain layer stays untouched

## 3. Alternative: Expo / React Native rewrite

Only if native navigation performance or offline sensor needs exceed what a WebView shell can give. Expect UI rewrite; reuse `domain/` + `data/` ideas (port TS).

## 4. What NOT to do early

- Do not maintain separate game logic for web vs native
- Do not buy Apple Developer enrollment until store distribution is a real goal
- Do not block v1 on native packaging

## 5. Permission parity checklist (when native happens)

- [ ] Location usage strings (iOS Info.plist / Android manifest)
- [ ] Precise vs approximate location policy
- [ ] Background location **not** required — keep foreground only
- [ ] Privacy policy URL if stores demand it

## 6. Rename impact

Native app display names read from the same brand constants where possible; store listings are separate marketing copy.
