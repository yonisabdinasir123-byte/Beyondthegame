/**
 * educationData.js — Seed data for Education, Employability, and Careers features.
 *
 * HOW TO PLUG IN REAL APIs:
 * ─────────────────────────
 * COLLEGES / OPEN DAYS   → Google Places API (text search + place details for hours/coords)
 *   Replace `colleges` array with: GET https://maps.googleapis.com/maps/api/place/textsearch/json
 *   ?query=college&location={lat},{lng}&radius={metres}&key={GOOGLE_API_KEY}
 *
 * JOB FAIRS / EVENTS     → Eventbrite API (partner access required)
 *   GET https://www.eventbriteapi.com/v3/events/search/?q=job+fair&location.address={postcode}
 *   &location.within={miles}mi&token={EVENTBRITE_TOKEN}
 *
 * JOB ADVERTS            → Reed.co.uk API (free key, server-side only)
 *   GET https://www.reed.co.uk/api/1.0/search?keywords={field}&locationName={postcode}
 *   &distanceFromLocation={miles}  (maps directly onto the `radiusMiles` filter below)
 *   Secondary: Adzuna API — https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id={ID}&app_key={KEY}
 *   NOTE: Do NOT use GOV.UK "Find a Job" — its firewall blocks server/datacenter IPs.
 *
 * CAREER PATHWAYS        → UK Gov Occupational Maps API (open licence)
 *   https://occupational-maps.skillsengland.education.gov.uk
 *   Use to enrich `careerRules[].needs` and `careerRules[].pathway` arrays.
 *
 * DISTANCE               → Haversine util in src/utils/distance.js
 *   Feed user's postcode → lat/lng via postcodes.io (free, no key needed):
 *   GET https://api.postcodes.io/postcodes/{postcode}  → result.latitude / longitude
 *   Then haversine(userLat, userLng, item.lat, item.lng) → miles
 *   Reed's `distanceFromLocation` param takes the same miles value directly.
 */

// ── JSDoc types ───────────────────────────────────────────────────────────────

/**
 * @typedef {{
 *   id: string, name: string, location: string,
 *   lat: number, lng: number,
 *   openingHours: string,
 *   openDays: string[],
 *   courses: string[],
 *   website: string,
 * }} College
 *
 * @typedef {{
 *   id: string, name: string, date: string, time: string,
 *   venue: string, location: string,
 *   lat: number, lng: number,
 *   type: 'Job Fair'|'Recruitment Event'|'Careers Talk',
 *   description: string,
 * }} JobEvent
 *
 * @typedef {{
 *   id: string, title: string, employer: string,
 *   location: string, lat: number, lng: number,
 *   field: string, pay: string, summary: string,
 *   applyUrl: string, posted: string,
 * }} JobAdvert
 *
 * @typedef {{
 *   interests: string[],
 *   job: string,
 *   why: string,
 *   needs: string[],
 *   pathway: string[],
 *   resource: string,
 *   resourceLabel: string,
 * }} CareerRule
 *
 * @typedef {{
 *   id: string, collegeId: string, collegeName: string,
 *   openDayDate: string, savedAt: string,
 * }} SavedOpenDay
 *
 * @typedef {{
 *   id: string, name: string, organisation: string,
 *   field: string, howContacted: string,
 *   date: string, followUp: string, notes: string,
 * }} NetworkingContact
 *
 * @typedef {{
 *   subjects: string[], hobbies: string[], skills: string[], freeText: string,
 * }} UserInterests
 */

