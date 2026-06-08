/**
 * PathwayPage.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW TO RUN
 *   npm run dev → visit http://localhost:5173/pathway
 *
 * WHERE TO PLUG IN A REAL API
 *   Replace the imported arrays from pathwayData.js with async loaders:
 *     import { fetchClubs, fetchShowcases, ... } from '../data/pathwayApi'
 *   Then load in useEffect / React Query / SWR and pass the data as props.
 *
 * AI CV BUILDER
 *   Requires VITE_ANTHROPIC_API_KEY in .env — see AICVBuilder.jsx for details.
 */

import { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'

import { clubs, showcaseGames, tournaments, leagues, testimonials } from '../data/pathwayData'

import SearchBar         from '../components/pathway/SearchBar'
import FilterPanel       from '../components/pathway/FilterPanel'
import ClubResults       from '../components/pathway/ClubResults'
import ShowcaseGames     from '../components/pathway/ShowcaseGames'
import Tournaments       from '../components/pathway/Tournaments'
import CompatibleLeagues from '../components/pathway/CompatibleLeagues'
import AICVBuilder       from '../components/pathway/AICVBuilder'
import SuccessStories    from '../components/pathway/SuccessStories'

import './PathwayPage.css'

// ─── Section nav config ────────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'pyramid',    label: '🪜 The Pyramid' },
  { id: 'clubs',      label: '⚽ Clubs'       },
  { id: 'showcases',  label: '🔍 Showcases'   },
  { id: 'tournaments',label: '🏆 Tournaments' },
  { id: 'leagues',    label: '📋 Leagues'     },
  { id: 'cv-builder', label: '📄 AI CV'       },
  { id: 'stories',    label: '💬 Stories'     },
]

// ─── Animated stat counter — counts up when scrolled into view ─────────────────
function usePyramidCounters(rootRef) {
  useEffect(() => {
    const root = rootRef.current
    if (!root || typeof IntersectionObserver === 'undefined') return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const els = root.querySelectorAll('[data-target]')

    if (reduce) {
      els.forEach(el => {
        const t = parseInt(el.dataset.target || '0', 10)
        if (t) el.textContent = t.toLocaleString('en-GB') + (el.dataset.suffix || '')
      })
      return
    }

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        const el = entry.target
        const target = parseInt(el.dataset.target || '0', 10)
        const suffix = el.dataset.suffix || ''
        if (!target) return
        obs.unobserve(el)
        const duration = 1600
        let startTime = null
        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4)
        const step = (ts) => {
          if (!startTime) startTime = ts
          const progress = Math.min((ts - startTime) / duration, 1)
          el.textContent = Math.round(easeOutQuart(progress) * target).toLocaleString('en-GB') + suffix
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      })
    }, { threshold: 0.5 })

    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [rootRef])
}

