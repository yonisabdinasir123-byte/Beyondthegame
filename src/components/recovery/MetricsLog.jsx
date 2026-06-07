import { useState, useCallback } from 'react'
import { storage, today, formatDate } from '../../utils/storage'

const METRICS = [
  {
    key:   'hydration',
    label: 'Hydration',
    icon:  '💧',
    unit:  'glasses',
    min:   0,
    max:   20,
    goal:  8,
    hint:  'Aim for 8 glasses a day',
  },
  {
    key:   'sleep',
    label: 'Sleep',
    icon:  '😴',
    unit:  'hrs',
    min:   0,
    max:   14,
    goal:  8,
    hint:  'Most people need 7–9 hours',
  },
  {
    key:   'steps',
    label: 'Steps',
    icon:  '👟',
    unit:  'steps',
    min:   0,
    max:   30000,
    step:  500,
    goal:  8000,
    hint:  'Try for 8,000+ steps',
  },
]

function GoalBar({ value, goal }) {
  if (!goal) return null
  const pct = Math.min(100, Math.round((value / goal) * 100))
  const hit = pct >= 100
  return (
    <div className="mlog-goal-bar" aria-label={`${pct}% of daily goal`}>
      <div className="mlog-goal-bar__track">
        <div
          className={`mlog-goal-bar__fill${hit ? ' mlog-goal-bar__fill--hit' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="mlog-goal-bar__pct">{hit ? '✓ Goal!' : `${pct}%`}</span>
    </div>
  )
}

function WeekSummary({ history, metric }) {
  const slice = history.slice(-7)
  if (!slice.length) return null

  const vals = slice.map(d => d[metric.key] ?? 0)
  const max  = Math.max(...vals, 1)
  const avg  = (vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1)

  return (
    <div className="mlog-week" aria-label={`7-day ${metric.label} summary`}>
      <p className="mlog-week__avg">
        <strong>7-day avg:</strong> {avg} {metric.unit}
      </p>
      <div className="mlog-week__bars" aria-hidden="true">
        {slice.map((d, i) => (
          <div key={i} className="mlog-week__col">
            <div className="mlog-week__bar-wrap">
              <div
                className={`mlog-week__bar${(d[metric.key] ?? 0) >= metric.goal ? ' mlog-week__bar--hit' : ''}`}
                style={{ height: `${Math.round(((d[metric.key] ?? 0) / max) * 40)}px` }}
              />
            </div>
            <span className="mlog-week__day-label">{formatDate(d.date).slice(0, 3)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function MetricsLog() {
  const [log, setLog] = useState(() => storage.get('metrics-log', []))
  const [saved, setSaved] = useState(false)

  const todayEntry = log.find(d => d.date === today()) ?? {}
  const [vals, setVals] = useState({
    hydration: todayEntry.hydration ?? 0,
    sleep:     todayEntry.sleep     ?? 0,
    steps:     todayEntry.steps     ?? 0,
  })

  const adjust = useCallback((key, delta, metric) => {
    setVals(v => ({
      ...v,
      [key]: Math.max(metric.min, Math.min(metric.max, (v[key] ?? 0) + delta)),
    }))
  }, [])

  const handleSave = () => {
    const entry = { date: today(), ...vals }
    const next  = [...log.filter(d => d.date !== today()), entry].sort((a, b) => a.date.localeCompare(b.date))
    setLog(next)
    storage.set('metrics-log', next)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="mlog-wrap">
      {METRICS.map(m => {
        const stepSize = m.step ?? 1
        const value    = vals[m.key] ?? 0
        return (
          <div key={m.key} className="mlog-card">
            <div className="mlog-card__header">
              <span className="mlog-card__icon" aria-hidden="true">{m.icon}</span>
              <div>
                <h3 className="mlog-card__title">{m.label}</h3>
                <p className="mlog-card__hint">{m.hint}</p>
              </div>
            </div>

            <div className="mlog-card__controls" role="group" aria-label={`${m.label} input`}>
              <button
                type="button"
                className="mlog-step-btn"
                onClick={() => adjust(m.key, -stepSize, m)}
                aria-label={`Decrease ${m.label}`}
                disabled={value <= m.min}
              >
                −
              </button>
              <div className="mlog-value-display" aria-live="polite" aria-atomic="true">
                <span className="mlog-value-display__num">{value.toLocaleString()}</span>
                <span className="mlog-value-display__unit">{m.unit}</span>
              </div>
              <button
                type="button"
                className="mlog-step-btn"
                onClick={() => adjust(m.key, stepSize, m)}
                aria-label={`Increase ${m.label}`}
                disabled={value >= m.max}
              >
                +
              </button>
            </div>

            <GoalBar value={value} goal={m.goal} />

            <WeekSummary history={log} metric={m} />
          </div>
        )
      })}

      <button
        type="button"
        className="rec-btn rec-btn--primary mlog-save-btn"
        onClick={handleSave}
        aria-live="polite"
      >
        {saved ? '✓ Saved!' : 'Save today\'s metrics'}
      </button>
    </div>
  )
}
