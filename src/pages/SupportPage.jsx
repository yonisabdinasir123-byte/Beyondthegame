/**
 * SupportPage.jsx
 * A dedicated support hub for young people in football, covering mental health,
 * finances, identity, career, football exits, community, leadership, and more.
 */
import SiteLayout from '../components/SiteLayout'
import './SupportPage.css'

function Hero() {
  return (
    <div className="support-hero">
      <div className="support-hero__inner">
        <h1 className="support-hero__title">You're not alone in this</h1>
        <p className="support-hero__sub">
          Navigate life after the academy with honest support, real resources, and peers who understand.
        </p>
      </div>
    </div>
  )
}

function Section({ id, number, title, children }) {
  return (
    <section id={id} className="support-section" aria-labelledby={`${id}-heading`}>
      <div className="support-section__inner">
        <div className="support-section__header">
          <span className="support-section__number">{number}</span>
          <h2 id={`${id}-heading`} className="support-section__title">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  )
}

function SupportCard({ icon, title, description, detail }) {
  return (
    <div className="support-card-minimal">
      <div className="support-card-minimal__icon" aria-hidden="true">{icon}</div>
      <div className="support-card-minimal__body">
        <h3 className="support-card-minimal__title">{title}</h3>
        <p className="support-card-minimal__desc">{description}</p>
        {detail && <p className="support-card-minimal__detail">{detail}</p>}
      </div>
    </div>
  )
}

function ResourceCard({ name, description, contact, contactLabel, cta, ctaText, external }) {
  const isPhone = contact.startsWith('tel:')
  const isExternal = external !== false

  return (
    <div className="resource-card">
      <div className="resource-card__header">
        <h3 className="resource-card__name">{name}</h3>
      </div>
      <p className="resource-card__desc">{description}</p>
      <div className="resource-card__contact">
        {isPhone ? (
          <a href={contact} className="resource-card__link resource-card__link--phone">
            📞 {contactLabel}
          </a>
        ) : (
          <a href={contact} target="_blank" rel="noopener noreferrer" className="resource-card__link">
            {contactLabel}
          </a>
        )}
      </div>
      {cta && (
        <a
          href={cta}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="resource-card__cta"
        >
          {ctaText || 'Learn more'}
        </a>
      )}
    </div>
  )
}

