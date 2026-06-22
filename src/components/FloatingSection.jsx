/**
 * FloatingSection.jsx, wraps page content as a floating element above the
 * animated background (tasks C + J): a soft green backing panel with a frosted
 * glass card on top. Gives every section the same two-layer depth.
 *
 * Props
 *   id            anchor id for in-page nav
 *   eyebrow,title,intro   optional section header (rendered inside the glass)
 *   backing       show the green backing layer (default true)
 *   tone          glass tone passed to the inner card
 *   className     extra classes on the outer <section>
 *   labelledById  id of the heading for aria-labelledby (falls back to title id)
 */
import GlassCard from './GlassCard.jsx'

export default function FloatingSection({
  id,
  eyebrow,
  title,
  intro,
  backing = true,
  tone = 'light',
  glow,
  className = '',
  children,
}) {
  const headingId = id ? `${id}-title` : undefined
  const outer = ['floating-section', !backing && 'floating-section--flat', className].filter(Boolean).join(' ')

  return (
    <section id={id} className={outer} aria-labelledby={title ? headingId : undefined}>
      <GlassCard tone={tone} glow={glow} className="floating-section__card">
        {(eyebrow || title || intro) && (
          <header className="floating-section__head">
            {eyebrow && <span className="pl-eyebrow">{eyebrow}</span>}
            {title && <h2 className="floating-section__title" id={headingId}>{title}</h2>}
            {intro && <p className="floating-section__intro">{intro}</p>}
          </header>
        )}
        {children}
      </GlassCard>
    </section>
  )
}
