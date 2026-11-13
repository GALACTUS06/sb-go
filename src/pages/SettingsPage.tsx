import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { APP_VERSION, GAME_DISPLAY_NAME } from '../config/brand'
import { features } from '../config/features'
import { getEnabledSites, getSiteById } from '../data/campusSites'
import { distanceToSite } from '../domain/geofence'
import type { PlayerLocation } from '../domain/types'
import { usePlayerLocation } from '../location/usePlayerLocation'
import { useGameStore } from '../state/useGameStore'

export function SettingsPage() {
  const progress = useGameStore((s) => s.progress)
  const setDemo = useGameStore((s) => s.setDemo)
  const reset = useGameStore((s) => s.reset)
  const demoOverride = useGameStore((s) => s.demoOverride)
  const setDemoOverride = useGameStore((s) => s.setDemoOverride)
  const showToast = useGameStore((s) => s.showToast)
  const { location, permission, error, noisy } = usePlayerLocation({
    enabled: !demoOverride,
    demoLocation: demoOverride,
  })

  const [fakeLat, setFakeLat] = useState('40.91545')
  const [fakeLng, setFakeLng] = useState('-73.12275')
  const sites = useMemo(() => getEnabledSites(), [])

  const effective = demoOverride ?? location
  const nearest = useMemo(() => {
    if (!effective) return []
    return [...sites]
      .map((s) => ({ site: s, meters: distanceToSite(effective, s) ?? Infinity }))
      .sort((a, b) => a.meters - b.meters)
      .slice(0, 5)
  }, [effective, sites])

  function copyCoords() {
    if (!effective) return
    const text = `${effective.lat.toFixed(6)}, ${effective.lng.toFixed(6)}`
    void navigator.clipboard?.writeText(text)
    showToast('Coordinates copied')
  }

  function snapToSite(id: string) {
    const site = getSiteById(id)
    if (!site) return
    const loc: PlayerLocation = {
      lat: site.lat,
      lng: site.lng,
      accuracyM: 5,
      timestamp: Date.now(),
      source: 'demo',
    }
    setDemoOverride(loc)
    setFakeLat(String(site.lat))
    setFakeLng(String(site.lng))
    showToast(`Demo position → ${site.name}`)
  }

  return (
    <div className="app-shell" style={{ paddingBottom: '2rem' }}>
      <div className="indoor-top">
        <strong>Settings</strong>
        <Link className="btn btn-ghost" to="/map">
          Map
        </Link>
      </div>

      <div className="stack" style={{ padding: '1rem' }}>
        <section className="sheet stack" style={{ borderRadius: 12 }}>
          <h3 style={{ margin: 0 }}>Location</h3>
          <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>
            {GAME_DISPLAY_NAME} uses GPS only to detect when you arrive at story locations. Progress
            stays on this device.
          </p>
          <div className="muted" style={{ fontSize: '0.9rem' }}>
            Permission: <strong>{permission}</strong>
            {error ? ` · ${error}` : ''}
            {noisy ? ' · noisy' : ''}
          </div>
          {effective ? (
            <>
              <code style={{ fontSize: '0.85rem' }}>
                {effective.lat.toFixed(6)}, {effective.lng.toFixed(6)} ±{Math.round(effective.accuracyM)}m ({effective.source})
              </code>
              <button type="button" className="btn btn-secondary" onClick={copyCoords}>
                Copy coordinates
              </button>
            </>
          ) : (
            <p className="muted">No fix yet.</p>
          )}
        </section>

        {features.enableDemoModeToggle ? (
          <section className="sheet stack" style={{ borderRadius: 12 }}>
            <h3 style={{ margin: 0 }}>Developer</h3>
            <label className="row">
              <input
                type="checkbox"
                checked={progress.settings.demoMode}
                onChange={(e) => setDemo(e.target.checked)}
              />
              Demo Mode (bypass geofence)
            </label>
            <div className="stack">
              <label>
                Fake lat
                <input
                  value={fakeLat}
                  onChange={(e) => setFakeLat(e.target.value)}
                  style={{ width: '100%', marginTop: 4 }}
                />
              </label>
              <label>
                Fake lng
                <input
                  value={fakeLng}
                  onChange={(e) => setFakeLng(e.target.value)}
                  style={{ width: '100%', marginTop: 4 }}
                />
              </label>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  const lat = Number(fakeLat)
                  const lng = Number(fakeLng)
                  if (Number.isNaN(lat) || Number.isNaN(lng)) {
                    showToast('Invalid coordinates')
                    return
                  }
                  setDemoOverride({
                    lat,
                    lng,
                    accuracyM: 5,
                    timestamp: Date.now(),
                    source: 'demo',
                  })
                  showToast('Demo position applied')
                }}
              >
                Apply demo position
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setDemoOverride(null)}
              >
                Clear demo position (use real GPS)
              </button>
            </div>
            <div className="stack">
              <strong style={{ fontSize: '0.9rem' }}>Snap to site</strong>
              {['melville-library', 'wang-center', 'academic-mall-fountain', 'humanities'].map(
                (id) => (
                  <button
                    key={id}
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => snapToSite(id)}
                  >
                    {id}
                  </button>
                ),
              )}
            </div>
            <div className="stack">
              <strong style={{ fontSize: '0.9rem' }}>Nearest (debug)</strong>
              {nearest.map(({ site, meters }) => (
                <div key={site.id} className="muted" style={{ fontSize: '0.85rem' }}>
                  {site.name}: {Number.isFinite(meters) ? `${Math.round(meters)} m` : '—'}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="sheet stack" style={{ borderRadius: 12 }}>
          <h3 style={{ margin: 0 }}>Progress</h3>
          <p className="muted" style={{ margin: 0 }}>
            Claimed stops: {progress.claimedSiteIds.length}
          </p>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              if (window.confirm('Reset all progress on this device?')) {
                reset()
                showToast('Progress reset')
              }
            }}
          >
            Reset progress
          </button>
        </section>

        <p className="muted" style={{ fontSize: '0.8rem', margin: 0 }}>
          {GAME_DISPLAY_NAME} v{APP_VERSION}
        </p>
      </div>
    </div>
  )
}
