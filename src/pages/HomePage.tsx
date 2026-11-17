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
            Walk campus outdoors, then hunt indoors with real building photos—Melville Library and
            the Wang Center gardens, fountain, and Zen rock garden.
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
            Indoor treasure hunt (Demo)
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
            Memory layers (real photos)
          </div>
          <div className="row" style={{ gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={() => openDemo('/world/melville-memory')}
            >
              Melville photos
            </button>
            <button
              type="button"
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={() => openDemo('/world/wang-gardens')}
            >
              Wang Gardens
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
          v{APP_VERSION} · Photos from Wikimedia / Flickr / SBU News (see CREDITS)
        </p>
      </div>
    </div>
  )
}
