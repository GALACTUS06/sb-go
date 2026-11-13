import type { BuildingId, Progress } from './types'

export function createEmptyProgress(): Progress {
  return {
    version: 1,
    claimedSiteIds: [],
    melville: { flags: {} },
    wang: { flags: {} },
    settings: { demoMode: false },
  }
}

export function isSiteClaimed(progress: Progress, siteId: string): boolean {
  return progress.claimedSiteIds.includes(siteId)
}

export function claimSite(progress: Progress, siteId: string): Progress {
  if (progress.claimedSiteIds.includes(siteId)) return progress
  return {
    ...progress,
    claimedSiteIds: [...progress.claimedSiteIds, siteId],
  }
}

export function setDemoMode(progress: Progress, demoMode: boolean): Progress {
  return {
    ...progress,
    settings: { ...progress.settings, demoMode },
  }
}

export function setBuildingFlag(
  progress: Progress,
  building: BuildingId,
  flag: string,
  value = true,
): Progress {
  const bucket = progress[building]
  if (bucket.flags[flag] === value) return progress
  return {
    ...progress,
    [building]: {
      flags: { ...bucket.flags, [flag]: value },
    },
  }
}

export function hasFlags(
  progress: Progress,
  building: BuildingId,
  flags: string[] | undefined,
): boolean {
  if (!flags || flags.length === 0) return true
  const bag = progress[building].flags
  return flags.every((f) => bag[f] === true)
}

export function isBranchComplete(
  progress: Progress,
  building: BuildingId,
  completeWhenFlags: string[],
): boolean {
  return hasFlags(progress, building, completeWhenFlags)
}

export function outdoorCompletionRatio(
  progress: Progress,
  enabledCount: number,
): number {
  if (enabledCount <= 0) return 0
  const claimedEnabled = progress.claimedSiteIds.length
  // Approximate: callers should pass claimed∩enabled count for precision
  return Math.min(1, claimedEnabled / enabledCount)
}
