import { useState, useMemo, useId } from 'react'

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
  </svg>
)

const PinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
)

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
  </svg>
)

/**
 * @param {{
 *   locations: import('../../data/recoveryData').MedicalLocation[],
 *   onSaveAppointment: (loc: object) => void,
 * }} props
 */
export default function MedicalSearch({ locations, onSaveAppointment }) {
  const [query, setQuery]       = useState('')
  const [typeFilter, setTypeFilter] = useState('')  // '' | 'Walk-in Centre' | 'GP Surgery'

  const inputId  = useId()
  const filterId = useId()

  const results = useMemo(() => {
    const q = query.toLowerCase().trim()
    return locations.filter(loc => {
      const matchQ = !q ||
        loc.name.toLowerCase().includes(q) ||
        loc.address.toLowerCase().includes(q) ||
        loc.postcode.toLowerCase().includes(q)
      const matchType = !typeFilter || loc.type === typeFilter
      return matchQ && matchType
    })
  }, [locations, query, typeFilter])

  return (
    <div>
      {/* Search + filter row */}
      <div className="rec-search-row">
        <div className="rec-search-wrap">
          <label htmlFor={inputId} className="sr-only">Search by name, area, or postcode</label>
          <span className="rec-search-icon"><SearchIcon /></span>
          <input
            id={inputId}
            type="search"
            className="rec-input rec-input--search"
            placeholder="Search by name, area, or postcode…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="rec-filter-group">
          <label htmlFor={filterId} className="sr-only">Filter by type</label>
          <select
            id={filterId}
            className="rec-select"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="">All types</option>
            <option value="Walk-in Centre">Walk-in Centre</option>
            <option value="GP Surgery">GP Surgery</option>
          </select>
        </div>
      </div>

      {/* Result count */}
      <p className="rec-result-count" aria-live="polite" aria-atomic="true">
        <strong>{results.length}</strong> location{results.length !== 1 ? 's' : ''} found
      </p>

      {/* Results */}
      {results.length === 0 ? (
        <div className="rec-empty" role="status">
          <span aria-hidden="true">🔍</span>
          <p>No locations match your search. Try a different name or postcode.</p>
        </div>
      ) : (
        <ul className="rec-cards-grid" role="list" aria-label="Medical locations">
          {results.map(loc => (
            <li key={loc.id} className="rec-card med-card" role="listitem">
              <div className="rec-card__header">
                <div>
                  <span className={`rec-badge ${loc.type === 'Walk-in Centre' ? 'rec-badge--walkin' : 'rec-badge--gp'}`}>
                    {loc.type}
                  </span>
                  <h3 className="rec-card__title">{loc.name}</h3>
                </div>
                <span className="med-card__distance">{loc.distanceMiles} mi</span>
              </div>

              <dl className="med-card__details">
                <div className="med-card__detail">
                  <dt><PinIcon /> Address</dt>
                  <dd>{loc.address}</dd>
                </div>
                <div className="med-card__detail">
                  <dt>⏰ Hours</dt>
                  <dd>{loc.openingHours}</dd>
                </div>
                <div className="med-card__detail">
                  <dt><PhoneIcon /> Phone</dt>
                  <dd><a href={`tel:${loc.phone}`} className="rec-link">{loc.phone}</a></dd>
                </div>
              </dl>

              <div className="rec-card__footer">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(loc.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rec-cta rec-cta--outline"
                  aria-label={`Directions to ${loc.name}`}
                >
                  Directions <ArrowIcon />
                </a>
                <button
                  type="button"
                  className="rec-cta rec-cta--primary"
                  onClick={() => onSaveAppointment(loc)}
                  aria-label={`Save appointment at ${loc.name}`}
                >
                  + Save appointment
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
