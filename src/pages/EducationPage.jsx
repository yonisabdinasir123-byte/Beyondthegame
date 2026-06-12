/**
 * EducationPage.jsx — Local colleges, open days, and job fairs/events.
 *
 * HOW TO RUN:
 *   npm run dev  → http://localhost:5173/education
 *
 * API INTEGRATIONS:
 *   Colleges  → Google Places API (replace `colleges` import with async fetch)
 *   Events    → Eventbrite API (replace `jobEvents` import with async fetch)
 *   Postcode  → postcodes.io (lookupPostcode util, already wired)
 *   Distance  → haversine util (already wired — maps to Reed distanceFromLocation)
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { colleges, jobEvents, SKILL_COURSES, TRADE_ROUTES } from '../data/educationData'
import { lookupPostcode, DEFAULT_COORDS } from '../utils/distance'
import { storage, formatDate } from '../utils/storage'
import SiteLayout    from '../components/SiteLayout'
import CollegeSearch from '../components/education/CollegeSearch'
import EventsList    from '../components/education/EventsList'
import QualsMatcher  from '../components/education/QualsMatcher'
import { GoalProgress } from '../components/GoalSystem'
import PromptCard    from '../components/PromptCard'
import { getGoal, notifyProgress } from '../utils/goal'
import { useMagnetic, useSpotlight } from '../App.jsx'
import './EducationPage.css'

// ─── Macro hero — one focal point, one amber CTA ─────────────────────────────
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
        {/* Gestalt: focal point — largest type, top-left F-pattern zone */}
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

const NAV_SECTIONS = [
  { id: 'matcher',  label: '🎯 What Can I Study?', title: 'What Can I Study?'        },
  { id: 'colleges', label: '🏫 Colleges',          title: 'Local Colleges & Open Days' },
  { id: 'skills',   label: '💻 Learn a Skill',     title: 'Learn a Skill'            },
  { id: 'trades',   label: '🔧 Learn a Trade',     title: 'Learn a Trade'            },
  { id: 'events',   label: '🗓️ Events',            title: 'Job Fairs & Events'        },
]

// Cumulative sticky-bar height: navbar (64px) + this sub-nav (~54px).
const STICKY_OFFSET = 120

function SectionNav({ activeId }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (!el) return
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - STICKY_OFFSET, behavior: 'smooth' })
  }
  return (
    <nav className="edu-section-nav" aria-label="Education sections">
      <div className="edu-section-nav__inner">
        {NAV_SECTIONS.map(s => (
          <button
            key={s.id}
            type="button"
            className={`edu-nav-tab${activeId === s.id ? ' edu-nav-tab--active' : ''}`}
            onClick={() => scrollTo(s.id)}
            aria-pressed={activeId === s.id}
          >
            {s.label}
          </button>
        ))}
      </div>
    </nav>
  )
}

function PostcodeBar({ onCoords }) {
  const [postcode, setPostcode] = useState(() => storage.get('user-postcode', ''))
  const [status,   setStatus]   = useState(postcode ? 'saved' : 'idle') // idle|loading|saved|error

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!postcode.trim()) return
    setStatus('loading')
    const coords = await lookupPostcode(postcode)
    if (coords) {
      storage.set('user-postcode',  postcode.trim().toUpperCase())
      storage.set('user-coords',    coords)
      onCoords(coords)
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
      {status === 'error' && <p className="form-error" role="alert">Couldn't find that postcode — check it and try again.</p>}
      <p className="edu-postcode-note">We use this only to calculate distances. No account or sign-in needed.</p>
    </form>
  )
}

function Section({ id, title, children }) {
  return (
    <section id={id} className="edu-section" aria-labelledby={`${id}-heading`}>
      <div className="edu-section__inner">
        <h2 id={`${id}-heading`} className="edu-section__title">{title}</h2>
        {children}
      </div>
    </section>
  )
}

