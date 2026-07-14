import { api } from '../lib/api'
import type { CarListing } from '../types/search'

export async function fetchAllCars(
  category?: 'regular' | 'tourism',
): Promise<CarListing[]> {
  const qs = category ? `?category=${category}` : ''
  const res = await api<{ cars: CarListing[] }>(`/cars${qs}`, { auth: false })
  return res.cars
}

export async function fetchCarById(id: string): Promise<CarListing | null> {
  try {
    const res = await api<{ car: CarListing }>(`/cars/${id}`, { auth: false })
    return res.car
  } catch {
    return null
  }
}

export type CarFormInput = Omit<
  CarListing,
  'id' | 'createdAt' | 'reviews' | 'rating' | 'popularity'
> & {
  rating?: number
  reviews?: number
  popularity?: number
}

export async function addCar(input: CarFormInput): Promise<CarListing> {
  const res = await api<{ car: CarListing }>('/cars', {
    method: 'POST',
    body: JSON.stringify({
      ...input,
      name: input.name || `${input.brand} ${input.model}`,
      images: input.images.filter(Boolean),
      featureChips: input.featureChips.filter(Boolean),
    }),
  })
  return res.car
}

export async function updateCar(
  id: string,
  patch: Partial<CarFormInput>,
): Promise<CarListing> {
  const res = await api<{ car: CarListing }>(`/cars/${id}`, {
    method: 'PUT',
    body: JSON.stringify(patch),
  })
  return res.car
}

export async function deleteCar(id: string): Promise<void> {
  await api(`/cars/${id}`, { method: 'DELETE' })
}
