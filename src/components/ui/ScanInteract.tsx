import { useEffect, useRef, useState } from 'react'
import { assetUrl } from '../../config/assets'
import { compareToReference, MATCH_THRESHOLD } from '../../vision/imageCompare'

type Props = {
  imagePath: string
  label?: string
  holdMs?: number
  /** When true, allow accepting a near-miss after a capture (Demo Mode). */
  allowDemoPass?: boolean
  onComplete: () => void
}

type Phase = 'preview' | 'camera' | 'result'

export function ScanInteract({
  imagePath,
  label = 'Hold to capture & match',
  holdMs = 900,
  allowDemoPass = false,
  onComplete,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const raf = useRef<number | null>(null)
  const holdStart = useRef<number | null>(null)

  const [phase, setPhase] = useState<Phase>('preview')
  const [holdProgress, setHoldProgress] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [score, setScore] = useState<number | null>(null)
  const [shotUrl, setShotUrl] = useState<string | null>(null)
  const [matched, setMatched] = useState(false)

  const refUrl = assetUrl(imagePath)

  useEffect(() => {
    return () => {
      stopCamera()
      if (shotUrl) URL.revokeObjectURL(shotUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
  }

  async function openCamera() {
    setError(null)
    setScore(null)
    setMatched(false)
    if (shotUrl) {
      URL.revokeObjectURL(shotUrl)
      setShotUrl(null)
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })
      streamRef.current = stream
      setPhase('camera')
      // attach after paint
      requestAnimationFrame(() => {
        const video = videoRef.current
        if (!video) return
        video.srcObject = stream
        void video.play().catch(() => undefined)
      })
    } catch {
      setError(
        'Camera blocked or unavailable. Allow camera permission, or use Demo Mode to finish the scan.',
      )
      setPhase('preview')
    }
  }

  function cancelHold() {
    if (raf.current !== null) cancelAnimationFrame(raf.current)
    raf.current = null
    holdStart.current = null
    setHoldProgress(0)
  }

  function onHoldTick(now: number) {
    if (holdStart.current === null) holdStart.current = now
    const p = Math.min(1, (now - holdStart.current) / holdMs)
    setHoldProgress(p)
    if (p >= 1) {
      cancelHold()
      void captureAndCompare()
      return
    }
    raf.current = requestAnimationFrame(onHoldTick)
  }

  function beginHold() {
    if (busy || matched) return
    cancelHold()
    raf.current = requestAnimationFrame(onHoldTick)
  }

  async function captureAndCompare() {
    const video = videoRef.current
    if (!video || !video.videoWidth) {
      setError('Camera not ready — wait a moment and hold again.')
      return
    }
    setBusy(true)
    setError(null)
    try {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('No canvas')
      ctx.drawImage(video, 0, 0)
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/jpeg', 0.85),
      )
      if (blob) {
        if (shotUrl) URL.revokeObjectURL(shotUrl)
        setShotUrl(URL.createObjectURL(blob))
      }

      const result = await compareToReference(refUrl, canvas)
      setScore(result.score)
      stopCamera()
      setPhase('result')

      if (result.tooDark) {
        setError('Shot is too dark — face a lit surface and try again.')
        setMatched(false)
      } else if (result.score >= MATCH_THRESHOLD) {
        setMatched(true)
        setError(null)
        onComplete()
      } else {
        setMatched(false)
        setError(
          `Not a close match (${Math.round(result.score * 100)}%). Line up more like the reference and rescan.`,
        )
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Scan failed')
      setPhase('result')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="scan stack">
      <div className="scan-stage">
        {phase === 'camera' ? (
          <>
            <video ref={videoRef} className="scan-video" playsInline muted autoPlay />
            <img className="scan-ghost" src={refUrl} alt="" draggable={false} />
          </>
        ) : shotUrl && phase === 'result' ? (
          <div className="scan-compare">
            <img src={refUrl} alt="Reference" />
            <img src={shotUrl} alt="Your capture" />
          </div>
        ) : (
          <img className="scan-ref" src={refUrl} alt="Place reference" />
        )}
      </div>

      <p className="muted" style={{ margin: 0, fontSize: '0.85rem' }}>
        {phase === 'camera'
          ? 'Line up the ghost photo with what you see, then hold to capture & compare.'
          : phase === 'result' && matched
            ? 'Match accepted — stop logged.'
            : 'Real reference photo → open camera → hold to match (Demo Mode can skip).'}
      </p>

      {error ? (
        <div className="chip" style={{ background: '#fde8e8', color: '#8a1f1f' }}>
          {error}
        </div>
      ) : null}
      {score !== null && !matched ? (
        <div className="muted" style={{ fontSize: '0.8rem' }}>
          Similarity {Math.round(score * 100)}% · need {Math.round(MATCH_THRESHOLD * 100)}%+
        </div>
      ) : null}

      {matched ? (
        <div className="chip chip-success">Scan accepted</div>
      ) : phase === 'preview' || phase === 'result' ? (
        <div className="stack" style={{ gap: '0.5rem' }}>
          <button type="button" className="btn btn-primary" onClick={() => void openCamera()}>
            {phase === 'result' ? 'Retake photo' : 'Open camera'}
          </button>
          {allowDemoPass ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setMatched(true)
                onComplete()
              }}
            >
              Demo: count as found
            </button>
          ) : null}
        </div>
      ) : (
        <button
          type="button"
          className="btn btn-primary hold-btn"
          disabled={busy}
          onPointerDown={beginHold}
          onPointerUp={cancelHold}
          onPointerLeave={cancelHold}
          onPointerCancel={cancelHold}
          style={{ position: 'relative', overflow: 'hidden', width: '100%' }}
        >
          <span
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              transformOrigin: 'left center',
              transform: `scaleX(${holdProgress})`,
              background: 'rgba(255,255,255,0.25)',
            }}
          />
          <span style={{ position: 'relative' }}>{busy ? 'Comparing…' : label}</span>
        </button>
      )}
    </div>
  )
}
