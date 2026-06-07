/**
 * recoveryData.js — Seed data + typed shapes for the Recovery page.
 *
 * ─── REAL API INTEGRATION ────────────────────────────────────────────────────
 * Medical locations → NHS Service Search API
 *   Base URL: https://api.nhs.uk/service-search/search
 *   Docs:     https://developer.api.nhs.uk/nhs-api/documentation/service-search
 *   Replace medicalLocations with:
 *     export const fetchMedicalLocations = (query) =>
 *       fetch(`https://api.nhs.uk/service-search/search?SearchText=${query}&…`, {
 *         headers: { 'subscription-key': process.env.NHS_API_KEY }
 *       }).then(r => r.json())
 *
 * Gyms → no public API; use your own database or a Google Places proxy.
 *
 * ─── USER DATA SHAPES ────────────────────────────────────────────────────────
 * All user-generated data is persisted in localStorage via src/utils/storage.js
 */

// ─── Types (JSDoc) ────────────────────────────────────────────────────────────
/**
 * @typedef {'Walk-in Centre'|'GP Surgery'} MedicalType
 *
 * @typedef {Object} MedicalLocation
 * @property {string}      id
 * @property {string}      name
 * @property {MedicalType} type
 * @property {string}      address
 * @property {string}      postcode
 * @property {number}      distanceMiles
 * @property {string}      openingHours
 * @property {string}      phone
 * @property {string}      [website]
 *
 * @typedef {Object} Gym
 * @property {string}   id
 * @property {string}   name
 * @property {string}   location
 * @property {number}   distanceMiles
 * @property {string}   openingHours
 * @property {number}   monthlyPrice   - GBP; valueBand derived in code
 * @property {string[]} features       - e.g. ['Weights','Classes','Pool']
 * @property {string}   [priceNote]    - why it costs more (spa/pool)
 *
 * @typedef {Object} CheckIn          - daily wellbeing check-in
 * @property {string} date            - YYYY-MM-DD
 * @property {number} mood            - 1–5
 * @property {number} energy          - 1–5
 * @property {number} sleepQuality    - 1–5
 *
 * @typedef {Object} Appointment
 * @property {string} id
 * @property {string} title
 * @property {'Medical'|'Gym'|'Other'} type
 * @property {string} date            - YYYY-MM-DD
 * @property {string} time            - HH:MM
 * @property {string} [notes]
 *
 * @typedef {Object} MetricLog        - daily wellbeing metrics
 * @property {string} date            - YYYY-MM-DD
 * @property {number} hydrationGlasses
 * @property {number} sleepHours
 * @property {number} steps
 *
 * @typedef {Object} ChecklistDay     - daily checklist completion record
 * @property {string}   date          - YYYY-MM-DD
 * @property {boolean}  completed     - all items ticked
 * @property {string[]} tickedItems   - which item IDs were ticked
 */

