import { useEffect, useMemo } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { IndoorBranch } from '../components/indoor/IndoorBranch'
import { features } from '../config/features'
import { getEntranceSite, getSiteById } from '../data/campusSites'
import { melvilleBranch } from '../data/melville'
import { wangBranch } from '../data/wang'
import { isInRange } from '../domain/geofence'
import { isSiteClaimed } from '../domain/progress'
import type { BuildingId } from '../domain/types'
import { usePlayerLocation } from '../location/usePlayerLocation'
import { useGameStore } from '../state/useGameStore'

function branchFor(id: BuildingId) {
  return id === 'melville' ? melvilleBranch : wangBranch
}

export function BuildingPage() {
  const { buildingId } = useParams()
  const progress = useGameStore((s) => s.progress)
  const demoOverride = useGameStore((s) => s.demoOverride)
  const showToast = useGameStore((s) => s.showToast)
  const { location } = usePlayerLocation({
    enabled: !demoOverride,
    demoLocation: demoOverride,
  })

  const valid = buildingId === 'melville' || buildingId === 'wang'

  const allowed = useMemo(() => {
    if (!valid) return false
    const id = buildingId as BuildingId
    const demoMode = progress.settings.demoMode
    // Demo Mode unlocks indoor branches for presentations / no-GPS browsers.
    if (demoMode) return true
    const entrance = getEntranceSite(id)
    const outdoor = getSiteById(id === 'melville' ? 'melville-library' : 'wang-center')
    const atEntrance = entrance
      ? isInRange(demoOverride ?? location, entrance, false)
      : false
    const claimedOk =
      !features.requireOutdoorClaimBeforeEnter ||
      (outdoor ? isSiteClaimed(progress, outdoor.id) : false)
    return atEntrance && claimedOk
  }, [valid, buildingId, progress, demoOverride, location])

  useEffect(() => {
    if (valid && !allowed) {
      showToast('Reach the entrance to enter this building')
    }
  }, [valid, allowed, showToast])

  if (!valid) return <Navigate to="/map" replace />
  if (!allowed) return <Navigate to="/map" replace />

  return <IndoorBranch branch={branchFor(buildingId)} />
}
