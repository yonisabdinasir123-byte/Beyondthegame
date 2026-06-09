import { useState, useEffect, useRef } from 'react'
import SiteLayout        from '../components/SiteLayout'
import InterestsForm     from '../components/careers/InterestsForm'
import CareerResults     from '../components/careers/CareerResults'
import JobAdverts        from '../components/employability/JobAdverts'
import NetworkingTracker from '../components/checklist/NetworkingTracker'
import { jobAdverts }    from '../data/educationData'
import { storage }       from '../utils/storage'
import { DEFAULT_COORDS } from '../utils/distance'
import './JobsCareersPage.css'

// ── Career Spotlight data ─────────────────────────────────────────────────────
const SPOTLIGHT_CLUSTERS = [
  {
    id: 'coaching',
    label: 'Coaching & Performance',
    roles: [
      {
        title: 'Grassroots Football Coach',
        badge: 'VOLUNTEER → PAID',
        badgeType: 'volunteer',
        tagline: "You're on the pitch every weekend, shaping the next generation — and the club might pay for your licence.",
        steps: [
          'Complete FA Introduction to Coaching Football — free online course, roughly 3 hours, run by The FA.',
          'Get a DBS Enhanced Check via your local club or county FA volunteer scheme (free for volunteers).',
          'Apply to 3 local grassroots clubs and ask specifically whether they fund the UEFA C Licence (~£150) for new coaches.',
        ],
        quals: ['FA Intro to Coaching Football (free)', 'UEFA C Licence (~£150, clubs often fund)', 'DBS Enhanced Check', 'FA Safeguarding in Football (free)'],
        opps: {
          text: "Local grassroots clubs need volunteer coaches for U7–U16 teams year-round. Many will fund your UEFA C Licence after 3 months of regular volunteering — ask directly when you apply. The FA offers coaching bursaries for players from under-represented backgrounds.",
          links: [
            { label: 'FA Club Finder', url: 'https://www.thefa.com/football-rules-governance/policies/safeguarding/find-a-club' },
            { label: 'Sportcareers.com', url: 'https://www.sportcareers.com' },
          ],
        },
      },
      {
        title: 'Sports Coaching Apprentice',
        badge: 'APPRENTICESHIP',
        badgeType: 'apprenticeship',
        tagline: "You earn a wage from day one, train on the job, and leave with a nationally-recognised Level 3 qualification — no debt required.",
        steps: [
          'Search "Level 3 Sports Coaching Apprenticeship" on the government Find an Apprenticeship site — open to school leavers aged 16+.',
          'Apply directly to clubs, leisure centres, and sports charities in your area — your playing experience sets you apart.',
          'Complete the 18-month programme and move into a paid coaching role or use the qualification to progress to UEFA C.',
        ],
        quals: ['Level 3 Sports Coaching & Development (Apprenticeship)', 'FA Safeguarding in Football (free)', 'DBS Enhanced Check'],
        opps: {
          text: "Hundreds of sports coaching apprenticeships open every September across the UK. Local authority leisure centres, Premier League community trusts, and county FAs all take on Level 3 coaching apprentices — wages typically start at £6.40–£9/hr from day one.",
          links: [
            { label: 'Find an Apprenticeship — Gov.uk', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeships' },
            { label: 'FA Club Finder', url: 'https://www.thefa.com/football-rules-governance/policies/safeguarding/find-a-club' },
          ],
        },
      },
      {
        title: 'Gym / Fitness Instructor',
        badge: 'PAID',
        badgeType: 'paid',
        tagline: "You help people get fitter and stronger — in a gym, a club, or your own freelance setup — starting after a 6-week course.",
        steps: [
          'Complete a Level 2 Certificate in Gym Instruction — delivered by providers like YMCA Awards or Active IQ, typically 6–10 weeks.',
          'Add a Level 3 Personal Trainer qualification to unlock higher-paying self-employed work and sports-specific PT.',
          'Volunteer at your local football club gym to build a client base and get your first sports performance reference.',
        ],
        quals: ['Level 2 Certificate in Gym Instruction (6–10 weeks, ~£300–500)', 'Level 3 Personal Trainer (optional step up)', 'First Aid at Work'],
        opps: {
          text: "Every gym, leisure centre, and football club gym needs fitness instructors. A Level 2 certificate is all you need to start — many training providers offer payment plans or funded places through Sport England or the Active Workforce scheme.",
          links: [
            { label: 'CIMSPA Find a Qualification', url: 'https://www.cimspa.co.uk/library-and-resources/cimspa-training/' },
            { label: 'Active IQ Qualifications', url: 'https://www.activeiq.co.uk' },
          ],
        },
      },
      {
        title: 'PE Teaching Assistant',
        badge: 'PAID',
        badgeType: 'paid',
        tagline: "You support PE lessons and lunchtime football clubs — a school-hours job that uses everything you know about the game.",
        steps: [
          'Search "Sports / PE Teaching Assistant" on Indeed or Reed — no degree needed, most schools hire on personality and sport background.',
          'Earn a Level 2 Award in Supporting Teaching and Learning (available online, ~£200) to stand out in applications.',
          'Once in role, ask about school-funded Level 3 HLTA (Higher-Level Teaching Assistant) qualification to move up the pay scale.',
        ],
        quals: ['Level 2 Supporting Teaching & Learning (helpful, not always required)', 'DBS Enhanced Check', 'FA Safeguarding in Football (free)'],
        opps: {
          text: "Secondary schools and academy trusts across the UK hire sports TAs year-round, especially those with football expertise. Your academy background makes you a genuinely strong candidate — you understand elite development in a way most applicants don't.",
          links: [
            { label: 'TES Jobs — Sports TA', url: 'https://www.tes.com/jobs' },
            { label: 'Indeed — Sports Teaching Assistant', url: 'https://www.indeed.co.uk' },
          ],
        },
      },
      {
        title: 'Referee / Match Official',
        badge: 'PAID',
        badgeType: 'paid',
        tagline: "You're the authority on the pitch — making decisions under pressure every week and climbing the officiating ladder one match at a time.",
        steps: [
          'Complete the FA Referee Course (Level 7 — around £100–120, delivered by your county FA, typically 2 days).',
          'Officiate in local Sunday leagues and county cups to build your match count and get observer reports.',
          'Apply for promotion through your County FA referee development programme to reach Step-league matches.',
        ],
        quals: ['FA Referee Course Level 7 (~£100)', 'FA Safeguarding in Football (free)', 'Annual Referee Fitness Assessment (free)'],
        opps: {
          text: "Every grassroots match in England needs a referee — demand is constant and year-round. County FAs actively recruit new officials and provide a structured mentoring pathway all the way to the National List. Fees start at around £20/match and increase as you progress.",
          links: [
            { label: 'Become a Referee — The FA', url: 'https://www.thefa.com/football-rules-governance/referees/become-a-referee' },
          ],
        },
      },
    ],
  },
  {
    id: 'media',
    label: 'Media & Content',
    roles: [
      {
        title: 'Club Content Creator',
        badge: 'INTERNSHIP → PAID',
        badgeType: 'internship',
        tagline: "You're filming training sessions, editing reels, and building a club's entire social presence — from the inside.",
        steps: [
          'Film 3 matchday videos at a local non-league club and publish them as a portfolio reel on YouTube or Vimeo.',
          'DM 10 National League North/South clubs directly — many post work experience opportunities on their Instagram.',
          'Formalise your skills with a free Google Digital Garage certificate or a Level 3 Creative Media BTEC.',
        ],
        quals: ['Google Digital Garage (free)', 'Level 3 Creative Media Production (BTEC, optional)', 'CapCut or Adobe Premiere Pro'],
        opps: {
          text: "Clubs from Step 3 downward regularly seek content creators — many offer unpaid or expenses-covered placements that lead to paid roles. Your football knowledge and access to players is a genuine differentiator over career changers with no sport background.",
          links: [
            { label: 'Google Digital Garage (free)', url: 'https://learndigital.withgoogle.com/digitalgarage' },
            { label: 'Sportcareers.com', url: 'https://www.sportcareers.com' },
          ],
        },
      },
      {
        title: 'Sports Journalist / Writer',
        badge: 'INTERNSHIP → PAID',
        badgeType: 'internship',
        tagline: "You're covering matches, filing post-game reports, and building a byline — starting at non-league level and working your way up.",
        steps: [
          'Start a football blog or contribute match reports to a non-league club programme — free to do, builds real clips immediately.',
          'Study for an NCTJ Diploma in Journalism (Levels 3 & 4) — the industry-standard entry route, available without a degree.',
          'Apply for work experience at local newspapers, BBC Sport regional, or outlets like The Non-League Paper.',
        ],
        quals: ['NCTJ Diploma in Journalism (Levels 3 & 4, no degree required)', 'NCTJ Media Law & Regulation', 'Shorthand 100 wpm (NCTJ requirement)'],
        opps: {
          text: "Local newspapers and digital outlets cover non-league football extensively and consistently need writers who genuinely understand the game. The NCTJ is the direct entry route — no degree required — and trained reporters are hired by national titles, broadcasters, and digital outlets.",
          links: [
            { label: 'NCTJ Journalism Qualifications', url: 'https://www.nctj.com/journalism-qualifications' },
            { label: 'Sports Journalists\' Association', url: 'https://the-sja.org.uk' },
          ],
        },
      },
      {
        title: 'Videographer / Cameraman',
        badge: 'INTERNSHIP → PAID',
        badgeType: 'internship',
        tagline: "You're behind the lens at training grounds and matchdays, producing footage clubs, broadcasters, and players actually use.",
        steps: [
          'Start with DaVinci Resolve (free professional editing software) and any smartphone with a gimbal (~£30–50).',
          'Offer to film 5 matches for a local club for free — build a showreel from the best 90 seconds of each match.',
          'Apply to production companies that supply National League and EFL clubs with matchday coverage and highlight packages.',
        ],
        quals: ['No formal degree required with a strong portfolio', 'DaVinci Resolve or Adobe Premiere Pro (free to learn)', 'Level 3 Creative Media Production (BTEC, optional)'],
        opps: {
          text: "Sports videography is one of the fastest-growing freelance careers in football media. EFL clubs and specialist sports production agencies regularly take on short-contract and freelance videographers, with rates rising sharply from Step 3 upward.",
          links: [
            { label: 'ScreenSkills — Screen Industry Training', url: 'https://www.screenskills.com' },
            { label: 'Sportcareers.com', url: 'https://www.sportcareers.com' },
          ],
        },
      },
      {
        title: 'Podcast Producer / Presenter',
        badge: 'SELF-EMPLOYED',
        badgeType: 'self-employed',
        tagline: "You're recording, editing, and publishing football conversations — building an audience and monetising your love of the game.",
        steps: [
          'Launch a show using Anchor or Buzzsprout (both free) — publish at least 6 episodes before promoting to build a back catalogue.',
          'Drive listenership via 60-second clips on TikTok and Instagram Reels — short video clips consistently outperform audio-only promotion.',
          'Monetise through Patreon, Spotify Podcast Subscriptions, and direct club or brand sponsorship once your audience grows.',
        ],
        quals: ['No formal qualification required', 'Audacity or Adobe Audition (free audio editing)', 'Basic video editing for social clips'],
        opps: {
          text: "Football podcasts built around specific clubs, levels, or communities (National League, Women's football, youth development) consistently attract loyal niche audiences. Many successful shows were started by ex-players with exactly your background — the insight is the product.",
          links: [
            { label: 'Buzzsprout (free podcast hosting)', url: 'https://www.buzzsprout.com' },
            { label: 'Spotify for Podcasters', url: 'https://podcasters.spotify.com' },
          ],
        },
      },
      {
        title: 'Match Day Photographer',
        badge: 'VOLUNTEER → PAID',
        badgeType: 'volunteer',
        tagline: "You're pitchside at kick-off, capturing the moments that end up in the match programme, on the club website, and in the press.",
        steps: [
          'Start at a local Step 5–7 club — offer to shoot 3 matches for free in exchange for a photo credit and testimonial.',
          'Build a portfolio of 30–40 images on a free Adobe Portfolio or Squarespace page — quality over quantity.',
          'Approach regional newspaper sports desks or non-league clubs directly to negotiate a paid per-match rate.',
        ],
        quals: ['No formal qualification required', 'Any DSLR or mirrorless camera (entry-level)', 'Adobe Lightroom (free trial) for post-processing'],
        opps: {
          text: "Non-league clubs commonly pay £50–150 per matchday for a reliable photographer. Regional sports news agencies also hire freelancers for specific fixtures — and you can start right away with the phone in your pocket.",
          links: [
            { label: 'British Press Photographers\' Association', url: 'https://www.bppa.org.uk' },
            { label: 'Sportcareers.com', url: 'https://www.sportcareers.com' },
          ],
        },
      },
    ],
  },
  {
    id: 'business',
    label: 'Business & Specialist',
    roles: [
      {
        title: 'Matchday Steward',
        badge: 'PAID',
        badgeType: 'paid',
        tagline: "You're managing crowd safety on the terraces — a stadium job that pays on matchdays and can grow into a full-time security career.",
        steps: [
          'Apply directly to EFL or National League clubs for matchday steward vacancies — no formal qualifications needed to start.',
          'Earn a Level 2 Award for Door Supervisors or the Level 2 Award in Spectator Safety (SIA approved, ~£300–500).',
          'Build up to Head Steward or Safety Officer as you gain match experience — clubs often fund the Level 3 internally.',
        ],
        quals: ['Level 2 Award in Spectator Safety (SIA, ~£300–500)', 'First Aid at Work', 'DBS Check'],
        opps: {
          text: "Every professional and semi-professional football club in the UK hires matchday stewarding staff. Many clubs take on stewards from 18+ with no prior experience — your football knowledge gives you real insight into crowd behaviour and supporter culture.",
          links: [
            { label: 'FA Jobs Board', url: 'https://www.thefa.com/football-rules-governance/jobs' },
            { label: 'Indeed — Football Steward', url: 'https://www.indeed.co.uk' },
          ],
        },
      },
      {
        title: 'Sports Nutritionist / Performance Chef',
        badge: 'SELF-EMPLOYED',
        badgeType: 'self-employed',
        tagline: "You're building meal plans for athletes and becoming the secret weapon behind on-pitch performance — no degree required.",
        steps: [
          'Complete a Level 3 Award in Nutrition — available via BTEC or Cache-accredited providers, typically 4–6 months (~£300–600).',
          'Add an ISSN Foundation Level Sports Nutrition Certificate to specialise for athletic performance.',
          'Approach local academies and non-league clubs directly — most clubs below Championship level have no dedicated nutritionist at all.',
        ],
        quals: ['Level 3 Award in Nutrition (BTEC/Cache, ~£300–600)', 'ISSN Foundation Sports Nutrition Certificate', 'Food Hygiene Level 2 (free online)'],
        opps: {
          text: "Lower-league clubs and academies rarely have a dedicated nutritionist — a genuine gap in the market. Offer a free 4-week athlete meal plan trial to a local club to build your portfolio and get a reference that opens doors to paid work.",
          links: [
            { label: 'ISSN UK Sports Nutrition', url: 'https://www.theissn.org' },
            { label: 'Sportcareers.com', url: 'https://www.sportcareers.com' },
          ],
        },
      },
      {
        title: 'Business Admin Apprenticeship',
        badge: 'APPRENTICESHIP',
        badgeType: 'apprenticeship',
        tagline: "You work inside a sports organisation from day one — learning operations, admin, and management while earning a wage.",
        steps: [
          'Search "Level 3 Business Administration Apprenticeship" on the government Find an Apprenticeship site — 100s of sport sector openings each year.',
          'Apply to football clubs, county FAs, Premier League trusts, or Sport England-funded organisations in your area.',
          'Complete the 18-month programme and progress into operations, club administration, or commercial roles.',
        ],
        quals: ['Level 3 Business Administration (Apprenticeship, earn while you learn)', 'No prior experience required to apply'],
        opps: {
          text: "Football clubs, county FAs, national governing bodies, and sports charities all offer Level 3 business admin apprenticeships. It's the fastest way inside a professional sports organisation without a degree — and you're paid from your first week.",
          links: [
            { label: 'Find an Apprenticeship — Gov.uk', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeships' },
            { label: 'FA Jobs Board', url: 'https://www.thefa.com/football-rules-governance/jobs' },
          ],
        },
      },
      {
        title: 'Digital Marketing Apprentice',
        badge: 'APPRENTICESHIP',
        badgeType: 'apprenticeship',
        tagline: "You run social media, email campaigns, and paid ads for a sports brand — no degree, no debt, just results.",
        steps: [
          'Search "Level 3 Digital Marketing Apprenticeship" on the government Find an Apprenticeship site — sport and media openings listed weekly.',
          'Earn free certifications now to strengthen your application: Google Digital Garage and Meta Blueprint are both free.',
          'Target sports brands, football clubs, and sports agencies — your genuine football knowledge is a real differentiator.',
        ],
        quals: ['Level 3 Digital Marketing Apprenticeship (earn while you learn)', 'Google Digital Garage (free, do this first)', 'Meta Blueprint (free)'],
        opps: {
          text: "Sports marketing is in consistent demand and clubs need people who understand fans from the inside. A Level 3 Digital Marketing Apprenticeship gets you in the door at a real organisation, earning from day one, without any university debt.",
          links: [
            { label: 'Find an Apprenticeship — Gov.uk', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeships' },
            { label: 'Google Digital Garage (free certs)', url: 'https://learndigital.withgoogle.com/digitalgarage' },
          ],
        },
      },
      {
        title: 'Talent Scout / Academy Recruitment',
        badge: 'VOLUNTEER → PAID',
        badgeType: 'volunteer',
        tagline: "You're watching matches across the country, identifying players clubs haven't spotted yet, and filing the reports that change careers.",
        steps: [
          'Attend local fixtures and build your own structured player assessment template — start writing reports now, for free.',
          'Complete the FA Talent Identification Education programme — available via your county FA or regional talent hub.',
          'Build a portfolio of detailed scouting reports and approach heads of recruitment at Step 3–5 clubs directly.',
        ],
        quals: ['FA Scouting & Talent Identification Education (county FA, low cost)', 'UEFA C Licence (useful, not required to start)', 'Wyscout or InStat knowledge (self-taught is fine)'],
        opps: {
          text: "Many clubs from Step 4 upward use volunteer scouts for non-priority regions — this is the standard first step before paid roles open up. Your instinctive knowledge of how academy players develop is your primary asset when approaching clubs.",
          links: [
            { label: 'Sportcareers.com', url: 'https://www.sportcareers.com' },
            { label: 'FA Talent Identification', url: 'https://www.thefa.com/football-rules-governance/talent-id' },
          ],
        },
      },
    ],
  },
]

// ── Role card ─────────────────────────────────────────────────────────────────
function RoleCard({ role }) {
  return (
    <article className="cs-card" role="listitem">
      <header className="cs-card__top">
        <span className={`cs-badge cs-badge--${role.badgeType}`}>{role.badge}</span>
        <h3 className="cs-card__title">{role.title}</h3>
        <p className="cs-card__tagline">"{role.tagline}"</p>
      </header>

      <div className="cs-card__section">
        <h4 className="cs-card__section-label">How to get started</h4>
        <ol className="cs-steps" aria-label={`Steps to become a ${role.title}`}>
          {role.steps.map((step, i) => (
            <li key={i} className="cs-step">
              <span className="cs-step__num" aria-hidden="true">{i + 1}</span>
              <span className="cs-step__text">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="cs-card__section">
        <h4 className="cs-card__section-label">Qualifications needed</h4>
        <div className="cs-quals" aria-label="Qualifications">
          {role.quals.map(q => (
            <span key={q} className="cs-qual">{q}</span>
          ))}
        </div>
      </div>

      <div className="cs-card__section">
        <h4 className="cs-card__section-label">Opportunities near you</h4>
        <p className="cs-opps__text">{role.opps.text}</p>
        <div className="cs-opps__links">
          {role.opps.links.map(link => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="cs-opps__link"
              aria-label={`${link.label} — opens in new tab`}
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      </div>
    </article>
  )
}

// ── Career Spotlight section ──────────────────────────────────────────────────
function CareerSpotlight() {
  const [activeCluster, setActiveCluster] = useState('coaching')
  const [suggestion,    setSuggestion]    = useState('')
  const [submitted,     setSubmitted]     = useState(() => storage.get('cs-suggestions', []))

  const cluster = SPOTLIGHT_CLUSTERS.find(c => c.id === activeCluster)

  const handleSuggest = (e) => {
    e.preventDefault()
    const val = suggestion.trim()
    if (!val) return
    const next = [...submitted, val]
    setSubmitted(next)
    storage.set('cs-suggestions', next)
    setSuggestion('')
  }

  return (
    <section id="career-spotlight" className="jc-section jc-section--spotlight" aria-labelledby="cs-heading">
      <div className="jc-section__inner">

        {/* Section header */}
        <div className="jc-section__header">
          <span className="cs-eyebrow">Career Spotlight</span>
          <h2 className="cs-heading" id="cs-heading">Careers built for footballers</h2>
          <p className="cs-lead">
            Roles you may never have considered — but are naturally positioned for. Real pathways, real UK qualifications, real opportunities.
          </p>
        </div>

        {/* Cluster tabs */}
        <div className="cs-tabs" role="tablist" aria-label="Career clusters">
          {SPOTLIGHT_CLUSTERS.map(c => (
            <button
              key={c.id}
              role="tab"
              type="button"
              className={`cs-tab${activeCluster === c.id ? ' cs-tab--active' : ''}`}
              aria-selected={activeCluster === c.id}
              onClick={() => setActiveCluster(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Role cards */}
        <div
          className="cs-cards"
          role="list"
          aria-label={`${cluster.label} career roles`}
        >
          {cluster.roles.map(role => (
            <RoleCard key={role.title} role={role} />
          ))}
        </div>

        {/* Suggest a career */}
        <div className="cs-suggest">
          <div className="cs-suggest__label">
            <p className="cs-suggest__title">Don&rsquo;t see your path here?</p>
            <p className="cs-suggest__sub">Tell us what you&rsquo;re interested in and we&rsquo;ll add it to the next update.</p>
          </div>
          <form className="cs-suggest__form" onSubmit={handleSuggest} aria-label="Suggest a career">
            <input
              type="text"
              className="cs-suggest__input"
              value={suggestion}
              onChange={e => setSuggestion(e.target.value)}
              placeholder="e.g. Stadium groundskeeper, data analyst…"
              maxLength={120}
              aria-label="Career suggestion"
            />
            <button
              type="submit"
              className="cs-suggest__btn"
              disabled={!suggestion.trim()}
            >
              Suggest it
            </button>
          </form>
          {submitted.length > 0 && (
            <div className="cs-suggest__submitted" aria-live="polite" aria-label="Submitted suggestions">
              <span className="cs-suggest__submitted-label">Suggested so far:</span>
              {submitted.map((s, i) => (
                <span key={i} className="cs-suggest__pill">{s}</span>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  )
}

// ── Page section nav ──────────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'career-explorer',  label: '🌟 Career Explorer'  },
  { id: 'career-spotlight', label: '🔦 Career Spotlight'  },
  { id: 'jobs',             label: '💼 Job Listings'      },
  { id: 'networking',       label: '🤝 Networking'         },
]

function SectionNav({ activeId }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (!el) return
    const offset = 120 // navbar (64) + sub-nav (~54) — keeps anchored content clear
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' })
  }
  return (
    <nav className="jc-section-nav" aria-label="Jobs & Careers sections">
      <div className="jc-section-nav__inner">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            type="button"
            className={`jc-nav-tab${activeId === s.id ? ' jc-nav-tab--active' : ''}`}
            onClick={() => scrollTo(s.id)}
            aria-pressed={activeId === s.id}
          >
            {s.label}
          </button>
        ))}
      </div>
    </nav>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function JobsCareersPage() {
  const [userCoords]    = useState(() => storage.get('user-coords', DEFAULT_COORDS))
  const [ruleMatches,   setRuleMatches]   = useState([])
  const [aiSuggestions, setAiSuggestions] = useState(null)
  const [hasSearched,   setHasSearched]   = useState(false)
  const [activeId,      setActiveId]      = useState('career-explorer')
  const observerRef = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting && e.intersectionRatio >= 0.2) setActiveId(e.target.id)
        })
      },
      // top margin clears both sticky bars (navbar 64 + sub-nav ≈ 54)
      { rootMargin: '-118px 0px -40% 0px', threshold: [0.2, 0.5] },
    )
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    observerRef.current = obs
    return () => obs.disconnect()
  }, [])

  const handleResults = (rules, ai) => {
    setRuleMatches(rules)
    setAiSuggestions(ai)
    setHasSearched(true)
    setTimeout(() => {
      const el = document.getElementById('career-results-anchor')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <SiteLayout>
      <div className="jc-page">

        {/* Hero */}
        <div className="jc-hero">
          <div className="jc-hero__inner">
            <span className="jc-hero__eyebrow">Jobs &amp; Careers</span>
            <h1 className="jc-hero__title">Find what you're good at — and get paid for it</h1>
            <p className="jc-hero__sub">
              Discover careers that match your interests, browse live job listings, and track your networking contacts — all in one place.
            </p>
          </div>
        </div>

        <SectionNav activeId={activeId} />

        {/* ── Career Explorer ─────────────────────────────────────────────── */}
        <section id="career-explorer" className="jc-section" aria-labelledby="ce-heading">
          <div className="jc-section__inner">
            <div className="jc-section__header">
              <span className="jc-section__eyebrow">Career Explorer</span>
              <h2 className="jc-section__title" id="ce-heading">What could you be good at?</h2>
              <p className="jc-section__desc">
                Tell us what you're into — subjects, hobbies, skills — and we'll suggest realistic careers worth exploring.
              </p>
            </div>
            <InterestsForm onResults={handleResults} />
            <div id="career-results-anchor" tabIndex={-1} style={{ outline: 'none' }} />
            {hasSearched && (
              <div className="jc-results-wrap">
                <CareerResults ruleMatches={ruleMatches} aiSuggestions={aiSuggestions} />
              </div>
            )}
          </div>
        </section>

        {/* ── Career Spotlight ─────────────────────────────────────────────── */}
        <CareerSpotlight />

        {/* ── Job Listings ────────────────────────────────────────────────── */}
        <section id="jobs" className="jc-section jc-section--alt" aria-labelledby="jobs-heading">
          <div className="jc-section__inner">
            <div className="jc-section__header">
              <span className="jc-section__eyebrow">Live Jobs</span>
              <h2 className="jc-section__title" id="jobs-heading">Jobs near you</h2>
              <p className="jc-section__desc">
                Real roles across coaching, construction, security, health care, logistics, and retail. Filter by field and distance.
              </p>
              <div className="jc-reed-note" role="note">
                <strong>📡 Live data note:</strong> These are seed/demo records. When wired to the Reed API, this page will show real live vacancies filtered by your location.
              </div>
            </div>
            <JobAdverts adverts={jobAdverts} userCoords={userCoords} />
          </div>
        </section>

        {/* ── Networking Tracker ──────────────────────────────────────────── */}
        <section id="networking" className="jc-section" aria-labelledby="net-heading">
          <div className="jc-section__inner">
            <div className="jc-section__header">
              <span className="jc-section__eyebrow">Networking Tracker</span>
              <h2 className="jc-section__title" id="net-heading">Track your contacts</h2>
              <p className="jc-section__desc">
                Keep track of everyone you've reached out to — coaches, employers, clubs. Small conversations lead to big opportunities.
              </p>
            </div>
            <NetworkingTracker />
          </div>
        </section>

      </div>
    </SiteLayout>
  )
}
