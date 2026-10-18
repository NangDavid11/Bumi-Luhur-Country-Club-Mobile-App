import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Icon from '../components/Icon.jsx';
import MediaCard from '../components/MediaCard.jsx';
import Sheet from '../components/Sheet.jsx';
import { Segmented } from '../components/Controls.jsx';
import { useStore } from '../store/AppStore.jsx';
import { isPast, longDate } from '../utils/date.js';
import { sessionLabel } from './Home.jsx';
import './Lists.css';

const TYPE = { facility: 'Facility', class: 'Class', coaching: 'Coaching', event: 'Event' };
const TABS = [{ id: 'upcoming', label: 'Upcoming' }, { id: 'past', label: 'Past' }, { id: 'cancelled', label: 'Cancelled' }];

function icsFor(b) {
  const dt = (date, t) => `${date.replace(/-/g, '')}T${t.replace(':', '')}00`;
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Bumi Luhur//Member App//EN',
    'BEGIN:VEVENT',
    `UID:${b.id}@bumiluhur`,
    `DTSTART;TZID=Asia/Jakarta:${dt(b.date, b.start)}`,
    `DTEND;TZID=Asia/Jakarta:${dt(b.date, b.end)}`,
    `SUMMARY:${b.title} — Bumi Luhur Country Club`,
    `LOCATION:${b.place ?? 'Bumi Luhur Country Club, Kota Baru Parahyangan'}`,
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
}

export default function Schedule() {
  const { state, dispatch, notify } = useStore();
  const [params, setParams] = useSearchParams();
  const [tab, setTab] = useState('upcoming');
  const [openId, setOpenId] = useState(params.get('open'));
  const [confirmCancel, setConfirmCancel] = useState(false);

  useEffect(() => { if (params.get('open')) setParams({}, { replace: true }); }, [params, setParams]);

  const lists = useMemo(() => {
    const sorted = [...state.bookings].sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
    return {
      upcoming: sorted.filter((b) => b.status !== 'cancelled' && !isPast(b.date, b.end)),
      past: sorted.filter((b) => b.status !== 'cancelled' && isPast(b.date, b.end)).reverse(),
      cancelled: sorted.filter((b) => b.status === 'cancelled').reverse(),
    };
  }, [state.bookings]);

  const open = state.bookings.find((b) => b.id === openId);
  const canCancel = open && open.status !== 'cancelled' && !isPast(open.date, open.start);

  const download = () => {
    const blob = new Blob([icsFor(open)], { type: 'text/calendar' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${open.title.replace(/\s+/g, '-').toLowerCase()}.ics`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const list = lists[tab];

  return (
    <main className="page">
      <Header title="My Schedule" back />
      <Segmented items={TABS} value={tab} onChange={setTab} label="Schedule" />
      <div className="stack gap-24">
        {list.map((b) => (
          <MediaCard key={b.id} art={b.art} title={b.title} subtitle={sessionLabel(b)} onClick={() => setOpenId(b.id)}>
            <span className="badge mcard__corner" style={{ background: '#fff' }}>{TYPE[b.type]}</span>
          </MediaCard>
        ))}
        {!list.length && (
          <div className="empty">
            <strong>{tab === 'upcoming' ? 'Nothing scheduled yet' : tab === 'past' ? 'No past sessions' : 'No cancellations'}</strong>
            {tab === 'upcoming' && <><span>Book a court, join a class or reserve a treatment.</span><Link to="/booking" className="btn btn--primary">Book Now</Link></>}
          </div>
        )}
      </div>

      <Sheet
        open={!!open}
        onClose={() => { setOpenId(null); setConfirmCancel(false); }}
        title={open?.title}
        footer={open && (
          confirmCancel ? (
            <>
              <p style={{ textAlign: 'center', fontSize: 14 }}>Cancel this {TYPE[open.type].toLowerCase()}?</p>
              <button type="button" className="btn btn--danger btn--block" onClick={() => { dispatch({ type: 'cancelBooking', id: open.id }); notify('Booking cancelled'); setOpenId(null); setConfirmCancel(false); }}>Yes, Cancel</button>
              <button type="button" className="btn btn--soft btn--block" onClick={() => setConfirmCancel(false)}>Keep It</button>
            </>
          ) : (
            <>
              {open.status !== 'cancelled' && <button type="button" className="btn btn--soft btn--block" onClick={download}><Icon name="download" size={18} /> Add to Calendar</button>}
              {canCancel && <button type="button" className="btn btn--danger btn--block" onClick={() => setConfirmCancel(true)}>Cancel Booking</button>}
            </>
          )
        )}
      >
        {open && (
          <>
            <MediaCard art={open.art} title={open.title} subtitle={sessionLabel(open)} as="div" />
            <div className="detail-grid">
              <div className="detail detail--wide"><p className="detail__label">Date</p><p className="detail__value">{longDate(open.date)}</p></div>
              <div className="detail"><p className="detail__label">Time</p><p className="detail__value">{open.start} – {open.end}</p></div>
              <div className="detail"><p className="detail__label">Type</p><p className="detail__value">{TYPE[open.type]}</p></div>
              {open.place && <div className="detail detail--wide"><p className="detail__label">Location</p><p className="detail__value">{open.place}</p></div>}
              <div className="detail detail--wide"><p className="detail__label">Status</p><p className="detail__value" style={{ color: open.status === 'cancelled' ? '#d92d20' : 'var(--green)' }}>{open.status === 'cancelled' ? 'Cancelled' : isPast(open.date, open.end) ? 'Completed' : 'Confirmed'}</p></div>
            </div>
          </>
        )}
      </Sheet>
    </main>
  );
}
