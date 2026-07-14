import type { CarListing, ViewMode } from '../../types/search'
import { CarCard } from './CarCard'

interface CarGridProps {
  cars: CarListing[]
  view: ViewMode
  tripDays: number
}

export function CarGrid({ cars, view, tripDays }: CarGridProps) {
  return (
    <div
      className={
        view === 'grid'
          ? 'grid gap-5 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3'
          : 'flex flex-col gap-5'
      }
    >
      {cars.map((car) => (
        <CarCard key={car.id} car={car} view={view} tripDays={tripDays} />
      ))}
    </div>
  )
}
