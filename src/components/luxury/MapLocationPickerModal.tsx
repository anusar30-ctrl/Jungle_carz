import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import L from 'leaflet'
import { Crosshair, Loader2, MapPin, Search, X } from 'lucide-react'
import {
  SUGGESTED_LOCATIONS_BY_CITY,
  type SuggestedPickupSpot,
} from '../../constants/luxury'
import {
  detectLiveLocation,
  reverseGeocode,
  searchPlaces,
} from '../../utils/geolocation'
import type { SelectedLocation } from './LocationPickerModal'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

import 'leaflet/dist/leaflet.css'

type PlaceResult = {
  name: string
  address: string
  latitude: number
  longitude: number
}

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})
L.Marker.prototype.options.icon = DefaultIcon

const AUTOCOMPLETE_DEBOUNCE_MS = 320
const MIN_QUERY_LENGTH = 2

type MapLocationPickerModalProps = {
  open: boolean
  city: string
  selection: SelectedLocation | null
  title?: string
  onClose: () => void
  onContinue: (location: SelectedLocation) => void
}

function getCityCenter(city: string): { latitude: number; longitude: number } {
  const spots =
    SUGGESTED_LOCATIONS_BY_CITY[
      city as keyof typeof SUGGESTED_LOCATIONS_BY_CITY
    ] ?? []
  const first = spots.find(
    (spot) => spot.latitude != null && spot.longitude != null,
  )
  if (first?.latitude != null && first.longitude != null) {
    return { latitude: first.latitude, longitude: first.longitude }
  }
  return { latitude: 12.9716, longitude: 77.5946 }
}

function spotToResult(spot: SuggestedPickupSpot): PlaceResult | null {
  if (spot.latitude == null || spot.longitude == null) return null
  return {
    name: spot.name,
    address: spot.address,
    latitude: spot.latitude,
    longitude: spot.longitude,
  }
}

function getLocalSuggestions(city: string, query: string): PlaceResult[] {
  const q = query.trim().toLowerCase()
  if (q.length < MIN_QUERY_LENGTH) return []

  const spots =
    SUGGESTED_LOCATIONS_BY_CITY[
      city as keyof typeof SUGGESTED_LOCATIONS_BY_CITY
    ] ?? []

  return spots
    .filter(
      (spot) =>
        spot.name.toLowerCase().includes(q) ||
        spot.address.toLowerCase().includes(q),
    )
    .map(spotToResult)
    .filter((spot): spot is PlaceResult => spot != null)
    .slice(0, 5)
}

function mergePlaceResults(
  local: PlaceResult[],
  remote: PlaceResult[],
): PlaceResult[] {
  const seen = new Set<string>()
  const merged: PlaceResult[] = []

  for (const item of [...local, ...remote]) {
    const key = `${item.latitude.toFixed(5)}:${item.longitude.toFixed(5)}`
    if (seen.has(key)) continue
    seen.add(key)
    merged.push(item)
  }

  return merged.slice(0, 8)
}