// ── Colleges ──────────────────────────────────────────────────────────────────
// PLUG IN: Replace with Google Places API results keyed on postcode + radius.
/** @type {College[]} */
export const colleges = [
  {
    id: 'col001',
    name: 'Trafford College',
    location: 'Stretford, Greater Manchester',
    lat: 53.4459, lng: -2.2966,
    openingHours: 'Mon–Fri 08:30–17:00',
    openDays: ['2026-07-12', '2026-09-06'],
    courses: ['Level 3 Sport & Performance Coaching', 'Electrical Installation (City & Guilds)', 'Personal Training', 'Business Admin'],
    website: 'https://www.trafford.ac.uk',
  },
  {
    id: 'col002',
    name: 'Salford City College',
    location: 'Salford, Greater Manchester',
    lat: 53.4879, lng: -2.2977,
    openingHours: 'Mon–Fri 08:00–17:30',
    openDays: ['2026-07-05', '2026-09-20'],
    courses: ['Football Coaching & Development', 'Level 2 Plumbing', 'Health & Social Care', 'IT & Digital Media'],
    website: 'https://www.salfordcc.ac.uk',
  },
  {
    id: 'col003',
    name: 'Manchester College',
    location: 'Manchester City Centre',
    lat: 53.4808, lng: -2.2426,
    openingHours: 'Mon–Fri 08:30–18:00',
    openDays: ['2026-06-28', '2026-09-13'],
    courses: ['Sports Journalism & Media', 'Level 3 Fitness Instructor', 'Accounting & Finance', 'Construction Skills'],
    website: 'https://www.tmc.ac.uk',
  },
  {
    id: 'col004',
    name: 'Stockport College',
    location: 'Stockport, Greater Manchester',
    lat: 53.4082, lng: -2.1575,
    openingHours: 'Mon–Fri 08:30–17:00',
    openDays: ['2026-07-19', '2026-10-04'],
    courses: ['BTEC Sport (Extended Diploma)', 'Level 3 Security Management', 'Mechanical Engineering', 'Psychology A-Level'],
    website: 'https://www.stockport.ac.uk',
  },
  {
    id: 'col005',
    name: 'Bolton College',
    location: 'Bolton, Greater Manchester',
    lat: 53.5779, lng: -2.4282,
    openingHours: 'Mon–Fri 08:00–17:00',
    openDays: ['2026-07-10', '2026-09-18'],
    courses: ['Professional Football Development (HNC)', 'Gas Engineering (Level 3)', 'Childcare & Education', 'Sport & Exercise Science'],
    website: 'https://www.boltoncollege.ac.uk',
  },
  {
    id: 'col006',
    name: 'Wigan & Leigh College',
    location: 'Wigan, Greater Manchester',
    lat: 53.5450, lng: -2.6371,
    openingHours: 'Mon–Fri 08:30–17:00',
    openDays: ['2026-07-03', '2026-09-25'],
    courses: ['Level 3 Coaching & Development', 'Plumbing & Heating Technology', 'CCTV & Physical Security', 'Digital Skills for Business'],
    website: 'https://www.wigan-leigh.ac.uk',
  },
  {
    id: 'col007',
    name: 'Bury College',
    location: 'Bury, Greater Manchester',
    lat: 53.5934, lng: -2.2966,
    openingHours: 'Mon–Thu 08:30–17:00, Fri 08:30–16:00',
    openDays: ['2026-07-17', '2026-10-09'],
    courses: ['Sport & Exercise Science', 'Animal Care & Management', 'Construction: Bricklaying', 'Music Performance'],
    website: 'https://www.burycollege.ac.uk',
  },
  {
    id: 'col008',
    name: 'Oldham College',
    location: 'Oldham, Greater Manchester',
    lat: 53.5409, lng: -2.1114,
    openingHours: 'Mon–Fri 08:30–17:00',
    openDays: ['2026-07-08', '2026-09-30'],
    courses: ['Access to Higher Education (Sport)', 'Electrical & Electronic Engineering', 'Personal Training & Nutrition', 'Logistics & Supply Chain'],
    website: 'https://www.oldham.ac.uk',
  },
  {
    id: 'col009',
    name: 'Tameside College',
    location: 'Ashton-under-Lyne, Greater Manchester',
    lat: 53.4893, lng: -2.0966,
    openingHours: 'Mon–Fri 08:30–17:00',
    openDays: ['2026-06-21', '2026-09-05'],
    courses: ['FA Football Coaching Pathway', 'Level 2 Retail & Customer Service', 'Health & Social Care', 'Digital Content Creation'],
    website: 'https://www.tameside.ac.uk',
  },
]

