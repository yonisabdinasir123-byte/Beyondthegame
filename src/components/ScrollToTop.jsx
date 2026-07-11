/**
 * ScrollToTop.jsx, scroll management for route changes.
 *
 * React Router keeps the previous scroll position when the path changes, so
 * without this a nav click can land the reader mid-page. On every pathname
 * change we jump straight to the top, instantly on purpose: arriving on a new
 * page mid-animation reads as broken, and an instant reset is also exactly
 * what prefers-reduced-motion asks for.
 *
 * Hash links (/#section) are left to the browser + the global CSS
 * `scroll-behavior: smooth`, which index.css already downgrades to `auto`
 * under prefers-reduced-motion. We just make sure the target exists after
 * the route renders.
 */
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // New route + hash: wait a frame for the section to exist, then let the
      // CSS scroll-behavior decide smooth vs instant.
      const id = hash.slice(1)
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ block: 'start' })
      })
      return
    }
    // Plain route change: land at the very top, instantly.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}
