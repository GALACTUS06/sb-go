import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assetUrl } from '../../config/assets'
import type { BuildingBranch, IndoorHotspot } from '../../domain/types'
import { hasFlags, isBranchComplete } from '../../domain/progress'
import { useGameStore } from '../../state/useGameStore'
import { QuizModal } from '../ui/QuizModal'
import { ScanInteract } from '../ui/ScanInteract'
import { FloorPlanStage } from './FloorPlanStage'
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
  const [listOpen, setListOpen] = useState(true)

  const complete = isBranchComplete(
    progress,
    branch.id,
    branch.completeWhenFlags,
  )

  const huntStops = useMemo(
    () => branch.hotspots.filter((h) => h.interaction !== 'jump'),
    [branch.hotspots],
  )
  const memoryGate = useMemo(
    () => branch.hotspots.find((h) => h.interaction === 'jump' && h.jumpToWorldId),
    [branch.hotspots],
  )

  const foundCount = huntStops.filter(
    (h) => progress[branch.id].flags[h.rewardFlag],
  ).length

  const nextTarget = useMemo(() => {
    return (
      huntStops.find(
        (h) =>
          !progress[branch.id].flags[h.rewardFlag] &&
          hasFlags(progress, branch.id, h.requiresFlags),
      ) ?? null
    )
  }, [huntStops, progress, branch.id])

  const memoryUnlocked = memoryGate
    ? hasFlags(progress, branch.id, memoryGate.requiresFlags)
    : false

  function unlockReward(hotspot: IndoorHotspot) {
    const updatedFlags = {
      ...progress[branch.id].flags,
      [hotspot.rewardFlag]: true,
    }
    setFlag(branch.id, hotspot.rewardFlag)
    showToast(`Found: ${hotspot.label}`)
    const wouldComplete = branch.completeWhenFlags.every((f) => updatedFlags[f])
    if (wouldComplete) {
      showToast(branch.completeToast)
    }
  }

  function onHotspotClick(hotspot: IndoorHotspot) {
    const unlocked = hasFlags(progress, branch.id, hotspot.requiresFlags)
    if (!unlocked) {
      showToast(hotspot.lockedCopy ?? 'Finish earlier clues first')
      return
    }
    setActive(hotspot)
    if (hotspot.interaction === 'quiz') setQuizOpen(true)
  }

  function enterMemory() {
    if (!memoryGate?.jumpToWorldId) return
    setFlag(branch.id, memoryGate.rewardFlag)
    navigate(`/world/${memoryGate.jumpToWorldId}`)
  }

  function onInteractComplete() {
    if (!active) return
    if (active.interaction === 'jump' && active.jumpToWorldId) {
      enterMemory()
      return
    }
    if (active.interaction === 'tap' || active.interaction === 'hold') {
      unlockReward(active)
      setActive(null)
      setQuizOpen(false)
    }
  }

  return (
    <div className="app-shell" style={{ height: '100dvh', minHeight: '100%' }}>
      <div className="indoor-top">
        <div>
          <strong>{branch.title}</strong>
          <div className="muted" style={{ fontSize: '0.85rem' }}>
            Indoor hunt · {foundCount}/{huntStops.length} found
            {memoryUnlocked ? ' · memory unlocked' : ''}
          </div>
        </div>
        <Link className="btn btn-ghost" to={backTo}>
          Exit
        </Link>
      </div>

      <div className="hunt-progress">
        <div className="hunt-progress-bar">
          <span style={{ width: `${(foundCount / Math.max(1, huntStops.length)) * 100}%` }} />
        </div>
        <button type="button" className="btn btn-ghost" onClick={() => setListOpen((v) => !v)}>
          {listOpen ? 'Hide list' : 'Hunt list'}
        </button>
      </div>

      {listOpen ? (
        <div className="hunt-list">
          {huntStops.map((h, i) => {
            const done = !!progress[branch.id].flags[h.rewardFlag]
            const unlocked = hasFlags(progress, branch.id, h.requiresFlags)
            const isNext = nextTarget?.id === h.id
            return (
              <button
                key={h.id}
                type="button"
                className={`hunt-item${done ? ' hunt-item-done' : ''}${isNext ? ' hunt-item-next' : ''}${!unlocked ? ' hunt-item-locked' : ''}`}
                disabled={!unlocked}
                onClick={() => onHotspotClick(h)}
              >
                <span className="hunt-num">{done ? '✓' : i + 1}</span>
                <span className="hunt-item-body">
                  <strong>{h.label}</strong>
                  <span className="muted">
                    {done
                      ? 'Found'
                      : isNext
                        ? 'Current target — open clue'
                        : unlocked
                          ? 'Available'
                          : 'Locked'}
                  </span>
                </span>
              </button>
            )
          })}
          {memoryGate ? (
            <button
              type="button"
              className={`hunt-item hunt-item-memory${memoryUnlocked ? ' hunt-item-next' : ' hunt-item-locked'}`}
              disabled={!memoryUnlocked}
              onClick={() => (memoryUnlocked ? enterMemory() : undefined)}
            >
              <span className="hunt-num">★</span>
              <span className="hunt-item-body">
                <strong>{memoryGate.label}</strong>
                <span className="muted">
                  {memoryUnlocked
                    ? 'Enter memory layer anytime (real photos)'
                    : memoryGate.lockedCopy}
                </span>
              </span>
            </button>
          ) : null}
        </div>
      ) : null}

      {complete ? (
        <div className="banner banner-demo">Indoor hunt complete — memory layer stays open.</div>
      ) : null}

      {memoryUnlocked && memoryGate ? (
        <div className="banner-memory">
          <span>
            Memory ready: <strong>{memoryGate.label.replace('→', '').trim()}</strong>
          </span>
          <button type="button" className="btn btn-primary" onClick={enterMemory}>
            Enter now
          </button>
        </div>
      ) : null}

      {nextTarget && !listOpen ? (
        <div className="banner banner-demo">
          Next: <strong>{nextTarget.label}</strong>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ marginLeft: 8 }}
            onClick={() => onHotspotClick(nextTarget)}
          >
            Open clue
          </button>
        </div>
      ) : null}

      <FloorPlanStage imagePath={branch.floorPlanKey} alt={`${branch.title} floor plan`}>
        {branch.hotspots.map((h) => {
          const done = !!progress[branch.id].flags[h.rewardFlag]
          const unlocked = hasFlags(progress, branch.id, h.requiresFlags)
          const isJump = h.interaction === 'jump'
          const isNext = nextTarget?.id === h.id
          return (
            <button
              key={h.id}
              type="button"
              className={`hotspot${done ? ' hotspot-done' : ''}${!unlocked ? ' hotspot-locked' : ''}${isJump ? ' hotspot-jump' : ''}${isNext ? ' hotspot-next' : ''}`}
              style={{ left: `${h.x * 100}%`, top: `${h.y * 100}%` }}
              aria-label={h.label}
              title={h.label}
              onClick={() => onHotspotClick(h)}
            />
          )
        })}
      </FloorPlanStage>

      {active && active.interaction !== 'quiz' ? (
        <div className="sheet stack" style={{ maxHeight: '58dvh', overflow: 'auto' }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0 }}>{active.label}</h2>
            <button type="button" className="btn btn-ghost" onClick={() => setActive(null)}>
              Close
            </button>
          </div>
          <p style={{ margin: 0 }}>{active.copy}</p>

          {active.interaction === 'jump' ? (
            <>
              {active.imageKey ? (
                <img className="scan-ref" src={assetUrl(active.imageKey)} alt={active.label} />
              ) : null}
              <button type="button" className="btn btn-primary" onClick={enterMemory}>
                Enter memory layer
              </button>
            </>
          ) : progress[branch.id].flags[active.rewardFlag] ? (
            <>
              {active.imageKey ? (
                <img className="scan-ref" src={assetUrl(active.imageKey)} alt={active.label} />
              ) : null}
              <div className="chip chip-success">Found · photo still available</div>
            </>
          ) : active.imageKey ? (
            <ScanInteract
              key={active.id}
              imagePath={active.imageKey}
              holdMs={active.holdMs}
              allowDemoPass={progress.settings.demoMode}
              onComplete={onInteractComplete}
            />
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
          imagePath={active.imageKey}
          onClose={() => {
            setQuizOpen(false)
            setActive(null)
          }}
          onCorrect={() => {
            unlockReward(active)
            setQuizOpen(false)
            setActive(null)
          }}
        />
      ) : null}
    </div>
  )
}
