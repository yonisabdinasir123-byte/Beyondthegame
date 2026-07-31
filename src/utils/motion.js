/**
 * motion.js, read a CSS time custom property as milliseconds.
 *
 * The transitions-dev snippets read their timings back out of CSS so the JS
 * stays in sync with the tokens. The catch: a computed custom property is
 * returned in whatever unit the browser serialises it as, and Chromium
 * returns `.15s` for a token authored as `150ms`. A bare parseFloat then
 * yields 0.15, so a close timer set from it fires almost immediately and the
 * closing state never paints.
 *
 * This converts both units correctly and falls back when the property is
 * missing or unparseable.
 */
export function cssDurationMs(name, fallback = 150) {
  if (typeof window === 'undefined') return fallback
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  if (!raw) return fallback
  const value = parseFloat(raw)
  if (Number.isNaN(value)) return fallback
  // `s` only when it is not the `s` of `ms`.
  return /ms\s*$/.test(raw) ? value : /s\s*$/.test(raw) ? value * 1000 : value
}
