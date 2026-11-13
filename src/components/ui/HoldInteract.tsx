import { useRef, useState } from 'react'

type Props = {
  holdMs?: number
  label?: string
  disabled?: boolean
  onComplete: () => void
}

export function HoldInteract({
  holdMs = 1000,
  label = 'Hold to scan',
  disabled,
  onComplete,
}: Props) {
  const [progress, setProgress] = useState(0)
  const raf = useRef<number | null>(null)
  const start = useRef<number | null>(null)

  function cancel() {
    if (raf.current !== null) cancelAnimationFrame(raf.current)
    raf.current = null
    start.current = null
    setProgress(0)
  }

  function tick(now: number) {
    if (start.current === null) start.current = now
    const p = Math.min(1, (now - start.current) / holdMs)
    setProgress(p)
    if (p >= 1) {
      cancel()
      onComplete()
      return
    }
    raf.current = requestAnimationFrame(tick)
  }

  function begin() {
    if (disabled) return
    cancel()
    raf.current = requestAnimationFrame(tick)
  }

  return (
    <button
      type="button"
      className="btn btn-primary hold-btn"
      disabled={disabled}
      onPointerDown={begin}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      style={{ position: 'relative', overflow: 'hidden', width: '100%' }}
    >
      <span
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: 'left center',
          transform: `scaleX(${progress})`,
          background: 'rgba(255,255,255,0.25)',
        }}
      />
      <span style={{ position: 'relative' }}>{label}</span>
    </button>
  )
}
