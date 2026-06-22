/**
 * EducationPage.jsx: Local colleges, open days, and job fairs/events.
 *
 * HOW TO RUN:
 *   npm run dev  -> http://localhost:5173/education
 *
 * LIVE DATA:
 *   Colleges  -> GET /api/colleges  (Google Places, server-side)
 *   Events    -> GET /api/events    (Eventbrite, server-side)
 *   Postcode  -> postcodes.io (lookupPostcode util, already wired)
 *   Distance  -> haversine util (already wired)
 */
import { useState, useEffect, useCallback } from 'react'
import { SKILL_COURSES, TRADE_ROUTES } from '../data/educationData'
import { lookupPostcode, DEFAULT_COORDS } from '../utils/distance'
import { storage } from '../utils/storage'
import SiteLayout    from '../components/SiteLayout'
import GlassCard     from '../components/GlassCard'
import FloatingSection from '../components/FloatingSection'
import CollegeSearch from '../components/education/CollegeSearch'
import EventsList    from '../components/education/EventsList'
import QualsMatcher  from '../components/education/QualsMatcher'
import { GoalProgress } from '../components/GoalSystem'
import PromptCard    from '../components/PromptCard'
import { getGoal, notifyProgress } from '../utils/goal'
import { useMagnetic, useSpotlight } from '../App.jsx'
import './EducationPage.css'

// ── Macro hero: one focal point, one amber CTA ───────────────────────────────
function EduHero({ onCheckOptions }) {
  const spotRef   = useSpotlight() /* mouse: spotlight follows pointer */
  const magnetRef = useMagnetic()  /* mouse: CTA eases toward cursor */
  return (
    /* figure-ground: dark macro ground, white headline is the figure.
       SWAP: set --macro-ground to url('/img/macro-boots-books.webp') */
    <div
      className="macro-hero"
      ref={spotRef}
      style={{ '--macro-ground': 'linear-gradient(150deg, #0f1e0f 0%, #1c3320 50%, #2a1600 100%)' }}
    >
      <div className="macro-hero__inner">
        <span className="macro-hero__eyebrow">Education</span>
        {/* Gestalt: focal point, largest type, top-left F-pattern zone */}
        <h1 className="macro-hero__title">Find out what you can study.</h1>
        <p className="macro-hero__sub">Matched to the qualifications you have right now.</p>
        <span className="macro-hero__cta-wrap">
          {/* Sole amber-filled button in this viewport */}
          <button type="button" className="macro-hero__cta" onClick={onCheckOptions} ref={magnetRef}>
            Check my options →
          </button>
        </span>
        <br />
        {/* continuity: muted scroll cue */}
        <button type="button" className="macro-hero__scroll-cue" onClick={onCheckOptions}>
          <span className="macro-hero__scroll-cue-chevron" aria-hidden="true">⌄</span>
          Your qualifications open more doors than you think.
        </button>
      </div>
    </div>
  )
}

function PostcodeBar({ onCoords, onTown }) {
  const [postcode, setPostcode] = useState(() => storage.get('user-postcode', ''))
  const [status,   setStatus]   = useState(postcode ? 'saved' : 'idle') // idle|loading|saved|error

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!postcode.trim()) return
    setStatus('loading')
    const coords = await lookupPostcode(postcode)
    if (coords) {
      const clean = postcode.trim().toUpperCase()
      storage.set('user-postcode',  clean)
      storage.set('user-coords',    coords)
      onCoords(coords)
      onTown?.(clean)
      setStatus('saved')
      notifyProgress() /* milestone signal: location set */
    } else {
      setStatus('error')
    }
  }

  // Auto-resolve on mount if we have a saved postcode/coords
  useEffect(() => {
    const saved = storage.get('user-coords', null)
    if (saved) { onCoords(saved); setStatus('saved') }
    const savedPc = storage.get('user-postcode', '')
    if (savedPc) onTown?.(savedPc)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <form className="edu-postcode-bar" onSubmit={handleSubmit} aria-label="Set your location">
      <label htmlFor="edu-postcode" className="edu-postcode-label">
        📍 Your postcode (for distance filters)
      </label>
      <div className="edu-postcode-row">
        <input
          id="edu-postcode"
          type="text"
          className={`edu-input edu-postcode-input${status === 'error' ? ' edu-input--error' : ''}`}
          value={postcode}
          onChange={e => { setPostcode(e.target.value.toUpperCase()); setStatus('idle') }}
          placeholder="e.g. M1 1AE"
          maxLength={8}
          autoComplete="postal-code"
          spellCheck={false}
        />
        <button type="submit" className="edu-cta edu-cta--primary" disabled={status === 'loading'}>
          {status === 'loading' ? 'Finding…' : 'Set location'}
        </button>
        {status === 'saved' && <span className="edu-postcode-ok" aria-live="polite">✓ Location set</span>}
      </div>
      {status === 'error' && <p className="form-error" role="alert">We could not find that postcode. Check it and try again.</p>}
      <p className="edu-postcode-note">We use this only to work out distances. No account or sign-in needed.</p>
    </form>
  )
}

