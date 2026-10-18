import { useState } from 'react';
import Header from '../components/Header.jsx';
import Icon from '../components/Icon.jsx';
import QrCode from '../components/QrCode.jsx';
import Sheet from '../components/Sheet.jsx';
import { DateStrip } from '../components/Booking.jsx';
import { FACILITIES, facilityById } from '../data/catalog.js';
import { useStore } from '../store/AppStore.jsx';
import { addDays, longDate, relativeDay, toKey, todayKey } from '../utils/date.js';
import './Lists.css';

const DAYS = Array.from({ length: 14 }, (_, i) => toKey(addDays(new Date(), i)));

export default function GuestPass() {
  const { state, user, guestPassesLeft, guestPassQuota, dispatch, notify } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(DAYS[0]);
  const [facility, setFacility] = useState('tennis');
  const [error, setError] = useState('');
  const [showId, setShowId] = useState(null);
  const [revoke, setRevoke] = useState(false);

  const passes = state.guestPasses;
  const shown = passes.find((p) => p.id === showId);
  const used = guestPassQuota - guestPassesLeft;

  const create = (e) => {
    e.preventDefault();
    if (name.trim().length < 3) return setError('Please enter the guest’s full name.');
    if (!/^\+?[0-9\s-]{8,}$/.test(phone.trim())) return setError('Please enter a valid phone number.');
    if (guestPassesLeft <= 0) return setError('You have used all guest passes for this month.');
    setError('');
    dispatch({ type: 'addGuestPass', pass: { name: name.trim(), phone: phone.trim(), date, facility } });
    notify(`Guest pass created for ${name.trim()}`);
    setName('');
    setPhone('');
    // open the newest pass (added to the top of the list)
    setTimeout(() => setShowId('__latest'), 0);
  };
  const current = showId === '__latest' ? passes[0] : shown;

  const share = async () => {
    const text = `${user.name} invited you to Bumi Luhur Country Club on ${longDate(current.date)}. Your guest pass code: ${current.code}`;
    try {
      if (navigator.share) await navigator.share({ title: 'Bumi Luhur Guest Pass', text });
      else { await navigator.clipboard.writeText(text); notify('Invitation copied to clipboard'); }
    } catch { /* share cancelled */ }
  };

  return (
    <main className="page">
      <Header title="Guest Pass" back />

      <section className="hero-card">
        <Icon name="q-guest" className="hero-card__mark" width={24} height={27} />
        <p className="hero-card__label">Guest passes this month</p>
        <p className="hero-card__value">{guestPassesLeft}<small>of {guestPassQuota} left</small></p>
        <div className="progress"><span style={{ width: `${(used / guestPassQuota) * 100}%` }} /></div>
        <p className="hero-card__foot">Each pass gives one guest access for the selected day.</p>
      </section>

      <form className="panel gap-24 stack" onSubmit={create} noValidate>
        <h2 className="panel-title" style={{ margin: 0 }}>Invite a Guest</h2>
        <label className="field">
          <span className="field__label">Guest full name</span>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rizky Pratama" autoComplete="off" />
        </label>
        <label className="field">
          <span className="field__label">Phone number</span>
          <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+62 812 0000 0000" inputMode="tel" autoComplete="off" />
        </label>
        <div className="field">
          <span className="field__label">Visit date</span>
          <div style={{ margin: '0 3px' }}><DateStrip days={DAYS} value={date} onChange={setDate} /></div>
        </div>
        <label className="field">
          <span className="field__label">Facility</span>
          <select className="input" value={facility} onChange={(e) => setFacility(e.target.value)}>
            {FACILITIES.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </label>
        {error && <p role="alert" style={{ color: '#d92d20', fontSize: 13 }}>{error}</p>}
        <button type="submit" className="btn btn--primary btn--block" disabled={guestPassesLeft <= 0}>Create Guest Pass</button>
      </form>

      <section className="gap-24">
        <h2 className="section-title" style={{ marginBottom: 12 }}>My Guest Passes</h2>
        <div className="panel" style={{ padding: '4px 21px' }}>
          {passes.length ? passes.map((p) => (
            <button key={p.id} type="button" className="list-row" style={{ width: '100%', textAlign: 'left' }} onClick={() => setShowId(p.id)}>
              <span className="list-row__main">
                <span className="list-row__title" style={{ display: 'block' }}>{p.name}</span>
                <span className="list-row__sub" style={{ display: 'block' }}>{relativeDay(p.date)} · {facilityById(p.facility)?.name}</span>
              </span>
              <span className={`badge${p.status === 'revoked' ? ' badge--red' : p.date < todayKey() ? ' badge--grey' : ''}`}>
                {p.status === 'revoked' ? 'Revoked' : p.date < todayKey() ? 'Expired' : 'Active'}
              </span>
            </button>
          )) : <p className="empty">No guest passes yet.</p>}
        </div>
      </section>

      <Sheet
        open={!!current}
        onClose={() => { setShowId(null); setRevoke(false); }}
        title="Guest Pass"
        footer={current && current.status === 'active' && (
          revoke ? (
            <>
              <button type="button" className="btn btn--danger btn--block" onClick={() => { dispatch({ type: 'revokeGuestPass', id: current.id }); notify('Guest pass revoked'); setShowId(null); setRevoke(false); }}>Yes, Revoke Pass</button>
              <button type="button" className="btn btn--soft btn--block" onClick={() => setRevoke(false)}>Keep Pass</button>
            </>
          ) : (
            <>
              <button type="button" className="btn btn--primary btn--block" onClick={share}><Icon name="share" size={18} /> Share Invitation</button>
              <button type="button" className="btn btn--danger btn--block" onClick={() => setRevoke(true)}>Revoke Pass</button>
            </>
          )
        )}
      >
        {current && (
          <>
            <div className="code-box">
              <QrCode value={`BUMILUHUR:GUEST:${current.code}`} size={180} label={`Guest pass ${current.code}`} />
              <p className="code-box__code">{current.code}</p>
              <p className="code-box__sub">{current.name} · guest of {user.name}</p>
            </div>
            <div className="detail-grid">
              <div className="detail detail--wide"><p className="detail__label">Visit date</p><p className="detail__value">{longDate(current.date)}</p></div>
              <div className="detail"><p className="detail__label">Facility</p><p className="detail__value">{facilityById(current.facility)?.name}</p></div>
              <div className="detail"><p className="detail__label">Phone</p><p className="detail__value">{current.phone}</p></div>
            </div>
          </>
        )}
      </Sheet>
    </main>
  );
}
