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
        quals: ['UEFA C Licence', 'DBS Enhanced Check', 'FA Safeguarding in Football', 'FA Intro to Coaching Football'],
        opps: {
          text: "Local grassroots clubs need volunteer coaches for U7–U16 teams year-round. Many will fund your UEFA C Licence after 3 months of regular volunteering — ask directly when you apply. The FA also offers coaching bursaries specifically for players from under-represented backgrounds.",
          links: [
            { label: 'FA Club Finder', url: 'https://www.thefa.com/football-rules-governance/policies/safeguarding/find-a-club' },
            { label: 'Sportcareers.com', url: 'https://www.sportcareers.com' },
          ],
        },
      },
      {
        title: 'Academy / Youth Development Coach',
        badge: 'PAID',
        badgeType: 'paid',
        tagline: "You're designing training sessions for the next generation of academy players, turning raw talent into real technical ability.",
        steps: [
          'Earn your UEFA C Licence first, then plan 12–18 months to complete the UEFA B Licence.',
          'Apply for assistant coaching roles at Step 5–7 clubs or county FA youth development programmes.',
          'Build a coaching portfolio: film your sessions, log CPD hours, collect player and parent feedback.',
        ],
        quals: ['UEFA C Licence', 'UEFA B Licence', 'DBS Enhanced Check', 'FA Youth Award (Levels 1–3)'],
        opps: {
          text: "County FAs and grassroots academies hire part-time youth development coaches throughout the year. The FA also offers coaching bursaries for individuals from under-represented backgrounds who want to progress through the licence pathway.",
          links: [
            { label: 'FA Jobs Board', url: 'https://www.thefa.com/football-rules-governance/jobs' },
            { label: 'County FA Coaching Opportunities', url: 'https://www.thefa.com/football-rules-governance/county-fa' },
          ],
        },
      },
      {
        title: 'Sports Science / S&C Coach',
        badge: 'PAID',
        badgeType: 'paid',
        tagline: "You're in the gym and on the training pitch, building programmes that make players faster, stronger, and harder to injure.",
        steps: [
          'Study a BSc in Sports Science or Strength & Conditioning — available full-time, part-time, or via degree apprenticeship.',
          'Work towards UKSCA Accreditation (UK Strength and Conditioning Association) — the industry-standard credential.',
          'Volunteer with a local academy or semi-pro team to build practical hours alongside your qualification.',
        ],
        quals: ['BSc Sports Science', 'UKSCA Accreditation', 'Sports First Aid', 'DBS Enhanced Check'],
        opps: {
          text: "Non-league clubs from Step 3 upward are increasingly hiring S&C coaches, particularly for pre-season and injury rehabilitation. Many start as unpaid volunteers before transitioning to a matchday fee and eventually a part-time salary.",
          links: [
            { label: 'UKSCA Job Board', url: 'https://www.uksca.org.uk/careers' },
            { label: 'Sportcareers.com', url: 'https://www.sportcareers.com' },
          ],
        },
      },
      {
        title: 'PE Teacher',
        badge: 'PAID',
        badgeType: 'paid',
        tagline: "You're running football sessions, athletics days, and fitness classes — inspiring kids the same way a coach once inspired you.",
        steps: [
          'Complete a PE-related undergraduate degree or BSc in Sports Science (3 years, or with foundation year).',
          'Apply for a PGCE in Secondary Physical Education — government bursaries of up to £9,000 are available.',
          'Consider School Direct or Teach First if you want to earn a salary while training in a real school.',
        ],
        quals: ['PGCE Secondary Physical Education', 'QTS (Qualified Teacher Status)', 'DBS Enhanced Check'],
        opps: {
          text: "PE teachers are in consistent demand across UK state secondary schools. Academy experience is a genuine asset when applying — schools want teachers who can coach football to a high level, and your background sets you apart immediately.",
          links: [
            { label: 'Get Into Teaching', url: 'https://getintoteaching.education.gov.uk' },
            { label: 'TES Jobs', url: 'https://www.tes.com/jobs' },
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
        quals: ['FA Referee Course (Level 7)', 'FA Safeguarding in Football', 'Annual Referee Fitness Assessment'],
        opps: {
          text: "Every grassroots match in England needs a referee — demand is constant and year-round. County FAs actively recruit new officials and provide a structured mentoring pathway all the way to the National List and beyond.",
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
          'Film 3 match day videos at a local non-league club and publish them as a portfolio reel on YouTube or Vimeo.',
          'DM 10 National League North/South clubs directly — many post work experience opportunities on their Instagram.',
          'Formalise your skills with an NCTJ Digital Journalism short course or a Level 3 Media qualification.',
        ],
        quals: ['NCTJ Digital Journalism Certificate', 'Level 3 Creative Media Production (BTEC)', 'Adobe Premiere Pro or CapCut'],
        opps: {
          text: "Clubs from Step 3 downward regularly seek content creators — many offer unpaid or expenses-covered placements that lead to paid roles. Your football knowledge and access to players is a genuine differentiator over career changers with no sport background.",
          links: [
            { label: 'NCTJ Training Courses', url: 'https://www.nctj.com/journalism-qualifications' },
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
          'Study for an NCTJ Diploma in Journalism (Levels 3 and 4) — the industry-standard entry route into print and digital journalism.',
          'Apply for work experience at local newspapers, BBC Sport regional, or football-specific outlets like The Non-League Paper.',
        ],
        quals: ['NCTJ Diploma in Journalism (Levels 3 & 4)', 'NCTJ Media Law & Regulation', 'Shorthand 100 wpm (NCTJ requirement)'],
        opps: {
          text: "Local newspapers and digital outlets cover non-league football extensively and they consistently need writers who genuinely understand the game. NCTJ-trained reporters are hired directly by national titles, broadcasters, and digital-first outlets.",
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
        tagline: "You're behind the lens at training grounds and match days, producing footage clubs, broadcasters, and players actually use.",
        steps: [
          'Learn the basics: a Sony ZV-E10 or similar entry-level mirrorless camera and DaVinci Resolve (free professional editing software).',
          'Offer to film 5 matches for a local club for free — build a showreel from the best 90 seconds of each match.',
          'Apply to production companies that supply National League and EFL clubs with match-day coverage and highlight packages.',
        ],
        quals: ['Level 3 Creative Media Production (BTEC)', 'Adobe Premiere Pro or DaVinci Resolve', 'No formal degree required with a strong portfolio'],
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
        quals: ['No formal qualification required', 'Adobe Audition or Audacity (free audio editing)', 'Basic video editing for social clips'],
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
        quals: ['No formal qualification required', 'DSLR or mirrorless camera (entry-level)', 'Adobe Lightroom for post-processing'],
        opps: {
          text: "Non-league clubs commonly pay £50–150 per match day for a reliable photographer. Regional sports news agencies also hire freelancers for specific fixtures, and building your own print sales from non-league action is a growing income stream.",
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
        title: 'Football Agent / Intermediary',
        badge: 'SELF-EMPLOYED',
        badgeType: 'self-employed',
        tagline: "You're negotiating contracts, brokering transfers, and building a client list — your football contacts are your starting capital.",
        steps: [
          'Pass the FA Intermediary Exam (held annually — study the FIFA and FA Intermediary Regulations thoroughly before sitting).',
          'Register with The FA and pay the annual registration fee (~£500) — without this you cannot legally represent players.',
          'Begin representing players in your existing network, documenting all transactions via the FA\'s Intermediary portal.',
        ],
        quals: ['FA Registered Intermediary Status', 'FA Intermediary Examination', 'Clean criminal record (mandatory)'],
        opps: {
          text: "Your existing network of teammates and academy contacts is your most valuable asset. Most successful agents started by representing one player and grew from there — the barrier is registration, not experience. The FA publishes a public register of all licensed intermediaries.",
          links: [
            { label: 'FA Intermediary Registration', url: 'https://www.thefa.com/football-rules-governance/intermediaries' },
            { label: 'How to Become an Intermediary', url: 'https://www.thefa.com/football-rules-governance/intermediaries/how-to-become-an-intermediary' },
          ],
        },
      },
      {
        title: 'Sports Nutritionist / Performance Chef',
        badge: 'SELF-EMPLOYED',
        badgeType: 'self-employed',
        tagline: "You're building meal plans for athletes, stocking club kitchens, and becoming the secret weapon behind on-pitch performance.",
        steps: [
          'Complete a Level 3 Award in Nutrition — available via BTEC, Cache, or NHD-accredited providers, typically 4–6 months.',
          'Specialise with an ISSN Foundation Level Sports Nutrition Certificate or the NHD Sports Nutrition short course.',
          'Approach local academies and non-league clubs directly — most clubs below Championship level have no dedicated nutritionist at all.',
        ],
        quals: ['Level 3 Award in Nutrition (BTEC or Cache)', 'ISSN Foundation Sports Nutrition Certificate', 'Food Hygiene Level 2', 'NHD Sports Nutrition Certificate'],
        opps: {
          text: "Lower-league clubs and academies rarely have a dedicated nutritionist — this is a genuine gap in the market that a qualified specialist can fill. Offer a free 4-week athlete meal plan trial to a local club to build your portfolio and get a reference that opens doors.",
          links: [
            { label: 'British Dietetic Association', url: 'https://www.bda.uk.com/resource/become-a-dietitian.html' },
            { label: 'ISSN UK', url: 'https://www.theissn.org' },
          ],
        },
      },
      {
        title: 'Club Operations / Stadium Manager',
        badge: 'PAID',
        badgeType: 'paid',
        tagline: "You're running the matchday operation — from pitch logistics and licencing to staff rotas and venue compliance.",
        steps: [
          'Start as a matchday volunteer at a semi-professional club to learn how venue operations actually run from the inside.',
          'Study a Level 4 HNC or HND in Events Management or Sport & Leisure Management (many offered part-time).',
          'Apply for operations coordinator roles at EFL or major non-league clubs via The FA Jobs Board or Sportcareers.',
        ],
        quals: ['HNC / HND Events or Sport & Leisure Management (Level 4)', 'First Aid at Work', 'IOSH Managing Safely (Health & Safety)'],
        opps: {
          text: "EFL League One and Two clubs advertise operations and facilities roles consistently throughout the year. Most clubs recruit their paid operations staff directly from their existing matchday volunteer pool — starting as a volunteer is the fastest way in.",
          links: [
            { label: 'FA Jobs Board', url: 'https://www.thefa.com/football-rules-governance/jobs' },
            { label: 'Sportcareers.com', url: 'https://www.sportcareers.com' },
          ],
        },
      },
      {
        title: 'Sports Marketing Executive',
        badge: 'PAID',
        badgeType: 'paid',
        tagline: "You're running ticket campaigns, managing partnerships, and building a club's brand — turning fan passion into commercial revenue.",
        steps: [
          'Build a portfolio: run a free social media campaign for a local club, document results with screenshots and metrics.',
          'Study for a CIM Certificate in Professional Marketing (Level 4) — the UK marketing industry standard, available part-time.',
          'Apply for marketing assistant roles at EFL or National League clubs — many advertise on The FA Jobs Board and LinkedIn.',
        ],
        quals: ['CIM Certificate in Professional Marketing (Level 4)', 'Google Analytics Certification (free)', 'Meta Ads Certification (free)', 'Degree in Marketing or Business (preferred but not essential)'],
        opps: {
          text: "Football clubs at every level need marketers, and those with genuine football experience have a clear advantage over career changers. Understanding supporter culture, matchday atmosphere, and player stories is something you already have — most marketing graduates don't.",
          links: [
            { label: 'CIM Professional Marketing', url: 'https://www.cim.co.uk/qualifications' },
            { label: 'FA Jobs Board', url: 'https://www.thefa.com/football-rules-governance/jobs' },
          ],
        },
      },
      {
        title: 'Talent Scout / Academy Recruitment',
        badge: 'PAID',
        badgeType: 'paid',
        tagline: "You're watching matches across the country, identifying players clubs haven't spotted yet, and filing the reports that change careers.",
        steps: [
          'Attend local fixtures as a supporter-scout and build your own player assessment template and structured match report format.',
          'Complete the FA Scouting & Talent ID Education programme — available via your county FA or regional talent hub.',
          'Build a portfolio of detailed scouting reports and approach heads of recruitment at Step 3–5 clubs directly.',
        ],
        quals: ['FA Scouting & Talent Identification Education', 'UEFA C Licence (strongly preferred)', 'Wyscout or InStat platform knowledge (industry standard)'],
        opps: {
          text: "Many clubs from Step 4 upward use unpaid or expenses-only scouts for non-priority regions — this is the standard first step before paid roles open up. Your existing knowledge of which local players are worth watching is your primary asset when approaching clubs.",
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
    const offset = 64 + 52
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
      { rootMargin: '-64px 0px -40% 0px', threshold: [0.2, 0.5] },
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
