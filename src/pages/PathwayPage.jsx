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
  { id: 'clubs',      label: '⚽ Clubs'       },
  { id: 'showcases',  label: '🔍 Showcases'   },
  { id: 'tournaments',label: '🏆 Tournaments' },
  { id: 'leagues',    label: '📋 Leagues'     },
  { id: 'cv-builder', label: '📄 AI CV'       },
  { id: 'stories',    label: '💬 Stories'     },
]

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
  const [activeSection, setActiveSection] = useState('clubs')
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
