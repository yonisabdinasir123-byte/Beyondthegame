/**
 * EmployabilityPage.jsx — Browse active job adverts with field + distance filters.
 *
 * API INTEGRATION:
 *   Replace `jobAdverts` import with Reed.co.uk API results:
 *   GET https://www.reed.co.uk/api/1.0/search
 *     ?keywords={fieldFilter}&locationName={userPostcode}&distanceFromLocation={radiusMiles}
 *   The field select and radius tabs below map directly onto those Reed params.
 */
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { jobAdverts } from '../data/educationData'
import { storage }    from '../utils/storage'
import { DEFAULT_COORDS } from '../utils/distance'
import JobAdverts from '../components/employability/JobAdverts'
import './EducationPage.css'

function PageHeader() {
  return (
    <header className="edu-page-header" role="banner">
      <div className="edu-page-header__inner">
        <Link to="/" className="edu-back-link" aria-label="Back to home">← Home</Link>
        <span className="edu-page-header__title">Employability Hub</span>
      </div>
    </header>
  )
}

export default function EmployabilityPage() {
  const [userCoords] = useState(() => storage.get('user-coords', DEFAULT_COORDS))

  return (
    <>
      <a href="#jobs" className="skip-link">Skip to content</a>
      <PageHeader />

      <main>
        <div className="edu-hero">
          <div className="edu-hero__inner">
            <h1 className="edu-hero__title">Active Job Adverts</h1>
            <p className="edu-hero__sub">
              Real roles you can apply for right now — across coaching, construction,
              security, health care, logistics, and retail. Filter by what interests you.
            </p>
          </div>
        </div>

        <section id="jobs" className="edu-section" aria-labelledby="jobs-heading">
          <div className="edu-section__inner">
            <h2 id="jobs-heading" className="edu-section__title">Jobs near you</h2>
            <p className="edu-section__desc">
              These adverts are powered by Reed.co.uk. Set your postcode on the{' '}
              <Link to="/education" className="edu-inline-link">Education page</Link>{' '}
              to get the most accurate distance results.
            </p>
            <div className="edu-reed-note" role="note">
              <strong>📡 Live data note:</strong> These are seed/demo records.
              When wired to the Reed API, this page will show real live vacancies
              filtered by your postcode and field of interest.
            </div>
            <JobAdverts adverts={jobAdverts} userCoords={userCoords} />
          </div>
        </section>
      </main>

      <footer className="edu-footer">
        <p>© 2025 Beyond the Game · Job listings provided for guidance only.</p>
        <Link to="/" className="edu-footer__link">← Back to home</Link>
      </footer>
    </>
  )
}