// ─── The Pyramid — non-league → professional ladder (moved from Academy page) ──
function PyramidSection() {
  const ref = useRef(null)
  usePyramidCounters(ref)

  return (
    <section id="pyramid" className="pwy-pyramid" ref={ref} aria-labelledby="pyramid-heading">
      <div className="pwy-pyramid__inner">
        <span className="pwy-pyramid__eyebrow">The route up</span>
        <h2 className="pwy-pyramid__title" id="pyramid-heading">
          Non-League to <em>Professional</em>
        </h2>
        <p className="pwy-pyramid__lead">
          The English football pyramid has more than 24 levels. Professional football
          is at the top — but there are routes all the way up, and real players use
          them every season.
        </p>

        {/* Stat counters */}
        <div className="pwy-pyramid__stats" aria-label="Pyramid statistics">
          <div className="pwy-pyr-stat">
            <span className="pwy-pyr-stat__num" data-target="10000">10,000</span>
            <span className="pwy-pyr-stat__label">boys in UK academies at any one time</span>
          </div>
          <div className="pwy-pyr-stat">
            <span className="pwy-pyr-stat__num">&lt;200</span>
            <span className="pwy-pyr-stat__label">turn professional each year</span>
          </div>
          <div className="pwy-pyr-stat">
            <span className="pwy-pyr-stat__num" data-target="5" data-suffix="">5</span>
            <span className="pwy-pyr-stat__label">divisions · Jake Tabor&rsquo;s leap from non-league to Swindon Town</span>
          </div>
        </div>

        <div className="pwy-pyramid__layout">
          {/* Ladder */}
          <div className="pwy-pyr-steps" role="list" aria-label="Football pyramid steps">

            <div className="pwy-pyr-step" role="listitem">
              <span className="pwy-pyr-step__level">Step 5</span>
              <div className="pwy-pyr-step__bar pwy-pyr-step__bar--s5" />
              <div className="pwy-pyr-step__info">
                <div className="pwy-pyr-step__name">Combined Counties / Regional Step 5</div>
                <div className="pwy-pyr-step__detail">Where Jake Tabor scored 127 goals in 91 games at Amersham Town</div>
              </div>
              <div className="pwy-pyr-step__badge">Tabor starts here</div>
            </div>

            <div className="pwy-pyr-step" role="listitem">
              <span className="pwy-pyr-step__level">Step 4</span>
              <div className="pwy-pyr-step__bar pwy-pyr-step__bar--s4" />
              <div className="pwy-pyr-step__info">
                <div className="pwy-pyr-step__name">Southern / Northern / Isthmian Premier</div>
                <div className="pwy-pyr-step__detail">Scouts increasingly active at this level. Semi-professional wages begin.</div>
              </div>
            </div>

            <div className="pwy-pyr-step" role="listitem">
              <span className="pwy-pyr-step__level">Step 3</span>
              <div className="pwy-pyr-step__bar pwy-pyr-step__bar--s3" />
              <div className="pwy-pyr-step__info">
                <div className="pwy-pyr-step__name">Division One South/North</div>
                <div className="pwy-pyr-step__detail">Full-time or near-full-time football. Regular TV and streaming coverage begins.</div>
              </div>
            </div>

            <div className="pwy-pyr-step pwy-pyr-step--highlight" role="listitem">
              <span className="pwy-pyr-step__level">Step 2</span>
              <div className="pwy-pyr-step__bar pwy-pyr-step__bar--s2" />
              <div className="pwy-pyr-step__info">
                <div className="pwy-pyr-step__name">National League North/South</div>
                <div className="pwy-pyr-step__detail">Joshua Osude: Bishop&rsquo;s Stortford → Hashtag United → Woking → Forest Green Rovers 2026</div>
              </div>
              <div className="pwy-pyr-step__badge">Osude route</div>
            </div>

            <div className="pwy-pyr-step pwy-pyr-step--highlight" role="listitem">
              <span className="pwy-pyr-step__level">Step 1</span>
              <div className="pwy-pyr-step__bar pwy-pyr-step__bar--s1" />
              <div className="pwy-pyr-step__info">
                <div className="pwy-pyr-step__name">National League</div>
                <div className="pwy-pyr-step__detail">92nd league club just one promotion away. Jamie Vardy played at Step 4 age 23.</div>
              </div>
              <div className="pwy-pyr-step__badge pwy-pyr-step__badge--amber">Hot zone</div>
            </div>

            <div className="pwy-pyr-step" role="listitem">
              <span className="pwy-pyr-step__level">EFL</span>
              <div className="pwy-pyr-step__bar pwy-pyr-step__bar--prem" />
              <div className="pwy-pyr-step__info">
                <div className="pwy-pyr-step__name">EFL League Two → Championship → Premier League</div>
                <div className="pwy-pyr-step__detail">Jake Tabor signed his first professional contract with Swindon Town (League One) in 2025 — a five-division leap.</div>
              </div>
              <div className="pwy-pyr-step__badge pwy-pyr-step__badge--white">Pro football</div>
            </div>

          </div>

          {/* Callouts */}
          <div className="pwy-pyr-aside">
            <div className="pwy-pyr-callout">
              <div className="pwy-pyr-callout__title">Jake Tabor&rsquo;s story</div>
              <div className="pwy-pyr-callout__body">
                Wycombe Wanderers told Jake Tabor he wasn&rsquo;t good enough. He dropped to Step 5 and proved them wrong — <strong>127 goals in 91 games</strong> for Amersham Town in the Combined Counties League. In 2025, Swindon Town signed him to his first professional contract, leaping five divisions in a single move.<br /><br />
                Tabor didn&rsquo;t wait for a club to believe in him. He went and made it impossible for them not to.
              </div>
            </div>

            <div className="pwy-pyr-keystat">
              <div className="pwy-pyr-keystat__num">127</div>
              <div className="pwy-pyr-keystat__text">goals in 91 non-league games for Jake Tabor — the form that earned his professional contract</div>
            </div>

            <div className="pwy-pyr-keystat">
              <div className="pwy-pyr-keystat__num">23</div>
              <div className="pwy-pyr-keystat__text">the age Jamie Vardy was playing non-league football at Stocksbridge Park Steels, Step 4, before going on to win the Premier League with Leicester City</div>
            </div>

            <div className="pwy-pyr-scout">
              <p><strong>What scouts look for:</strong> consistency, goals or assists per 90, professionalism, and a player who performs under pressure week in, week out — regardless of the level. High stats at Step 5 do get noticed.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Section navigation ────────────────────────────────────────────────────────
function SectionNav({ activeSection }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (!el) return
    const offset = 120 // height of both sticky bars
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <nav className="section-nav" aria-label="Jump to section">
      {SECTIONS.map(s => (
        <button
          key={s.id}
          type="button"
          className={`section-nav__btn${activeSection === s.id ? ' active' : ''}`}
          onClick={() => scrollTo(s.id)}
          aria-current={activeSection === s.id ? 'page' : undefined}
        >
          {s.label}
        </button>
      ))}
    </nav>
  )
}

// ─── Page header ───────────────────────────────────────────────────────────────
function PageHeader() {
  return (
    <header className="pwy-header">
      <div className="pwy-header__inner">
        <Link to="/" className="pwy-header__back">
          ← Beyond the Game
        </Link>
        <div className="pwy-header__logo">
          <span aria-hidden="true">⚽</span> Pathway Finder
        </div>
        <div className="pwy-header__auth">
          <Link to="/" className="pwy-header__auth-btn">Home</Link>
        </div>
      </div>
    </header>
  )
}

// ─── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <div className="pwy-hero">
      <div className="pwy-hero__inner">
        <h1 className="pwy-hero__title">Find your football pathway</h1>
        <p className="pwy-hero__subtitle">
          Search clubs, discover showcases, enter tournaments, find your league,
          build a professional CV, and read stories from players who made it happen.
        </p>
      </div>
    </div>
  )
}

