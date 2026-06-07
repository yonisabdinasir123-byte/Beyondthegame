import { useState, useMemo, useId } from 'react'

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
  </svg>
)

const LEVEL_OPTIONS  = ['Step 3 / 4', 'Step 5 / 6', 'Step 6 / 7', 'Pro Academy']
const REGION_OPTIONS = [
  'North West', 'Yorkshire', 'National', 'National (Northern)',
  'Midlands', 'South', 'South East', 'North East',
]

/** @param {{ leagues: import('../../data/pathwayData').League[] }} props */
export default function CompatibleLeagues({ leagues }) {
  const [levelFilter, setLevelFilter]   = useState('')
  const [regionFilter, setRegionFilter] = useState('')

  const levelId  = useId()
  const regionId = useId()

  const filtered = useMemo(() => {
    return leagues.filter(l => {
      const matchLevel  = !levelFilter  || l.level  === levelFilter
      const matchRegion = !regionFilter || l.region === regionFilter
      return matchLevel && matchRegion
    })
  }, [leagues, levelFilter, regionFilter])

  const hasFilter = levelFilter || regionFilter

  const tierClass = {
    Grassroots:    'badge--grassroots',
    'Semi-Pro':    'badge--semipro',
    'Pro Academy': 'badge--proacademy',
  }

  return (
    <div>
      {/* League-specific filters */}
      <div className="filter-panel filter-panel--compact" role="search" aria-label="League filters">
        <div className="filter-panel__selects">
          <div className="filter-panel__group">
            <label htmlFor={levelId} className="filter-panel__label">Level</label>
            <select
              id={levelId}
              className="filter-panel__select"
              value={levelFilter}
              onChange={e => setLevelFilter(e.target.value)}
            >
              <option value="">All levels</option>
              {LEVEL_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="filter-panel__group">
            <label htmlFor={regionId} className="filter-panel__label">Region</label>
            <select
              id={regionId}
              className="filter-panel__select"
              value={regionFilter}
              onChange={e => setRegionFilter(e.target.value)}
            >
              <option value="">All regions</option>
              {REGION_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
        <div className="filter-panel__meta">
          <span className="filter-panel__count" aria-live="polite" aria-atomic="true">
            <strong>{filtered.length}</strong> league{filtered.length !== 1 ? 's' : ''} found
          </span>
          {hasFilter && (
            <button
              type="button"
              className="filter-panel__reset"
              onClick={() => { setLevelFilter(''); setRegionFilter('') }}
            >
              Reset ✕
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="empty-state" role="status" aria-live="polite">
          <span className="empty-state__icon" aria-hidden="true">🔍</span>
          <h3 className="empty-state__title">No leagues match</h3>
          <p className="empty-state__text">Try a different level or region.</p>
        </div>
      ) : (
        <ul className="cards-list cards-list--leagues" role="list" aria-label="Compatible leagues">
          {filtered.map(league => (
            <li key={league.id} className="league-card" role="listitem">
              <div className="league-card__header">
                <div>
                  <h3 className="league-card__name">{league.name}</h3>
                  <div className="league-card__meta-row">
                    <span className="tag tag--region">{league.region}</span>
                    <span className={`badge ${tierClass[league.tier] || ''}`}>{league.tier}</span>
                  </div>
                </div>
                <div className="league-card__step">
                  <span className="tag tag--level-step">{league.level}</span>
                </div>
              </div>

              <p className="league-card__desc">{league.description}</p>

              <dl className="league-card__details">
                <div className="league-card__detail-item">
                  <dt>Age group</dt>
                  <dd>{league.ageGroup}</dd>
                </div>
                <div className="league-card__detail-item">
                  <dt>Season</dt>
                  <dd>{league.seasonWindow}</dd>
                </div>
                <div className="league-card__detail-item league-card__detail-item--join">
                  <dt>How to join</dt>
                  <dd>{league.howToJoin}</dd>
                </div>
              </dl>

              <div className="league-card__footer">
                <a href="#" className="card-cta" aria-label={`Find out more about ${league.name}`}>
                  Find out more <ArrowIcon />
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
