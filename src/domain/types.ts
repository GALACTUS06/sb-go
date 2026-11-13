export type SiteCategory =
  | 'academic'
  | 'arts'
  | 'life'
  | 'landmark'
  | 'residential'
  | 'athletics'
  | 'admin'
  | 'nature'

export type ZoneId = 'A' | 'B' | 'C' | 'D' | 'E'

export type BuildingId = 'melville' | 'wang'

export type CampusSite = {
  id: string
  name: string
  zone: ZoneId
  category: SiteCategory
  enabled: boolean
  placeholder?: boolean
  lat: number
  lng: number
  radiusM: number
  mapX: number
  mapY: number
  blurb: string
  facts: string[]
  recommendedOrder?: number
  unlocksBuilding?: BuildingId
  isBuildingEntrance?: boolean
  entranceFor?: BuildingId
  sources?: string[]
  notes?: string
}

export type IndoorInteraction = 'hold' | 'tap' | 'quiz' | 'jump'

export type IndoorHotspot = {
  id: string
  x: number
  y: number
  label: string
  interaction: IndoorInteraction
  holdMs?: number
  quiz?: {
    prompt: string
    options: string[]
    answerIndex: number
    hint?: string
    failCopy?: string
  }
  jumpToWorldId?: string
  requiresFlags?: string[]
  rewardFlag: string
  copy: string
  lockedCopy?: string
}

export type MemoryWorld = {
  id: string
  title: string
  backgroundKey: string
  hotspots: IndoorHotspot[]
  exitLabel: string
}

export type BuildingBranch = {
  id: BuildingId
  title: string
  /** public/ asset path — SVG or official PDF floor plan */
  floorPlanKey: string
  /** 1-based PDF page when floorPlanKey is a PDF */
  floorPlanPage?: number
  sequential: boolean
  enterCopy: string
  completeToast: string
  completeWhenFlags: string[]
  hotspots: IndoorHotspot[]
  worlds: MemoryWorld[]
}

export type PlayerLocation = {
  lat: number
  lng: number
  accuracyM: number
  timestamp: number
  source: 'gps' | 'demo'
}

export type Progress = {
  version: 1
  claimedSiteIds: string[]
  melville: { flags: Record<string, boolean> }
  wang: { flags: Record<string, boolean> }
  settings: { demoMode: boolean }
}

export type SiteRuntimeState = 'locked' | 'in_range' | 'claimed'
