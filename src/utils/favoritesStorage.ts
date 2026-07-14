import { api } from '../lib/api'

export async function fetchFavoriteIds(): Promise<string[]> {
  const res = await api<{ carIds: string[] }>('/favorites')
  return res.carIds
}

export async function addFavorite(carId: string): Promise<string[]> {
  const res = await api<{ carIds: string[] }>(`/favorites/${carId}`, {
    method: 'POST',
  })
  return res.carIds
}

export async function removeFavorite(carId: string): Promise<string[]> {
  const res = await api<{ carIds: string[] }>(`/favorites/${carId}`, {
    method: 'DELETE',
  })
  return res.carIds
}

export async function toggleFavoriteApi(
  carId: string,
  isCurrentlyFavorite: boolean,
): Promise<string[]> {
  return isCurrentlyFavorite
    ? removeFavorite(carId)
    : addFavorite(carId)
}
