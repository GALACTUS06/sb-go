import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { assetUrl } from '../../config/assets'
import { features } from '../../config/features'
import { getEnabledSites } from '../../data/campusSites'
import { claimedEnabledCount, enabledSiteCount, suggestedNextSite } from '../../domain/completion'
import { distanceToSite, isInRange, latLngToMapXY } from '../../domain/geofence'
import { isBranchComplete, isSiteClaimed } from '../../domain/progress'
import type { CampusSite, SiteRuntimeState } from '../../domain/types'
import { melvilleBranch } from '../../data/melville'
import { wangBranch } from '../../data/wang'
import { usePlayerLocation } from '../../location/usePlayerLocation'
import { useGameStore } from '../../state/useGameStore'
import { SiteSheet } from './SiteSheet'
import './CampusMapView.css'

function siteState(progressClaimed: boolean, inRange: boolean): SiteRuntimeState {
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
  const setDemo = useGameStore((s) => s.setDemo)
  const showToast = useGameStore((s) => s.showToast)
  const demoOverride = useGameStore((s) => s.demoOverride)
  const demoMode = progress.settings.demoMode

  const { location, permission, error, noisy, stale } = usePlayerLocation({
    enabled: watchGps && !demoOverride,
    demoLocation: demoOverride,
  })

  const player = demoOverride ?? location
  const sites = useMemo(() => getEnabledSites(), [])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const mapArt = assetUrl('maps/campus.svg')

  const selected = sites.find((s) => s.id === selectedId) ?? null
  const suggested = features.showRecommendedNext
    ? suggestedNextSite(progress, sites)
    : null

  const claimedCount = claimedEnabledCount(progress, sites)
  const total = enabledSiteCount(sites)
  const pct = total === 0 ? 0 : Math.round((claimedCount / total) * 100)

  const playerXY = player ? latLngToMapXY(player.lat, player.lng) : null
  const melvilleDone = isBranchComplete(progress, 'melville', melvilleBranch.completeWhenFlags)
  const wangDone = isBranchComplete(progress, 'wang', wangBranch.completeWhenFlags)
  const melvilleClaimed = isSiteClaimed(progress, 'melville-library')
  const wangClaimed = isSiteClaimed(progress, 'wang-center')
  const canEnterMelville = demoMode || melvilleClaimed
  const canEnterWang = demoMode || wangClaimed
  const needsDemoHint =
    !demoMode && (permission === 'denied' || permission === 'unavailable' || !player)

  function handleClaim(site: CampusSite) {
    claim(site.id)
    showToast('Logged to your campus run')
  }

  return (
    <div
      className="campus-map"
      style={{ backgroundImage: `url("${mapArt}")` }}
    >
      <div className="map-hud">
        {demoMode ? (
          <div className="banner banner-demo">Demo Mode on — claim any stop, enter buildings freely</div>
        ) : null}
        {needsDemoHint ? (
          <div className="banner banner-warn">
            No GPS yet.{' '}
            <button
              type="button"
              className="linkish"
              onClick={() => {
                setDemo(true)
                showToast('Demo Mode enabled')
              }}
            >
              Enable Demo Mode
            </button>{' '}
            to explore the map and indoor branches.
          </div>
        ) : null}
        {noisy ? (
          <div className="banner banner-warn">
            GPS is noisy here — wait a few seconds or move to open sky
          </div>
        ) : null}
        {stale ? (
          <div className="banner banner-warn">Signal stale — acquiring a fresher fix…</div>
        ) : null}
        {permission === 'denied' || permission === 'unavailable' ? (
          <div className="banner banner-error">
            {error ?? 'Location needed'} — use Demo Mode above, or open Settings.
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
        <div className="building-dock">
          {canEnterMelville ? (
            <Link className={`dock-btn${melvilleDone ? ' dock-done' : ''}`} to="/building/melville">
              Enter Melville{melvilleDone ? ' ✓' : ''}
            </Link>
          ) : (
            <button
              type="button"
              className="dock-btn dock-locked"
              onClick={() => {
                setSelectedId('melville-library')
                showToast('Claim Melville Library first (or enable Demo Mode)')
              }}
            >
              Melville locked
            </button>
          )}
          {canEnterWang ? (
            <Link className={`dock-btn${wangDone ? ' dock-done' : ''}`} to="/building/wang">
              Enter Wang{wangDone ? ' ✓' : ''}
            </Link>
          ) : (
            <button
              type="button"
              className="dock-btn dock-locked"
              onClick={() => {
                setSelectedId('wang-center')
                showToast('Claim Wang Center first (or enable Demo Mode)')
              }}
            >
              Wang locked
            </button>
          )}
        </div>
      </div>

      {/* Decorative fallback layer if CSS background fails */}
      <img className="campus-map-art" src={mapArt} alt="" aria-hidden />

      {sites.map((site) => {
        const claimed = isSiteClaimed(progress, site.id)
        const inRange = isInRange(player, site, demoMode)
        const state = siteState(claimed, inRange)
        return (
          <button
            key={site.id}
            type="button"
            className={`marker marker-${state}${selectedId === site.id ? ' marker-selected' : ''}`}
            style={{ left: `${site.mapX * 100}%`, top: `${site.mapY * 100}%` }}
            aria-label={site.name}
            title={site.name}
            onClick={() => setSelectedId(site.id)}
          >
            <span className="marker-pin" />
            <span className="marker-label">{site.name}</span>
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
            distanceM={distanceToSite(player, selected)}
            canClaim={isInRange(player, selected, demoMode)}
            onClaim={() => handleClaim(selected)}
            onClose={() => setSelectedId(null)}
          />
        ) : null}
      </div>
    </div>
  )
}
