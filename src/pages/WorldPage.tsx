import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { melvilleBranch } from '../data/melville'
import { wangBranch } from '../data/wang'
import type { BuildingId, IndoorHotspot, MemoryWorld } from '../domain/types'
import { hasFlags } from '../domain/progress'
import { useGameStore } from '../state/useGameStore'
import { HoldInteract } from '../components/ui/HoldInteract'
import '../components/map/CampusMapView.css'

function findWorld(worldId: string): { building: BuildingId; world: MemoryWorld } | null {
  for (const branch of [melvilleBranch, wangBranch]) {
    const world = branch.worlds.find((w) => w.id === worldId)
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

  function completeHotspot(h: IndoorHotspot) {
    setFlag(building, h.rewardFlag)
    if (h.rewardFlag.endsWith('.complete')) {
      showToast('Memory world sealed')
    }
    setActive(null)
  }

  return (
    <div className="app-shell" style={{ height: '100%' }}>
      <div className="indoor-top">
        <div>
          <strong>{world.title}</strong>
          <div className="muted" style={{ fontSize: '0.85rem' }}>Memory layer</div>
        </div>
        <Link className="btn btn-ghost" to={backPath}>
          {world.exitLabel}
        </Link>
      </div>
      <div className="indoor-stage">
        <img className="indoor-art" src={world.backgroundKey} alt={world.title} />
        {world.hotspots.map((h) => {
          const done = !!progress[building].flags[h.rewardFlag]
          const unlocked = hasFlags(progress, building, h.requiresFlags)
          return (
            <button
              key={h.id}
              type="button"
              className={`hotspot${done ? ' hotspot-done' : ''}${!unlocked ? ' hotspot-locked' : ''}`}
              style={{ left: `${h.x * 100}%`, top: `${h.y * 100}%` }}
              onClick={() => {
                if (!unlocked) {
                  showToast('Finish the other echoes first')
                  return
                }
                setActive(h)
              }}
            />
          )
        })}
      </div>
      {active ? (
        <div className="sheet stack">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0 }}>{active.label}</h2>
            <button type="button" className="btn btn-ghost" onClick={() => setActive(null)}>
              Close
            </button>
          </div>
          <p style={{ margin: 0 }}>{active.copy}</p>
          {progress[building].flags[active.rewardFlag] ? (
            <div className="chip chip-success">Already logged</div>
          ) : active.interaction === 'hold' ? (
            <HoldInteract holdMs={active.holdMs} onComplete={() => completeHotspot(active)} />
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
