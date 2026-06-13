/**
 * ThemeContext.jsx — single source of truth for design tokens in JS.
 *
 * The canonical tokens live as CSS custom properties in App.css (:root).
 * This context mirrors the ones components may need to read in JavaScript
 * (e.g. to colour an inline SVG, drive a canvas, or theme a chart) so we
 * never hardcode a hex value in a component. Keep this in sync with :root.
 *
 * Usage:
 *   const { color, space, radius, font } = useTheme()
 *   <svg fill={color.primary} />
 */
import { createContext, useContext, useMemo } from 'react'

// Mirrors :root in App.css. Resolved hex values so JS consumers don't have
// to read computed styles. CSS remains the source of truth for styling.
const TOKENS = {
  color: {
    primary:       '#12897A',
    primaryStrong: '#0B5A50',
    primaryDeep:   '#06322D',
    accent:        '#FF6A4D',
    accentStrong:  '#EA4A2C',
    pop:           '#C8F24E',
    ink:           '#0B1F1D',
    paper:         '#F3F6F4',
    surface:       '#FFFFFF',
    onPrimary:     '#FFFFFF',
    onDark:        '#EAF3EF',
    onDarkMuted:   '#91B3AB',
  },
  space: {
    1: '0.25rem', 2: '0.5rem', 3: '0.75rem', 4: '1rem',
    5: '1.5rem', 6: '2rem', 7: '3rem', 8: '4.5rem', 9: '7rem',
  },
  radius: { sm: '0.5rem', md: '0.875rem', lg: '1.25rem', xl: '1.75rem', pill: '9999px' },
  font: {
    heading: "'Bricolage Grotesque', system-ui, sans-serif",
    body:    "'Hanken Grotesk', system-ui, sans-serif",
    condensed: "'Barlow Condensed', system-ui, sans-serif",
  },
  motion: {
    easeOutSoft: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
    easeInOut:   'cubic-bezier(0.45, 0, 0.25, 1)',
    durMicro: 120, durStd: 240, durLarge: 400, durScene: 600,
  },
}

const ThemeContext = createContext(TOKENS)

export function ThemeProvider({ children }) {
  // Tokens are static, so memoise the identity to keep consumers stable.
  const value = useMemo(() => TOKENS, [])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
export default ThemeContext
