import type { CampusSite, PlayerLocation } from './types'
import { haversineMeters } from './distance'
import { mapCalibration } from '../config/geo'

export function distanceToSite(
  player: PlayerLocation | null,
  site: CampusSite,
): number | null {
  if (!player) return null
  return haversineMeters(player.lat, player.lng, site.lat, site.lng)
}

export function isInRange(
  player: PlayerLocation | null,
  site: CampusSite,
  demoMode: boolean,
): boolean {
  if (demoMode) return true
  const d = distanceToSite(player, site)
  if (d === null) return false
  return d <= site.radiusM
}

export function listInRange(
  player: PlayerLocation | null,
  sites: CampusSite[],
  demoMode: boolean,
): CampusSite[] {
  return sites.filter((s) => isInRange(player, s, demoMode))
}

export function nearestSite(
  player: PlayerLocation | null,
  sites: CampusSite[],
): { site: CampusSite; meters: number } | null {
  if (!player || sites.length === 0) return null
  let best: { site: CampusSite; meters: number } | null = null
  for (const site of sites) {
    const meters = haversineMeters(player.lat, player.lng, site.lat, site.lng)
    if (!best || meters < best.meters) best = { site, meters }
  }
  return best
}

/** Convert WGS84 to normalized map coords using linear bbox calibration. */
export function latLngToMapXY(lat: number, lng: number): { mapX: number; mapY: number } {
  const { latNorth, latSouth, lngWest, lngEast } = mapCalibration
  const mapX = (lng - lngWest) / (lngEast - lngWest)
  const mapY = (latNorth - lat) / (latNorth - latSouth)
  return {
    mapX: clamp01(mapX),
    mapY: clamp01(mapY),
  }
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n))
}
