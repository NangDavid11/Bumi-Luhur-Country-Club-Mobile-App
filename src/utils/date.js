/* Date helpers. Display follows the design: English weekday abbreviations
   (SAT, SUN …) and Indonesian month names ("Today, 01 Oktober"). */

export const MONTHS_ID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
export const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const DAYS_SHORT = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
export const DAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const pad = (n) => String(n).padStart(2, '0');

export function toKey(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
export function fromKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}
export function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
export const todayKey = () => toKey(new Date());

export function relativeDay(key) {
  const diff = Math.round((fromKey(key) - fromKey(todayKey())) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  const d = fromKey(key);
  return `${DAYS_LONG[d.getDay()].slice(0, 3)}, ${d.getDate()} ${MONTHS_EN[d.getMonth()].slice(0, 3)}`;
}
export function longDate(key) {
  const d = fromKey(key);
  return `${DAYS_LONG[d.getDay()]}, ${d.getDate()} ${MONTHS_EN[d.getMonth()]} ${d.getFullYear()}`;
}
export function todayLabelID(d = new Date()) {
  return `Today, ${pad(d.getDate())} ${MONTHS_ID[d.getMonth()]}`;
}
export function membershipExpiry(key) {
  const d = fromKey(key);
  return `${d.getDate()} ${MONTHS_EN[d.getMonth()]} ${d.getFullYear()}`;
}

export const hhmm = (h, m = 0) => `${pad(h)}:${pad(m)}`;
export const hourOf = (t) => Number(t.split(':')[0]);
export function addMinutes(t, mins) {
  const [h, m] = t.split(':').map(Number);
  const total = h * 60 + m + mins;
  return hhmm(Math.floor(total / 60) % 24, total % 60);
}
/* A greeting that matches the card in the design ("Good Morning,"). */
export function greeting(d = new Date()) {
  const h = d.getHours();
  if (h < 11) return 'Good Morning,';
  if (h < 15) return 'Good Afternoon,';
  if (h < 19) return 'Good Evening,';
  return 'Good Night,';
}
export function isPast(dateKey, time) {
  const [y, m, d] = dateKey.split('-').map(Number);
  const [h, mi] = time.split(':').map(Number);
  return new Date(y, m - 1, d, h, mi) < new Date();
}
