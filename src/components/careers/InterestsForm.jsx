/**
 * InterestsForm.jsx — Let users enter subjects, hobbies, and skills,
 * then receive matched career suggestions from the rules dataset
 * and optionally the Anthropic API (claude-sonnet-4-20250514).
 *
 * ANTHROPIC API (optional enrichment):
 *   The API call is made server-side to protect your key.
 *   Set up a backend proxy at POST /api/career-suggest that:
 *     1. Receives { subjects, hobbies, skills, freeText }
 *     2. Calls Anthropic Messages API with claude-sonnet-4-20250514
 *     3. Returns enriched suggestions
 *   Toggle the call with the VITE_ENABLE_AI_CAREERS=true env var.
 *   Falls back gracefully to the rules dataset if the call fails.
 *
 * UK Gov Occupational Maps API (future enrichment):
 *   https://occupational-maps.skillsengland.education.gov.uk
 *   Use to enrich `needs` and `pathway` fields for each suggestion.
 */
import { useState, useCallback } from 'react'
import { storage } from '../../utils/storage'
import { SUBJECT_PRESETS, HOBBY_PRESETS, SKILL_PRESETS, careerRules } from '../../data/educationData'

function PresetPills({ presets, selected, onToggle, label }) {
  return (
    <fieldset className="careers-pills" aria-label={label}>
      <legend className="careers-pills__legend">{label}</legend>
      <div className="careers-pills__row">
        {presets.map(p => (
          <button
            key={p}
            type="button"
            className={`careers-pill${selected.includes(p) ? ' careers-pill--active' : ''}`}
            onClick={() => onToggle(p)}
            aria-pressed={selected.includes(p)}
          >
            {p}
          </button>
        ))}
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
  const [aiError,   setAiError]   = useState(null)

  const toggle = (setter, storageKey) => (val) => {
    setter(prev => {
      const next = prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]
      storage.set(storageKey, next)
      return next
    })
  }

  const allInterests = [...subjects, ...hobbies, ...skills,
    ...freeText.split(/[,\n]+/).map(s => s.trim()).filter(Boolean)]

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    storage.set('ci-free', freeText)

    // Always compute local rule matches first (instant fallback)
    const ruleMatches = matchRules(allInterests)
    onResults(ruleMatches, null)

    // OPTIONAL: Anthropic API enrichment (server-side proxy)
    // Guarded by VITE_ENABLE_AI_CAREERS env flag to avoid accidental key exposure.
    const aiEnabled = import.meta.env.VITE_ENABLE_AI_CAREERS === 'true'
    if (!aiEnabled || !allInterests.length) return

    setLoading(true)
    setAiError(null)
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
      // Graceful degradation — rule results are already shown
      setAiError('AI suggestions unavailable right now — showing results from our career database instead.')
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

  const hasSelections = subjects.length || hobbies.length || skills.length || freeText.trim()

  return (
    <form className="careers-form" onSubmit={handleSubmit} noValidate aria-label="Interests and career suggester">
      <p className="careers-form__intro">
        Pick anything that sounds like you — or type your own in the box at the bottom. There are no right or wrong answers.
      </p>

      <PresetPills
        label="Subjects you enjoyed (or didn't mind at school)"
        presets={SUBJECT_PRESETS}
        selected={subjects}
        onToggle={toggle(setSubjects, 'ci-subjects')}
      />
      <PresetPills
        label="Hobbies and things you do in your spare time"
        presets={HOBBY_PRESETS}
        selected={hobbies}
        onToggle={toggle(setHobbies, 'ci-hobbies')}
      />
      <PresetPills
        label="Skills and strengths others have noticed in you"
        presets={SKILL_PRESETS}
        selected={skills}
        onToggle={toggle(setSkills, 'ci-skills')}
      />

      <div className="form-group careers-form__free">
        <label htmlFor="ci-free" className="form-label">
          Anything else? (optional — type your own interests, comma separated)
        </label>
        <textarea
          id="ci-free"
          className="edu-input careers-form__textarea"
          value={freeText}
          onChange={e => setFreeText(e.target.value)}
          placeholder="e.g. I love organising things, I'm good under pressure, I want to work outdoors…"
          rows={3}
        />
      </div>

      {aiError && (
        <p className="careers-ai-notice" role="status">{aiError}</p>
      )}

      <div className="careers-form__actions">
        <button
          type="submit"
          className="edu-cta edu-cta--primary careers-form__submit"
          disabled={!hasSelections || loading}
          aria-busy={loading}
        >
          {loading ? 'Finding careers…' : 'Show me careers that could suit me →'}
        </button>
        {hasSelections && (
          <button type="button" className="edu-cta edu-cta--outline" onClick={clearAll}>
            Clear all
          </button>
        )}
      </div>

      {!hasSelections && (
        <p className="careers-form__hint" role="status">
          Select at least one interest or skill to get started.
        </p>
      )}
    </form>
  )
}
