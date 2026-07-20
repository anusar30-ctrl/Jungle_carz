import type { FilterState } from '../../types/search'
import {
  BRANDS,
  DEFAULT_FILTERS,
  FUEL_TYPES,
  PRICE_MAX,
  PRICE_MIN,
  RATING_OPTIONS,
  SEAT_OPTIONS,
  TRANSMISSIONS,
  VEHICLE_TYPES,
} from '../../constants/filters'
import {
  CheckboxGroup,
  FilterSection,
  PriceRangeSlider,
  ToggleFilter,
} from './FilterControls'

interface FilterPanelContentProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  onApply?: () => void
  onReset: () => void
  showActions?: boolean
}

export function FilterPanelContent({
  filters,
  onChange,
  onApply,
  onReset,
  showActions = true,
}: FilterPanelContentProps) {
  const update = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K],
  ) => {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-1">
        <FilterSection title="Price Range">
          <PriceRangeSlider
            min={PRICE_MIN}
            max={PRICE_MAX}
            value={filters.priceRange}
            onChange={(v) => update('priceRange', v)}
          />
        </FilterSection>

        <FilterSection title="Vehicle Type">
          <CheckboxGroup
            options={VEHICLE_TYPES}
            selected={filters.vehicleTypes}
            onChange={(v) => update('vehicleTypes', v)}
          />
        </FilterSection>

        <FilterSection title="Transmission">
          <CheckboxGroup
            options={TRANSMISSIONS}
            selected={filters.transmission}
            onChange={(v) => update('transmission', v)}
          />
        </FilterSection>

        <FilterSection title="Fuel Type">
          <CheckboxGroup
            options={FUEL_TYPES}
            selected={filters.fuelTypes}
            onChange={(v) => update('fuelTypes', v)}
          />
        </FilterSection>

        <FilterSection title="Seats">
          <CheckboxGroup
            options={SEAT_OPTIONS.map((s) => ({
              value: s,
              label: s === 8 ? '8+' : String(s),
            }))}
            selected={filters.seats}
            onChange={(v) => update('seats', v)}
          />
        </FilterSection>

        <FilterSection title="Brands" defaultOpen={false}>
          <CheckboxGroup
            options={BRANDS.map((b) => ({ value: b, label: b }))}
            selected={filters.brands}
            onChange={(v) => update('brands', v)}
            columns={1}
          />
        </FilterSection>

        <FilterSection title="Rating">
          <div className="flex flex-wrap gap-2">
            {RATING_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  update(
                    'minRating',
                    filters.minRating === value ? null : value,
                  )
                }
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                  filters.minRating === value
                    ? 'bg-primary text-white shadow-md shadow-primary/25'
                    : 'border border-gray-200 bg-white text-dark hover:border-primary/30'
                }`}
              >
                ★ {label}
              </button>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Driver Option">
          <div className="flex flex-wrap gap-2">
            {(
              [
                { value: 'all', label: 'All' },
                { value: 'self-drive', label: 'Self Drive' },
                { value: 'with-driver', label: 'With Driver' },
              ] as const
            ).map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => update('driverOption', value)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                  filters.driverOption === value
                    ? 'bg-primary text-white shadow-md shadow-primary/25'
                    : 'border border-gray-200 bg-white text-dark hover:border-primary/30'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Features">
          <div className="space-y-1">
            <ToggleFilter
              id="free-cancel"
              label="Free Cancellation"
              checked={filters.freeCancellation}
              onChange={(v) => update('freeCancellation', v)}
            />
            <ToggleFilter
              id="instant-book"
              label="Instant Booking"
              checked={filters.instantBooking}
              onChange={(v) => update('instantBooking', v)}
            />
            <ToggleFilter
              id="unlimited-km"
              label="Unlimited KM"
              checked={filters.unlimitedKm}
              onChange={(v) => update('unlimitedKm', v)}
            />
            <ToggleFilter
              id="ac"
              label="Air Conditioning"
              checked={filters.airConditioning}
              onChange={(v) => update('airConditioning', v)}
            />
            <ToggleFilter
              id="bluetooth"
              label="Bluetooth"
              checked={filters.bluetooth}
              onChange={(v) => update('bluetooth', v)}
            />
            <ToggleFilter
              id="sunroof"
              label="Sunroof"
              checked={filters.sunroof}
              onChange={(v) => update('sunroof', v)}
            />
          </div>
        </FilterSection>
      </div>

      {showActions && (
        <div className="mt-4 flex gap-3 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 rounded-2xl border border-gray-200 py-3 text-sm font-semibold text-dark transition-all hover:border-primary/30"
          >
            Reset Filters
          </button>
          <button
            type="button"
            onClick={onApply}
            className="flex-1 rounded-2xl bg-primary py-3 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary-dark"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  )
}

interface FilterSidebarProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  onReset: () => void
}

export function FilterSidebar({
  filters,
  onChange,
  onReset,
}: FilterSidebarProps) {
  return (
    <aside className="hidden w-[240px] shrink-0 lg:block xl:w-[260px]">
      <div className="sticky top-28 rounded-[24px] border border-gray-100 bg-white p-5 shadow-card">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-bold text-dark">Filters</h2>
          <button
            type="button"
            onClick={onReset}
            className="text-sm font-semibold text-primary hover:underline"
          >
            Reset
          </button>
        </div>
        <FilterPanelContent
          filters={filters}
          onChange={onChange}
          onReset={() => onChange(DEFAULT_FILTERS)}
          onApply={() => {}}
        />
      </div>
    </aside>
  )
}
