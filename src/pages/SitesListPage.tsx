import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getEnabledSites } from '../data/campusSites'
import { distanceToSite, isInRange } from '../domain/geofence'
import { isSiteClaimed } from '../domain/progress'
import type { ZoneId } from '../domain/types'
import { usePlayerLocation } from '../location/usePlayerLocation'
import { useGameStore } from '../state/useGameStore'

const ZONES: Array<ZoneId | 'ALL'> = ['ALL', 'A', 'B', 'C', 'D', 'E']

export function SitesListPage() {
  const progress = useGameStore((s) => s.progress)
  const demoOverride = useGameStore((s) => s.demoOverride)
  const { location } = usePlayerLocation({
    enabled: !demoOverride,
    demoLocation: demoOverride,
  })
  const [zone, setZone] = useState<(typeof ZONES)[number]>('ALL')
  const sites = useMemo(() => getEnabledSites(), [])

  const filtered = sites
    .filter((s) => (zone === 'ALL' ? true : s.zone === zone))
    .sort((a, b) => (a.recommendedOrder ?? 999) - (b.recommendedOrder ?? 999))

  return (
    <div className="app-shell" style={{ paddingBottom: '1.5rem' }}>
      <div className="indoor-top">
        <strong>Campus stops</strong>
        <Link className="btn btn-ghost" to="/map">
          Map
        </Link>
      </div>
      <div className="row" style={{ padding: '0.75rem', flexWrap: 'wrap' }}>
        {ZONES.map((z) => (
          <button
            key={z}
            type="button"
            className={`chip${zone === z ? ' chip-claimed' : ''}`}
            onClick={() => setZone(z)}
          >
            {z === 'ALL' ? 'All' : `Zone ${z}`}
          </button>
        ))}
      </div>
      <div className="stack" style={{ padding: '0 0.9rem' }}>
        {filtered.map((site) => {
          const claimed = isSiteClaimed(progress, site.id)
          const inRange = isInRange(demoOverride ?? location, site, progress.settings.demoMode)
          const dist = distanceToSite(demoOverride ?? location, site)
          return (
            <Link
              key={site.id}
              to="/map"
              className="sheet"
              style={{ borderRadius: 12, textDecoration: 'none', color: 'inherit' }}
            >
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <strong>{site.name}</strong>
                <span className={`chip${claimed ? ' chip-claimed' : inRange ? ' chip-success' : ''}`}>
                  {claimed ? 'Claimed' : inRange ? 'In range' : 'Locked'}
                </span>
              </div>
              <p className="muted" style={{ margin: '0.35rem 0 0', fontSize: '0.9rem' }}>
                Zone {site.zone}
                {dist !== null ? ` · ${Math.round(dist)} m` : ''}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
