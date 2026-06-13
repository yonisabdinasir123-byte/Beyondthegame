/**
 * PageLayout.jsx — the predictable page skeleton every page can share.
 *
 * Structure (top → bottom):
 *   <PageLayout>
 *     <PageHeader eyebrow title intro />   // orientation
 *     <PrimaryRegion>…</PrimaryRegion>     // the page's main job
 *     <SecondaryRegion>…</SecondaryRegion> // supporting panels
 *     <ClosingCTA>…</ClosingCTA>           // encouraging next step
 *   </PageLayout>
 *
 * Layout system: a single max-width container (--container) with consistent
 * section rhythm (--space-8 vertical), plus a `bleed` escape hatch for
 * full-width accent bands. Tokens only — nothing hardcoded.
 *
 * The floating nav overlays the page, so PageLayout owns the top offset
 * (--header-height) so content never hides beneath the island.
 */
import './PageLayout.css'

export default function PageLayout({ children, className = '' }) {
  return <div className={`pl${className ? ' ' + className : ''}`}>{children}</div>
}

/* ── Page header / intro ─────────────────────────────────────────────── */
export function PageHeader({ eyebrow, title, intro, align = 'left', children, id }) {
  return (
    <header className={`pl-header pl-header--${align}`} id={id}>
      <div className="pl-container">
        {eyebrow && <span className="pl-eyebrow">{eyebrow}</span>}
        <h1 className="pl-title">{title}</h1>
        {intro && <p className="pl-intro">{intro}</p>}
        {children && <div className="pl-header__extra">{children}</div>}
      </div>
    </header>
  )
}

/* ── Primary content region ──────────────────────────────────────────── */
export function PrimaryRegion({ children, className = '', bleed = false, ...rest }) {
  return (
    <section className={`pl-region pl-region--primary${bleed ? ' pl-bleed' : ''}${className ? ' ' + className : ''}`} {...rest}>
      <div className={bleed ? '' : 'pl-container'}>{children}</div>
    </section>
  )
}

/* ── Secondary / supporting region ───────────────────────────────────── */
export function SecondaryRegion({ children, className = '', tone = 'paper', bleed = false, ...rest }) {
  return (
    <section className={`pl-region pl-region--secondary pl-tone-${tone}${bleed ? ' pl-bleed' : ''}${className ? ' ' + className : ''}`} {...rest}>
      <div className={bleed ? '' : 'pl-container'}>{children}</div>
    </section>
  )
}

/* ── Closing call-to-action ──────────────────────────────────────────── */
export function ClosingCTA({ title, text, children }) {
  return (
    <section className="pl-closing" aria-labelledby="pl-closing-title">
      <div className="pl-container pl-closing__inner">
        <div className="pl-closing__mark" aria-hidden="true" />
        <h2 className="pl-closing__title" id="pl-closing-title">{title}</h2>
        {text && <p className="pl-closing__text">{text}</p>}
        {children && <div className="pl-closing__actions">{children}</div>}
      </div>
    </section>
  )
}

/* ── Section heading for use inside regions ──────────────────────────── */
export function SectionHeading({ eyebrow, title, intro, id }) {
  return (
    <div className="pl-section-head">
      {eyebrow && <span className="pl-eyebrow">{eyebrow}</span>}
      <h2 className="pl-section-title" id={id}>{title}</h2>
      {intro && <p className="pl-section-intro">{intro}</p>}
    </div>
  )
}
