/**
 * CVBuilder.jsx
 *
 * HOW THE API CALL WORKS
 * ─────────────────────────────────────────────────────────────────────────────
 * The CV is generated SERVER-SIDE. This component posts the form to the route
 * POST /api/generate-cv, which calls the Anthropic Messages API using the
 * ANTHROPIC_API_KEY env var on the server. The key is never exposed in the
 * browser. With no key the route returns an honest "needs a key" state.
 *
 * HOW TO PLUG IN
 * • Set ANTHROPIC_API_KEY on the server (see .env.example). Local `npm run dev`
 *   loads it via the Vite dev middleware in vite.config.js.
 */

import { useState, useEffect, useRef } from 'react'
import { storage } from '../../utils/storage'
import { notifyProgress, hapticPulse } from '../../utils/goal'
import { useUnsavedGuard } from '../GoalSystem'
import PromptCard from '../PromptCard'

// ─── Constants ─────────────────────────────────────────────────────────────────
const POSITIONS_LIST = [
  'Goalkeeper', 'Centre-Back', 'Right-Back', 'Left-Back',
  'Defensive Midfielder', 'Central Midfielder', 'Attacking Midfielder',
  'Right Winger', 'Left Winger', 'Striker',
]

const INITIAL_FORM = {
  name:          '',
  age:           '',
  positions:     [],     // string[]
  preferredFoot: 'Right',
  height:        '',
  currentClub:   '',
  previousClubs: '',
  appearances:   '',
  goals:         '',
  assists:       '',
  cleanSheets:   '',
  achievements:  '',
  bio:           '',
}

// ─── API call ──────────────────────────────────────────────────────────────────
// The CV is generated server-side. We post the form to /api/generate-cv, which
// holds the Anthropic key and returns the finished CV text. The browser never
// sees the key. A 503 means the route has no key configured yet.
async function generateCV(formData) {
  const res = await fetch('/api/generate-cv', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })

  if (res.status === 503) throw new Error('NO_KEY')

  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.ok) {
    throw new Error(data.message || `Request failed (${res.status})`)
  }
  return data.cv
}

// ─── Sub-components ────────────────────────────────────────────────────────────
function PositionPicker({ selected, onChange }) {
  const toggle = (pos) =>
    onChange(
      selected.includes(pos)
        ? selected.filter(p => p !== pos)
        : [...selected, pos],
    )

  return (
    <div className="position-picker" role="group" aria-label="Select your positions">
      {POSITIONS_LIST.map(pos => (
        <button
          key={pos}
          type="button"
          className={`position-pill${selected.includes(pos) ? ' active' : ''}`}
          onClick={() => toggle(pos)}
          aria-pressed={selected.includes(pos)}
        >
          {pos}
        </button>
      ))}
    </div>
  )
}

function CVOutput({ cv, onRegenerate, loading }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cv)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="cv-output">
      <div className="cv-output__toolbar">
        <h3 className="cv-output__heading">Your Generated CV</h3>
        <div className="cv-output__actions">
          <button type="button" className="cv-btn cv-btn--outline" onClick={handleCopy} disabled={loading}>
            {copied ? '✓ Copied!' : 'Copy text'}
          </button>
          <button type="button" className="cv-btn cv-btn--primary" onClick={onRegenerate} disabled={loading}>
            {loading ? 'Regenerating…' : 'Regenerate'}
          </button>
        </div>
      </div>
      <pre className="cv-output__text" aria-live="polite" aria-label="Generated CV text">
        {cv}
      </pre>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────
const draftHasContent = (d) =>
  Boolean(d && (d.name || d.currentClub || (d.positions && d.positions.length)))

