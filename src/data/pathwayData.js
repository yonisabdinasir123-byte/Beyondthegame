/**
 * pathwayData.js — Seed data for the Pathway page.
 *
 * HOW TO SWAP TO A REAL API
 * Replace each exported array with an async loader, e.g.:
 *   export const fetchClubs  = () => fetch('/api/clubs').then(r => r.json())
 *   export const fetchLeagues = () => fetch('/api/leagues').then(r => r.json())
 * Then call them inside a useEffect / React Query / SWR hook in PathwayPage.
 */

// ─── Types (JSDoc) ────────────────────────────────────────────────────────────
/**
 * @typedef {'Grassroots'|'Semi-Pro'|'Pro Academy'} Tier
 * @typedef {'U18'|'U21'|'U23'} AgeGroup
 *
 * @typedef {Object} Club
 * @property {string}    id
 * @property {string}    name
 * @property {Tier}      tier
 * @property {AgeGroup[]} ageGroups
 * @property {string[]}  positions       - specific positions wanted
 * @property {string}    location
 * @property {string}    region
 * @property {string}    description
 * @property {string}    website
 *
 * @typedef {Object} ShowcaseGame
 * @property {string}   id
 * @property {string}   title
 * @property {string}   date             - ISO 8601
 * @property {string}   location
 * @property {AgeGroup} ageGroup
 * @property {string[]} positionsScouted
 * @property {string}   level
 * @property {number}   spotsRemaining
 * @property {string}   description
 *
 * @typedef {Object} Tournament
 * @property {string} id
 * @property {string} name
 * @property {string} dates
 * @property {string} location
 * @property {string} format             - e.g. '11-a-side'
 * @property {string} ageCategory
 * @property {string} entryType          - 'Team' | 'Individual or Team'
 * @property {string} entryFee
 * @property {string} registrationDeadline
 * @property {string} description
 *
 * @typedef {Object} League
 * @property {string} id
 * @property {string} name
 * @property {string} level              - e.g. 'Step 5 / 6'
 * @property {Tier}   tier
 * @property {string} region
 * @property {string} ageGroup
 * @property {string} seasonWindow
 * @property {string} howToJoin
 * @property {string} description
 *
 * @typedef {Object} Testimonial
 * @property {string} id
 * @property {string} name
 * @property {string} from
 * @property {string} to
 * @property {string} pathway            - short 'from → to' label
 * @property {string} quote
 * @property {string} year
 * @property {string} position
 * @property {number} age
 * @property {string} avatarInitial
 * @property {string} avatarColor        - hex colour for avatar bg
 */

