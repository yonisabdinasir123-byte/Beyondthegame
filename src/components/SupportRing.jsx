/**
 * SupportRing.jsx — the home-page Support group as a symbolic Gestalt figure.
 *
 * CLOSURE      — "SUPPORT" hub at the centre; the 7 cards form an implied
 *                enclosing ring that is never fully drawn (the stroke stops
 *                short of closing — the viewer's mind completes the circle).
 * CONTINUATION — ONE continuous SVG path threads through every card like a
 *                spine: support is endless, someone has your back all the time.
 *                No joins, round caps, single stroke.
 *
 * The ball travels the spine as you scroll (decorative, aria-hidden).
 * Reduced motion: spine pre-drawn, ball static at the start.
 * Mobile (<960px): vertical backbone variant — hub on top, one unbroken stroke.
 */
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './SupportRing.css'

// Card centres in SVG viewBox units (0 0 1000 760) — single source of truth
// for both card placement and the spine path, so they can never drift apart.
const RING_POINTS = [
  { x: 500, y: 80 },   // top
  { x: 813, y: 193 },
  { x: 890, y: 447 },
  { x: 674, y: 650 },
  { x: 326, y: 650 },
  { x: 110, y: 447 },
  { x: 187, y: 193 },
]

/* Gestalt: closure — elliptical arc through all 7 points, deliberately left
   open between the last and first card. ONE path, no joins. */
const RING_PATH =
  'M 500 80 ' +
  'A 400 300 0 0 1 813 193 ' +
  'A 400 300 0 0 1 890 447 ' +
  'A 400 300 0 0 1 674 650 ' +
  'A 400 300 0 0 1 326 650 ' +
  'A 400 300 0 0 1 110 447 ' +
  'A 400 300 0 0 1 187 193'

// Vertical backbone path for the stacked mobile layout (viewBox 0 0 10 100)
const SPINE_PATH = 'M 5 0 L 5 100'

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduce(mq.matches)
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])
  return reduce
}

function useRingLayout() {
  const [ring, setRing] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.('(min-width: 960px)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 960px)')
    const onChange = () => setRing(mq.matches)
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])
  return ring
}

export default function SupportRing({ cards }) {
  const sectionRef = useRef(null)
  const pathRef    = useRef(null)
  const ballRef    = useRef(null)
  const [drawn, setDrawn] = useState(false)
  const reduce = usePrefersReducedMotion()
  const isRing = useRingLayout()

  // Spine draw-in: once, on first scroll into view. Reduced motion: pre-drawn.
  useEffect(() => {
    const path = pathRef.current
    if (!path) return
    const len = path.getTotalLength()
    path.style.setProperty('--spine-len', len)

    if (reduce) { setDrawn(true); return }

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setDrawn(true)
        obs.disconnect()
      }
    }, { threshold: 0.25 })
    obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [reduce, isRing])

  // Ball travels the spine, scroll-linked. Scroll events only schedule a
  // rAF; all layout reads happen once per frame (performance budget).
  useEffect(() => {
    const path = pathRef.current
    const ball = ballRef.current
    const section = sectionRef.current
    if (!path || !ball || !section) return // stack layout renders no ball

    const len = path.getTotalLength()

    const place = (t) => {
      const p = path.getPointAtLength(Math.max(0, Math.min(1, t)) * len)
      ball.setAttribute('transform', `translate(${p.x}, ${p.y})`)
    }

    if (reduce) { place(0); return } // reduced motion: static at the start

    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const r = section.getBoundingClientRect()
        const vh = window.innerHeight
        // 0 when the section enters the viewport bottom → 1 when it leaves the top
        const t = (vh - r.top) / (vh + r.height)
        place(t)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [reduce, isRing])

  const hub = (
    <div className="sring-hub">
      <span className="sring-hub__word">Support</span>
      <span className="sring-hub__line">Always behind you.</span>
    </div>
  )

  const tile = (card, i, style) => (
    <li key={card.id} className="sring-tile" style={style}>
      <Link to={card.link} className="sring-tile__link">
        <span className="sring-tile__icon-wrap">
          <span className="sring-tile__icon" aria-hidden="true">{card.emoji}</span>
          {card.id === 'academy' && <span className="sring-tile__badge" aria-hidden="true" />}
        </span>
        <span className="sring-tile__title">{card.title}</span>
        <span className="sring-tile__micro">{card.micro}</span>
        <span className="sring-tile__chevron" aria-hidden="true">›</span>
      </Link>
    </li>
  )

  return (
    <div className={`sring${drawn ? ' sring--drawn' : ''}`} ref={sectionRef}>
      {isRing ? (
        /* ── Desktop: implied ring around the central hub ── */
        <div className="sring-stage">
          {/* Gestalt: continuation — single spine path, no visible joins */}
          <svg
            className="sring-svg"
            viewBox="0 0 1000 760"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
            focusable="false"
          >
            <path ref={pathRef} className="sring-spine" d={RING_PATH} />
            {/* Playful: the ball walks the spine as you scroll */}
            <g ref={ballRef} className="sring-ball" transform="translate(500, 80)">
              <circle r="14" className="sring-ball__bg" />
              <text y="6" textAnchor="middle" fontSize="18">⚽</text>
            </g>
          </svg>

          {hub}

          <nav aria-label="Support pathways">
            <ul className="sring-cards" role="list">
              {cards.map((card, i) =>
                tile(card, i, {
                  left: `${RING_POINTS[i].x / 10}%`,
                  top:  `${(RING_POINTS[i].y / 760) * 100}%`,
                })
              )}
            </ul>
          </nav>
        </div>
      ) : (
        /* ── Mobile/tablet: vertical backbone — hub on top, one stroke ── */
        <div className="sring-stack">
          <svg
            className="sring-stack__svg"
            viewBox="0 0 10 100"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            {/* preserveAspectRatio="none" would distort a ball here — the
                backbone alone carries the continuation metaphor on mobile */}
            <path ref={pathRef} className="sring-spine" d={SPINE_PATH} />
          </svg>

          {hub}

          <nav aria-label="Support pathways">
            <ul className="sring-cards sring-cards--stack" role="list">
              {cards.map((card, i) => tile(card, i))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  )
}
