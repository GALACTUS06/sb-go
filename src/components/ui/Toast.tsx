import { useGameStore } from '../../state/useGameStore'

export function Toast() {
  const toast = useGameStore((s) => s.toast)
  if (!toast) return null
  return <div className="toast">{toast}</div>
}
