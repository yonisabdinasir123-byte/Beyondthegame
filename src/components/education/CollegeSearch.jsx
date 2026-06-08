/**
 * CollegeSearch.jsx
 * Live search + radius filter for local colleges and open days.
 *
 * PLUG IN: Replace `colleges` prop with Google Places API results.
 * Postcode → lat/lng via postcodes.io (see src/utils/distance.js).
 * Reed API: radius maps to distanceFromLocation param.
 */
import { useState, useMemo, useCallback, useId } from 'react'
import { haversine, lookupPostcode, DEFAULT_COORDS } from '../../utils/distance'
import { storage, today, formatDate } from '../../utils/storage'

const RADII = [5, 10, 20]

function OpenDayBadge({ date }) {
  const d    = new Date(date + 'T00:00:00')
  const t    = new Date(today() + 'T00:00:00')
  const diff = Math.ceil((d - t) / 86400000)
  if (diff < 0)   return null
  if (diff === 0) return <span className="edu-badge edu-badge--today">Open day TODAY</span>
  if (diff <= 14) return <span className="edu-badge edu-badge--soon">Open day in {diff}d</span>
  return <span className="edu-badge edu-badge--upcoming">Open day {formatDate(date)}</span>
}

export default function CollegeSearch({ colleges, userCoords, onSaveOpenDay }) {
  const [query,  setQuery]  = useState('')
  const [radius, setRadius] = useState(10)

  const inputId  = useId()
  const radiusId = useId()

  const savedIds = storage.get('saved-opendays', []).map(s => s.openDayKey)

  const withDistance = useMemo(() => {
    const uc = userCoords ?? DEFAULT_COORDS
    return colleges.map(c => ({
      ...c,
      distMiles: haversine(uc.lat, uc.lng, c.lat, c.lng),
    }))
  }, [colleges, userCoords])

  const results = useMemo(() => {
    const q = query.toLowerCase().trim()
    return withDistance
      .filter(c => {
        const matchQ = !q ||
          c.name.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.courses.some(co => co.toLowerCase().includes(q))
        return matchQ && c.distMiles <= radius
      })
      .sort((a, b) => a.distMiles - b.distMiles)
  }, [withDistance, query, radius])

  const handleSave = useCallback((college, date) => {
    onSaveOpenDay({ collegeId: college.id, collegeName: college.name, openDayDate: date })
  }, [onSaveOpenDay])

  return (
    <div>
      <div className="edu-controls">
        <div className="edu-search-wrap">
          <label htmlFor={inputId} className="sr-only">Search colleges by name, area, or course</label>
          <span className="edu-search-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          <input
            id={inputId}
            type="search"
            className="edu-input edu-input--search"
            placeholder="Search by name, area, or course…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              className="edu-search-clear"
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >✕</button>
          )}
        </div>

        <div className="edu-radius-group">
          <label htmlFor={radiusId} className="edu-filter-label">Within</label>
          <div className="edu-radius-tabs" id={radiusId} role="group" aria-label="Radius filter">
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
        <strong>{results.length}</strong> college{results.length !== 1 ? 's' : ''} within {radius} miles
      </p>

      {results.length === 0 ? (
        <div className="edu-empty" role="status">
          <span aria-hidden="true">🏫</span>
          <p>No colleges match your search within {radius} miles. Try widening the radius or changing your search.</p>
        </div>
      ) : (
        <ul className="edu-cards" role="list" aria-label="Colleges">
          {results.map(college => {
            const upcomingDays = college.openDays
              .filter(d => d >= today())
              .sort()
            return (
              <li key={college.id} className="edu-card college-card">
                <div className="edu-card__header">
                  <div>
                    {upcomingDays[0] && <OpenDayBadge date={upcomingDays[0]} />}
                    <h3 className="edu-card__title">{college.name}</h3>
                    <p className="edu-card__location">📍 {college.location} · <strong>{college.distMiles} mi</strong> away</p>
                  </div>
                </div>

                <dl className="edu-card__details">
                  <div className="edu-detail">
                    <dt>⏰ Hours</dt>
                    <dd>{college.openingHours}</dd>
                  </div>
                  {upcomingDays.length > 0 && (
                    <div className="edu-detail">
                      <dt>📅 Open days</dt>
                      <dd>{upcomingDays.map(formatDate).join(', ')}</dd>
                    </div>
                  )}
                </dl>

                <div className="edu-card__courses" aria-label="Courses offered">
                  {college.courses.map(c => (
                    <span key={c} className="edu-course-tag">{c}</span>
                  ))}
                </div>

                <div className="edu-card__footer">
                  <a
                    href={college.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="edu-cta edu-cta--outline"
                    aria-label={`Visit ${college.name} website`}
                  >
                    Visit website ↗
                  </a>
                  {upcomingDays[0] && (
                    <button
                      type="button"
                      className={`edu-cta edu-cta--primary${savedIds.includes(college.id + '_' + upcomingDays[0]) ? ' edu-cta--saved' : ''}`}
                      onClick={() => handleSave(college, upcomingDays[0])}
                      aria-label={`Save open day at ${college.name} on ${formatDate(upcomingDays[0])}`}
                    >
                      {savedIds.includes(college.id + '_' + upcomingDays[0])
                        ? '✓ Saved'
                        : '+ Save open day'}
                    </button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
