/**
 * SupportPage.jsx
 * A dedicated support hub for young people in football, covering mental health,
 * finances, identity, career, football exits, community, leadership, and more.
 * Every major area is rendered as a floating glass section over the animated
 * site background, with a "Who can help" band of partner and charity logos.
 */
import SiteLayout from '../components/SiteLayout'
import GlassCard from '../components/GlassCard'
import FloatingSection from '../components/FloatingSection'
import NextStep from '../components/NextStep'
import FloatingLogos from '../components/support/FloatingLogos'
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

function SupportCard({ icon, title, description, detail }) {
  return (
    <GlassCard as="article" className="support-card-minimal" interactive>
      <div className="support-card-minimal__icon" aria-hidden="true">{icon}</div>
      <div className="support-card-minimal__body">
        <h3 className="support-card-minimal__title">{title}</h3>
        <p className="support-card-minimal__desc">{description}</p>
        {detail && <p className="support-card-minimal__detail">{detail}</p>}
      </div>
    </GlassCard>
  )
}

function ResourceCard({ name, description, contact, contactLabel, cta, ctaText, external }) {
  const isPhone = contact.startsWith('tel:')
  const isExternal = external !== false

  return (
    <GlassCard as="article" className="resource-card" glow="teal">
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
    </GlassCard>
  )
}