// ── Job Fairs & Events ────────────────────────────────────────────────────────
// PLUG IN: Replace with Eventbrite API results (partner access required).
/** @type {JobEvent[]} */
export const jobEvents = [
  {
    id: 'evt001',
    name: 'Greater Manchester Jobs Fair 2026',
    date: '2026-07-15',
    time: '10:00–15:00',
    venue: 'Manchester Central Convention Complex',
    location: 'Manchester City Centre',
    lat: 53.4770, lng: -2.2465,
    type: 'Job Fair',
    description: 'Over 60 employers across construction, logistics, security, health care, and sport. Free to attend, no registration required.',
  },
  {
    id: 'evt002',
    name: 'Sport & Leisure Careers Day',
    date: '2026-07-22',
    time: '11:00–16:00',
    venue: 'National Football Museum',
    location: 'Manchester City Centre',
    lat: 53.4831, lng: -2.2374,
    type: 'Careers Talk',
    description: 'Hear from professionals in football coaching, sports media, physio, and community development. Q&A and networking included.',
  },
  {
    id: 'evt003',
    name: 'Salford Construction & Trades Recruitment Day',
    date: '2026-08-05',
    time: '09:00–13:00',
    venue: 'Salford Civic Centre',
    location: 'Salford',
    lat: 53.4883, lng: -2.2914,
    type: 'Recruitment Event',
    description: 'Local construction firms hiring apprentices and trainees. Bring a CV — on-the-spot interviews available for electricians, plumbers, and labourers.',
  },
  {
    id: 'evt004',
    name: 'Stockport Youth Careers Fair',
    date: '2026-08-13',
    time: '10:00–14:00',
    venue: 'Stockport Town Hall',
    location: 'Stockport',
    lat: 53.4082, lng: -2.1575,
    type: 'Job Fair',
    description: 'Aimed at 16–24 year olds. Employers from retail, security, logistics and digital sectors. CV workshop at 11am.',
  },
  {
    id: 'evt005',
    name: 'Security Industry Recruitment Event',
    date: '2026-09-03',
    time: '12:00–17:00',
    venue: 'Trafford Park Business Centre',
    location: 'Trafford',
    lat: 53.4659, lng: -2.3321,
    type: 'Recruitment Event',
    description: 'SIA-licensed firms recruiting door supervisors and CCTV operators. SIA licence funding information available on the day.',
  },
  {
    id: 'evt006',
    name: 'Bolton Jobs & Skills Fair',
    date: '2026-09-17',
    time: '10:00–15:30',
    venue: 'Bolton Market Hall',
    location: 'Bolton',
    lat: 53.5779, lng: -2.4282,
    type: 'Job Fair',
    description: 'Broad range of employers covering health & social care, manufacturing, warehousing, and customer services. Free workshops throughout the day.',
  },
  {
    id: 'evt007',
    name: 'NHS Healthcare Careers Open Day',
    date: '2026-09-24',
    time: '09:30–14:00',
    venue: 'Wythenshawe Hospital Education Centre',
    location: 'Wythenshawe, Manchester',
    lat: 53.3925, lng: -2.2689,
    type: 'Careers Talk',
    description: 'Learn about roles in support work, healthcare assistant, and NHS apprenticeships. No experience required to attend.',
  },
]

