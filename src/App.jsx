import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { GoalPicker } from './components/GoalSystem.jsx'
import PromptCard from './components/PromptCard.jsx'
import StoryCarousel from './components/StoryCarousel.jsx'
import { getGoal } from './utils/goal'
import './App.css'

// ─────────────────────────────────────────────────────────────
// Inline SVG icons
// ─────────────────────────────────────────────────────────────
const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
)
const IconMenu = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
  </svg>
)
const IconX = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
)
const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
  </svg>
)
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
)

// ─────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────
const AGE_PATHWAYS = {
  '16': {
    label: '16',
    caption: 'left the academy',
    title: 'You left at 16 — and that took real courage',
    text: `Being released this young can feel like the ground's been pulled from under you — every early morning, every sacrifice. It wasn't for nothing. You're 16 with more resilience than most adults, and thousands of players have been exactly where you are and gone on to build incredible lives.`,
    resources: [
      {
        icon: '📚',
        title: 'Back to College',
        text: 'GCSEs, A-levels, BTECs, T-Levels — we help you find the right course and apply with your academy experience as a real advantage.',
      },
      {
        icon: '💬',
        title: 'Talk to a Peer',
        text: 'Connect with other 16–18 year olds who\'ve been through academy release. No professionals, no jargon — just people who get it.',
      },
      {
        icon: '🧠',
        title: 'Youth Wellbeing',
        text: 'Free, confidential support from advisors who specialise in young people going through big life changes. No waiting lists.',
      },
    ],
  },
  '18': {
    label: '18',
    caption: 'left the academy',
    title: 'Leaving at 18 — your path is still wide open',
    text: `You've spent your teenage years training, sacrificing, believing — and now you're at a crossroads. It's okay to feel lost, angry, or sad about what you expected your life to look like. There's a lot more to you than football, even if it doesn't feel that way right now.`,
    resources: [
      {
        icon: '🎓',
        title: 'University & Higher Ed',
        text: 'Sports science, coaching, physiotherapy, business — your academy background is a genuine asset on any UCAS or apprenticeship application.',
      },
      {
        icon: '🔧',
        title: 'Apprenticeships',
        text: 'Earn while you learn in construction, tech, healthcare, business or sport. Employers actively seek the discipline ex-academy players bring.',
      },
      {
        icon: '⚽',
        title: 'Keep Playing',
        text: 'Released from a pro academy doesn\'t mean football is over. We help you find semi-pro, amateur, and recreational clubs that fit your level and ambitions.',
      },
    ],
  },
  '21plus': {
    label: '21+',
    caption: 'left the academy',
    title: 'Years of dedication deserve a real next chapter',
    text: `You've given your early adult years to this game — and that took genuine sacrifice and belief. Those early mornings, team pressure, performing under stress: those aren't just football skills, they're exactly what employers and coaches look for. This is a transition, not an ending.`,
    resources: [
      {
        icon: '🏆',
        title: 'Coaching & Badges',
        text: 'UEFA C, B, and A licences, grassroots coaching, academy roles — your playing experience is a massive head start. We\'ll help you get started.',
      },
      {
        icon: '💼',
        title: 'Career Pivot',
        text: 'CV workshops, interview prep, and direct introductions to employers who actively recruit from professional sport backgrounds.',
      },
      {
        icon: '💰',
        title: 'Financial Planning',
        text: 'Make the most of any savings, understand your tax position, and plan your next five years with a dedicated financial advisor who understands athletes.',
      },
    ],
  },
}

