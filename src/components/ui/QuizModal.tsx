import { useState } from 'react'
import { assetUrl } from '../../config/assets'

type Props = {
  prompt: string
  options: string[]
  answerIndex: number
  hint?: string
  failCopy?: string
  imagePath?: string
  onClose: () => void
  onCorrect: () => void
}

export function QuizModal({
  prompt,
  options,
  answerIndex,
  hint,
  failCopy,
  imagePath,
  onClose,
  onCorrect,
}: Props) {
  const [message, setMessage] = useState<string | null>(null)

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card stack">
        {imagePath ? (
          <img className="quiz-ref" src={assetUrl(imagePath)} alt="" />
        ) : null}
        <h3 style={{ margin: 0 }}>{prompt}</h3>
        {hint ? <p className="muted" style={{ margin: 0 }}>{hint}</p> : null}
        <div className="stack">
          {options.map((opt, i) => (
            <button
              key={opt}
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                if (i === answerIndex) {
                  onCorrect()
                } else {
                  setMessage(failCopy ?? 'Try again.')
                }
              }}
            >
              {opt}
            </button>
          ))}
        </div>
        {message ? <p style={{ color: 'var(--danger)', margin: 0 }}>{message}</p> : null}
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}