// ── Job Adverts ───────────────────────────────────────────────────────────────
// PLUG IN: Replace with Reed.co.uk API results.
// Reed endpoint: GET https://www.reed.co.uk/api/1.0/search
//   ?keywords={field}&locationName={userPostcode}&distanceFromLocation={radiusMiles}
// The `field` values below map directly to Reed keyword searches.
// The `radiusMiles` filter in JobAdverts.jsx maps to Reed's distanceFromLocation.
/** @type {JobAdvert[]} */
export const jobAdverts = [
  {
    id: 'job001',
    title: 'Trainee Security Officer (SIA Training Funded)',
    employer: 'Secure Events Ltd',
    location: 'Trafford, Manchester',
    lat: 53.4659, lng: -2.3321,
    field: 'Security',
    pay: '£12.50/hr',
    summary: 'Entry-level door supervision role; SIA licence training fully funded by employer. No experience needed — just reliability and a professional attitude.',
    applyUrl: 'https://www.reed.co.uk/jobs/security-officer-jobs-in-manchester',
    posted: '2026-06-03',
  },
  {
    id: 'job002',
    title: 'Football Development Coach (Community Trust)',
    employer: 'Salford City FC Community Trust',
    location: 'Salford, Manchester',
    lat: 53.4879, lng: -2.2977,
    field: 'Coaching & Sport',
    pay: '£22,000–£25,000/yr',
    summary: 'Deliver after-school, holiday, and community football sessions. FA Level 1 as minimum; Level 2 preferred. Full CPD support offered.',
    applyUrl: 'https://www.reed.co.uk/jobs/football-coach-jobs-in-manchester',
    posted: '2026-06-01',
  },
  {
    id: 'job003',
    title: 'Apprentice Electrician – Manchester City Centre',
    employer: 'Bright Sparks Electrical Ltd',
    location: 'Manchester City Centre',
    lat: 53.4808, lng: -2.2426,
    field: 'Construction & Trades',
    pay: '£7.55–£10.50/hr (apprentice rate, increasing on completion)',
    summary: 'Full 3-year Level 3 Electrical Installation apprenticeship. Work on commercial and residential sites across Greater Manchester. No previous experience required.',
    applyUrl: 'https://www.reed.co.uk/jobs/electrician-apprentice-manchester',
    posted: '2026-05-30',
  },
  {
    id: 'job004',
    title: 'Warehouse Operative – Night Shifts',
    employer: 'Nexus Logistics Group',
    location: 'Trafford Park, Manchester',
    lat: 53.4730, lng: -2.3451,
    field: 'Logistics & Warehouse',
    pay: '£11.44–£13.20/hr + shift premium',
    summary: 'Pick and pack, goods-in, and dispatch in a busy distribution centre. Physical, team-focused work with overtime available. Immediate start.',
    applyUrl: 'https://www.reed.co.uk/jobs/warehouse-operative-manchester',
    posted: '2026-06-04',
  },
  {
    id: 'job005',
    title: 'Retail Supervisor – Sports Brand Store',
    employer: 'JD Sports (Arndale Branch)',
    location: 'Manchester City Centre',
    lat: 53.4831, lng: -2.2374,
    field: 'Retail',
    pay: '£12.00/hr + bonus',
    summary: 'Support the store team, manage floor sections, and help customers find the right kit. Sports background a bonus. Training provided towards team leader role.',
    applyUrl: 'https://www.reed.co.uk/jobs/retail-supervisor-manchester',
    posted: '2026-06-02',
  },
  {
    id: 'job006',
    title: 'Healthcare Support Worker',
    employer: 'Greater Manchester NHS Trust',
    location: 'Wythenshawe Hospital, Manchester',
    lat: 53.3925, lng: -2.2689,
    field: 'Health & Social Care',
    pay: '£23,615/yr (Band 2)',
    summary: 'Assist nursing staff on a ward — taking observations, supporting patients with daily needs, and keeping records. Full training provided. No clinical experience necessary.',
    applyUrl: 'https://www.reed.co.uk/jobs/healthcare-support-worker-manchester',
    posted: '2026-05-28',
  },
  {
    id: 'job007',
    title: 'Personal Trainer (Self-Employed, Gym Floor)',
    employer: 'Pure Gym Manchester',
    location: 'Manchester City Centre',
    lat: 53.4786, lng: -2.2393,
    field: 'Coaching & Sport',
    pay: '£20,000–£35,000/yr (self-employed earnings)',
    summary: 'Level 3 PT qualification essential. Lead 1-to-1 and small-group sessions. The gym provides the space — you build your client base. Flexible hours.',
    applyUrl: 'https://www.reed.co.uk/jobs/personal-trainer-manchester',
    posted: '2026-06-05',
  },
  {
    id: 'job008',
    title: 'Delivery Driver (Van / LGV)',
    employer: 'Hermes Logistics UK',
    location: 'Stockport',
    lat: 53.4082, lng: -2.1575,
    field: 'Logistics & Warehouse',
    pay: '£13.00–£15.00/hr',
    summary: 'Multi-drop delivery route across South Manchester. Category B or C licence required. Daily routes planned — no night shifts. Good weekly earnings with overtime.',
    applyUrl: 'https://www.reed.co.uk/jobs/delivery-driver-stockport',
    posted: '2026-06-03',
  },
  {
    id: 'job009',
    title: 'CCTV Operator & Security Guard',
    employer: 'Atlas Security Services',
    location: 'Salford, Manchester',
    lat: 53.4883, lng: -2.2914,
    field: 'Security',
    pay: '£11.44–£12.50/hr',
    summary: 'Monitor CCTV systems in a shopping centre and respond to incidents. SIA Licence required (support available to obtain). Day and night shift options.',
    applyUrl: 'https://www.reed.co.uk/jobs/cctv-operator-salford',
    posted: '2026-06-01',
  },
  {
    id: 'job010',
    title: 'Community Support Worker (Young People)',
    employer: 'Catch22 Charity',
    location: 'Oldham, Greater Manchester',
    lat: 53.5409, lng: -2.1114,
    field: 'Health & Social Care',
    pay: '£24,000/yr',
    summary: 'Work with young people aged 16–25 facing challenges around housing, employment, and mental health. Strong communication skills and empathy are the main requirements.',
    applyUrl: 'https://www.reed.co.uk/jobs/community-support-worker-oldham',
    posted: '2026-05-29',
  },
  {
    id: 'job011',
    title: 'Plumbing Apprentice – Level 2/3',
    employer: 'Flow Right Plumbing Ltd',
    location: 'Bolton',
    lat: 53.5779, lng: -2.4282,
    field: 'Construction & Trades',
    pay: '£7.55–£11.44/hr (apprentice rate)',
    summary: 'Join a small, friendly team on domestic and commercial plumbing work. Attend college one day per week. No experience required — just enthusiasm and punctuality.',
    applyUrl: 'https://www.reed.co.uk/jobs/plumbing-apprentice-bolton',
    posted: '2026-06-04',
  },
  {
    id: 'job012',
    title: 'Gym Receptionist & Membership Advisor',
    employer: 'Total Fitness Wigan',
    location: 'Wigan',
    lat: 53.5450, lng: -2.6371,
    field: 'Retail',
    pay: '£11.44/hr + commission',
    summary: 'Greet members, handle enquiries, process memberships, and help keep the gym running smoothly. Great starting role if you love sport and want to work in the fitness industry.',
    applyUrl: 'https://www.reed.co.uk/jobs/gym-receptionist-wigan',
    posted: '2026-06-02',
  },
]

