import { useId } from 'react'

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const ClearIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
)

/**
 * @param {{ value: string, onChange: (v: string) => void }} props
 */
export default function SearchBar({ value, onChange }) {
  const inputId = useId()

  return (
    <div className="search-bar">
      <label htmlFor={inputId} className="sr-only">
        Search clubs by name, location, or position
      </label>
      <div className="search-bar__wrap">
        <span className="search-bar__icon"><SearchIcon /></span>
        <input
          id={inputId}
          type="search"
          className="search-bar__input"
          placeholder="Search by club name, location, or position…"
          value={value}
          onChange={e => onChange(e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
        {value && (
          <button
            type="button"
            className="search-bar__clear"
            onClick={() => onChange('')}
            aria-label="Clear search"
          >
            <ClearIcon />
          </button>
        )}
      </div>
    </div>
  )
}
