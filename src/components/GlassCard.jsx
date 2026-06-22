/**
 * GlassCard.jsx, the single reusable frosted-glass card used across every
 * page (task C). Styling lives entirely in tokens (styles/glass.css), so the
 * look stays consistent and is tuned from one place.
 *
 * Props
 *   as          element/component to render (default 'div')
 *   tone        'light' (default) | 'dark', dark glass over night sections
 *   strength    'std' (default) | 'strong' | 'quiet'
 *   glow        undefined | 'teal' | 'coral' | 'lime', coloured emphasis
 *   pad         add comfortable internal padding (default true)
 *   interactive lift + focus ring for clickable cards (default false)
 */
export default function GlassCard({
  as: Tag = 'div',
  tone = 'light',
  strength = 'std',
  glow,
  pad = true,
  interactive = false,
  className = '',
  children,
  ...rest
}) {
  const classes = [
    'glass',
    tone === 'dark' && 'glass--dark',
    strength === 'strong' && 'glass--strong',
    strength === 'quiet' && 'glass--quiet',
    glow && `glass--glow-${glow}`,
    pad && 'glass--pad',
    interactive && 'glass--interactive',
    className,
  ].filter(Boolean).join(' ')

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  )
}
