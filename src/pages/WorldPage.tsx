import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { assetUrl } from '../config/assets'
import { FloorPlanStage } from '../components/indoor/FloorPlanStage'
import { ScanInteract } from '../components/ui/ScanInteract'
import { melvilleBranch } from '../data/melville'
import { wangBranch } from '../data/wang'
import type { BuildingId, IndoorHotspot, MemoryWorld } from '../domain/types'
import { hasFlags } from '../domain/progress'
import { useGameStore } from '../state/useGameStore'
import '../components/map/CampusMapView.css'

function findWorld(worldId: string): { building: BuildingId; world: MemoryWorld } | null {
  // Old demo URLs still work
  const aliases: Record<string, string> = {
    'wang-mirror': 'wang-gardens',
    'melville-1963': 'melville-memory',
  }
  const id = aliases[worldId] ?? worldId
  for (const branch of [melvilleBranch, wangBranch]) {
    const world = branch.worlds.find((w) => w.id === id)
    if (world) return { building: branch.id, world }
  }
  return null
}

export function WorldPage() {
  const { worldId } = useParams()
  const found = worldId ? findWorld(worldId) : null
  const progress = useGameStore((s) => s.progress)
  const setFlag = useGameStore((s) => s.setFlag)
  const showToast = useGameStore((s) => s.showToast)
  const [active, setActive] = useState<IndoorHotspot | null>(null)

  const backPath = useMemo(() => {
    if (!found) return '/map'
    return `/building/${found.building}`
  }, [found])

  if (!found) return <Navigate to="/map" replace />

  const { building, world } = found
  const demoMode = progress.settings.demoMode
  const foundCount = world.hotspots.filter((h) => progress[building].flags[h.rewardFlag]).length

  function completeHotspot(h: IndoorHotspot) {
    setFlag(building, h.rewardFlag)
    showToast(`Logged: ${h.label}`)
    if (h.rewardFlag.endsWith('.complete')) {
      showToast('Memory layer complete')
    }
    setActive(null)
  }

  return (
    <div className="app-shell" style={{ height: '100dvh', minHeight: '100%' }}>
      <div className="indoor-top">
        <div>
          <strong>{world.title}</strong>
          <div className="muted" style={{ fontSize: '0.85rem' }}>
            Real campus photos · {foundCount}/{world.hotspots.length} · camera match
          </div>
        </div>
        <Link className="btn btn-ghost" to={backPath}>
          {world.exitLabel}
        </Link>
      </div>

      <div className="hunt-list" style={{ maxHeight: '28vh' }}>
        {world.hotspots.map((h, i) => {
          const done = !!progress[building].flags[h.rewardFlag]
          const unlocked = hasFlags(progress, building, h.requiresFlags)
          return (
            <button
              key={h.id}
              type="button"
              className={`hunt-item${done ? ' hunt-item-done' : ''}${!unlocked ? ' hunt-item-locked' : ''}`}
              disabled={!unlocked}
              onClick={() => {
                if (!unlocked) {
                  showToast('Finish earlier photo stops first')
                  return
                }
                setActive(h)
              }}
            >
              <span className="hunt-num">{done ? '✓' : i + 1}</span>
              <span className="hunt-item-body">
                <strong>{h.label}</strong>
                <span className="muted">{done ? 'Logged' : unlocked ? 'Scan photo' : 'Locked'}</span>
              </span>
            </button>
          )
        })}
      </div>

      <FloorPlanStage
        imagePath={world.backgroundKey}
        alt={world.title}
        aspectRatio={1200 / 900}
      >
        {world.hotspots.map((h) => {
          const done = !!progress[building].flags[h.rewardFlag]
          const unlocked = hasFlags(progress, building, h.requiresFlags)
          return (
            <button
              key={h.id}
              type="button"
              className={`hotspot${done ? ' hotspot-done' : ''}${!unlocked ? ' hotspot-locked' : ''}`}
              style={{ left: `${h.x * 100}%`, top: `${h.y * 100}%` }}
              aria-label={h.label}
              title={h.label}
              onClick={() => {
                if (!unlocked) {
                  showToast('Finish earlier photo stops first')
                  return
                }
                setActive(h)
              }}
            />
          )
        })}
      </FloorPlanStage>

      {active ? (
        <div className="sheet stack" style={{ maxHeight: '55dvh', overflow: 'auto' }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0 }}>{active.label}</h2>
            <button type="button" className="btn btn-ghost" onClick={() => setActive(null)}>
              Close
            </button>
          </div>
          <p style={{ margin: 0 }}>{active.copy}</p>
          {progress[building].flags[active.rewardFlag] ? (
            <>
              {active.imageKey ? (
                <img className="scan-ref" src={assetUrl(active.imageKey)} alt={active.label} />
              ) : null}
              <div className="chip chip-success">Logged · real photo still shown</div>
            </>
          ) : active.interaction === 'hold' && active.imageKey ? (
            <ScanInteract
              key={active.id}
              imagePath={active.imageKey}
              holdMs={active.holdMs}
              allowDemoPass={demoMode}
              onComplete={() => completeHotspot(active)}
            />
          ) : (
            <button type="button" className="btn btn-primary" onClick={() => completeHotspot(active)}>
              Collect
            </button>
          )}
        </div>
      ) : null}
    </div>
  )
}
