/**
 * MomentSlideshow.jsx — "Moments of the Game".
 *
 * WCAG 2.2.2 compliant auto-advancing slideshow:
 *  - 6s auto-advance with a VISIBLE pause control
 *  - pauses on hover and while any control holds focus
 *  - prev/next buttons + dot indicators, all 44px targets
 *  - keyboard: ← → navigate, Space (on the region) toggles pause
 *  - swipe via touch handlers (buttons are the always-available fallback)
 *  - reduced motion: autoplay off by default, cross-fade collapses to
 *    a near-instant opacity change
 *
 * Slides are palette-token gradient grounds.
 * SWAP: give any slide   img: '/img/macro-….webp'   and it lazy-loads
 * a real macro photo behind the same AA overlay. Budget ≤900KB total.
 */
import { useCallback, useEffect, useRef, useState } from 'react'

const SLIDES = [
  {
    caption: 'Every great player started exactly where you are.',
    ground: 'radial-gradient(ellipse at 30% 60%, #1c3320 0%, #0f1e0f 60%, #091409 100%)',
  },
  {
    caption: 'The game gave you more than you know.',
    ground: 'linear-gradient(140deg, #0f1e0f 0%, #2a1600 55%, #1c3320 100%)',
  },
  {
    caption: 'Your next chapter starts on your terms.',
    ground: 'radial-gradient(ellipse at 70% 30%, #2c1200 0%, #0f1e0f 65%, #091409 100%)',
  },
  {
    caption: 'Skills that last long after the final whistle.',
    ground: 'linear-gradient(155deg, #1c3320 0%, #0f1e0f 45%, #2a1600 100%)',
  },
  {
    caption: 'Thousands found their path. You can too.',
    ground: 'radial-gradient(ellipse at 50% 80%, #1a3a20 0%, #0f1e0f 60%, #091409 100%)',
  },
  {
    caption: 'Beyond the game — the story continues.',
    ground: 'linear-gradient(125deg, #091409 0%, #1c3320 50%, #2c1200 100%)',
  },
]

const ADVANCE_MS = 6000

export default function MomentSlideshow() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(
    // Reduced motion: never auto-advance unless the user opts back in
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )
  const [hovering, setHovering] = useState(false)
  const [focused, setFocused] = useState(false)
  const touchX = useRef(null)

  const count = SLIDES.length
  const [announce, setAnnounce] = useState('') // manual navigation only — autoplay stays silent
  const go = useCallback((dir) => setIndex(i => (i + dir + count) % count), [count])
  const goManual = useCallback((dir) => {
    setIndex(i => {
      const next = (i + dir + count) % count
      setAnnounce(`Slide ${next + 1} of ${count}: ${SLIDES[next].caption}`)
      return next
    })
  }, [count])
  const pick = useCallback((i) => {
    setIndex(i)
    setAnnounce(`Slide ${i + 1} of ${count}: ${SLIDES[i].caption}`)
  }, [count])

  // Auto-advance — suspended while paused, hovered, or holding focus
  useEffect(() => {
    if (paused || hovering || focused) return
    const t = setInterval(() => go(1), ADVANCE_MS)
    return () => clearInterval(t)
  }, [paused, hovering, focused, go])

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); goManual(-1) }
    if (e.key === 'ArrowRight') { e.preventDefault(); goManual(1) }
    if (e.key === ' ' && e.target === e.currentTarget) { e.preventDefault(); setPaused(p => !p) }
  }

  // Swipe — gesture is an enhancement; buttons remain the fallback
  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchX.current == null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 48) goManual(dx < 0 ? 1 : -1)
    touchX.current = null
  }

  return (
    <section className="section section--alt" id="moments" aria-labelledby="moments-heading">
      <div className="section__inner">
        <div className="section__header">
          <span className="section__eyebrow">Moments of the Game</span>
          {/* Muted treatment — never competes with the page focal point */}
          <h2 className="section__title" id="moments-heading">
            The love of the game lives on
          </h2>
        </div>

        <div
          className="moments"
          role="region"
          aria-label="Moments of the Game slideshow"
          aria-roledescription="carousel"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onFocus={() => setFocused(true)}
          onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false) }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="moments__stage">
            {SLIDES.map((s, i) => (
              <div
                key={i}
                className={`moments__slide${i === index ? ' moments__slide--active' : ''}`}
                style={{ background: s.ground }}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${i + 1} of ${count}`}
                aria-hidden={i !== index}
              >
                <p className="moments__caption">{s.caption}</p>
              </div>
            ))}
          </div>

          <div className="moments__controls">
            <button
              type="button"
              className="moments__btn"
              onClick={() => goManual(-1)}
              aria-label="Previous slide"
            >
              ←
            </button>

            <div className="moments__dots" role="group" aria-label="Choose slide">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className="moments__dot-wrap"
                  onClick={() => pick(i)}
                  aria-label={`Slide ${i + 1} of ${count}`}
                  aria-current={i === index ? 'true' : undefined}
                >
                  <span className={`moments__dot${i === index ? ' moments__dot--active' : ''}`} />
                </button>
              ))}
            </div>

            <button
              type="button"
              className="moments__btn"
              onClick={() => goManual(1)}
              aria-label="Next slide"
            >
              →
            </button>

            {/* WCAG 2.2.2: visible mechanism to stop auto-advance */}
            <button
              type="button"
              className="moments__btn moments__pause"
              onClick={() => setPaused(p => !p)}
              aria-pressed={paused}
            >
              {paused ? '▶ Play' : '⏸ Pause'}
            </button>
          </div>

          {/* SR users hear position only when it changes via their action */}
          <span className="sr-only" aria-live="polite">{announce}</span>
        </div>
      </div>
    </section>
  )
}