export default function EducationPage() {
  const [userCoords,  setUserCoords]  = useState(() => storage.get('user-coords', null))
  const [town,        setTown]        = useState(() => storage.get('user-postcode', ''))
  const [savedDays,   setSavedDays]   = useState(() => storage.get('saved-opendays', []))

  const handleSaveOpenDay = useCallback(({ collegeId, collegeName, openDayDate }) => {
    const key   = `${collegeId}_${openDayDate}`
    const entry = { id: key, openDayKey: key, collegeId, collegeName, openDayDate, savedAt: new Date().toISOString() }
    setSavedDays(prev => {
      if (prev.find(s => s.openDayKey === key)) return prev
      const next = [...prev, entry]
      storage.set('saved-opendays', next)
      notifyProgress() /* milestone signal: open day saved */
      return next
    })
  }, [])

  return (
    <SiteLayout>
      {/* motion: page entrance, fade and rise, never a hard cut */}
      <div className="edu-page-enter">
        <EduHero
          onCheckOptions={() => {
            const el = document.getElementById('matcher')
            if (!el) return
            const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
            el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
          }}
        />

        <div className="edu-shell">
          <GlassCard glow="teal" className="edu-postcode-card">
            <PostcodeBar onCoords={setUserCoords} onTown={setTown} />
          </GlassCard>

          {/* Goal gradient: progress visible wherever the work happens */}
          <div className="goal-progress-wrap">
            <GoalProgress />
          </div>

          {savedDays.length > 0 && (
            <GlassCard glow="lime" className="edu-saved-card">
              <p className="edu-saved-bar__text">
                📅 You have saved <strong>{savedDays.length}</strong> open day{savedDays.length !== 1 ? 's' : ''}.
                {' '}
                <button
                  type="button"
                  className="edu-link-btn"
                  onClick={() => { setSavedDays([]); storage.set('saved-opendays', []) }}
                >
                  Clear saved
                </button>
              </p>
              <ul className="edu-saved-list" role="list">
                {savedDays.map(s => (
                  <li key={s.openDayKey} className="edu-saved-item">
                    <span>🏫 {s.collegeName}</span>
                    <span className="edu-saved-item__date">{s.openDayDate}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          )}
        </div>

        <FloatingSection
          id="matcher"
          eyebrow="What can I study?"
          title="What can I study?"
          intro="Enter the qualifications you already have. We will show what you can study now, and what to work toward, with honest entry requirements."
        >
          <QualsMatcher />
        </FloatingSection>

        <FloatingSection
          id="colleges"
          eyebrow="Near you"
          title="Local colleges and open days"
          intro="Real colleges near your postcode, with opening hours. Filter by distance and add open-day dates so they are easy to find later."
        >
          <CollegeSearch
            userCoords={userCoords ?? DEFAULT_COORDS}
            onSaveOpenDay={handleSaveOpenDay}
          />
        </FloatingSection>

        <FloatingSection
          id="skills"
          eyebrow="Free routes"
          title="Learn a skill"
          intro="Free online certificates that lead to real, well-paid jobs, with no university needed. With self-discipline, these open doors fast."
        >
          <div className="edu-skill-grid">
            {SKILL_COURSES.map(c => (
              <GlassCard as="article" key={c.id} className="edu-skill-card">
                <div className="edu-skill-card__head">
                  <span className="edu-skill-card__field">{c.field}</span>
                  <span className="edu-skill-card__free">FREE · NO DEGREE</span>
                </div>
                <h3 className="edu-skill-card__title">{c.title}</h3>
                <p className="edu-skill-card__provider">{c.provider}</p>
                <p className="edu-skill-card__cost">{c.cost}</p>
                <p className="edu-skill-card__leads"><strong>Leads to:</strong> {c.leadsTo}</p>
                <a
                  className="edu-skill-card__link"
                  href={c.link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {c.link.label} ↗
                </a>
              </GlassCard>
            ))}
          </div>
        </FloatingSection>

        <FloatingSection
          id="trades"
          eyebrow="Earn while you learn"
          title="Learn a trade"
          intro="Practical trades you can train into through paid apprenticeships. Earn while you learn, with no student debt."
        >
          {/* Fogg: signal, goal-matched direction to the action below */}
          {getGoal()?.id === 'learn-trade' && (
            <PromptCard type="signal">
              Your goal: 🔧 Learn a Trade. Every route below pays you while
              you train. Pick one and follow its link to apply.
            </PromptCard>
          )}
          <div className="edu-trade-grid">
            {TRADE_ROUTES.map(t => (
              <GlassCard as="article" key={t.id} className="edu-trade-card">
                <span className="edu-trade-card__emoji" aria-hidden="true">{t.emoji}</span>
                <div className="edu-trade-card__body">
                  <h3 className="edu-trade-card__title">{t.trade}</h3>
                  <p className="edu-trade-card__route">{t.route}</p>
                  <p className="edu-trade-card__leads"><strong>Leads to:</strong> {t.leadsTo}</p>
                  <a
                    className="edu-trade-card__link"
                    href={t.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.link.label} ↗
                  </a>
                </div>
              </GlassCard>
            ))}
          </div>
          <div className="edu-enrol-steps">
            <h3 className="edu-enrol-steps__title">How to enrol at college</h3>
            <ol className="edu-enrol-steps__list">
              <li>Find your local college and check open-day dates (above).</li>
              <li>Apply online via the college site, usually open from autumn.</li>
              <li>Bring your GCSE results to enrolment in late August.</li>
              <li>Not got the grades? Ask about resits and Level 2 routes. They will help you find a place.</li>
            </ol>
          </div>
        </FloatingSection>

        <FloatingSection
          id="events"
          eyebrow="Get out there"
          title="Job fairs and careers events"
          intro="Upcoming job fairs and careers events near you. Free to attend unless stated otherwise."
        >
          <EventsList town={town} />
        </FloatingSection>
      </div>
    </SiteLayout>
  )
}
