/**
 * StoryCarousel.jsx — swipeable peer-story carousel.
 *
 * Built on native CSS scroll-snap: touch swipe works with zero JS touch
 * handlers (sustainable HCI — no listener overhead), and the partially
 * visible next card is a Gestalt closure cue ("there's more").
 * Arrow buttons are the keyboard/assistive fallback — gestures never
 * stand alone.
 */
import { useRef, useState, useEffect } from 'react'
import './behaviour.css'

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

  return (
    <div className="story-carousel">
      <div
        className="story-carousel__track"
        ref={trackRef}
        tabIndex={0}
        role="region"
        aria-label="Peer stories — scroll or use the arrow buttons"
      >
        {items.map((t, i) => (
          <blockquote key={i} className="testimonial story-carousel__card">
            <span className="testimonial__mark" aria-hidden="true">"</span>
            <p className="testimonial__text">{t.text}</p>
            <footer className="testimonial__footer">
              <div className="testimonial__avatar" aria-hidden="true">{t.initial}</div>
              <div>
                <div className="testimonial__name">{t.name}</div>
                <div className="testimonial__detail">{t.detail}</div>
              </div>
            </footer>
          </blockquote>
        ))}
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