// ── Career Rules ──────────────────────────────────────────────────────────────
// PLUG IN: Enrich `needs` and `pathway` arrays with UK Gov Occupational Maps API:
// https://occupational-maps.skillsengland.education.gov.uk
// OPTIONALLY: send userInterests.freeText to claude-sonnet-4-20250514 for
// richer, personalised suggestions (see CareerSuggesterPage.jsx for API call).
/** @type {CareerRule[]} */
export const careerRules = [
  {
    interests: ['football', 'sport', 'coaching', 'working with young people', 'teaching'],
    job: 'FA-Qualified Football Coach',
    why: 'Your love of football and working with people makes coaching a natural fit — you already know what great coaching feels like from the inside.',
    needs: ['FA Level 1 & 2 Coaching Badges', 'DBS (Enhanced) check', 'Safeguarding awareness training', 'Paediatric First Aid (for junior coaching)'],
    pathway: [
      'Volunteer or assist at a local grassroots club (contact your county FA)',
      'Complete FA Level 1 Coaching Badge (weekend course, ~£150)',
      'Complete FA Level 2 (3–4 days + assessment)',
      'Gain paid hours at a grassroots, community, or school holiday programme',
      'Progress to age-group lead or academy development coach',
    ],
    resource: 'https://www.thefa.com/football-learning',
    resourceLabel: 'FA Football Learning',
  },
  {
    interests: ['security', 'protecting people', 'nightlife', 'events', 'discipline', 'military', 'confidence'],
    job: 'Door Supervisor / Security Officer (SIA Licensed)',
    why: 'A disciplined, physical mindset and confidence around people are exactly what security work demands — and many employers fund the SIA licence for you.',
    needs: ['SIA Door Supervision Licence (Level 2 Award)', 'First Aid at Work (Level 3)', 'DBS check', 'Right to work in UK'],
    pathway: [
      'Find an employer who funds SIA training (many do — check Reed/Adzuna)',
      'Complete 4-day Level 2 Award in Door Supervision',
      'Apply for your SIA licence (~£190) — valid 3 years',
      'Start as a door supervisor at venues or events',
      'Progress to head of security, site manager, or close-protection work',
    ],
    resource: 'https://www.sia.homeoffice.gov.uk/Pages/licensing-door.aspx',
    resourceLabel: 'SIA Door Supervision Licence',
  },
  {
    interests: ['fitness', 'gym', 'helping people', 'health', 'exercise', 'training', 'nutrition'],
    job: 'Personal Trainer / Fitness Coach',
    why: 'You already live the gym life — turning that into a career means you spend your working day doing something you genuinely enjoy.',
    needs: ['Level 2 Gym Instructor Certificate', 'Level 3 Personal Trainer Diploma', 'First Aid certificate', 'Public liability insurance', 'CPD (ongoing)'],
    pathway: [
      'Complete Level 2 Gym Instructor qualification (online + practical, 6–12 weeks)',
      'Complete Level 3 PT Diploma (4–6 months, many online options ~£1,000–£2,000)',
      'Get insured and start floor hours at a gym',
      'Build a client base through word of mouth and social media',
      'Specialise (youth athletes, strength & conditioning, nutrition coaching)',
    ],
    resource: 'https://www.cimspa.co.uk/career-pathways',
    resourceLabel: 'CIMSPA Career Pathways',
  },
  {
    interests: ['building', 'fixing things', 'manual work', 'construction', 'electricity', 'wiring'],
    job: 'Electrician (Level 3 Qualified)',
    why: 'Practical, problem-solving, and always in demand — electricians earn well and have real job security.',
    needs: ['Level 2 Electrical Installations (City & Guilds 2365)', 'Level 3 Electrical Installations', '18th Edition Wiring Regulations (BS 7671)', 'AM2 Assessment', 'CSCS card'],
    pathway: [
      'Enrol on a Level 2 Electrical Installations course at a local college',
      "Secure an electrician's apprenticeship (earn while you learn)",
      'Complete Level 3 and AM2 assessment',
      'Work as a qualified electrician with a JIB card',
      'Progress to supervisor, contracts manager, or start your own business',
    ],
    resource: 'https://www.cityandguilds.com/qualifications-and-apprenticeships/industries/engineering-and-manufacturing/2365-electrical-installations',
    resourceLabel: 'City & Guilds Electrical Installation',
  },
  {
    interests: ['plumbing', 'heating', 'manual work', 'fixing things', 'houses', 'building'],
    job: 'Plumber / Heating Engineer',
    why: 'Skilled trades like plumbing are in real shortage — you could be earning well within two years and working for yourself within five.',
    needs: ['Level 2 Plumbing & Heating (City & Guilds 6035)', 'Level 3 Plumbing & Heating', 'Gas Safe registration (for gas work)', 'Water regulations awareness'],
    pathway: [
      'Complete Level 2 Plumbing & Heating at college or via apprenticeship',
      'Work under a qualified plumber building site hours',
      'Complete Level 3 and gain ACS gas qualifications (if doing gas work)',
      'Register with Gas Safe (required for gas work)',
      'Work for a company or go self-employed',
    ],
    resource: 'https://www.cityandguilds.com/qualifications-and-apprenticeships/industries/construction-and-property/6035-plumbing-and-heating',
    resourceLabel: 'City & Guilds Plumbing & Heating',
  },
  {
    interests: ['people', 'caring', 'mental health', 'social work', 'support', 'community', 'young people', 'helping'],
    job: 'Support Worker / Community Development Officer',
    why: 'You understand what it feels like to need support — that lived experience makes you a more effective, empathetic support worker than any textbook can.',
    needs: ['Level 2 Health & Social Care (or willing to work towards)', 'DBS (Enhanced)', 'Safeguarding training', 'Good communication skills'],
    pathway: [
      'Apply for entry-level support worker roles (no formal qualification always required)',
      'Work towards Level 2/3 Health & Social Care (often funded by employer)',
      'Specialise in youth work, mental health, substance misuse, or housing',
      'Progress to senior support worker, team leader, or case manager',
      'Consider a degree apprenticeship in social work',
    ],
    resource: 'https://www.skillsforcare.org.uk/Careers-in-care/Explore-roles/Support-worker.aspx',
    resourceLabel: 'Skills for Care — Support Worker',
  },
  {
    interests: ['driving', 'logistics', 'delivery', 'independence', 'roads', 'warehouse'],
    job: 'Delivery Driver / HGV Driver',
    why: 'If you like being on the move, working independently, and seeing different places every day, driving roles offer real flexibility and solid earnings.',
    needs: ['Category B driving licence (car)', 'Category C or C+E for HGV (funded training available)', 'Driver CPC qualification', 'Clean licence preferred'],
    pathway: [
      'Start with van delivery work on a Category B licence',
      'Look for employer-funded LGV/HGV training schemes',
      'Obtain Category C licence + CPC qualification',
      'Work for logistics companies, supermarkets, or go owner-operator',
      'Move into transport management or fleet coordinator roles',
    ],
    resource: 'https://www.highwaysengland.co.uk/roads/hgv-drivers/',
    resourceLabel: 'HGV Driver Career Info',
  },
  {
    interests: ['media', 'football', 'writing', 'journalism', 'video', 'social media', 'content', 'creativity'],
    job: 'Sports Journalist / Content Creator',
    why: 'You know football from the inside — that makes your content authentic. Clubs and media outlets love people who understand the game, not just the words.',
    needs: ['Portfolio of written/video/audio content', 'NCTJ Journalism Qualification (optional but valued)', 'Understanding of SEO and social platforms', 'Good grammar and communication skills'],
    pathway: [
      'Start a blog, YouTube channel, or podcast covering football',
      'Volunteer with local club media teams (match-day programmes, social media)',
      'Study journalism, media, or sports media at college or university',
      'Intern or freelance for local newspapers, fan sites, or online media',
      'Progress to staff journalist, content lead, or sports broadcaster',
    ],
    resource: 'https://www.nctj.com/journalism-qualifications/',
    resourceLabel: 'NCTJ Journalism Qualifications',
  },
  {
    interests: ['business', 'money', 'entrepreneurship', 'sales', 'negotiation', 'managing', 'organising'],
    job: 'Business / Enterprise / Sales Professional',
    why: 'Football teaches you to compete, to manage pressure, and to read situations fast — all critical in business and sales.',
    needs: ['Level 3 Business or Sales qualification (or apprenticeship)', 'Good communication skills', 'Proficiency with basic IT/software'],
    pathway: [
      'Start in a customer service, retail, or admin role to understand business basics',
      'Study Level 3 Business Admin or Sales & Marketing (college or distance learning)',
      'Progress to account management, B2B sales, or junior management',
      'Consider a business degree apprenticeship (earn while you study)',
      'Work towards starting your own business or freelance venture',
    ],
    resource: 'https://www.instituteofentrepreneurs.com/',
    resourceLabel: 'Institute of Entrepreneurs',
  },
  {
    interests: ['technology', 'computers', 'gaming', 'coding', 'data', 'IT', 'problem solving'],
    job: 'IT Technician / Junior Developer',
    why: 'Tech is the fastest-growing sector in the UK, and you don\'t need a degree to get started — just curiosity, problem-solving skills, and the willingness to learn.',
    needs: ['CompTIA A+ or IT Fundamentals (entry-level cert)', 'Basic coding knowledge (Python, JavaScript, or HTML) — free online resources available', 'Google IT Support Certificate (free via Coursera)'],
    pathway: [
      'Complete a free or low-cost online IT or coding course (FreeCodeCamp, CS50, Codecademy)',
      'Obtain CompTIA A+ (entry-level IT certification)',
      'Apply for IT support/helpdesk roles to gain experience',
      'Work towards networking, cloud, or development specialisation',
      'Progress to developer, systems admin, or IT project manager',
    ],
    resource: 'https://grow.google/intl/uk/courses-and-tools/',
    resourceLabel: 'Google Career Certificates (UK)',
  },
  {
    interests: ['animals', 'nature', 'outdoors', 'farming', 'environment', 'wildlife'],
    job: 'Animal Care / Countryside & Land Worker',
    why: 'Working outdoors with animals or the environment suits people who don\'t want to be stuck behind a desk, and who care about the natural world.',
    needs: ['Level 2 Animal Care or Land-Based Studies', 'Physical fitness', 'Patience and responsibility'],
    pathway: [
      'Study Level 2 Animal Care at a local college',
      'Volunteer at a local farm, rescue centre, or conservation group',
      'Complete Level 3 for veterinary nursing, gamekeeping, or countryside management',
      'Apply for apprenticeships with LANTRA (land-based industry)',
      'Specialise in dog training, wildlife conservation, or farm management',
    ],
    resource: 'https://www.lantra.co.uk/',
    resourceLabel: 'LANTRA — Land-based Careers',
  },
  {
    interests: ['music', 'performance', 'acting', 'events', 'entertainment', 'people', 'creativity'],
    job: 'Events Coordinator / Entertainment & Hospitality',
    why: 'If you thrive in busy, people-focused environments, events and hospitality offer a career full of variety and energy — with a clear path to management.',
    needs: ['Level 2/3 Events Management or Hospitality (college course or apprenticeship)', 'Communication and organisation skills', 'Food Hygiene certificate (for hospitality roles)'],
    pathway: [
      'Start in hospitality — bar, restaurant, or venue staff',
      'Study Level 3 Events Management or Hospitality Management',
      'Assist at events to build experience (festivals, corporate, sport)',
      'Progress to events coordinator, venue manager, or operations lead',
      'Move into large-scale sports events management with experience',
    ],
    resource: 'https://www.evcom.org.uk/education',
    resourceLabel: 'EVCOM Events Industry Careers',
  },
]

