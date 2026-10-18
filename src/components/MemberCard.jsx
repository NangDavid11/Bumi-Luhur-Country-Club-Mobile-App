import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icon.jsx';
import QrCode from './QrCode.jsx';
import { useStore } from '../store/AppStore.jsx';
import { greeting, membershipExpiry } from '../utils/date.js';
import './MemberCard.css';

/* Green membership card on Home. The QR icon opens the full-screen pass. */
export function MemberCard({ onShowQr }) {
  const { user } = useStore();
  return (
    <section className="mcardx" aria-label="Membership card">
      <span className="mcardx__leaf" aria-hidden="true"><Icon name="leaf-pattern" width={326} height={263} /></span>
      <Icon name="mark" className="mcardx__mark" size={28} />
      <button type="button" className="mcardx__qr" onClick={onShowQr} aria-label="Show member QR code">
        <Icon name="qr" size={23.4} />
      </button>
      <p className="mcardx__greet">{greeting()}</p>
      <p className="mcardx__name">{user.name}</p>
      <p className="mcardx__plan">{user.membership}</p>
      <p className="mcardx__exp">Exp : {membershipExpiry(user.expires)}</p>
    </section>
  );
}

/* Full-screen member pass with a scannable QR code. Tap anywhere to close. */
export function MemberPass({ open, onClose }) {
  const { user } = useStore();
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.documentElement.classList.add('no-scroll');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.classList.remove('no-scroll');
    };
  }, [open, onClose]);
  if (!open) return null;

  return createPortal(
    <div className="mpass" role="dialog" aria-modal="true" aria-label="Member pass" onClick={onClose}>
      <div className="mpass__card">
        <span className="mpass__leaf" aria-hidden="true"><Icon name="leaf-pattern" width={326} height={263} /></span>
        <Icon name="logo" className="mpass__logo" width={171} height={45.5} label="Bumi Luhur Country Club" />
        <div className="mpass__qr">
          <QrCode value={`BUMILUHUR:${user.memberId}:${user.name}`} size={202} label={`Member QR code for ${user.memberId}`} />
        </div>
        <p className="mpass__tier">{user.tier}</p>
        <p className="mpass__name">{user.name}</p>
        <p className="mpass__id">{user.memberId}</p>
      </div>
      <button type="button" className="mpass__hint" onClick={onClose}>(Tap anywhere to close)</button>
    </div>,
    document.body,
  );
}