// ─── Clubs ────────────────────────────────────────────────────────────────────
/** @type {Club[]} */
export const clubs = [
  {
    id: 'c01',
    name: 'Stockport County FC',
    tier: 'Semi-Pro',
    ageGroups: ['U18', 'U21'],
    positions: ['Centre-Back', 'Midfielder', 'Striker'],
    location: 'Stockport',
    region: 'North West',
    description:
      'League Two club with a thriving youth setup. Actively building U18 and U21 squads with an emphasis on technical, ball-playing footballers who can handle pressure.',
    website: '#',
  },
  {
    id: 'c02',
    name: 'AFC Fylde',
    tier: 'Semi-Pro',
    ageGroups: ['U21', 'U23'],
    positions: ['Goalkeeper', 'Left-Back', 'Winger'],
    location: 'Kirkham',
    region: 'North West',
    description:
      'National League side with serious development ambitions. Looking for athletic, high-tempo players who can thrive in their high-pressing system.',
    website: '#',
  },
  {
    id: 'c03',
    name: 'Marine FC',
    tier: 'Grassroots',
    ageGroups: ['U18', 'U21'],
    positions: ['Centre-Back', 'Midfielder', 'Striker'],
    location: 'Crosby',
    region: 'North West',
    description:
      'Historic non-league club on Merseyside. A brilliant first step for players moving from Sunday league or college football into structured competitive football.',
    website: '#',
  },
  {
    id: 'c04',
    name: 'FC United of Manchester',
    tier: 'Grassroots',
    ageGroups: ['U18', 'U21'],
    positions: ['Midfielder', 'Winger', 'Striker'],
    location: 'Moston',
    region: 'North West',
    description:
      'Fan-owned club with a strong community identity. The youth setup focuses on player development and character as much as results.',
    website: '#',
  },
  {
    id: 'c05',
    name: 'Harrogate Town Academy',
    tier: 'Pro Academy',
    ageGroups: ['U18', 'U21'],
    positions: ['Goalkeeper', 'Centre-Back', 'Defensive Midfielder'],
    location: 'Harrogate',
    region: 'Yorkshire',
    description:
      'EFL club running a Category 3 academy. Scouts attend regular showcases and trial days. Players who impress can earn academy contracts and development agreements.',
    website: '#',
  },
  {
    id: 'c06',
    name: 'York City FC Development',
    tier: 'Semi-Pro',
    ageGroups: ['U21', 'U23'],
    positions: ['Right-Back', 'Attacking Midfielder', 'Striker'],
    location: 'York',
    region: 'Yorkshire',
    description:
      'National League club building a sustainable development squad. Ideal for players with prior academy experience who are ready for consistent first-team involvement.',
    website: '#',
  },
  {
    id: 'c07',
    name: 'Bamber Bridge FC',
    tier: 'Grassroots',
    ageGroups: ['U18'],
    positions: ['Left-Back', 'Winger', 'Midfielder'],
    location: 'Bamber Bridge',
    region: 'Lancashire',
    description:
      'Friendly, well-run Northern Premier League club. An ideal first step into adult structured football for confident U18 players from school or college.',
    website: '#',
  },
  {
    id: 'c08',
    name: 'Radcliffe FC',
    tier: 'Grassroots',
    ageGroups: ['U18', 'U21'],
    positions: ['Centre-Back', 'Goalkeeper', 'Striker'],
    location: 'Radcliffe',
    region: 'Greater Manchester',
    description:
      'Well-respected Greater Manchester non-league club known for nurturing local talent. Active in connecting players with wider trial and showcase opportunities.',
    website: '#',
  },
  {
    id: 'c09',
    name: 'Whitby Town FC',
    tier: 'Grassroots',
    ageGroups: ['U21'],
    positions: ['Midfielder', 'Striker', 'Right-Back'],
    location: 'Whitby',
    region: 'Yorkshire',
    description:
      'Northern Premier League club on the Yorkshire coast. Competitive squad with a clear style of play and progressive coaching staff who value player growth.',
    website: '#',
  },
  {
    id: 'c10',
    name: 'Salford City U21s',
    tier: 'Pro Academy',
    ageGroups: ['U21'],
    positions: ['Winger', 'Attacking Midfielder', 'Centre-Back'],
    location: 'Salford',
    region: 'North West',
    description:
      'EFL club backed by the Class of 92. The U21 programme offers a fully professional training environment with a genuine route to the first team for top performers.',
    website: '#',
  },
  {
    id: 'c11',
    name: 'Hyde United FC',
    tier: 'Grassroots',
    ageGroups: ['U18', 'U21'],
    positions: ['Defensive Midfielder', 'Centre-Back', 'Left-Back'],
    location: 'Hyde',
    region: 'Greater Manchester',
    description:
      'Established Tameside club with a growing youth programme. They work closely with local colleges and offer flexible training schedules for student athletes.',
    website: '#',
  },
  {
    id: 'c12',
    name: 'Southport FC',
    tier: 'Semi-Pro',
    ageGroups: ['U21', 'U23'],
    positions: ['Goalkeeper', 'Striker', 'Midfielder'],
    location: 'Southport',
    region: 'North West',
    description:
      'National League North side with impressive facilities. Keen to recruit hungry, technically capable players in their early 20s ready for consistent first-team involvement.',
    website: '#',
  },
]

