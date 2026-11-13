import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import { features } from '../../config/features'
import { getEnabledSites } from '../../data/campusSites'
import { melvilleBranch } from '../../data/melville'
import { wangBranch } from '../../data/wang'
import { claimedEnabledCount, enabledSiteCount, suggestedNextSite } from '../../domain/completion'
import { distanceToSite, isInRange } from '../../domain/geofence'
import { isBranchComplete, isSiteClaimed } from '../../domain/progress'
import type { CampusSite, SiteRuntimeState } from '../../domain/types'
import { usePlayerLocation } from '../../location/usePlayerLocation'
import { useGameStore } from '../../state/useGameStore'
import { SiteSheet } from './SiteSheet'
import './CampusMapView.css'

type LayerMode = 'satellite' | 'streets'

const CAMPUS_CENTER: L.LatLngExpression = [40.9146, -73.1235]
const CAMPUS_BOUNDS = L.latLngBounds([40.905, -73.135], [40.923, -73.112])

function siteState(progressClaimed: boolean, inRange: boolean): SiteRuntimeState {
  if (progressClaimed) return 'claimed'
  if (inRange) return 'in_range'
  return 'locked'
}

function markerIcon(state: SiteRuntimeState, label: string) {
  return L.divIcon({
    className: `sb-marker sb-marker-${state}`,
    html: `<div class="sb-marker-pin"></div><div class="sb-marker-label">${label}</div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 18],
  })
}

export function CampusMapView({ watchGps = true }: { watchGps?: boolean }) {
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
  const [layerMode, setLayerMode] = useState<LayerMode>('satellite')

  const mapRef = useRef<HTMLDivElement | null>(null)
  const mapObj = useRef<L.Map | null>(null)
  const markersLayer = useRef<L.LayerGroup | null>(null)
  const playerMarker = useRef<L.CircleMarker | null>(null)
  const tilesRef = useRef<L.TileLayer | null>(null)

  const selected = sites.find((s) => s.id === selectedId) ?? null
  const suggested = features.showRecommendedNext
    ? suggestedNextSite(progress, sites)
    : null
  const claimedCount = claimedEnabledCount(progress, sites)
  const total = enabledSiteCount(sites)
  const pct = total === 0 ? 0 : Math.round((claimedCount / total) * 100)
  const melvilleDone = isBranchComplete(progress, 'melville', melvilleBranch.completeWhenFlags)
  const wangDone = isBranchComplete(progress, 'wang', wangBranch.completeWhenFlags)
  const canEnterMelville = demoMode || isSiteClaimed(progress, 'melville-library')
  const canEnterWang = demoMode || isSiteClaimed(progress, 'wang-center')
  const needsDemoHint =
    !demoMode && (permission === 'denied' || permission === 'unavailable' || !player)

  useEffect(() => {
    if (!mapRef.current || mapObj.current) return

    const map = L.map(mapRef.current, {
      center: CAMPUS_CENTER,
      zoom: 16,
      minZoom: 14,
      maxZoom: 19,
      maxBounds: CAMPUS_BOUNDS.pad(0.2),
      zoomControl: false,
      attributionControl: true,
    })

    L.control.zoom({ position: 'bottomright' }).addTo(map)
    markersLayer.current = L.layerGroup().addTo(map)
    mapObj.current = map

    return () => {
      map.remove()
      mapObj.current = null
      markersLayer.current = null
      playerMarker.current = null
      tilesRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapObj.current
    if (!map) return
    if (tilesRef.current) {
      map.removeLayer(tilesRef.current)
      tilesRef.current = null
    }

    const tiles =
      layerMode === 'satellite'
        ? L.tileLayer(
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            {
              maxZoom: 19,
              attribution:
                'Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
            },
          )
        : L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors',
          })

    tiles.addTo(map)
    tilesRef.current = tiles
  }, [layerMode])

  useEffect(() => {
    const layer = markersLayer.current
    if (!layer) return
    layer.clearLayers()

    for (const site of sites) {
      const claimed = isSiteClaimed(progress, site.id)
      const inRange = isInRange(player, site, demoMode)
      const state = siteState(claimed, inRange)
      const marker = L.marker([site.lat, site.lng], {
        icon: markerIcon(state, site.name),
        title: site.name,
      })
      marker.on('click', () => setSelectedId(site.id))
      marker.addTo(layer)
    }
  }, [sites, progress, player, demoMode])

  useEffect(() => {
    const map = mapObj.current
    if (!map) return
    if (!player) {
      if (playerMarker.current) {
        map.removeLayer(playerMarker.current)
        playerMarker.current = null
      }
      return
    }

    if (!playerMarker.current) {
      playerMarker.current = L.circleMarker([player.lat, player.lng], {
        radius: 8,
        color: '#003366',
        weight: 3,
        fillColor: '#ffffff',
        fillOpacity: 1,
      }).addTo(map)
    } else {
      playerMarker.current.setLatLng([player.lat, player.lng])
    }
  }, [player])

  function handleClaim(site: CampusSite) {
    claim(site.id)
    showToast('Logged to your campus run')
  }

  return (
    <div className="campus-map">
      <div className="map-hud">
        {demoMode ? (
          <div className="banner banner-demo">
            Demo Mode on — claim any stop, enter buildings freely
          </div>
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
            to explore.
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
            {error ?? 'Location needed'} — use Demo Mode, or open Settings.
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
            <Link
              className={`dock-btn${melvilleDone ? ' dock-done' : ''}`}
              to="/building/melville"
            >
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

      <div className="leaflet-map-root" ref={mapRef} />

      <div className="map-layer-toggle">
        <button
          type="button"
          className={layerMode === 'satellite' ? 'active' : ''}
          onClick={() => setLayerMode('satellite')}
        >
          Satellite
        </button>
        <button
          type="button"
          className={layerMode === 'streets' ? 'active' : ''}
          onClick={() => setLayerMode('streets')}
        >
          Streets
        </button>
      </div>

      <div className="map-bottom">
        {!selected && suggested ? (
          <button
            type="button"
            className="suggest-chip"
            onClick={() => {
              setSelectedId(suggested.id)
              mapObj.current?.flyTo([suggested.lat, suggested.lng], 18, { duration: 0.6 })
            }}
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
