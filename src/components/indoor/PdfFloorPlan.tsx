import { useEffect, useRef, useState } from 'react'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import { assetUrl } from '../../config/assets'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

GlobalWorkerOptions.workerSrc = pdfWorker

type Props = {
  /** Path under public/, e.g. maps/real/wang-gallery-walking.pdf */
  pdfPath: string
  pageNumber?: number
  className?: string
}

export function PdfFloorPlan({ pdfPath, pageNumber = 1, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function render() {
      setLoading(true)
      setError(null)
      try {
        const url = assetUrl(pdfPath)
        const pdf = await getDocument({ url }).promise
        const page = await pdf.getPage(pageNumber)
        const viewport = page.getViewport({ scale: 1.35 })
        const canvas = canvasRef.current
        if (!canvas || cancelled) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        canvas.width = viewport.width
        canvas.height = viewport.height
        await page.render({ canvasContext: ctx, viewport, canvas }).promise
        if (!cancelled) setLoading(false)
      } catch (e) {
        console.error(e)
        if (!cancelled) {
          setError('Could not load official floor plan PDF.')
          setLoading(false)
        }
      }
    }

    void render()
    return () => {
      cancelled = true
    }
  }, [pdfPath, pageNumber])

  return (
    <div className={`indoor-pdf-wrap ${className ?? ''}`}>
      {loading ? (
        <p className="muted" style={{ color: '#ddd' }}>
          Loading official floor plan…
        </p>
      ) : null}
      {error ? <p style={{ color: '#ffb4b4' }}>{error}</p> : null}
      <canvas ref={canvasRef} style={{ display: loading || error ? 'none' : 'block' }} />
    </div>
  )
}
