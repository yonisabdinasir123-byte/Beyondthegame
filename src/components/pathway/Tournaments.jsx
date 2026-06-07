const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
  </svg>
)

const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
  </svg>
)

const PinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
)

/** @param {{ tournaments: import('../../data/pathwayData').Tournament[] }} props */
export default function Tournaments({ tournaments }) {
  return (
    <ul className="cards-list" role="list" aria-label="Local tournaments">
      {tournaments.map(t => (
        <li key={t.id} className="tournament-card" role="listitem">
          <div className="tournament-card__header">
            <div>
              <h3 className="tournament-card__name">{t.name}</h3>
              <div className="tournament-card__meta-row">
                <span className="event-card__meta-item"><PinIcon /> {t.location}</span>
              </div>
            </div>
            <div className="tournament-card__badges">
              <span className="tag tag--format">{t.format}</span>
              <span className="badge badge--age">{t.ageCategory}</span>
            </div>
          </div>

          <p className="tournament-card__desc">{t.description}</p>

          <dl className="tournament-card__details">
            <div className="tournament-card__detail-item">
              <dt>Dates</dt>
              <dd>{t.dates}</dd>
            </div>
            <div className="tournament-card__detail-item">
              <dt>Entry</dt>
              <dd>{t.entryType}</dd>
            </div>
            <div className="tournament-card__detail-item">
              <dt>Fee</dt>
              <dd>{t.entryFee}</dd>
            </div>
            <div className="tournament-card__detail-item tournament-card__detail-item--deadline">
              <dt><ClockIcon /> Deadline</dt>
              <dd>{t.registrationDeadline}</dd>
            </div>
          </dl>

          <div className="tournament-card__footer">
            <a href="#" className="card-cta" aria-label={`Register for ${t.name}`}>
              Register now <ArrowIcon />
            </a>
          </div>
        </li>
      ))}
    </ul>
  )
}
