import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Icon from '../components/Icon.jsx';
import TrafficCard, { useTrafficNow } from '../components/TrafficCard.jsx';
import { CATEGORIES, FACILITIES, TRAFFIC, TRAFFIC_START_HOUR, trafficLevel } from '../data/catalog.js';
import { useStore } from '../store/AppStore.jsx';
import { hhmm, todayLabelID } from '../utils/date.js';
import './Lists.css';

/* ------------------------------------------------------------ Notifications */
export function Notifications() {
  const { state, unread, dispatch } = useStore();
  const navigate = useNavigate();
  return (
    <main className="page">
      <Header
        title="Notifications"
        back
        right={(
          <button type="button" className="round-btn" onClick={() => dispatch({ type: 'readAll' })} aria-label="Mark all as read" disabled={!unread} style={{ opacity: unread ? 1 : .5 }}>
            <Icon name="check" size={22} />
          </button>
        )}
      />
      <div className="panel" style={{ padding: '4px 21px' }}>
        {state.notifications.map((n) => (
          <button
            key={n.id}
            type="button"
            className="list-row"
            style={{ width: '100%', textAlign: 'left', alignItems: 'flex-start' }}
            onClick={() => { dispatch({ type: 'readNotification', id: n.id }); if (n.to) navigate(n.to); }}
          >
            <span style={{ width: 8, height: 8, borderRadius: 4, marginTop: 6, flex: 'none', background: n.read ? 'transparent' : 'var(--red)' }} aria-hidden="true" />
            <span className="list-row__main">
              <span className="list-row__title" style={{ display: 'block', fontWeight: n.read ? 500 : 700 }}>{n.title}</span>
              <span className="list-row__sub" style={{ display: 'block', lineHeight: '17px' }}>{n.body}</span>
            </span>
            <span className="list-row__sub" style={{ whiteSpace: 'nowrap' }}>{n.time}</span>
          </button>
        ))}
        {!state.notifications.length && <p className="empty">You’re all caught up.</p>}
      </div>
    </main>
  );
}

/* ------------------------------------------------------------ Live traffic */
export function LiveTraffic() {
  const [cat, setCat] = useState('sports');
  const { current, isOpen } = useTrafficNow();
  const idx = current - TRAFFIC_START_HOUR;

  return (
    <main className="page">
      <Header title="Live Traffic" back />
      <div className="row-head" style={{ margin: '0 0 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--green)' }} aria-hidden="true" />{isOpen ? 'Live now' : 'Club closed'}
        </h2>
        <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--green)' }}>{todayLabelID()}</span>
      </div>
      <TrafficCard detailLink={false} window={10} key={cat} initial={cat} />

      <h2 className="section-title gap-24" style={{ marginBottom: 12 }}>By Category</h2>
      <div className="panel" style={{ padding: '4px 21px' }}>
        {CATEGORIES.map((c) => {
          const v = TRAFFIC[c.id][idx];
          return (
            <button key={c.id} type="button" className="list-row" style={{ width: '100%', textAlign: 'left' }} onClick={() => { setCat(c.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              <Icon name={c.icon} size={20} style={{ color: 'var(--green)' }} />
              <span className="list-row__main">
                <span className="list-row__title" style={{ display: 'block' }}>{c.label}</span>
                <span className="progress progress--green" style={{ display: 'block', marginTop: 8 }}><span style={{ width: `${v}%` }} /></span>
              </span>
              <span style={{ textAlign: 'right', minWidth: 64 }}>
                <span style={{ display: 'block', fontWeight: 700, color: 'var(--green)' }}>{v}%</span>
                <span className="list-row__sub" style={{ display: 'block' }}>{trafficLevel(v)}</span>
              </span>
            </button>
          );
        })}
      </div>

      <h2 className="section-title gap-24" style={{ marginBottom: 12 }}>Quietest Facilities Now</h2>
      <div className="panel" style={{ padding: '4px 21px' }}>
        {FACILITIES.filter((f) => f.bookable && current >= f.open && current < f.close)
          .map((f) => ({ f, v: Math.round(TRAFFIC[f.category][idx] * (0.7 + ((f.id.length * 13) % 7) / 10)) }))
          .sort((a, b) => a.v - b.v)
          .slice(0, 5)
          .map(({ f, v }) => (
            <Link key={f.id} to={`/booking?cat=${f.category}&facility=${f.id}`} className="list-row">
              <span className="list-row__main">
                <span className="list-row__title" style={{ display: 'block' }}>{f.name}</span>
                <span className="list-row__sub" style={{ display: 'block' }}>{Math.min(v, 100)}% busy · {hhmm(current)} – {hhmm(current + 1)}</span>
              </span>
              <span className="badge">Book</span>
            </Link>
          ))}
      </div>
    </main>
  );
}

/* ------------------------------------------------------------ 404 */
export function NotFound() {
  return (
    <main className="page">
      <Header title="Not Found" back />
      <div className="empty">
        <strong>This page doesn’t exist</strong>
        <Link to="/" className="btn btn--primary">Back to Home</Link>
      </div>
    </main>
  );
}
