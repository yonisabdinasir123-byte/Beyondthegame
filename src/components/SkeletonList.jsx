/**
 * SkeletonList.jsx, the loading placeholder for the live-data sections
 * (jobs, colleges, events).
 *
 * A spinner tells you something is happening. A skeleton tells you what is
 * coming: rows the same shape and size as the results that will replace them,
 * so the layout does not jump and the wait feels shorter.
 *
 * Uses the transitions-dev skeleton hooks: each row is a fixed-height `.t-skel`
 * wrap whose `.t-skel-skeleton` layer carries `.is-pulsing`, which drives the
 * shared `t-skel-pulse` keyframes. Every bar is aria-hidden; the visible
 * status message next to it is what screen readers announce.
 */
export default function SkeletonList({ rows = 3, label = 'Loading' }) {
  return (
    <div className="skel-list" role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      {Array.from({ length: rows }, (_, i) => (
        <div className="t-skel skel-row" key={i} aria-hidden="true">
          <div className="t-skel-skeleton is-pulsing skel-row__inner">
            <span className="skel-bar skel-bar--title" />
            <span className="skel-bar skel-bar--meta" />
            <span className="skel-bar skel-bar--line" />
          </div>
        </div>
      ))}
    </div>
  )
}
