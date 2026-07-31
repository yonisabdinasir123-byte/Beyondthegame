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
  // `key` is unique per history entry, so it changes even when the path does
  // not. Keying off pathname alone missed the common case of clicking the nav
  // link for the page you are already on (Home while on Home), which left the
  // reader stranded where they were.
  const { pathname, hash, key } = useLocation()

  // The browser restores the previous scroll position on a history entry
  // asynchronously, which lands AFTER our reset and undoes it. Owning scroll
  // ourselves is the only way to make the reset stick.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      const prev = window.history.scrollRestoration
      window.history.scrollRestoration = 'manual'
      return () => { window.history.scrollRestoration = prev }
    }
  }, [])

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
    // Plain navigation: land at the very top, instantly.
    // Re-assert over the next two frames. Pages whose content settles after
    // mount (reveal animations, late layout) can otherwise drift a hundred
    // pixels down before the reader sees anything. Cancelled if the reader
    // scrolls in the meantime, so we never fight a deliberate scroll.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

    let frames = 0
    let raf = 0
    const settle = () => {
      if (window.scrollY > 0) window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      if (++frames < 2) raf = requestAnimationFrame(settle)
    }
    raf = requestAnimationFrame(settle)

    const cancel = () => { cancelAnimationFrame(raf); frames = 2 }
    window.addEventListener('wheel', cancel, { passive: true, once: true })
    window.addEventListener('touchstart', cancel, { passive: true, once: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('wheel', cancel)
      window.removeEventListener('touchstart', cancel)
    }
  }, [pathname, hash, key])

  return null
}
