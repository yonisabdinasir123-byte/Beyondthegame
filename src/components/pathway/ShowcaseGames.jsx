const CalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
  </svg>
)

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

function formatDate(iso) {
  const d = new Date(iso)
  const day = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  return `${day} · ${time}`
}

/** @param {{ games: import('../../data/pathwayData').ShowcaseGame[] }} props */
export default function ShowcaseGames({ games }) {
  return (
    <ul className="cards-list" role="list" aria-label="Upcoming showcase games">
      {games.map(game => (
        <li key={game.id} className="event-card" role="listitem">
          <div className="event-card__level-bar" data-level={game.level} aria-hidden="true" />

          <div className="event-card__body">
            <div className="event-card__top">
              <h3 className="event-card__title">{game.title}</h3>
              <span className={`badge badge--age badge--${game.ageGroup.toLowerCase()}`}>
                {game.ageGroup}
              </span>
            </div>

            <div className="event-card__meta-row">
              <span className="event-card__meta-item">
                <CalIcon /> {formatDate(game.date)}
              </span>
              <span className="event-card__meta-item">
                <PinIcon /> {game.location}
              </span>
            </div>

            <p className="event-card__desc">{game.description}</p>

            <div className="event-card__tags-row">
              <div className="tag-row">
                {game.positionsScouted.map(p => (
                  <span key={p} className="tag tag--position">{p}</span>
                ))}
              </div>
              <span className="tag tag--level">{game.level}</span>
            </div>

            <div className="event-card__footer">
              <span
                className={`spots-badge${game.spotsRemaining <= 5 ? ' spots-badge--urgent' : ''}`}
                aria-label={`${game.spotsRemaining} spots remaining`}
              >
                {game.spotsRemaining <= 5 ? '🔥 ' : ''}{game.spotsRemaining} spot{game.spotsRemaining !== 1 ? 's' : ''} left
              </span>
              <a href="#" className="card-cta" aria-label={`Register interest in ${game.title}`}>
                Register interest <ArrowIcon />
              </a>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
