import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Crosshair, Loader2, MapPin, X } from 'lucide-react'
import {
  SUGGESTED_LOCATIONS_BY_CITY,
  type SuggestedPickupSpot,
} from '../../constants/luxury'
import { detectLiveLocation, geocodeAddress } from '../../utils/geolocation'

export type SelectedLocation = {
  name: string
  address: string
  latitude: number
  longitude: number
}

type LocationPickerModalProps = {
  open: boolean
  city: string
  selection: SelectedLocation | null
  title?: string
  searchPlaceholder?: string
  showMapPreview?: boolean
  onClose: () => void
  onContinue: (location: SelectedLocation) => void
}

export function LocationPickerModal({
  open,
  city,
  selection,
  title = 'Book Affordable Cars Instantly',
  searchPlaceholder,
  showMapPreview = false,
  onClose,
  onContinue,
}: LocationPickerModalProps) {
  const [query, setQuery] = useState('')
  const [locating, setLocating] = useState(false)
  const [resolving, setResolving] = useState(false)
  const [draftCoords, setDraftCoords] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setQuery(selection?.address ?? '')
      setDraftCoords(
        selection
          ? { latitude: selection.latitude, longitude: selection.longitude }
          : null
      )
      setError('')
    }
  }, [open, selection])

  const suggestions = useMemo(() => {
    if (!city) return []
    const spots =
      SUGGESTED_LOCATIONS_BY_CITY[
        city as keyof typeof SUGGESTED_LOCATIONS_BY_CITY
      ] ?? []
    const q = query.trim().toLowerCase()
    if (!q) return spots
    return spots.filter(
      (spot) =>
        spot.name.toLowerCase().includes(q) ||
        spot.address.toLowerCase().includes(q)
    )
  }, [city, query])

  const handleCurrentLocation = async () => {
    setLocating(true)
    setError('')
    try {
      const result = await detectLiveLocation()
      setQuery(result.fullAddress)
      setDraftCoords({
        latitude: result.latitude,
        longitude: result.longitude,
      })
    } catch {
      setError('Could not detect location. Allow GPS access or pick a spot.')
    } finally {
      setLocating(false)
    }
  }

  const handleSelectSpot = (spot: SuggestedPickupSpot) => {
    if (spot.latitude != null && spot.longitude != null) {
      onContinue({
        name: spot.name,
        address: spot.address,
        latitude: spot.latitude,
        longitude: spot.longitude,
      })
      onClose()
      return
    }

    setQuery(spot.address)
    setDraftCoords(null)
    setError('')
  }

  const handleContinue = async () => {
    const trimmed = query.trim()
    if (!trimmed) {
      setError('Please select or enter a location.')
      return
    }

    setResolving(true)
    setError('')

    const matched = suggestions.find((spot) => spot.address === trimmed)
    let latitude = draftCoords?.latitude
    let longitude = draftCoords?.longitude

    if (latitude == null || longitude == null) {
      const geocoded = await geocodeAddress(trimmed, city, matched?.name)
      if (!geocoded) {
        setError('Could not find coordinates for this address.')
        setResolving(false)
        return
      }
      latitude = geocoded.latitude
      longitude = geocoded.longitude
    }

    onContinue({
      name: matched?.name ?? trimmed.split(',')[0]?.trim() ?? trimmed,
      address: trimmed,
      latitude,
      longitude,
    })
    setResolving(false)
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
          className="fixed inset-0 z-[520] flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg rounded-lg bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="location-picker-title"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-md transition-colors hover:text-gray-800"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="p-5 pt-6">
              <p
                id="location-picker-title"
                className="mb-4 text-center font-outfit text-lg font-bold text-gray-900"
              >
                {title}
              </p>

              <div className="rounded border border-gray-300 px-3 py-2 focus-within:border-primary">
                <label className="block text-xs text-gray-500">Location</label>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setDraftCoords(null)
                    setError('')
                  }}
                  placeholder={
                    searchPlaceholder ??
                    (city ? 'Search or enter pickup address' : 'Select a city first')
                  }
                  className="w-full border-0 bg-transparent py-1 font-outfit text-sm text-gray-900 outline-none"
                />
              </div>

              {showMapPreview && draftCoords && (
                <iframe
                  title="Selected location map"
                  className="mt-3 h-44 w-full rounded-lg border border-gray-200"
                  loading="lazy"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${draftCoords.longitude - 0.025}%2C${draftCoords.latitude - 0.018}%2C${draftCoords.longitude + 0.025}%2C${draftCoords.latitude + 0.018}&layer=mapnik&marker=${draftCoords.latitude}%2C${draftCoords.longitude}`}
                />
              )}

              <button
                type="button"
                onClick={handleCurrentLocation}
                disabled={locating}
                className="mt-3 flex w-full items-center gap-3 rounded-md bg-gray-100 px-4 py-3 text-left font-outfit text-sm font-medium text-gray-800 transition-colors hover:bg-gray-200 disabled:opacity-60"
              >
                {locating ? (
                  <Loader2 className="h-5 w-5 shrink-0 animate-spin text-primary" />
                ) : (
                  <Crosshair className="h-5 w-5 shrink-0 text-gray-600" />
                )}
                Current Location
              </button>

              {error && (
                <p className="mt-2 text-xs text-amber-600">{error}</p>
              )}

              <div className="mt-4 overflow-hidden rounded border border-gray-200">
                <div className="bg-gray-100 px-4 py-2 text-center font-outfit text-xs font-semibold tracking-wide text-gray-600">
                  SUGGESTED LOCATIONS
                </div>
                <ul className="max-h-56 overflow-y-auto">
                  {suggestions.length === 0 ? (
                    <li className="px-4 py-6 text-center font-outfit text-sm text-gray-500">
                      {city
                        ? 'No matching locations. Type your address above.'
                        : 'Select a city on the form first.'}
                    </li>
                  ) : (
                    suggestions.map((spot) => (
                      <li key={spot.name}>
                        <button
                          type="button"
                          onClick={() => handleSelectSpot(spot)}
                          className="flex w-full gap-3 border-b border-gray-100 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-gray-50"
                        >
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                          <span className="min-w-0">
                            <span className="block font-outfit text-sm font-semibold text-gray-900">
                              {spot.name}
                            </span>
                            <span className="mt-0.5 block font-outfit text-xs text-gray-500">
                              {spot.address}
                            </span>
                          </span>
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={resolving}
                  className="rounded bg-primary px-8 py-2.5 font-outfit text-sm font-bold tracking-wide text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
                >
                  {resolving ? 'PLEASE WAIT...' : 'CONTINUE'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
