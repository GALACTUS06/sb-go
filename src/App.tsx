import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Toast } from './components/ui/Toast'
import { BuildingPage } from './pages/BuildingPage'
import { CampusMapPage } from './pages/CampusMapPage'
import { HomePage } from './pages/HomePage'
import { SettingsPage } from './pages/SettingsPage'
import { SitesListPage } from './pages/SitesListPage'
import { WorldPage } from './pages/WorldPage'
import { useGameStore } from './state/useGameStore'

export default function App() {
  const hydrate = useGameStore((s) => s.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<CampusMapPage />} />
        <Route path="/sites" element={<SitesListPage />} />
        <Route path="/building/:buildingId" element={<BuildingPage />} />
        <Route path="/world/:worldId" element={<WorldPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toast />
    </>
  )
}
