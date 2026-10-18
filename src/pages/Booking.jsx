import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Icon from '../components/Icon.jsx';
import MediaCard from '../components/MediaCard.jsx';
import Sheet from '../components/Sheet.jsx';
import { Chips } from '../components/Controls.jsx';
import { DateStrip, SlotGrid } from '../components/Booking.jsx';
import { FACILITIES, facilityById } from '../data/catalog.js';
import { POINTS_PER_BOOKING, useStore } from '../store/AppStore.jsx';
import { addDays, addMinutes, longDate, relativeDay, toKey } from '../utils/date.js';
import { slotsFor } from '../utils/slots.js';
import { CHIP_ITEMS, openLabel } from './Facilities.jsx';
import './Lists.css';


export default function Booking() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { activeBookings, dispatch, notify } = useStore();

  const DAYS = useMemo(() => Array.from({ length: 14 }, (_, i) => toKey(addDays(new Date(), i))), []);
  const cat = params.get('cat') ?? 'all';
  // after the last session of the day, open on tomorrow
  const [date, setDate] = useState(() => (new Date().getHours() >= 21 ? DAYS[1] : DAYS[0]));
  const bookable = useMemo(() => FACILITIES.filter((f) => f.bookable && (cat === 'all' || f.category === cat)), [cat]);
  const [openId, setOpenId] = useState(params.get('facility') ?? bookable[0]?.id);
  const [selected, setSelected] = useState([]);
  const [confirm, setConfirm] = useState(false);
  const [done, setDone] = useState(null);

  // keep an expanded card that belongs to the current category
  useEffect(() => {
    if (!bookable.some((f) => f.id === openId)) setOpenId(bookable[0]?.id);
  }, [bookable, openId]);
  useEffect(() => { setSelected([]); }, [date, openId]);

  const facility = facilityById(openId);
  const slots = useMemo(() => (facility ? slotsFor(facility, date, activeBookings) : []), [facility, date, activeBookings]);

  const toggle = (t) => setSelected((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t].sort()));

  const book = () => {
    const items = selected.map((t) => ({ type: 'facility', refId: facility.id, title: facility.name, art: facility.art, date, start: t, end: addMinutes(t, 60) }));
    dispatch({ type: 'book', items, earn: true });
    setConfirm(false);
    setDone({ facility, date, times: selected });
    setSelected([]);
    notify(`${facility.name} booked`);
  };

  return (
    <main className="page">
      <Header
        title="Booking"
        back
        right={(
          <Link to="/schedule" className="round-btn" aria-label="My schedule">
            <Icon name="calendar" width={19.6} height={21.6} />
          </Link>
        )}
      />
      <div style={{ marginTop: -3 }}><DateStrip days={DAYS} value={date} onChange={setDate} /></div>
      <div className="gap-24">
        <Chips items={CHIP_ITEMS} value={cat} onChange={(id) => setParams(id === 'all' ? {} : { cat: id }, { replace: true })} label="Facility category" />
      </div>

      <div className="stack gap-24">
        {bookable.map((f) => {
          const isOpen = f.id === openId;
          return (
            <div key={f.id} className={`bk-item${isOpen ? ' is-open' : ''}`}>
              <MediaCard
                art={f.art}
                title={f.name}
                subtitle={isOpen ? `${f.capacity} • ${f.fee}` : openLabel(f)}
                aria-expanded={isOpen}
                onClick={() => setOpenId(isOpen ? null : f.id)}
              />
              {isOpen && (
                <div className="bk-item__panel">
                  <div className="bk-item__head">
                    <h3>Available Slot</h3>
                    <span>60 Min Session</span>
                  </div>
                  <SlotGrid slots={slots} selected={selected} onToggle={toggle} />
                </div>
              )}
            </div>
          );
        })}
        {!bookable.length && <div className="empty"><strong>Nothing to book here</strong><span>These spaces are open access — no booking needed.</span></div>}
      </div>

      {selected.length > 0 && facility && (
        <div className="confirm-bar" role="region" aria-label="Booking summary">
          <div className="confirm-bar__text">
            <p className="confirm-bar__title">{selected.length} slot{selected.length > 1 ? 's' : ''} selected</p>
            <p className="confirm-bar__sub">{facility.name} · {relativeDay(date)} · {selected.join(', ')}</p>
          </div>
          <button type="button" className="btn btn--primary" onClick={() => setConfirm(true)}>Book Now</button>
        </div>
      )}

      <Sheet
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Confirm Booking"
        footer={<button type="button" className="btn btn--primary btn--block" onClick={book}>Confirm Booking</button>}
      >
        {facility && <MediaCard art={facility.art} title={facility.name} subtitle={`${facility.capacity} • ${facility.fee}`} as="div" />}
        <div className="detail-grid">
          <div className="detail detail--wide"><p className="detail__label">Date</p><p className="detail__value">{longDate(date)}</p></div>
          <div className="detail detail--wide"><p className="detail__label">Time</p><p className="detail__value">{selected.map((t) => `${t} – ${addMinutes(t, 60)}`).join(', ')} WIB</p></div>
          <div className="detail"><p className="detail__label">Session</p><p className="detail__value">{selected.length} × 60 Min</p></div>
          <div className="detail"><p className="detail__label">Points earned</p><p className="detail__value" style={{ color: 'var(--green)' }}>+{POINTS_PER_BOOKING * selected.length} pts</p></div>
        </div>
        <p className="muted" style={{ fontSize: 12 }}>Free cancellation up to 2 hours before your session.</p>
      </Sheet>

      <Sheet
        open={!!done}
        onClose={() => setDone(null)}
        title="Booking Confirmed"
        footer={(
          <>
            <button type="button" className="btn btn--primary btn--block" onClick={() => navigate('/schedule')}>View My Schedule</button>
            <button type="button" className="btn btn--soft btn--block" onClick={() => setDone(null)}>Book Another</button>
          </>
        )}
      >
        {done && (
          <div className="code-box">
            <Icon name="check" size={40} />
            <p className="code-box__code" style={{ letterSpacing: 0 }}>{done.facility.name}</p>
            <p className="code-box__sub">{longDate(done.date)}<br />{done.times.map((t) => `${t} – ${addMinutes(t, 60)}`).join(', ')} WIB</p>
          </div>
        )}
      </Sheet>
    </main>
  );
}