// ─── Showcase Games ───────────────────────────────────────────────────────────
/** @type {ShowcaseGame[]} */
export const showcaseGames = [
  {
    id: 'sg01',
    title: 'North West Scout Showcase',
    date: '2026-07-12T14:00:00',
    location: 'Manchester City Academy Stadium, Manchester',
    ageGroup: 'U21',
    positionsScouted: ['Striker', 'Winger', 'Attacking Midfielder'],
    level: 'Semi-Pro to Pro Academy',
    spotsRemaining: 8,
    description:
      'High-profile showcase attended by scouts from 12 EFL clubs. Players compete in structured 11-a-side games with individual performance data captured throughout.',
  },
  {
    id: 'sg02',
    title: 'Yorkshire Open Trial Day',
    date: '2026-07-19T10:00:00',
    location: 'Elland Road Training Complex, Leeds',
    ageGroup: 'U18',
    positionsScouted: ['Goalkeeper', 'Centre-Back', 'Midfielder'],
    level: 'Grassroots to Semi-Pro',
    spotsRemaining: 15,
    description:
      'Open trial run in partnership with the Yorkshire FA. Scouts from four Northern Premier League clubs in attendance. All players receive written feedback.',
  },
  {
    id: 'sg03',
    title: 'Midlands Scout Network Showcase',
    date: '2026-08-02T13:00:00',
    location: "St Andrew's Stadium, Birmingham",
    ageGroup: 'U23',
    positionsScouted: ['Centre-Back', 'Defensive Midfielder', 'Left-Back'],
    level: 'Semi-Pro to Pro',
    spotsRemaining: 6,
    description:
      'Elite showcase for U23 players with prior academy or semi-professional experience. OPTA data tracking used throughout the event.',
  },
  {
    id: 'sg04',
    title: 'Northern Pro Academy Open Day',
    date: '2026-08-09T11:00:00',
    location: 'Kingston Park, Newcastle',
    ageGroup: 'U18',
    positionsScouted: ['Striker', 'Right-Back', 'Centre-Back'],
    level: 'Pro Academy',
    spotsRemaining: 12,
    description:
      'Hosted by the Northern Football Academy. Players are assessed across two sessions with video analysis and individual reports shared within 72 hours.',
  },
  {
    id: 'sg05',
    title: 'East Coast Combined Showcase',
    date: '2026-08-16T13:30:00',
    location: 'MKM Stadium, Hull',
    ageGroup: 'U21',
    positionsScouted: ['Winger', 'Midfielder', 'Goalkeeper'],
    level: 'Grassroots to Semi-Pro',
    spotsRemaining: 20,
    description:
      'Welcoming but competitive showcase ideal for a first showcase experience. Open to players from all backgrounds playing regular competitive football.',
  },
  {
    id: 'sg06',
    title: 'Premier League Pathway Day',
    date: '2026-09-06T10:00:00',
    location: 'AXA Training Centre, Liverpool',
    ageGroup: 'U18',
    positionsScouted: ['All positions'],
    level: 'Pro Academy',
    spotsRemaining: 4,
    description:
      'Highly competitive event run in collaboration with PL club academies. All positions considered. Previous attendees have gone on to earn B team and academy contracts.',
  },
  {
    id: 'sg07',
    title: 'National Non-League Showcase',
    date: '2026-09-20T12:00:00',
    location: 'Pirelli Stadium, Burton upon Trent',
    ageGroup: 'U23',
    positionsScouted: ['Striker', 'Centre-Back', 'Attacking Midfielder'],
    level: 'Semi-Pro',
    spotsRemaining: 10,
    description:
      'Dedicated to players currently in Step 4–7 non-league football. A great platform for 19–23 year olds to be seen by a wider network of clubs and agents.',
  },
  {
    id: 'sg08',
    title: "Women's Academy Showcase",
    date: '2026-10-04T11:00:00',
    location: 'Academy Stadium, Manchester',
    ageGroup: 'U21',
    positionsScouted: ['Goalkeeper', 'Midfielder', 'Winger', 'Striker'],
    level: 'Semi-Pro to Pro Academy',
    spotsRemaining: 14,
    description:
      "Dedicated women's pathway showcase attended by scouts from WSL and Championship academies. All positions welcome. Individual video clips provided post-event.",
  },
]

