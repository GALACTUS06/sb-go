import { Link } from 'react-router-dom'
import { APP_VERSION, GAME_DISPLAY_NAME } from '../config/brand'
import { useGameStore } from '../state/useGameStore'

export function HomePage() {
  const claimed = useGameStore((s) => s.progress.claimedSiteIds.length)
  const hasSave = claimed > 0

  return (
    <div className="app-shell" style={{ padding: '2rem 1.25rem', justifyContent: 'center' }}>
      <div className="stack" style={{ gap: '1.25rem' }}>
        <div>
          <div className="chip chip-claimed">Stony Brook · Main Campus</div>
          <h1 style={{ margin: '0.6rem 0 0.35rem', fontSize: '2.4rem', letterSpacing: '-0.03em' }}>
            {GAME_DISPLAY_NAME}
          </h1>
          <p className="muted" style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.45 }}>
            Walk the real campus to unlock story stops—and step inside Melville and Wang for
            building-specific runs.
          </p>
        </div>

        <Link className="btn btn-primary" to="/map" style={{ textAlign: 'center', textDecoration: 'none' }}>
          {hasSave ? 'Continue' : 'Start campus run'}
        </Link>
        <Link className="btn btn-secondary" to="/settings" style={{ textAlign: 'center', textDecoration: 'none' }}>
          Settings
        </Link>

        <p className="muted" style={{ margin: 0, fontSize: '0.8rem' }}>
          v{APP_VERSION} · Progress stays on this device · GPS used only to detect arrivals
        </p>
      </div>
    </div>
  )
}
