# Geolocation & Geofence Specification

## 1. API usage

```ts
navigator.geolocation.watchPosition(success, error, WATCH_OPTIONS);
```

`WATCH_OPTIONS` (from `config/geo.ts`):

- `enableHighAccuracy: true`
- `maximumAge: 3000`
- `timeout: 10000`

Also support one-shot `getCurrentPosition` for permission priming on Home → Map.

## 2. Player location object

```ts
type PlayerLocation = {
  lat: number;
  lng: number;
  accuracyM: number;
  timestamp: number;
  source: "gps" | "demo";
};
```

Demo source used when injecting fake coordinates from Settings.

## 3. Haversine

```text
a = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)
c = 2 ⋅ atan2(√a, √(1−a))
d = R ⋅ c
R = 6371000 m
```

Return meters as `number`. Tests: zero distance for identical points; symmetry.

## 4. In-range rule

```text
inRange = demoMode OR (distanceM <= site.radiusM)
```

Stricter optional flag (default **false**):

```text
inRange = distanceM + accuracyM * 0.5 <= site.radiusM
```

## 5. Default radii

| Context | radiusM |
|---------|---------|
| Default building | 50 |
| Tight landmark (statue, path segment) | 35–45 |
| Large footprint (SAC, arena approaches) | 60–80 |
| Building entrance gate | 60–70 |
| Nature preserve entrance | 50–70 |

Tune per site after walk test; never ship a site with `radiusM < 25` unless deliberately tiny and verified.

## 6. Permission states

| Browser state | UI |
|---------------|----|
| Prompt | Explain → Request |
| Granted | Hide explain; show puck |
| Denied | Blocking card with OS instructions + Demo Mode |
| Unavailable | “Location unavailable on this device” |

### iOS Safari notes

- Location requires HTTPS
- User may need Settings → Safari → Location Services
- Add-to-home-screen PWA may re-prompt; handle gracefully
- Background tracking is **not** required and should not be promised

### Android Chrome notes

- Precise location preferred
- Battery savers may reduce frequency — maximumAge helps

## 7. UI feedback

| Condition | Feedback |
|-----------|----------|
| Accuracy > 40m | Amber banner “GPS noisy” |
| No fix yet | Skeleton puck / “Acquiring GPS…” |
| Fix stale > 20s | Dim puck, “Signal stale” |
| Multiple sites in range | Sheet lists all; claim each separately |

## 8. Battery policy

- Watch **on** for `/map` and `/sites`
- Watch **off** optional on indoor routes after entrance validated (keep last known pos)
- Never use continuous high-frequency custom timers beyond geolocation callbacks

## 9. Demo / debug tools (required)

Settings must provide:

1. Demo Mode toggle (bypass geofence)
2. Live lat / lng / accuracy
3. “Copy coordinates” button
4. Distance table (site name, meters, inRange)
5. Optional: set fake lat/lng fields + “Apply demo position”
6. Optional: snap demo position to selected site center

## 10. Field survey SOP

1. Disable Demo Mode
2. Stand at claim point under open sky if possible
3. Wait until accuracy < 20m when possible
4. Log 3 samples
5. Average
6. Set radius using table
7. Walk out until claim disables; walk in until enables; note boundary feel
8. Record issues (overhangs, courtyards, indoor bleed)

## 11. Entrance nodes vs story nodes

Some buildings need **two** data rows:

- `melville` — story/claim node near iconic frontage  
- `melville-entrance` — `isBuildingEntrance: true`, `entranceFor: "melville"`  

Or one row can serve both if the claim spot **is** the entrance (`unlocksBuilding` + `entranceFor` on same id). Prefer one row when possible to reduce clutter.

## 12. Failure modes

| Failure | Product behavior |
|---------|------------------|
| Timeout | Retry button; keep last fix |
| Position error code 1 | Permission denied UX |
| Code 2 | Unavailable UX |
| Code 3 | Timeout retry |
| Jump across campus (GPS teleport) | Accept rare glitches; do not auto-claim without user tap |

**Important:** Claims are always **user-initiated**. Never auto-claim on range enter.
