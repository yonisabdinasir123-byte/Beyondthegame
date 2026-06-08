/**
 * CareerSuggesterPage.jsx — Interests-to-career suggester.
 *
 * ANTHROPIC API (optional):
 *   Set VITE_ENABLE_AI_CAREERS=true and configure a backend proxy at POST /api/career-suggest.
 *   The proxy should call claude-sonnet-4-20250514 and return enriched suggestions.
 *   Falls back to the local rules dataset if the API call fails or flag is off.
 *
 * UK Gov Occupational Maps:
 *   https://occupational-maps.skillsengland.education.gov.uk
 *   Future integration: enrich needs[] and pathway[] with live occupational data.
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import InterestsForm from '../components/careers/InterestsForm'
import CareerResults from '../components/careers/CareerResults'
import './EducationPage.css'

function PageHeader() {
  return (
    <header className="edu-page-header" role="banner">
      <div className="edu-page-header__inner">
        <Link to="/" className="edu-back-link" aria-label="Back to home">← Home</Link>
        <span className="edu-page-header__title">Career Suggester</span>
      </div>
    </header>
  )
}

export default function CareerSuggesterPage() {
  const [ruleMatches,    setRuleMatches]    = useState([])
  const [aiSuggestions,  setAiSuggestions]  = useState(null)
  const [hasSearched,    setHasSearched]    = useState(false)

  const handleResults = (rules, ai) => {
    setRuleMatches(rules)
    setAiSuggestions(ai)
    setHasSearched(true)
    // Scroll to results
    setTimeout(() => {
      const el = document.getElementById('career-results-anchor')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <>
      <a href="#form" className="skip-link">Skip to content</a>
      <PageHeader />

      <main>
        <div className="edu-hero">
          <div className="edu-hero__inner">
            <h1 className="edu-hero__title">What could you be good at?</h1>
            <p className="edu-hero__sub">
              Tell us what you're into — subjects, hobbies, skills — and we'll
              suggest some realistic careers worth exploring.
            </p>
          </div>
        </div>

        <section id="form" className="edu-section" aria-labelledby="form-heading">
          <div className="edu-section__inner edu-section__inner--narrow">
            <h2 id="form-heading" className="edu-section__title">Your interests</h2>
            <InterestsForm onResults={handleResults} />
          </div>
        </section>

        <div id="career-results-anchor" tabIndex={-1} style={{ outline: 'none' }} />

        {hasSearched && (
          <section className="edu-section edu-section--alt" aria-label="Career suggestions">
            <div className="edu-section__inner">
              <CareerResults ruleMatches={ruleMatches} aiSuggestions={aiSuggestions} />
            </div>
          </section>
        )}
      </main>

      <footer className="edu-footer">
        <p>© 2025 Beyond the Game · Suggestions are a starting point, not career advice.</p>
        <Link to="/" className="edu-footer__link">← Back to home</Link>
      </footer>
    </>
  )
}
