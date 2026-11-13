import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { assetUrl } from '../../config/assets'
import { features } from '../../config/features'
import { getEnabledSites } from '../../data/campusSites'
import { claimedEnabledCount, enabledSiteCount, suggestedNextSite } from '../../domain/completion'
import { distanceToSite, isInRange, latLngToMapXY } from '../../domain/geofence'
import { isSiteClaimed } from '../../domain/progress'
import type { CampusSite, PlayerLocation, SiteRuntimeState } from '../../domain/types'
import { usePlayerLocation } from '../../location/usePlayerLocation'
import { useGameStore } from '../../state/useGameStore'
import { SiteSheet } from './SiteSheet'
import './CampusMapView.css'

function siteState(
  progressClaimed: boolean,
  inRange: boolean,
): SiteRuntimeState {
  if (progressClaimed) return 'claimed'
  if (inRange) return 'in_range'
  return 'locked'
}

type Props = {
  watchGps?: boolean
}

export function CampusMapView({ watchGps = true }: Props) {
  const progress = useGameStore((s) => s.progress)
  const claim = useGameStore((s) => s.claim)
  const showToast = useGameStore((s) => s.showToast)
  const demoOverride = useGameStore((s) => s.demoOverride)
  const demoMode = progress.settings.demoMode

  const { location, permission, error, noisy, stale } = usePlayerLocation({
    enabled: watchGps && !demoOverride,
    demoLocation: demoOverride,
  })

  const sites = useMemo(() => getEnabledSites(), [])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = sites.find((s) => s.id === selectedId) ?? null
  const suggested = features.showRecommendedNext
    ? suggestedNextSite(progress, sites)
    : null

  const claimedCount = claimedEnabledCount(progress, sites)
  const total = enabledSiteCount(sites)
  const pct = total === 0 ? 0 : Math.round((claimedCount / total) * 100)

  const playerXY = location ? latLngToMapXY(location.lat, location.lng) : null

  function handleClaim(site: CampusSite) {
    claim(site.id)
    showToast('Logged to your campus run')
  }

  return (
    <div className="campus-map">
      <div className="map-hud">
        {demoMode ? <div className="banner banner-demo">Demo Mode on — distance checks bypassed</div> : null}
        {noisy ? <div className="banner banner-warn">GPS is noisy here — wait a few seconds or move to open sky</div> : null}
        {stale ? <div className="banner banner-warn">Signal stale — acquiring a fresher fix…</div> : null}
        {permission === 'denied' || permission === 'unavailable' ? (
          <div className="banner banner-error">
            {error ?? 'Location needed'} — open Settings for Demo Mode or permission help.
          </div>
        ) : null}
        <div className="map-hud-bar">
          <div className="progress-ring">
            {claimedCount}/{total} · {pct}%
          </div>
          <div className="row">
            <Link className="btn btn-ghost" to="/sites">
              List
            </Link>
            <Link className="btn btn-ghost" to="/settings">
              Settings
            </Link>
          </div>
        </div>
      </div>

      <img className="campus-map-art" src={assetUrl('maps/campus.svg')} alt="Stony Brook main campus map" />

      {sites.map((site) => {
        const claimed = isSiteClaimed(progress, site.id)
        const inRange = isInRange(location, site, demoMode)
        const state = siteState(claimed, inRange)
        return (
          <button
            key={site.id}
            type="button"
            className={`marker marker-${state}${selectedId === site.id ? ' marker-selected' : ''}`}
            style={{ left: `${site.mapX * 100}%`, top: `${site.mapY * 100}%` }}
            aria-label={site.name}
            onClick={() => setSelectedId(site.id)}
          >
            <span className="marker-pin" />
          </button>
        )
      })}

      {playerXY ? (
        <div
          className="player-puck"
          style={{ left: `${playerXY.mapX * 100}%`, top: `${playerXY.mapY * 100}%` }}
          title="You"
        />
      ) : null}

      <div className="map-bottom">
        {!selected && suggested ? (
          <button
            type="button"
            className="suggest-chip"
            onClick={() => setSelectedId(suggested.id)}
          >
            Suggested next: {suggested.name}
          </button>
        ) : null}
        {selected ? (
          <SiteSheet
            site={selected}
            distanceM={distanceToSite(effectiveLocation(location, demoOverride), selected)}
            canClaim={isInRange(effectiveLocation(location, demoOverride), selected, demoMode)}
            onClaim={() => handleClaim(selected)}
            onClose={() => setSelectedId(null)}
          />
        ) : null}
      </div>
    </div>
  )
}

function effectiveLocation(
  location: PlayerLocation | null,
  demoOverride: PlayerLocation | null,
): PlayerLocation | null {
  return demoOverride ?? location
}
