/**
 * EventsList.jsx — Job fairs, recruitment events, and careers talks.
 *
 * PLUG IN: Replace `events` prop with Eventbrite API results (partner access required).
 * Endpoint shape: GET https://www.eventbriteapi.com/v3/events/search/
 *   ?q=job+fair&location.address={postcode}&location.within={miles}mi
 *   &token={EVENTBRITE_TOKEN}
 */
import { useState, useMemo, useId } from 'react'
import { haversine, DEFAULT_COORDS } from '../../utils/distance'
import { today, formatDate } from '../../utils/storage'

const RADII      = [5, 10, 20]
const ALL_TYPES  = ['Job Fair', 'Recruitment Event', 'Careers Talk']

const TYPE_COLOURS = {
  'Job Fair':           'edu-badge--jobfair',
  'Recruitment Event':  'edu-badge--recruit',
  'Careers Talk':       'edu-badge--talk',
}

export default function EventsList({ events, userCoords }) {
  const [radius,     setRadius]     = useState(10)
  const [typeFilter, setTypeFilter] = useState('')

  const radiusId = useId()
  const typeId   = useId()

  const withDistance = useMemo(() => {
    const uc = userCoords ?? DEFAULT_COORDS
    return events.map(e => ({
      ...e,
      distMiles: haversine(uc.lat, uc.lng, e.lat, e.lng),
    }))
  }, [events, userCoords])

  const results = useMemo(() => {
    return withDistance
      .filter(e => {
        const future     = e.date >= today()
        const inRadius   = e.distMiles <= radius
        const matchType  = !typeFilter || e.type === typeFilter
        return future && inRadius && matchType
      })
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [withDistance, radius, typeFilter])

  return (
    <div>
      <div className="edu-controls">
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

        <div className="edu-filter-group">
          <label htmlFor={typeId} className="edu-filter-label">Event type</label>
          <select
            id={typeId}
            className="edu-select"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="">All types</option>
            {ALL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {typeFilter && (
          <button
            type="button"
            className="edu-reset-btn"
            onClick={() => setTypeFilter('')}
          >
            Reset ✕
          </button>
        )}
      </div>

      <p className="edu-result-count" aria-live="polite" aria-atomic="true">
        <strong>{results.length}</strong> event{results.length !== 1 ? 's' : ''} within {radius} miles
      </p>

      {results.length === 0 ? (
        <div className="edu-empty" role="status">
          <span aria-hidden="true">🗓️</span>
          <p>No upcoming events within {radius} miles. Try widening the radius or changing the filter.</p>
        </div>
      ) : (
        <ul className="edu-cards" role="list" aria-label="Upcoming events">
          {results.map(evt => (
            <li key={evt.id} className="edu-card event-card">
              <div className="edu-card__header">
                <div>
                  <span className={`edu-badge ${TYPE_COLOURS[evt.type] ?? ''}`}>{evt.type}</span>
                  <h3 className="edu-card__title">{evt.name}</h3>
                  <p className="edu-card__location">📍 {evt.location} · <strong>{evt.distMiles} mi</strong> away</p>
                </div>
                <div className="event-card__date-block" aria-label={`Date: ${formatDate(evt.date)}`}>
                  <span className="event-card__day">
                    {new Date(evt.date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric' })}
                  </span>
                  <span className="event-card__month">
                    {new Date(evt.date + 'T00:00:00').toLocaleDateString('en-GB', { month: 'short' })}
                  </span>
                </div>
              </div>

              <dl className="edu-card__details">
                <div className="edu-detail">
                  <dt>⏰ Time</dt>
                  <dd>{evt.time}</dd>
                </div>
                <div className="edu-detail">
                  <dt>🏛 Venue</dt>
                  <dd>{evt.venue}</dd>
                </div>
              </dl>

              <p className="event-card__desc">{evt.description}</p>

              <div className="edu-card__footer">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(evt.venue + ' ' + evt.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="edu-cta edu-cta--outline"
                  aria-label={`Directions to ${evt.venue}`}
                >
                  Directions ↗
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
