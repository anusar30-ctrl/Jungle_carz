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
import { SortDropdown, ViewToggle } from '../components/search/SortDropdown'
import { CarGrid } from '../components/search/CarGrid'
import { LoadingSkeleton } from '../components/search/LoadingSkeleton'
import { NoResults } from '../components/search/NoResults'
import { Pagination } from '../components/search/Pagination'
import { OfferBanner } from '../components/search/OfferBanner'
import { BottomCTA, MapViewPlaceholder } from '../components/search/BottomCTA'
import { fetchAllCars } from '../utils/carsStorage'
import { DEFAULT_FILTERS, DEFAULT_SEARCH } from '../constants/filters'
import {
  filterAndSortCars,
  getTripDays,
  useCarFilters,
} from '../hooks/useCarFilters'
import { useUserLocation } from '../hooks/useUserLocation'
import type {
  CarListing,
  FilterState,
  SearchParams,
  SortOption,
  ViewMode,
} from '../types/search'

const PAGE_SIZE = 10

export function SearchResults() {
  const [params] = useSearchParams()
  const [allCars, setAllCars] = useState<CarListing[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [draftFilters, setDraftFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [sort, setSort] = useState<SortOption>('recommended')
  const [view, setView] = useState<ViewMode>('list')
  const [mapView, setMapView] = useState(false)
  const [page, setPage] = useState(1)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { coords: userCoords } = useUserLocation()

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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SearchSummary />
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            onReset={handleReset}
          />

          <div className="min-w-0 flex-1 lg:w-[75%]">
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
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <SortDropdown value={sort} onChange={setSort} />
                <ViewToggle view={view} onChange={setView} />
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
              <LoadingSkeleton count={view === 'grid' ? 6 : 4} />
            ) : filteredCars.length === 0 ? (
              <NoResults onReset={handleReset} />
            ) : (
              <>
                <CarGrid
                  cars={paginatedCars}
                  view={view}
                  tripDays={tripDays}
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
