import { useState, useEffect, useRef } from 'react'
import SiteLayout        from '../components/SiteLayout'
import InterestsForm     from '../components/careers/InterestsForm'
import CareerResults     from '../components/careers/CareerResults'
import JobAdverts        from '../components/employability/JobAdverts'
import NetworkingTracker from '../components/checklist/NetworkingTracker'
import { jobAdverts }    from '../data/educationData'
import { storage }       from '../utils/storage'
import { DEFAULT_COORDS } from '../utils/distance'
import './JobsCareersPage.css'

const SECTIONS = [
  { id: 'career-explorer', label: '🌟 Career Explorer' },
  { id: 'jobs',            label: '💼 Job Listings'   },
  { id: 'networking',      label: '🤝 Networking'      },
]

function SectionNav({ activeId }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (!el) return
    const offset = 64 + 52
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' })
  }
  return (
    <nav className="jc-section-nav" aria-label="Jobs & Careers sections">
      <div className="jc-section-nav__inner">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            type="button"
            className={`jc-nav-tab${activeId === s.id ? ' jc-nav-tab--active' : ''}`}
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

export default function JobsCareersPage() {
  const [userCoords]     = useState(() => storage.get('user-coords', DEFAULT_COORDS))
  const [ruleMatches,    setRuleMatches]    = useState([])
  const [aiSuggestions,  setAiSuggestions]  = useState(null)
  const [hasSearched,    setHasSearched]    = useState(false)
  const [activeId,       setActiveId]       = useState('career-explorer')
  const observerRef = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting && e.intersectionRatio >= 0.2) setActiveId(e.target.id)
        })
      },
      { rootMargin: '-64px 0px -40% 0px', threshold: [0.2, 0.5] },
    )
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    observerRef.current = obs
    return () => obs.disconnect()
  }, [])

  const handleResults = (rules, ai) => {
    setRuleMatches(rules)
    setAiSuggestions(ai)
    setHasSearched(true)
    setTimeout(() => {
      const el = document.getElementById('career-results-anchor')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <SiteLayout>
      <div className="jc-page">

        {/* Hero */}
        <div className="jc-hero">
          <div className="jc-hero__inner">
            <span className="jc-hero__eyebrow">Jobs &amp; Careers</span>
            <h1 className="jc-hero__title">Find what you're good at — and get paid for it</h1>
            <p className="jc-hero__sub">
              Discover careers that match your interests, browse live job listings, and track your networking contacts — all in one place.
            </p>
          </div>
        </div>

        <SectionNav activeId={activeId} />

        {/* ── Career Explorer ─────────────────────────────────────────────── */}
        <section id="career-explorer" className="jc-section" aria-labelledby="ce-heading">
          <div className="jc-section__inner">
            <div className="jc-section__header">
              <span className="jc-section__eyebrow">Career Explorer</span>
              <h2 className="jc-section__title" id="ce-heading">What could you be good at?</h2>
              <p className="jc-section__desc">
                Tell us what you're into — subjects, hobbies, skills — and we'll suggest realistic careers worth exploring.
              </p>
            </div>
            <InterestsForm onResults={handleResults} />
            <div id="career-results-anchor" tabIndex={-1} style={{ outline: 'none' }} />
            {hasSearched && (
              <div className="jc-results-wrap">
                <CareerResults ruleMatches={ruleMatches} aiSuggestions={aiSuggestions} />
              </div>
            )}
          </div>
        </section>

        {/* ── Job Listings ────────────────────────────────────────────────── */}
        <section id="jobs" className="jc-section jc-section--alt" aria-labelledby="jobs-heading">
          <div className="jc-section__inner">
            <div className="jc-section__header">
              <span className="jc-section__eyebrow">Live Jobs</span>
              <h2 className="jc-section__title" id="jobs-heading">Jobs near you</h2>
              <p className="jc-section__desc">
                Real roles across coaching, construction, security, health care, logistics, and retail. Filter by field and distance.
              </p>
              <div className="jc-reed-note" role="note">
                <strong>📡 Live data note:</strong> These are seed/demo records. When wired to the Reed API, this page will show real live vacancies filtered by your location.
              </div>
            </div>
            <JobAdverts adverts={jobAdverts} userCoords={userCoords} />
          </div>
        </section>

        {/* ── Networking Tracker ──────────────────────────────────────────── */}
        <section id="networking" className="jc-section" aria-labelledby="net-heading">
          <div className="jc-section__inner">
            <div className="jc-section__header">
              <span className="jc-section__eyebrow">Networking Tracker</span>
              <h2 className="jc-section__title" id="net-heading">Track your contacts</h2>
              <p className="jc-section__desc">
                Keep track of everyone you've reached out to — coaches, employers, clubs. Small conversations lead to big opportunities.
              </p>
            </div>
            <NetworkingTracker />
          </div>
        </section>

      </div>
    </SiteLayout>
  )
}
