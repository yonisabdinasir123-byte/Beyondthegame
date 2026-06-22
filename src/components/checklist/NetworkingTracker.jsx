/**
 * NetworkingTracker.jsx, Record and track contacts made during the job search.
 * All data persisted to localStorage under btg:net-contacts and btg:net-prompts.
 */
import { useState, useCallback } from 'react'
import { storage, today, formatDate } from '../../utils/storage'
import { notifyProgress } from '../../utils/goal'
import { networkingPrompts } from '../../data/educationData'

const FOLLOW_UP_OPTIONS = ['Not yet contacted', 'Awaiting reply', 'Follow-up sent', 'Had a response', 'Ongoing conversation', 'Closed / done']

const EMPTY_FORM = {
  name: '', organisation: '', field: '', howContacted: '', date: today(), followUp: 'Not yet contacted', notes: '',
}

let nextId = Date.now()
const uid  = () => String(++nextId)

function SummaryBar({ contacts }) {
  const total   = contacts.length
  const pending = contacts.filter(c => ['Not yet contacted', 'Awaiting reply', 'Follow-up sent'].includes(c.followUp)).length
  return (
    <div className="net-summary" aria-label="Networking summary">
      <div className="net-summary__stat">
        <span className="net-summary__num">{total}</span>
        <span className="net-summary__label">contacts made</span>
      </div>
      <div className="net-summary__stat net-summary__stat--warn">
        <span className="net-summary__num">{pending}</span>
        <span className="net-summary__label">follow-ups pending</span>
      </div>
    </div>
  )
}

