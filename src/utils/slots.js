import { hhmm, isPast, todayKey } from './date.js';

/* Deterministic pseudo-random availability so the same facility/date always
   shows the same booked slots (stands in for a real availability API). */
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

export function slotsFor(facility, dateKey, myBookings = []) {
  const out = [];
  const close = facility.close === 24 ? 24 : facility.close;
  for (let h = facility.open; h < close; h++) {
    const time = hhmm(h);
    const mine = myBookings.some((b) => b.refId === facility.id && b.date === dateKey && b.start === time && b.status !== 'cancelled');
    const peak = h >= 17 && h <= 20 ? 0.32 : 0;
    const booked = !mine && hash(`${facility.id}|${dateKey}|${h}`) < 0.18 + peak;
    const past = dateKey === todayKey() && isPast(dateKey, hhmm(h, 0));
    if (past) continue; // elapsed hours are not offered, as in the design
    out.push({ time, state: mine ? 'mine' : booked ? 'booked' : 'available' });
  }
  return out;
}

export const uid = (p = 'id') => `${p}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export function code(prefix) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `${prefix}-${s}`;
}
