/**
 * StoryCarousel.jsx — swipeable peer-story carousel.
 *
 * Built on native CSS scroll-snap: touch swipe works with zero JS touch
 * handlers (sustainable HCI — no listener overhead), and the partially
 * visible next card is a Gestalt closure cue ("there's more").
 * Arrow buttons are the keyboard/assistive fallback — gestures never
 * stand alone.
 *
 * Cards are tappable links to the Stories section — full affordance set,
 * desktop-only 3D tilt (±4°), amber→terracotta border sweep on hover.
 */
import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './behaviour.css'

// Desktop-pointer + motion-OK gate, evaluated per event (cheap matchMedia)
const tiltAllowed = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function StoryCarousel({ items }) {
  const trackRef = useRef(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  // Track scroll position to disable arrows at the ends (honest affordances).
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const update = () => {
      setCanPrev(track.scrollLeft > 8)
      setCanNext(track.scrollLeft < track.scrollWidth - track.clientWidth - 8)
    }
    update()
    track.addEventListener('scroll', update, { passive: true })
    return () => track.removeEventListener('scroll', update)
  }, [])

  const scrollByCard = (dir) => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector('.story-carousel__card')
    const step = card ? card.offsetWidth + 16 : 300
    track.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  /* 2D/3D mix: ±4° tilt toward the cursor — desktop pointer only,
     decoration never information */
  const handleTilt = (e) => {
    if (!tiltAllowed()) return
    const card = e.currentTarget
    const r = card.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    card.style.setProperty('--tilt-x', `${(-y * 8).toFixed(2)}deg`)
    card.style.setProperty('--tilt-y', `${(x * 8).toFixed(2)}deg`)
  }
  const resetTilt = (e) => {
    e.currentTarget.style.removeProperty('--tilt-x')
    e.currentTarget.style.removeProperty('--tilt-y')
  }

  return (
    <div className="story-carousel">
      <div
        className="story-carousel__track"
        ref={trackRef}
        tabIndex={0}
        role="region"
        aria-label="Peer stories — scroll or use the arrow buttons"
      >
        {items.map((t, i) => {
          const firstName = t.name.split(',')[0].trim()
          return (
            <Link
              key={i}
              to="/pathway#stories"
              className="story-carousel__card story-card-link"
              aria-label={`Read ${firstName}'s story`}
              onMouseMove={handleTilt}
              onMouseLeave={resetTilt}
            >
              <blockquote className="testimonial story-card-link__quote">
                <span className="testimonial__mark" aria-hidden="true">"</span>
                <p className="testimonial__text">{t.text}</p>
                <footer className="testimonial__footer">
                  <div className="testimonial__avatar" aria-hidden="true">{t.initial}</div>
                  <div>
                    <div className="testimonial__name">{t.name}</div>
                    <div className="testimonial__detail">{t.detail}</div>
                  </div>
                </footer>
                {/* Affordance label: the card says what tapping it does */}
                <span className="story-card-link__cta" aria-hidden="true">
                  Read their story →
                </span>
              </blockquote>
            </Link>
          )
        })}
      </div>

      {/* Button fallback — 44px targets, works without touch or hover */}
      <div className="story-carousel__nav">
        <button
          type="button"
          className="story-carousel__arrow"
          onClick={() => scrollByCard(-1)}
          disabled={!canPrev}
          aria-label="Previous story"
        >
          ←
        </button>
        <button
          type="button"
          className="story-carousel__arrow"
          onClick={() => scrollByCard(1)}
          disabled={!canNext}
          aria-label="Next story"
        >
          →
        </button>
      </div>
    </div>
  )
}
