import { useState, type CSSProperties, type ReactNode } from 'react'
import { assetUrl } from '../../config/assets'
import { hardRefreshApp } from '../../cacheReset'

type Props = {
  imagePath: string
  alt: string
  /** natural width / height of source image (for consistent fit) */
  aspectRatio?: number
  children?: ReactNode
}

/**
 * Keeps hotspots locked to the floor-plan image on every screen size.
 * The frame shrinks with the image; percentage coords are relative to the plan, not the viewport.
 */
export function FloorPlanStage({
  imagePath,
  alt,
  aspectRatio = 1224 / 1584,
  children,
}: Props) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  const frameStyle: CSSProperties = {
    position: 'relative',
    // Fit width/height while preserving aspect; frame = image box so % hotspots stay locked
    width: `min(100%, calc((100dvh - 170px) * ${aspectRatio}))`,
    maxWidth: '100%',
    aspectRatio: `${aspectRatio}`,
    lineHeight: 0,
  }

  return (
    <div className="indoor-stage indoor-stage-centered">
      {status === 'error' ? (
        <div className="stack" style={{ padding: '1.25rem', maxWidth: 360, color: '#f5f5f5' }}>
          <strong style={{ color: '#ffb4b4' }}>Floor plan failed to load</strong>
          <p className="muted" style={{ margin: 0, color: '#ddd' }}>
            This is usually a stuck offline cache. Clear it and reopen the branch.
          </p>
          <button type="button" className="btn btn-primary" onClick={() => void hardRefreshApp()}>
            Clear cache & reload
          </button>
        </div>
      ) : (
        <div className="floor-plan-frame" style={frameStyle}>
          <img
            className="floor-plan-img"
            src={assetUrl(imagePath)}
            alt={alt}
            draggable={false}
            onLoad={() => setStatus('ready')}
            onError={() => setStatus('error')}
          />
          {status === 'ready' ? <div className="hotspot-layer">{children}</div> : null}
        </div>
      )}
    </div>
  )
}
