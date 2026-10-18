/* ==========================================================================
   Mock data for the member app. Replace with API calls when a backend exists;
   every screen reads through the helpers at the bottom of this file or the
   store in src/store, so the swap is contained.
   ========================================================================== */

export const CATEGORIES = [
  { id: 'sports', label: 'Sports & Active', icon: 'cat-sports' },
  { id: 'wellness', label: 'Wellness & Relaxation', icon: 'cat-wellness' },
  { id: 'entertainment', label: 'Entertainment & Leisure', icon: 'cat-entertainment' },
  { id: 'social', label: 'Social & Family Spaces', icon: 'cat-social' },
  { id: 'comfort', label: 'Comfort & Convenience', icon: 'cat-comfort' },
];
export const categoryLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label ?? '';

/* Card colours taken from the design's overlay gradients. */
export const TONES = {
  terracotta: '#8b3a2b',
  clay: '#a3533d',
  sage: '#5c8279',
  orange: '#c05621',
  forest: '#4a6b5b',
  wine: '#7a2838',
  mustard: '#c58f3b',
  navy: '#2b4c6f',
  sand: '#c8a97e',
};

/*
 * Card art. Boxes are [x, y, width, height] in px for the design's
 * 345 × 139 card; MediaCard turns them into percentages so art scales
 * with the card width.
 */
