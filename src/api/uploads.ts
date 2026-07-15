import { ApiError, getToken } from '../lib/api'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

export async function uploadCarImages(files: File[]): Promise<string[]> {
  if (!files.length) return []

  const formData = new FormData()
  for (const file of files) {
    formData.append('images', file)
  }

  const token = getToken()
  const headers: Record<string, string> = {}
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_BASE}/uploads/car-images`, {
    method: 'POST',
    headers,
    body: formData,
  })

  const data = (await res.json().catch(() => ({}))) as {
    urls?: string[]
    error?: string
  }

  if (!res.ok) {
    throw new ApiError(res.status, data.error || res.statusText)
  }

  return data.urls ?? []
}