// ─── Section wrapper ───────────────────────────────────────────────────────────
function PwySection({ id, eyebrow, title, subtitle, children }) {
  return (
    <section id={id} className="pwy-section">
      <div className="pwy-section__inner">
        <div className="pwy-section__header">
          <span className="pwy-section__eyebrow">{eyebrow}</span>
          <h2 className="pwy-section__title">{title}</h2>
          {subtitle && <p className="pwy-section__subtitle">{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function PathwayPage() {
  // ── Club search + filter state ────────────────────────────────────────────
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    position: '',
    ageGroup: '',
    tier:     '',
    region:   '',
  })

  const handleFilterChange = (key, value) =>
    setFilters(f => ({ ...f, [key]: value }))

  const handleFilterReset = () =>
    setFilters({ position: '', ageGroup: '', tier: '', region: '' })

  const filteredClubs = useMemo(() => {
    return clubs.filter(club => {
      const q = search.toLowerCase().trim()
      const matchSearch =
        !q ||
        club.name.toLowerCase().includes(q) ||
        club.location.toLowerCase().includes(q) ||
        club.region.toLowerCase().includes(q) ||
        club.positions.some(p => p.toLowerCase().includes(q))

      const matchPos    = !filters.position || club.positions.includes(filters.position)
      const matchAge    = !filters.ageGroup || club.ageGroups.includes(filters.ageGroup)
      const matchTier   = !filters.tier     || club.tier     === filters.tier
      const matchRegion = !filters.region   || club.region   === filters.region

      return matchSearch && matchPos && matchAge && matchTier && matchRegion
    })
  }, [search, filters])

  // ── Active section tracking (IntersectionObserver) ────────────────────────
  const [activeSection, setActiveSection] = useState('pyramid')
  const observerRef = useRef(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      entries => {
        // Pick the section with the largest intersection ratio
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible.length > 0) setActiveSection(visible[0].target.id)
      },
      { threshold: [0.2, 0.5], rootMargin: '-60px 0px -40% 0px' },
    )
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observerRef.current.observe(el)
    })
    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <div className="pathway-page">
      <PageHeader />
      <Hero />
      <SectionNav activeSection={activeSection} />

      {/* ── 0. The Pyramid ─────────────────────────────────────────────────── */}
      <PyramidSection />

      {/* ── 1. Club Finder ─────────────────────────────────────────────────── */}
      <PwySection
        id="clubs"
        eyebrow="Club Finder"
        title="Clubs actively recruiting"
        subtitle="Search by name, location, or position. Filters update results instantly."
      >
        <SearchBar value={search} onChange={setSearch} />
        <FilterPanel
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleFilterReset}
          resultCount={filteredClubs.length}
        />
        <ClubResults clubs={filteredClubs} />
      </PwySection>

      {/* ── 2. Showcase Games ───────────────────────────────────────────────── */}
      <PwySection
        id="showcases"
        eyebrow="Showcase Games"
        title="Upcoming showcase & trial events"
        subtitle="Scout-attended events across the country. Register your interest to secure your spot."
      >
        <ShowcaseGames games={showcaseGames} />
      </PwySection>

      {/* ── 3. Tournaments ─────────────────────────────────────────────────── */}
      <PwySection
        id="tournaments"
        eyebrow="Tournaments"
        title="Local tournaments &amp; cups"
        subtitle="Enter as a team or as an individual. Compete, get seen, and enjoy your football."
      >
        <Tournaments tournaments={tournaments} />
      </PwySection>

      {/* ── 4. Compatible Leagues ───────────────────────────────────────────── */}
      <PwySection
        id="leagues"
        eyebrow="Compatible Leagues"
        title="Find the right league for your level"
        subtitle="Filter by level and region to discover leagues that match where you are right now."
      >
        <CompatibleLeagues leagues={leagues} />
      </PwySection>

      {/* ── 5. AI CV Builder ────────────────────────────────────────────────── */}
      <PwySection
        id="cv-builder"
        eyebrow="AI CV Builder"
        title="Build your football CV in seconds"
        subtitle="Fill in your details and our AI writes a polished, professional football CV you can copy and send straight to clubs."
      >
        <AICVBuilder />
      </PwySection>

      {/* ── 6. Success Stories ──────────────────────────────────────────────── */}
      <PwySection
        id="stories"
        eyebrow="Success Stories"
        title="Players who found their pathway"
        subtitle="Real journeys from grassroots to the professional game — and everywhere in between."
      >
        <SuccessStories stories={testimonials} />
      </PwySection>

      {/* Footer */}
      <footer className="pwy-footer">
        <div className="pwy-footer__inner">
          <span>⚽ Beyond the Game · Pathway Finder</span>
          <Link to="/" className="pwy-footer__link">← Back to support home</Link>
        </div>
      </footer>
    </div>
  )
}
