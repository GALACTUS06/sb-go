import { Link } from 'react-router-dom'
import type { CampusSite } from '../../domain/types'
import { isSiteClaimed } from '../../domain/progress'
import { useGameStore } from '../../state/useGameStore'

type Props = {
  site: CampusSite
  distanceM: number | null
  canClaim: boolean
  onClaim: () => void
  onClose: () => void
}

function formatDistance(m: number | null): string {
  if (m === null) return 'Distance unknown'
  if (m < 1000) return `${Math.round(m)} m away`
  return `${(m / 1000).toFixed(2)} km away`
}

export function SiteSheet({ site, distanceM, canClaim, onClaim, onClose }: Props) {
  const progress = useGameStore((s) => s.progress)
  const claimed = isSiteClaimed(progress, site.id)

  return (
    <div className="sheet stack">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div>
          <div className="chip">{site.zone} · {site.category}</div>
          <h2>{site.name}</h2>
          <p className="muted" style={{ margin: 0 }}>
            {formatDistance(distanceM)}
          </p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          Close
        </button>
      </div>

      <p style={{ margin: 0 }}>{site.blurb}</p>

      {!claimed ? (
        <button
          type="button"
          className="btn btn-primary"
          disabled={!canClaim}
          onClick={onClaim}
        >
          {canClaim ? 'Claim stop' : 'Walk closer to claim this stop'}
        </button>
      ) : (
        <>
          <div className="chip chip-claimed">Logged to your campus run</div>
          <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
            {site.facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          {site.unlocksBuilding ? (
            <Link
              className="btn btn-secondary"
              to={`/building/${site.unlocksBuilding}`}
              style={{ textAlign: 'center', textDecoration: 'none' }}
            >
              Enter {site.unlocksBuilding === 'melville' ? 'Melville' : 'Wang Center'}
            </Link>
          ) : null}
        </>
      )}
    </div>
  )
}
