import { Link, useNavigate } from 'react-router-dom'
import { hardRefreshApp } from '../cacheReset'
import { APP_VERSION, GAME_DISPLAY_NAME } from '../config/brand'
import { useGameStore } from '../state/useGameStore'

export function HomePage() {
  const navigate = useNavigate()
  const claimed = useGameStore((s) => s.progress.claimedSiteIds.length)
  const setDemo = useGameStore((s) => s.setDemo)
  const hasSave = claimed > 0

  function openDemo(path: string) {
    setDemo(true)
    navigate(path)
  }

  return (
    <div className="app-shell" style={{ padding: '2rem 1.25rem', justifyContent: 'center' }}>
      <div className="stack" style={{ gap: '1.25rem' }}>
        <div>
          <div className="chip chip-claimed">Stony Brook · Main Campus</div>
          <h1
            style={{
              margin: '0.6rem 0 0.35rem',
              fontSize: '2.4rem',
              letterSpacing: '-0.03em',
            }}
          >
            {GAME_DISPLAY_NAME}
          </h1>
          <p className="muted" style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.45 }}>
            Walk West Campus for real SBU history—then step inside Melville (1963 library) and Wang
            (2002 cultural center) for archive plates and Memory Layers.
          </p>
        </div>

        <Link
          className="btn btn-primary"
          to="/map"
          style={{ textAlign: 'center', textDecoration: 'none' }}
        >
          {hasSave ? 'Continue campus map' : 'Open campus map'}
        </Link>

        <div>
          <div className="muted" style={{ fontSize: '0.8rem', marginBottom: 6 }}>
            Buildings (Demo Mode)
          </div>
          <div className="row" style={{ gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={() => openDemo('/building/melville')}
            >
              Melville Library
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={() => openDemo('/building/wang')}
            >
              Wang Center
            </button>
          </div>
        </div>

        <div>
          <div className="muted" style={{ fontSize: '0.8rem', marginBottom: 6 }}>
            Memory Layers (Demo Mode)
          </div>
          <div className="row" style={{ gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={() => openDemo('/world/melville-1963')}
            >
              Melville 1963
            </button>
            <button
              type="button"
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={() => openDemo('/world/wang-mirror')}
            >
              Mirror Garden
            </button>
          </div>
        </div>

        <Link
          className="btn btn-ghost"
          to="/settings"
          style={{ textAlign: 'center', textDecoration: 'none' }}
        >
          Settings / Demo Mode
        </Link>

        <button type="button" className="btn btn-ghost" onClick={() => void hardRefreshApp()}>
          Map broken? Clear cache & reload
        </button>

        <p className="muted" style={{ margin: 0, fontSize: '0.8rem' }}>
          v{APP_VERSION} · Story plates cite SBU Libraries & Wang Center history
        </p>
      </div>
    </div>
  )
}
