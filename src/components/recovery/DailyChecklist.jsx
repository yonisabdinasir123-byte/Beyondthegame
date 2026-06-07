/**
 * DailyChecklist.jsx
 *
 * PDF / Print export uses the browser's built-in print dialog.
 * For a more polished PDF (custom fonts, layout control), swap printChecklist()
 * for a jsPDF implementation:
 *   import jsPDF from 'jspdf'
 *   const doc = new jsPDF()
 *   doc.text(…)
 *   doc.save('recovery-checklist.pdf')
 * Install: npm i jspdf
 */

import { useState } from 'react'
import { today, formatDate } from '../../utils/storage'

const SECTIONS = [
  { key: 'independent', label: 'Independent Sessions', icon: '🏃' },
  { key: 'gym',         label: 'Gym Sessions',         icon: '🏋️' },
  { key: 'learning',    label: 'Learning',             icon: '📚' },
  { key: 'reflection',  label: 'Reflection',           icon: '🧘' },
]

/**
 * @param {{
 *   defaultItems: import('../../data/recoveryData').DEFAULT_CHECKLIST,
 *   onDayComplete: (date: string, ticked: string[]) => void,
 * }} props
 */
export default function DailyChecklist({ defaultItems, onDayComplete }) {
  const [date, setDate]     = useState(today())
  const [ticked, setTicked] = useState({})   // { itemId: boolean }
  const [notes, setNotes]   = useState('')
  const [printed, setPrinted] = useState(false)

  const toggleItem = (id) => {
    setTicked(t => {
      const next = { ...t, [id]: !t[id] }
      // Check if all items are ticked
      const allIds = Object.values(defaultItems).flat().map(i => i.id)
      if (allIds.every(id => next[id])) {
        onDayComplete(date, allIds.filter(id => next[id]))
      }
      return next
    })
  }

  const tickedCount = Object.values(ticked).filter(Boolean).length
  const totalItems  = Object.values(defaultItems).flat().length
  const allDone     = tickedCount === totalItems

  const handlePrint = () => {
    setPrinted(true)
    window.print()
    setTimeout(() => setPrinted(false), 2000)
  }

  return (
    <div className="checklist-wrap">
      {/* Date + actions */}
      <div className="checklist-toolbar">
        <div className="checklist-date-wrap">
          <label htmlFor="checklist-date" className="rec-label">Date</label>
          <input
            id="checklist-date"
            type="date"
            className="rec-input"
            value={date}
            onChange={e => { setDate(e.target.value); setTicked({}); setNotes('') }}
          />
        </div>
        <div className="checklist-toolbar__actions">
          <button type="button" className="rec-btn rec-btn--outline" onClick={handlePrint}>
            {printed ? '✓ Printing…' : '🖨 Print / Save PDF'}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="checklist-progress" aria-label={`${tickedCount} of ${totalItems} items complete`}>
        <div className="checklist-progress__bar">
          <div
            className={`checklist-progress__fill${allDone ? ' checklist-progress__fill--done' : ''}`}
            style={{ width: `${totalItems ? (tickedCount / totalItems) * 100 : 0}%` }}
          />
        </div>
        <span className="checklist-progress__label">
          {allDone ? '✅ Day complete!' : `${tickedCount} / ${totalItems} done`}
        </span>
      </div>

      {/* Printable checklist */}
      <div className="checklist-doc" id="checklist-printable">
        <div className="checklist-doc__header">
          <h2 className="checklist-doc__title">Daily Recovery Checklist</h2>
          <p className="checklist-doc__date">{formatDate(date)}</p>
        </div>

        {SECTIONS.map(({ key, label, icon }) => (
          <section key={key} className="checklist-section">
            <h3 className="checklist-section__heading">
              <span aria-hidden="true">{icon}</span> {label}
            </h3>
            <ul className="checklist-items" role="list">
              {defaultItems[key].map(item => (
                <li key={item.id} className="checklist-item">
                  <label className={`checklist-item__label${ticked[item.id] ? ' checklist-item__label--done' : ''}`}>
                    <input
                      type="checkbox"
                      className="checklist-item__checkbox"
                      checked={!!ticked[item.id]}
                      onChange={() => toggleItem(item.id)}
                      aria-label={item.label}
                    />
                    <span className="checklist-item__text">{item.label}</span>
                  </label>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {/* Notes */}
        <section className="checklist-section">
          <h3 className="checklist-section__heading">📝 Notes</h3>
          <textarea
            className="checklist-notes"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="How are you feeling today? Anything to remember for tomorrow?"
            aria-label="Daily notes"
            rows={4}
          />
        </section>
      </div>

      {allDone && (
        <div className="checklist-celebrate" role="status" aria-live="polite">
          🎉 Amazing work — you completed every item today! Keep that streak going.
        </div>
      )}
    </div>
  )
}
