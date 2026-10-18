import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Icon from '../components/Icon.jsx';
import MediaCard from '../components/MediaCard.jsx';
import TrafficCard from '../components/TrafficCard.jsx';
import { MemberCard, MemberPass } from '../components/MemberCard.jsx';
import { useStore } from '../store/AppStore.jsx';
import { relativeDay, todayLabelID, todayKey } from '../utils/date.js';
import './Home.css';

const QUICK = [
  { to: '/booking', label: 'Booking', icon: 'q-booking', w: 33.2, h: 34.4 },
  { to: '/guest-pass', label: 'Guest Pass', icon: 'q-guest', w: 28.5, h: 31.9 },
  { to: '/schedule', label: 'My Schedule', icon: 'q-schedule', w: 29.9, h: 27.7 },
  { to: '/club', label: 'The Club', icon: 'mark', w: 32, h: 32, primary: true },
];

// Distance the sheet travels before it docks under the status bar
// (design: sheet top 368 → 66).
const TRAVEL = 302;

export function sessionLabel(b) {
  return `${relativeDay(b.date)}  •  ${b.start} – ${b.end} WIB`;
}

export default function Home() {
  const { activeBookings } = useStore();
  const navigate = useNavigate();
  const [qr, setQr] = useState(false);
  const rootRef = useRef(null);

  // Drive the dim overlay from scroll position (sheet sliding over the card).
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const p = Math.min(1, Math.max(0, window.scrollY / TRAVEL));
        const el = rootRef.current;
        if (!el) return;
        el.style.setProperty('--p', p.toFixed(3));
        el.dataset.docked = p >= 0.999 ? 'true' : 'false';
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  const toggleSheet = () => {
    const up = window.scrollY < TRAVEL / 2;
    window.scrollTo({ top: up ? TRAVEL : 0, behavior: 'smooth' });
  };

  const upcoming = activeBookings
    .filter((b) => b.date >= todayKey())
    .sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start))
    .slice(0, 2);

  return (
    <div className="home" ref={rootRef}>
      <div className="home__bg" aria-hidden="true" />
      {/* Fixed layer: header + membership card, covered by the sheet as you scroll */}
      <div className="home__top">
        <div className="home__head"><Header logo /></div>
        <MemberCard onShowQr={() => setQr(true)} />
      </div>
      <div className="home__dim" aria-hidden="true" />
      {/* The strip above the docked sheet keeps showing the (dimmed) header */}
      <div className="home__band" aria-hidden="true">
        <div className="home__head"><Header logo /></div>
        <span className="home__band-dim" />
      </div>

      <div className="home__spacer" aria-hidden="true" />

      <section className="sheet-x" aria-label="Club shortcuts and sessions">
        <button type="button" className="sheet-x__cap" onClick={toggleSheet} aria-label="Expand or collapse">
          <span className="sheet-x__edge" />
          <svg className="sheet-x__notch" viewBox="0 0 80 24" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 0C10 0 14 8 23 8H57C66 8 70 0 80 0V24H0Z" fill="#fff" />
          </svg>
          <span className="sheet-x__edge sheet-x__edge--r" />
          <span className="sheet-x__grip" />
        </button>

        <div className="sheet-x__body">
          <nav className="quick" aria-label="Shortcuts">
            {QUICK.map((q) => (
              <Link key={q.to} to={q.to} className={`quick__item${q.primary ? ' is-primary' : ''}`}>
                <span className="quick__circle"><Icon name={q.icon} width={q.w} height={q.h} /></span>
                <span className="quick__label">{q.label}</span>
              </Link>
            ))}
          </nav>

          <div className="row-head">
            <h2 className="section-title">Upcoming Session</h2>
            <Link to="/schedule" className="link">View All <Icon name="chevron" width={4.6} height={8.7} /></Link>
          </div>
          <div className="stack">
            {upcoming.length ? upcoming.map((b) => (
              <MediaCard key={b.id} art={b.art} title={b.title} subtitle={sessionLabel(b)} onClick={() => navigate(`/schedule?open=${b.id}`)} />
            )) : (
              <div className="panel empty">
                <strong>No upcoming sessions</strong>
                <span>Book a court, class or treatment to see it here.</span>
                <Link to="/booking" className="btn btn--primary" style={{ marginTop: 8 }}>Book Now</Link>
              </div>
            )}
          </div>

          <div className="row-head row-head--traffic">
            <h2 className="section-title live"><span className="live__dot" aria-hidden="true" />Live Traffic</h2>
            <span className="live__date">{todayLabelID()}</span>
          </div>
          <TrafficCard />
        </div>
      </section>

      <MemberPass open={qr} onClose={() => setQr(false)} />
    </div>
  );
}
