import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icon.jsx';
import './Sheet.css';

/* Bottom sheet dialog used for details and confirmations. Closes on
   backdrop tap, the close button, Escape, or a downward swipe. */
export default function Sheet({ open, onClose, title, children, footer, labelledBy }) {
  const panel = useRef(null);
  const startY = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.activeElement;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.documentElement.classList.add('no-scroll');
    requestAnimationFrame(() => panel.current?.focus());
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.classList.remove('no-scroll');
      prev?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  const onTouchStart = (e) => { startY.current = e.touches[0].clientY; };
  const onTouchEnd = (e) => {
    if (startY.current == null) return;
    const dy = e.changedTouches[0].clientY - startY.current;
    startY.current = null;
    if (dy > 80 && panel.current?.scrollTop <= 0) onClose();
  };

  return createPortal(
    <div className="sheet" role="presentation">
      <div className="sheet__backdrop" onClick={onClose} />
      <div
        className="sheet__panel"
        role="dialog"
        aria-modal="true"
        aria-label={labelledBy ? undefined : title}
        aria-labelledby={labelledBy}
        tabIndex={-1}
        ref={panel}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <span className="sheet__grip" aria-hidden="true" />
        <div className="sheet__head">
          {title && <h2 className="sheet__title">{title}</h2>}
          <button type="button" className="sheet__close" onClick={onClose} aria-label="Close">
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className="sheet__body">{children}</div>
        {footer && <div className="sheet__footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