// ─── Medical Locations ────────────────────────────────────────────────────────
// Replace with NHS Service Search API call (see comment at top of file).
/** @type {MedicalLocation[]} */
export const medicalLocations = [
  {
    id: 'm01',
    name: 'Riverside NHS Walk-in Centre',
    type: 'Walk-in Centre',
    address: '12 Bridge St, Manchester, M3 2AB',
    postcode: 'M3 2AB',
    distanceMiles: 1.2,
    openingHours: 'Mon – Sun  08:00 – 20:00',
    phone: '0161 276 1000',
    website: 'https://www.nhs.uk',
  },
  {
    id: 'm02',
    name: 'Northern Quarter Urgent Treatment Centre',
    type: 'Walk-in Centre',
    address: '34 Oldham St, Manchester, M1 1JN',
    postcode: 'M1 1JN',
    distanceMiles: 1.8,
    openingHours: 'Mon – Sat  07:00 – 21:00, Sun  09:00 – 17:00',
    phone: '0161 355 8500',
    website: 'https://www.nhs.uk',
  },
  {
    id: 'm03',
    name: 'Salford Royal Walk-in Centre',
    type: 'Walk-in Centre',
    address: 'Stott Lane, Salford, M6 8HD',
    postcode: 'M6 8HD',
    distanceMiles: 3.4,
    openingHours: 'Mon – Sun  08:00 – 22:00',
    phone: '0161 206 4520',
    website: 'https://www.nhs.uk',
  },
  {
    id: 'm04',
    name: 'Victoria Road GP Surgery',
    type: 'GP Surgery',
    address: '45 Victoria Rd, Manchester, M14 5QF',
    postcode: 'M14 5QF',
    distanceMiles: 0.8,
    openingHours: 'Mon – Fri  08:00 – 18:30',
    phone: '0161 224 1892',
    website: 'https://www.nhs.uk',
  },
  {
    id: 'm05',
    name: 'Fallowfield Medical Centre',
    type: 'GP Surgery',
    address: '2 Ladybarn Rd, Manchester, M14 6XR',
    postcode: 'M14 6XR',
    distanceMiles: 1.5,
    openingHours: 'Mon – Fri  08:30 – 18:00, Thu  08:30 – 13:00',
    phone: '0161 248 0800',
    website: 'https://www.nhs.uk',
  },
  {
    id: 'm06',
    name: 'Moss Side Family Practice',
    type: 'GP Surgery',
    address: '88 Claremont Rd, Manchester, M14 4RH',
    postcode: 'M14 4RH',
    distanceMiles: 2.1,
    openingHours: 'Mon – Fri  08:00 – 17:30',
    phone: '0161 226 4020',
    website: 'https://www.nhs.uk',
  },
  {
    id: 'm07',
    name: 'Chorlton Urgent Treatment Centre',
    type: 'Walk-in Centre',
    address: '1 Nicolas Rd, Chorlton, M21 9NJ',
    postcode: 'M21 9NJ',
    distanceMiles: 4.0,
    openingHours: 'Mon – Fri  08:00 – 20:00, Sat – Sun  09:00 – 17:00',
    phone: '0161 476 0044',
    website: 'https://www.nhs.uk',
  },
  {
    id: 'm08',
    name: 'Ardwick Green Surgery',
    type: 'GP Surgery',
    address: '8 Plymouth Grove W, Manchester, M13 0AG',
    postcode: 'M13 0AG',
    distanceMiles: 1.1,
    openingHours: 'Mon – Fri  08:00 – 18:00',
    phone: '0161 273 8241',
    website: 'https://www.nhs.uk',
  },
]

