import { useEffect, useState } from 'react'

export type UserCoords = {
  latitude: number
  longitude: number
}

export function useUserLocation() {
  const [coords, setCoords] = useState<UserCoords | null>(null)
  const [loading, setLoading] = useState(true)
  const [denied, setDenied] = useState(false)

  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setLoading(false)
      },
      () => {
        setDenied(true)
        setLoading(false)
      },
      {
        enableHighAccuracy: false,
        timeout: 12000,
        maximumAge: 300000,
      }
    )
  }, [])

  return { coords, loading, denied }
}