export default function SupportPage() {
  return (
    <SiteLayout>
      <div className="support-page">
        <Hero />

        {/* Who can help: floating partner and charity logos */}
        <FloatingSection
          id="who-can-help"
          eyebrow="Who can help"
          title="Trusted organisations in your corner"
          intro="These groups support young people in and beyond football. Reach out to any of them whenever you need to. You never have to face things on your own."
          glow="lime"
        >
          <FloatingLogos />
        </FloatingSection>

        {/* Section A: Mind & Wellbeing */}
        <FloatingSection
          id="mind-wellbeing"
          eyebrow="Section A"
          title="Mind and Wellbeing"
          intro="Feeling low, anxious, or lost after leaving the academy is a normal response to a big change. You deserve support that understands what you have been through."
          glow="teal"
        >
          <div className="support-cards-grid">
            <SupportCard
              icon="🧠"
              title="Dealing with anxiety"
              description="Competitive pressure and release can trigger anxiety. Simple strategies like breathing exercises, routine, and talking it out really help."
            />
            <SupportCard
              icon="💭"
              title="Feeling low or depressed"
              description="Loss of identity, routine, and purpose can lead to depression. It is not weakness, it is grief, and it is treatable."
            />
            <SupportCard
              icon="🛌"
              title="Sleep, eating, and self-care"
              description="When life feels hard, basic care falls apart. Rebuilding sleep and nutrition can shift your whole mood."
            />
            <SupportCard
              icon="👥"
              title="Peer support groups"
              description="Talking to others who have been released helps you feel less alone. Shared experience is powerful medicine."
            />
          </div>
          <div className="resources-grid">
            <ResourceCard
              name="Samaritans"
              description="Free, confidential support any time of day or night, whatever you are dealing with."
              contact="tel:116123"
              contactLabel="Call 116 123 (free, any time)"
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
              description="Online therapy by messaging or video, affordable and private."
              contact="https://www.betterhelp.com"
              contactLabel="betterhelp.com"
              cta="https://www.betterhelp.com"
              ctaText="Start therapy"
            />
            <ResourceCard
              name="Shout Crisis Text Line"
              description="Text SHOUT to 85258 for free crisis support. Someone will text you back within minutes."
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
              description="Free online counselling for under 25s. Sign up and chat anonymously with a counsellor."
              contact="https://www.kooth.com"
              contactLabel="kooth.com"
              cta="https://www.kooth.com"
              ctaText="Get started"
            />
          </div>
        </FloatingSection>

        {/* Section B: Money & Finances */}
        <FloatingSection
          id="money-finances"
          eyebrow="Section B"
          title="Money and Finances"
          intro="Leaving the academy often means losing income and stability. Understanding your rights and options puts power back in your hands."
          glow="lime"
        >
          <div className="support-cards-grid">
            <SupportCard
              icon="💷"
              title="Benefits you are entitled to"
              description="Universal Credit, Housing Benefit, and council tax support. If you are struggling, you likely qualify. There is no shame in claiming what is yours."
            />
            <SupportCard
              icon="💳"
              title="Budgeting and debt"
              description="Learn to manage money month by month, understand credit, and get help if you are in debt."
            />
            <SupportCard
              icon="📈"
              title="Saving and longer-term planning"
              description="Even small savings feel good. Building habits now sets you up for the future."
            />
            <SupportCard
              icon="🎓"
              title="Funding further education"
              description="Student finance, grants, and scholarships. Ways to fund your next steps that do not leave you broke."
            />
          </div>
          <div className="resources-grid">
            <ResourceCard
              name="StepChange"
              description="Free debt advice and budgeting support. Confidential and free of judgement."
              contact="https://www.stepchange.org"
              contactLabel="stepchange.org"
              cta="https://www.stepchange.org"
              ctaText="Get debt help"
            />
            <ResourceCard
              name="Citizens Advice"
              description="Benefits advice, housing support, and money guidance, all free."
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
        </FloatingSection>

        {/* Section C: Feelings & Identity */}
        <FloatingSection
          id="feelings-identity"
          eyebrow="Section C"
          title="Feelings and Identity"
          intro="When football was your whole identity and it is suddenly gone, grieving that loss is healthy and real. You are more than one sport."
          glow="coral"
        >
          <div className="support-cards-grid">
            <SupportCard
              icon="💔"
              title="Grief and loss"
              description="Leaving the academy can feel like losing a loved one. Allow yourself to feel it, then find what comes next."
            />
            <SupportCard
              icon="🔍"
              title="Finding yourself beyond football"
              description="What else makes you tick? What did you love before football? Now is the time to reconnect with that."
            />
            <SupportCard
              icon="👁️"
              title="Body image and comparison"
              description="Athletes often struggle with how their body feels after competition ends. That is normal, and worth talking about."
            />
          </div>
          <div className="resources-grid">
            <ResourceCard
              name="UK Youth"
              description="Youth groups and activities near you. Explore new interests and make new friends."
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
        </FloatingSection>

        {/* Section D: Work & Your Future */}
        <FloatingSection
          id="work-future"
          eyebrow="Section D"
          title="Work and Your Future"
          intro="Your academy training taught you discipline, teamwork, and how to handle pressure. Those skills translate to every career path."
          glow="teal"
        >
          <div className="support-cards-grid">
            <SupportCard
              icon="📄"
              title="CV writing and job searching"
              description="Turn your academy experience into a winning CV. Employers respect athletes, so position yourself right."
            />
            <SupportCard
              icon="🤝"
              title="Interview skills"
              description="Talking about yourself in an interview feels strange. But you have done pressured performances, and this is the same."
            />
            <SupportCard
              icon="🏢"
              title="Apprenticeships and training"
              description="Earn while you learn. Apprenticeships are a real alternative to university: respected, practical, and well paid."
            />
            <SupportCard
              icon="🎯"
              title="Finding work you actually like"
              description="Not just any job, but work that makes you feel like you are building something."
            />
          </div>
          <div className="resources-grid">
            <ResourceCard
              name="National Careers Service"
              description="Free careers advice by phone, online, or in person. Explore options and get CV help."
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
              description="One of the UK's biggest job boards. Search by location, industry, or interest."
              contact="https://www.reed.co.uk"
              contactLabel="reed.co.uk"
              cta="https://www.reed.co.uk"
              ctaText="Browse jobs"
            />
          </div>
        </FloatingSection>

        {/* Section E: Football Exits */}
        <FloatingSection
          id="football-exits"
          eyebrow="Section E"
          title="Football Exits"
          intro="Whether you are being released, considering your options, or dealing with injury, understanding your rights and next steps matters."
          glow="lime"
        >
          <div className="support-cards-grid">
            <SupportCard
              icon="⚖️"
              title="Your rights and the academy release process"
              description="Know what you are owed, what notices must be given, and when. You have rights, so use them."
            />
            <SupportCard
              icon="🤵"
              title="Agents, contracts, and negotiations"
              description="If you are moving clubs or going semi-pro, understand what is fair. Do not sign anything without advice."
            />
            <SupportCard
              icon="⚽"
              title="Non-league, semi-pro, and step football"
              description="Continuing to play at lower levels is a real option. Earn some money, keep playing, and build a different life."
            />
            <SupportCard
              icon="🏥"
              title="Injury and returning to football"
              description="A career-ending injury is traumatic. Support exists: counselling, rehab options, and paths forward."
            />
          </div>
          <div className="resources-grid">
            <ResourceCard
              name="Professional Footballers Association"
              description="The union for footballers. Advice on contracts, releases, and player rights."
              contact="https://www.thepfa.com"
              contactLabel="thepfa.com"
              cta="https://www.thepfa.com"
              ctaText="Contact the PFA"
            />
            <ResourceCard
              name="The Non-League Pyramid"
              description="Guide to England's step system: clubs, competitions, and how to join."
              contact="https://www.nonleaguematters.co.uk"
              contactLabel="nonleaguematters.co.uk"
              cta="https://www.nonleaguematters.co.uk"
              ctaText="Explore the pyramid"
            />
            <ResourceCard
              name="Step Change"
              description="Legal advice on contracts and negotiation. Often free or low cost."
              contact="https://www.stepchange.org"
              contactLabel="stepchange.org"
              cta="https://www.stepchange.org"
              ctaText="Get legal help"
            />
          </div>
        </FloatingSection>

        {/* Section F: Community & Mates */}
        <FloatingSection
          id="community-meets"
          eyebrow="Section F"
          title="Community and Mates"
          intro="You are not the only one going through this. Thousands of young people have walked this path. Connecting with them changes everything."
          glow="coral"
        >
          <div className="support-cards-grid">
            <SupportCard
              icon="👥"
              title="Peer support communities"
              description="Online and local groups where you can share your story, ask questions, and hear other journeys without judgement."
            />
            <SupportCard
              icon="🎤"
              title="Open discussion events"
              description="Monthly sessions where young people talk openly about release, careers, identity, and life after the academy."
            />
            <SupportCard
              icon="⚽"
              title="Grassroots and local clubs"
              description="Keep playing at a level that works for you. Grassroots football is where the community is."
            />
            <SupportCard
              icon="🤝"
              title="Mentoring circles"
              description="Pair up with someone further along the journey. Get advice, share wins, and stay accountable."
            />
          </div>
          <div className="resources-grid">
            <ResourceCard
              name="Football Beyond the Academy Network"
              description="A direct community of released academy players. Share experiences and stay connected."
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
              description="Youth clubs and activities. Meet new people and build community beyond football."
              contact="https://www.ukyouth.org"
              contactLabel="ukyouth.org"
              cta="https://www.ukyouth.org"
              ctaText="Find a group"
            />
          </div>
        </FloatingSection>

        {/* Section G: Life After the Academy */}
        <FloatingSection
          id="life-after"
          eyebrow="Section G"
          title="Life After the Academy"
          intro="The academy system is not the only route to a good life. Thousands of players have built something real after release, and you can too."
          glow="teal"
        >
          <div className="support-cards-grid">
            <SupportCard
              icon="🏆"
              title="Non-league and the freedom player market"
              description="Step football is competitive, community driven, and sometimes paid. You can still play the game you love at a level that fits your life."
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
              description="Hearing from people who have walked the same road, and built something great anyway, makes the next step feel possible."
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
              description="Clubs, leagues, and trials across England's step football pyramid. Still playing, just at a different level."
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
              description="University and college applications. Search sports science, coaching, business, and your next chapter."
              contact="https://www.ucas.com"
              contactLabel="ucas.com"
              cta="https://www.ucas.com"
              ctaText="Browse courses"
            />
          </div>
        </FloatingSection>

        {/* Section H: Substance Awareness */}
        <FloatingSection
          id="substance-awareness"
          eyebrow="Section H"
          title="Substance Awareness"
          intro="Leaving sport means losing structure, identity, and community. Some people turn to substances to cope. This is about facts, not fear."
          glow="lime"
        >
          <div className="support-cards-grid">
            <SupportCard
              icon="🔬"
              title="The science behind substance use"
              description="Why people use: stress, loss, peer pressure, self-medication. Understanding it helps you recognise it in yourself."
            />
            <SupportCard
              icon="⚠️"
              title="Spotting addiction"
              description="Using more than planned, hiding use, losing interest in other things. If these sound familiar, that is a sign to reach out."
            />
            <SupportCard
              icon="💪"
              title="Getting help without shame"
              description="Addiction is a health issue, not a moral failure. Treatment works, and you can recover."
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
              description="Honest, judgement-free information about every drug. Chat online or call."
              contact="tel:0300123625"
              contactLabel="Call 0300 123 6600"
              cta="https://www.talktofrank.com"
              ctaText="Chat online"
            />
            <ResourceCard
              name="We Are With You"
              description="Free support for substance use issues: counselling, groups, and treatment options."
              contact="https://www.wearewithyou.org.uk"
              contactLabel="wearewithyou.org.uk"
              cta="https://www.wearewithyou.org.uk"
              ctaText="Get support"
            />
            <ResourceCard
              name="Alcoholics Anonymous"
              description="Twelve-step support for alcohol use. Free, confidential meetings nationwide."
              contact="https://www.alcoholics-anonymous.org.uk"
              contactLabel="alcoholics-anonymous.org.uk"
              cta="https://www.alcoholics-anonymous.org.uk"
              ctaText="Find a meeting"
            />
            <ResourceCard
              name="Narcotics Anonymous"
              description="Recovery support for all drug use. Peer led, free, and confidential."
              contact="https://www.ukna.org"
              contactLabel="ukna.org"
              cta="https://www.ukna.org"
              ctaText="Get started"
            />
          </div>
        </FloatingSection>

        {/* Section I: Grooming Awareness */}
        <FloatingSection
          id="grooming-awareness"
          eyebrow="Section I"
          title="Grooming Awareness"
          intro="Grooming is how adults build trust with young people to exploit them. Knowing the signs helps you protect yourself and your friends."
          glow="coral"
        >
          <div className="support-cards-grid">
            <SupportCard
              icon="🚩"
              title="What grooming looks like"
              description="An adult building a special relationship with a young person, giving gifts, isolating them from others, then exploiting them. It happens online and in person."
            />
            <SupportCard
              icon="📱"
              title="Online grooming signs"
              description="Asking to move to private chat, asking for photos, age-inappropriate questions, requesting your location, or wanting to keep secrets."
            />
            <SupportCard
              icon="⚽"
              title="Grooming in sport"
              description="Coaches or adults in football using authority to isolate you, demand secrecy, or push boundaries. That is not coaching, that is abuse."
            />
            <SupportCard
              icon="💬"
              title="If you think someone is being groomed"
              description="Talk to them without judgement. Report it to the organisations listed below. You are helping to protect them."
            />
          </div>
          <div className="resources-grid">
            <ResourceCard
              name="NSPCC"
              description="Free, confidential advice if you are being abused or worried about someone. They handle reports sensitively."
              contact="tel:08088005000"
              contactLabel="Call 0808 800 5000"
              cta="https://www.nspcc.org.uk"
              ctaText="Get help"
            />
            <ResourceCard
              name="Childline"
              description="Free, confidential chat or call for young people under 19. Available any time of day or night."
              contact="tel:08001111"
              contactLabel="Call 0800 1111"
              cta="https://www.childline.org.uk"
              ctaText="Chat online"
            />
            <ResourceCard
              name="CEOP"
              description="Report grooming, sexual abuse, or exploitation online. Police run, and serious about keeping you safe."
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
              ctaText="Report a concern"
            />
          </div>
        </FloatingSection>

        {/* Section J: Local Mentor Access */}
        <FloatingSection
          id="local-mentors"
          eyebrow="Section J"
          title="Local Mentor Access"
          intro="A mentor is someone further along who believes in you, listens without judgement, and helps you find your next steps. Having one changes lives."
          glow="teal"
        >
          <div className="support-cards-grid">
            <SupportCard
              icon="👤"
              title="What mentoring is"
              description="A trusted adult who has been through something similar. You meet regularly, talk openly, and they help you solve problems your own way."
            />
            <SupportCard
              icon="🎯"
              title="Why mentors matter"
              description="Having someone in your corner who believes in you, especially after a loss like release, gives you hope and direction."
            />
            <SupportCard
              icon="🏘️"
              title="Finding a mentor"
              description="Through youth clubs, schools, mentoring programmes, or community organisations. Most are free or low cost."
            />
          </div>
          <div className="resources-grid">
            <ResourceCard
              name="UK Youth"
              description="Youth clubs and mentoring programmes across the UK. Free and accessible."
              contact="https://www.ukyouth.org"
              contactLabel="ukyouth.org"
              cta="https://www.ukyouth.org"
              ctaText="Find your local club"
            />
            <ResourceCard
              name="National Youth Agency"
              description="A directory of youth services. Find mentoring, support, and activities near you."
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
              description="Support and mentoring for young people aged 13 to 30. Builds confidence and careers."
              contact="https://www.princes-trust.org.uk"
              contactLabel="princes-trust.org.uk"
              cta="https://www.princes-trust.org.uk"
              ctaText="Explore support"
            />
          </div>
        </FloatingSection>

        {/* Section K: Leadership & Giving Back */}
        <FloatingSection
          id="leadership"
          eyebrow="Section K"
          title="Leadership and Giving Back"
          intro="You have more to give than you realise. Stepping into leadership, mentoring others, volunteering, and building community changes both them and you."
          glow="lime"
        >
          <div className="leadership-subsections">
            <GlassCard as="article" className="leadership-sub" interactive>
              <h3 className="leadership-sub__title">🔵 Be a Captain</h3>
              <p className="leadership-sub__desc">
                Leadership starts before you get the armband. Showing up, supporting your teammates, and speaking honestly: that is what a captain does, on the pitch and off it. Whether you are leading a grassroots team or mentoring younger players, you are showing them what is possible.
              </p>
              <a href="https://www.thepfa.com/leadership" target="_blank" rel="noopener noreferrer" className="leadership-cta">
                Explore PFA leadership programmes
              </a>
            </GlassCard>

            <GlassCard as="article" className="leadership-sub" interactive>
              <h3 className="leadership-sub__title">🤝 Volunteer Locally</h3>
              <p className="leadership-sub__desc">
                Give your time to your community. Coach grassroots clubs, help at food banks, and run youth programmes. Work that pays nothing in money but everything in purpose, and it looks incredible on a CV.
              </p>
              <a href="https://www.do-it.org" target="_blank" rel="noopener noreferrer" className="leadership-cta">
                Find volunteering near you
              </a>
            </GlassCard>

            <GlassCard as="article" className="leadership-sub" interactive>
              <h3 className="leadership-sub__title">🧑‍🏫 Mentor the Next Generation</h3>
              <p className="leadership-sub__desc">
                You have been through release, pressure, and disappointment. Younger kids will face the same. Seeing yourself in them and sharing what you have learned is real mentorship. You do not need formal training. You just need to show up.
              </p>
              <a href="https://www.ukyouth.org" target="_blank" rel="noopener noreferrer" className="leadership-cta">
                Start mentoring
              </a>
            </GlassCard>

            <GlassCard as="article" className="leadership-sub" interactive>
              <h3 className="leadership-sub__title">🏘️ Build Your Community</h3>
              <p className="leadership-sub__desc">
                Small acts of service create lasting change. Organising a local kickabout, starting a support group for released players, and creating space for young people to be heard is what builds community. And that is leadership.
              </p>
              <a href="https://www.vinspired.com" target="_blank" rel="noopener noreferrer" className="leadership-cta">
                Explore community projects
              </a>
            </GlassCard>
          </div>

          <div className="resources-grid resources-grid--spaced">
            <ResourceCard
              name="Do-it.org"
              description="A volunteer database for the UK. Browse opportunities by location, cause, or time commitment."
              contact="https://www.do-it.org"
              contactLabel="do-it.org"
              cta="https://www.do-it.org"
              ctaText="Find volunteering"
            />
            <ResourceCard
              name="Vinspired"
              description="Volunteering opportunities for young people. Build skills, make a difference, and have fun."
              contact="https://www.vinspired.com"
              contactLabel="vinspired.com"
              cta="https://www.vinspired.com"
              ctaText="Browse opportunities"
            />
            <ResourceCard
              name="FA Volunteer Coaching"
              description="Train as a grassroots coach. Give back to the game and build a career."
              contact="https://www.theFA.com"
              contactLabel="theFA.com"
              cta="https://www.theFA.com"
              ctaText="Learn to coach"
            />
            <ResourceCard
              name="Grassroots Football Association"
              description="Get involved in grassroots as a coach, official, volunteer, or community builder."
              contact="https://www.grassrootsfa.org"
              contactLabel="grassrootsfa.org"
              cta="https://www.grassrootsfa.org"
              ctaText="Get involved"
            />
          </div>
        </FloatingSection>

        {/* Supportive reminder + crisis signposting */}
        <FloatingSection
          id="if-you-need-help-now"
          eyebrow="A gentle reminder"
          title="If you need help right now"
          intro="This page is here for guidance and support, not as a substitute for professional or medical advice. If you are in crisis or worried about your safety, please reach out now. You deserve support, and help is always available."
          glow="coral"
        >
          <div className="resources-grid">
            <ResourceCard
              name="Samaritans"
              description="Free and confidential, any time of day or night, whatever you are going through."
              contact="tel:116123"
              contactLabel="Call 116 123 (free, any time)"
              cta="https://www.samaritans.org"
              ctaText="Visit Samaritans"
            />
            <ResourceCard
              name="CALM"
              description="The Campaign Against Living Miserably. A helpline and webchat for anyone who is struggling."
              contact="tel:0800585858"
              contactLabel="Call 0800 58 58 58"
              cta="https://www.thecalmzone.net"
              ctaText="Visit CALM"
            />
            <ResourceCard
              name="Shout"
              description="Text SHOUT to 85258 for free crisis support. A trained volunteer will text you back."
              contact="https://www.shoutcrisis.org"
              contactLabel="Text SHOUT to 85258"
              cta="https://www.shoutcrisis.org"
              ctaText="Learn more"
            />
            <ResourceCard
              name="Emergency services"
              description="If you or someone else is in immediate danger, call 999 straight away."
              contact="tel:999"
              contactLabel="Call 999 (emergency)"
            />
          </div>
        </FloatingSection>

        <NextStep
          eyebrow="When you're ready"
          title="No rush. The next step will still be there tomorrow."
          line="When it feels right, have a look at where other players landed, or start mapping your own route."
          primary={{ to: '/success-stories', label: 'Read player stories' }}
          secondary={{ to: '/pathway', label: 'Explore your pathway' }}
        />
      </div>
    </SiteLayout>
  )
}
