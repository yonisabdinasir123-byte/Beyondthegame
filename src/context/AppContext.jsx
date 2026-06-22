/**
 * AppContext.jsx, shared, persisted app state across every page.
 *
 * Holds the lightweight personalisation state that should follow the user
 * around the site and survive navigation / reloads:
 *   • releaseStage, when they left the academy ('16' | '18' | '21+')
 *   • interests, chosen interest tags (drives career suggestions)
 *   • saved, saved items (events, contacts, clubs…) keyed by kind
 *
 * Persistence reuses the existing btg: localStorage helper so it sits
 * alongside the goal system rather than competing with it.
 */
import { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react'
import { storage } from '../utils/storage'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [releaseStage, setReleaseStageState] = useState(() => storage.get('release-stage', null))
  const [interests, setInterestsState]       = useState(() => storage.get('app-interests', []))
  const [saved, setSavedState]               = useState(() => storage.get('app-saved', {}))

  // ── Persist on change ──────────────────────────────────────────────
  useEffect(() => { storage.set('release-stage', releaseStage) }, [releaseStage])
  useEffect(() => { storage.set('app-interests', interests) }, [interests])
  useEffect(() => { storage.set('app-saved', saved) }, [saved])

  const setReleaseStage = useCallback((stage) => setReleaseStageState(stage), [])

  const toggleInterest = useCallback((tag) => {
    setInterestsState(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }, [])

  // Saved items are grouped by kind ('events', 'contacts', 'clubs', …).
  // Each item needs a stable `id`. Toggling adds or removes it.
  const toggleSaved = useCallback((kind, item) => {
    setSavedState(prev => {
      const list = prev[kind] || []
      const exists = list.some(i => i.id === item.id)
      const next = exists ? list.filter(i => i.id !== item.id) : [...list, item]
      return { ...prev, [kind]: next }
    })
  }, [])

  const isSaved = useCallback(
    (kind, id) => (saved[kind] || []).some(i => i.id === id),
    [saved]
  )

  const savedCount = useMemo(
    () => Object.values(saved).reduce((n, list) => n + (list?.length || 0), 0),
    [saved]
  )

  const value = useMemo(() => ({
    releaseStage, setReleaseStage,
    interests, toggleInterest,
    saved, toggleSaved, isSaved, savedCount,
  }), [releaseStage, setReleaseStage, interests, toggleInterest, saved, toggleSaved, isSaved, savedCount])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within <AppProvider>')
  return ctx
}

export default AppContext
