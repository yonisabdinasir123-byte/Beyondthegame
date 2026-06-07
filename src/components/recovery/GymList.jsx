import { useState, useMemo, useId } from 'react'

// ── Value band computed from monthlyPrice ──────────────────────────────────────
export function getValueBand(price) {
  if (price < 20) return { label: 'Amazing value', cls: 'rec-badge--value-great' }
  if (price <= 30) return { label: 'Fair value',   cls: 'rec-badge--value-fair' }
  return              { label: 'Pricey',            cls: 'rec-badge--value-pricey' }
}

const ALL_FEATURES = ['Weights', 'Cardio', 'Classes', 'Pool', 'Spa', 'Sauna',
  'Steam Room', 'Boxing Ring', 'Yoga', 'Pilates', 'Meditation',
  'Climbing Walls', 'Personal Training']

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
  </svg>
)

const PinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
)

/**
 * @param {{
 *   gyms: import('../../data/recoveryData').Gym[],
 *   onSaveSession: (gym: object) => void,
 * }} props
 */
export default function GymList({ gyms, onSaveSession }) {
  const [bandFilter, setBandFilter]     = useState('')
  const [featureFilter, setFeatureFilter] = useState('')
  const [sortBy, setSortBy]             = useState('distance') // 'distance' | 'price-asc' | 'price-desc'

  const bandId    = useId()
  const featureId = useId()
  const sortId    = useId()

  const results = useMemo(() => {
    let list = gyms.filter(g => {
      const band = getValueBand(g.monthlyPrice)
      const matchBand    = !bandFilter    || band.label === bandFilter
      const matchFeature = !featureFilter || g.features.includes(featureFilter)
      return matchBand && matchFeature
    })
    if (sortBy === 'price-asc')  list = [...list].sort((a, b) => a.monthlyPrice - b.monthlyPrice)
    if (sortBy === 'price-desc') list = [...list].sort((a, b) => b.monthlyPrice - a.monthlyPrice)
    if (sortBy === 'distance')   list = [...list].sort((a, b) => a.distanceMiles - b.distanceMiles)
    return list
  }, [gyms, bandFilter, featureFilter, sortBy])

  return (
    <div>
      {/* Filters */}
      <div className="rec-filter-bar">
        <div className="rec-filter-group">
          <label htmlFor={bandId} className="rec-filter-label">Value band</label>
          <select id={bandId} className="rec-select" value={bandFilter} onChange={e => setBandFilter(e.target.value)}>
            <option value="">All</option>
            <option value="Amazing value">Amazing value (&lt;£20)</option>
            <option value="Fair value">Fair (£20–£30)</option>
            <option value="Pricey">Pricey (&gt;£30)</option>
          </select>
        </div>
        <div className="rec-filter-group">
          <label htmlFor={featureId} className="rec-filter-label">Has feature</label>
          <select id={featureId} className="rec-select" value={featureFilter} onChange={e => setFeatureFilter(e.target.value)}>
            <option value="">Any features</option>
            {ALL_FEATURES.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div className="rec-filter-group">
          <label htmlFor={sortId} className="rec-filter-label">Sort by</label>
          <select id={sortId} className="rec-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="distance">Nearest first</option>
            <option value="price-asc">Cheapest first</option>
            <option value="price-desc">Most expensive first</option>
          </select>
        </div>
        {(bandFilter || featureFilter) && (
          <button type="button" className="rec-reset-btn"
            onClick={() => { setBandFilter(''); setFeatureFilter('') }}>
            Reset ✕
          </button>
        )}
      </div>

      <p className="rec-result-count" aria-live="polite" aria-atomic="true">
        <strong>{results.length}</strong> gym{results.length !== 1 ? 's' : ''} found
      </p>

      {results.length === 0 ? (
        <div className="rec-empty" role="status">
          <span aria-hidden="true">🏋️</span>
          <p>No gyms match. Try removing a filter.</p>
        </div>
      ) : (
        <ul className="rec-cards-grid" role="list" aria-label="Local gyms">
          {results.map(gym => {
            const band = getValueBand(gym.monthlyPrice)
            return (
              <li key={gym.id} className="rec-card gym-card" role="listitem">
                <div className="rec-card__header">
                  <div>
                    <div className="gym-card__badges">
                      <span className={`rec-badge ${band.cls}`}>{band.label}</span>
                    </div>
                    <h3 className="rec-card__title">{gym.name}</h3>
                  </div>
                  <div className="gym-card__price" aria-label={`£${gym.monthlyPrice.toFixed(2)} per month`}>
                    <span className="gym-card__price-amount">£{gym.monthlyPrice.toFixed(2)}</span>
                    <span className="gym-card__price-period">/mo</span>
                  </div>
                </div>

                <dl className="med-card__details">
                  <div className="med-card__detail">
                    <dt><PinIcon /> Location</dt>
                    <dd>{gym.location} · {gym.distanceMiles} mi away</dd>
                  </div>
                  <div className="med-card__detail">
                    <dt>⏰ Hours</dt>
                    <dd>{gym.openingHours}</dd>
                  </div>
                </dl>

                <div className="gym-card__features" aria-label="Included features">
                  {gym.features.map(f => (
                    <span key={f} className="gym-card__feature-tag">{f}</span>
                  ))}
                </div>

                {gym.priceNote && (
                  <p className="gym-card__price-note">💡 {gym.priceNote}</p>
                )}

                <div className="rec-card__footer">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(gym.name + ' ' + gym.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rec-cta rec-cta--outline"
                    aria-label={`Directions to ${gym.name}`}
                  >
                    Directions <ArrowIcon />
                  </a>
                  <button
                    type="button"
                    className="rec-cta rec-cta--primary"
                    onClick={() => onSaveSession(gym)}
                    aria-label={`Save gym session at ${gym.name}`}
                  >
                    + Save session
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