// ── Reflective networking prompts ─────────────────────────────────────────────
/** @type {{id: string, text: string}[]} */
export const networkingPrompts = [
  { id: 'np1', text: 'Have you contacted someone working in a field you\'re interested in?' },
  { id: 'np2', text: 'Is there a club or organisation you could picture yourself working at?' },
  { id: 'np3', text: 'Have you networked with someone new this week?' },
  { id: 'np4', text: 'Have you followed up with a contact you made last week?' },
  { id: 'np5', text: 'Have you attended any careers events or open days recently?' },
  { id: 'np6', text: 'Have you updated your CV or LinkedIn in the last month?' },
]

// ── Interest presets ──────────────────────────────────────────────────────────
export const SUBJECT_PRESETS   = ['Sport & PE', 'Maths', 'English', 'Science', 'Business', 'IT', 'Art & Design', 'Media', 'Health & Social Care', 'Construction']
export const HOBBY_PRESETS     = ['Football', 'Gym / Fitness', 'Gaming', 'Music', 'Cooking', 'DIY / Building', 'Drawing / Art', 'Writing', 'Animals', 'Outdoor activities']
export const SKILL_PRESETS     = ['Leadership', 'Teamwork', 'Coaching / Teaching', 'Problem solving', 'Communication', 'Physical fitness', 'Driving', 'IT skills', 'Selling / persuading', 'Caring for others']
export const JOB_FIELDS        = ['Coaching & Sport', 'Construction & Trades', 'Security', 'Retail', 'Logistics & Warehouse', 'Health & Social Care']
