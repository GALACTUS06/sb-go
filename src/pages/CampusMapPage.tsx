import { CampusMapView } from '../components/map/CampusMapView'

export function CampusMapPage() {
  return (
    <div className="app-shell map-wide" style={{ height: '100dvh', minHeight: '100%' }}>
      <CampusMapView />
    </div>
  )
}
