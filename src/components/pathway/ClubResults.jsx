const PinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
)

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
  </svg>
)

/** @param {{ tier: string }} props */
function TierBadge({ tier }) {
  const cls = {
    Grassroots:    'badge badge--grassroots',
    'Semi-Pro':    'badge badge--semipro',
    'Pro Academy': 'badge badge--proacademy',
  }[tier] || 'badge'
  return <span className={cls}>{tier}</span>
}

/** @param {{ group: string }} props */
function AgeBadge({ group }) {
  return <span className={`badge badge--age badge--${group.toLowerCase()}`}>{group}</span>
}

/** @param {{ clubs: import('../../data/pathwayData').Club[] }} props */
export default function ClubResults({ clubs }) {
  if (clubs.length === 0) {
    return (
      <div className="empty-state" role="status" aria-live="polite">
        <span className="empty-state__icon" aria-hidden="true">🔍</span>
        <h3 className="empty-state__title">No clubs match your search</h3>
        <p className="empty-state__text">
          Try adjusting your filters or clearing the search to see all clubs.
        </p>
      </div>
    )
  }

  return (
    <ul className="cards-list" role="list" aria-label="Club results">
      {clubs.map(club => (
        <li key={club.id} className="club-card" role="listitem">
          <div className="club-card__header">
            <div className="club-card__avatar" aria-hidden="true">
              {club.name.charAt(0)}
            </div>
            <div className="club-card__header-text">
              <h3 className="club-card__name">{club.name}</h3>
              <div className="club-card__meta">
                <span className="club-card__location">
                  <PinIcon /> {club.location}
                </span>
              </div>
            </div>
            <TierBadge tier={club.tier} />
          </div>

          <p className="club-card__description">{club.description}</p>

          <div className="club-card__tags">
            <span className="tags-label">Recruiting:</span>
            {club.ageGroups.map(g => <AgeBadge key={g} group={g} />)}
          </div>

          <div className="club-card__tags">
            <span className="tags-label">Positions:</span>
            <div className="tag-row">
              {club.positions.map(p => (
                <span key={p} className="tag tag--position">{p}</span>
              ))}
            </div>
          </div>

          <div className="club-card__footer">
            <a href={club.website} className="card-cta" aria-label={`Register interest in ${club.name}`}>
              Register interest <ArrowIcon />
            </a>
          </div>
        </li>
      ))}
    </ul>
  )
}
