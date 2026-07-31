/**
 * FloatingNav.jsx, the site's signature: a floating "team-sheet" pill.
 *
 * A rounded, elevated island that sits ~16px below the top edge, centred,
 * detached from the page (soft shadow + backdrop blur). It:
 *   • stays in view on scroll
 *   • condenses (shrinks padding, tightens shadow) when scrolling DOWN
 *   • returns to full height when scrolling UP or near the top
 *   • marks the active page with a lime underline (the brand "pitch line")
 *   • collapses to a compact pill + full, keyboard-navigable panel on mobile
 *
 * Accessibility: semantic <header>/<nav>, aria-current on the active link,
 * the mobile panel traps focus, closes on Escape / route change / backdrop,
 * and the toggle exposes aria-expanded/aria-controls. Honours
 * prefers-reduced-motion (condense still works; it just doesn't animate big).
 */
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { cssDurationMs } from '../utils/motion'
import './FloatingNav.css'

const LINKS = [
  { to: '/',                label: 'Home' },
  { to: '/pathway',         label: 'Pathway' },
  { to: '/education',       label: 'Education' },
  { to: '/support',         label: 'Support' },
  { to: '/jobs-careers',    label: 'Jobs' },
  { to: '/success-stories', label: 'Stories' },
]

export default function FloatingNav({ onLogin, onSignup }) {
  const { pathname } = useLocation()
  const [condensed, setCondensed] = useState(false)
  const [open, setOpen] = useState(false)
  // Keep the panel in the DOM for the length of the close so the dismissal
  // transition can play; `hidden` alone removes it instantly.
  const [closing, setClosing] = useState(false)
  const panelRef = useRef(null)
  const toggleRef = useRef(null)
  const { savedCount } = useApp()

  const isActive = (to) => (to === '/' ? pathname === '/' : pathname.startsWith(to))

  // ── Condense on scroll-down, expand on scroll-up / near top ──────────
  useEffect(() => {
    let last = window.scrollY
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const y = window.scrollY
        if (y < 24) setCondensed(false)
        else if (y > last + 4) setCondensed(true)   // moving down
        else if (y < last - 4) setCondensed(false)  // moving up
        last = y
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])

  // ── Close the mobile panel on route change ───────────────────────────
  useEffect(() => { setOpen(false) }, [pathname])

  // ── Hold the panel mounted through the close transition ──────────────
  // The timer is started here rather than in an effect: an effect keyed on
  // [open, closing] re-runs on the same tick that sets both, and clears the
  // closing flag before the transition can paint.
  const closeTimer = useRef(0)
  const closePanel = () => {
    if (!open) return
    const ms = cssDurationMs('--dropdown-close-dur', 150)
    setClosing(true)
    setOpen(false)
    clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setClosing(false), ms)
  }
  useEffect(() => () => clearTimeout(closeTimer.current), [])

  // ── Mobile panel: body lock, Escape, focus trap ──────────────────────
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const panel = panelRef.current
    const focusable = panel?.querySelectorAll(
      'a, button, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable?.[0]
    const lastEl = focusable?.[focusable.length - 1]
    const t = setTimeout(() => first?.focus(), 40)

    const onKey = (e) => {
      if (e.key === 'Escape') { closePanel(); toggleRef.current?.focus(); return }
      if (e.key !== 'Tab' || !focusable?.length) return
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl?.focus() }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first?.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      clearTimeout(t)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const handleLogin  = () => { onLogin?.();  closePanel() }
  const handleSignup = () => { onSignup?.(); closePanel() }

  return (
    <header className={`fnav${condensed ? ' fnav--condensed' : ''}`}>
      {/* ── Desktop / tablet island ─────────────────────────────────── */}
      <nav className="fnav__bar" aria-label="Primary">
        <Link to="/" className="fnav__brand" aria-label="Beyond the Game, home">
          <span className="fnav__mark" aria-hidden="true" />
          <span className="fnav__brand-text">Beyond&nbsp;the&nbsp;Game</span>
        </Link>

        <ul className="fnav__links" role="list">
          {LINKS.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`fnav__link${isActive(to) ? ' is-active' : ''}`}
                aria-current={isActive(to) ? 'page' : undefined}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="fnav__actions">
          <button type="button" className="fnav__btn fnav__btn--ghost" onClick={onLogin}>
            Log in
          </button>
          <button type="button" className="fnav__btn fnav__btn--solid" onClick={onSignup}>
            Get started
          </button>
        </div>

        {/* ── Mobile toggle ─────────────────────────────────────────── */}
        <button
          type="button"
          ref={toggleRef}
          className="fnav__toggle"
          onClick={() => (open ? closePanel() : setOpen(true))}
          aria-expanded={open}
          aria-controls="fnav-panel"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <span className={`fnav__toggle-glyph${open ? ' is-open' : ''}`} aria-hidden="true">
            <span /><span /><span />
          </span>
        </button>
      </nav>

      {/* ── Mobile full panel ───────────────────────────────────────── */}
      <div
        className={`fnav__scrim${open ? ' is-open' : ''}`}
        onClick={closePanel}
        aria-hidden="true"
      />
      <div
        id="fnav-panel"
        ref={panelRef}
        className={`fnav__panel${open ? ' is-open' : ''}${closing ? ' is-closing' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        data-phase={open ? 'open' : closing ? 'closing' : 'closed'}
        hidden={!open && !closing}
      >
        <ul className="fnav__panel-links" role="list">
          {LINKS.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`fnav__panel-link${isActive(to) ? ' is-active' : ''}`}
                aria-current={isActive(to) ? 'page' : undefined}
              >
                {label}
                {isActive(to) && <span className="fnav__panel-dot" aria-hidden="true" />}
              </Link>
            </li>
          ))}
        </ul>
        {savedCount > 0 && (
          <p className="fnav__panel-saved">{savedCount} saved item{savedCount === 1 ? '' : 's'}</p>
        )}
        <div className="fnav__panel-actions">
          <button type="button" className="fnav__btn fnav__btn--ghost" onClick={handleLogin}>
            Log in
          </button>
          <button type="button" className="fnav__btn fnav__btn--solid" onClick={handleSignup}>
            Get started
          </button>
        </div>
      </div>
    </header>
  )
}
