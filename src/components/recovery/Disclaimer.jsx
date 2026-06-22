export default function Disclaimer() {
  return (
    <aside
      className="rec-disclaimer"
      role="note"
      aria-label="Important health information"
    >
      <span className="rec-disclaimer__icon" aria-hidden="true">ℹ️</span>
      <div className="rec-disclaimer__text">
        <strong>This page provides general signposting only</strong>, it is not a
        substitute for professional medical advice. If you have an urgent health
        concern, call{' '}
        <a href="tel:111" className="rec-disclaimer__link">
          111
        </a>{' '}
        (NHS non-emergency). In an emergency, call{' '}
        <a href="tel:999" className="rec-disclaimer__link rec-disclaimer__link--urgent">
          999
        </a>{' '}
        or go to your nearest A&amp;E.
      </div>
    </aside>
  )
}