export default function CVBuilder() {
  /* Fogg: facilitator, answers auto-restore; nobody types twice */
  const [form, setForm] = useState(() => ({ ...INITIAL_FORM, ...storage.get('cv-draft', {}) }))
  const [cv, setCV]             = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [restored] = useState(() => draftHasContent(storage.get('cv-draft', null)))
  const startedRef = useRef(restored)

  // Draft auto-saves on every change, work is never lost, so no scary
  // warning is needed for the form itself. /* No dark patterns: protect, don't trap */
  useEffect(() => {
    storage.set('cv-draft', form)
    if (!startedRef.current && draftHasContent(form)) {
      startedRef.current = true
      notifyProgress() /* milestone signal: CV started */
    }
  }, [form])

  // A generation in flight WOULD be lost on leave, honest guard, only then.
  useUnsavedGuard(loading)

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }))
  const setPositions = positions => setForm(f => ({ ...f, positions }))

  const isGoalkeeper = form.positions.includes('Goalkeeper')

  const validate = () => {
    if (!form.name.trim())         return 'Please enter your name.'
    if (!form.age || +form.age < 14 || +form.age > 40) return 'Please enter a valid age (14 to 40).'
    if (form.positions.length === 0) return 'Please select at least one position.'
    if (!form.currentClub.trim())  return 'Please enter your current or most recent club.'
    return null
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setError('')
    setLoading(true)
    setSubmitted(true)
    try {
      const result = await generateCV(form)
      setCV(result)
      /* Norman: behavioural, milestone confirmed the moment it happens */
      storage.set('cv-done', true)
      notifyProgress()
      hapticPulse()
    } catch (ex) {
      if (ex.message === 'NO_KEY') {
        setError('The CV builder is not switched on yet. It needs a server key to go live. Your answers are saved.')
      } else {
        /* Emotional design: frustration absorbed, fix stated, no blame,
           input preserved (it's auto-saved). */
        setError(`Something went wrong: ${ex.message}. Your answers are saved, please try again.`)
      }
      setSubmitted(false)
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerate = async () => {
    setError('')
    setLoading(true)
    try {
      const result = await generateCV(form)
      setCV(result)
    } catch (ex) {
      setError(`Regeneration failed: ${ex.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="cv-builder">
      {/* Fogg: facilitator, returning users see their work is already here */}
      {restored && !cv && (
        <PromptCard type="facilitator">
          Welcome back. Your answers are saved, check them and carry on.
        </PromptCard>
      )}

      <div className={`cv-builder__layout${cv ? ' cv-builder__layout--split' : ''}`}>

        {/* ── Form ── */}
        <form
          className="cv-builder__form"
          onSubmit={handleSubmit}
          noValidate
          aria-label="Football CV builder form"
        >
          {error && (
            <div className="form-error" role="alert">{error}</div>
          )}

          {/* Row 1: name + age */}
          <div className="cv-form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="cv-name">Full name <span aria-hidden="true">*</span></label>
              <input id="cv-name" type="text" className="form-input" value={form.name}
                onChange={set('name')} placeholder="Your full name" autoComplete="name" required />
            </div>
            <div className="form-group cv-form-row__narrow">
              <label className="form-label" htmlFor="cv-age">Age <span aria-hidden="true">*</span></label>
              <input id="cv-age" type="number" className="form-input" value={form.age}
                onChange={set('age')} placeholder="e.g. 19" min={14} max={40} required />
            </div>
          </div>

          {/* Position picker */}
          <div className="form-group">
            <span className="form-label" id="pos-label">
              Position(s) <span aria-hidden="true">*</span>
            </span>
            <PositionPicker selected={form.positions} onChange={setPositions} />
          </div>

          {/* Row 2: foot + height */}
          <div className="cv-form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="cv-foot">Preferred foot</label>
              <select id="cv-foot" className="form-input form-select" value={form.preferredFoot} onChange={set('preferredFoot')}>
                <option>Right</option>
                <option>Left</option>
                <option>Both</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="cv-height">Height</label>
              <input id="cv-height" type="text" className="form-input" value={form.height}
                onChange={set('height')} placeholder="e.g. 5'11 / 180cm" />
            </div>
          </div>

          {/* Clubs */}
          <div className="form-group">
            <label className="form-label" htmlFor="cv-current-club">
              Current / most recent club <span aria-hidden="true">*</span>
            </label>
            <input id="cv-current-club" type="text" className="form-input" value={form.currentClub}
              onChange={set('currentClub')} placeholder="e.g. Hyde United FC" required />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="cv-prev-clubs">Previous clubs</label>
            <textarea id="cv-prev-clubs" className="form-input form-textarea" value={form.previousClubs}
              onChange={set('previousClubs')} placeholder="List each club on a new line, e.g.&#10;Radcliffe FC (2023 to 24)&#10;Bamber Bridge FC (2022 to 23)" rows={3} />
          </div>

          {/* Stats */}
          <fieldset className="cv-stats-fieldset">
            <legend className="form-label">Key statistics</legend>
            <div className="cv-stats-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="cv-apps">Appearances</label>
                <input id="cv-apps" type="number" className="form-input" value={form.appearances}
                  onChange={set('appearances')} placeholder="e.g. 42" min={0} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="cv-goals">Goals</label>
                <input id="cv-goals" type="number" className="form-input" value={form.goals}
                  onChange={set('goals')} placeholder="e.g. 14" min={0} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="cv-assists">Assists</label>
                <input id="cv-assists" type="number" className="form-input" value={form.assists}
                  onChange={set('assists')} placeholder="e.g. 9" min={0} />
              </div>
              {(isGoalkeeper || form.cleanSheets) && (
                <div className="form-group">
                  <label className="form-label" htmlFor="cv-cs">Clean sheets</label>
                  <input id="cv-cs" type="number" className="form-input" value={form.cleanSheets}
                    onChange={set('cleanSheets')} placeholder="e.g. 11" min={0} />
                </div>
              )}
            </div>
          </fieldset>

          {/* Achievements */}
          <div className="form-group">
            <label className="form-label" htmlFor="cv-achievements">Achievements &amp; honours</label>
            <textarea id="cv-achievements" className="form-input form-textarea" value={form.achievements}
              onChange={set('achievements')} placeholder="e.g. Top scorer 2024/25, Player of the Year, County Cup winner" rows={3} />
          </div>

          {/* Bio */}
          <div className="form-group">
            <label className="form-label" htmlFor="cv-bio">In your own words (optional)</label>
            <textarea id="cv-bio" className="form-input form-textarea" value={form.bio}
              onChange={set('bio')} placeholder="A short description of your playing style, mentality, and ambitions…" rows={4} />
          </div>

          <button
            type="submit"
            className="form-submit cv-builder__submit"
            disabled={loading}
            aria-describedby={error ? 'cv-error' : undefined}
          >
            {loading ? (
              <><span className="spinner" aria-hidden="true" /> Generating your CV…</>
            ) : (
              '✨ Generate my football CV'
            )}
          </button>

          {!submitted && (
            <p className="cv-builder__key-hint">
              Your details stay in your browser. We build the CV for you when the
              service is switched on.
            </p>
          )}
        </form>

        {/* ── Output ── */}
        {(cv || (loading && submitted)) && (
          <div className="cv-output-wrap">
            {loading && !cv ? (
              <div className="cv-output cv-output--loading" aria-live="polite" aria-busy="true">
                <div className="cv-loading">
                  <div className="cv-loading__dots" aria-hidden="true">
                    <span /><span /><span />
                  </div>
                  <p className="cv-loading__text">Crafting your CV…</p>
                </div>
              </div>
            ) : cv ? (
              <>
                <CVOutput cv={cv} onRegenerate={handleRegenerate} loading={loading} />
                {/* Fogg: spark + behaviour chaining, completion offers the
                    natural next step while the win is fresh. */}
                <PromptCard type="spark" ctaLabel="Find clubs recruiting now" href="#clubs" live>
                  CV done, great work. Clubs above are recruiting right now.
                </PromptCard>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
