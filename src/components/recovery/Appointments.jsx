import { useState, useCallback } from 'react'
import { storage, today, formatDate, isToday, isTomorrow } from '../../utils/storage'

const EMPTY_FORM = { title: '', location: '', date: '', time: '', notes: '' }

let nextId = Date.now()
const uid = () => String(++nextId)

function AppointmentBadge({ date }) {
  if (isToday(date))     return <span className="appt-badge appt-badge--today">Today</span>
  if (isTomorrow(date))  return <span className="appt-badge appt-badge--tomorrow">Tomorrow</span>
  if (date < today())    return <span className="appt-badge appt-badge--past">Past</span>
  return null
}

export default function Appointments({ savedLocations = [], savedGyms = [] }) {
  const [appts, setAppts] = useState(() => storage.get('appts', []))
  const [form, setForm]   = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const persist = useCallback((next) => {
    setAppts(next)
    storage.set('appts', next)
  }, [])

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Please enter an appointment title.'
    if (!form.date)          e.date  = 'Please choose a date.'
    return e
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    if (editId) {
      persist(appts.map(a => a.id === editId ? { ...a, ...form } : a))
      setEditId(null)
    } else {
      persist([...appts, { id: uid(), ...form }])
    }
    setForm(EMPTY_FORM)
    setErrors({})
    setShowForm(false)
  }

  const handleEdit = (appt) => {
    setForm({ title: appt.title, location: appt.location, date: appt.date, time: appt.time, notes: appt.notes })
    setEditId(appt.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    persist(appts.filter(a => a.id !== id))
    if (editId === id) { setEditId(null); setForm(EMPTY_FORM); setShowForm(false) }
  }

  const handleCancel = () => {
    setForm(EMPTY_FORM)
    setErrors({})
    setEditId(null)
    setShowForm(false)
  }

  const sorted = [...appts].sort((a, b) => {
    const cmp = a.date.localeCompare(b.date)
    return cmp !== 0 ? cmp : a.time.localeCompare(b.time)
  })

  const upcoming = sorted.filter(a => a.date >= today())
  const past     = sorted.filter(a => a.date <  today())

  const field = (key, label, type = 'text', required = false) => (
    <div className="form-group">
      <label htmlFor={`appt-${key}`} className="form-label">
        {label}{required && <span aria-hidden="true"> *</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={`appt-${key}`}
          className="form-input checklist-notes"
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          rows={3}
        />
      ) : (
        <input
          id={`appt-${key}`}
          type={type}
          className={`form-input${errors[key] ? ' form-input--error' : ''}`}
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          aria-describedby={errors[key] ? `appt-${key}-err` : undefined}
          aria-required={required}
        />
      )}
      {errors[key] && <p id={`appt-${key}-err`} className="form-error" role="alert">{errors[key]}</p>}
    </div>
  )

  return (
    <div className="appt-wrap">
      {!showForm && (
        <button
          type="button"
          className="rec-btn rec-btn--primary appt-add-btn"
          onClick={() => setShowForm(true)}
        >
          + Add appointment
        </button>
      )}

      {showForm && (
        <form className="appt-form" onSubmit={handleSubmit} noValidate aria-label="Appointment form">
          <h3 className="appt-form__title">{editId ? 'Edit appointment' : 'New appointment'}</h3>
          {field('title',    'Title / reason', 'text', true)}
          {field('location', 'Location')}
          <div className="appt-form__row">
            {field('date', 'Date', 'date', true)}
            {field('time', 'Time', 'time')}
          </div>
          {field('notes', 'Notes', 'textarea')}
          <div className="appt-form__actions">
            <button type="submit" className="rec-btn rec-btn--primary">
              {editId ? 'Save changes' : 'Add appointment'}
            </button>
            <button type="button" className="rec-btn rec-btn--outline" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {appts.length === 0 && !showForm && (
        <div className="rec-empty" role="status">
          <span aria-hidden="true">📅</span>
          <p>No appointments yet. Add your first one above.</p>
        </div>
      )}

      {upcoming.length > 0 && (
        <section aria-label="Upcoming appointments">
          <h3 className="appt-group-title">Upcoming</h3>
          <ul className="appt-list" role="list">
            {upcoming.map(a => (
              <li key={a.id} className={`appt-item${isToday(a.date) ? ' appt-item--today' : ''}`}>
                <div className="appt-item__main">
                  <div className="appt-item__meta">
                    <span className="appt-item__date">{formatDate(a.date)}</span>
                    {a.time && <span className="appt-item__time">{a.time}</span>}
                    <AppointmentBadge date={a.date} />
                  </div>
                  <p className="appt-item__title">{a.title}</p>
                  {a.location && <p className="appt-item__location">📍 {a.location}</p>}
                  {a.notes && <p className="appt-item__notes">{a.notes}</p>}
                </div>
                <div className="appt-item__actions">
                  <button type="button" className="appt-action-btn" onClick={() => handleEdit(a)} aria-label={`Edit ${a.title}`}>Edit</button>
                  <button type="button" className="appt-action-btn appt-action-btn--del" onClick={() => handleDelete(a.id)} aria-label={`Delete ${a.title}`}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {past.length > 0 && (
        <section aria-label="Past appointments">
          <h3 className="appt-group-title appt-group-title--past">Past</h3>
          <ul className="appt-list appt-list--past" role="list">
            {[...past].reverse().map(a => (
              <li key={a.id} className="appt-item appt-item--past">
                <div className="appt-item__main">
                  <div className="appt-item__meta">
                    <span className="appt-item__date">{formatDate(a.date)}</span>
                    {a.time && <span className="appt-item__time">{a.time}</span>}
                    <AppointmentBadge date={a.date} />
                  </div>
                  <p className="appt-item__title">{a.title}</p>
                  {a.location && <p className="appt-item__location">📍 {a.location}</p>}
                </div>
                <div className="appt-item__actions">
                  <button type="button" className="appt-action-btn appt-action-btn--del" onClick={() => handleDelete(a.id)} aria-label={`Delete ${a.title}`}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
