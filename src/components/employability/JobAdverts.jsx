/**
 * JobAdverts.jsx, Live jobs near you.
 *
 * Fetches real vacancies from the server route:
 *   GET /api/jobs?keywords={kw}&location={town}&distance={miles}
 * The server proxies Reed (or Adzuna) and keeps any key off the browser.
 *
 * Response on success:
 *   { ok:true, configured:true, source, jobs:[{ id, title, employer,
 *     location, salary, url, posted, distanceMiles }] }
 *
 * Honest states only, never invented data:
 *   - configured:false / 503  → needs a key to go live
 *   - 5xx / network error      → temporarily unavailable
 *   - valid search, no jobs    → empty state
 *   - while fetching           → loading state
 */
import { useState, useId } from 'react'
import SkeletonList from '../SkeletonList'
import GlassCard from '../GlassCard'

const DISTANCES = [5, 10, 20, 30]

// status: 'idle' | 'loading' | 'ready' | 'empty' | 'needsKey' | 'error'

function formatPosted(posted) {
  if (!posted) return null
  // Reed gives DD/MM/YYYY, Adzuna gives an ISO date. Try both.
  let d
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(posted)) {
    const [day, month, year] = posted.split('/')
    d = new Date(`${year}-${month}-${day}`)
  } else {
    d = new Date(posted)
  }
  if (isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function JobAdverts() {
  const [keywords, setKeywords] = useState('coaching')
  const [location, setLocation] = useState('')
  const [distance, setDistance] = useState(20)

  const [status, setStatus] = useState('idle')
  const [jobs, setJobs]     = useState([])
  const [message, setMessage] = useState('')

  const kwId   = useId()
  const locId  = useId()
  const distId = useId()

  const search = async (e) => {
    e?.preventDefault()
    setStatus('loading')
    setMessage('')
    try {
      const params = new URLSearchParams({
        keywords: keywords.trim(),
        location: location.trim(),
        distance: String(distance),
      })
      const res = await fetch(`/api/jobs?${params}`)

      // Read the JSON body where present so we can surface the server message.
      let data = null
      try { data = await res.json() } catch { /* non-JSON response */ }

      if (res.status === 503 || data?.configured === false) {
        setMessage(data?.message || 'Live jobs need a key to go live.')
        setStatus('needsKey')
        return
      }
      if (!res.ok || !data?.ok) {
        setMessage(data?.message || 'Jobs are temporarily unavailable. Please try again shortly.')
        setStatus('error')
        return
      }

      const list = Array.isArray(data.jobs) ? data.jobs : []
      setJobs(list)
      setStatus(list.length ? 'ready' : 'empty')
    } catch {
      setMessage('We could not reach the jobs service. Please check your connection and try again.')
      setStatus('error')
    }
  }

  return (
    <div className="jobs-live">
      {/* Controls */}
      <form className="jobs-controls glass glass--quiet glass--pad" onSubmit={search} aria-label="Search jobs near you">
        <div className="jobs-control">
          <label htmlFor={kwId} className="jobs-control__label">What kind of work</label>
          <input
            id={kwId}
            type="text"
            className="jobs-control__input"
            value={keywords}
            onChange={e => setKeywords(e.target.value)}
            placeholder="e.g. coaching, security, warehouse"
            autoComplete="off"
          />
        </div>

        <div className="jobs-control">
          <label htmlFor={locId} className="jobs-control__label">Town or postcode</label>
          <input
            id={locId}
            type="text"
            className="jobs-control__input"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="e.g. Manchester or M1 1AA"
            autoComplete="off"
          />
        </div>

        <div className="jobs-control">
          <label htmlFor={distId} className="jobs-control__label">Distance</label>
          <select
            id={distId}
            className="jobs-control__select"
            value={distance}
            onChange={e => setDistance(Number(e.target.value))}
          >
            {DISTANCES.map(d => (
              <option key={d} value={d}>Within {d} miles</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="jobs-control__submit"
          disabled={status === 'loading'}
          aria-busy={status === 'loading'}
        >
          {status === 'loading' ? 'Searching' : 'Search jobs'}
        </button>
      </form>

      {/* States */}
      {status === 'idle' && (
        <p className="jobs-state jobs-state--hint" role="status">
          Enter a town or postcode and search to see live vacancies near you.
        </p>
      )}

      {status === 'loading' && (
        <>
          <p className="jobs-loading-label">
            <span className="t-shimmer" data-text="Finding jobs near you">Finding jobs near you</span>
          </p>
          <SkeletonList rows={4} label="Finding jobs near you" />
        </>
      )}

      {status === 'needsKey' && (
        <GlassCard tone="light" glow="coral" className="jobs-state jobs-state--panel" role="note">
          <h3 className="jobs-state__title">Not live yet</h3>
          <p>{message}</p>
          <p className="jobs-state__sub">
            Once a jobs key is set up on the server, this section will show real vacancies near you.
          </p>
        </GlassCard>
      )}

      {status === 'error' && (
        <GlassCard tone="light" className="jobs-state jobs-state--panel" role="alert">
          <h3 className="jobs-state__title">Temporarily unavailable</h3>
          <p>{message}</p>
          <button type="button" className="jobs-control__submit jobs-state__retry" onClick={search}>
            Try again
          </button>
        </GlassCard>
      )}

      {status === 'empty' && (
        <div className="jobs-state" role="status" aria-live="polite">
          <span aria-hidden="true" className="jobs-state__emoji">💼</span>
          <p>No jobs matched that search. Try a different keyword, a wider distance, or another nearby town.</p>
        </div>
      )}

      {status === 'ready' && (
        <>
          <p className="jobs-count" aria-live="polite" aria-atomic="true">
            <strong>{jobs.length}</strong> {jobs.length === 1 ? 'job' : 'jobs'} near {location.trim() || 'you'}
          </p>
          <ul className="jobs-cards" role="list" aria-label="Live job vacancies">
            {jobs.map(job => {
              const posted = formatPosted(job.posted)
              return (
                <GlassCard as="li" tone="light" interactive className="job-card" key={job.id}>
                  <div className="job-card__body">
                    <h3 className="job-card__title">{job.title}</h3>
                    {job.employer && <p className="job-card__employer">🏢 {job.employer}</p>}
                    <ul className="job-card__meta" aria-label="Job details">
                      {job.location && (
                        <li className="job-card__meta-item">📍 {job.location}
                          {job.distanceMiles != null && <> · {job.distanceMiles} mi away</>}
                        </li>
                      )}
                      {job.salary && <li className="job-card__meta-item">💷 {job.salary}</li>}
                      {posted && <li className="job-card__meta-item">🗓 Posted {posted}</li>}
                    </ul>
                  </div>
                  <div className="job-card__footer">
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener"
                      className="job-card__apply"
                      aria-label={`View ${job.title}${job.employer ? ` at ${job.employer}` : ''}, opens in new tab`}
                    >
                      View and apply ↗
                    </a>
                  </div>
                </GlassCard>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}