export default function SupportPage() {
  return (
    <SiteLayout>
      <div className="support-page">
        <Hero />

        {/* ─── Section A: Support Areas ─────────────────────────────────── */}
        <Section id="mind-wellbeing" number="A" title="Mind & Wellbeing">
          <p className="support-section__intro">
            Feeling low, anxious, or lost after leaving the academy is a normal response to a big change. You deserve support that understands what you've been through.
          </p>
          <div className="support-cards-grid">
            <SupportCard
              icon="🧠"
              title="Dealing with anxiety"
              description="Competitive pressure and release can trigger anxiety. Simple strategies like breathing exercises, routine, and talking it out really help."
            />
            <SupportCard
              icon="💭"
              title="Feeling low or depressed"
              description="Loss of identity, routine, and purpose can lead to depression. It's not weakness — it's grief, and it's treatable."
            />
            <SupportCard
              icon="🛌"
              title="Sleep, eating, and self-care"
              description="When life feels hard, basic care falls apart. Rebuilding sleep and nutrition can shift your whole mood."
            />
            <SupportCard
              icon="👥"
              title="Peer support groups"
              description="Talking to others who've been released helps you feel less alone. Shared experience is powerful medicine."
            />
          </div>
          <div className="resources-grid">
            <ResourceCard
              name="Samaritans"
              description="Free, confidential support 24/7 — whatever you're dealing with."
              contact="tel:116123"
              contactLabel="Call 116 123 (free, 24/7)"
              cta="https://www.samaritans.org"
              ctaText="Visit Samaritans"
            />
            <ResourceCard
              name="Mind"
              description="Information and support for mental health. Guides, crisis info, and local services."
              contact="https://www.mind.org.uk"
              contactLabel="mind.org.uk"
              cta="https://www.mind.org.uk"
              ctaText="Explore Mind"
            />
            <ResourceCard
              name="BetterHelp"
              description="Online therapy via messaging or video — affordable and private."
              contact="https://www.betterhelp.com"
              contactLabel="betterhelp.com"
              cta="https://www.betterhelp.com"
              ctaText="Start therapy"
            />
            <ResourceCard
              name="Shout Crisis Text Line"
              description="Text SHOUT to 85258 for free crisis support — someone will text you back within minutes."
              contact="https://www.shoutcrisis.org"
              contactLabel="Text SHOUT to 85258"
              cta="https://www.shoutcrisis.org"
              ctaText="Learn more"
            />
            <ResourceCard
              name="Young Minds"
              description="Mental health support and guides made for young people, by young people."
              contact="https://www.youngminds.org.uk"
              contactLabel="youngminds.org.uk"
              cta="https://www.youngminds.org.uk"
              ctaText="Visit Young Minds"
            />
            <ResourceCard
              name="Kooth"
              description="Free online counselling for under 25s. Sign up, chat anonymously with a counsellor."
              contact="https://www.kooth.com"
              contactLabel="kooth.com"
              cta="https://www.kooth.com"
              ctaText="Get started"
            />
          </div>
        </Section>

        {/* ─── Section B: Money & Finances ──────────────────────────────── */}
        <Section id="money-finances" number="B" title="Money & Finances">
          <p className="support-section__intro">
            Leaving the academy often means losing income and stability. Understanding your rights and options puts power back in your hands.
          </p>
          <div className="support-cards-grid">
            <SupportCard
              icon="💷"
              title="Benefits you're entitled to"
              description="Universal Credit, Housing Benefit, council tax support — if you're struggling, you likely qualify. No shame in claiming what's yours."
            />
            <SupportCard
              icon="💳"
              title="Budgeting and debt"
              description="Learn to manage money month-to-month, understand credit, and get help if you're in debt."
            />
            <SupportCard
              icon="📈"
              title="Saving and longer-term planning"
              description="Even small savings feel good. Building habits now sets you up for the future."
            />
            <SupportCard
              icon="🎓"
              title="Funding further education"
              description="Student finance, grants, scholarships — ways to fund your next steps that don't leave you broke."
            />
          </div>
          <div className="resources-grid">
            <ResourceCard
              name="StepChange"
              description="Free debt advice and budgeting support. Confidential, non-judgmental."
              contact="https://www.stepchange.org"
              contactLabel="stepchange.org"
              cta="https://www.stepchange.org"
              ctaText="Get debt help"
            />
            <ResourceCard
              name="Citizens Advice"
              description="Benefits advice, housing support, and money guidance — all free."
              contact="https://www.citizensadvice.org.uk"
              contactLabel="citizensadvice.org.uk"
              cta="https://www.citizensadvice.org.uk"
              ctaText="Find your local office"
            />
            <ResourceCard
              name="Gov.uk Benefits"
              description="Official government guide to benefits you might qualify for."
              contact="https://www.gov.uk/benefits"
              contactLabel="gov.uk/benefits"
              cta="https://www.gov.uk/benefits"
              ctaText="Check eligibility"
            />
            <ResourceCard
              name="National Debtline"
              description="Free, confidential debt advice by phone or online."
              contact="tel:0808808434"
              contactLabel="Call 0808 808 4000"
              cta="https://www.nationaldebtline.org"
              ctaText="Visit National Debtline"
            />
          </div>
        </Section>

        {/* ─── Section C: Feelings & Identity ────────────────────────────── */}
        <Section id="feelings-identity" number="C" title="Feelings & Identity">
          <p className="support-section__intro">
            When football was your whole identity and it's suddenly gone, grieving that loss is healthy and real. You're more than one sport.
          </p>
          <div className="support-cards-grid">
            <SupportCard
              icon="💔"
              title="Grief and loss"
              description="Leaving the academy can feel like losing a loved one. Allow yourself to feel it, then find what comes next."
            />
            <SupportCard
              icon="🔍"
              title="Finding yourself beyond football"
              description="What else makes you tick? What did you love before football? Now's the time to reconnect with that."
            />
            <SupportCard
              icon="👁️"
              title="Body image and comparison"
              description="Athletes often struggle with how their body feels after competition ends. That's normal — and worth talking about."
            />
            <SupportCard
              icon="🏳️‍🌈"
              title="LGBTQ+ support in football"
              description="Football culture can feel unwelcoming if you're queer. You're not alone — there are communities and spaces for you."
            />
          </div>
          <div className="resources-grid">
            <ResourceCard
              name="The Proud Trust"
              description="LGBTQ+ support for young people in sport. Peer support, events, and resources."
              contact="https://www.theproudtrust.org"
              contactLabel="theproudtrust.org"
              cta="https://www.theproudtrust.org"
              ctaText="Connect with community"
            />
            <ResourceCard
              name="UK Youth"
              description="Youth groups and activities near you — explore new interests and make new friends."
              contact="https://www.ukyouth.org"
              contactLabel="ukyouth.org"
              cta="https://www.ukyouth.org"
              ctaText="Find a group near you"
            />
            <ResourceCard
              name="Relate"
              description="Relationship and identity counselling. Helps you understand yourself better."
              contact="https://www.relate.org.uk"
              contactLabel="relate.org.uk"
              cta="https://www.relate.org.uk"
              ctaText="Book a session"
            />
          </div>
        </Section>

        {/* ─── Section D: Work & Your Future ────────────────────────────── */}
        <Section id="work-future" number="D" title="Work & Your Future">
          <p className="support-section__intro">
            Your academy training taught you discipline, teamwork, and how to handle pressure. Those skills translate to every career path.
          </p>
          <div className="support-cards-grid">
            <SupportCard
              icon="📄"
              title="CV writing and job searching"
              description="Turn your academy experience into a winning CV. Employers respect athletes — position yourself right."
            />
            <SupportCard
              icon="🤝"
              title="Interview skills"
              description="Talking about yourself in an interview feels weird. But you've done pressured performances — this is the same."
            />
            <SupportCard
              icon="🏢"
              title="Apprenticeships and training"
              description="Earn while you learn. Apprenticeships are a real alternative to university — respected, practical, well-paid."
            />
            <SupportCard
              icon="🎯"
              title="Finding work you actually like"
              description="Not just any job — work that makes you feel like you're building something."
            />
          </div>
          <div className="resources-grid">
            <ResourceCard
              name="National Careers Service"
              description="Free careers advice by phone, online, or in person. Explore options, get CV help."
              contact="tel:03003609000"
              contactLabel="Call 0300 360 9000"
              cta="https://nationalcareers.service.gov.uk"
              ctaText="Get careers advice"
            />
            <ResourceCard
              name="Apprenticeships.gov.uk"
              description="Browse and apply for apprenticeships across the UK. All industries, all levels."
              contact="https://www.apprenticeships.gov.uk"
              contactLabel="apprenticeships.gov.uk"
              cta="https://www.apprenticeships.gov.uk"
              ctaText="Find an apprenticeship"
            />
            <ResourceCard
              name="LinkedIn Learning"
              description="Free CV and job search courses. Build skills employers want."
              contact="https://www.linkedin.com/learning"
              contactLabel="linkedin.com/learning"
              cta="https://www.linkedin.com/learning"
              ctaText="Start learning"
            />
            <ResourceCard
              name="Reed.co.uk"
              description="UK's biggest job board. Search by location, industry, or interest."
              contact="https://www.reed.co.uk"
              contactLabel="reed.co.uk"
              cta="https://www.reed.co.uk"
              ctaText="Browse jobs"
            />
          </div>
        </Section>

        {/* ─── Section E: Football Exits ────────────────────────────────── */}
        <Section id="football-exits" number="E" title="Football Exits">
          <p className="support-section__intro">
            Whether you're being released, considering your options, or dealing with injury — understanding your rights and next steps matters.
          </p>
          <div className="support-cards-grid">
            <SupportCard
              icon="⚖️"
              title="Your rights and the academy release process"
              description="Know what you're owed, what notices must be given, and when. You have rights — use them."
            />
            <SupportCard
              icon="🤵"
              title="Agents, contracts, and negotiations"
              description="If you're moving clubs or going semi-pro, understand what's fair. Don't sign anything without advice."
            />
            <SupportCard
              icon="⚽"
              title="Non-league, semi-pro, and step football"
              description="Continuing to play at lower levels is a real option. Earn some money, keep playing, build a different life."
            />
            <SupportCard
              icon="🏥"
              title="Injury and returning to football"
              description="Career-ending injury is traumatic. Support exists — counselling, rehab options, and paths forward."
            />
          </div>
          <div className="resources-grid">
            <ResourceCard
              name="Professional Footballers' Association"
              description="Union for footballers. Advice on contracts, releases, and player rights."
              contact="https://www.thepfa.com"
              contactLabel="thepfa.com"
              cta="https://www.thepfa.com"
              ctaText="Contact the PFA"
            />
            <ResourceCard
              name="The Non-League Pyramid"
              description="Guide to England's step system — clubs, competitions, and how to join."
              contact="https://www.nonleaguematters.co.uk"
              contactLabel="nonleaguematters.co.uk"
              cta="https://www.nonleaguematters.co.uk"
              ctaText="Explore the pyramid"
            />
            <ResourceCard
              name="Step Change"
              description="Legal advice on contracts and negotiation. Often free or low-cost."
              contact="https://www.stepchange.org"
              contactLabel="stepchange.org"
              cta="https://www.stepchange.org"
              ctaText="Get legal help"
            />
          </div>
        </Section>

        {/* ─── Section F: Community & Mates ──────────────────────────────── */}
        <Section id="community-meets" number="F" title="Community & Mates">
          <p className="support-section__intro">
            You're not the only one going through this. Thousands of young people have walked this path. Connecting with them changes everything.
          </p>
          <div className="support-cards-grid">
            <SupportCard
              icon="👥"
              title="Peer support communities"
              description="Online and local groups where you can share your story, ask questions, and hear others' journeys without judgment."
            />
            <SupportCard
              icon="🎤"
              title="Open discussion events"
              description="Monthly sessions where young people talk openly about release, careers, identity, and life after academy."
            />
            <SupportCard
              icon="⚽"
              title="Grassroots and local clubs"
              description="Keep playing at a level that works for you. Grassroots football is where the community is."
            />
            <SupportCard
              icon="🤝"
              title="Mentoring circles"
              description="Pair up with someone further along the journey. Get advice, share wins, stay accountable."
            />
          </div>
          <div className="resources-grid">
            <ResourceCard
              name="Football Beyond the Academy Network"
              description="Direct community of released academy players. Share experiences, stay connected."
              contact="https://beyondthegame.org.uk"
              contactLabel="beyondthegame.org.uk"
              cta="https://beyondthegame.org.uk"
              ctaText="Join the community"
            />
            <ResourceCard
              name="Grassroots Football Association"
              description="Find local grassroots clubs and organised matches near you."
              contact="https://www.grassrootsfa.org"
              contactLabel="grassrootsfa.org"
              cta="https://www.grassrootsfa.org"
              ctaText="Find a club"
            />
            <ResourceCard
              name="UK Youth"
              description="Youth clubs and activities — meet new people, build community beyond football."
              contact="https://www.ukyouth.org"
              contactLabel="ukyouth.org"
              cta="https://www.ukyouth.org"
              ctaText="Find a group"
            />
          </div>
        </Section>

        {/* ─── Section G: Life After the Academy ──────────────────────────── */}
        <Section id="life-after" number="G" title="Life After the Academy">
          <p className="support-section__intro">
            The academy system isn't the only route to a good life. Thousands of players have built something real after release — and you can too.
          </p>
          <div className="support-cards-grid">
            <SupportCard
              icon="🏆"
              title="Non-league and the freedom player market"
              description="Step football is competitive, community-driven, and sometimes paid. You can still play the game you love at a level that fits your life."
            />
            <SupportCard
              icon="🎓"
              title="Sports science and coaching degrees"
              description="Your football knowledge has real academic value. Sports science, performance analysis, and coaching degrees all build on what you already know."
            />
            <SupportCard
              icon="🧠"
              title="Psychological literacy"
              description="Understanding your own mind is a superpower. Learning about resilience, identity, and mental performance changes how you handle everything life throws at you."
            />
            <SupportCard
              icon="📖"
              title="Real player stories"
              description="Hearing from people who've walked the same road — and built something great anyway — makes the next step feel possible."
            />
          </div>
          <div className="resources-grid">
            <ResourceCard
              name="Football Beyond Borders"
              description="Uses football as a tool to support young people through education and life transitions."
              contact="https://www.footballbeyondborders.org"
              contactLabel="footballbeyondborders.org"
              cta="https://www.footballbeyondborders.org"
              ctaText="Find out more"
            />
            <ResourceCard
              name="Non-League Football Portal"
              description="Clubs, leagues, and trials across England's step football pyramid. Still playing, different level."
              contact="https://www.nonleaguematters.co.uk"
              contactLabel="nonleaguematters.co.uk"
              cta="https://www.nonleaguematters.co.uk"
              ctaText="Explore the pyramid"
            />
            <ResourceCard
              name="The PFA Education Department"
              description="Scholarships, courses, and career development for released or transitioning players."
              contact="https://www.thepfa.com/education"
              contactLabel="thepfa.com/education"
              cta="https://www.thepfa.com/education"
              ctaText="Explore courses"
            />
            <ResourceCard
              name="UCAS"
              description="University and college applications. Search sports science, coaching, business — your next chapter."
              contact="https://www.ucas.com"
              contactLabel="ucas.com"
              cta="https://www.ucas.com"
              ctaText="Browse courses"
            />
          </div>
        </Section>

        {/* ─── Section H: Substance Awareness ────────────────────────────── */}
        <Section id="substance-awareness" number="H" title="Substance Awareness">
          <p className="support-section__intro">
            Leaving sport means losing structure, identity, and community. Some people turn to substances to cope. This is about facts, not fear.
          </p>
          <div className="support-cards-grid">
            <SupportCard
              icon="🔬"
              title="The science behind substance use"
              description="Why people use — stress, loss, peer pressure, self-medication. Understanding it helps you recognise it in yourself."
            />
            <SupportCard
              icon="⚠️"
              title="Spotting addiction"
              description="Using more than planned, hiding use, losing interest in other things. If these sound familiar, that's a sign to reach out."
            />
            <SupportCard
              icon="💪"
              title="Getting help without shame"
              description="Addiction is a health issue, not a moral failure. Treatment works — you can recover."
            />
            <SupportCard
              icon="🏥"
              title="Managing cravings and triggers"
              description="After quitting, triggers are real. Learning to handle them is how you stay on track."
            />
          </div>
          <div className="resources-grid">
            <ResourceCard
              name="Talk to Frank"
              description="Honest, non-judgmental information about every drug. Chat online or call."
              contact="tel:0300123625"
              contactLabel="Call 0300 123 6600"
              cta="https://www.talktofrank.com"
              ctaText="Chat online"
            />
            <ResourceCard
              name="Addaction (We Are With You)"
              description="Free support for substance use issues — counselling, groups, and treatment options."
              contact="https://www.wearewithyou.org.uk"
              contactLabel="wearewithyou.org.uk"
              cta="https://www.wearewithyou.org.uk"
              ctaText="Get support"
            />
            <ResourceCard
              name="Alcoholics Anonymous"
              description="12-step support for alcohol use. Free, confidential meetings nationwide."
              contact="https://www.alcoholics-anonymous.org.uk"
              contactLabel="alcoholics-anonymous.org.uk"
              cta="https://www.alcoholics-anonymous.org.uk"
              ctaText="Find a meeting"
            />
            <ResourceCard
              name="Narcotics Anonymous"
              description="Recovery support for all drug use. Peer-led, free, and confidential."
              contact="https://www.ukna.org"
              contactLabel="ukna.org"
              cta="https://www.ukna.org"
              ctaText="Get started"
            />
          </div>
        </Section>

        {/* ─── Section H: Grooming Awareness ────────────────────────────── */}
        <Section id="grooming-awareness" number="I" title="Grooming Awareness">
          <p className="support-section__intro">
            Grooming is how adults build trust with young people to exploit them. Knowing the signs helps you protect yourself and your friends.
          </p>
          <div className="support-cards-grid">
            <SupportCard
              icon="🚩"
              title="What grooming looks like"
              description="An adult building special relationship with a young person, giving gifts, isolating them from others, then exploitation. It happens online and in person."
            />
            <SupportCard
              icon="📱"
              title="Online grooming signs"
              description="Asking to move to private chat, asking for photos, age-inappropriate questions, requesting location, or 'keeping secrets'."
            />
            <SupportCard
              icon="⚽"
              title="Grooming in sport"
              description="Coaches or adults in football using authority to isolate you, demand secrecy, or push boundaries. That's not coaching — that's abuse."
            />
            <SupportCard
              icon="💬"
              title="If you think someone is being groomed"
              description="Talk to them without judgment. Report it to the authorities listed below. You're helping protect them."
            />
          </div>
          <div className="resources-grid">
            <ResourceCard
              name="NSPCC (National Society for the Prevention of Cruelty to Children)"
              description="Free, confidential advice if you're being abused or worried about someone. They handle reports sensitively."
              contact="tel:08088005000"
              contactLabel="Call 0808 800 5000"
              cta="https://www.nspcc.org.uk"
              ctaText="Get help"
            />
            <ResourceCard
              name="Childline"
              description="Free, confidential chat or call for young people under 19. Available 24/7."
              contact="tel:08001111"
              contactLabel="Call 0800 1111"
              cta="https://www.childline.org.uk"
              ctaText="Chat online"
            />
            <ResourceCard
              name="CEOP (Child Exploitation and Online Protection)"
              description="Report grooming, sexual abuse, or exploitation online. Police-run, serious about keeping you safe."
              contact="https://www.ceop.police.uk"
              contactLabel="ceop.police.uk"
              cta="https://www.ceop.police.uk"
              ctaText="Report"
            />
            <ResourceCard
              name="Sport England Safeguarding"
              description="Report abuse or safeguarding concerns in sport."
              contact="https://www.sportengland.org/safeguarding"
              contactLabel="sportengland.org"
              cta="https://www.sportengland.org/safeguarding"
              ctaText="Report concern"
            />
          </div>
        </Section>

        {/* ─── Section I: Local Mentor Access ────────────────────────────── */}
        <Section id="local-mentors" number="J" title="Local Mentor Access">
          <p className="support-section__intro">
            A mentor is someone further along who believes in you, listens without judgment, and helps you find your next steps. Having one changes lives.
          </p>
          <div className="support-cards-grid">
            <SupportCard
              icon="👤"
              title="What mentoring is"
              description="A trusted adult who's been through something similar. You meet regularly, talk openly, and they help you solve problems your own way."
            />
            <SupportCard
              icon="🎯"
              title="Why mentors matter"
              description="Having someone in your corner who believes in you, especially after a loss like release, gives you hope and direction."
            />
            <SupportCard
              icon="🏘️"
              title="Finding a mentor"
              description="Through youth clubs, schools, mentoring programmes, or community organisations. Most are free or low-cost."
            />
          </div>
          <div className="resources-grid">
            <ResourceCard
              name="UK Youth"
              description="Youth clubs and mentoring programmes across the UK. Free, accessible."
              contact="https://www.ukyouth.org"
              contactLabel="ukyouth.org"
              cta="https://www.ukyouth.org"
              ctaText="Find your local club"
            />
            <ResourceCard
              name="National Youth Agency"
              description="Directory of youth services. Find mentoring, support, and activities near you."
              contact="https://www.nya.org.uk"
              contactLabel="nya.org.uk"
              cta="https://www.nya.org.uk"
              ctaText="Find a service"
            />
            <ResourceCard
              name="Street League"
              description="Mentoring for young people facing barriers. Builds confidence and pathways to work."
              contact="https://www.streetleague.org.uk"
              contactLabel="streetleague.org.uk"
              cta="https://www.streetleague.org.uk"
              ctaText="Learn more"
            />
            <ResourceCard
              name="Prince's Trust"
              description="Support and mentoring for young people aged 13–30. Builds confidence and careers."
              contact="https://www.princes-trust.org.uk"
              contactLabel="princes-trust.org.uk"
              cta="https://www.princes-trust.org.uk"
              ctaText="Explore support"
            />
          </div>
        </Section>

        {/* ─── Section J: Leadership & Giving Back ──────────────────────── */}
        <Section id="leadership" number="K" title="Leadership & Giving Back">
          <p className="support-section__intro">
            You have more to give than you realise. Stepping into leadership—mentoring others, volunteering, building community—changes both them and you.
          </p>

          <div className="leadership-subsections">
            <div className="leadership-sub">
              <h3 className="leadership-sub__title">🔵 Be a Captain</h3>
              <p className="leadership-sub__desc">
                Leadership starts before you get the armband. Showing up, supporting your teammates, speaking honestly — that's what a captain does. On the pitch and off it. Whether you're leading a grassroots team or mentoring younger players, you're showing them what's possible.
              </p>
              <a href="https://www.thepfa.com/leadership" target="_blank" rel="noopener noreferrer" className="leadership-cta">
                Explore PFA leadership programmes
              </a>
            </div>

            <div className="leadership-sub">
              <h3 className="leadership-sub__title">🤝 Volunteer Locally</h3>
              <p className="leadership-sub__desc">
                Give your time to your community. Coach grassroots clubs, help at food banks, run youth programmes. Work that pays nothing in money but everything in purpose — and it looks incredible on a CV.
              </p>
              <a href="https://www.do-it.org" target="_blank" rel="noopener noreferrer" className="leadership-cta">
                Find volunteering near you
              </a>
            </div>

            <div className="leadership-sub">
              <h3 className="leadership-sub__title">🧑‍🏫 Mentor the Next Generation</h3>
              <p className="leadership-sub__desc">
                You've been through release, pressure, disappointment. Younger kids will face the same. Seeing yourself in them and sharing what you've learned — that's real mentorship. You don't need formal training. You just need to show up.
              </p>
              <a href="https://www.ukyouth.org" target="_blank" rel="noopener noreferrer" className="leadership-cta">
                Start mentoring
              </a>
            </div>

            <div className="leadership-sub">
              <h3 className="leadership-sub__title">🏘️ Build Your Community</h3>
              <p className="leadership-sub__desc">
                Small acts of service create lasting change. Organising a local kickabout, starting a support group for released players, creating space for young people to be heard — that's what builds community. And that's leadership.
              </p>
              <a href="https://www.vinspired.com" target="_blank" rel="noopener noreferrer" className="leadership-cta">
                Explore community projects
              </a>
            </div>
          </div>

          <div className="resources-grid" style={{ marginTop: '3rem' }}>
            <ResourceCard
              name="Do-it.org"
              description="Volunteer database for the UK. Browse opportunities by location, cause, or time commitment."
              contact="https://www.do-it.org"
              contactLabel="do-it.org"
              cta="https://www.do-it.org"
              ctaText="Find volunteering"
            />
            <ResourceCard
              name="Vinspired"
              description="Volunteering opportunities for young people. Build skills, make a difference, have fun."
              contact="https://www.vinspired.com"
              contactLabel="vinspired.com"
              cta="https://www.vinspired.com"
              ctaText="Browse opportunities"
            />
            <ResourceCard
              name="FA Volunteer Coaching"
              description="Train as a grassroots coach. Give back to the game, build a career."
              contact="https://www.theFA.com"
              contactLabel="theFA.com"
              cta="https://www.theFA.com"
              ctaText="Learn to coach"
            />
            <ResourceCard
              name="Grassroots Football Association"
              description="Get involved in grassroots — as a coach, official, volunteer, or community builder."
              contact="https://www.grassrootsfa.org"
              contactLabel="grassrootsfa.org"
              cta="https://www.grassrootsfa.org"
              ctaText="Get involved"
            />
          </div>
        </Section>
      </div>
    </SiteLayout>
  )
}
