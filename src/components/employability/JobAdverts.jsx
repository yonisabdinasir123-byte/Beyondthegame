/**
 * JobAdverts.jsx — Browse active job adverts with field + distance filters.
 *
 * PLUG IN: Replace `adverts` prop with Reed.co.uk API results.
 * Reed endpoint: GET https://www.reed.co.uk/api/1.0/search
 *   ?keywords={selectedField}&locationName={userPostcode}&distanceFromLocation={radiusMiles}
 * The `radiusMiles` state maps directly to Reed's distanceFromLocation parameter.
 * Secondary: Adzuna API → https://api.adzuna.com/v1/api/jobs/gb/search/1
 */
import { useState, useMemo, useId } from 'react'
import { haversine, DEFAULT_COORDS } from '../../utils/distance'
import { JOB_FIELDS } from '../../data/educationData'

const RADII = [5, 10, 20]

const FIELD_COLOURS = {
  'Coaching & Sport':       'edu-badge--sport',
  'Construction & Trades':  'edu-badge--construction',
  'Security':               'edu-badge--security',
  'Retail':                 'edu-badge--retail',
  'Logistics & Warehouse':  'edu-badge--logistics',
  'Health & Social Care':   'edu-badge--health',
}

export default function JobAdverts({ adverts, userCoords }) {
  const [radius,      setRadius]      = useState(10)
  const [fieldFilter, setFieldFilter] = useState('')

  const radiusId = useId()
  const fieldId  = useId()

  const withDistance = useMemo(() => {
    const uc = userCoords ?? DEFAULT_COORDS
    return adverts.map(a => ({
      ...a,
      distMiles: haversine(uc.lat, uc.lng, a.lat, a.lng),
    }))
  }, [adverts, userCoords])

  const results = useMemo(() => {
    return withDistance
      .filter(a => {
        const inRadius   = a.distMiles <= radius
        const matchField = !fieldFilter || a.field === fieldFilter
        return inRadius && matchField
      })
      .sort((a, b) => a.distMiles - b.distMiles)
  }, [withDistance, radius, fieldFilter])

  return (
    <div>
      {/* Filters */}
      <div className="edu-controls">
        <div className="edu-radius-group">
          <label htmlFor={radiusId} className="edu-filter-label">Within</label>
          <div className="edu-radius-tabs" id={radiusId} role="group" aria-label="Distance filter">
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

        <div className="edu-filter-group">
          <label htmlFor={fieldId} className="edu-filter-label">Field of interest</label>
          <select
            id={fieldId}
            className="edu-select"
            value={fieldFilter}
            onChange={e => setFieldFilter(e.target.value)}
          >
            <option value="">All fields</option>
            {JOB_FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        {fieldFilter && (
          <button
            type="button"
            className="edu-reset-btn"
            onClick={() => setFieldFilter('')}
          >
            Reset ✕
          </button>
        )}
      </div>

      <p className="edu-result-count" aria-live="polite" aria-atomic="true">
        <strong>{results.length}</strong> job{results.length !== 1 ? 's' : ''}
        {fieldFilter ? ` in ${fieldFilter}` : ''} within {radius} miles
      </p>

      {results.length === 0 ? (
        <div className="edu-empty" role="status">
          <span aria-hidden="true">💼</span>
          <p>No jobs found for those filters. Try a different field or wider radius.</p>
        </div>
      ) : (
        <ul className="edu-cards" role="list" aria-label="Job adverts">
          {results.map(job => (
            <li key={job.id} className="edu-card job-card">
              <div className="edu-card__header">
                <div style={{ flex: 1 }}>
                  <span className={`edu-badge ${FIELD_COLOURS[job.field] ?? ''}`}>{job.field}</span>
                  <h3 className="edu-card__title">{job.title}</h3>
                  <p className="edu-card__employer">🏢 {job.employer}</p>
                  <p className="edu-card__location">📍 {job.location} · <strong>{job.distMiles} mi</strong> away</p>
                </div>
                <div className="job-card__pay" aria-label={`Pay: ${job.pay}`}>
                  {job.pay}
                </div>
              </div>

              <p className="job-card__summary">{job.summary}</p>

              <div className="edu-card__footer">
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="edu-cta edu-cta--primary"
                  aria-label={`Apply for ${job.title} at ${job.employer}`}
                >
                  Apply / More info ↗
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
