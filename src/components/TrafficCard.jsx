import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, TRAFFIC, TRAFFIC_START_HOUR, trafficLevel } from '../data/catalog.js';
import { hhmm } from '../utils/date.js';
import { Chips } from './Controls.jsx';
import Icon from './Icon.jsx';
import './TrafficCard.css';

const BAR_MAX = 140; // px for 100 %

/* Calmest continuous window: the longest run of hours under 40 %. */
function calmest(values) {
  let best = [0, 0];
  let start = null;
  values.forEach((v, i) => {
    if (v < 40) { if (start === null) start = i; if (i - start > best[1] - best[0]) best = [start, i]; }
    else start = null;
  });
  return [TRAFFIC_START_HOUR + best[0], TRAFFIC_START_HOUR + best[1]];
}

export function useTrafficNow(now = new Date()) {
  const hour = now.getHours();
  const last = TRAFFIC_START_HOUR + TRAFFIC.sports.length - 1;
  const current = Math.min(Math.max(hour, TRAFFIC_START_HOUR), last);
  const isOpen = hour >= TRAFFIC_START_HOUR && hour <= last;
  return { hour, current, isOpen };
}

/* Live Traffic card on Home: headline %, category chips and an 8-hour
   bar chart ending one hour after now (the next hour is shown faded). */
export default function TrafficCard({ detailLink = true, window: span = 8, initial = 'sports' }) {
  const [cat, setCat] = useState(initial);
  const { current, isOpen } = useTrafficNow();
  const values = TRAFFIC[cat];

  const { hours, pct, calm } = useMemo(() => {
    const endIdx = Math.min(values.length - 1, current - TRAFFIC_START_HOUR + 1);
    const startIdx = Math.max(0, endIdx - span + 1);
    const hs = [];
    for (let i = startIdx; i < startIdx + span && i < values.length; i++) hs.push({ h: TRAFFIC_START_HOUR + i, v: values[i] });
    return { hours: hs, pct: values[current - TRAFFIC_START_HOUR], calm: calmest(values) };
  }, [values, current, span]);

  return (
    <div className="traffic">
      <div className="traffic__top">
        <div>
          <p className="traffic__pct">{pct}%</p>
          <p className="traffic__cap">Average Facilities</p>
        </div>
        <div className="traffic__right">
          <p className="traffic__level">{isOpen ? trafficLevel(pct) : 'Closed'}</p>
          <p className="traffic__cap">{hhmm(current)} - {hhmm(current + 1)}</p>
        </div>
      </div>

      <Chips items={CATEGORIES} value={cat} onChange={setCat} label="Traffic category" variant="card" />

      <div className="traffic__chart" role="img" aria-label={`Hourly occupancy for ${CATEGORIES.find((c) => c.id === cat).label}`}>
        {hours.map(({ h, v }) => (
          <div key={h} className={`bar${h === current ? ' is-now' : ''}${h > current ? ' is-future' : ''}`}>
            <span className="bar__fill" style={{ height: `${Math.max(14, (v / 100) * BAR_MAX)}px` }} title={`${v}%`} />
          </div>
        ))}
      </div>
      <div className="traffic__axis" aria-hidden="true">
        {hours.map(({ h }) => <span key={h}>{h}</span>)}
      </div>

      <div className="traffic__tip">
        <Icon name="warning" width={21.4} height={18} />
        <p>The calmest time today is from {hhmm(calm[0])} to {hhmm(calm[1])} WIB.</p>
      </div>

      {detailLink && (
        <Link to="/live-traffic" className="traffic__more link">
          View Detail Live Traffic <Icon name="chevron" width={4.6} height={8.7} />
        </Link>
      )}
    </div>
  );
}
