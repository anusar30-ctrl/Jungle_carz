const TOKEN_KEY = 'jungle-carz-token'
const API_BASE = import.meta.env.VITE_API_URL || '/api'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export async function api<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const { auth = true, headers: extraHeaders, ...rest } = options
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(extraHeaders as Record<string, string>),
  }

  if (auth !== false) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  let res: Response
  try {
    res = await fetch(`${API_BASE}${path}`, { ...rest, headers })
  } catch {
    throw new ApiError(
      0,
      'Cannot reach the API. Start the backend with: cd backend && npm run dev'
    )
  }
  let data: { error?: string } = {}
  try {
    data = (await res.json()) as { error?: string }
  } catch {
    if (!res.ok) {
      throw new ApiError(
        res.status,
        'Cannot reach the API. Start the backend with: cd backend && npm run dev'
      )
    }
  }

  if (!res.ok) {
    throw new ApiError(res.status, data.error || res.statusText)
  }

  return data as T
}
