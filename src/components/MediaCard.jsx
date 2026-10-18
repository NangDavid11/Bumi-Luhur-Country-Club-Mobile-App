import { ART, TONES } from '../data/catalog.js';
import Icon from './Icon.jsx';
import './MediaCard.css';

const BASE_W = 345; // art boxes are measured on the design's 345px-wide card
const cq = (v) => `${((v / BASE_W) * 100).toFixed(3)}cqw`;

function rgba(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

/* Photo card used for facilities, sessions, classes and club sections:
   background photo, a tinted gradient, an optional cut-out figure on top,
   a white icon and two lines of text. */
export default function MediaCard({
  art: artKey,
  title,
  subtitle,
  variant = 'default', // 'default' | 'feature' (Club Experience) | 'compact'
  icon,
  as: Tag = 'button',
  className = '',
  children,
  ...rest
}) {
  const art = typeof artKey === 'string' ? ART[artKey] : artKey;
  const tone = TONES[art?.tone] ?? TONES.forest;
  const box = (b) => (b ? { left: cq(b[0]), top: cq(b[1]), width: cq(b[2]), height: cq(b[3]) } : undefined);
  const props = Tag === 'button' ? { type: 'button', ...rest } : rest;

  return (
    <Tag className={`mcard mcard--${variant} ${className}`} style={{ '--tint-a': rgba(tone, art?.tintA ?? 0.3), '--tint-b': rgba(tone, 1), '--tint-end': art?.tintEnd ?? '153%' }} {...props}>
      <span className="mcard__media" aria-hidden="true">
        {art?.bg && (
          <img
            className={`mcard__bg${art.bgBox ? '' : ' is-cover'}`}
            src={art.bg}
            alt=""
            loading="lazy"
            decoding="async"
            style={art.bgBox ? box(art.bgBox) : { objectPosition: art.pos ?? '50% 50%' }}
            onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
          />
        )}
        <span className="mcard__tint" />
        {art?.cut && <img className="mcard__cut" src={art.cut} alt="" loading="lazy" decoding="async" style={box(art.cutBox)} />}
      </span>
      <Icon name={icon ?? art?.icon ?? 'mark'} className="mcard__icon" size={variant === 'feature' ? 18 : 18.7} />
      <span className="mcard__text">
        <span className="mcard__title">{title}</span>
        {subtitle && <span className="mcard__sub">{subtitle}</span>}
      </span>
      {children}
    </Tag>
  );
}
