import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import MediaCard from '../components/MediaCard.jsx';
import Sheet from '../components/Sheet.jsx';
import { Segmented } from '../components/Controls.jsx';
import { CLASSES, classMeta } from '../data/catalog.js';
import { useStore } from '../store/AppStore.jsx';
import { DAYS_LONG, addDays, addMinutes, fromKey, isPast, relativeDay, toKey, todayKey } from '../utils/date.js';
import './Lists.css';

const TABS = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This Week' },
  { id: 'all', label: 'All Clasess' },
];

const minutes = (d) => (d.includes('Hour') ? 60 * parseInt(d, 10) : parseInt(d, 10));

/* Join / leave a class session (occurrence = class + date). */
function ClassSheet({ cls, date, onClose }) {
  const { activeBookings, dispatch, notify } = useStore();
  const navigate = useNavigate();
  if (!cls) return null;
  const occurrence = date ?? nextOccurrence(cls);
  const booking = activeBookings.find((b) => b.type === 'class' && b.refId === cls.id && b.date === occurrence);
  const taken = 3 + ((cls.id.length * 7 + fromKey(occurrence).getDate()) % (cls.capacity - 4));
  const spots = Math.max(0, cls.capacity - taken - (booking ? 1 : 0));
  const started = isPast(occurrence, cls.time);

  const join = () => {
    dispatch({ type: 'book', earn: true, items: [{ type: 'class', refId: cls.id, title: cls.name, art: cls.art, date: occurrence, start: cls.time, end: addMinutes(cls.time, minutes(cls.duration)), place: cls.place }] });
    notify(`You're in! ${cls.name}, ${relativeDay(occurrence)} ${cls.time}`);
    onClose();
  };
  const leave = () => {
    dispatch({ type: 'cancelBooking', id: booking.id });
    notify(`Left ${cls.name}`);
    onClose();
  };

  return (
    <Sheet
      open
      onClose={onClose}
      title={cls.name}
      footer={booking ? (
        <>
          <button type="button" className="btn btn--primary btn--block" onClick={() => navigate('/schedule')}>View in My Schedule</button>
          <button type="button" className="btn btn--danger btn--block" onClick={leave}>Leave Class</button>
        </>
      ) : (
        <button type="button" className="btn btn--primary btn--block" disabled={started || spots === 0} onClick={join}>
          {started ? 'Class Has Started' : spots === 0 ? 'Class Full' : 'Join Class'}
        </button>
      )}
    >
      <MediaCard art={cls.art} title={cls.name} subtitle={classMeta(cls)} as="div" />
      <p style={{ fontSize: 14, lineHeight: '21px', color: 'var(--grey-2)' }}>{cls.description}</p>
      <div className="detail-grid">
        <div className="detail"><p className="detail__label">Date</p><p className="detail__value">{relativeDay(occurrence)}</p></div>
        <div className="detail"><p className="detail__label">Time</p><p className="detail__value">{cls.time} · {cls.duration}</p></div>
        <div className="detail"><p className="detail__label">Location</p><p className="detail__value">{cls.place}</p></div>
        <div className="detail"><p className="detail__label">Coach</p><p className="detail__value">{cls.coach}</p></div>
        <div className="detail"><p className="detail__label">Level</p><p className="detail__value">{cls.level}</p></div>
        <div className="detail"><p className="detail__label">Spots left</p><p className="detail__value" style={{ color: spots ? 'var(--green)' : '#d92d20' }}>{spots} of {cls.capacity}</p></div>
      </div>
      {booking && <span className="badge">You’re booked for this session</span>}
    </Sheet>
  );
}

function nextOccurrence(cls) {
  for (let i = 0; i < 8; i++) {
    const d = addDays(new Date(), i);
    if (cls.days.includes(d.getDay()) && !isPast(toKey(d), cls.time)) return toKey(d);
  }
  return todayKey();
}

export default function Class() {
  const [tab, setTab] = useState('today');
  const [open, setOpen] = useState(null);
  const { activeBookings } = useStore();
  const joined = (id, date) => activeBookings.some((b) => b.type === 'class' && b.refId === id && b.date === date);

  const week = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = addDays(new Date(), i);
    const key = toKey(d);
    return {
      key,
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : DAYS_LONG[d.getDay()],
      items: CLASSES.filter((c) => c.days.includes(d.getDay())).sort((a, b) => a.time.localeCompare(b.time)),
    };
  }), []);

  const card = (c, date, key) => (
    <MediaCard key={key} art={c.art} title={c.name} subtitle={classMeta(c)} onClick={() => setOpen({ cls: c, date })}>
      {date && joined(c.id, date) && <span className="badge mcard__corner" style={{ background: '#fff' }}>Joined</span>}
    </MediaCard>
  );

  return (
    <main className="page">
      <Header title="Class" />
      <Segmented items={TABS} value={tab} onChange={setTab} label="Class schedule" />

      <div className="gap-24">
        {tab === 'today' && (
          week[0].items.length ? <div className="stack">{week[0].items.map((c) => card(c, week[0].key, c.id))}</div>
            : <div className="empty"><strong>No classes today</strong><span>Check this week’s schedule.</span></div>
        )}

        {tab === 'week' && week.map((d) => (
          <section key={d.key}>
            <h2 className="day-head">{d.label}</h2>
            <div className="stack">{d.items.map((c) => card(c, d.key, `${d.key}-${c.id}`))}</div>
          </section>
        ))}

        {tab === 'all' && (
          <div className="stack">
            {CLASSES.map((c) => (
              <MediaCard key={c.id} art={c.art} title={c.name} subtitle={`${c.days.length === 7 ? 'Every day' : c.days.map((d) => DAYS_LONG[d].slice(0, 3)).join(', ')} · ${c.time}`} onClick={() => setOpen({ cls: c })} />
            ))}
          </div>
        )}
      </div>

      {open && <ClassSheet cls={open.cls} date={open.date} onClose={() => setOpen(null)} />}
    </main>
  );
}
