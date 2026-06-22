/**
 * QualsMatcher.jsx, "What Can I Study?"
 * ─────────────────────────────────────────────────────────────────────────────
 * A client-side qualifications matcher. The user enters what they already have,
 * and we evaluate every opportunity in QUAL_OPPORTUNITIES against that profile
 * to show matched cards grouped by category, each with an honest difficulty
 * badge (EASY ENTRY / ACHIEVABLE / HIGHER ENTRY).
 *
 * No backend: all logic is in educationData.js `evaluate()` functions, and the
 * user's input persists in localStorage (key `btg:quals-profile`) so it's
 * remembered between visits.
 */
import { useState } from 'react'
import { QUAL_OPPORTUNITIES, QUAL_CATEGORY_ORDER } from '../../data/educationData'
import { storage } from '../../utils/storage'
import { notifyProgress } from '../../utils/goal'
import './QualsMatcher.css'

const EMPTY_PROFILE = {
  gcseCount: 0,
  gcseGrades: '',
  passedMaths: false,
  passedEnglish: false,
  btecLevel: '',
  hasALevels: false,
  otherQuals: '',
  retake: '',
}

// Human-readable badge text + class suffix for each difficulty tier.
const BADGE = {
  easy:       { label: 'EASY ENTRY',   cls: 'easy'   },
  achievable: { label: 'ACHIEVABLE',   cls: 'achievable' },
  higher:     { label: 'HIGHER ENTRY', cls: 'higher' },
}

