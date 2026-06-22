import { useMemo } from 'react'
import { today, formatDate } from '../../utils/storage'

function buildCalendar(completedDates, monthsBack = 3) {
  const end  = new Date(today() + 'T00:00:00')
  const start = new Date(end)
  start.setMonth(start.getMonth() - monthsBack)
  start.setDate(1)

  const set = new Set(completedDates)
  const days = []
  const cur = new Date(start)
  while (cur <= end) {
    const iso = cur.toISOString().slice(0, 10)
    days.push({ iso, done: set.has(iso) })
    cur.setDate(cur.getDate() + 1)
  }
  return days
}

function computeStreaks(completedDates) {
  if (!completedDates.length) return { current: 0, longest: 0 }
  const sorted = [...new Set(completedDates)].sort()
  let current = 0
  let longest = 0
  let streak  = 1

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1] + 'T00:00:00')
    const curr = new Date(sorted[i]     + 'T00:00:00')
    const diff = (curr - prev) / 86400000
    if (diff === 1) {
      streak++
    } else {
      longest = Math.max(longest, streak)
      streak  = 1
    }
  }
  longest = Math.max(longest, streak)

  // Current streak: walk back from today
  const todayStr = today()
  let cur = new Set(sorted)
  let d   = new Date(todayStr + 'T00:00:00')
  current = 0
  while (cur.has(d.toISOString().slice(0, 10))) {
    current++
    d.setDate(d.getDate() - 1)
  }

  return { current, longest }
}

function HeatmapWeeks({ days }) {
  const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  // Align days into ISO-week columns
  const firstDay = new Date(days[0].iso + 'T00:00:00')
  const dow      = firstDay.getDay() // 0=Sun
  const offset   = dow === 0 ? 6 : dow - 1 // make Mon=0
  const padded   = [...Array(offset).fill(null), ...days]

  const weeks = []
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7))
  }

  const todayStr = today()

  return (
    <div className="streak-heatmap" aria-label="Completion calendar">
      <div className="streak-heatmap__labels" aria-hidden="true">
        {DAYS_OF_WEEK.map(d => <span key={d} className="streak-heatmap__day-label">{d[0]}</span>)}
      </div>
      <div className="streak-heatmap__grid">
        {weeks.map((week, wi) => (
          <div key={wi} className="streak-heatmap__week">
            {week.map((cell, di) => {
              if (!cell) return <span key={di} className="streak-heatmap__cell streak-heatmap__cell--empty" aria-hidden="true" />
              return (
                <span
                  key={cell.iso}
                  className={`streak-heatmap__cell${cell.done ? ' streak-heatmap__cell--done' : ''}${cell.iso === todayStr ? ' streak-heatmap__cell--today' : ''}`}
                  aria-label={`${formatDate(cell.iso)}${cell.done ? ', completed' : ''}`}
                  role="img"
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ProgressStreaks({ completedDates = [] }) {
  const { current, longest } = useMemo(() => computeStreaks(completedDates), [completedDates])
  const days = useMemo(() => buildCalendar(completedDates, 3), [completedDates])

  const totalDone  = new Set(completedDates).size
  const totalDays  = days.length
  const pct        = totalDays ? Math.round((totalDone / totalDays) * 100) : 0

  return (
    <div className="streak-wrap">
      <div className="streak-stats">
        <div className="streak-stat streak-stat--fire" aria-label={`Current streak: ${current} days`}>
          <span className="streak-stat__icon" aria-hidden="true">🔥</span>
          <span className="streak-stat__num">{current}</span>
          <span className="streak-stat__label">Current streak</span>
        </div>
        <div className="streak-stat" aria-label={`Longest streak: ${longest} days`}>
          <span className="streak-stat__icon" aria-hidden="true">🏆</span>
          <span className="streak-stat__num">{longest}</span>
          <span className="streak-stat__label">Longest streak</span>
        </div>
        <div className="streak-stat" aria-label={`${totalDone} days completed`}>
          <span className="streak-stat__icon" aria-hidden="true">✅</span>
          <span className="streak-stat__num">{totalDone}</span>
          <span className="streak-stat__label">Days completed</span>
        </div>
      </div>

      <div className="streak-pct-bar" aria-label={`${pct}% completion rate`}>
        <div className="streak-pct-bar__track">
          <div className="streak-pct-bar__fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="streak-pct-bar__label">{pct}% completion in last 3 months</span>
      </div>

      {current >= 3 && (
        <p className="streak-nudge" role="status" aria-live="polite">
          {current >= 7
            ? `🌟 ${current} days straight, you're on fire! Keep that momentum.`
            : `💪 ${current} days in a row, brilliant consistency!`}
        </p>
      )}

      <HeatmapWeeks days={days} />

      <div className="streak-legend" aria-hidden="true">
        <span className="streak-legend__cell streak-legend__cell--empty" /> Not completed
        <span className="streak-legend__cell streak-legend__cell--done" />  Completed
        <span className="streak-legend__cell streak-legend__cell--today" /> Today
      </div>
    </div>
  )
}
