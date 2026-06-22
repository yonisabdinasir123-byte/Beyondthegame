/**
 * api/colleges.js — Local colleges and opening hours (task H).
 *
 * Source: Google Places API (GOOGLE_PLACES_API_KEY), server-side only.
 *   1. Text Search for colleges near a location (lat/lng + radius).
 *   2. Place Details for opening hours on the top results.
 *
 * IMPORTANT: open-DAY dates are NOT available from Google Places. Each result
 * carries an editable `openDay: null` field and `openDayNeedsSource: true` so
 * the UI can flag that open-day dates need a per-college source.
 *
 * Query: ?lat=53.48&lng=-2.24&radius=16&query=college
 * Returns: { ok, configured, colleges: [{ id, name, address, openNow,
 *            hours, rating, distanceMiles, openDay, openDayNeedsSource }] }
 */
import { sendJson, sendNeedsKey, getQuery, haversine } from './_lib.js'

export default async function handler(req, res) {
  const { lat, lng, radius = '16', query = 'college' } = getQuery(req)
  const key = process.env.GOOGLE_PLACES_API_KEY

  if (!key) return sendNeedsKey(res, 'local colleges', 'GOOGLE_PLACES_API_KEY')
  if (!lat || !lng) {
    return sendJson(res, 400, { ok: false, configured: true, message: 'Enter a postcode so we can find colleges near you.', colleges: [] })
  }

  const radiusMeters = Math.min(Math.round(Number(radius) * 1609.34), 50000)

  try {
    const searchParams = new URLSearchParams({
      query: `${query} near`,
      location: `${lat},${lng}`,
      radius: String(radiusMeters),
      type: 'school',
      key,
    })
    const r = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?${searchParams}`)
    const data = await r.json()
    if (data.status && data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Places status ${data.status}`)
    }

    const top = (data.results || []).slice(0, 10)

    // Fetch opening hours for each via Place Details (in parallel)
    const detailed = await Promise.all(top.map(async (place) => {
      let hours = null
      let openNow = place.opening_hours?.open_now ?? null
      try {
        const dParams = new URLSearchParams({
          place_id: place.place_id,
          fields: 'opening_hours',
          key,
        })
        const dr = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?${dParams}`)
        const dData = await dr.json()
        hours = dData.result?.opening_hours?.weekday_text ?? null
        if (dData.result?.opening_hours?.open_now != null) openNow = dData.result.opening_hours.open_now
      } catch { /* hours stay null */ }

      const ploc = place.geometry?.location
      const distanceMiles = ploc ? haversine(Number(lat), Number(lng), ploc.lat, ploc.lng) : null

      return {
        id: place.place_id,
        name: place.name,
        address: place.formatted_address,
        openNow,
        hours,
        rating: place.rating ?? null,
        distanceMiles,
        openDay: null,            // editable per-college field
        openDayNeedsSource: true, // flag: Places does not provide open-day dates
      }
    }))

    detailed.sort((a, b) => (a.distanceMiles ?? 1e9) - (b.distanceMiles ?? 1e9))
    return sendJson(res, 200, { ok: true, configured: true, colleges: detailed })
  } catch {
    return sendJson(res, 502, { ok: false, configured: true, message: 'The colleges source is temporarily unavailable. Try again shortly.', colleges: [] })
  }
}
