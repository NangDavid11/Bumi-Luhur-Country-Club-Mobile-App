import { useEffect, useRef } from 'react';
import Icon from './Icon.jsx';
import { revealActive } from './Controls.jsx';
import { DAYS_SHORT, fromKey } from '../utils/date.js';
import './Booking.css';

/* Horizontally scrolling day picker (SAT 19, SUN 20 …). */
export function DateStrip({ days, value, onChange }) {
  const ref = useRef(null);
  useEffect(() => { revealActive(ref.current); }, [value]);
  return (
    <div className="dates" ref={ref} role="group" aria-label="Choose a date">
      {days.map((key) => {
        const d = fromKey(key);
        const active = key === value;
        return (
          <button
            key={key}
            type="button"
            className={`date${active ? ' is-active' : ''}${d.getDay() === 0 ? ' is-sunday' : ''}`}
            aria-pressed={active}
            aria-label={d.toDateString()}
            onClick={() => onChange(key)}
          >
            <span className="date__dow">{DAYS_SHORT[d.getDay()]}</span>
            <span className="date__num">{d.getDate()}</span>
          </button>
        );
      })}
    </div>
  );
}

const LABEL = { available: 'Available', booked: 'Booked', past: 'Closed', mine: 'Your Booking', selected: 'Selected' };

/* 3-column slot picker. Booked and past slots are locked. */
export function SlotGrid({ slots, selected, onToggle }) {
  if (!slots.length) return <p className="empty">No more sessions today. Pick another date.</p>;
  return (
    <div className="slots" role="group" aria-label="Available slots">
      {slots.map((s) => {
        const isSel = selected.includes(s.time);
        const state = isSel ? 'selected' : s.state;
        const locked = s.state !== 'available';
        return (
          <button
            key={s.time}
            type="button"
            className={`slot slot--${state}`}
            disabled={locked}
            aria-pressed={isSel}
            aria-label={`${s.time} ${LABEL[state]}`}
            onClick={() => onToggle(s.time)}
          >
            <span className="slot__time">
              {locked && s.state !== 'mine' && <Icon name="lock" className="slot__lock" width={10.4} height={10.8} />}
              {s.time}
            </span>
            <span className="slot__label">{LABEL[state]}</span>
          </button>
        );
      })}
    </div>
  );
}
