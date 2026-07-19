import { useCallback, useEffect, useState } from 'react'

export type UserCoords = {
  latitude: number
  longitude: number
}

const STORAGE_KEY = 'jungle-carz-user-coords'

function readStoredCoords(): UserCoords | null {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    if (!saved) return null
    const parsed = JSON.parse(saved) as UserCoords
    if (
      Number.isFinite(parsed.latitude) &&
      Number.isFinite(parsed.longitude)
    ) {
      return parsed
    }
  } catch {
    /* ignore */
  }
  return null
}

function storeCoords(coords: UserCoords) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(coords))
  } catch {
    /* ignore */
  }
}

export function useUserLocation() {
  const [coords, setCoords] = useState<UserCoords | null>(readStoredCoords)
  const [loading, setLoading] = useState(true)
  const [denied, setDenied] = useState(false)

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLoading(false)
      return
    }

    setLoading(true)
    setDenied(false)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const next = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
        storeCoords(next)
        setCoords(next)
        setDenied(false)
        setLoading(false)
      },
      () => {
        setDenied(true)
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    )
  }, [])

  useEffect(() => {
    requestLocation()
  }, [requestLocation])

  return { coords, loading, denied, refresh: requestLocation }
}

export function parseUserCoordsFromParams(
  lat: string | null,
  lng: string | null
): UserCoords | null {
  if (!lat || !lng) return null
  const latitude = Number.parseFloat(lat)
  const longitude = Number.parseFloat(lng)
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null
  return { latitude, longitude }
}
