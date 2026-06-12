/**
 * GoalSystem.jsx — goal picker, goal-gradient progress bar, celebrations,
 * and the protective unsaved-work guard.
 */
import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  GOALS, getGoal, setGoal, clearGoal,
  skipGoalPicker, goalPickerSkipped,
  deriveProgress, uncelebratedSteps, markCelebrated,
  PROGRESS_EVENT, notifyProgress, hapticPulse,
} from '../utils/goal'
import './behaviour.css'

// ─── Goal picker ───────────────────────────────────────────────────────────────
// Selection-first UI: tappable cards, zero typing. /* Fogg: facilitator */
export function GoalPicker() {
  const [goal, setGoalState]   = useState(getGoal)
  const [skipped, setSkipped]  = useState(goalPickerSkipped)
  const [justSet, setJustSet]  = useState(false)

  // Stay in sync when the goal changes elsewhere (e.g. "Change goal"
  // inside GoalProgress) — re-shows the picker without a reload.
  useEffect(() => {
    const sync = () => { setGoalState(getGoal()); setJustSet(false) }
    window.addEventListener(PROGRESS_EVENT, sync)
    return () => window.removeEventListener(PROGRESS_EVENT, sync)
  }, [])

  const choose = (id) => {
    setGoal(id)
    setGoalState(getGoal())
    setJustSet(true)
    hapticPulse() /* Norman: behavioural — confirm the commitment physically */
  }

  const skip = () => { skipGoalPicker(); setSkipped(true) }

  // Goal already set → show progress instead of the picker.
  if (goal) {
    return (
      <div className="goal-block">
        {justSet && (
          /* Cialdini: commitment — reflect the user's own choice back */
          <p className="goal-block__confirm" aria-live="polite">
            Goal set: {goal.emoji} {goal.label}. We'll track your progress everywhere.
          </p>
        )}
        <GoalProgress />
      </div>
    )
  }

  // Skipped → one quiet chip, no modal, no nagging. /* No dark patterns */
  if (skipped) {
    return (
      <div className="goal-block goal-block--quiet">
        {/* Storage flag stays — if they still don't pick, next visit shows
            this quiet chip again, never the full picker. */}
        <button type="button" className="goal-chip" onClick={() => setSkipped(false)}>
          🎯 Set a goal when you're ready
        </button>
      </div>
    )
  }

  return (
    <div className="goal-block" role="group" aria-labelledby="goal-picker-heading">
      <h3 className="goal-block__title" id="goal-picker-heading">
        What do you want to work towards?
      </h3>
      {/* Choice architecture: 4 options, control stated, change any time */}
      <p className="goal-block__sub">Pick one. You can change it any time.</p>

      <div className="goal-picker-grid">
        {GOALS.map(g => (
          <button
            key={g.id}
            type="button"
            className="goal-option"
            onClick={() => choose(g.id)}
          >
            <span className="goal-option__emoji" aria-hidden="true">{g.emoji}</span>
            <span className="goal-option__label">{g.label}</span>
            <span className="goal-option__blurb">{g.blurb}</span>
          </button>
        ))}
      </div>

      {/* Plain decline — equal dignity, no confirm-shaming */}
      <button type="button" className="goal-skip" onClick={skip}>
        Not now
      </button>
    </div>
  )
}

// ─── Progress bar with goal-gradient emphasis ──────────────────────────────────
export function GoalProgress() {
  const [progress, setProgress] = useState(deriveProgress)
  const [announce, setAnnounce] = useState('')
  const [celebrating, setCelebrating] = useState(false)
  const firstRun = useRef(true)

  const refresh = useCallback(() => {
    const p = deriveProgress()
    setProgress(p)
    if (!p) return

    const fresh = uncelebratedSteps(p)
    if (fresh.length > 0) {
      markCelebrated(p, fresh)
      // Celebrate only milestones completed during use — not on first paint
      // of historical progress.
      if (!firstRun.current) {
        /* Norman: behavioural — feedback the moment it happens */
        setAnnounce(`Milestone complete: ${fresh[fresh.length - 1].label}. ${p.done} of ${p.total} steps done.`)
        setCelebrating(true)
        hapticPulse()
        setTimeout(() => setCelebrating(false), 1200)
      }
    }
    firstRun.current = false
  }, [])

  useEffect(() => {
    refresh()
    window.addEventListener(PROGRESS_EVENT, refresh)
    return () => window.removeEventListener(PROGRESS_EVENT, refresh)
  }, [refresh])

  if (!progress) return null
  const { goal, steps, done, total, next } = progress
  const pct = Math.round((done / total) * 100)
  /* Goal gradient: effort accelerates near completion — emphasise it */
  const nearlyThere = done >= total - 1 && done < total
  const complete = done === total

  return (
    <div className={`goal-progress${nearlyThere ? ' goal-progress--near' : ''}${celebrating ? ' goal-progress--celebrate' : ''}`}>
      <div className="goal-progress__head">
        <span className="goal-progress__label">
          My goal: {goal.emoji} {goal.label}
        </span>
        <span className="goal-progress__count">{done} of {total} steps</span>
      </div>

      <div
        className="goal-progress__track"
        role="progressbar"
        aria-valuenow={done}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`${goal.label} progress: ${done} of ${total} steps complete`}
      >
        <div className="goal-progress__fill" style={{ width: `${pct}%` }} />
        {/* Milestone markers — visible structure, Gestalt uniform connectedness */}
        {steps.map((s, i) => (
          <span
            key={s.id}
            className={`goal-progress__dot${s.done ? ' goal-progress__dot--done' : ''}`}
            style={{ left: `${((i + 1) / total) * 100}%` }}
            aria-hidden="true"
          />
        ))}
      </div>

      {complete ? (
        /* Behaviour chaining: completion immediately offers what's next */
        <p className="goal-progress__next">
          🎉 All steps done. Brilliant work. <Link to="/pathway#stories" className="goal-progress__link">See what players did next →</Link>
        </p>
      ) : (
        <p className="goal-progress__next">
          {/* Prospect: gain framing — what's left to gain, never what's missing */}
          {nearlyThere ? 'Nearly there — ' : 'Next: '}
          <Link to={next.href} className="goal-progress__link">{next.label} →</Link>
        </p>
      )}

      {/* Screen readers hear milestone completions politely */}
      <span className="sr-only" aria-live="polite">{announce}</span>

      <button
        type="button"
        className="goal-progress__change"
        onClick={() => { clearGoal(); notifyProgress() }}
      >
        Change goal
      </button>
    </div>
  )
}

// ─── Protective unsaved-work guard ─────────────────────────────────────────────
/**
 * useUnsavedGuard(active) — honest beforeunload warning while `active`.
 * Protects work, never traps: the browser shows its standard
 * "leave site?" dialog with equal Stay/Leave options.
 * No dark patterns: protective warning only while work would be lost.
 */
export function useUnsavedGuard(active) {
  useEffect(() => {
    if (!active) return
    const handler = (e) => {
      e.preventDefault()
      // Modern browsers show their own copy; returnValue is required legacy API.
      e.returnValue = 'Are you sure you want to leave this page? Your work will not be saved.'
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [active])
}
