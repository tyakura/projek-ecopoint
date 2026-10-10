const TOKEN_KEY = 'ecopoint_token'

// In development, VITE_API_URL is intentionally empty — Vite's dev proxy
// forwards /api/* to VITE_API_TARGET (localhost:8080). In production
// (Vercel), VITE_API_URL must be set to the Railway backend URL, e.g.:
//   https://ecopoint-backend.up.railway.app
//
// If it is missing in production, requests would silently hit the Vercel
// frontend domain (which has no /api routes), causing 404 errors.
const API_BASE = import.meta.env.VITE_API_URL || ''

// Detect production: Vite replaces import.meta.env.DEV at build time.
if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
  console.error(
    '[EcoPoint] VITE_API_URL is not set. ' +
    'All API calls will fail with 404. ' +
    'Set VITE_API_URL in your Vercel project environment variables ' +
    'to your Railway backend URL (e.g. https://ecopoint-backend.up.railway.app).'
  )
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

async function request(method, path, body) {
  // Guard: fail fast with a clear message instead of a confusing 404
  if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
    throw new Error(
      'Backend URL is not configured. ' +
      'Set VITE_API_URL in Vercel environment variables and redeploy.'
    )
  }

  const headers = {}
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  if (body) headers['Content-Type'] = 'application/json'

  const res = await fetch(`${API_BASE}/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`)
  }
  return data
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
}