export default function EducationPage() {
  const [activeId,    setActiveId]    = useState('matcher')
  const [userCoords,  setUserCoords]  = useState(() => storage.get('user-coords', null))
  const [savedDays,   setSavedDays]   = useState(() => storage.get('saved-opendays', []))
  const observerRef = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && e.intersectionRatio >= 0.2) setActiveId(e.target.id)
      })
      // rootMargin top must clear BOTH sticky bars (navbar + sub-nav ≈ 118px)
      // so the active tab reflects the section actually visible below them.
    }, { rootMargin: '-114px 0px -40% 0px', threshold: [0.2, 0.5] })
    NAV_SECTIONS.forEach(s => {
      const el = document.getElementById(s.id)
      if (el) obs.observe(el)
    })
    observerRef.current = obs
    return () => obs.disconnect()
  }, [])

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
      {/* motion: page entrance — fade + rise, never a hard cut */}
      <div className="edu-page-enter">
      <SectionNav activeId={activeId} />

      <EduHero
          onCheckOptions={() => {
            const el = document.getElementById('matcher')
            if (!el) return
            const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
            el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
          }}
        />

        <div className="edu-section__inner edu-postcode-wrap">
          <PostcodeBar onCoords={setUserCoords} />
        </div>

        {/* Goal gradient: progress visible wherever the work happens */}
        <div className="goal-progress-wrap">
          <GoalProgress />
        </div>

        {savedDays.length > 0 && (
          <div className="edu-saved-bar">
            <div className="edu-section__inner">
              <p className="edu-saved-bar__text">
                📅 You've saved <strong>{savedDays.length}</strong> open day{savedDays.length !== 1 ? 's' : ''}.
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
                    <span className="edu-saved-item__date">{formatDate(s.openDayDate)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <Section id="matcher" title="What Can I Study?">
          <p className="edu-section__desc">
            Enter the qualifications you already have. We'll show what you can
            study now, and what to work toward — with honest entry requirements.
          </p>
          <QualsMatcher />
        </Section>

        <Section id="colleges" title="Local Colleges & Open Days">
          <p className="edu-section__desc">
            Search by name, area, or course. Results update live as you type.
            {/* Prospect: gain framing — "easy to find" not "don't miss" */}
            Filter by distance and save open days so they're easy to find later.
          </p>
          <CollegeSearch
            colleges={colleges}
            userCoords={userCoords ?? DEFAULT_COORDS}
            onSaveOpenDay={handleSaveOpenDay}
          />
        </Section>

        <Section id="skills" title="Learn a Skill">
          <p className="edu-section__desc">
            Free online certificates that lead to real, well-paid jobs — no
            university needed. With self-discipline, these open doors fast.
          </p>
          <div className="edu-skill-grid">
            {SKILL_COURSES.map(c => (
              <article key={c.id} className="edu-skill-card">
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
              </article>
            ))}
          </div>
        </Section>

        <Section id="trades" title="Learn a Trade">
          <p className="edu-section__desc">
            Practical trades you can train into through paid apprenticeships —
            earn while you learn, with no student debt.
          </p>
          {/* Fogg: signal — goal-matched direction to the action below */}
          {getGoal()?.id === 'learn-trade' && (
            <PromptCard type="signal">
              Your goal: 🔧 Learn a Trade. Every route below pays you while
              you train. Pick one and follow its link to apply.
            </PromptCard>
          )}
          <div className="edu-trade-grid">
            {TRADE_ROUTES.map(t => (
              <article key={t.id} className="edu-trade-card">
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
              </article>
            ))}
          </div>
          <div className="edu-enrol-steps">
            <h3 className="edu-enrol-steps__title">How to enrol at college</h3>
            <ol className="edu-enrol-steps__list">
              <li>Find your local college and check open day dates (above).</li>
              <li>Apply online via the college site — usually open from autumn.</li>
              <li>Bring your GCSE results to enrolment in late August.</li>
              <li>Not got the grades? Ask about resits and Level 2 routes — they'll help you find a place.</li>
            </ol>
          </div>
        </Section>

        <Section id="events" title="Job Fairs & Careers Events">
          <p className="edu-section__desc">
            Upcoming events near you — job fairs, recruitment days, and careers talks.
            Free to attend unless stated otherwise.
          </p>
          <EventsList events={jobEvents} userCoords={userCoords ?? DEFAULT_COORDS} />
        </Section>
      </div>
    </SiteLayout>
  )
}