// ─── Tournaments ──────────────────────────────────────────────────────────────
/** @type {Tournament[]} */
export const tournaments = [
  {
    id: 'tr01',
    name: 'Summer Grassroots Cup',
    dates: '2 – 3 Aug 2026',
    location: 'Throstle Nest, Leeds',
    format: '11-a-side',
    ageCategory: 'U18',
    entryType: 'Team',
    entryFee: '£120',
    registrationDeadline: '20 Jul 2026',
    description:
      'Annual summer cup for grassroots U18 teams. 16-team knockout format. Medals, trophies, and development reports provided for all participants.',
  },
  {
    id: 'tr02',
    name: 'Northern 7s Tournament',
    dates: '16 Aug 2026',
    location: 'Heywood Sports Village, Rochdale',
    format: '7-a-side',
    ageCategory: 'U21',
    entryType: 'Team',
    entryFee: '£85',
    registrationDeadline: '1 Aug 2026',
    description:
      'Fast-paced 7-a-side competition — excellent exposure for technical and attacking players. Scouts from two North West Semi-Pro clubs confirmed.',
  },
  {
    id: 'tr03',
    name: 'Lancashire Senior Cup',
    dates: '6 – 7 Sep 2026',
    location: 'Leyland, Lancashire',
    format: '11-a-side',
    ageCategory: 'Open',
    entryType: 'Team',
    entryFee: '£160',
    registrationDeadline: '22 Aug 2026',
    description:
      'Prestigious county cup open to all amateur and semi-professional clubs in Lancashire. Strong competition with good local press coverage.',
  },
  {
    id: 'tr04',
    name: 'Merseyside Junior Showcase Cup',
    dates: '13 Sep 2026',
    location: 'Select Security Stadium, Widnes',
    format: '11-a-side',
    ageCategory: 'U18',
    entryType: 'Team',
    entryFee: '£100',
    registrationDeadline: '30 Aug 2026',
    description:
      'Run in partnership with the Merseyside FA. Player of the Tournament receives an invitation to a semi-professional trial day.',
  },
  {
    id: 'tr05',
    name: 'Yorkshire 5s Summer League',
    dates: '5 – 6 Jul 2026',
    location: 'Ponds Forge, Sheffield',
    format: '5-a-side',
    ageCategory: 'U23',
    entryType: 'Individual or Team',
    entryFee: '£15/player or £65/team',
    registrationDeadline: '25 Jun 2026',
    description:
      'Indoor summer competition ideal for maintaining sharpness during pre-season. Individual entry available — perfect if you\'re between clubs.',
  },
  {
    id: 'tr06',
    name: 'Pennine Trophy',
    dates: '27 – 28 Sep 2026',
    location: 'Burnley, Lancashire',
    format: '11-a-side',
    ageCategory: 'U21',
    entryType: 'Team',
    entryFee: '£140',
    registrationDeadline: '13 Sep 2026',
    description:
      'Cross-Pennine competition between Lancashire and Yorkshire clubs. Well-attended final with regional media and scouts from nearby non-league clubs.',
  },
  {
    id: 'tr07',
    name: 'Northern Counties Plate',
    dates: '11 Oct 2026',
    location: 'MKM Stadium, Hull',
    format: '11-a-side',
    ageCategory: 'Open',
    entryType: 'Team',
    entryFee: '£175',
    registrationDeadline: '27 Sep 2026',
    description:
      'Prestigious plate competition for Step 5/6 non-league clubs. 24-team format with coverage in the Non-League Paper.',
  },
  {
    id: 'tr08',
    name: 'Mancunian U18 Indoor Cup',
    dates: '22 Nov 2026',
    location: 'National Squash Centre, Manchester',
    format: '6-a-side',
    ageCategory: 'U18',
    entryType: 'Team',
    entryFee: '£75',
    registrationDeadline: '8 Nov 2026',
    description:
      'Popular indoor winter tournament — fully weather-proof. Football Manchester scouts in attendance to watch the group stages and final.',
  },
]