const SUPPORT_CARDS = [
  {
    id: 'mind',
    emoji: '🧠',
    title: 'Mind & Wellbeing',
    micro: 'Not alone here',
    link: '/support#mind-wellbeing',
    accent: 'var(--c-mind)',
    bg: 'var(--c-mind-bg)',
  },
  {
    id: 'money',
    emoji: '💷',
    title: 'Money & Finances',
    micro: 'Know your money',
    link: '/support#money-finances',
    accent: 'var(--c-money)',
    bg: 'var(--c-money-bg)',
  },
  {
    id: 'feelings',
    emoji: '❤️',
    title: 'Feelings & Identity',
    micro: 'Be who you are',
    link: '/support#feelings-identity',
    accent: 'var(--c-feelings)',
    bg: 'var(--c-feelings-bg)',
  },
  {
    id: 'work',
    emoji: '🎯',
    title: 'Work & Your Future',
    micro: 'Build your path',
    link: '/support#work-future',
    accent: 'var(--c-work)',
    bg: 'var(--c-work-bg)',
  },
  {
    id: 'football',
    emoji: '⚽',
    title: 'Football Exit Support',
    micro: 'Beyond the game',
    link: '/support#football-exits',
    accent: 'var(--c-football)',
    bg: 'var(--c-football-bg)',
  },
  {
    id: 'community',
    emoji: '🤝',
    title: 'Community & Mates',
    micro: 'Your people',
    link: '/support#community-meets',
    accent: 'var(--c-community)',
    bg: 'var(--c-community-bg)',
  },
  {
    id: 'academy',
    emoji: '🏆',
    title: 'Life After Academy',
    micro: 'What comes next',
    link: '/support#life-after',
    accent: '#1A4731',
    bg: '#ECFDF5',
  },
]

const TESTIMONIALS = [
  {
    text: `I was released at 17 and thought my life was over. Beyond the Game got me talking to someone within a week.`,
    name: 'Jordan, 19',
    detail: 'Released aged 17 · Championship academy',
    initial: 'J',
  },
  {
    text: `The financial guide changed everything — plain English, no jargon. Got me sorted in two weeks.`,
    name: 'Callum, 21',
    detail: 'Released aged 18 · League One academy',
    initial: 'C',
  },
  {
    text: `Meeting other lads who'd been through it saved me. You don't feel so alone anymore.`,
    name: 'Marcus, 22',
    detail: 'Released aged 21 · Premier League academy',
    initial: 'M',
  },
]

// ─────────────────────────────────────────────────────────────
// Skip link
// ─────────────────────────────────────────────────────────────
export function SkipLink() {
  return (
    <a href="#main-content" className="skip-link">
      Skip to main content
    </a>
  )
}

// ─────────────────────────────────────────────────────────────
// Back to top button
// ─────────────────────────────────────────────────────────────
export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      className="back-to-top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="20" height="20">
        <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
      </svg>
    </button>
  )
}