export default function NetworkingTracker() {
  const [contacts, setContacts] = useState(() => storage.get('net-contacts', []))
  const [checked,  setChecked]  = useState(() => storage.get('net-prompts',  {}))
  const [form,     setForm]     = useState(EMPTY_FORM)
  const [errors,   setErrors]   = useState({})
  const [editId,   setEditId]   = useState(null)
  const [showForm, setShowForm] = useState(false)

  const persistContacts = useCallback((next) => {
    setContacts(next)
    storage.set('net-contacts', next)
    notifyProgress() /* milestone signal: contact added */
  }, [])

  const persistChecked = useCallback((next) => {
    setChecked(next)
    storage.set('net-prompts', next)
  }, [])

  const validate = () => {
    const e = {}
    if (!form.name.trim())         e.name   = 'Please enter a name.'
    if (!form.organisation.trim()) e.org    = 'Please enter an organisation or club.'
    if (!form.date)                e.date   = 'Please choose a date.'
    return e
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    if (editId) {
      persistContacts(contacts.map(c => c.id === editId ? { ...c, ...form } : c))
      setEditId(null)
    } else {
      persistContacts([...contacts, { id: uid(), ...form }])
    }
    setForm(EMPTY_FORM)
    setErrors({})
    setShowForm(false)
  }

  const handleEdit   = (c) => { setForm({ ...c }); setEditId(c.id); setShowForm(true) }
  const handleDelete = (id) => {
    persistContacts(contacts.filter(c => c.id !== id))
    if (editId === id) { setEditId(null); setForm(EMPTY_FORM); setShowForm(false) }
  }
  const handleCancel = () => { setForm(EMPTY_FORM); setErrors({}); setEditId(null); setShowForm(false) }

  const sorted = [...contacts].sort((a, b) => b.date.localeCompare(a.date))

  const followUpColour = (fu) => {
    if (fu === 'Had a response' || fu === 'Ongoing conversation') return 'net-fu--green'
    if (fu === 'Closed / done') return 'net-fu--muted'
    if (fu === 'Not yet contacted') return 'net-fu--grey'
    return 'net-fu--amber'
  }

  const field = (key, label, type = 'text', required = false, opts = null) => (
    <div className="form-group">
      <label htmlFor={`net-${key}`} className="form-label">
        {label}{required && <span aria-hidden="true"> *</span>}
      </label>
      {opts ? (
        <select
          id={`net-${key}`}
          className="edu-select"
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        >
          {opts.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          id={`net-${key}`}
          className="edu-input net-notes"
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          rows={2}
        />
      ) : (
        <input
          id={`net-${key}`}
          type={type}
          className={`edu-input${errors[key] ? ' edu-input--error' : ''}`}
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          aria-required={required}
          aria-describedby={errors[key] ? `net-${key}-err` : undefined}
        />
      )}
      {errors[key] && <p id={`net-${key}-err`} className="form-error" role="alert">{errors[key]}</p>}
    </div>
  )

  return (
    <div className="net-wrap">
      {/* Reflective prompts */}
      <section className="net-prompts" aria-label="Reflective networking prompts">
        <h3 className="net-section-title">Reflective checklist</h3>
        <ul className="net-prompt-list" role="list">
          {networkingPrompts.map(p => (
            <li key={p.id} className="net-prompt-item">
              <label className={`net-prompt-label${checked[p.id] ? ' net-prompt-label--done' : ''}`}>
                <input
                  type="checkbox"
                  className="net-prompt-checkbox"
                  checked={!!checked[p.id]}
                  onChange={() => persistChecked({ ...checked, [p.id]: !checked[p.id] })}
                  aria-label={p.text}
                />
                <span>{p.text}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      {/* Summary bar */}
      <SummaryBar contacts={contacts} />

      {/* Add / Edit form */}
      {!showForm ? (
        <button
          type="button"
          className="edu-cta edu-cta--primary net-add-btn"
          onClick={() => setShowForm(true)}
        >
          + Add a contact
        </button>
      ) : (
        <form className="net-form" onSubmit={handleSubmit} noValidate aria-label={editId ? 'Edit contact' : 'Add a new contact'}>
          <h3 className="net-form__title">{editId ? 'Edit contact' : 'Add a new contact'}</h3>
          <div className="net-form__grid">
            {field('name',         'Name',                  'text',     true)}
            {field('organisation', 'Organisation / Club',   'text',     true)}
            {field('field',        'Field / sport',         'text')}
            {field('howContacted', 'How you contacted them','text')}
            {field('date',         'Date of contact',       'date',     true)}
            {field('followUp',     'Follow-up status',      'select',   false, FOLLOW_UP_OPTIONS)}
          </div>
          {field('notes', 'Notes (optional)', 'textarea')}
          <div className="net-form__actions">
            <button type="submit" className="edu-cta edu-cta--primary">{editId ? 'Save changes' : 'Add contact'}</button>
            <button type="button" className="edu-cta edu-cta--outline" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      )}

      {/* Contact list */}
      {contacts.length === 0 && !showForm && (
        <div className="edu-empty" role="status">
          <span aria-hidden="true">🤝</span>
          <p>No contacts yet. Add the first person you've reached out to above.</p>
        </div>
      )}

      {sorted.length > 0 && (
        <section aria-label="Your networking contacts">
          <h3 className="net-section-title">Your contacts</h3>
          <ul className="net-list" role="list">
            {sorted.map(c => (
              <li key={c.id} className="net-card">
                <div className="net-card__main">
                  <div className="net-card__top">
                    <p className="net-card__name">{c.name}</p>
                    <span className={`net-fu ${followUpColour(c.followUp)}`}>{c.followUp}</span>
                  </div>
                  <p className="net-card__org">{c.organisation}{c.field ? ` · ${c.field}` : ''}</p>
                  <p className="net-card__meta">
                    {c.howContacted && <span>📩 {c.howContacted} · </span>}
                    <span>📅 {formatDate(c.date)}</span>
                  </p>
                  {c.notes && <p className="net-card__notes">{c.notes}</p>}
                </div>
                <div className="net-card__actions">
                  <button type="button" className="net-action-btn" onClick={() => handleEdit(c)} aria-label={`Edit ${c.name}`}>Edit</button>
                  <button type="button" className="net-action-btn net-action-btn--del" onClick={() => handleDelete(c.id)} aria-label={`Delete ${c.name}`}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
