import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { storage } from '../utils/storage'

import Disclaimer    from '../components/recovery/Disclaimer'
import MedicalSearch from '../components/recovery/MedicalSearch'
import GymList       from '../components/recovery/GymList'
import DailyChecklist from '../components/recovery/DailyChecklist'
import WellbeingTracker from '../components/recovery/WellbeingTracker'
import Appointments  from '../components/recovery/Appointments'
import ProgressStreaks from '../components/recovery/ProgressStreaks'
import MetricsLog    from '../components/recovery/MetricsLog'

import { medicalLocations, gyms, DEFAULT_CHECKLIST } from '../data/recoveryData'
import './RecoveryPage.css'

const NAV_SECTIONS = [
  { id: 'medical',    label: '🏥 Medical',    title: 'NHS & Medical Support'   },
  { id: 'gyms',       label: '🏋️ Gyms',        title: 'Local Gyms'              },
  { id: 'checklist',  label: '✅ Daily Plan',  title: 'Daily Recovery Checklist' },
  { id: 'wellbeing',  label: '😊 Wellbeing',   title: 'Wellbeing Tracker'        },
  { id: 'metrics',    label: '📊 Metrics',     title: 'Daily Metrics'            },
  { id: 'streaks',    label: '🔥 Streaks',     title: 'Progress Streaks'         },
  { id: 'appointments', label: '📅 Appointments', title: 'My Appointments'       },
]

function PageHeader() {
  return (
    <header className="rec-page-header" role="banner">
      <div className="rec-page-header__inner">
        <Link to="/" className="rec-back-link" aria-label="Back to home">
          ← Home
        </Link>
        <span className="rec-page-header__title">Recovery Hub</span>
      </div>
    </header>
  )
}

function HeroSection() {
  return (
    <section className="rec-hero" aria-label="Recovery Hub hero">
      <div className="rec-hero__inner">
        <h1 className="rec-hero__title">Your Recovery Hub</h1>
        <p className="rec-hero__sub">
          Everything in one place to help you look after your body and mind —
          at your own pace, on your own terms.
        </p>
      </div>
    </section>
  )
}

function SectionNav({ activeId, sections }) {
  const navRef = useRef(null)

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (!el) return
    const offset = 60 + 48 + 16
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <nav
      ref={navRef}
      className="rec-section-nav"
      aria-label="Recovery sections"
    >
      <div className="rec-section-nav__inner">
        {sections.map(s => (
          <button
            key={s.id}
            type="button"
            className={`rec-nav-tab${activeId === s.id ? ' rec-nav-tab--active' : ''}`}
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

function RecSection({ id, title, children }) {
  return (
    <section id={id} className="rec-section" aria-labelledby={`${id}-heading`}>
      <div className="rec-section__inner">
        <h2 id={`${id}-heading`} className="rec-section__title">{title}</h2>
        {children}
      </div>
    </section>
  )
}

export default function RecoveryPage() {
  const [activeId, setActiveId]     = useState(NAV_SECTIONS[0].id)
  const [completedDates, setCompletedDates] = useState(() => storage.get('completed-days', []))
  const observersRef = useRef([])

  // Intersection observer for active section
  useEffect(() => {
    const options = {
      rootMargin: '-60px 0px -40% 0px',
      threshold:  [0.2, 0.5],
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
          setActiveId(entry.target.id)
        }
      })
    }, options)

    NAV_SECTIONS.forEach(s => {
      const el = document.getElementById(s.id)
      if (el) obs.observe(el)
    })
    observersRef.current = [obs]
    return () => obs.disconnect()
  }, [])

  const handleDayComplete = useCallback((date, _ticked) => {
    setCompletedDates(prev => {
      if (prev.includes(date)) return prev
      const next = [...prev, date].sort()
      storage.set('completed-days', next)
      return next
    })
  }, [])

  const handleSaveAppointment = useCallback((loc) => {
    // Navigate to appointments section
    const el = document.getElementById('appointments')
    if (el) {
      const offset = 60 + 48 + 16
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, [])

  const handleSaveGymSession = useCallback((gym) => {
    const el = document.getElementById('appointments')
    if (el) {
      const offset = 60 + 48 + 16
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, [])

  return (
    <>
      <a href="#medical" className="skip-link">Skip to content</a>
      <PageHeader />

      <main id="main-content">
        <HeroSection />
        <Disclaimer />

        <SectionNav activeId={activeId} sections={NAV_SECTIONS} />

        <RecSection id="medical" title="NHS & Medical Support">
          <p className="rec-section__desc">
            Find a walk-in centre or GP near you. No referral needed for walk-in care.
          </p>
          <MedicalSearch
            locations={medicalLocations}
            onSaveAppointment={handleSaveAppointment}
          />
        </RecSection>

        <RecSection id="gyms" title="Local Gyms">
          <p className="rec-section__desc">
            Compare gyms by price, distance, and facilities. Click "Save session"
            to log a visit.
          </p>
          <GymList gyms={gyms} onSaveSession={handleSaveGymSession} />
        </RecSection>

        <RecSection id="checklist" title="Daily Recovery Checklist">
          <p className="rec-section__desc">
            Tick off your daily recovery tasks. Print or save as a PDF when you're done.
          </p>
          <DailyChecklist
            defaultItems={DEFAULT_CHECKLIST}
            onDayComplete={handleDayComplete}
          />
        </RecSection>

        <RecSection id="wellbeing" title="Wellbeing Tracker">
          <p className="rec-section__desc">
            A quick daily check-in on your mood, energy, and sleep. No right or wrong answers.
          </p>
          <WellbeingTracker />
        </RecSection>

        <RecSection id="metrics" title="Daily Metrics">
          <p className="rec-section__desc">
            Log your hydration, sleep hours, and steps to stay on top of the basics.
          </p>
          <MetricsLog />
        </RecSection>

        <RecSection id="streaks" title="Progress Streaks">
          <p className="rec-section__desc">
            See how consistently you've completed your daily checklist over time.
          </p>
          <ProgressStreaks completedDates={completedDates} />
        </RecSection>

        <RecSection id="appointments" title="My Appointments">
          <p className="rec-section__desc">
            Keep track of your medical appointments, gym sessions, and other bookings.
          </p>
          <Appointments />
        </RecSection>
      </main>

      <footer className="rec-footer">
        <p>
          © 2025 Beyond the Game · For signposting only — always consult a qualified professional for medical advice.
        </p>
        <Link to="/" className="rec-footer__link">← Back to home</Link>
      </footer>
    </>
  )
}