// ─────────────────────────────────────────────────────────────
// Navbar
// ─────────────────────────────────────────────────────────────
export function Navbar({ onLogin, onSignup }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const closeMobile = () => setMobileOpen(false)

  const handleLogin = () => { onLogin(); closeMobile() }
  const handleSignup = () => { onSignup(); closeMobile() }

  return (
    <header>
      <nav className="navbar" aria-label="Main navigation">
        <div className="navbar__inner">
          <Link to="/" className="navbar__logo" aria-label="Beyond the Game — home">
            <span className="navbar__logo-ball" aria-hidden="true">⚽</span>
            <span className="navbar__logo-text">Beyond the Game</span>
          </Link>

          {/* Desktop links */}
          <ul className="navbar__desktop-nav" role="list">
            <li>
              <Link to="/" className="navbar__nav-link">
                Home
              </Link>
            </li>
            <li>
              <Link to="/pathway" className="navbar__nav-link" style={{ background: 'rgba(255,255,255,.15)', borderRadius: '6px', padding: '0.375rem 0.75rem' }}>
                ⚽ Pathway
              </Link>
            </li>
            <li>
              <Link to="/education" className="navbar__nav-link" style={{ background: 'rgba(255,255,255,.15)', borderRadius: '6px', padding: '0.375rem 0.75rem' }}>
                🏫 Education
              </Link>
            </li>
            <li>
              <Link to="/support" className="navbar__nav-link" style={{ background: 'rgba(255,255,255,.15)', borderRadius: '6px', padding: '0.375rem 0.75rem' }}>
                💚 Support
              </Link>
            </li>
            <li>
              <Link to="/jobs-careers" className="navbar__nav-link" style={{ background: 'rgba(255,255,255,.15)', borderRadius: '6px', padding: '0.375rem 0.75rem' }}>
                💼 Jobs &amp; Careers
              </Link>
            </li>
          </ul>

          {/* Desktop auth */}
          <div className="navbar__auth">
            <button
              type="button"
              className="navbar__btn navbar__btn--ghost"
              onClick={onLogin}
            >
              Log in
            </button>
            <button
              type="button"
              className="navbar__btn navbar__btn--solid"
              onClick={onSignup}
            >
              Get started today
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="navbar__hamburger"
            onClick={() => setMobileOpen(o => !o)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <IconX /> : <IconMenu />}
          </button>
        </div>

        {/* Mobile drawer */}
        <div
          id="mobile-menu"
          className={`navbar__mobile-menu${mobileOpen ? ' open' : ''}`}
          aria-hidden={!mobileOpen}
        >
          <ul className="navbar__mobile-nav" role="list">
            <li><Link to="/" className="navbar__nav-link" onClick={closeMobile}>Home</Link></li>
            <li><Link to="/pathway"      className="navbar__nav-link" onClick={closeMobile}>⚽ Pathway</Link></li>
            <li><Link to="/education"    className="navbar__nav-link" onClick={closeMobile}>🏫 Education</Link></li>
            <li><Link to="/support"      className="navbar__nav-link" onClick={closeMobile}>💚 Support</Link></li>
            <li><Link to="/jobs-careers" className="navbar__nav-link" onClick={closeMobile}>💼 Jobs &amp; Careers</Link></li>
          </ul>
          <div className="navbar__mobile-auth">
            <button type="button" className="navbar__btn navbar__btn--ghost" onClick={handleLogin} style={{ flex: 1 }}>
              Log in
            </button>
            <button type="button" className="navbar__btn navbar__btn--solid" onClick={handleSignup} style={{ flex: 1 }}>
              Get started today
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}

// ─────────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────────
function HeroSection({ onGetStarted, onFindPath }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__inner">
        <span className="hero__badge">Free · Confidential · Made for you</span>

        {/* Gestalt: focal point — largest type on the page, top-left zone */}
        <h1 className="hero__title" id="hero-title">
          You gave everything<br />
          <em>to the game.</em>
        </h1>

        <p className="hero__subtitle">
          Now let's help you find what comes next.
        </p>

        <div className="hero__ctas">
          {/* Gestalt: focal point — sole filled button in the first viewport */}
          <button type="button" className="hero__cta hero__cta--primary" onClick={onGetStarted}>
            Get started today
          </button>
        </div>

        {/* Continuity: muted scroll cue — the demoted secondary CTA now
            guides the eye down instead of competing with the primary */}
        <button type="button" className="hero__scroll-cue" onClick={onFindPath}>
          <span className="hero__scroll-cue-chevron" aria-hidden="true">⌄</span>
          Build my pathway
        </button>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// Trust strip — hero body copy + stats, relocated below the fold
// and demoted to muted tones so the hero owns the first viewport
// ─────────────────────────────────────────────────────────────
function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="Key facts about Beyond the Game">
      <div className="trust-strip__inner">
        <p className="trust-strip__body">
          Beyond the Game is a free, confidential support space built specifically for young
          people who've left football academies in the UK. Whatever you're feeling right now —
          we understand it, and we're here.
        </p>
        <div className="trust-strip__stats">
          <div className="trust-strip__stat">
            <span className="trust-strip__stat-value">2,400+</span>
            <span className="trust-strip__stat-label">young players supported</span>
          </div>
          <div className="trust-strip__stat">
            <span className="trust-strip__stat-value">100%</span>
            <span className="trust-strip__stat-label">free &amp; confidential</span>
          </div>
          <div className="trust-strip__stat">
            <span className="trust-strip__stat-value">24 / 7</span>
            <span className="trust-strip__stat-label">crisis line access</span>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// Age pathway selector
// ─────────────────────────────────────────────────────────────
function AgePathwaySection() {
  const [selected, setSelected] = useState(null)
  const panelRef = useRef(null)

  const handleSelect = (key) => {
    setSelected(prev => prev === key ? null : key)
  }

  useEffect(() => {
    if (selected && panelRef.current) {
      panelRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [selected])

  const pathway = selected ? AGE_PATHWAYS[selected] : null

  return (
    <section className="section" id="pathways" aria-labelledby="pathway-heading">
      <div className="section__inner">
        <div className="section__header">
          <span className="section__eyebrow">Your Pathway</span>
          <h2 className="section__title" id="pathway-heading">
            Everyone's journey is different
          </h2>
          <p className="section__subtitle">
            Tell us roughly when you left the academy and we'll show you the support
            and options that are most relevant for you right now.
          </p>
        </div>

        <div className="pathway-wrap">
          <p className="pathway__prompt" id="age-group-label">
            How old were you when you left the academy?
          </p>

          <div
            className="pathway__age-row"
            role="group"
            aria-labelledby="age-group-label"
          >
            {Object.entries(AGE_PATHWAYS).map(([key, data]) => (
              <button
                key={key}
                type="button"
                className={`pathway__age-btn${selected === key ? ' active' : ''}`}
                onClick={() => handleSelect(key)}
                aria-pressed={selected === key}
              >
                <span className="pathway__age-num">{data.label}</span>
                <span className="pathway__age-caption">{data.caption}</span>
              </button>
            ))}
          </div>

          {!pathway && (
            <p className="pathway__empty" aria-live="polite">
              Select your age group above to see personalised guidance.
            </p>
          )}

          {pathway && (
            <div
              className="pathway__panel"
              ref={panelRef}
              aria-live="polite"
              aria-label={`Pathway for age ${pathway.label}`}
            >
              <h3 className="pathway__panel-title">{pathway.title}</h3>
              <p className="pathway__panel-text">{pathway.text}</p>
              <div className="pathway__resources">
                {pathway.resources.map((r, i) => (
                  <div key={i} className="pathway__resource">
                    <span className="pathway__resource-icon" aria-hidden="true">{r.icon}</span>
                    <h4 className="pathway__resource-title">{r.title}</h4>
                    <p className="pathway__resource-text">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// Support cards — Gestalt unified nav shell
// ─────────────────────────────────────────────────────────────
function SupportCardsSection() {
  return (
    <section className="section section--alt" id="support" aria-labelledby="support-heading">
      <div className="section__inner">
        <div className="section__header">
          <span className="section__eyebrow">Support Areas</span>
          <h2 className="section__title" id="support-heading">
            Seven ways we can help
          </h2>
        </div>

        {/* Common region: one shell groups all 7 tiles — Gestalt common region */}
        <div className="sa-shell">
          <nav aria-label="Support pathways">
            <ul className="sa-grid" role="list">
              {SUPPORT_CARDS.map((card, i) => (
                <li key={card.id} className="sa-tile" style={{ '--i': i }}>
                  <Link to={card.link} className="sa-tile__link">
                    <span className="sa-tile__icon-wrap">
                      <span className="sa-tile__icon" aria-hidden="true">{card.emoji}</span>
                      {card.id === 'academy' && (
                        <span className="sa-tile__badge" aria-hidden="true" />
                      )}
                    </span>
                    <span className="sa-tile__title">{card.title}</span>
                    <span className="sa-tile__micro">{card.micro}</span>
                    <span className="sa-tile__chevron" aria-hidden="true">›</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// Goal section  /* Goal gradient + Cialdini: commitment */
// ─────────────────────────────────────────────────────────────
function GoalSection() {
  return (
    <section className="section" id="my-goal" aria-labelledby="goal-picker-heading">
      <div className="section__inner">
        <GoalPicker />
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// Testimonials
// ─────────────────────────────────────────────────────────────
function TestimonialsSection() {
  return (
    <section className="section" id="community" aria-labelledby="testimonials-heading">
      <div className="section__inner">
        <div className="section__header">
          <span className="section__eyebrow">Peer Voices</span>
          <h2 className="section__title" id="testimonials-heading">
            You're not alone — not even close
          </h2>
          <p className="section__subtitle">
            Here's what some of the young people we've supported have said.
            Their words, not ours.
          </p>
        </div>

        {/* Swipeable carousel — partial next card = Gestalt closure cue.
            Arrow buttons are the keyboard/assistive fallback. */}
        <StoryCarousel items={TESTIMONIALS} />

        {/* Fogg: spark — emotion from the stories is brief; offer the next
            step while it's live. Prospect: gain framing. */}
        <PromptCard
          type="spark"
          ctaLabel={getGoal() ? 'See my progress' : 'Set my goal'}
          href="#my-goal"
        >
          Jordan, Callum and Marcus all started with one step. Yours is ready.
        </PromptCard>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// CTA band
// ─────────────────────────────────────────────────────────────
function CTABand({ onSignup, onLogin }) {
  return (
    <section className="cta-band" aria-labelledby="cta-heading">
      <div className="cta-band__inner">
        <h2 className="cta-band__title" id="cta-heading">
          Ready to take the first step?
        </h2>
        <p className="cta-band__text">
          It takes less than two minutes to create your free account. No
          credit card, no contract, no commitment — just a space that's
          entirely yours to explore at your own pace.
        </p>
        <div className="cta-band__btns">
          <button type="button" className="cta-band__btn cta-band__btn--primary" onClick={onSignup}>
            Create my free account
          </button>
          <button type="button" className="cta-band__btn cta-band__btn--outline" onClick={onLogin}>
            Already have an account
          </button>
        </div>
        <p className="cta-band__reassurance">
          <strong>100% free</strong> · <strong>Fully confidential</strong> · No spam, ever
        </p>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────
export function FooterSection({ onLogin, onSignup }) {
  return (
    <footer className="footer" id="about">
      <div className="footer__grid">
        {/* Brand column */}
        <div>
          <div className="footer__brand-name">
            <span aria-hidden="true">⚽</span> Beyond the Game
          </div>
          <p className="footer__brand-text">
            A free, confidential support community for young people leaving
            football academies in the UK. Built with and for young players
            who've been there.
          </p>
          <div className="footer__crisis-box" role="complementary" aria-label="Crisis support information">
            <div className="footer__crisis-title">⚡ Need help right now?</div>
            <div className="footer__crisis-lines">
              <strong>Samaritans:</strong> 116 123 (free, 24/7)<br />
              <strong>CALM:</strong> 0800 58 58 58 (5pm–midnight)<br />
              <strong>Crisis text line:</strong> Text SHOUT to 85258
            </div>
          </div>
        </div>

        {/* Support column */}
        <nav aria-label="Support links">
          <h3 className="footer__col-heading">Support</h3>
          <ul className="footer__links">
            <li><Link to="/support#mind-wellbeing"   className="footer__link">Mind &amp; Wellbeing</Link></li>
            <li><Link to="/support#money-finances"   className="footer__link">Money &amp; Finances</Link></li>
            <li><Link to="/support#feelings-identity" className="footer__link">Feelings &amp; Identity</Link></li>
            <li><Link to="/support#work-future"      className="footer__link">Work &amp; Career</Link></li>
            <li><Link to="/support#football-exits"   className="footer__link">Football Exit</Link></li>
            <li><Link to="/support#community-meets"  className="footer__link">Community</Link></li>
          </ul>
        </nav>

        {/* Pathways column */}
        <nav aria-label="Pathway links">
          <h3 className="footer__col-heading">Pathways</h3>
          <ul className="footer__links">
            <li><Link to="/pathway" className="footer__link">Left at 16</Link></li>
            <li><Link to="/pathway" className="footer__link">Left at 18</Link></li>
            <li><Link to="/pathway" className="footer__link">Left at 21+</Link></li>
            <li><a href="/#about" className="footer__link">About Us</a></li>
            <li><a href="/#about" className="footer__link">Our Story</a></li>
          </ul>
        </nav>

        {/* Account column */}
        <nav aria-label="Account links">
          <h3 className="footer__col-heading">Account</h3>
          <ul className="footer__links">
            <li>
              <button type="button" className="footer__link" onClick={onSignup}>
                Sign up free
              </button>
            </li>
            <li>
              <button type="button" className="footer__link" onClick={onLogin}>
                Log in
              </button>
            </li>
            <li><a href="#about" className="footer__link">Privacy policy</a></li>
            <li><a href="#about" className="footer__link">Terms of use</a></li>
            <li><a href="#about" className="footer__link">Cookie settings</a></li>
          </ul>
        </nav>
      </div>

      <div className="footer__bottom">
        <span className="footer__copy">
          © {new Date().getFullYear()} Beyond the Game. Built with care for young people leaving football.
        </span>
        <div className="footer__bottom-links">
          <a href="#about" className="footer__link">Privacy</a>
          <a href="#about" className="footer__link">Terms</a>
          <a href="#about" className="footer__link">Accessibility</a>
        </div>
      </div>
    </footer>
  )
}

// ─────────────────────────────────────────────────────────────
// Modal base (handles overlay, close on backdrop, Escape key, body lock)
// ─────────────────────────────────────────────────────────────
function Modal({ isOpen, onClose, labelId, children }) {
  const overlayRef = useRef(null)
  const modalRef = useRef(null)

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = prev }
    }
  }, [isOpen])

  // Escape key
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  // Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return
    const focusable = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last  = focusable[focusable.length - 1]
    const prevFocus = document.activeElement

    // Small delay so modal is painted before focusing
    const timer = setTimeout(() => first?.focus(), 50)

    const trap = (e) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first?.focus() }
      }
    }
    document.addEventListener('keydown', trap)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('keydown', trap)
      prevFocus?.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelId}
    >
      <div className="modal" ref={modalRef}>
        {children}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Login modal
// ─────────────────────────────────────────────────────────────
export function LoginModal({ isOpen, onClose, onForgotPassword, onSignup }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const reset = useCallback(() => {
    setEmail(''); setPassword(''); setError(''); setLoading(false); setSuccess(false)
  }, [])

  useEffect(() => { if (!isOpen) reset() }, [isOpen, reset])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password) { setError('Please fill in your email and password.'); return }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email address.'); return }
    setError(''); setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false); setSuccess(true)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} labelId="login-title">
      <button className="modal__close" onClick={onClose} aria-label="Close">
        <IconClose />
      </button>

      {success ? (
        <div className="form-success">
          <div className="form-success__icon"><IconCheck /></div>
          <h2 className="form-success__title">Welcome back!</h2>
          <p className="form-success__text">
            You're signed in. We're glad you're here. Your dashboard is loading.
          </p>
          <button type="button" className="form-submit" onClick={onClose}>
            Continue to my dashboard
          </button>
        </div>
      ) : (
        <>
          <h2 className="modal__title" id="login-title">Welcome back</h2>
          <p className="modal__subtitle">
            Good to see you. Sign in to pick up where you left off.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {error && <div className="form-error" role="alert">{error}</div>}

            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                className="form-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label" htmlFor="login-password" style={{ marginBottom: 0 }}>
                  Password
                </label>
                <button type="button" className="form-link-btn" onClick={onForgotPassword}>
                  Forgot password?
                </button>
              </div>
              <input
                id="login-password"
                type="password"
                className="form-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Your password"
                autoComplete="current-password"
                required
              />
            </div>

            <button type="submit" className="form-submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="form-divider">
            <span className="form-divider__label">or</span>
          </div>

          <p className="form-footer-text">
            Don't have an account?{' '}
            <button type="button" className="form-link-btn" onClick={onSignup}>
              Sign up — it's free
            </button>
          </p>
        </>
      )}
    </Modal>
  )
}

// ─────────────────────────────────────────────────────────────
// Sign up modal
// ─────────────────────────────────────────────────────────────
export function SignupModal({ isOpen, onClose, onLogin }) {
  const [form, setForm] = useState({
    name: '', email: '', ageGroup: '', password: '', confirmPassword: '', terms: false,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const reset = useCallback(() => {
    setForm({ name: '', email: '', ageGroup: '', password: '', confirmPassword: '', terms: false })
    setError(''); setLoading(false); setSuccess(false)
  }, [])

  useEffect(() => { if (!isOpen) reset() }, [isOpen, reset])

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
  const setAge = (v) => setForm(f => ({ ...f, ageGroup: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { name, email, ageGroup, password, confirmPassword, terms } = form
    if (!name.trim())         { setError('Please enter your first name.'); return }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email address.'); return }
    if (!ageGroup)            { setError('Please select your age group.'); return }
    if (password.length < 8)  { setError('Password must be at least 8 characters.'); return }
    if (password !== confirmPassword) { setError('Passwords don\'t match.'); return }
    if (!terms)               { setError('Please accept the terms to continue.'); return }
    setError(''); setLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setLoading(false); setSuccess(true)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} labelId="signup-title">
      <button className="modal__close" onClick={onClose} aria-label="Close">
        <IconClose />
      </button>

      {success ? (
        <div className="form-success">
          <div className="form-success__icon"><IconCheck /></div>
          <h2 className="form-success__title">You're in, {form.name.split(' ')[0]}!</h2>
          <p className="form-success__text">
            Your free account is ready. Welcome to the community — we're really
            glad you found us.
          </p>
          <button type="button" className="form-submit" onClick={onClose}>
            Take me to my dashboard
          </button>
        </div>
      ) : (
        <>
          <h2 className="modal__title" id="signup-title">Create your free account</h2>
          <p className="modal__subtitle">
            Join thousands of young players finding their next chapter.
            Takes less than two minutes.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {error && <div className="form-error" role="alert">{error}</div>}

            <div className="form-group">
              <label className="form-label" htmlFor="signup-name">First name</label>
              <input
                id="signup-name"
                type="text"
                className="form-input"
                value={form.name}
                onChange={set('name')}
                placeholder="What do your mates call you?"
                autoComplete="given-name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-email">Email address</label>
              <input
                id="signup-email"
                type="email"
                className="form-input"
                value={form.email}
                onChange={set('email')}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <p className="form-label" id="age-group-signup-label">
                When did you leave the academy?
              </p>
              <div
                className="age-group-grid"
                role="group"
                aria-labelledby="age-group-signup-label"
              >
                {['16', '18', '21+'].map(age => (
                  <button
                    key={age}
                    type="button"
                    className={`age-group-option${form.ageGroup === age ? ' selected' : ''}`}
                    onClick={() => setAge(age)}
                    aria-pressed={form.ageGroup === age}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                className="form-input"
                value={form.password}
                onChange={set('password')}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                required
                minLength={8}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-confirm">Confirm password</label>
              <input
                id="signup-confirm"
                type="password"
                className="form-input"
                value={form.confirmPassword}
                onChange={set('confirmPassword')}
                placeholder="Same again"
                autoComplete="new-password"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-checkbox-group">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={form.terms}
                  onChange={set('terms')}
                  required
                />
                <span className="form-checkbox-label">
                  I agree to the{' '}
                  <a href="#about" className="form-link-btn" style={{ fontSize: 'inherit' }}>
                    terms of use
                  </a>{' '}
                  and{' '}
                  <a href="#about" className="form-link-btn" style={{ fontSize: 'inherit' }}>
                    privacy policy
                  </a>
                  . I understand this service is free and confidential.
                </span>
              </label>
            </div>

            <button type="submit" className="form-submit" disabled={loading}>
              {loading ? 'Creating your account…' : 'Create my free account'}
            </button>
          </form>

          <div className="form-divider">
            <span className="form-divider__label">or</span>
          </div>

          <p className="form-footer-text">
            Already have an account?{' '}
            <button type="button" className="form-link-btn" onClick={onLogin}>
              Log in here
            </button>
          </p>
        </>
      )}
    </Modal>
  )
}

// ─────────────────────────────────────────────────────────────
// Forgot password modal
// ─────────────────────────────────────────────────────────────
export function ForgotPasswordModal({ isOpen, onClose, onBack }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const reset = useCallback(() => {
    setEmail(''); setError(''); setLoading(false); setSent(false)
  }, [])

  useEffect(() => { if (!isOpen) reset() }, [isOpen, reset])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.'); return
    }
    setError(''); setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false); setSent(true)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} labelId="forgot-title">
      <button className="modal__close" onClick={onClose} aria-label="Close">
        <IconClose />
      </button>

      {sent ? (
        <div className="form-success">
          <div className="form-success__icon"><IconCheck /></div>
          <h2 className="form-success__title">Check your inbox</h2>
          <p className="form-success__text">
            We've sent a reset link to <strong>{email}</strong>. It should arrive
            within a couple of minutes. Check your spam folder if you don't see it.
          </p>
          <button type="button" className="form-submit" onClick={onBack}>
            Back to sign in
          </button>
        </div>
      ) : (
        <>
          <h2 className="modal__title" id="forgot-title">Forgotten your password?</h2>
          <p className="modal__subtitle">
            No worries — happens to everyone. Enter your email and we'll send
            you a link to get back in.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {error && <div className="form-error" role="alert">{error}</div>}

            <div className="form-group">
              <label className="form-label" htmlFor="forgot-email">Your email address</label>
              <input
                id="forgot-email"
                type="email"
                className="form-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <button type="submit" className="form-submit" disabled={loading}>
              {loading ? 'Sending reset link…' : 'Send reset link'}
            </button>
          </form>

          <div className="form-divider">
            <span className="form-divider__label">or</span>
          </div>

          <p className="form-footer-text">
            <button type="button" className="form-link-btn" onClick={onBack}>
              ← Back to sign in
            </button>
          </p>
        </>
      )}
    </Modal>
  )
}

// ─────────────────────────────────────────────────────────────
// Splash screen
// ─────────────────────────────────────────────────────────────
const SPLASH_DURATION = 2600 // ms before auto-dismiss starts
const SPLASH_EXIT_MS  = 700  // must match CSS animation duration

function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('enter') // 'enter' | 'hold' | 'exit'

  const startExit = useCallback(() => {
    if (phase === 'exit') return
    setPhase('exit')
    setTimeout(onDone, SPLASH_EXIT_MS)
  }, [phase, onDone])

  // Auto-dismiss
  useEffect(() => {
    const t = setTimeout(startExit, SPLASH_DURATION)
    return () => clearTimeout(t)
  }, [startExit])

  // Skip on any key
  useEffect(() => {
    const onKey = () => startExit()
    window.addEventListener('keydown', onKey, { once: true })
    return () => window.removeEventListener('keydown', onKey)
  }, [startExit])

  return (
    <div
      className={`splash splash--${phase}`}
      onClick={startExit}
      role="status"
      aria-label="Beyond the Game is loading"
    >
      {/* Decorative background rings */}
      <span className="splash__ring splash__ring--1" aria-hidden="true" />
      <span className="splash__ring splash__ring--2" aria-hidden="true" />

      <div className="splash__content">
        {/* Ball */}
        <div className="splash__ball-wrap" aria-hidden="true">
          <span className="splash__ball">⚽</span>
        </div>

        {/* Wordmark */}
        <div className="splash__wordmark">
          <h1 className="splash__title">Beyond the Game</h1>
          <p className="splash__tagline">Life after the academy</p>
        </div>

        {/* Progress bar */}
        <div className="splash__bar-track" aria-hidden="true">
          <div className="splash__bar-fill" />
        </div>

      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Root App
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [splashDone, setSplashDone] = useState(() => !!sessionStorage.getItem('btg-splash'))
  const [modal, setModal] = useState(null) // 'login' | 'signup' | 'forgot' | null

  const openLogin  = useCallback(() => setModal('login'),  [])
  const openSignup = useCallback(() => setModal('signup'), [])
  const openForgot = useCallback(() => setModal('forgot'), [])
  const closeModal = useCallback(() => setModal(null),     [])

  const scrollToPathways = () => {
    document.getElementById('pathways')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {!splashDone && (
        <SplashScreen onDone={() => { sessionStorage.setItem('btg-splash', '1'); setSplashDone(true) }} />
      )}

      <SkipLink />

      <Navbar onLogin={openLogin} onSignup={openSignup} />

      <main id="main-content">
        <HeroSection onGetStarted={openSignup} onFindPath={scrollToPathways} />
        {/* Eye path: hero → trust strip (quiet) → pathway → goal → support */}
        <TrustStrip />
        <AgePathwaySection />
        {/* Priming + commitment: goal selection sits after the age pathway,
            so users are primed by their own situation before committing. */}
        <GoalSection />
        <SupportCardsSection />
        <TestimonialsSection />
        <CTABand onSignup={openSignup} onLogin={openLogin} />
      </main>

      <FooterSection onLogin={openLogin} onSignup={openSignup} />
      <BackToTop />

      {/* Auth modals */}
      <LoginModal
        isOpen={modal === 'login'}
        onClose={closeModal}
        onForgotPassword={openForgot}
        onSignup={openSignup}
      />
      <SignupModal
        isOpen={modal === 'signup'}
        onClose={closeModal}
        onLogin={openLogin}
      />
      <ForgotPasswordModal
        isOpen={modal === 'forgot'}
        onClose={closeModal}
        onBack={openLogin}
      />
    </>
  )
}
