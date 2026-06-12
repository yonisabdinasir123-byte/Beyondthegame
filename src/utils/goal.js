/**
 * goal.js — goal selection + derived milestone progress.
 *
 * Goal gradient: progress, mastery, control — never checkbox theatre.
 * Milestones are DERIVED from real usage signals already stored in
 * localStorage (postcode set, CV drafted, contact added, etc.) so the
 * progress bar always reflects what the user actually did.
 */

import { storage } from './storage'

// ─── Goal definitions ──────────────────────────────────────────────────────────
// Choice architecture: four options only, ordered with the most common
// post-release goal first (anchoring).
export const GOALS = [
  { id: 'find-club',  emoji: '⚽', label: 'Find a Club',  blurb: 'Get back playing at the right level' },
  { id: 'create-cv',  emoji: '📄', label: 'Create a CV',  blurb: 'Show clubs and employers what you can do' },
  { id: 'learn-trade', emoji: '🔧', label: 'Learn a Trade', blurb: 'Earn while you train — no student debt' },
  { id: 'find-job',   emoji: '💼', label: 'Find a Job',   blurb: 'Real roles near you, matched to you' },
]

// ─── Milestone steps per goal ──────────────────────────────────────────────────
// Each step: label (low-context, reading age ~12), href (where to do it),
// and a check against existing storage keys.
const hasItems = (key) => {
  const v = storage.get(key, null)
  return Array.isArray(v) ? v.length > 0 : Boolean(v)
}
const hasDraft = () => {
  const d = storage.get('cv-draft', null)
  return Boolean(d && (d.name || d.currentClub || (d.positions && d.positions.length)))
}
const hasInterests = () =>
  hasItems('ci-subjects') || hasItems('ci-hobbies') || hasItems('ci-skills')

const STEP_DEFS = {
  location:  { label: 'Set your location',        href: '/education',               check: () => hasItems('user-coords') },
  cvStart:   { label: 'Start your CV',            href: '/pathway#cv-builder',      check: hasDraft },
  cvDone:    { label: 'Generate your CV',         href: '/pathway#cv-builder',      check: () => hasItems('cv-done') },
  contact:   { label: 'Add your first contact',   href: '/jobs-careers#networking', check: () => hasItems('net-contacts') },
  moodboard: { label: 'Start your mood board',    href: '/pathway#moodboard',       check: () => { const m = storage.get('moodboard', null); return Boolean(m && m.items && m.items.length) } },
  quals:     { label: 'Enter your qualifications', href: '/education#matcher',      check: () => hasItems('quals-profile') },
  openday:   { label: 'Save a college open day',  href: '/education#colleges',      check: () => hasItems('saved-opendays') },
  interests: { label: 'Tell us your interests',   href: '/jobs-careers#career-explorer', check: hasInterests },
}

const GOAL_STEPS = {
  'find-club':  ['location', 'cvStart', 'cvDone', 'moodboard'],
  'create-cv':  ['cvStart', 'cvDone', 'moodboard', 'contact'],
  'learn-trade': ['quals', 'location', 'openday', 'moodboard'],
  'find-job':   ['interests', 'location', 'cvDone', 'contact'],
}

// ─── Goal state ────────────────────────────────────────────────────────────────
export const getGoal   = () => storage.get('goal', null)
export const clearGoal = () => { storage.remove('goal'); notifyProgress() }

export function setGoal(id) {
  const def = GOALS.find(g => g.id === id)
  if (!def) return
  /* Cialdini: commitment — store the user's own choice, shown back to them */
  storage.set('goal', { id: def.id, label: def.label, emoji: def.emoji, setAt: new Date().toISOString() })
  notifyProgress()
}

// "Not now" is remembered forever — we never re-open the picker modal.
/* No dark patterns: declining once means no nagging */
export const skipGoalPicker = () => storage.set('goal-skipped', new Date().toISOString())
export const goalPickerSkipped = () => Boolean(storage.get('goal-skipped', null))

// ─── Progress derivation ───────────────────────────────────────────────────────
export function deriveProgress() {
  const goal = getGoal()
  if (!goal) return null
  const stepIds = GOAL_STEPS[goal.id] || []
  const steps = stepIds.map(sid => {
    const def = STEP_DEFS[sid]
    return { id: sid, label: def.label, href: def.href, done: def.check() }
  })
  const done = steps.filter(s => s.done).length
  return { goal, steps, done, total: steps.length, next: steps.find(s => !s.done) || null }
}

// ─── One-time celebrations ─────────────────────────────────────────────────────
export function uncelebratedSteps(progress) {
  if (!progress) return []
  const seen = storage.get('celebrated', [])
  return progress.steps.filter(s => s.done && !seen.includes(`${progress.goal.id}:${s.id}`))
}
export function markCelebrated(progress, steps) {
  const seen = storage.get('celebrated', [])
  steps.forEach(s => seen.push(`${progress.goal.id}:${s.id}`))
  storage.set('celebrated', seen)
}

// ─── Live updates within a page ────────────────────────────────────────────────
// Components that change a milestone signal call notifyProgress();
// GoalProgress listens and re-derives without a reload.
export const PROGRESS_EVENT = 'btg:progress'
export function notifyProgress() {
  window.dispatchEvent(new Event(PROGRESS_EVENT))
}

// ─── Haptics ───────────────────────────────────────────────────────────────────
/* Norman: behavioural — physical confirmation; graceful no-op if unsupported */
export function hapticPulse() {
  try { navigator.vibrate?.(10) } catch { /* unsupported — silent */ }
}
