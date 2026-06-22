/**
 * SuccessStoriesPage.jsx, a dedicated home for real player journeys (task G).
 * Linked from the main nav, and mirrored by the block at the bottom of the
 * Pathway page. Reuses the SuccessStories carousel, then lays every story out
 * as a floating glass card so people can browse them all at once.
 */
import SiteLayout from '../components/SiteLayout'
import GlassCard from '../components/GlassCard'
import FloatingSection from '../components/FloatingSection'
import SuccessStories from '../components/pathway/SuccessStories'
import { testimonials } from '../data/pathwayData'
import { useMagnetic, useSpotlight } from '../App.jsx'
import './SuccessStoriesPage.css'

function Hero() {
  const spotRef = useSpotlight()
  const magnetRef = useMagnetic()

  const toStories = () => {
    const el = document.getElementById('all-stories')
    if (!el) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <div
      className="macro-hero"
      ref={spotRef}
      style={{ '--macro-ground': 'radial-gradient(ellipse at 30% 50%, #114b41 0%, #0b2e29 55%, #071a17 100%)' }}
    >
      <div className="macro-hero__inner">
        <span className="macro-hero__eyebrow">Success Stories</span>
        <h1 className="macro-hero__title">They were exactly where you are.</h1>
        <p className="macro-hero__sub">Real players. Real routes back into the game and beyond it.</p>
        <span className="macro-hero__cta-wrap">
          <button type="button" className="macro-hero__cta" onClick={toStories} ref={magnetRef}>
            Read their journeys →
          </button>
        </span>
      </div>
    </div>
  )
}

export default function SuccessStoriesPage() {
  return (
    <SiteLayout>
      <div className="stories-page">
        <Hero />

        {/* Featured carousel */}
        <FloatingSection
          id="featured-story"
          eyebrow="In their words"
          title="One story at a time"
          intro="Swipe or use the arrows. Every one of these started with a single message to a club."
        >
          <SuccessStories stories={testimonials} />
        </FloatingSection>

        {/* Full grid of stories */}
        <section id="all-stories" className="stories-grid-section" aria-labelledby="all-stories-title">
          <div className="stories-grid-section__head">
            <span className="pl-eyebrow">Every journey</span>
            <h2 id="all-stories-title" className="stories-grid-section__title">Browse them all</h2>
            <p className="stories-grid-section__intro">
              Different ages, different starting points, the same truth: leaving the academy is a turn in the road, not the end of it.
            </p>
          </div>

          <ul className="stories-grid" role="list">
            {testimonials.map(story => (
              <li key={story.id}>
                <GlassCard as="article" className="story-tile" interactive>
                  <div className="story-tile__top">
                    <span className="story-tile__avatar" style={{ background: story.avatarColor }} aria-hidden="true">
                      {story.avatarInitial}
                    </span>
                    <span className="story-tile__pathway">{story.pathway}</span>
                  </div>
                  <blockquote className="story-tile__quote">{story.quote}</blockquote>
                  <div className="story-tile__journey">
                    <span className="story-tile__from">{story.from}</span>
                    <span className="story-tile__arrow" aria-hidden="true">→</span>
                    <span className="story-tile__to">{story.to}</span>
                  </div>
                  <footer className="story-tile__by">
                    <strong>{story.name}</strong>
                    <span>{story.position} · {story.year}</span>
                  </footer>
                </GlassCard>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </SiteLayout>
  )
}
