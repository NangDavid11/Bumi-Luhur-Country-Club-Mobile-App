import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Icon from '../components/Icon.jsx';
import Sheet from '../components/Sheet.jsx';
import { Toggle } from '../components/Controls.jsx';
import { MemberPass } from '../components/MemberCard.jsx';
import { useStore } from '../store/AppStore.jsx';
import { useInstallPrompt } from '../hooks/useInstallPrompt.js';
import { membershipExpiry, todayKey } from '../utils/date.js';
import './Lists.css';
import './Profile.css';

export default function Profile() {
  const { user, state, activeBookings, dispatch, notify } = useStore();
  const [qr, setQr] = useState(false);
  const [signOut, setSignOut] = useState(false);
  const [renew, setRenew] = useState(false);
  const { canInstall, installed, isIos, install } = useInstallPrompt();
  const [iosHelp, setIosHelp] = useState(false);

  const setting = (key) => (value) => dispatch({ type: 'setting', key, value });
  const upcoming = activeBookings.filter((b) => b.date >= todayKey()).length;

  return (
    <main className="page">
      <Header title="Profile" />

      <section className="profile">
        <img className="profile__avatar" src={user.avatar} alt="" width="76" height="76" />
        <div className="profile__main">
          <h2 className="profile__name">{user.name}</h2>
          <p className="profile__id">{user.memberId}</p>
          <span className="badge" style={{ marginTop: 8 }}>{user.membership}</span>
        </div>
        <button type="button" className="round-btn profile__qr" onClick={() => setQr(true)} aria-label="Show member QR code">
          <Icon name="qr" size={22} />
        </button>
      </section>

      <div className="stats">
        <Link to="/schedule" className="stat"><strong>{upcoming}</strong><span>Upcoming</span></Link>
        <Link to="/reward" className="stat"><strong>{state.points.toLocaleString('id-ID')}</strong><span>Points</span></Link>
        <Link to="/guest-pass" className="stat"><strong>{state.guestPasses.filter((g) => g.status === 'active').length}</strong><span>Guest Passes</span></Link>
      </div>

      <section className="panel gap-24">
        <h3 className="panel-title">Membership</h3>
        <div className="list-row"><div className="list-row__main"><p className="list-row__sub">Plan</p><p className="list-row__title">{user.membership}</p></div></div>
        <div className="list-row"><div className="list-row__main"><p className="list-row__sub">Valid until</p><p className="list-row__title">{membershipExpiry(user.expires)}</p></div><button type="button" className="btn btn--soft" style={{ height: 36, fontSize: 13 }} onClick={() => setRenew(true)}>Renew</button></div>
        <div className="list-row"><div className="list-row__main"><p className="list-row__sub">Member since</p><p className="list-row__title">{membershipExpiry(user.memberSince)}</p></div></div>
      </section>

      <section className="panel">
        <h3 className="panel-title">Contact</h3>
        <div className="list-row"><Icon name="mail" size={20} style={{ color: 'var(--green)' }} /><div className="list-row__main"><p className="list-row__title">{user.email}</p></div></div>
        <div className="list-row"><Icon name="phone" size={20} style={{ color: 'var(--green)' }} /><div className="list-row__main"><p className="list-row__title">{user.phone}</p></div></div>
      </section>

      <section className="panel">
        <h3 className="panel-title">Notifications</h3>
        <div className="list-row"><div className="list-row__main"><p className="list-row__title">Push notifications</p><p className="list-row__sub">Bookings, events and offers</p></div><Toggle checked={state.settings.pushNotifications} onChange={setting('pushNotifications')} label="Push notifications" /></div>
        <div className="list-row"><div className="list-row__main"><p className="list-row__title">Session reminders</p><p className="list-row__sub">One hour before each booking</p></div><Toggle checked={state.settings.bookingReminders} onChange={setting('bookingReminders')} label="Session reminders" /></div>
        <div className="list-row"><div className="list-row__main"><p className="list-row__title">Club newsletter</p><p className="list-row__sub">Monthly news by email</p></div><Toggle checked={state.settings.newsletter} onChange={setting('newsletter')} label="Club newsletter" /></div>
      </section>

      <section className="panel">
        <h3 className="panel-title">App</h3>
        {!installed && (canInstall || isIos) && (
          <button type="button" className="list-row profile__row" onClick={() => (canInstall ? install() : setIosHelp(true))}>
            <Icon name="download" size={20} style={{ color: 'var(--green)' }} />
            <span className="list-row__main list-row__title">Install Bumi Luhur App</span>
            <Icon name="chevron" width={5} height={9} style={{ color: 'var(--grey)' }} />
          </button>
        )}
        <a className="list-row profile__row" href="https://wa.me/6281234567890" target="_blank" rel="noreferrer">
          <Icon name="phone" size={20} style={{ color: 'var(--green)' }} />
          <span className="list-row__main list-row__title">Contact Concierge</span>
          <Icon name="chevron" width={5} height={9} style={{ color: 'var(--grey)' }} />
        </a>
        <button type="button" className="list-row profile__row" onClick={() => setSignOut(true)}>
          <Icon name="logout" size={20} style={{ color: '#d92d20' }} />
          <span className="list-row__main list-row__title" style={{ color: '#d92d20' }}>Sign Out</span>
        </button>
      </section>

      <p className="profile__version">Bumi Luhur Country Club · v1.0.0</p>

      <MemberPass open={qr} onClose={() => setQr(false)} />

      <Sheet open={renew} onClose={() => setRenew(false)} title="Renew Membership"
        footer={<button type="button" className="btn btn--primary btn--block" onClick={() => { setRenew(false); notify('Renewal request sent — our team will contact you'); }}>Request Renewal</button>}>
        <p style={{ fontSize: 14, lineHeight: '21px', color: 'var(--grey-2)' }}>Your {user.membership} is valid until {membershipExpiry(user.expires)}. Send a renewal request and the membership team will contact you with options.</p>
      </Sheet>

      <Sheet open={signOut} onClose={() => setSignOut(false)} title="Sign Out?"
        footer={(
          <>
            <button type="button" className="btn btn--danger btn--block" onClick={() => { dispatch({ type: 'reset' }); setSignOut(false); notify('Signed out — demo data has been reset'); }}>Sign Out</button>
            <button type="button" className="btn btn--soft btn--block" onClick={() => setSignOut(false)}>Stay Signed In</button>
          </>
        )}>
        <p style={{ fontSize: 14, lineHeight: '21px', color: 'var(--grey-2)' }}>This demo has no login yet, so signing out resets the sample bookings, passes and points on this device.</p>
      </Sheet>

      <Sheet open={iosHelp} onClose={() => setIosHelp(false)} title="Install on iPhone">
        <ol className="steps">
          <li>Tap the <strong>Share</strong> button in Safari.</li>
          <li>Choose <strong>Add to Home Screen</strong>.</li>
          <li>Tap <strong>Add</strong> — Bumi Luhur opens full-screen like a native app.</li>
        </ol>
      </Sheet>
    </main>
  );
}
