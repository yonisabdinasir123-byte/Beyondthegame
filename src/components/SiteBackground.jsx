/**
 * SiteBackground.jsx, the calm, gently animated multi-gradient field that
 * sits behind the whole site (task J). Four softly blurred colour blobs drift
 * slowly over cool paper, giving every floating section something to float
 * above. Purely decorative, so it's aria-hidden and pointer-transparent.
 *
 * Motion is CSS-driven and freezes entirely under prefers-reduced-motion
 * (see styles/glass.css), it never strobes or distracts.
 */
export default function SiteBackground() {
  return (
    <div className="site-bg" aria-hidden="true">
      <span className="site-bg__blob site-bg__blob--1" />
      <span className="site-bg__blob site-bg__blob--2" />
      <span className="site-bg__blob site-bg__blob--3" />
      <span className="site-bg__blob site-bg__blob--4" />
    </div>
  )
}
