/**
 * EventsList.jsx: Job fairs and careers events, live from the server.
 *
 * Data source: the server route GET /api/events (Eventbrite, server-side).
 * The distance filter (miles) maps straight to the route's `distance` param.
 *
 * Honest states only, never fake events:
 *   - needs a key to go live (503 / configured:false)
 *   - partner access not granted (configured:true but partnerAccess:false)
 *   - temporarily unavailable (network / 5xx)
 *   - genuinely empty
 */
import { useState, useEffect, useId } from 'react'
import SkeletonList from '../SkeletonList'
import GlassCard from '../GlassCard'

const RADII = [5, 10, 20]

/** Town name to search by. Falls back to a sensible default area. */
function townFromCoords(town) {
  return town && town.trim() ? town.trim() : 'Manchester'
}

/** Format an Eventbrite local start string for display. */
function formatStart(start) {
  if (!start) return null
  const d = new Date(start)
  if (Number.isNaN(d.getTime())) return start
  return d.toLocaleString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function EventsList({ town }) {
  const [distance, setDistance] = useState(20)
  const [status, setStatus] = useState('idle') // idle|loading|ok|empty|needsKey|noPartner|error
  const [message, setMessage] = useState('')
  const [events, setEvents] = useState([])

  const distanceId = useId()
  const location = townFromCoords(town)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setStatus('loading')
      setMessage('')
      try {
        const params = new URLSearchParams({
          location,
          distance: String(distance),
          q: 'job fair',
        })
        const res = await fetch(`/api/events?${params}`)
        let body = {}
        try { body = await res.json() } catch { /* non-JSON */ }

        if (cancelled) return

        if (res.status === 503 || body.configured === false) {
          setEvents([])
          setMessage(body.message || 'Live job fairs and events needs a key to go live.')
          setStatus('needsKey')
          return
        }
        if (body.ok && body.partnerAccess === false) {
          setEvents([])
          setMessage(body.message || 'Events search needs Eventbrite partner access for this token. No live events show until that is granted.')
          setStatus('noPartner')
          return
        }
        if (!res.ok || body.ok === false) {
          setEvents([])
          setMessage(body.message || 'The events source is temporarily unavailable. Try again shortly.')
          setStatus('error')
          return
        }

        const list = Array.isArray(body.events) ? body.events : []
        setEvents(list)
        setStatus(list.length === 0 ? 'empty' : 'ok')
      } catch {
        if (cancelled) return
        setEvents([])
        setMessage('The events source is temporarily unavailable. Try again shortly.')
        setStatus('error')
      }
    }
    load()
    return () => { cancelled = true }
  }, [location, distance])

  return (
    <div>
      <div className="edu-controls">
        <div className="edu-radius-group">
          <span className="edu-filter-label" id={distanceId}>Within</span>
          <div className="edu-radius-tabs" role="group" aria-labelledby={distanceId}>
            {RADII.map(r => (
              <button
                key={r}
                type="button"
                className={`edu-radius-tab${distance === r ? ' edu-radius-tab--active' : ''}`}
                onClick={() => setDistance(r)}
                aria-pressed={distance === r}
              >
                {r} mi
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="edu-result-count" aria-live="polite" aria-atomic="true">
        {status === 'ok' && (
          <><strong>{events.length}</strong> event{events.length !== 1 ? 's' : ''} within {distance} miles of {location}</>
        )}
        {status === 'loading' && (
          <span className="t-shimmer" data-text="Looking for events near you">Looking for events near you</span>
        )}
      </p>

      {status === 'loading' && (
        <SkeletonList rows={3} label={`Looking for events within ${distance} miles`} />
      )}

      {status === 'needsKey' && (
        <GlassCard glow="coral" className="edu-state-card" role="status">
          <h3 className="edu-state-card__title">This needs a key to go live</h3>
          <p className="edu-state-card__text">{message}</p>
          <p className="edu-state-card__note">
            Once an Eventbrite token is set on the server, real job fairs and careers events appear here.
          </p>
        </GlassCard>
      )}

      {status === 'noPartner' && (
        <GlassCard glow="coral" className="edu-state-card" role="status">
          <h3 className="edu-state-card__title">Events search needs partner access</h3>
          <p className="edu-state-card__text">{message}</p>
          <p className="edu-state-card__note">
            This is not anything you have done. Eventbrite limits its event search to apps with partner access, so live results stay off until that access is granted.
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
            onClick={() => setDistance(d => d)}
          >
            Try again
          </button>
        </GlassCard>
      )}

      {status === 'empty' && (
        <GlassCard className="edu-state-card" role="status">
          <span className="edu-state-card__emoji" aria-hidden="true">🗓️</span>
          <p className="edu-state-card__text">
            No events found within {distance} miles of {location} right now. Try widening the distance or check back soon.
          </p>
        </GlassCard>
      )}

      {status === 'ok' && (
        <ul className="edu-cards" role="list" aria-label="Upcoming events">
          {events.map(evt => {
            const when = formatStart(evt.start)
            return (
              <GlassCard as="li" key={evt.id} glow="lime" className="event-card">
                <div className="event-card__head">
                  <span className="edu-badge edu-badge--jobfair">Job fair</span>
                  <h3 className="college-card__title">{evt.title}</h3>
                  {(evt.venue || evt.address) && (
                    <p className="college-card__location">
                      📍 {[evt.venue, evt.address].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>

                {when && (
                  <p className="event-card__when"><strong>When:</strong> {when}</p>
                )}

                {evt.url && (
                  <div className="college-card__footer">
                    <a
                      href={evt.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="edu-cta edu-cta--primary"
                      aria-label={`View ${evt.title} on Eventbrite`}
                    >
                      View event ↗
                    </a>
                  </div>
                )}
              </GlassCard>
            )
          })}
        </ul>
      )}
    </div>
  )
}
