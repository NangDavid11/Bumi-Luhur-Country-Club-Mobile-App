import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import BottomNav from './components/BottomNav.jsx';
import Toast from './components/Toast.jsx';
import Home from './pages/Home.jsx';

// Home ships in the main bundle; other screens load on demand.
const Facilities = lazy(() => import('./pages/Facilities.jsx'));
const Class = lazy(() => import('./pages/Class.jsx'));
const Booking = lazy(() => import('./pages/Booking.jsx'));
const Club = lazy(() => import('./pages/Club.jsx'));
const Coaching = lazy(() => import('./pages/Club.jsx').then((m) => ({ default: m.Coaching })));
const Events = lazy(() => import('./pages/Club.jsx').then((m) => ({ default: m.Events })));
const Offers = lazy(() => import('./pages/Club.jsx').then((m) => ({ default: m.Offers })));
const Schedule = lazy(() => import('./pages/Schedule.jsx'));
const GuestPass = lazy(() => import('./pages/GuestPass.jsx'));
const Reward = lazy(() => import('./pages/Reward.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const Notifications = lazy(() => import('./pages/Misc.jsx').then((m) => ({ default: m.Notifications })));
const LiveTraffic = lazy(() => import('./pages/Misc.jsx').then((m) => ({ default: m.LiveTraffic })));
const NotFound = lazy(() => import('./pages/Misc.jsx').then((m) => ({ default: m.NotFound })));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// The five tab roots show the bottom navigation; detail screens (with a
// back button) are full-height, as in the design's Booking and Club screens.
const TAB_ROOTS = ['/', '/facilities', '/class', '/reward', '/profile'];

export default function App() {
  const { pathname } = useLocation();
  const showNav = TAB_ROOTS.includes(pathname.replace(/\/+$/, '') || '/');
  return (
    <div className={`app${showNav ? '' : ' app--nonav'}`}>
      <ScrollToTop />
      <Suspense fallback={<div className="page" aria-busy="true" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/class" element={<Class />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/club" element={<Club />} />
          <Route path="/club/coaching" element={<Coaching />} />
          <Route path="/club/events" element={<Events />} />
          <Route path="/club/offers" element={<Offers />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/guest-pass" element={<GuestPass />} />
          <Route path="/reward" element={<Reward />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/live-traffic" element={<LiveTraffic />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      {showNav && <BottomNav />}
      <Toast />
    </div>
  );
}
