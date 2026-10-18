import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import MediaCard from '../components/MediaCard.jsx';
import Sheet from '../components/Sheet.jsx';
import { DateStrip, SlotGrid } from '../components/Booking.jsx';
import { COACHES, EVENTS, OFFERS, facilityById } from '../data/catalog.js';
import { useStore } from '../store/AppStore.jsx';
import { addDays, addMinutes, longDate, relativeDay, toKey } from '../utils/date.js';
import { slotsFor } from '../utils/slots.js';
import './Lists.css';

const SECTIONS = [
  { title: 'Facilities', subtitle: 'Find your favorite spaces.', art: 'ceFacilities', to: '/facilities' },
  { title: 'Classes', subtitle: "See today's and upcoming sessions.", art: 'ceClasses', to: '/class' },
  { title: 'Coaching', subtitle: 'Discover personal training & coaching.', art: 'ceCoaching', to: '/club/coaching' },
  { title: 'Events', subtitle: "What's happening at the club.", art: 'ceEvents', to: '/club/events' },
  { title: 'Events', subtitle: 'Member-only offers.', art: 'ceOffers', to: '/club/offers' },
];

export default function Club() {
  const navigate = useNavigate();
  return (
    <main className="page">
      <Header title="Club Experience" back />
      <div className="stack">
        {SECTIONS.map((s) => (
          <MediaCard key={s.to} variant="feature" art={s.art} title={s.title} subtitle={s.subtitle} onClick={() => navigate(s.to)} />
        ))}
      </div>
    </main>
  );
}

/* ------------------------------------------------------------ Coaching */
const DAYS = Array.from({ length: 10 }, (_, i) => toKey(addDays(new Date(), i)));

export function Coaching() {
  const { activeBookings, dispatch, notify } = useStore();
  const [coach, setCoach] = useState(null);
  const [date, setDate] = useState(DAYS[0]);
  const [time, setTime] = useState(null);
  const facility = coach && facilityById(coach.facility);
  const slots = facility ? slotsFor({ ...facility, open: Math.max(facility.open, 7), close: Math.min(facility.close, 20) }, date, activeBookings) : [];

  const request = () => {
    dispatch({ type: 'book', earn: true, items: [{ type: 'coaching', refId: coach.id, title: coach.name, art: coach.art, date, start: time, end: addMinutes(time, parseInt(coach.duration, 10)), place: `${coach.coach} · ${facility.name}` }] });
    notify(`${coach.name} booked with ${coach.coach}`);
    setCoach(null);
  };

  return (
    <main className="page">
      <Header title="Coaching" back />
      <div className="stack">
        {COACHES.map((c) => (
          <MediaCard key={c.id} art={c.art} title={c.name} subtitle={`${c.coach} · ${c.duration}`} onClick={() => { setCoach(c); setTime(null); setDate(DAYS[0]); }} />
        ))}
      </div>
      <Sheet
        open={!!coach}
        onClose={() => setCoach(null)}
        title={coach?.name}
        footer={<button type="button" className="btn btn--primary btn--block" disabled={!time} onClick={request}>{time ? `Book ${relativeDay(date)}, ${time}` : 'Choose a time'}</button>}
      >
        {coach && (
          <>
            <p style={{ fontSize: 14, lineHeight: '21px', color: 'var(--grey-2)' }}>{coach.description} With {coach.coach}, {coach.duration} per session.</p>
            <DateStrip days={DAYS} value={date} onChange={(d) => { setDate(d); setTime(null); }} />
            <SlotGrid slots={slots} selected={time ? [time] : []} onToggle={(t) => setTime(t === time ? null : t)} />
          </>
        )}
      </Sheet>
    </main>
  );
}

/* ------------------------------------------------------------ Events */
export function Events() {
  const { activeBookings, dispatch, notify } = useStore();
  const [ev, setEv] = useState(null);
  const dateOf = (e) => toKey(addDays(new Date(), e.dayOffset));
  const rsvp = (e) => activeBookings.find((b) => b.type === 'event' && b.refId === e.id);

  const toggle = (e) => {
    const b = rsvp(e);
    if (b) {
      dispatch({ type: 'cancelBooking', id: b.id });
      notify('RSVP cancelled');
    } else {
      dispatch({ type: 'book', items: [{ type: 'event', refId: e.id, title: e.name, art: e.art, date: dateOf(e), start: e.time, end: addMinutes(e.time, 120), place: e.place }] });
      notify(`See you at ${e.name}!`);
    }
    setEv(null);
  };

  return (
    <main className="page">
      <Header title="Events" back />
      <div className="stack">
        {EVENTS.map((e) => (
          <MediaCard key={e.id} art={e.art} title={e.name} subtitle={`${relativeDay(dateOf(e))} · ${e.time} · ${e.place}`} onClick={() => setEv(e)}>
            {rsvp(e) && <span className="badge mcard__corner" style={{ background: '#fff' }}>Going</span>}
          </MediaCard>
        ))}
      </div>
      <Sheet
        open={!!ev}
        onClose={() => setEv(null)}
        title={ev?.name}
        footer={ev && <button type="button" className={`btn btn--block ${rsvp(ev) ? 'btn--danger' : 'btn--primary'}`} onClick={() => toggle(ev)}>{rsvp(ev) ? 'Cancel RSVP' : 'RSVP — I’m Going'}</button>}
      >
        {ev && (
          <>
            <MediaCard art={ev.art} title={ev.name} subtitle={ev.place} as="div" />
            <p style={{ fontSize: 14, lineHeight: '21px', color: 'var(--grey-2)' }}>{ev.description}</p>
            <div className="detail-grid">
              <div className="detail detail--wide"><p className="detail__label">Date</p><p className="detail__value">{longDate(dateOf(ev))}</p></div>
              <div className="detail"><p className="detail__label">Time</p><p className="detail__value">{ev.time} WIB</p></div>
              <div className="detail"><p className="detail__label">Location</p><p className="detail__value">{ev.place}</p></div>
            </div>
          </>
        )}
      </Sheet>
    </main>
  );
}

/* ------------------------------------------------------------ Offers */
export function Offers() {
  const { state, dispatch, notify } = useStore();
  const [offer, setOffer] = useState(null);
  const claimed = (o) => state.claimedOffers.includes(o.id);
  return (
    <main className="page">
      <Header title="Offers" back />
      <div className="stack">
        {OFFERS.map((o) => (
          <MediaCard key={o.id} art={o.art} title={o.name} subtitle={o.until} onClick={() => setOffer(o)}>
            {claimed(o) && <span className="badge mcard__corner" style={{ background: '#fff' }}>Claimed</span>}
          </MediaCard>
        ))}
      </div>
      <Sheet
        open={!!offer}
        onClose={() => setOffer(null)}
        title={offer?.name}
        footer={offer && !claimed(offer) && (
          <button type="button" className="btn btn--primary btn--block" onClick={() => { dispatch({ type: 'claimOffer', id: offer.id }); notify('Offer added to your account'); }}>Claim Offer</button>
        )}
      >
        {offer && (
          <>
            <p style={{ fontSize: 14, lineHeight: '21px', color: 'var(--grey-2)' }}>{offer.description}</p>
            <div className="detail"><p className="detail__label">Validity</p><p className="detail__value">{offer.until}</p></div>
            {claimed(offer) && (
              <div className="code-box">
                <p className="code-box__code">{`BL-${offer.id.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)}`}</p>
                <p className="code-box__sub">Show this code at the front desk or restaurant.</p>
              </div>
            )}
          </>
        )}
      </Sheet>
    </main>
  );
}
