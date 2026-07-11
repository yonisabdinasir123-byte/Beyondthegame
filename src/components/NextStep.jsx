/**
 * NextStep.jsx, the closing beat of every inner page.
 *
 * Each page ends with the same quiet glass band: one line that says where to
 * go from here, one primary link, and an optional second, softer link. The
 * copy names the destination by what the reader gets there, so the site reads
 * as one continuous journey (Pathway -> Education -> Jobs -> Stories -> ...).
 */
import { Link } from 'react-router-dom'
import GlassCard from './GlassCard.jsx'

export default function NextStep({ id = 'next-step', eyebrow = 'Where next', title, line, primary, secondary }) {
  const headingId = `${id}-title`
  return (
    <section id={id} className="floating-section next-step" aria-labelledby={headingId}>
      <GlassCard tone="light" className="floating-section__card next-step__card">
        <span className="pl-eyebrow">{eyebrow}</span>
        <h2 className="next-step__title" id={headingId}>{title}</h2>
        {line && <p className="next-step__line">{line}</p>}
        <div className="next-step__actions">
          <Link to={primary.to} className="next-step__btn next-step__btn--solid">
            {primary.label}
          </Link>
          {secondary && (
            <Link to={secondary.to} className="next-step__btn next-step__btn--ghost">
              {secondary.label}
            </Link>
          )}
        </div>
      </GlassCard>
    </section>
  )
}
