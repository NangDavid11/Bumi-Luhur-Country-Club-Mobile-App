/* ==========================================================================
   App state: bookings, guest passes, reward points, RSVPs, notifications.
   Persisted to localStorage so the demo behaves like a real account across
   reloads. Swap the reducer actions for API calls when a backend exists.
   ========================================================================== */
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { addDays, todayKey, toKey } from '../utils/date.js';
import { code, uid } from '../utils/slots.js';

const STORAGE_KEY = 'bumi-luhur:v1';
export const GUEST_PASS_QUOTA = 4;
export const POINTS_PER_BOOKING = 50;

export const USER = {
  name: 'David Syahputra',
  memberId: 'BL-000011',
  membership: 'VIP Membership',
  tier: 'VIP Member',
  expires: '2027-07-05',
  memberSince: '2024-07-05',
  email: 'david.syahputra@mail.com',
  phone: '+62 812 3456 7890',
  avatar: '/img/avatar.webp',
};

function seed() {
  const today = todayKey();
  const now = new Date();
  return {
    version: 1,
    points: 2450,
    bookings: [
      // The two sessions shown on the Home screen in the design.
      { id: 'seed-tennis', type: 'facility', refId: 'tennis', title: 'Tennis Court', art: 'tennis', date: today, start: '07:00', end: '18:00', status: 'confirmed', createdAt: now.toISOString() },
      { id: 'seed-badminton', type: 'facility', refId: 'badminton', title: 'Badminton Court', art: 'badminton', date: today, start: '17:00', end: '18:00', status: 'confirmed', createdAt: now.toISOString() },
      { id: 'seed-yoga', type: 'class', refId: 'yoga', title: 'Yoga', art: 'yoga', date: toKey(addDays(now, 1)), start: '07:00', end: '07:45', place: 'Studio 01', status: 'confirmed', createdAt: now.toISOString() },
    ],
    guestPasses: [
      { id: 'seed-gp', name: 'Rizky Pratama', phone: '+62 813 2222 1188', date: toKey(addDays(now, 2)), facility: 'tennis', code: 'GP-7KQ2MX', status: 'active', createdAt: now.toISOString() },
    ],
    pointsHistory: [
      { id: 'h1', label: 'Tennis Court booking', delta: 50, date: toKey(addDays(now, -2)) },
      { id: 'h2', label: 'Coffee & Pastry redeemed', delta: -300, date: toKey(addDays(now, -6)) },
      { id: 'h3', label: 'Monthly VIP bonus', delta: 500, date: toKey(addDays(now, -9)) },
      { id: 'h4', label: 'Yoga class attended', delta: 50, date: toKey(addDays(now, -11)) },
    ],
    redemptions: [],
    rsvps: [],
    claimedOffers: [],
    notifications: [
      { id: 'n1', title: 'Booking confirmed', body: 'Badminton Court today, 17:00 – 18:00 WIB.', time: 'Just now', read: false, to: '/schedule' },
      { id: 'n2', title: 'Pickleball Social Night', body: 'Registration is open — mixed doubles for all levels.', time: '2h ago', read: false, to: '/club/events' },
      { id: 'n3', title: 'You earned 50 points', body: 'Thanks for booking the Tennis Court.', time: 'Yesterday', read: true, to: '/reward' },
      { id: 'n4', title: 'Live traffic tip', body: 'The calmest time today is from 10:00 to 14:00 WIB.', time: 'Yesterday', read: true, to: '/live-traffic' },
    ],
    settings: { pushNotifications: true, bookingReminders: true, newsletter: false },
  };
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (s.version === 1) return s;
    }
  } catch { /* storage unavailable: fall back to seed */ }
  return seed();
}

function reducer(state, action) {
  switch (action.type) {
    case 'book': {
      const items = action.items.map((b) => ({ id: uid('bk'), status: 'confirmed', createdAt: new Date().toISOString(), ...b }));
      const earned = action.earn ? POINTS_PER_BOOKING * items.length : 0;
      return {
        ...state,
        bookings: [...state.bookings, ...items],
        points: state.points + earned,
        pointsHistory: earned ? [{ id: uid('h'), label: `${items[0].title} booking`, delta: earned, date: todayKey() }, ...state.pointsHistory] : state.pointsHistory,
        notifications: [{ id: uid('n'), title: 'Booking confirmed', body: `${items[0].title} · ${items.map((i) => i.start).join(', ')}`, time: 'Just now', read: false, to: '/schedule' }, ...state.notifications],
      };
    }
    case 'cancelBooking':
      return { ...state, bookings: state.bookings.map((b) => (b.id === action.id ? { ...b, status: 'cancelled' } : b)) };
    case 'addGuestPass':
      return { ...state, guestPasses: [{ id: uid('gp'), code: code('GP'), status: 'active', createdAt: new Date().toISOString(), ...action.pass }, ...state.guestPasses] };
    case 'revokeGuestPass':
      return { ...state, guestPasses: state.guestPasses.map((g) => (g.id === action.id ? { ...g, status: 'revoked' } : g)) };
    case 'redeem': {
      const r = action.reward;
      if (state.points < r.points) return state;
      return {
        ...state,
        points: state.points - r.points,
        redemptions: [{ id: uid('rd'), rewardId: r.id, name: r.name, code: code('BL'), date: todayKey() }, ...state.redemptions],
        pointsHistory: [{ id: uid('h'), label: `${r.name} redeemed`, delta: -r.points, date: todayKey() }, ...state.pointsHistory],
      };
    }
    case 'toggleRsvp':
      return { ...state, rsvps: state.rsvps.includes(action.id) ? state.rsvps.filter((x) => x !== action.id) : [...state.rsvps, action.id] };
    case 'claimOffer':
      return state.claimedOffers.includes(action.id) ? state : { ...state, claimedOffers: [...state.claimedOffers, action.id] };
    case 'readNotification':
      return { ...state, notifications: state.notifications.map((n) => (n.id === action.id ? { ...n, read: true } : n)) };
    case 'readAll':
      return { ...state, notifications: state.notifications.map((n) => ({ ...n, read: true })) };
    case 'setting':
      return { ...state, settings: { ...state.settings, [action.key]: action.value } };
    case 'reset':
      return seed();
    default:
      return state;
  }
}

const Ctx = createContext(null);

export function AppStoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);
  const [toast, setToast] = useState(null);
  const timer = useRef();

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore quota errors */ }
  }, [state]);

  const notify = useCallback((message, tone = 'success') => {
    clearTimeout(timer.current);
    setToast({ message, tone, key: Date.now() });
    timer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const value = useMemo(() => {
    const active = state.bookings.filter((b) => b.status !== 'cancelled');
    const monthKey = todayKey().slice(0, 7);
    const passesThisMonth = state.guestPasses.filter((g) => g.status !== 'revoked' && g.createdAt.slice(0, 7) === monthKey).length;
    const extraPasses = state.redemptions.filter((r) => r.rewardId === 'guest-pass' && r.date.slice(0, 7) === monthKey).length;
    return {
      state,
      user: USER,
      activeBookings: active,
      unread: state.notifications.filter((n) => !n.read).length,
      guestPassesLeft: Math.max(0, GUEST_PASS_QUOTA + extraPasses - passesThisMonth),
      guestPassQuota: GUEST_PASS_QUOTA + extraPasses,
      dispatch,
      notify,
      toast,
    };
  }, [state, toast, notify]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore must be used inside AppStoreProvider');
  return ctx;
}
