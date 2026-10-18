import { useEffect, useRef } from 'react';
import Icon from './Icon.jsx';
import './Controls.css';

/* Scroll a horizontal strip so its active item is visible, without
   scrolling the page (scrollIntoView would move the window too). */
export function revealActive(strip) {
  const el = strip?.querySelector('[aria-pressed="true"]');
  if (!el) return;
  const pad = 24;
  const left = el.getBoundingClientRect().left - strip.getBoundingClientRect().left + strip.scrollLeft;
  if (left < strip.scrollLeft + pad) strip.scrollTo({ left: Math.max(0, left - pad), behavior: 'smooth' });
  else if (left + el.offsetWidth > strip.scrollLeft + strip.clientWidth - pad) strip.scrollTo({ left: left + el.offsetWidth - strip.clientWidth + pad, behavior: 'smooth' });
}

/* Horizontally scrolling filter chips (Facilities, Booking, Live Traffic). */
export function Chips({ items, value, onChange, label, variant = 'page' }) {
  const ref = useRef(null);
  useEffect(() => { revealActive(ref.current); }, [value]);
  return (
    <div className={`chips chips--${variant}`} ref={ref} role="group" aria-label={label}>
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          className={`chip${value === it.id ? ' is-active' : ''}`}
          aria-pressed={value === it.id}
          onClick={() => onChange(it.id)}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

/* Three-way pill switch (Class: Today / This Week / All Classess). */
export function Segmented({ items, value, onChange, label }) {
  const index = Math.max(0, items.findIndex((i) => i.id === value));
  return (
    <div className="seg" role="tablist" aria-label={label} style={{ '--n': items.length, '--i': index }}>
      <span className="seg__thumb" aria-hidden="true" />
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          role="tab"
          aria-selected={value === it.id}
          className={`seg__btn${value === it.id ? ' is-active' : ''}`}
          onClick={() => onChange(it.id)}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

export function SearchBar({ value, onChange, onFilter, filterActive, placeholder }) {
  return (
    <div className="search">
      <Icon name="search" className="search__icon" width={18.7} height={18.7} />
      <input
        className="search__input"
        type="search"
        inputMode="search"
        enterKeyHint="search"
        value={value}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button type="button" className="search__clear" onClick={() => onChange('')} aria-label="Clear search">
          <Icon name="close" size={16} />
        </button>
      )}
      <button type="button" className={`search__filter${filterActive ? ' is-active' : ''}`} onClick={onFilter} aria-label="Filter and sort">
        <Icon name="filter" width={17.5} height={10.4} />
      </button>
    </div>
  );
}

export function Toggle({ checked, onChange, label }) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} className="toggle" onClick={() => onChange(!checked)} />;
}
