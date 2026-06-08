/**
 * ChecklistPage.jsx — Networking tracker and general checklist hub.
 */
import { Link } from 'react-router-dom'
import NetworkingTracker from '../components/checklist/NetworkingTracker'
import './EducationPage.css'

function PageHeader() {
  return (
    <header className="edu-page-header" role="banner">
      <div className="edu-page-header__inner">
        <Link to="/" className="edu-back-link" aria-label="Back to home">← Home</Link>
        <span className="edu-page-header__title">My Checklist</span>
      </div>
    </header>
  )
}

export default function ChecklistPage() {
  return (
    <>
      <a href="#networking" className="skip-link">Skip to content</a>
      <PageHeader />

      <main>
        <div className="edu-hero">
          <div className="edu-hero__inner">
            <h1 className="edu-hero__title">Networking & Contacts</h1>
            <p className="edu-hero__sub">
              Keep track of everyone you've reached out to — coaches, employers,
              clubs, and contacts. Small conversations can lead to big opportunities.
            </p>
          </div>
        </div>

        <section id="networking" className="edu-section" aria-labelledby="net-heading">
          <div className="edu-section__inner">
            <h2 id="net-heading" className="edu-section__title">Your networking tracker</h2>
            <p className="edu-section__desc">
              Record contacts, track follow-ups, and use the reflective prompts
              to check in with yourself on how your networking is going.
            </p>
            <NetworkingTracker />
          </div>
        </section>
      </main>

      <footer className="edu-footer">
        <p>© 2025 Beyond the Game · Your contacts are saved to this device only.</p>
        <Link to="/" className="edu-footer__link">← Back to home</Link>
      </footer>
    </>
  )
}
