export const DEFAULT_RADIUS_M = 50
export const ENTRANCE_RADIUS_M = 60
export const ACCURACY_WARN_M = 40
export const STALE_FIX_MS = 20_000

export const WATCH_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 3000,
  timeout: 10_000,
}

/** Linear map calibration — replace after surveying campus.webp corners. */
export const mapCalibration = {
  method: 'boundingBox-linear' as const,
  // Approximate West Campus academic core bbox (tune on site)
  latNorth: 40.9225,
  latSouth: 40.9055,
  lngWest: -73.1345,
  lngEast: -73.1125,
}
