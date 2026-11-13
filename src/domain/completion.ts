import type { CampusSite, Progress } from './types'
import { isSiteClaimed } from './progress'

export function claimedEnabledCount(
  progress: Progress,
  sites: CampusSite[],
): number {
  return sites.filter((s) => s.enabled && isSiteClaimed(progress, s.id)).length
}

export function enabledSiteCount(sites: CampusSite[]): number {
  return sites.filter((s) => s.enabled).length
}

export function suggestedNextSite(
  progress: Progress,
  sites: CampusSite[],
): CampusSite | null {
  const candidates = sites
    .filter((s) => s.enabled && !isSiteClaimed(progress, s.id))
    .sort((a, b) => (a.recommendedOrder ?? 999) - (b.recommendedOrder ?? 999))
  return candidates[0] ?? null
}
