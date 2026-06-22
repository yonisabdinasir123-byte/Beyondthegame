/**
 * PromptCard.jsx, Fogg Behaviour Model prompts (B = M·A·P).
 *
 * Three types, matched to user state:
 *   spark, high ability, low motivation → ignite desire after stories
 *   facilitator, high motivation, low ability → make the action easier
 *   signal, high motivation, high ability → point straight at the action
 *
 * Every prompt offers exactly ONE next step (behaviour chaining), is
 * gain-framed, and never blocks or traps. CVD-safe: type is carried by
 * icon + text label, never colour alone.
 */
import { Link } from 'react-router-dom'
import './behaviour.css'

const TYPE_META = {
  spark:       { icon: '✨', label: 'Your next step' },
  facilitator: { icon: '🤝', label: 'We made this easier' },
  signal:      { icon: '🎯', label: 'For your goal' },
}

export default function PromptCard({ type = 'spark', children, ctaLabel, to, href, onAction, live = false }) {
  const meta = TYPE_META[type] || TYPE_META.spark

  /* Fogg: one clear action per prompt, no competing choices */
  const cta = ctaLabel && (
    to ? (
      <Link to={to} className="prompt-card__cta">{ctaLabel}</Link>
    ) : href ? (
      <a href={href} className="prompt-card__cta">{ctaLabel}</a>
    ) : onAction ? (
      <button type="button" className="prompt-card__cta" onClick={onAction}>{ctaLabel}</button>
    ) : null
  )

  return (
    <aside
      className={`prompt-card prompt-card--${type}`}
      role="note"
      aria-label={meta.label}
      /* POUR: dynamically injected prompts announce politely, never interrupt */
      aria-live={live ? 'polite' : undefined}
    >
      <span className="prompt-card__icon" aria-hidden="true">{meta.icon}</span>
      <div className="prompt-card__body">
        {/* CVD-safe: text badge names the prompt type, colour is decoration */}
        <span className="prompt-card__type">{meta.label}</span>
        <p className="prompt-card__text">{children}</p>
      </div>
      {cta}
    </aside>
  )
}
