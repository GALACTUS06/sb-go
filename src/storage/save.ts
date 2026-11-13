import { STORAGE_KEY } from '../config/brand'
import { createEmptyProgress } from '../domain/progress'
import type { Progress } from '../domain/types'

function isProgress(value: unknown): value is Progress {
  if (!value || typeof value !== 'object') return false
  const v = value as Progress
  return (
    v.version === 1 &&
    Array.isArray(v.claimedSiteIds) &&
    typeof v.melville?.flags === 'object' &&
    typeof v.wang?.flags === 'object' &&
    typeof v.settings?.demoMode === 'boolean'
  )
}

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createEmptyProgress()
    const parsed: unknown = JSON.parse(raw)
    if (!isProgress(parsed)) {
      console.warn('Corrupt save; resetting')
      return createEmptyProgress()
    }
    return parsed
  } catch {
    return createEmptyProgress()
  }
}

export function saveProgress(progress: Progress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function clearProgress(): void {
  localStorage.removeItem(STORAGE_KEY)
}