const U = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=760&q=70`;
export const ART = {
  tennis: { bg: '/img/tennis-bg.webp', bgBox: [0, -27, 345, 193], cut: '/img/tennis-player.webp', cutBox: [97, -59, 441, 294], tone: 'terracotta', icon: 'tennis' },
  badminton: { bg: '/img/badminton-bg.webp', bgBox: [0, -46, 345, 231], cut: '/img/badminton-player.webp', cutBox: [189, -13, 169, 254], tone: 'sage', icon: 'badminton' },
  basketball: { bg: '/img/basketball-bg.webp', bgBox: [0, -42, 345, 223], cut: '/img/basketball-player.webp', cutBox: [117, -94, 311, 466], tone: 'orange', icon: 'basketball' },
  billiard: { bg: '/img/billiard-bg.webp', bgBox: [0, -42, 345, 230], cut: '/img/billiard-player.webp', cutBox: [123, 17, 262, 174], tone: 'sage', icon: 'cat-entertainment' },
  yoga: { bg: '/img/yoga-bg.webp', bgBox: [0, -46, 345, 230], cut: '/img/yoga-person.webp', cutBox: [156, 0, 243, 162], tone: 'forest', icon: 'yoga' },
  poundfit: { bg: '/img/poundfit-bg.webp', bgBox: [0, -45, 345, 230], cut: '/img/poundfit-people.webp', cutBox: [-13, -78, 495, 329], tone: 'wine', icon: 'poundfit' },
  kids: { bg: '/img/kids-bg.webp', bgBox: [0, -28, 345, 195], cut: '/img/kids-children.webp', cutBox: [190, 13, 237, 158], tone: 'mustard', icon: 'kids' },
  dance: { bg: '/img/dance-bg.webp', bgBox: [0, -60, 345, 259], cut: '/img/dance-girl.webp', cutBox: [90, -26, 303, 202], tone: 'navy', icon: 'dance' },
  pool: { bg: '/img/pool.webp', tone: 'navy', icon: 'cat-sports' },
  fitness: { bg: '/img/fitness.webp', tone: 'wine', icon: 'cat-sports', pos: '50% 40%' },
  jogging: { bg: '/img/jogging.webp', tone: 'forest', icon: 'cat-sports' },
  pickleball: { bg: '/img/ce-events.webp', tone: 'mustard', icon: 'cat-sports' },
  spa: { bg: '/img/spa.webp', tone: 'forest', icon: 'cat-wellness', pos: '50% 30%' },
  sauna: { bg: '/img/wellness.webp', tone: 'sage', icon: 'cat-recharge' },
  physio: { bg: U('1649751361457-01d3a696c7e6'), tone: 'navy', icon: 'cat-wellness' },
  jacuzzi: { bg: U('1544843776-7c98a52e08a4'), tone: 'navy', icon: 'cat-wellness' },
  salon: { bg: U('1580618672591-eb180b1a973f'), tone: 'clay', icon: 'cat-wellness' },
  karaoke: { bg: U('1560297035-0ed84c4175f6'), tone: 'wine', icon: 'cat-entertainment' },
  gameroom: { bg: U('1518928286447-dc161b7cd6fb'), tone: 'orange', icon: 'cat-entertainment' },
  library: { bg: U('1662379940109-1026a0dcfe95'), tone: 'clay', icon: 'cat-entertainment' },
  dining: { bg: '/img/dining.webp', tone: 'terracotta', icon: 'cat-social' },
  banquet: { bg: U('1768851142332-75f3d1b47452'), tone: 'sand', icon: 'cat-social' },
  garden: { bg: '/img/garden.webp', tone: 'forest', icon: 'cat-social', pos: '50% 65%' },
  playground: { bg: '/img/kids-bg.webp', bgBox: [0, -28, 345, 195], cut: '/img/kids-children.webp', cutBox: [190, 13, 237, 158], tone: 'mustard', icon: 'kids' },
  playroom: { bg: U('1687946803051-51da173a9f55'), tone: 'mustard', icon: 'kids' },
  ev: { bg: U('1593941707882-a5bba14938c7'), tone: 'navy', icon: 'cat-comfort' },
  hotel: { bg: U('1611892440504-42a792e24d32'), tone: 'sand', icon: 'cat-comfort' },
  golf: { bg: '/img/golf.webp', tone: 'forest', icon: 'cat-comfort' },
  ceFacilities: { bg: '/img/ce-facilities.webp', bgBox: [0, -17, 345, 194], tone: 'clay', icon: 'ce-facilities' },
  ceClasses: { bg: '/img/ce-classes.webp', bgBox: [0, -35, 345, 230], tone: 'forest', icon: 'ce-classes' },
  ceCoaching: { bg: '/img/ce-coaching.webp', bgBox: [0, -35, 345, 230], tone: 'navy', icon: 'ce-coaching' },
  ceEvents: { bg: '/img/ce-events.webp', bgBox: [0, -35, 345, 230], tone: 'mustard', tintA: 0.2, tintEnd: '100%', icon: 'ce-events' },
  ceOffers: { bg: '/img/basketball-bg.webp', bgBox: [0, -31, 345, 222], tone: 'sand', icon: 'basketball' },
};

/* ------------------------------------------------------------ facilities */
const SPORT_HOURS = { open: 6, close: 22 };
export const FACILITIES = [
  // Sports & Active (8)
  { id: 'tennis', name: 'Tennis Court', category: 'sports', art: 'tennis', ...SPORT_HOURS, capacity: 'Maks 4 Player', fee: 'Complimentary Member', bookable: true, courts: 2, description: 'Two indoor hard courts with professional lighting. Racquets and balls are available at the front desk.' },
  { id: 'badminton', name: 'Badminton Court', category: 'sports', art: 'badminton', ...SPORT_HOURS, capacity: 'Maks 4 Player', fee: 'Complimentary Member', bookable: true, courts: 3, description: 'Three tournament-standard courts with sprung flooring and shuttle service.' },
  { id: 'basketball', name: 'Basketball Court', category: 'sports', art: 'basketball', ...SPORT_HOURS, capacity: 'Maks 10 Player', fee: 'Complimentary Member', bookable: true, courts: 1, description: 'A full-size indoor court for pick-up games, junior clinics and league nights.' },
  { id: 'pool', name: 'Swimming Pool', category: 'sports', art: 'pool', open: 6, close: 21, capacity: 'Maks 2 Lane', fee: 'Complimentary Member', bookable: true, courts: 4, description: 'Infinity lap pool with lane booking, plus a shallow family pool.' },
  { id: 'fitness', name: 'Fitness Center', category: 'sports', art: 'fitness', open: 5, close: 23, capacity: 'Open Access', fee: 'Complimentary Member', bookable: false, description: 'Premium Technogym equipment, free weights and a functional training zone.' },
  { id: 'yoga-studio', name: 'Yoga Studio', category: 'sports', art: 'yoga', ...SPORT_HOURS, capacity: 'Maks 12 Person', fee: 'Complimentary Member', bookable: true, courts: 1, description: 'A calm, light-filled studio for yoga, Pilates and stretching sessions.' },
  { id: 'pickleball', name: 'Pickleball Court', category: 'sports', art: 'pickleball', ...SPORT_HOURS, capacity: 'Maks 4 Player', fee: 'Complimentary Member', bookable: true, courts: 2, description: 'Two indoor pickleball courts with paddles available to borrow.' },
  { id: 'jogging', name: 'Jogging Track', category: 'sports', art: 'jogging', open: 5, close: 21, capacity: 'Open Access', fee: 'Complimentary Member', bookable: false, description: 'A 400 m outdoor track around the green, lit until evening.' },
  // Wellness & Relaxation
  { id: 'spa', name: 'Spa & Massage', category: 'wellness', art: 'spa', open: 9, close: 21, capacity: '1 Guest', fee: 'Member Rate', bookable: true, courts: 4, description: 'Signature massages and facials in private treatment rooms.' },
  { id: 'sauna', name: 'Sauna & Steam', category: 'wellness', art: 'sauna', open: 7, close: 21, capacity: 'Maks 6 Person', fee: 'Complimentary Member', bookable: true, courts: 1, description: 'Forest-view sauna and steam rooms in the wellness pavilion.' },
  { id: 'hydrotherapy', name: 'Private Hydrotherapy', category: 'wellness', art: 'jacuzzi', open: 9, close: 21, capacity: 'Maks 2 Person', fee: 'Member Rate', bookable: true, courts: 1, description: 'Private jacuzzi and cold plunge suite for contrast therapy.' },
  { id: 'physio', name: 'Physiotherapy & Recovery', category: 'wellness', art: 'physio', open: 8, close: 20, capacity: '1 Guest', fee: 'Member Rate', bookable: true, courts: 2, description: 'Assessment, sports massage and recovery programmes with licensed physiotherapists.' },
  { id: 'salon', name: 'Salon', category: 'wellness', art: 'salon', open: 9, close: 20, capacity: '1 Guest', fee: 'Member Rate', bookable: true, courts: 3, description: 'Hair and grooming services before dinner or an event.' },
  // Entertainment & Leisure
  { id: 'billiard', name: 'Billiard Lounge', category: 'entertainment', art: 'billiard', open: 10, close: 23, capacity: 'Maks 4 Player', fee: 'Complimentary Member', bookable: true, courts: 3, description: 'Full-size tables in a relaxed lounge with drinks service.' },
  { id: 'karaoke', name: 'Karaoke Rooms', category: 'entertainment', art: 'karaoke', open: 12, close: 23, capacity: 'Maks 10 Person', fee: 'Member Rate', bookable: true, courts: 4, description: 'Private, soundproofed rooms with curated song libraries.' },
  { id: 'gameroom', name: 'Game Room', category: 'entertainment', art: 'gameroom', open: 10, close: 22, capacity: 'Open Access', fee: 'Complimentary Member', bookable: false, description: 'Table tennis, board games and consoles for all ages.' },
  { id: 'library', name: 'Library', category: 'entertainment', art: 'library', open: 8, close: 21, capacity: 'Open Access', fee: 'Complimentary Member', bookable: false, description: 'A quiet reading room with books, magazines and armchairs.' },
  // Social & Family Spaces
  { id: 'rooftop', name: 'Rooftop Restaurant', category: 'social', art: 'dining', open: 7, close: 23, capacity: 'Maks 8 Person', fee: 'Reservation', bookable: true, courts: 10, description: 'Seasonal menus with golf course views, from breakfast to dinner.' },
  { id: 'function-room', name: 'Multi-Function Room', category: 'social', art: 'banquet', open: 8, close: 22, capacity: 'Maks 80 Person', fee: 'Member Rate', bookable: true, courts: 1, description: 'A flexible venue for private celebrations and gatherings.' },
  { id: 'garden', name: 'Outdoor Garden', category: 'social', art: 'garden', open: 6, close: 22, capacity: 'Open Access', fee: 'Complimentary Member', bookable: false, description: 'Landscaped lawns and shaded terraces for family afternoons.' },
  { id: 'kids-club', name: 'Playground & Kids Club', category: 'social', art: 'playground', open: 8, close: 20, capacity: 'Kids 3–12', fee: 'Complimentary Member', bookable: false, description: 'Supervised play areas and daily activities for children.' },
  { id: 'kids-gym', name: 'Kids Gym & Playroom', category: 'social', art: 'playroom', open: 8, close: 20, capacity: 'Maks 12 Kids', fee: 'Complimentary Member', bookable: true, courts: 1, description: 'An indoor space for active play and creative activities.' },
  // Comfort & Convenience
  { id: 'ev', name: 'EV Charging Station', category: 'comfort', art: 'ev', open: 0, close: 24, capacity: '6 Bays', fee: 'Complimentary Member', bookable: true, courts: 6, description: 'Fast-charging bays near the clubhouse entrance.' },
  { id: 'mason-pine', name: 'Mason Pine Hotel', category: 'comfort', art: 'hotel', open: 0, close: 24, capacity: 'Partner Stay', fee: 'Member Rate', bookable: false, description: 'Integrated stays at Mason Pine Hotel with member rates.' },
  { id: 'parahyangan-golf', name: 'Parahyangan Golf', category: 'comfort', art: 'golf', open: 6, close: 18, capacity: 'Partner Access', fee: 'Member Rate', bookable: false, description: 'Tee times at Parahyangan Golf Bandung through the concierge.' },
];
export const facilityById = (id) => FACILITIES.find((f) => f.id === id);

/* ---------------------------------------------------------------- classes */
// day: 0 = Sunday … 6 = Saturday
export const CLASSES = [
  { id: 'yoga', name: 'Yoga', art: 'yoga', place: 'Studio 01', duration: '45 Min', coach: 'Coach Maya', capacity: 14, days: [0, 1, 2, 3, 4, 5, 6], time: '07:00', level: 'All levels', description: 'A flowing vinyasa practice to build strength, balance and breath.' },
  { id: 'poundfit', name: 'Pound Fit', art: 'poundfit', place: 'Fitness Center', duration: '45 Min', coach: 'Coach Rina', capacity: 16, days: [0, 1, 3, 5, 6], time: '08:00', level: 'Intermediate', description: 'A full-body cardio workout set to music using weighted drumsticks.' },
  { id: 'kids-motoric', name: 'Kids Motoric', art: 'kids', place: 'Playground', duration: '1 Hour', coach: 'Coach Dimas', capacity: 10, days: [0, 2, 4, 6], time: '10:00', level: 'Kids 3–6', description: 'Play-based activities that develop balance, coordination and confidence.' },
  { id: 'dance-kids', name: 'Dance Kids', art: 'dance', place: 'Dance Studio', duration: '1 Hour', coach: 'Coach Sasha', capacity: 12, days: [0, 3, 5, 6], time: '16:00', level: 'Kids 6–12', tagline: 'Elevate your physical performance.', description: 'Ballet and contemporary basics for young dancers.' },
  { id: 'aqua-fit', name: 'Aqua Fit', art: 'pool', place: 'Swimming Pool', duration: '45 Min', coach: 'Coach Bayu', capacity: 12, days: [1, 3, 5], time: '17:00', level: 'All levels', description: 'Low-impact water exercise for strength and mobility.' },
  { id: 'hiit', name: 'HIIT Training', art: 'fitness', place: 'Fitness Center', duration: '30 Min', coach: 'Coach Arief', capacity: 12, days: [2, 4, 6], time: '18:30', level: 'Advanced', description: 'Short, intense intervals to boost conditioning.' },
];
export const classById = (id) => CLASSES.find((c) => c.id === id);
export const classMeta = (c) => c.tagline ?? `${c.time} · ${c.place} · ${c.duration}`;

/* ------------------------------------------------------- club experience */
export const COACHES = [
  { id: 'tennis-coach', name: 'Tennis Coaching', coach: 'Coach Andre', art: 'tennis', facility: 'tennis', duration: '60 Min', price: '350 pts', description: 'Private or semi-private sessions for every level.' },
  { id: 'swim-coach', name: 'Swimming Coaching', coach: 'Coach Bayu', art: 'ceCoaching', facility: 'pool', duration: '45 Min', price: '300 pts', description: 'Technique and confidence lessons for kids and adults.' },
  { id: 'personal-training', name: 'Personal Training', coach: 'Coach Arief', art: 'poundfit', facility: 'fitness', duration: '60 Min', price: '400 pts', description: 'A programme built around your goals with progress tracking.' },
  { id: 'badminton-coach', name: 'Badminton Coaching', coach: 'Coach Hendra', art: 'badminton', facility: 'badminton', duration: '60 Min', price: '300 pts', description: 'Footwork, strokes and match play drills.' },
];

export const EVENTS = [
  { id: 'pickleball-social', name: 'Pickleball Social Night', art: 'ceEvents', dayOffset: 2, time: '19:00', place: 'Pickleball Court', description: 'Mixed doubles round robin for all levels, with drinks after.' },
  { id: 'family-day', name: 'Family Fun Day', art: 'kids', dayOffset: 6, time: '09:00', place: 'Outdoor Garden', description: 'Games, a bouncy castle and a picnic lunch for the whole family.' },
  { id: 'basketball-3x3', name: '3x3 Basketball Cup', art: 'basketball', dayOffset: 9, time: '15:00', place: 'Basketball Court', description: 'Register a team of three for the members’ cup.' },
  { id: 'jazz-night', name: 'Jazz on the Rooftop', art: 'dining', dayOffset: 12, time: '19:30', place: 'Rooftop Restaurant', description: 'Live jazz trio with a set menu overlooking the course.' },
];

export const OFFERS = [
  { id: 'spa-20', name: '20% Off Signature Massage', art: 'spa', until: 'Valid this month', description: 'Book any 60 or 90 minute signature massage.' },
  { id: 'rooftop-brunch', name: 'Weekend Brunch for 2', art: 'dining', until: 'Saturday & Sunday', description: 'Complimentary dessert platter with any brunch for two.' },
  { id: 'mason-pine-stay', name: 'Mason Pine Staycation', art: 'hotel', until: 'Until end of year', description: 'Member rate plus late check-out at Mason Pine Hotel.' },
];

/* ---------------------------------------------------------------- rewards */
export const TIERS = [
  { id: 'silver', name: 'Silver', min: 0 },
  { id: 'gold', name: 'Gold', min: 2000 },
  { id: 'vip', name: 'VIP', min: 5000 },
  { id: 'prestige', name: 'Prestige', min: 10000 },
];

export const REWARDS = [
  { id: 'guest-pass', name: 'Extra Guest Pass', points: 500, art: 'tennis', category: 'Access', description: 'Adds one guest pass to this month’s quota.' },
  { id: 'coffee', name: 'Coffee & Pastry', points: 300, art: 'dining', category: 'Dining', description: 'Any coffee and pastry at the Rooftop Restaurant.' },
  { id: 'massage-30', name: '30 Min Back Massage', points: 1500, art: 'spa', category: 'Wellness', description: 'A 30 minute back and shoulder massage.' },
  { id: 'coaching-session', name: 'Private Coaching Session', points: 2000, art: 'badminton', category: 'Sports', description: 'One 60 minute session with any club coach.' },
  { id: 'hydro', name: 'Private Hydrotherapy', points: 2500, art: 'jacuzzi', category: 'Wellness', description: '45 minutes in the private hydrotherapy suite for two.' },
  { id: 'staycation', name: 'Mason Pine Night', points: 8000, art: 'hotel', category: 'Stay', description: 'One night for two at Mason Pine Hotel, breakfast included.' },
];

/* ---------------------------------------------------------- live traffic */
// Average occupancy (%) per hour, 06:00–22:00, by category.
export const TRAFFIC = {
  //        06  07  08  09  10  11  12  13  14  15  16  17  18  19  20  21
  sports: [12, 22, 30, 28, 32, 24, 21, 28, 36, 63, 79, 64, 70, 58, 40, 22],
  wellness: [6, 10, 18, 25, 34, 30, 26, 31, 38, 47, 58, 66, 61, 52, 35, 18],
  entertainment: [2, 3, 6, 10, 15, 21, 26, 24, 29, 36, 44, 57, 71, 76, 62, 40],
  social: [9, 28, 40, 31, 25, 36, 55, 49, 32, 27, 34, 48, 69, 77, 58, 30],
  comfort: [7, 14, 22, 25, 22, 26, 29, 27, 25, 23, 27, 31, 33, 29, 21, 12],
};
export const TRAFFIC_START_HOUR = 6;
export const trafficLevel = (pct) => (pct >= 85 ? 'Ramai' : pct >= 60 ? 'Moderat' : 'Sepi');
