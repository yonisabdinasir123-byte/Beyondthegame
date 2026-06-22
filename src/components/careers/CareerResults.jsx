/**
 * CareerResults.jsx, Display matched career suggestions with full detail.
 * Receives ruleMatches (always present) and optional tailored suggestions.
 */
import GlassCard from '../GlassCard'

function PathwayStep({ step, index }) {
  return (
    <li className="career-step">
      <span className="career-step__num" aria-hidden="true">{index + 1}</span>
      <span className="career-step__text">{step}</span>
    </li>
  )
}

function CareerCard({ rule }) {
  return (
    <GlassCard as="li" tone="light" className="career-card">
      <h3 className="career-card__title">{rule.job}</h3>

      <div className="career-card__why">
        <span className="career-card__why-icon" aria-hidden="true">💡</span>
        <p>{rule.why}</p>
      </div>

      <section className="career-card__section" aria-label="What you would need">
        <h4 className="career-card__section-title">What you would need to get there</h4>
        <ul className="career-card__needs" role="list">
          {rule.needs.map(n => (
            <li key={n} className="career-card__need">
              <span aria-hidden="true">✓</span> {n}
            </li>
          ))}
        </ul>
      </section>

      <section className="career-card__section" aria-label="Step by step pathway">
        <h4 className="career-card__section-title">Step by step pathway</h4>
        <ol className="career-steps" aria-label="Career progression steps">
          {rule.pathway.map((step, i) => (
            <PathwayStep key={i} step={step} index={i} />
          ))}
        </ol>
      </section>

      {rule.resource && (
        <div className="career-card__footer">
          <a
            href={rule.resource}
            target="_blank"
            rel="noopener noreferrer"
            className="career-card__link"
            aria-label={`${rule.resourceLabel}, opens in new tab`}
          >
            {rule.resourceLabel} ↗
          </a>
        </div>
      )}
    </GlassCard>
  )
}

export default function CareerResults({ ruleMatches, aiSuggestions }) {
  if (!ruleMatches?.length && !aiSuggestions?.length) return null

  return (
    <section className="career-results" aria-label="Career suggestions">
      <div className="career-results__header">
        <h3 className="career-results__title">Careers that could suit you</h3>
        <p className="career-results__sub">
          Based on what you told us, these are some paths worth looking into.
          None of them mean starting over. Most build on what you already know.
        </p>
      </div>

      {aiSuggestions?.length > 0 && (
        <div className="career-results__note" role="note">
          <span aria-hidden="true">✨</span> These suggestions are tailored from what you told us about your interests.
        </div>
      )}

      <ul className="career-cards" role="list" aria-label="Matched careers">
        {ruleMatches.map(rule => (
          <CareerCard key={rule.job} rule={rule} />
        ))}
      </ul>

      {ruleMatches.length === 0 && (
        <div className="careers-empty" role="status">
          <span aria-hidden="true">🔍</span>
          <p>We did not find a strong match for those interests. Try adding a few more, or being more specific.</p>
        </div>
      )}
    </section>
  )
}
