/**
 * CollegeSearch.jsx
 * Live local colleges and opening hours, with a distance filter.
 *
 * Data source: the server route GET /api/colleges (Google Places, server-side).
 * Postcode to lat/lng is resolved via postcodes.io (see src/utils/distance.js).
 * The radius (miles) maps straight to the route's `radius` query param.
 *
 * Open-day DATES are not available from Google Places, so each college shows an
 * editable open-day field (saved to localStorage) with a clear note that those
 * dates need a per-college source.
 */
import { useState, useEffect, useCallback, useId } from 'react'
import { DEFAULT_COORDS } from '../../utils/distance'
import { storage } from '../../utils/storage'
import GlassCard from '../GlassCard'

const RADII = [5, 10, 20]

/**
 * Turn a Places weekday_text array into a compact, readable line.
 * Returns null when no hours are present.
 */
function summariseHours(hours) {
  if (!hours || hours.length === 0) return null
  return hours
}

export default function CollegeSearch({ userCoords, onSaveOpenDay }) {
  const [radius, setRadius] = useState(10)
  const [status, setStatus] = useState('idle') // idle|loading|ok|empty|needsKey|error
  const [message, setMessage] = useState('')
  const [colleges, setColleges] = useState([])
  // User-typed open-day dates, keyed by college id, persisted locally.
  const [openDays, setOpenDays] = useState(() => storage.get('college-opendays', {}))

  const radiusId = useId()

  const coords = userCoords ?? DEFAULT_COORDS

  // Fetch live colleges whenever the location or radius changes.
  useEffect(() => {
    let cancelled = false
    async function load() {
      setStatus('loading')
      setMessage('')
      try {
        const params = new URLSearchParams({
          lat: String(coords.lat),
          lng: String(coords.lng),
          radius: String(radius),
          query: 'college',
        })
        const res = await fetch(`/api/colleges?${params}`)
        let body = {}
        try { body = await res.json() } catch { /* non-JSON */ }

        if (cancelled) return

        if (res.status === 503 || body.configured === false) {
          setColleges([])
          setMessage(body.message || 'Live local colleges needs a key to go live.')
          setStatus('needsKey')
          return
        }
        if (!res.ok || body.ok === false) {
          setColleges([])
          setMessage(body.message || 'The colleges source is temporarily unavailable. Try again shortly.')
          setStatus('error')
          return
        }

        const list = Array.isArray(body.colleges) ? body.colleges : []
        setColleges(list)
        setStatus(list.length === 0 ? 'empty' : 'ok')
      } catch {
        if (cancelled) return
        setColleges([])
        setMessage('The colleges source is temporarily unavailable. Try again shortly.')
        setStatus('error')
      }
    }
    load()
    return () => { cancelled = true }
  }, [coords.lat, coords.lng, radius])

  const handleOpenDayChange = useCallback((id, value) => {
    setOpenDays(prev => {
      const next = { ...prev, [id]: value }
      storage.set('college-opendays', next)
      return next
    })
  }, [])

  const handleSaveOpenDay = useCallback((college) => {
    const date = (openDays[college.id] || '').trim()
    if (!date) return
    onSaveOpenDay({ collegeId: college.id, collegeName: college.name, openDayDate: date })
  }, [openDays, onSaveOpenDay])

  return (
    <div>
      <div className="edu-controls">
        <div className="edu-radius-group">
          <span className="edu-filter-label" id={radiusId}>Within</span>
          <div className="edu-radius-tabs" role="group" aria-labelledby={radiusId}>
            {RADII.map(r => (
              <button
                key={r}
                type="button"
                className={`edu-radius-tab${radius === r ? ' edu-radius-tab--active' : ''}`}
                onClick={() => setRadius(r)}
                aria-pressed={radius === r}
              >
                {r} mi
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="edu-result-count" aria-live="polite" aria-atomic="true">
        {status === 'ok' && (
          <><strong>{colleges.length}</strong> college{colleges.length !== 1 ? 's' : ''} within {radius} miles</>
        )}
        {status === 'loading' && 'Finding colleges near you…'}
      </p>

      {status === 'loading' && (
        <GlassCard className="edu-state-card" role="status" aria-live="polite">
          <p className="edu-state-card__text">Finding colleges within {radius} miles…</p>
        </GlassCard>
      )}

      {status === 'needsKey' && (
        <GlassCard glow="coral" className="edu-state-card" role="status">
          <h3 className="edu-state-card__title">This needs a key to go live</h3>
          <p className="edu-state-card__text">{message}</p>
          <p className="edu-state-card__note">
            Once a Google Places key is set on the server, real colleges near your postcode appear here automatically.
          </p>
        </GlassCard>
      )}

      {status === 'error' && (
        <GlassCard className="edu-state-card" role="alert">
          <h3 className="edu-state-card__title">Temporarily unavailable</h3>
          <p className="edu-state-card__text">{message}</p>
          <button
            type="button"
            className="edu-cta edu-cta--primary"
            onClick={() => setRadius(r => r)}
          >
            Try again
          </button>
        </GlassCard>
      )}

      {status === 'empty' && (
        <GlassCard className="edu-state-card" role="status">
          <span className="edu-state-card__emoji" aria-hidden="true">🏫</span>
          <p className="edu-state-card__text">
            No colleges found within {radius} miles. Try widening the distance.
          </p>
        </GlassCard>
      )}

      {status === 'ok' && (
        <ul className="edu-cards" role="list" aria-label="Colleges near you">
          {colleges.map(college => {
            const hours = summariseHours(college.hours)
            const openDayValue = openDays[college.id] || ''
            return (
              <GlassCard
                as="li"
                key={college.id}
                glow="teal"
                className="college-card"
              >
                <div className="college-card__head">
                  {college.openNow != null && (
                    <span className={`edu-badge ${college.openNow ? 'edu-badge--open' : 'edu-badge--closed'}`}>
                      {college.openNow ? 'Open now' : 'Closed now'}
                    </span>
                  )}
                  <h3 className="college-card__title">{college.name}</h3>
                  <p className="college-card__location">
                    📍 {college.address}
                    {college.distanceMiles != null && (
                      <> · <strong>{college.distanceMiles} mi</strong> away</>
                    )}
                  </p>
                  {college.rating != null && (
                    <p className="college-card__rating">★ {college.rating} on Google</p>
                  )}
                </div>

                {hours && (
                  <div className="college-card__hours">
                    <h4 className="college-card__subhead">⏰ Opening hours</h4>
                    <ul className="college-card__hours-list" role="list">
                      {hours.map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="college-card__openday">
                  <label htmlFor={`openday-${college.id}`} className="college-card__subhead">
                    📅 Open day date
                  </label>
                  <p className="college-card__openday-note">
                    Open-day dates are not provided by the colleges feed, so add the date once you find it on the college site.
                  </p>
                  <div className="college-card__openday-row">
                    <input
                      id={`openday-${college.id}`}
                      type="text"
                      className="edu-input college-card__openday-input"
                      placeholder="e.g. Sat 12 Oct, 10am"
                      value={openDayValue}
                      onChange={e => handleOpenDayChange(college.id, e.target.value)}
                    />
                    <button
                      type="button"
                      className="edu-cta edu-cta--primary"
                      onClick={() => handleSaveOpenDay(college)}
                      disabled={!openDayValue.trim()}
                    >
                      Save open day
                    </button>
                  </div>
                </div>

                <div className="college-card__footer">
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(college.name + ' ' + college.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="edu-cta edu-cta--outline"
                    aria-label={`Find ${college.name} on the map`}
                  >
                    View on map ↗
                  </a>
                </div>
              </GlassCard>
            )
          })}
        </ul>
      )}
    </div>
  )
}
