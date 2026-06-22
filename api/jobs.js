/**
 * api/jobs.js — Live jobs near you (task H).
 *
 * Primary source : Reed.co.uk API   (REED_API_KEY)
 * Fallback source: Adzuna API       (ADZUNA_APP_ID + ADZUNA_APP_KEY)
 *
 * Reed uses HTTP Basic auth with the API key as the username and an empty
 * password. Its `distanceFromLocation` param is the radius in MILES, which maps
 * directly onto our shared distance filter.
 *
 * Query: ?keywords=coaching&location=Manchester&distance=20
 * Returns: { ok, configured, source, jobs: [{ id, title, employer, location,
 *            salary, url, posted, distanceMiles }] }
 */
import { sendJson, sendNeedsKey, getQuery } from './_lib.js'

export default async function handler(req, res) {
  const { keywords = '', location = '', distance = '20' } = getQuery(req)
  const reedKey = process.env.REED_API_KEY
  const adzunaId = process.env.ADZUNA_APP_ID
  const adzunaKey = process.env.ADZUNA_APP_KEY

  // ── Primary: Reed ──────────────────────────────────────────────────────────
  if (reedKey) {
    try {
      const params = new URLSearchParams({
        keywords,
        locationName: location,
        distanceFromLocation: String(distance),
        resultsToTake: '25',
      })
      const auth = Buffer.from(`${reedKey}:`).toString('base64')
      const r = await fetch(`https://www.reed.co.uk/api/1.0/search?${params}`, {
        headers: { Authorization: `Basic ${auth}` },
      })
      if (!r.ok) throw new Error(`Reed responded ${r.status}`)
      const data = await r.json()
      const jobs = (data.results || []).map((j) => ({
        id: `reed-${j.jobId}`,
        title: j.jobTitle,
        employer: j.employerName,
        location: j.locationName,
        salary: j.minimumSalary && j.maximumSalary
          ? `£${Math.round(j.minimumSalary).toLocaleString('en-GB')} to £${Math.round(j.maximumSalary).toLocaleString('en-GB')}`
          : null,
        url: j.jobUrl,
        posted: j.date,
        distanceMiles: null,
      }))
      return sendJson(res, 200, { ok: true, configured: true, source: 'reed', jobs })
    } catch (err) {
      // fall through to Adzuna if available
      if (!adzunaId || !adzunaKey) {
        return sendJson(res, 502, { ok: false, configured: true, source: 'reed', message: 'Reed is temporarily unavailable. Try again shortly.', jobs: [] })
      }
    }
  }

  // ── Fallback: Adzuna ───────────────────────────────────────────────────────
  if (adzunaId && adzunaKey) {
    try {
      const params = new URLSearchParams({
        app_id: adzunaId,
        app_key: adzunaKey,
        what: keywords,
        where: location,
        distance: String(distance),
        results_per_page: '25',
      })
      const r = await fetch(`https://api.adzuna.com/v1/api/jobs/gb/search/1?${params}`)
      if (!r.ok) throw new Error(`Adzuna responded ${r.status}`)
      const data = await r.json()
      const jobs = (data.results || []).map((j) => ({
        id: `adzuna-${j.id}`,
        title: j.title,
        employer: j.company?.display_name ?? 'Employer not listed',
        location: j.location?.display_name ?? location,
        salary: j.salary_min && j.salary_max
          ? `£${Math.round(j.salary_min).toLocaleString('en-GB')} to £${Math.round(j.salary_max).toLocaleString('en-GB')}`
          : null,
        url: j.redirect_url,
        posted: j.created,
        distanceMiles: null,
      }))
      return sendJson(res, 200, { ok: true, configured: true, source: 'adzuna', jobs })
    } catch {
      return sendJson(res, 502, { ok: false, configured: true, source: 'adzuna', message: 'The jobs source is temporarily unavailable. Try again shortly.', jobs: [] })
    }
  }

  // ── No keys configured → honest unavailable state ──────────────────────────
  return sendNeedsKey(res, 'jobs near you', 'REED_API_KEY (or ADZUNA_APP_ID + ADZUNA_APP_KEY)')
}