export default function QualsMatcher() {
  // Load any saved profile so returning users see their results immediately.
  const [profile, setProfile] = useState(() => ({ ...EMPTY_PROFILE, ...storage.get('quals-profile', {}) }))
  const [submitted, setSubmitted] = useState(() => !!storage.get('quals-profile', null))

  const update = (key, value) => setProfile(p => ({ ...p, [key]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    storage.set('quals-profile', profile)
    notifyProgress() /* milestone signal: qualifications entered */
    setSubmitted(true)
  }

  const handleReset = () => {
    storage.remove('quals-profile')
    setProfile(EMPTY_PROFILE)
    setSubmitted(false)
  }

  // Evaluate every opportunity, then group the results by category for display.
  const results = QUAL_OPPORTUNITIES.map(o => ({ ...o, ...o.evaluate(profile) }))
  const grouped = QUAL_CATEGORY_ORDER.map(cat => ({
    category: cat,
    items: results.filter(r => r.category === cat),
  }))

  return (
    <div className="qm">
      <form className="qm-form" onSubmit={handleSubmit} aria-label="Enter your qualifications">
        <p className="qm-form__intro">
          Tell us what you have now. We'll instantly show what you can study,           and what to work toward. Nothing is shared; it's saved only on your device.
        </p>

        <div className="qm-grid">
          {/* GCSE count */}
          <div className="qm-field">
            <label htmlFor="qm-gcse-count" className="qm-label">How many GCSEs do you have?</label>
            <input
              id="qm-gcse-count"
              type="number"
              min="0"
              max="12"
              inputMode="numeric"
              className="qm-input"
              value={profile.gcseCount || ''}
              onChange={e => update('gcseCount', Number(e.target.value) || 0)}
              placeholder="e.g. 5"
            />
          </div>

          {/* GCSE grades */}
          <div className="qm-field">
            <label htmlFor="qm-gcse-grades" className="qm-label">What grades? (roughly)</label>
            <input
              id="qm-gcse-grades"
              type="text"
              className="qm-input"
              value={profile.gcseGrades}
              onChange={e => update('gcseGrades', e.target.value)}
              placeholder="e.g. 4 to 6"
            />
          </div>

          {/* Maths / English passes, grade 4 = pass */}
          <fieldset className="qm-field qm-field--checks">
            <legend className="qm-label">Did you pass these at grade 4+?</legend>
            <label className="qm-check">
              <input
                type="checkbox"
                checked={profile.passedMaths}
                onChange={e => update('passedMaths', e.target.checked)}
              />
              <span>Maths (grade 4+)</span>
            </label>
            <label className="qm-check">
              <input
                type="checkbox"
                checked={profile.passedEnglish}
                onChange={e => update('passedEnglish', e.target.checked)}
              />
              <span>English (grade 4+)</span>
            </label>
          </fieldset>

          {/* BTEC level */}
          <div className="qm-field">
            <label htmlFor="qm-btec" className="qm-label">Any BTEC? Which level?</label>
            <select
              id="qm-btec"
              className="qm-input"
              value={profile.btecLevel}
              onChange={e => update('btecLevel', e.target.value)}
            >
              <option value="">None</option>
              <option value="1">BTEC Level 1</option>
              <option value="2">BTEC Level 2</option>
              <option value="3">BTEC Level 3</option>
            </select>
          </div>

          {/* A-Levels */}
          <fieldset className="qm-field qm-field--checks">
            <legend className="qm-label">A-Levels?</legend>
            <label className="qm-check">
              <input
                type="checkbox"
                checked={profile.hasALevels}
                onChange={e => update('hasALevels', e.target.checked)}
              />
              <span>I have one or more A-Levels</span>
            </label>
          </fieldset>

          {/* Other quals */}
          <div className="qm-field">
            <label htmlFor="qm-other" className="qm-label">Any other qualifications?</label>
            <input
              id="qm-other"
              type="text"
              className="qm-input"
              value={profile.otherQuals}
              onChange={e => update('otherQuals', e.target.value)}
              placeholder="e.g. First Aid, coaching badge"
            />
          </div>

          {/* Retake / improve */}
          <div className="qm-field qm-field--wide">
            <label htmlFor="qm-retake" className="qm-label">Anything you'd like to retake or improve?</label>
            <input
              id="qm-retake"
              type="text"
              className="qm-input"
              value={profile.retake}
              onChange={e => update('retake', e.target.value)}
              placeholder="e.g. retake Maths and English"
            />
          </div>
        </div>

        <div className="qm-actions">
          <button type="submit" className="qm-btn qm-btn--primary">Show what I can study →</button>
          {submitted && (
            <button type="button" className="qm-btn qm-btn--ghost" onClick={handleReset}>Clear</button>
          )}
        </div>
      </form>

      {submitted && (
        <div className="qm-results" aria-live="polite">
          <h3 className="qm-results__title">Your matched options</h3>
          {profile.retake.trim() && (
            <p className="qm-results__retake">
              👍 Great that you want to improve <strong>{profile.retake.trim()}</strong>,               colleges let you resit Maths &amp; English for free while you study.
            </p>
          )}

          {grouped.map(group => (
            <section key={group.category} className="qm-cat">
              <h4 className="qm-cat__title">{group.category}</h4>
              <div className="qm-cards">
                {group.items.map(item => {
                  const badge = BADGE[item.difficulty]
                  return (
                    <article
                      key={item.id}
                      className={`qm-card qm-card--${badge.cls}${item.eligible ? ' qm-card--eligible' : ''}`}
                    >
                      <div className="qm-card__head">
                        <span className={`qm-badge qm-badge--${badge.cls}`}>{badge.label}</span>
                        {item.eligible
                          ? <span className="qm-card__tick" aria-label="You qualify">✓ You qualify</span>
                          : <span className="qm-card__work">Work toward this</span>}
                      </div>
                      <h5 className="qm-card__title">{item.title}</h5>
                      <p className="qm-card__min"><strong>Min:</strong> {item.minReq}</p>
                      <p className="qm-card__body">{item.body}</p>
                      {item.perks && <p className="qm-card__perks">{item.perks}</p>}
                      <p className="qm-card__status">{item.statusNote}</p>
                      {item.link && (
                        <a
                          className="qm-card__link"
                          href={item.link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.link.label} ↗
                        </a>
                      )}
                    </article>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
