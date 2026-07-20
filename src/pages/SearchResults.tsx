import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Map } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { SearchSummary } from '../components/search/SearchSummary'
import { FilterSidebar } from '../components/search/FilterSidebar'
import {
  FilterDrawer,
  MobileFilterButton,
} from '../components/search/FilterDrawer'
import { SortDropdown } from '../components/search/SortDropdown'
import { CarGrid } from '../components/search/CarGrid'
import { LoadingSkeleton } from '../components/search/LoadingSkeleton'
import { NoResults } from '../components/search/NoResults'
import { Pagination } from '../components/search/Pagination'
import { OfferBanner } from '../components/search/OfferBanner'
import { BottomCTA, MapViewPlaceholder } from '../components/search/BottomCTA'
import { fetchAllCars } from '../utils/carsStorage'
import { geocodeAddress } from '../utils/geolocation'
import { DEFAULT_FILTERS, DEFAULT_SEARCH } from '../constants/filters'
import {
  filterAndSortCars,
  getTripDays,
  useCarFilters,
} from '../hooks/useCarFilters'
import { useUserLocation, parseUserCoordsFromParams } from '../hooks/useUserLocation'
import type {
  CarListing,
  FilterState,
  SearchParams,
  SortOption,
} from '../types/search'

const PAGE_SIZE = 9

export function SearchResults() {
  const [params] = useSearchParams()
  const [allCars, setAllCars] = useState<CarListing[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [draftFilters, setDraftFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [sort, setSort] = useState<SortOption>('recommended')
  const [mapView, setMapView] = useState(false)
  const [page, setPage] = useState(1)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchCoords, setSearchCoords] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const { coords: gpsCoords, denied, loading: locationLoading, refresh } =
    useUserLocation()

  const userCoords = useMemo(
    () =>
      parseUserCoordsFromParams(params.get('lat'), params.get('lng')) ??
      gpsCoords ??
      searchCoords,
    [params, gpsCoords, searchCoords],
  )

  const search: SearchParams = {
    pickupCity: params.get('city') || DEFAULT_SEARCH.pickupCity,
    dropCity:
      params.get('dropCity') ||
      params.get('city') ||
      DEFAULT_SEARCH.dropCity,
    pickupDate: params.get('pickup') || DEFAULT_SEARCH.pickupDate,
    pickupTime: params.get('pickupTime') || DEFAULT_SEARCH.pickupTime,
    dropDate: params.get('drop') || DEFAULT_SEARCH.dropDate,
    dropTime: params.get('dropTime') || DEFAULT_SEARCH.dropTime,
    rentalType:
      (params.get('type') as SearchParams['rentalType']) ||
      DEFAULT_SEARCH.rentalType,
    category: params.get('category') === 'tourism' ? 'tourism' : 'regular',
  }

  const categoryCars = useMemo(
    () =>
      allCars.filter((car) =>
        search.category === 'tourism'
          ? car.category === 'tourism'
          : (car.category ?? 'regular') !== 'tourism',
      ),
    [allCars, search.category],
  )

  const tripDays = getTripDays(search.pickupDate, search.dropDate)
  const searchQuery = useMemo(() => params.toString(), [params])
  const tripTimes = useMemo(
    () => ({
      pickupDate: search.pickupDate,
      dropDate: search.dropDate,
      pickupTime: search.pickupTime,
      dropTime: search.dropTime,
    }),
    [search],
  )
  const filteredCars = useCarFilters(categoryCars, filters, sort)
  const totalPages = Math.max(1, Math.ceil(filteredCars.length / PAGE_SIZE))
  const paginatedCars = useMemo(
    () =>
      filteredCars.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredCars, page],
  )

  const draftResultCount = useMemo(
    () => filterAndSortCars(categoryCars, draftFilters, sort).length,
    [categoryCars, draftFilters, sort],
  )

  useEffect(() => {
    setLoading(true)
    fetchAllCars()
      .then(setAllCars)
      .catch(() => setAllCars([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setPage(1)
  }, [filters, sort])

  useEffect(() => {
    if (
      parseUserCoordsFromParams(params.get('lat'), params.get('lng')) ||
      gpsCoords
    ) {
      return
    }

    const locationAddress = params.get('location')
    const city = params.get('city')
    if (!locationAddress) return

    let cancelled = false
    geocodeAddress(locationAddress, city ?? undefined).then((hit) => {
      if (!cancelled && hit) setSearchCoords(hit)
    })

    return () => {
      cancelled = true
    }
  }, [params, gpsCoords])

  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
    setDraftFilters(DEFAULT_FILTERS)
    setPage(1)
  }, [])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.priceRange[0] !== DEFAULT_FILTERS.priceRange[0]) count++
    if (filters.priceRange[1] !== DEFAULT_FILTERS.priceRange[1]) count++
    count += filters.vehicleTypes.length
    count += filters.transmission.length
    count += filters.fuelTypes.length
    count += filters.seats.length
    count += filters.brands.length
    if (filters.minRating) count++
    if (filters.driverOption !== 'all') count++
    if (filters.freeCancellation) count++
    if (filters.instantBooking) count++
    if (filters.unlimitedKm) count++
    if (filters.airConditioning) count++
    if (filters.bluetooth) count++
    if (filters.sunroof) count++
    return count
  }, [filters])

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="search" />

      <div className="bg-dark pt-20 pb-6">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10">
          <SearchSummary />
        </div>
      </div>

      <main className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-10">
        <div className="flex gap-5 lg:gap-6 xl:gap-8">
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            onReset={handleReset}
          />

          <div className="min-w-0 flex-1">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <MobileFilterButton
                  onClick={() => {
                    setDraftFilters(filters)
                    setDrawerOpen(true)
                  }}
                  activeCount={activeFilterCount}
                />
                <p className="text-lg font-bold text-dark">
                  <span className="text-primary">{filteredCars.length}</span>{' '}
                  {search.category === 'tourism'
                    ? 'Tourism Cars Available'
                    : 'Cars Available'}
                </p>
                {!userCoords && !locationLoading && (
                  <button
                    type="button"
                    onClick={refresh}
                    className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-100"
                  >
                    {denied
                      ? 'Enable location to see distance from you'
                      : 'Use my location for distance'}
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <SortDropdown value={sort} onChange={setSort} />
                <button
                  type="button"
                  onClick={() => setMapView((v) => !v)}
                  aria-pressed={mapView}
                  className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                    mapView
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-200 bg-white text-dark hover:border-primary/30'
                  }`}
                >
                  <Map className="h-4 w-4" />
                  Map View
                </button>
              </div>
            </div>

            <AnimatePresence>
              <MapViewPlaceholder visible={mapView} city={search.pickupCity} />
            </AnimatePresence>

            {loading ? (
              <LoadingSkeleton count={6} />
            ) : filteredCars.length === 0 ? (
              <NoResults onReset={handleReset} />
            ) : (
              <>
                <CarGrid
                  cars={paginatedCars}
                  tripDays={tripDays}
                  searchQuery={searchQuery}
                  tripTimes={tripTimes}
                  userCoords={userCoords}
                />
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </>
            )}

            <OfferBanner />
            <div className="mt-6">
              <BottomCTA />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        draftFilters={draftFilters}
        onDraftChange={setDraftFilters}
        onApply={() => {
          setFilters(draftFilters)
          setDrawerOpen(false)
        }}
        onReset={handleReset}
        resultCount={draftResultCount}
      />
    </div>
  )
}
