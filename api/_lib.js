/**
 * api/_lib.js — small shared helpers for the server-side data routes.
 *
 * These routes run on a Node host (Vercel / Netlify Functions / Render / a tiny
 * Express server) and in local dev via the Vite middleware in vite.config.js.
 * They read every third-party key from process.env and NEVER expose it to the
 * browser. When a required key is missing they return an honest 503 with a
 * clear message — they never invent placeholder data.
 */

export function sendJson(res, status, payload) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(payload))
}

/** A configured-but-unavailable / key-absent response (honest, not fake data). */
export function sendNeedsKey(res, feature, envName) {
  sendJson(res, 503, {
    ok: false,
    configured: false,
    feature,
    message: `Live ${feature} needs a key to go live. Set ${envName} on the server to enable it.`,
  })
}

/** Read query params from a Node request url, with an optional base. */
export function getQuery(req) {
  const url = new URL(req.url, 'http://localhost')
  return Object.fromEntries(url.searchParams.entries())
}

/** Parse a JSON body if present (POST). Resolves to {} on empty/invalid. */
export function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return Promise.resolve(req.body)
  return new Promise((resolve) => {
    let data = ''
    req.on('data', (chunk) => { data += chunk })
    req.on('end', () => {
      if (!data) return resolve({})
      try { resolve(JSON.parse(data)) } catch { resolve({}) }
    })
    req.on('error', () => resolve({}))
  })
}

const EARTH_RADIUS_MILES = 3958.8

/** Great-circle distance in miles (shared with the client util). */
export function haversine(lat1, lng1, lat2, lng2) {
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return parseFloat((EARTH_RADIUS_MILES * 2 * Math.asin(Math.sqrt(a))).toFixed(1))
}

/** Resolve a UK postcode to { lat, lng } via the free postcodes.io API (no key). */
export async function geocodePostcode(postcode) {
  const clean = String(postcode || '').trim().toUpperCase().replace(/\s+/g, '')
  if (!clean) return null
  try {
    const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(clean)}`)
    const data = await res.json()
    if (data.status === 200 && data.result) {
      return { lat: data.result.latitude, lng: data.result.longitude }
    }
    return null
  } catch {
    return null
  }
}
