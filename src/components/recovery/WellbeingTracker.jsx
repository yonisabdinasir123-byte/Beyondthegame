import { useState, useEffect, useCallback } from 'react'
import { storage, today, formatDate } from '../../utils/storage'

const METRICS = [
  { key: 'mood',   label: 'Mood',   icon: '😊', low: 'Low', high: 'Great' },
  { key: 'energy', label: 'Energy', icon: '⚡', low: 'Drained', high: 'Full of it' },
  { key: 'sleep',  label: 'Sleep',  icon: '😴', low: 'Rough', high: 'Brilliant' },
]

const RANGES = [30, 14, 7]

const ENCOURAGE = [
  'Every check-in counts — you\'re building self-awareness.',
  'Tracking how you feel is the first step to feeling better.',
  'You\'re doing great just by showing up and checking in.',
  'Progress isn\'t always linear. You\'re still moving forward.',
  'Proud of you for looking after yourself today.',
]

function ScorePicker({ metricKey, label, icon, value, onChange }) {
  return (
    <fieldset className="wbt-picker">
      <legend className="wbt-picker__legend">
        <span aria-hidden="true">{icon}</span> {label}
      </legend>
      <div className="wbt-picker__dots" role="group" aria-label={`${label} score 1 to 5`}>
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            className={`wbt-dot${value === n ? ' wbt-dot--active' : ''}`}
            onClick={() => onChange(n)}
            aria-pressed={value === n}
            aria-label={`${n} out of 5`}
          >
            {n}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

function MiniChart({ history, range }) {
  const slice = history.slice(-range)
  if (slice.length < 2) return null
  const W = 260
  const H = 72
  const pad = 8
  const innerW = W - pad * 2
  const innerH = H - pad * 2
  const maxVal = 5

  const paths = METRICS.map(m => {
    const pts = slice.map((d, i) => {
      const x = pad + (i / (slice.length - 1)) * innerW
      const y = pad + innerH - ((d[m.key] ?? 0) / maxVal) * innerH
      return `${x},${y}`
    })
    return { key: m.key, d: 'M ' + pts.join(' L ') }
  })

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="wbt-chart"
      aria-label={`Trend chart for last ${range} days`}
      role="img"
    >
      <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke="var(--amber-200)" strokeWidth="1" />
      <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="var(--amber-200)" strokeWidth="1" />
      {[1, 2, 3, 4, 5].map(n => (
        <line
          key={n}
          x1={pad} y1={pad + innerH - (n / maxVal) * innerH}
          x2={W - pad} y2={pad + innerH - (n / maxVal) * innerH}
          stroke="var(--amber-100)" strokeWidth="0.5"
        />
      ))}
      <path d={paths[0].d} stroke="var(--orange-500)" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <path d={paths[1].d} stroke="#F59E0B" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <path d={paths[2].d} stroke="var(--amber-700)" strokeWidth="2" fill="none" strokeLinejoin="round" />
    </svg>
  )
}

function ChartLegend() {
  return (
    <div className="wbt-legend" aria-hidden="true">
      <span className="wbt-legend__item" style={{ '--clr': 'var(--orange-500)' }}>Mood</span>
      <span className="wbt-legend__item" style={{ '--clr': '#F59E0B' }}>Energy</span>
      <span className="wbt-legend__item" style={{ '--clr': 'var(--amber-700)' }}>Sleep</span>
    </div>
  )
}

export default function WellbeingTracker() {
  const [scores, setScores]   = useState({ mood: 0, energy: 0, sleep: 0 })
  const [history, setHistory] = useState(() => storage.get('wbt-history', []))
  const [saved, setSaved]     = useState(false)
  const [range, setRange]     = useState(7)
  const [encourage]           = useState(() => ENCOURAGE[Math.floor(Math.random() * ENCOURAGE.length)])

  const todayEntry = history.find(h => h.date === today())

  useEffect(() => {
    if (todayEntry) setScores({ mood: todayEntry.mood, energy: todayEntry.energy, sleep: todayEntry.sleep })
  }, [])

  const handleSave = useCallback(() => {
    if (!scores.mood || !scores.energy || !scores.sleep) return
    const entry = { date: today(), ...scores }
    const next = [...history.filter(h => h.date !== today()), entry].sort((a, b) => a.date.localeCompare(b.date))
    setHistory(next)
    storage.set('wbt-history', next)
    setSaved(true)
    setTimeout(() => setSaved(false), 2200)
  }, [scores, history])

  const avg = (key) => {
    const slice = history.slice(-range)
    if (!slice.length) return '–'
    return (slice.reduce((s, d) => s + (d[key] ?? 0), 0) / slice.length).toFixed(1)
  }

  const allFilled = scores.mood && scores.energy && scores.sleep

  return (
    <div className="wbt-wrap">
      <div className="wbt-card">
        <h3 className="wbt-card__title">How are you feeling today?</h3>
        <p className="wbt-encourage">{encourage}</p>

        <div className="wbt-pickers">
          {METRICS.map(m => (
            <ScorePicker
              key={m.key}
              metricKey={m.key}
              label={m.label}
              icon={m.icon}
              value={scores[m.key]}
              onChange={v => setScores(s => ({ ...s, [m.key]: v }))}
            />
          ))}
        </div>

        <button
          type="button"
          className={`rec-btn${allFilled ? ' rec-btn--primary' : ' rec-btn--disabled'}`}
          onClick={handleSave}
          disabled={!allFilled}
          aria-live="polite"
          aria-label="Save today's check-in"
        >
          {saved ? '✓ Saved!' : todayEntry ? 'Update today\'s check-in' : 'Save check-in'}
        </button>
      </div>

      {history.length >= 2 && (
        <div className="wbt-trend">
          <div className="wbt-trend__header">
            <h3 className="wbt-trend__title">Your trend</h3>
            <div className="wbt-range-tabs" role="group" aria-label="Chart range">
              {RANGES.map(r => (
                <button
                  key={r}
                  type="button"
                  className={`wbt-range-tab${range === r ? ' wbt-range-tab--active' : ''}`}
                  onClick={() => setRange(r)}
                  aria-pressed={range === r}
                >
                  {r}d
                </button>
              ))}
            </div>
          </div>

          <MiniChart history={history} range={range} />
          <ChartLegend />

          <div className="wbt-avgs" aria-label="Averages">
            {METRICS.map(m => (
              <div key={m.key} className="wbt-avg">
                <span className="wbt-avg__icon" aria-hidden="true">{m.icon}</span>
                <span className="wbt-avg__val">{avg(m.key)}</span>
                <span className="wbt-avg__label">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
