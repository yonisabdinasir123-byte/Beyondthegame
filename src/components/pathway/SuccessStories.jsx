import { useState, useEffect, useRef, useCallback } from 'react'

const AUTO_ADVANCE_MS = 5000

const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/>
  </svg>
)

const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
  </svg>
)

/** @param {{ stories: import('../../data/pathwayData').Testimonial[] }} props */
export default function SuccessStories({ stories }) {
  const [current, setCurrent]   = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const touchStartX = useRef(null)
  const trackRef    = useRef(null)

  // Detect prefers-reduced-motion once
  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  const total = stories.length

  const goTo = useCallback((index) => {
    const next = (index + total) % total
    if (reducedMotion.current) {
      setCurrent(next)
      return
    }
    setIsAnimating(true)
    setCurrent(next)
    setTimeout(() => setIsAnimating(false), 400)
  }, [total])

  const goPrev = useCallback(() => goTo(current - 1), [current, goTo])
  const goNext = useCallback(() => goTo(current + 1), [current, goTo])

  // Auto-advance
  useEffect(() => {
    if (isPaused || reducedMotion.current) return
    const timer = setInterval(goNext, AUTO_ADVANCE_MS)
    return () => clearInterval(timer)
  }, [isPaused, goNext])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft')  goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    const el = trackRef.current
    el?.addEventListener('keydown', onKey)
    return () => el?.removeEventListener('keydown', onKey)
  }, [goPrev, goNext])

  // Touch / swipe
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd   = (e) => {
    if (touchStartX.current === null) return
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(delta) > 40) delta > 0 ? goNext() : goPrev()
    touchStartX.current = null
  }

  return (
    <div
      className="carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Success stories"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* Track */}
      <div
        className="carousel__viewport"
        ref={trackRef}
        tabIndex={0}
        aria-label="Use arrow keys to navigate slides"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className={`carousel__track${isAnimating ? ' carousel__track--animating' : ''}`}
          style={{ transform: `translateX(-${current * 100}%)` }}
          aria-live={isPaused ? 'off' : 'polite'}
        >
          {stories.map((story, i) => (
            <article
              key={story.id}
              className="carousel__slide"
              aria-roledescription="slide"
              aria-label={`Slide ${i + 1} of ${total}: ${story.name}`}
              aria-hidden={i !== current}
            >
              <div className="story-card">
                {/* Left: avatar + pathway */}
                <div className="story-card__sidebar">
                  <div
                    className="story-card__avatar"
                    style={{ background: story.avatarColor }}
                    aria-hidden="true"
                  >
                    {story.avatarInitial}
                  </div>
                  <span className="story-card__pathway-badge">{story.pathway}</span>
                </div>

                {/* Right: content */}
                <div className="story-card__content">
                  <blockquote className="story-card__quote">
                    <span className="story-card__open-quote" aria-hidden="true">"</span>
                    {story.quote}
                  </blockquote>

                  <footer className="story-card__footer">
                    <div className="story-card__journey">
                      <span className="story-card__from">{story.from}</span>
                      <span className="story-card__arrow" aria-hidden="true">→</span>
                      <span className="story-card__to">{story.to}</span>
                    </div>
                    <div className="story-card__attribution">
                      <strong className="story-card__name">{story.name}</strong>
                      <span className="story-card__detail">
                        {story.position} · {story.year}
                      </span>
                    </div>
                  </footer>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="carousel__controls">
        <button
          type="button"
          className="carousel__arrow carousel__arrow--prev"
          onClick={goPrev}
          aria-label="Previous story"
        >
          <ChevronLeft />
        </button>

        {/* Dot indicators */}
        <div className="carousel__dots" role="tablist" aria-label="Slides">
          {stories.map((story, i) => (
            <button
              key={story.id}
              type="button"
              role="tab"
              className={`carousel__dot${i === current ? ' active' : ''}`}
              aria-selected={i === current}
              aria-label={`Go to slide ${i + 1}: ${story.name}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>

        <button
          type="button"
          className="carousel__arrow carousel__arrow--next"
          onClick={goNext}
          aria-label="Next story"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Slide counter */}
      <p className="carousel__counter" aria-live="polite" aria-atomic="true">
        {current + 1} / {total}
      </p>
    </div>
  )
}
