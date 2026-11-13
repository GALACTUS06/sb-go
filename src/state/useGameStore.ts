import { create } from 'zustand'
import type { BuildingId, PlayerLocation, Progress } from '../domain/types'
import {
  claimSite,
  createEmptyProgress,
  setBuildingFlag,
  setDemoMode,
} from '../domain/progress'
import { clearProgress, loadProgress, saveProgress } from '../storage/save'

type GameStore = {
  progress: Progress
  toast: string | null
  demoOverride: PlayerLocation | null
  hydrate: () => void
  persist: () => void
  claim: (siteId: string) => void
  setDemo: (on: boolean) => void
  setFlag: (building: BuildingId, flag: string) => void
  reset: () => void
  showToast: (message: string) => void
  clearToast: () => void
  setDemoOverride: (loc: PlayerLocation | null) => void
}

let saveTimer: ReturnType<typeof setTimeout> | null = null

function scheduleSave(progress: Progress) {
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => saveProgress(progress), 300)
}

export const useGameStore = create<GameStore>((set, get) => ({
  progress: createEmptyProgress(),
  toast: null,
  demoOverride: null,

  hydrate: () => set({ progress: loadProgress() }),

  persist: () => saveProgress(get().progress),

  claim: (siteId) => {
    const progress = claimSite(get().progress, siteId)
    set({ progress })
    scheduleSave(progress)
  },

  setDemo: (on) => {
    const progress = setDemoMode(get().progress, on)
    set({ progress })
    scheduleSave(progress)
  },

  setFlag: (building, flag) => {
    const progress = setBuildingFlag(get().progress, building, flag, true)
    set({ progress })
    scheduleSave(progress)
  },

  reset: () => {
    clearProgress()
    set({ progress: createEmptyProgress(), demoOverride: null })
  },

  showToast: (message) => {
    set({ toast: message })
    window.setTimeout(() => {
      if (get().toast === message) set({ toast: null })
    }, 2800)
  },

  clearToast: () => set({ toast: null }),

  setDemoOverride: (loc) => set({ demoOverride: loc }),
}))

if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', () => {
    saveProgress(useGameStore.getState().progress)
  })
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      saveProgress(useGameStore.getState().progress)
    }
  })
}
