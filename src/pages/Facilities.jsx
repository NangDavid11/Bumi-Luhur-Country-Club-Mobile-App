import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header.jsx';
import MediaCard from '../components/MediaCard.jsx';
import Sheet from '../components/Sheet.jsx';
import { Chips, SearchBar, Toggle } from '../components/Controls.jsx';
import { CATEGORIES, FACILITIES, categoryLabel } from '../data/catalog.js';
import { hhmm } from '../utils/date.js';
import './Lists.css';

export const CHIP_ITEMS = [{ id: 'all', label: 'All' }, ...CATEGORIES];

export function openLabel(f) {
  if (f.open === 0 && f.close === 24) return 'Open 24 Hours';
  return `Open ${hhmm(f.open)}–${hhmm(f.close)}`;
}
export function isOpenNow(f, d = new Date()) {
  const h = d.getHours();
  return h >= f.open && h < f.close;
}

export function FacilitySheet({ facility, onClose }) {
  const navigate = useNavigate();
  if (!facility) return null;
  return (
    <Sheet
      open
      onClose={onClose}
      title={facility.name}
      footer={facility.bookable ? (
        <button type="button" className="btn btn--primary btn--block" onClick={() => navigate(`/booking?cat=${facility.category}&facility=${facility.id}`)}>Book Now</button>
      ) : (
        <p className="muted" style={{ textAlign: 'center', fontSize: 13 }}>No booking needed — just show your member QR at the entrance.</p>
      )}
    >
      <MediaCard art={facility.art} title={facility.name} subtitle={openLabel(facility)} as="div" />
      <p style={{ fontSize: 14, lineHeight: '21px', color: 'var(--grey-2)' }}>{facility.description}</p>
      <div className="detail-grid">
        <div className="detail"><p className="detail__label">Hours</p><p className="detail__value">{openLabel(facility).replace('Open ', '')}</p></div>
        <div className="detail"><p className="detail__label">Status</p><p className="detail__value" style={{ color: isOpenNow(facility) ? 'var(--green)' : 'var(--grey)' }}>{isOpenNow(facility) ? 'Open now' : 'Closed now'}</p></div>
        <div className="detail"><p className="detail__label">Capacity</p><p className="detail__value">{facility.capacity}</p></div>
        <div className="detail"><p className="detail__label">Access</p><p className="detail__value">{facility.fee}</p></div>
        <div className="detail detail--wide"><p className="detail__label">Category</p><p className="detail__value">{categoryLabel(facility.category)}</p></div>
      </div>
    </Sheet>
  );
}

export default function Facilities() {
  const [params, setParams] = useSearchParams();
  const cat = params.get('cat') ?? 'all';
  const [query, setQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [openNow, setOpenNow] = useState(false);
  const [bookableOnly, setBookableOnly] = useState(false);
  const [sort, setSort] = useState('recommended');
  const [selected, setSelected] = useState(null);

  const setCat = (id) => setParams(id === 'all' ? {} : { cat: id }, { replace: true });

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = FACILITIES.filter((f) =>
      (cat === 'all' || f.category === cat) &&
      (!q || f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q) || categoryLabel(f.category).toLowerCase().includes(q)) &&
      (!openNow || isOpenNow(f)) &&
      (!bookableOnly || f.bookable));
    if (sort === 'az') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return CATEGORIES.map((c) => ({ ...c, items: list.filter((f) => f.category === c.id) })).filter((g) => g.items.length);
  }, [cat, query, openNow, bookableOnly, sort]);

  const filtersActive = openNow || bookableOnly || sort !== 'recommended';

  return (
    <main className="page">
      <Header title="Facilites" />
      <SearchBar value={query} onChange={setQuery} placeholder="Search Fasilities" onFilter={() => setFilterOpen(true)} filterActive={filtersActive} />
      <div className="gap-16"><Chips items={CHIP_ITEMS} value={cat} onChange={setCat} label="Facility category" /></div>

      {groups.length === 0 && (
        <div className="empty">
          <strong>No facilities found</strong>
          <span>Try another keyword or clear the filters.</span>
          <button type="button" className="btn btn--soft" onClick={() => { setQuery(''); setOpenNow(false); setBookableOnly(false); setCat('all'); }}>Clear filters</button>
        </div>
      )}

      {groups.map((g) => (
        <section key={g.id} className="group">
          <div className="group__head">
            <h2 className="section-title">{g.label}</h2>
            <span className="group__count">({g.items.length})</span>
          </div>
          <div className="stack">
            {g.items.map((f) => (
              <MediaCard key={f.id} art={f.art} title={f.name} subtitle={openLabel(f)} onClick={() => setSelected(f)} />
            ))}
          </div>
        </section>
      ))}

      <FacilitySheet facility={selected} onClose={() => setSelected(null)} />

      <Sheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        title="Filter & Sort"
        footer={<button type="button" className="btn btn--primary btn--block" onClick={() => setFilterOpen(false)}>Show Results</button>}
      >
        <div className="panel" style={{ padding: 0 }}>
          <div className="list-row"><div className="list-row__main"><p className="list-row__title">Open now</p><p className="list-row__sub">Only facilities open at this hour</p></div><Toggle checked={openNow} onChange={setOpenNow} label="Open now" /></div>
          <div className="list-row"><div className="list-row__main"><p className="list-row__title">Bookable only</p><p className="list-row__sub">Facilities you can reserve in the app</p></div><Toggle checked={bookableOnly} onChange={setBookableOnly} label="Bookable only" /></div>
        </div>
        <div>
          <p className="field__label" style={{ marginBottom: 8 }}>Sort by</p>
          <Chips items={[{ id: 'recommended', label: 'Recommended' }, { id: 'az', label: 'Name A–Z' }]} value={sort} onChange={setSort} label="Sort" />
        </div>
      </Sheet>
    </main>
  );
}
