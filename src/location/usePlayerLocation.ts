import { useEffect, useRef, useState } from 'react'
import { ACCURACY_WARN_M, STALE_FIX_MS, WATCH_OPTIONS } from '../config/geo'
import type { PlayerLocation } from '../domain/types'

export type PermissionStatus = 'unknown' | 'prompt' | 'granted' | 'denied' | 'unavailable'

type Options = {
  enabled?: boolean
  demoLocation?: PlayerLocation | null
}

export function usePlayerLocation({ enabled = true, demoLocation = null }: Options) {
  const [location, setLocation] = useState<PlayerLocation | null>(null)
  const [permission, setPermission] = useState<PermissionStatus>('unknown')
  const [error, setError] = useState<string | null>(null)
  const watchId = useRef<number | null>(null)

  useEffect(() => {
    if (demoLocation) {
      setLocation(demoLocation)
      setPermission('granted')
      setError(null)
      return
    }

    if (!enabled) return

    if (!('geolocation' in navigator)) {
      setPermission('unavailable')
      setError('Geolocation is not available on this device.')
      return
    }

    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        setPermission('granted')
        setError(null)
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracyM: pos.coords.accuracy,
          timestamp: pos.timestamp,
          source: 'gps',
        })
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setPermission('denied')
          setError('Location permission denied.')
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setPermission('unavailable')
          setError('Location unavailable.')
        } else {
          setError('Location timeout — retrying…')
        }
      },
      WATCH_OPTIONS,
    )

    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current)
        watchId.current = null
      }
    }
  }, [enabled, demoLocation])

  const noisy =
    !!location && location.source === 'gps' && location.accuracyM > ACCURACY_WARN_M
  const stale =
    !!location &&
    location.source === 'gps' &&
    Date.now() - location.timestamp > STALE_FIX_MS

  return { location, permission, error, noisy, stale }
}
