import { useId } from 'react'

const POSITIONS = [
  'Goalkeeper', 'Centre-Back', 'Right-Back', 'Left-Back',
  'Defensive Midfielder', 'Midfielder', 'Attacking Midfielder',
  'Right Winger', 'Left Winger', 'Winger', 'Striker',
]
const AGE_GROUPS = ['U18', 'U21', 'U23']
const TIERS      = ['Grassroots', 'Semi-Pro', 'Pro Academy']
const REGIONS    = [
  'North West', 'Yorkshire', 'Lancashire', 'Greater Manchester',
  'Midlands', 'South', 'South East', 'North East', 'National',
]

/**
 * @param {{
 *   filters: { position: string, ageGroup: string, tier: string, region: string },
 *   onChange: (key: string, value: string) => void,
 *   onReset: () => void,
 *   resultCount: number,
 * }} props
 */
export default function FilterPanel({ filters, onChange, onReset, resultCount }) {
  const posId  = useId()
  const ageId  = useId()
  const tierId = useId()
  const regId  = useId()

  const hasActive = Object.values(filters).some(Boolean)

  return (
    <div className="filter-panel" role="search" aria-label="Club filters">
      <div className="filter-panel__selects">

        {/* Position */}
        <div className="filter-panel__group">
          <label htmlFor={posId} className="filter-panel__label">Position</label>
          <select
            id={posId}
            className="filter-panel__select"
            value={filters.position}
            onChange={e => onChange('position', e.target.value)}
          >
            <option value="">All positions</option>
            {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {/* Age group */}
        <div className="filter-panel__group">
          <label htmlFor={ageId} className="filter-panel__label">Age group</label>
          <select
            id={ageId}
            className="filter-panel__select"
            value={filters.ageGroup}
            onChange={e => onChange('ageGroup', e.target.value)}
          >
            <option value="">All ages</option>
            {AGE_GROUPS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        {/* Tier */}
        <div className="filter-panel__group">
          <label htmlFor={tierId} className="filter-panel__label">Club level</label>
          <select
            id={tierId}
            className="filter-panel__select"
            value={filters.tier}
            onChange={e => onChange('tier', e.target.value)}
          >
            <option value="">All levels</option>
            {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Region */}
        <div className="filter-panel__group">
          <label htmlFor={regId} className="filter-panel__label">Region</label>
          <select
            id={regId}
            className="filter-panel__select"
            value={filters.region}
            onChange={e => onChange('region', e.target.value)}
          >
            <option value="">All regions</option>
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* Meta row */}
      <div className="filter-panel__meta">
        <span className="filter-panel__count" aria-live="polite" aria-atomic="true">
          <strong>{resultCount}</strong> club{resultCount !== 1 ? 's' : ''} found
        </span>
        {hasActive && (
          <button type="button" className="filter-panel__reset" onClick={onReset}>
            Reset filters ✕
          </button>
        )}
      </div>
    </div>
  )
}