// ─── Compatible Leagues ───────────────────────────────────────────────────────
/** @type {League[]} */
export const leagues = [
  {
    id: 'lg01',
    name: 'Northern Counties East League',
    level: 'Step 5 / 6',
    tier: 'Grassroots',
    region: 'Yorkshire',
    ageGroup: 'Open (U18+)',
    seasonWindow: 'Aug – May',
    howToJoin: 'Apply through the league secretary. Clubs must be FA-affiliated and pass a ground grading inspection.',
    description:
      'Covers South Yorkshire, West Yorkshire, Lincolnshire, and parts of Nottinghamshire. Strong competition with a clear pathway upward to Step 4.',
  },
  {
    id: 'lg02',
    name: 'North West Counties League',
    level: 'Step 5 / 6',
    tier: 'Grassroots',
    region: 'North West',
    ageGroup: 'Open (U18+)',
    seasonWindow: 'Aug – May',
    howToJoin: 'Contact the league registrations office. Clubs must pass ground grading prior to acceptance.',
    description:
      'One of the largest non-league leagues in England, covering Greater Manchester, Lancashire, Cheshire, and Merseyside. Competitive and well-organised.',
  },
  {
    id: 'lg03',
    name: 'Northern Premier League',
    level: 'Step 3 / 4',
    tier: 'Semi-Pro',
    region: 'National (Northern)',
    ageGroup: 'Open / U23',
    seasonWindow: 'Aug – Apr',
    howToJoin: 'Via promotion from Step 4, or by invitation/application to the league management committee.',
    description:
      'Competitive semi-professional league across the north of England. Many players in this league are paid part-time and train multiple sessions per week.',
  },
  {
    id: 'lg04',
    name: 'Midland Football League',
    level: 'Step 5 / 6',
    tier: 'Grassroots',
    region: 'Midlands',
    ageGroup: 'Open (U16+)',
    seasonWindow: 'Aug – Apr',
    howToJoin: 'Applications open each spring for the following season. Contact the league administrator.',
    description:
      'Covers the East and West Midlands with over 90 clubs across multiple divisions. Well-organised league with a strong cup competition structure.',
  },
  {
    id: 'lg05',
    name: 'Isthmian League',
    level: 'Step 3 / 4',
    tier: 'Semi-Pro',
    region: 'South East',
    ageGroup: 'Open / U23',
    seasonWindow: 'Aug – Apr',
    howToJoin: 'Promotion from Step 4, or application if starting a new club at the appropriate entry level.',
    description:
      'One of the oldest football leagues in the world. Covers London, the Home Counties, and surrounding areas. Strong media profile and regular scout attendance.',
  },
  {
    id: 'lg06',
    name: 'Combined Counties League',
    level: 'Step 5 / 6',
    tier: 'Grassroots',
    region: 'South',
    ageGroup: 'Open (U18+)',
    seasonWindow: 'Aug – Apr',
    howToJoin: 'Application to league secretary with FA affiliation and ground grading certificate.',
    description:
      'Well-structured league covering Surrey, Berkshire, Hampshire, and surrounding counties. Ideal entry point for clubs and players moving into the non-league pyramid.',
  },
  {
    id: 'lg07',
    name: 'Northern Alliance League',
    level: 'Step 6 / 7',
    tier: 'Grassroots',
    region: 'North East',
    ageGroup: 'Open (U16+)',
    seasonWindow: 'Sep – Apr',
    howToJoin: 'Apply through Durham FA or Northumberland FA to join the appropriate division.',
    description:
      'Community-focused league serving the North East. An excellent entry point for players new to structured adult football or returning after a break.',
  },
  {
    id: 'lg08',
    name: 'EFL Youth Alliance (U18)',
    level: 'Pro Academy',
    tier: 'Pro Academy',
    region: 'National',
    ageGroup: 'U18',
    seasonWindow: 'Aug – Mar',
    howToJoin: 'Invitation only, via EFL club academy affiliation. Scouts regularly attend showcase and trial events to identify talent.',
    description:
      'Under-18 development competition run by EFL clubs. The highest standard of youth football below the Premier League Academy structure.',
  },
]

