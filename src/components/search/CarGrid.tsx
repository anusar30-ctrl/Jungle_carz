import type { CarListing } from '../../types/search'
import type { UserCoords } from '../../hooks/useUserLocation'
import { CarCard } from './CarCard'

interface CarGridProps {
  cars: CarListing[]
  tripDays: number
  searchQuery?: string
  tripTimes?: {
    pickupDate: string
    dropDate: string
    pickupTime: string
    dropTime: string
  }
  userCoords?: UserCoords | null
}

export function CarGrid({
  cars,
  tripDays,
  searchQuery,
  tripTimes,
  userCoords,
}: CarGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
      {cars.map((car, index) => (
        <CarCard
          key={car.id}
          car={car}
          tripDays={tripDays}
          searchQuery={searchQuery}
          tripTimes={tripTimes}
          priority={index < 6}
          userCoords={userCoords}
        />
      ))}
    </div>
  )
}
