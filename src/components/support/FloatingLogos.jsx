/**
 * FloatingLogos.jsx: a reusable "who can help" band of partner and charity
 * logos, each gently floating, with a short description on or under it.
 *
 * Usage
 *   <FloatingLogos logos={myLogos} />
 *
 * Each item in the `logos` prop is an object:
 *   {
 *     name:        string  (used for the placeholder initials + heading)
 *     src?:        string  (path to an APPROVED logo file, e.g. '/logos/mind.svg')
 *     alt?:        string  (alt text for the image; falls back to a sensible default)
 *     description: string  (short, encouraging one line about what they do)
 *     url?:        string  (optional external link)
 *   }
 *
 * IMPORTANT, LOGO FILES:
 *   We must NOT scrape or bundle third-party logos. The seeded list below is
 *   NAME + DESCRIPTION ONLY, with no `src`, so each renders a tasteful local
 *   placeholder tile (the organisation's initials in a glass circle).
 *   To show a real logo: drop an APPROVED logo file into /public (for example
 *   /public/logos/mind.svg) and pass its path as `src` (e.g. '/logos/mind.svg').
 */
import GlassCard from '../GlassCard.jsx'
import './FloatingLogos.css'

/**
 * Build short initials from an organisation name for the placeholder tile.
 * "League Football Education" -> "LFE", "Mind" -> "MI".
 */
function initialsFrom(name) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase()
  }
  return words
    .slice(0, 3)
    .map(w => w[0])
    .join('')
    .toUpperCase()
}

/**
 * Seeded with well-known, relevant UK organisations as placeholders only.
 * These render initials tiles until approved logo files are supplied via `src`.
 */
export const DEFAULT_SUPPORT_LOGOS = [
  {
    name: 'LFE',
    fullName: 'League Football Education',
    description: 'Education and life support for academy players moving on from the game.',
    url: 'https://www.lfe.org.uk',
  },
  {
    name: 'Samaritans',
    description: 'Free, confidential support any time of day or night, whatever you are facing.',
    url: 'https://www.samaritans.org',
  },
  {
    name: 'CALM',
    fullName: 'Campaign Against Living Miserably',
    description: 'A helpline and webchat for anyone who is struggling or feeling overwhelmed.',
    url: 'https://www.thecalmzone.net',
  },
  {
    name: 'Mind',
    description: 'Mental health information, guidance, and local services across England and Wales.',
    url: 'https://www.mind.org.uk',
  },
  {
    name: 'PFA',
    fullName: 'Professional Footballers Association',
    description: 'The players union, offering advice on contracts, releases, and wellbeing.',
    url: 'https://www.thepfa.com',
  },
  {
    name: 'Sporting Chance',
    description: 'Mental health and wellbeing support built around the world of sport.',
    url: 'https://www.sportingchanceclinic.com',
  },
]

function LogoMedia({ logo }) {
  const label = logo.fullName || logo.name
  if (logo.src) {
    return (
      <span className="floating-logo__media" aria-hidden="false">
        <img
          className="floating-logo__img"
          src={logo.src}
          alt={logo.alt || `${label} logo`}
          loading="lazy"
          width="120"
          height="120"
        />
      </span>
    )
  }
  // No approved logo file supplied yet, so show a tasteful initials placeholder.
  return (
    <span className="floating-logo__media floating-logo__media--placeholder">
      <span className="floating-logo__initials" aria-hidden="true">
        {initialsFrom(logo.name)}
      </span>
    </span>
  )
}

function LogoTile({ logo, index }) {
  const label = logo.fullName || logo.name
  // Stagger the float so the band feels alive rather than synchronised.
  const style = { '--float-delay': `${(index % 6) * 0.45}s` }

  const inner = (
    <>
      <LogoMedia logo={logo} />
      <span className="floating-logo__name">{label}</span>
      <span className="floating-logo__desc">{logo.description}</span>
    </>
  )

  return (
    <li className="floating-logo" style={style}>
      <GlassCard
        as={logo.url ? 'a' : 'div'}
        className="floating-logo__card"
        interactive={!!logo.url}
        glow={index % 3 === 0 ? 'teal' : index % 3 === 1 ? 'lime' : 'coral'}
        {...(logo.url
          ? {
              href: logo.url,
              target: '_blank',
              rel: 'noopener noreferrer',
              'aria-label': `${label}: ${logo.description} Opens in a new tab.`,
            }
          : {})}
      >
        {inner}
      </GlassCard>
    </li>
  )
}

export default function FloatingLogos({ logos = DEFAULT_SUPPORT_LOGOS }) {
  return (
    <ul className="floating-logos" role="list">
      {logos.map((logo, i) => (
        <LogoTile key={logo.name} logo={logo} index={i} />
      ))}
    </ul>
  )
}