// ─── Success Story Testimonials ───────────────────────────────────────────────
/** @type {Testimonial[]} */
export const testimonials = [
  {
    id: 't01',
    name: 'Marcus Oyelaran',
    from: 'Sunday League (Oldham)',
    to: 'Salford City U21s',
    pathway: 'Non-League → Pro Academy',
    quote:
      "I'd never even heard of showcases until I found this platform. Six months later I was training at Salford's academy three times a week. The AI CV helped me look professional when I reached out to clubs.",
    year: '2025',
    position: 'Striker',
    age: 20,
    avatarInitial: 'M',
    avatarColor: '#92400E',
  },
  {
    id: 't02',
    name: 'Jamie Thornton',
    from: 'Released aged 16, Preston NE Academy',
    to: 'Bamber Bridge FC → AFC Fylde',
    pathway: 'Academy → Non-League → Semi-Pro',
    quote:
      "Getting released was devastating. But the Compatible Leagues tool showed me exactly where I could get game time at the right level. Two seasons later I was at a National League club.",
    year: '2024',
    position: 'Midfielder',
    age: 21,
    avatarInitial: 'J',
    avatarColor: '#065F46',
  },
  {
    id: 't03',
    name: 'Leila Adamu',
    from: 'College football',
    to: "Liverpool FC Women's U21s",
    pathway: "College → Women's Pro Academy",
    quote:
      "The women's showcase section pointed me to the exact trial that changed my life. I registered in five minutes. The whole platform just made it simple — no gatekeepers, no confusion.",
    year: '2025',
    position: 'Winger',
    age: 19,
    avatarInitial: 'L',
    avatarColor: '#9A3412',
  },
  {
    id: 't04',
    name: 'Danny Birch',
    from: 'Full-time work, Sunday League',
    to: 'Whitby Town FC',
    pathway: 'Sunday League → Step 4',
    quote:
      "I'm 24 and thought I'd missed my chance. I found a club three miles away I didn't even know existed, messaged them through the platform, and had my first training session within two weeks.",
    year: '2025',
    position: 'Centre-Back',
    age: 24,
    avatarInitial: 'D',
    avatarColor: '#5B21B6',
  },
  {
    id: 't05',
    name: 'Callum McBride',
    from: 'Hyde United FC (U18)',
    to: 'Stockport County FC Academy',
    pathway: 'Grassroots → Semi-Pro',
    quote:
      "The North West Showcase was the moment. I played the best game of my life knowing scouts were watching. My stats were tracked and shared with Stockport before I even got home.",
    year: '2026',
    position: 'Right-Back',
    age: 18,
    avatarInitial: 'C',
    avatarColor: '#B45309',
  },
  {
    id: 't06',
    name: 'Priya Nair',
    from: 'University first team',
    to: 'Radcliffe FC → Northern Premier League',
    pathway: 'University → Non-League Pyramid',
    quote:
      "I graduated not knowing where I fit. The level-matching tool said Northern Counties East or North West Counties — and it was absolutely right. I'm now playing at a higher level than I ever imagined.",
    year: '2024',
    position: 'Attacking Midfielder',
    age: 22,
    avatarInitial: 'P',
    avatarColor: '#166534',
  },
]
