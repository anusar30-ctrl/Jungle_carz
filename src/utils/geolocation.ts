import { LUXURY_LOCATIONS } from '../constants/luxury'

type NominatimAddress = {
  house_number?: string
  road?: string
  suburb?: string
  neighbourhood?: string
  city?: string
  town?: string
  village?: string
  state_district?: string
  county?: string
}

export type LiveLocationResult = {
  locationName: string
  city: string | null
  fullAddress: string
  latitude: number
  longitude: number
}

const CITY_ALIASES: Record<string, string> = {
  Bengaluru: 'Bangalore',
  Bangaluru: 'Bangalore',
  Bombay: 'Mumbai',
  'New Delhi': 'Delhi',
  Noida: 'Delhi',
  Gurgaon: 'Delhi',
  Gurugram: 'Delhi',
}

function matchLuxuryCity(rawCity?: string): string | null {
  if (!rawCity) return null

  const normalized = CITY_ALIASES[rawCity] ?? rawCity
  const lower = normalized.toLowerCase()

  return (
    LUXURY_LOCATIONS.find(
      (city) =>
        city.toLowerCase() === lower || lower.includes(city.toLowerCase())
    ) ?? null
  )
}

function formatLocationName(address: NominatimAddress): string {
  const parts: string[] = []

  if (address.house_number) parts.push(address.house_number)
  if (address.road) parts.push(address.road)
  else if (address.suburb) parts.push(address.suburb)
  else if (address.neighbourhood) parts.push(address.neighbourhood)

  const name = parts.join(', ')
  if (name) {
    return name.length > 48 ? `${name.slice(0, 45)}...` : name
  }

  return ''
}

function extractCity(address: NominatimAddress): string | null {
  const candidates = [
    address.city,
    address.town,
    address.village,
    address.state_district,
    address.county,
  ]

  for (const candidate of candidates) {
    const match = matchLuxuryCity(candidate)
    if (match) return match
  }

  return null
}

export async function detectLiveLocation(): Promise<LiveLocationResult> {
  if (!navigator.geolocation) {
    throw new Error('Geolocation is not supported on this device')
  }

  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000,
    })
  })

  const { latitude, longitude } = position.coords
  const coordFallback = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' } }
    )
    if (res.ok) {
      const data = (await res.json()) as {
        display_name?: string
        address?: NominatimAddress
      }

      const fullAddress = data.display_name ?? coordFallback
      const city = extractCity(data.address ?? {})
      const locationName =
        formatLocationName(data.address ?? {}) ||
        fullAddress.split(',')[0]?.trim() ||
        coordFallback

      return {
        locationName,
        city,
        fullAddress,
        latitude,
        longitude,
      }
    }
  } catch {
    /* use coordinates fallback */
  }

  return {
    locationName: coordFallback,
    city: null,
    fullAddress: coordFallback,
    latitude,
    longitude,
  }
}

function cityInAddress(address: string, city: string): boolean {
  const normalized = address.toLowerCase()
  const cityLower = city.toLowerCase()
  if (normalized.includes(cityLower)) return true
  if (cityLower === 'bangalore' && normalized.includes('bengaluru')) return true
  if (cityLower === 'delhi' && normalized.includes('new delhi')) return true
  return false
}

async function searchNominatim(
  query: string
): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`,
      { headers: { 'Accept-Language': 'en' } }
    )
    if (!res.ok) return null
    const data = (await res.json()) as Array<{ lat: string; lon: string }>
    const hit = data[0]
    if (!hit) return null
    return {
      latitude: Number.parseFloat(hit.lat),
      longitude: Number.parseFloat(hit.lon),
    }
  } catch {
    return null
  }
}

export async function geocodeAddress(
  address: string,
  city?: string,
  hint?: string
): Promise<{ latitude: number; longitude: number } | null> {
  const trimmed = address.trim()
  if (!trimmed) return null

  const queries: string[] = []
  if (city && !cityInAddress(trimmed, city)) {
    queries.push(`${trimmed}, ${city}, India`)
  } else {
    queries.push(`${trimmed}, India`)
  }
  if (hint && city) queries.push(`${hint}, ${city}, India`)
  const firstPart = trimmed.split(',')[0]?.trim()
  if (firstPart && firstPart !== trimmed && city) {
    queries.push(`${firstPart}, ${city}, India`)
  }

  const seen = new Set<string>()
  for (const query of queries) {
    if (seen.has(query)) continue
    seen.add(query)
    const hit = await searchNominatim(query)
    if (hit) return hit
  }

  return null
}
