/**
 * distance.js, Haversine distance utility + postcode → lat/lng lookup.
 *
 * HOW TO PLUG IN:
 * ───────────────
 * 1. User enters their postcode in the radius filter.
 * 2. Call lookupPostcode(postcode) → { lat, lng } via postcodes.io (free, no API key).
 * 3. For each college/event/job, call haversine(userLat, userLng, item.lat, item.lng).
 * 4. Filter items where distance <= selectedRadiusMiles.
 * 5. For Reed.co.uk API: pass radiusMiles as the distanceFromLocation param directly.
 *
 * postcodes.io endpoint:
 *   GET https://api.postcodes.io/postcodes/{postcode}
 *   Response: { result: { latitude, longitude } }
 */

const EARTH_RADIUS_MILES = 3958.8

/**
 * Compute great-circle distance between two lat/lng points (Haversine formula).
 * @param {number} lat1
 * @param {number} lng1
 * @param {number} lat2
 * @param {number} lng2
 * @returns {number} Distance in miles, rounded to 1 decimal place.
 */
export function haversine(lat1, lng1, lat2, lng2) {
  const toRad = (d) => (d * Math.PI) / 180
  const dLat  = toRad(lat2 - lat1)
  const dLng  = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return parseFloat((EARTH_RADIUS_MILES * 2 * Math.asin(Math.sqrt(a))).toFixed(1))
}

/**
 * Resolve a UK postcode to {lat, lng} using the postcodes.io free API (no key needed).
 * Returns null if the postcode is invalid or the request fails.
 * @param {string} postcode
 * @returns {Promise<{lat: number, lng: number}|null>}
 */
export async function lookupPostcode(postcode) {
  const clean = postcode.trim().toUpperCase().replace(/\s+/g, '')
  if (!clean) return null
  try {
    const res  = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(clean)}`)
    const data = await res.json()
    if (data.status === 200 && data.result) {
      return { lat: data.result.latitude, lng: data.result.longitude }
    }
    return null
  } catch {
    return null
  }
}

/**
 * Default user coordinates used when no postcode has been entered.
 * Set to central Manchester as the app's primary area.
 */
export const DEFAULT_COORDS = { lat: 53.4808, lng: -2.2426 }
