/**
 * api/events.js — Job fairs and events (task H).
 *
 * Source: Eventbrite (EVENTBRITE_TOKEN), server-side only.
 *
 * NOTE / HONEST FLAG: Eventbrite retired its public event-search endpoint for
 * most apps. Even with a valid token, /v3/events/search/ commonly returns 404
 * unless your app has been granted partner search access. This route is wired
 * cleanly and will return live results IF your token has search access; if not,
 * it returns an honest "needs partner access" state rather than fake events.
 *
 * Query: ?location=Manchester&distance=20&q=job+fair
 * Returns: { ok, configured, partnerAccess, events: [...] } or honest flag.
 */
import { sendJson, sendNeedsKey, getQuery } from './_lib.js'

export default async function handler(req, res) {
  const { location = '', distance = '20', q = 'job fair' } = getQuery(req)
  const token = process.env.EVENTBRITE_TOKEN

  if (!token) return sendNeedsKey(res, 'job fairs and events', 'EVENTBRITE_TOKEN')

  try {
    const params = new URLSearchParams({
      q,
      'location.address': location,
      'location.within': `${distance}mi`,
      expand: 'venue',
      sort_by: 'date',
    })
    const r = await fetch(`https://www.eventbriteapi.com/v3/events/search/?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    // Eventbrite returns 404/403 when search isn't enabled for the app.
    if (r.status === 404 || r.status === 403) {
      return sendJson(res, 200, {
        ok: true,
        configured: true,
        partnerAccess: false,
        events: [],
        message: 'Eventbrite search needs partner access for this token. Showing no live events until that is granted.',
      })
    }
    if (!r.ok) throw new Error(`Eventbrite responded ${r.status}`)

    const data = await r.json()
    const events = (data.events || []).map((e) => ({
      id: e.id,
      title: e.name?.text ?? 'Event',
      start: e.start?.local ?? null,
      venue: e.venue?.name ?? location,
      address: e.venue?.address?.localized_address_display ?? null,
      url: e.url,
    }))
    return sendJson(res, 200, { ok: true, configured: true, partnerAccess: true, events })
  } catch {
    return sendJson(res, 502, { ok: false, configured: true, message: 'The events source is temporarily unavailable. Try again shortly.', events: [] })
  }
}
