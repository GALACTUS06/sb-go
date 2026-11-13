import type { CSSProperties, ReactNode } from 'react'
import { assetUrl } from '../../config/assets'

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
      <div className="floor-plan-frame" style={frameStyle}>
        <img
          className="floor-plan-img"
          src={assetUrl(imagePath)}
          alt={alt}
          draggable={false}
        />
        <div className="hotspot-layer" aria-hidden={false}>
          {children}
        </div>
      </div>
    </div>
  )
}
