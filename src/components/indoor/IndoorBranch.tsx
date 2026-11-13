import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assetUrl } from '../../config/assets'
import type { BuildingBranch, IndoorHotspot } from '../../domain/types'
import { hasFlags, isBranchComplete } from '../../domain/progress'
import { useGameStore } from '../../state/useGameStore'
import { HoldInteract } from '../ui/HoldInteract'
import { QuizModal } from '../ui/QuizModal'
import { PdfFloorPlan } from './PdfFloorPlan'
import '../map/CampusMapView.css'

type Props = {
  branch: BuildingBranch
  backTo?: string
}

export function IndoorBranch({ branch, backTo = '/map' }: Props) {
  const navigate = useNavigate()
  const progress = useGameStore((s) => s.progress)
  const setFlag = useGameStore((s) => s.setFlag)
  const showToast = useGameStore((s) => s.showToast)
  const [active, setActive] = useState<IndoorHotspot | null>(null)
  const [quizOpen, setQuizOpen] = useState(false)

  const complete = isBranchComplete(
    progress,
    branch.id,
    branch.completeWhenFlags,
  )

  const ordered = useMemo(() => branch.hotspots, [branch.hotspots])
  const stepDone = ordered.filter((h) => progress[branch.id].flags[h.rewardFlag]).length

  function unlockReward(hotspot: IndoorHotspot) {
    const updatedFlags = {
      ...progress[branch.id].flags,
      [hotspot.rewardFlag]: true,
    }
    setFlag(branch.id, hotspot.rewardFlag)
    const wouldComplete = branch.completeWhenFlags.every((f) => updatedFlags[f])
    if (wouldComplete) {
      showToast(branch.completeToast)
    }
  }

  function onHotspotClick(hotspot: IndoorHotspot) {
    const unlocked = hasFlags(progress, branch.id, hotspot.requiresFlags)
    if (!unlocked) {
      showToast(hotspot.lockedCopy ?? 'Complete earlier steps first.')
      return
    }
    setActive(hotspot)
    if (hotspot.interaction === 'quiz') setQuizOpen(true)
  }

  function onInteractComplete() {
    if (!active) return
    if (active.interaction === 'jump' && active.jumpToWorldId) {
      setFlag(branch.id, active.rewardFlag)
      navigate(`/world/${active.jumpToWorldId}`)
      return
    }
    if (active.interaction === 'tap' || active.interaction === 'hold') {
      unlockReward(active)
      setActive(null)
    }
  }

  const isPdf = branch.floorPlanKey.toLowerCase().endsWith('.pdf')

  return (
    <div className="app-shell" style={{ height: '100dvh', minHeight: '100%' }}>
      <div className="indoor-top">
        <div>
          <strong>{branch.title}</strong>
          <div className="muted" style={{ fontSize: '0.85rem' }}>
            {branch.enterCopy}
          </div>
        </div>
        <Link className="btn btn-ghost" to={backTo}>
          Exit
        </Link>
      </div>

      {branch.sequential ? (
        <div className="stepper" aria-label="Path progress">
          {ordered.map((h, i) => (
            <span
              key={h.id}
              className={`step${progress[branch.id].flags[h.rewardFlag] || i < stepDone ? ' step-on' : ''}`}
            />
          ))}
        </div>
      ) : null}

      {complete ? (
        <div className="banner banner-demo">Branch complete — return anytime.</div>
      ) : null}

      <div className="indoor-stage">
        {isPdf ? (
          <PdfFloorPlan
            pdfPath={branch.floorPlanKey}
            pageNumber={branch.floorPlanPage ?? 1}
          />
        ) : (
          <img
            className="indoor-art"
            src={assetUrl(branch.floorPlanKey)}
            alt={`${branch.title} floor plan`}
          />
        )}
        {ordered.map((h) => {
          const done = !!progress[branch.id].flags[h.rewardFlag]
          const unlocked = hasFlags(progress, branch.id, h.requiresFlags)
          return (
            <button
              key={h.id}
              type="button"
              className={`hotspot${done ? ' hotspot-done' : ''}${!unlocked ? ' hotspot-locked' : ''}`}
              style={{ left: `${h.x * 100}%`, top: `${h.y * 100}%` }}
              aria-label={h.label}
              onClick={() => onHotspotClick(h)}
            />
          )
        })}
      </div>

      {active && active.interaction !== 'quiz' ? (
        <div className="sheet stack">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0 }}>{active.label}</h2>
            <button type="button" className="btn btn-ghost" onClick={() => setActive(null)}>
              Close
            </button>
          </div>
          <p style={{ margin: 0 }}>{active.copy}</p>
          {progress[branch.id].flags[active.rewardFlag] ? (
            <div className="chip chip-success">Already logged</div>
          ) : active.interaction === 'hold' ? (
            <HoldInteract holdMs={active.holdMs} onComplete={onInteractComplete} />
          ) : active.interaction === 'jump' ? (
            <button type="button" className="btn btn-primary" onClick={onInteractComplete}>
              Jump into memory world
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={onInteractComplete}>
              Collect
            </button>
          )}
        </div>
      ) : null}

      {active?.interaction === 'quiz' && quizOpen && active.quiz ? (
        <QuizModal
          prompt={active.quiz.prompt}
          options={active.quiz.options}
          answerIndex={active.quiz.answerIndex}
          hint={active.quiz.hint}
          failCopy={active.quiz.failCopy}
          onClose={() => {
            setQuizOpen(false)
            setActive(null)
          }}
          onCorrect={() => {
            unlockReward(active)
            setQuizOpen(false)
            setActive(null)
            showToast('Tower sightline logged')
          }}
        />
      ) : null}
    </div>
  )
}