export function MapLocationPickerModal({
  open,
  city,
  selection,
  title = 'Select location on map',
  onClose,
  onContinue,
}: MapLocationPickerModalProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const skipAutocompleteRef = useRef(false)
  const searchRequestRef = useRef(0)

  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<PlaceResult[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searching, setSearching] = useState(false)
  const [locating, setLocating] = useState(false)
  const [resolving, setResolving] = useState(false)
  const [draft, setDraft] = useState<SelectedLocation | null>(null)
  const [error, setError] = useState('')
  const updateDraftRef = useRef<
    (latitude: number, longitude: number) => Promise<void>
  >(async () => {})

  const setQueryWithoutAutocomplete = (value: string) => {
    skipAutocompleteRef.current = true
    setQuery(value)
    setShowSuggestions(false)
    setSearchResults([])
  }

  const placeMarker = useCallback((latitude: number, longitude: number) => {
    const map = mapRef.current
    if (!map) return

    if (markerRef.current) {
      markerRef.current.setLatLng([latitude, longitude])
    } else {
      markerRef.current = L.marker([latitude, longitude], { draggable: true })
        .addTo(map)
        .on('dragend', () => {
          const pos = markerRef.current?.getLatLng()
          if (pos) void updateDraftRef.current(pos.lat, pos.lng)
        })
    }
  }, [])

  updateDraftRef.current = async (latitude: number, longitude: number) => {
    setResolving(true)
    setError('')
    placeMarker(latitude, longitude)
    const result = await reverseGeocode(latitude, longitude)
    if (result) {
      setDraft({
        name: result.name,
        address: result.address,
        latitude,
        longitude,
      })
      setQueryWithoutAutocomplete(result.address)
    } else {
      setError('Could not resolve address for this point.')
    }
    setResolving(false)
  }

  const updateDraftFromCoords = (latitude: number, longitude: number) =>
    updateDraftRef.current(latitude, longitude)

  const initMap = useCallback(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const center = selection
      ? { latitude: selection.latitude, longitude: selection.longitude }
      : getCityCenter(city)

    const map = L.map(mapContainerRef.current, {
      center: [center.latitude, center.longitude],
      zoom: 13,
      zoomControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    map.on('click', (e) => {
      void updateDraftFromCoords(e.latlng.lat, e.latlng.lng)
    })

    mapRef.current = map

    if (selection) {
      placeMarker(selection.latitude, selection.longitude)
      setDraft(selection)
      setQueryWithoutAutocomplete(selection.address)
    }

    setTimeout(() => map.invalidateSize(), 100)
  }, [city, placeMarker, selection])

  useEffect(() => {
    if (!open) return

    setDraft(selection)
    setQueryWithoutAutocomplete(selection?.address ?? '')
    setError('')

    const timer = window.setTimeout(() => initMap(), 50)
    return () => window.clearTimeout(timer)
  }, [open, initMap, selection])

  useEffect(() => {
    if (!open && mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
      markerRef.current = null
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    if (skipAutocompleteRef.current) {
      skipAutocompleteRef.current = false
      return
    }

    const trimmed = query.trim()
    if (trimmed.length < MIN_QUERY_LENGTH) {
      setSearchResults([])
      setShowSuggestions(false)
      setSearching(false)
      return
    }

    setShowSuggestions(true)
    const local = getLocalSuggestions(city, trimmed)
    setSearchResults(local)

    const requestId = ++searchRequestRef.current
    const timer = window.setTimeout(async () => {
      setSearching(true)
      const remote = await searchPlaces(trimmed, city)
      if (requestId !== searchRequestRef.current) return

      const merged = mergePlaceResults(local, remote)
      setSearchResults(merged)
      setShowSuggestions(true)
      setSearching(false)

      if (merged.length === 0) {
        setError('No places found. Try a different spelling or tap on the map.')
      } else {
        setError('')
      }
    }, AUTOCOMPLETE_DEBOUNCE_MS)

    return () => window.clearTimeout(timer)
  }, [query, city, open])

  const handleSearch = async () => {
    const trimmed = query.trim()
    if (trimmed.length < MIN_QUERY_LENGTH) return

    setShowSuggestions(true)
    setSearching(true)
    setError('')

    const local = getLocalSuggestions(city, trimmed)
    const remote = await searchPlaces(trimmed, city)
    const merged = mergePlaceResults(local, remote)
    setSearchResults(merged)

    if (merged.length === 0) {
      setError('No places found. Try another search or tap on the map.')
    }
    setSearching(false)
  }

  const handleSelectResult = async (result: PlaceResult) => {
    setShowSuggestions(false)
    setSearchResults([])
    setQueryWithoutAutocomplete(result.address)
    mapRef.current?.flyTo([result.latitude, result.longitude], 15, {
      duration: 0.8,
    })
    setDraft({
      name: result.name,
      address: result.address,
      latitude: result.latitude,
      longitude: result.longitude,
    })
    placeMarker(result.latitude, result.longitude)
    setError('')
  }

  const handleCurrentLocation = async () => {
    setLocating(true)
    setError('')
    setShowSuggestions(false)
    try {
      const result = await detectLiveLocation()
      mapRef.current?.flyTo([result.latitude, result.longitude], 16, {
        duration: 0.8,
      })
      setDraft({
        name: result.locationName,
        address: result.fullAddress,
        latitude: result.latitude,
        longitude: result.longitude,
      })
      setQueryWithoutAutocomplete(result.fullAddress)
      placeMarker(result.latitude, result.longitude)
    } catch {
      setError('Could not detect location. Allow GPS or tap on the map.')
    } finally {
      setLocating(false)
    }
  }

  const handleContinue = () => {
    if (!draft) {
      setError('Tap on the map or search to select a drop location.')
      return
    }
    onContinue(draft)
    onClose()
  }

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[520] flex items-center justify-center bg-black/50 p-3 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 12 }}
            transition={{ duration: 0.2 }}
            className="relative flex h-[min(92vh,720px)] w-full max-w-2xl flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="map-picker-title"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <h2
                  id="map-picker-title"
                  className="text-lg font-bold text-dark"
                >
                  {title}
                </h2>
                <p className="text-xs text-muted">
                  Start typing to see places, or tap the map to drop a pin
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative z-20 border-b border-gray-100 px-4 py-3">
              <div className="flex gap-2">
                <div className="relative min-w-0 flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setError('')
                      setQuery(e.target.value)
                    }}
                    onFocus={() => {
                      if (query.trim().length >= MIN_QUERY_LENGTH) {
                        setShowSuggestions(true)
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        void handleSearch()
                      }
                      if (e.key === 'Escape') {
                        setShowSuggestions(false)
                      }
                    }}
                    placeholder="Search for area, street, or landmark"
                    className="w-full rounded-xl border border-gray-200 py-2.5 pr-3 pl-9 text-sm outline-none focus:border-primary"
                    autoComplete="off"
                    role="combobox"
                    aria-expanded={showSuggestions && searchResults.length > 0}
                    aria-controls="map-place-suggestions"
                  />

                  {showSuggestions && query.trim().length >= MIN_QUERY_LENGTH && (
                    <ul
                      id="map-place-suggestions"
                      role="listbox"
                      className="absolute top-[calc(100%+6px)] right-0 left-0 z-30 max-h-52 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg"
                    >
                      {searching && searchResults.length === 0 && (
                        <li className="flex items-center gap-2 px-3 py-3 text-sm text-muted">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          Searching places...
                        </li>
                      )}

                      {searchResults.map((result) => (
                        <li key={`${result.latitude}-${result.longitude}`}>
                          <button
                            type="button"
                            role="option"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => void handleSelectResult(result)}
                            className="flex w-full gap-2 border-b border-gray-50 px-3 py-2.5 text-left last:border-b-0 hover:bg-primary/5"
                          >
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-semibold text-dark">
                                {result.name}
                              </span>
                              <span className="block truncate text-xs text-muted">
                                {result.address}
                              </span>
                            </span>
                          </button>
                        </li>
                      ))}

                      {!searching && searchResults.length === 0 && (
                        <li className="px-3 py-3 text-sm text-muted">
                          No matching places. Try another keyword.
                        </li>
                      )}
                    </ul>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => void handleCurrentLocation()}
                  disabled={locating}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-60"
                  aria-label="Use current location"
                >
                  {locating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Crosshair className="h-4 w-4" />
                  )}
                </button>
              </div>

              {error && <p className="mt-2 text-xs text-amber-600">{error}</p>}
            </div>

            <div className="relative min-h-0 flex-1">
              <div ref={mapContainerRef} className="absolute inset-0 z-0" />
              {resolving && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 px-4 py-4">
              {draft ? (
                <div className="mb-3 flex gap-2 rounded-xl bg-primary/5 px-3 py-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-dark">
                      {draft.name}
                    </p>
                    <p className="truncate text-xs text-muted">{draft.address}</p>
                  </div>
                </div>
              ) : (
                <p className="mb-3 text-sm text-muted">
                  Tap anywhere on the map to drop a pin
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-2xl border border-gray-200 py-3 text-sm font-semibold text-dark hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={!draft || resolving}
                  className="flex-1 rounded-2xl bg-primary py-3 text-sm font-bold tracking-wide text-white uppercase hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Confirm location
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
