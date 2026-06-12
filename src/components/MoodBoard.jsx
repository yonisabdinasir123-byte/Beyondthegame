/**
 * MoodBoard.jsx — "Who are you becoming?" role-scheme builder.
 *
 * Norman: reflective — identity visualisation is the deepest motivator.
 * The user assembles a board of role cards representing their future self.
 *
 * Interaction: tap to add/remove (primary, works for everyone);
 * ▲▼ buttons reorder (keyboard/assistive tech); HTML5 drag is an
 * enhancement only. Emoji cards, no image downloads (sustainable HCI).
 */
import { useState, useRef } from 'react'
import { storage } from '../utils/storage'
import { notifyProgress, hapticPulse } from '../utils/goal'
import './behaviour.css'

// Curated palette — grouped, limited choices. /* Choice architecture */
const ROLE_CARDS = [
  { id: 'coach',      emoji: '📋', label: 'Coach' },
  { id: 'captain',    emoji: '🧢', label: 'Captain' },
  { id: 'semipro',    emoji: '⚽', label: 'Semi-Pro Player' },
  { id: 'scout',      emoji: '🔭', label: 'Scout' },
  { id: 'apprentice', emoji: '🛠️', label: 'Apprentice' },
  { id: 'electrician', emoji: '⚡', label: 'Electrician' },
  { id: 'student',    emoji: '🎓', label: 'Student' },
  { id: 'physio',     emoji: '🩺', label: 'Physio' },
  { id: 'pt',         emoji: '💪', label: 'Personal Trainer' },
  { id: 'analyst',    emoji: '📊', label: 'Analyst' },
  { id: 'owner',      emoji: '🏪', label: 'Business Owner' },
  { id: 'creator',    emoji: '🎥', label: 'Content Creator' },
  { id: 'mentor',     emoji: '🤝', label: 'Mentor' },
  { id: 'volunteer',  emoji: '🧡', label: 'Volunteer' },
  { id: 'referee',    emoji: '🟨', label: 'Referee' },
  { id: 'leader',     emoji: '🗣️', label: 'Community Leader' },
]

export default function MoodBoard() {
  const [items, setItems] = useState(() => storage.get('moodboard', { items: [] }).items)
  const [announce, setAnnounce] = useState('')
  const dragIndex = useRef(null)

  const save = (next) => {
    setItems(next)
    storage.set('moodboard', { items: next })
    notifyProgress() /* milestone signal: board started */
  }

  const onBoard = (id) => items.some(i => i.id === id)

  const add = (card) => {
    if (onBoard(card.id)) return
    save([...items, card])
    setAnnounce(`${card.label} added to your board.`)
    hapticPulse()
  }

  const remove = (id) => {
    const card = items.find(i => i.id === id)
    save(items.filter(i => i.id !== id))
    setAnnounce(`${card?.label || 'Card'} removed from your board.`)
  }

  const move = (index, dir) => {
    const to = index + dir
    if (to < 0 || to >= items.length) return
    const next = [...items]
    ;[next[index], next[to]] = [next[to], next[index]]
    save(next)
    setAnnounce(`${next[to].label} moved ${dir < 0 ? 'up' : 'down'}. Position ${to + 1} of ${next.length}.`)
  }

  // HTML5 drag — enhancement only; ▲▼ buttons are the guaranteed path.
  const handleDragStart = (i) => () => { dragIndex.current = i }
  const handleDragOver  = (e) => e.preventDefault()
  const handleDrop = (i) => (e) => {
    e.preventDefault()
    const from = dragIndex.current
    if (from === null || from === i) return
    const next = [...items]
    const [moved] = next.splice(from, 1)
    next.splice(i, 0, moved)
    save(next)
    setAnnounce(`${moved.label} moved to position ${i + 1} of ${next.length}.`)
    dragIndex.current = null
  }

  return (
    <div className="moodboard">
      {/* Priming: future-self language before the choice */}
      <p className="moodboard__intro">
        Pick the roles that feel like your future. Your board saves automatically.
      </p>

      {/* ── My board ── */}
      <div className="moodboard__board" aria-label="My mood board">
        <h3 className="moodboard__heading">My board {items.length > 0 && `· ${items.length}`}</h3>
        {items.length === 0 ? (
          <p className="moodboard__empty">Empty so far. Tap a card below to start.</p>
        ) : (
          <ul className="moodboard__list" role="list">
            {items.map((card, i) => (
              <li
                key={card.id}
                className="moodboard__item"
                draggable
                onDragStart={handleDragStart(i)}
                onDragOver={handleDragOver}
                onDrop={handleDrop(i)}
              >
                <span className="moodboard__item-emoji" aria-hidden="true">{card.emoji}</span>
                <span className="moodboard__item-label">{card.label}</span>
                <span className="moodboard__item-controls">
                  {/* 44px targets; keyboard-first reorder */}
                  <button type="button" className="moodboard__ctrl" onClick={() => move(i, -1)}
                    disabled={i === 0} aria-label={`Move ${card.label} up`}>▲</button>
                  <button type="button" className="moodboard__ctrl" onClick={() => move(i, 1)}
                    disabled={i === items.length - 1} aria-label={`Move ${card.label} down`}>▼</button>
                  <button type="button" className="moodboard__ctrl moodboard__ctrl--remove"
                    onClick={() => remove(card.id)} aria-label={`Remove ${card.label}`}>✕</button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Palette ── */}
      <div className="moodboard__palette" role="group" aria-label="Role cards you can add">
        {ROLE_CARDS.map(card => (
          <button
            key={card.id}
            type="button"
            className={`moodboard__card${onBoard(card.id) ? ' moodboard__card--used' : ''}`}
            onClick={() => add(card)}
            disabled={onBoard(card.id)}
          >
            <span className="moodboard__card-emoji" aria-hidden="true">{card.emoji}</span>
            <span className="moodboard__card-label">{card.label}</span>
            {/* CVD-safe: added state shown by tick + disabled, not colour alone */}
            {onBoard(card.id) && <span className="moodboard__card-tick">✓ On board</span>}
          </button>
        ))}
      </div>

      {/* POUR: every change announced for screen readers */}
      <span className="sr-only" aria-live="polite">{announce}</span>
    </div>
  )
}
