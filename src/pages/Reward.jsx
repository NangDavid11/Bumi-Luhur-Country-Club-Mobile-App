import { useState } from 'react';
import Header from '../components/Header.jsx';
import Icon from '../components/Icon.jsx';
import MediaCard from '../components/MediaCard.jsx';
import Sheet from '../components/Sheet.jsx';
import { Segmented } from '../components/Controls.jsx';
import { REWARDS } from '../data/catalog.js';
import { useStore } from '../store/AppStore.jsx';
import { relativeDay } from '../utils/date.js';
import './Lists.css';

const TABS = [{ id: 'rewards', label: 'Rewards' }, { id: 'vouchers', label: 'My Vouchers' }, { id: 'history', label: 'History' }];
const fmt = (n) => n.toLocaleString('id-ID');

export default function Reward() {
  const { state, dispatch, notify } = useStore();
  const [tab, setTab] = useState('rewards');
  const [item, setItem] = useState(null);
  const [voucher, setVoucher] = useState(null);

  const next = REWARDS.filter((r) => r.points > state.points).sort((a, b) => a.points - b.points)[0];

  const redeem = () => {
    dispatch({ type: 'redeem', reward: item });
    notify(`${item.name} redeemed`);
    setItem(null);
    setTab('vouchers');
  };

  return (
    <main className="page">
      <Header title="Reward" />

      <section className="hero-card">
        <Icon name="nav-reward" className="hero-card__mark" width={20} height={29} />
        <p className="hero-card__label">Reward Points</p>
        <p className="hero-card__value">{fmt(state.points)}<small>pts</small></p>
        {next ? (
          <>
            <div className="progress"><span style={{ width: `${Math.min(100, (state.points / next.points) * 100)}%` }} /></div>
            <p className="hero-card__foot">{fmt(next.points - state.points)} pts to unlock {next.name}</p>
          </>
        ) : <p className="hero-card__foot">You can redeem every reward in the catalogue.</p>}
      </section>

      <div className="gap-24"><Segmented items={TABS} value={tab} onChange={setTab} label="Rewards" /></div>

      {tab === 'rewards' && (
        <div className="stack gap-24">
          {REWARDS.map((r) => (
            <MediaCard key={r.id} art={r.art} title={r.name} subtitle={`${fmt(r.points)} pts · ${r.category}`} onClick={() => setItem(r)}>
              {state.points < r.points && <span className="badge badge--grey mcard__corner" style={{ background: '#fff' }}>Locked</span>}
            </MediaCard>
          ))}
        </div>
      )}

      {tab === 'vouchers' && (
        <div className="panel gap-24" style={{ padding: '4px 21px' }}>
          {state.redemptions.length ? state.redemptions.map((r) => (
            <button key={r.id} type="button" className="list-row" style={{ width: '100%', textAlign: 'left' }} onClick={() => setVoucher(r)}>
              <span className="list-row__main">
                <span className="list-row__title" style={{ display: 'block' }}>{r.name}</span>
                <span className="list-row__sub" style={{ display: 'block' }}>Redeemed {relativeDay(r.date).toLowerCase()} · {r.code}</span>
              </span>
              <span className="badge">Use</span>
            </button>
          )) : <div className="empty"><strong>No vouchers yet</strong><span>Redeem a reward to get your first voucher.</span></div>}
        </div>
      )}

      {tab === 'history' && (
        <div className="panel gap-24" style={{ padding: '4px 21px' }}>
          {state.pointsHistory.map((h) => (
            <div key={h.id} className="list-row">
              <div className="list-row__main">
                <p className="list-row__title">{h.label}</p>
                <p className="list-row__sub">{relativeDay(h.date)}</p>
              </div>
              <span style={{ fontWeight: 700, color: h.delta > 0 ? 'var(--green)' : '#d92d20' }}>{h.delta > 0 ? '+' : ''}{fmt(h.delta)}</span>
            </div>
          ))}
        </div>
      )}

      <Sheet
        open={!!item}
        onClose={() => setItem(null)}
        title={item?.name}
        footer={item && (
          <button type="button" className="btn btn--primary btn--block" disabled={state.points < item.points} onClick={redeem}>
            {state.points < item.points ? `Need ${fmt(item.points - state.points)} more pts` : `Redeem for ${fmt(item.points)} pts`}
          </button>
        )}
      >
        {item && (
          <>
            <MediaCard art={item.art} title={item.name} subtitle={item.category} as="div" />
            <p style={{ fontSize: 14, lineHeight: '21px', color: 'var(--grey-2)' }}>{item.description}</p>
            <div className="detail-grid">
              <div className="detail"><p className="detail__label">Cost</p><p className="detail__value">{fmt(item.points)} pts</p></div>
              <div className="detail"><p className="detail__label">Your balance</p><p className="detail__value">{fmt(state.points)} pts</p></div>
            </div>
          </>
        )}
      </Sheet>

      <Sheet open={!!voucher} onClose={() => setVoucher(null)} title={voucher?.name}>
        {voucher && (
          <div className="code-box">
            <p className="code-box__code">{voucher.code}</p>
            <p className="code-box__sub">Show this code at the front desk. Valid for 30 days from redemption.</p>
          </div>
        )}
      </Sheet>
    </main>
  );
}
