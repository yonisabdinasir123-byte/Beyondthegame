/**
 * storage.js, localStorage read/write helpers with JSON parse safety.
 * All keys are prefixed with 'btg:' to avoid collisions.
 */

const PREFIX = 'btg:'

export const storage = {
  get(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(PREFIX + key)
      return raw === null ? defaultValue : JSON.parse(raw)
    } catch {
      return defaultValue
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch {
      // Storage quota exceeded, fail silently
    }
  },

  remove(key) {
    localStorage.removeItem(PREFIX + key)
  },
}

// ─── Typed helpers ────────────────────────────────────────────────────────────
export const today = () => new Date().toISOString().slice(0, 10)

export const formatDate = (iso) => {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

export const isToday     = (iso) => iso === today()
export const isTomorrow  = (iso) => {
  const t = new Date(); t.setDate(t.getDate() + 1)
  return iso === t.toISOString().slice(0, 10)
}
