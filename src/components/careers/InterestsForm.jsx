/**
 * InterestsForm.jsx, Let users choose what they want to work in: subjects,
 * hobbies, and skills. We match those against the rules dataset and return
 * career suggestions. Selections persist to localStorage.
 *
 * Optional server enrichment (server-side proxy keeps any key off the browser):
 *   POST /api/career-suggest with { subjects, hobbies, skills, freeText }
 *   returns tailored suggestions. Toggle with VITE_ENABLE_SMART_CAREERS=true.
 *   Falls back cleanly to the rules dataset if the call fails.
 */
import { useState, useCallback } from 'react'
import { storage } from '../../utils/storage'
import { notifyProgress } from '../../utils/goal'
import { SUBJECT_PRESETS, HOBBY_PRESETS, SKILL_PRESETS, careerRules } from '../../data/educationData'

/**
 * A group of selectable choice chips rendered as a glass panel.
 * Each chip is a real button with aria-pressed for full keyboard support.
 */
function ChoiceGroup({ id, title, hint, presets, selected, onToggle }) {
  const count = presets.filter(p => selected.includes(p)).length
  const headingId = `${id}-heading`
  return (
    <fieldset className="interests-group glass glass--quiet glass--pad" aria-labelledby={headingId}>
      <legend className="interests-group__legend">
        <span id={headingId} className="interests-group__title">{title}</span>
        {count > 0 && (
          <span className="interests-group__count" aria-label={`${count} selected`}>{count} chosen</span>
        )}
      </legend>
      <p className="interests-group__hint">{hint}</p>
      <div className="interests-chips" role="group" aria-labelledby={headingId}>
        {presets.map(p => {
          const active = selected.includes(p)
          return (
            <button
              key={p}
              type="button"
              className={`interests-chip${active ? ' interests-chip--active' : ''}`}
              onClick={() => onToggle(p)}
              aria-pressed={active}
            >
              <span className="interests-chip__check" aria-hidden="true">{active ? '✓' : '+'}</span>
              <span className="interests-chip__label">{p}</span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

/**
 * Score each career rule against selected interests.
 * Returns rules sorted by match score descending.
 * @param {string[]} interests
 * @returns {import('../../data/educationData').CareerRule[]}
 */
function matchRules(interests) {
  if (!interests.length) return []
  const lower = interests.map(i => i.toLowerCase())
  return careerRules
    .map(rule => {
      const score = rule.interests.reduce((acc, kw) => {
        const hit = lower.some(i => i.includes(kw.toLowerCase()) || kw.toLowerCase().includes(i))
        return acc + (hit ? 1 : 0)
      }, 0)
      return { ...rule, score }
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
}

export default function InterestsForm({ onResults }) {
  const [subjects,  setSubjects]  = useState(() => storage.get('ci-subjects', []))
  const [hobbies,   setHobbies]   = useState(() => storage.get('ci-hobbies',  []))
  const [skills,    setSkills]    = useState(() => storage.get('ci-skills',   []))
  const [freeText,  setFreeText]  = useState(() => storage.get('ci-free',     ''))
  const [loading,   setLoading]   = useState(false)
  const [notice,    setNotice]    = useState(null)

  const toggle = (setter, storageKey) => (val) => {
    setter(prev => {
      const next = prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]
      storage.set(storageKey, next)
      notifyProgress() /* milestone signal: interests entered */
      return next
    })
  }

  const freeWords = freeText.split(/[,\n]+/).map(s => s.trim()).filter(Boolean)
  const allInterests = [...subjects, ...hobbies, ...skills, ...freeWords]
  const totalSelected = subjects.length + hobbies.length + skills.length + freeWords.length

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    storage.set('ci-free', freeText)

    // Always compute local rule matches first (instant, reliable)
    const ruleMatches = matchRules(allInterests)
    onResults(ruleMatches, null)

    // OPTIONAL: server enrichment (server-side proxy)
    // Guarded by VITE_ENABLE_SMART_CAREERS env flag to avoid accidental key exposure.
    const enriched = import.meta.env.VITE_ENABLE_SMART_CAREERS === 'true'
    if (!enriched || !allInterests.length) return

    setLoading(true)
    setNotice(null)
    try {
      const res = await fetch('/api/career-suggest', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ subjects, hobbies, skills, freeText }),
      })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const data = await res.json()
      onResults(ruleMatches, data.suggestions ?? null)
    } catch (err) {
      // Graceful degradation, rule results are already shown
      setNotice('Smart suggestions are unavailable right now, so we are showing results from our career database instead.')
    } finally {
      setLoading(false)
    }
  }, [subjects, hobbies, skills, freeText, allInterests, onResults])

  const clearAll = () => {
    setSubjects([]); setHobbies([]); setSkills([]); setFreeText('')
    storage.set('ci-subjects', []); storage.set('ci-hobbies', [])
    storage.set('ci-skills',   []); storage.set('ci-free', '')
    onResults([], null)
  }

  const hasSelections = totalSelected > 0

  return (
    <form className="interests-form" onSubmit={handleSubmit} noValidate aria-label="Choose what you want to work in">
      <p className="interests-form__intro">
        Tap anything that sounds like you, or type your own in the box at the bottom. There are no right or wrong answers.
      </p>

      <div className="interests-groups">
        <ChoiceGroup
          id="grp-subjects"
          title="Subjects you enjoyed at school"
          hint="Even the ones you just did not mind count."
          presets={SUBJECT_PRESETS}
          selected={subjects}
          onToggle={toggle(setSubjects, 'ci-subjects')}
        />
        <ChoiceGroup
          id="grp-hobbies"
          title="Hobbies and how you spend your time"
          hint="The things you do because you want to."
          presets={HOBBY_PRESETS}
          selected={hobbies}
          onToggle={toggle(setHobbies, 'ci-hobbies')}
        />
        <ChoiceGroup
          id="grp-skills"
          title="Skills and strengths others notice in you"
          hint="What teammates and coaches say you are good at."
          presets={SKILL_PRESETS}
          selected={skills}
          onToggle={toggle(setSkills, 'ci-skills')}
        />
      </div>

      <div className="interests-free glass glass--quiet glass--pad">
        <label htmlFor="ci-free" className="interests-free__label">
          Anything else? Type your own, separated by commas
        </label>
        <textarea
          id="ci-free"
          className="interests-free__textarea"
          value={freeText}
          onChange={e => setFreeText(e.target.value)}
          placeholder="e.g. I love organising things, I am good under pressure, I want to work outdoors"
          rows={3}
        />
      </div>

      {notice && (
        <p className="interests-notice" role="status">{notice}</p>
      )}

      {/* Sticky summary bar: clear count and the obvious primary action */}
      <div className="interests-summary" role="region" aria-label="Your selections">
        <p className="interests-summary__count" aria-live="polite">
          {hasSelections
            ? <><strong>{totalSelected}</strong> {totalSelected === 1 ? 'thing' : 'things'} chosen</>
            : 'Choose at least one to get started'}
        </p>
        <div className="interests-summary__actions">
          {hasSelections && (
            <button type="button" className="interests-btn interests-btn--ghost" onClick={clearAll}>
              Clear all
            </button>
          )}
          <button
            type="submit"
            className="interests-btn interests-btn--primary"
            disabled={!hasSelections || loading}
            aria-busy={loading}
          >
            {loading ? 'Finding careers' : 'Show me careers that could suit me'}
            <span aria-hidden="true"> →</span>
          </button>
        </div>
      </div>
    </form>
  )
}