// ─── Gyms ─────────────────────────────────────────────────────────────────────
// valueBand is derived in code from monthlyPrice — not stored in data.
// Bands: < £20 → 'Amazing value' | £20–£30 → 'Fair' | > £30 → 'Pricey'
/** @type {Gym[]} */
export const gyms = [
  {
    id: 'g01',
    name: 'PureGym Manchester City Centre',
    location: 'City Centre',
    distanceMiles: 0.9,
    openingHours: 'Mon – Sun  24 hours',
    monthlyPrice: 21.99,
    features: ['Weights', 'Cardio', 'Classes', 'Free Parking'],
  },
  {
    id: 'g02',
    name: 'The Fitness Factory',
    location: 'Ancoats',
    distanceMiles: 1.4,
    openingHours: 'Mon – Fri  06:00 – 22:00, Sat – Sun  08:00 – 20:00',
    monthlyPrice: 16.99,
    features: ['Weights', 'Cardio', 'Boxing Ring'],
  },
  {
    id: 'g03',
    name: 'Aqua Spa & Leisure Club',
    location: 'Spinningfields',
    distanceMiles: 1.7,
    openingHours: 'Mon – Fri  06:30 – 21:30, Sat – Sun  08:00 – 19:00',
    monthlyPrice: 49.99,
    features: ['Weights', 'Pool', 'Spa', 'Sauna', 'Classes', 'Steam Room'],
    priceNote: 'Higher price reflects pool, spa, sauna, and steam room facilities.',
  },
  {
    id: 'g04',
    name: "JD Gyms Salford",
    location: 'Salford',
    distanceMiles: 3.1,
    openingHours: 'Mon – Fri  05:30 – 23:00, Sat – Sun  07:00 – 21:00',
    monthlyPrice: 24.99,
    features: ['Weights', 'Cardio', 'Classes', 'Sauna'],
  },
  {
    id: 'g05',
    name: 'Snap Fitness Northern Quarter',
    location: 'Northern Quarter',
    distanceMiles: 1.6,
    openingHours: 'Mon – Sun  24 hours',
    monthlyPrice: 29.99,
    features: ['Weights', 'Cardio', 'Free Parking'],
  },
  {
    id: 'g06',
    name: 'The Wellbeing Studio',
    location: 'Didsbury',
    distanceMiles: 4.2,
    openingHours: 'Mon – Fri  07:00 – 20:00, Sat  08:00 – 16:00',
    monthlyPrice: 14.99,
    features: ['Classes', 'Yoga', 'Pilates', 'Meditation'],
  },
  {
    id: 'g07',
    name: 'Manchester Climbing Centre',
    location: 'Castlefield',
    distanceMiles: 2.0,
    openingHours: 'Mon – Fri  12:00 – 22:00, Sat – Sun  10:00 – 20:00',
    monthlyPrice: 37.00,
    features: ['Climbing Walls', 'Bouldering', 'Weights', 'Yoga'],
    priceNote: 'Higher price includes unlimited climbing, bouldering, and all courses.',
  },
  {
    id: 'g08',
    name: 'Everyone Active Moss Side',
    location: 'Moss Side',
    distanceMiles: 1.9,
    openingHours: 'Mon – Fri  06:30 – 22:00, Sat – Sun  08:00 – 18:00',
    monthlyPrice: 18.50,
    features: ['Pool', 'Weights', 'Cardio', 'Classes'],
  },
  {
    id: 'g09',
    name: 'Ultimate Performance Gym',
    location: 'Deansgate',
    distanceMiles: 1.3,
    openingHours: 'Mon – Fri  06:00 – 22:00, Sat  07:00 – 18:00',
    monthlyPrice: 89.00,
    features: ['Personal Training', 'Weights', 'Nutrition Coaching', 'Body Scanning'],
    priceNote: 'Premium price includes dedicated personal training and nutrition support.',
  },
  {
    id: 'g10',
    name: 'Local Leisure Hulme',
    location: 'Hulme',
    distanceMiles: 1.1,
    openingHours: 'Mon – Fri  07:00 – 21:00, Sat – Sun  09:00 – 17:00',
    monthlyPrice: 13.50,
    features: ['Pool', 'Weights', 'Cardio'],
  },
]

// ─── Default checklist items ──────────────────────────────────────────────────
// These are the editable starting defaults; users can modify labels in state.
export const DEFAULT_CHECKLIST = {
  independent: [
    { id: 'ci1', label: '30-minute walk or light jog' },
    { id: 'ci2', label: 'Stretching / mobility work (15 mins)' },
    { id: 'ci3', label: 'Cold shower or breathing exercises' },
  ],
  gym: [
    { id: 'cg1', label: 'Warm-up (10 mins cardio)' },
    { id: 'cg2', label: 'Strength session (compound lifts)' },
    { id: 'cg3', label: 'Cool-down and foam rolling' },
  ],
  learning: [
    { id: 'cl1', label: 'Read for 20 minutes' },
    { id: 'cl2', label: 'Watch one educational video or podcast' },
    { id: 'cl3', label: 'Practice a skill (language, coding, craft)' },
  ],
  reflection: [
    { id: 'cr1', label: 'Write 3 things you are grateful for' },
    { id: 'cr2', label: 'Review today\'s goals — what went well?' },
    { id: 'cr3', label: '5-minute mindfulness or breathing session' },
  ],
}
