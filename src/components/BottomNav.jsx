import { NavLink, useLocation } from 'react-router-dom';
import Icon from './Icon.jsx';
import './BottomNav.css';

const ITEMS = [
  { to: '/', label: 'Home', icon: 'nav-home', size: [23.4, 23.4], match: ['/', '/schedule', '/guest-pass', '/notifications', '/live-traffic'] },
  { to: '/facilities', label: 'Facilites', icon: 'nav-facilities', size: [22.2, 23.4], match: ['/facilities', '/booking', '/club'] },
  { to: '/class', label: 'Class', icon: 'nav-class', size: [23.2, 23.6], match: ['/class'] },
  { to: '/reward', label: 'Reward', icon: 'nav-reward', size: [16.4, 23.6], match: ['/reward'] },
  { to: '/profile', label: 'Profile', icon: 'nav-profile', size: [23.4, 23.4], match: ['/profile'] },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const activeIndex = ITEMS.findIndex((it) => it.match.some((m) => (m === '/' ? pathname === '/' : pathname.startsWith(m))));

  return (
    <nav className="bnav" aria-label="Main">
      {ITEMS.map((it, i) => (
        <NavLink key={it.to} to={it.to} className={`bnav__item${i === activeIndex ? ' is-active' : ''}`} aria-current={i === activeIndex ? 'page' : undefined} end={it.to === '/'}>
          <span className="bnav__icon"><Icon name={it.icon} width={it.size[0]} height={it.size[1]} /></span>
          <span className="bnav__label">{it.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
