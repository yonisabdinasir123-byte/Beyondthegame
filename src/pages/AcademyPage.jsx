/**
 * AcademyPage.jsx — "Beyond the Academy" support page.
 *
 * This is a page WITHIN the Beyond the Game site. It reuses the shared site
 * header + footer (and auth modals) via <SiteLayout>, and renders its own
 * editorial sports-brand body styled entirely under `.academy-scope`
 * (see AcademyPage.css) so nothing leaks into the rest of the app.
 */
import { useEffect, useRef } from 'react'
import SiteLayout from '../components/SiteLayout'
import './AcademyPage.css'

/* Animated stat counter — counts up when scrolled into view. */
function useCounters(rootRef) {
  useEffect(() => {
    const root = rootRef.current
    if (!root || typeof IntersectionObserver === 'undefined') return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const els = root.querySelectorAll('.aca-stat-block__num[data-target]')

    if (reduce) {
      els.forEach(el => {
        const t = parseInt(el.dataset.target || '0', 10)
        if (t) el.textContent = t.toLocaleString('en-GB') + (el.dataset.suffix || '')
      })
      return
    }

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        const el = entry.target
        const target = parseInt(el.dataset.target || '0', 10)
        const suffix = el.dataset.suffix || ''
        if (!target) return
        obs.unobserve(el)
        const duration = 1600
        let startTime = null
        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4)
        const step = (ts) => {
          if (!startTime) startTime = ts
          const progress = Math.min((ts - startTime) / duration, 1)
          const val = Math.round(easeOutQuart(progress) * target)
          el.textContent = val.toLocaleString('en-GB') + suffix
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      })
    }, { threshold: 0.5 })

    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [rootRef])
}

export default function AcademyPage() {
  const rootRef = useRef(null)
  useCounters(rootRef)

  return (
    <SiteLayout>
      <div className="academy-scope" ref={rootRef}>

        {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
        <section className="aca-hero" id="aca-hero" aria-labelledby="aca-hero-headline">
          <div className="aca-hero-pitch" aria-hidden="true" />
          <div className="aca-hero-glow" aria-hidden="true" />
          <div className="aca-inner aca-hero-content">
            <div className="aca-hero-kicker">UK Football Academy Reality Check</div>
            <h1 className="aca-hero-headline" id="aca-hero-headline">
              The game<br />
              <em>doesn&rsquo;t end</em><br />
              at release.
            </h1>
            <p className="aca-hero-sub">
              Whether you&rsquo;re climbing the non-league pyramid or figuring out what
              comes next, you are not defined by what a club decided when you were 16.
              This is your resource.
            </p>
            <div className="aca-hero-actions">
              <a href="#aca-pyramid" className="aca-btn aca-btn--lime">See the pathway →</a>
              <a href="#aca-support" className="aca-btn aca-btn--outline">Find support</a>
            </div>

            <div className="aca-hero-stats" aria-label="Academy statistics">
              <div className="aca-stat-block">
                <span className="aca-stat-block__num" data-target="10000">10,000</span>
                <span className="aca-stat-block__label">boys in UK academies<br />at any one time</span>
              </div>
              <div className="aca-stat-block">
                <span className="aca-stat-block__num">&lt;200</span>
                <span className="aca-stat-block__label">turn professional<br />each year</span>
              </div>
              <div className="aca-stat-block">
                <span className="aca-stat-block__num">98%</span>
                <span className="aca-stat-block__label">need a plan<br />beyond pro football</span>
              </div>
              <div className="aca-stat-block">
                <span className="aca-stat-block__num" style={{ color: 'var(--aca-amber)' }}>5 Divisions</span>
                <span className="aca-stat-block__label">Jake Tabor&rsquo;s leap from<br />non-league to Swindon Town</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. PYRAMID ──────────────────────────────────────────────────── */}
        <section className="aca-section aca-section--alt" id="aca-pyramid" aria-labelledby="aca-pyramid-heading">
          <div className="aca-inner">
            <span className="aca-eyebrow">The route up</span>
            <h2 className="aca-title" id="aca-pyramid-heading">Non-League to <em>Professional</em></h2>
            <p className="aca-lead">The English football pyramid has more than 24 levels. Professional football is at the top — but there are routes all the way up, and real players use them every season.</p>

            <div className="aca-pyramid-layout">
              <div>
                <div className="aca-pyramid-steps" role="list" aria-label="Football pyramid steps">

                  <div className="aca-pyr-step" role="listitem">
                    <span className="aca-pyr-step__level">Step 5</span>
                    <div className="aca-pyr-step__bar aca-pyr-step__bar--s5" />
                    <div className="aca-pyr-step__info">
                      <div className="aca-pyr-step__name">Combined Counties / Regional Step 5</div>
                      <div className="aca-pyr-step__detail">Where Jake Tabor scored 127 goals in 91 games at Amersham Town</div>
                    </div>
                    <div className="aca-pyr-step__badge">Tabor starts here</div>
                  </div>

                  <div className="aca-pyr-step" role="listitem">
                    <span className="aca-pyr-step__level">Step 4</span>
                    <div className="aca-pyr-step__bar aca-pyr-step__bar--s4" />
                    <div className="aca-pyr-step__info">
                      <div className="aca-pyr-step__name">Southern / Northern / Isthmian Premier</div>
                      <div className="aca-pyr-step__detail">Scouts increasingly active at this level. Semi-professional wages begin.</div>
                    </div>
                  </div>

                  <div className="aca-pyr-step" role="listitem">
                    <span className="aca-pyr-step__level">Step 3</span>
                    <div className="aca-pyr-step__bar aca-pyr-step__bar--s3" />
                    <div className="aca-pyr-step__info">
                      <div className="aca-pyr-step__name">Division One South/North</div>
                      <div className="aca-pyr-step__detail">Full-time or near-full-time football. Regular TV and streaming coverage begins.</div>
                    </div>
                  </div>

                  <div className="aca-pyr-step aca-pyr-step--highlight" role="listitem">
                    <span className="aca-pyr-step__level">Step 2</span>
                    <div className="aca-pyr-step__bar aca-pyr-step__bar--s2" />
                    <div className="aca-pyr-step__info">
                      <div className="aca-pyr-step__name">National League North/South</div>
                      <div className="aca-pyr-step__detail">Joshua Osude: Bishop&rsquo;s Stortford → Hashtag United → Woking → Forest Green Rovers 2026</div>
                    </div>
                    <div className="aca-pyr-step__badge">Osude route</div>
                  </div>

                  <div className="aca-pyr-step aca-pyr-step--highlight" role="listitem">
                    <span className="aca-pyr-step__level">Step 1</span>
                    <div className="aca-pyr-step__bar aca-pyr-step__bar--s1" />
                    <div className="aca-pyr-step__info">
                      <div className="aca-pyr-step__name">National League</div>
                      <div className="aca-pyr-step__detail">92nd league club just one promotion away. Jamie Vardy played at Step 4 age 23.</div>
                    </div>
                    <div className="aca-pyr-step__badge" style={{ background: 'var(--aca-amber)', color: '#000' }}>Hot zone</div>
                  </div>

                  <div className="aca-pyr-step" role="listitem">
                    <span className="aca-pyr-step__level">EFL</span>
                    <div className="aca-pyr-step__bar aca-pyr-step__bar--prem" />
                    <div className="aca-pyr-step__info">
                      <div className="aca-pyr-step__name">EFL League Two → Championship → Premier League</div>
                      <div className="aca-pyr-step__detail">Jake Tabor signed his first professional contract with Swindon Town (League One) in 2025 — a five-division leap.</div>
                    </div>
                    <div className="aca-pyr-step__badge" style={{ background: '#fff', color: '#000' }}>Pro football</div>
                  </div>

                </div>
              </div>

              <div>
                <div className="aca-pyramid-callout">
                  <div className="aca-pyramid-callout__title">Jake Tabor&rsquo;s story</div>
                  <div className="aca-pyramid-callout__body">
                    Wycombe Wanderers told Jake Tabor he wasn&rsquo;t good enough. He dropped to Step 5 and proved them wrong — <strong>127 goals in 91 games</strong> for Amersham Town in the Combined Counties League. In 2025, Swindon Town signed him to his first professional contract, leaping five divisions in a single move.<br /><br />
                    Tabor didn&rsquo;t wait for a club to believe in him. He went and made it impossible for them not to.
                  </div>
                </div>

                <div className="aca-key-stat">
                  <div className="aca-key-stat__num">127</div>
                  <div className="aca-key-stat__text">goals in 91 non-league games for Jake Tabor — the form that earned his professional contract</div>
                </div>

                <div className="aca-key-stat">
                  <div className="aca-key-stat__num">23</div>
                  <div className="aca-key-stat__text">the age Jamie Vardy was playing non-league football at Stocksbridge Park Steels, Step 4, before going on to win the Premier League with Leicester City</div>
                </div>

                <div className="aca-scout-box">
                  <p><strong>What scouts look for:</strong> consistency, goals or assists per 90, professionalism, and a player who performs under pressure week in, week out — regardless of the level. High stats at Step 5 do get noticed.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. PLAYERS WHO MADE THE LEAP ───────────────────────────────── */}
        <section className="aca-section" id="aca-stories" aria-labelledby="aca-stories-heading">
          <div className="aca-inner">
            <span className="aca-eyebrow">Real journeys</span>
            <h2 className="aca-title" id="aca-stories-heading">Players Who <em>Made The Leap</em></h2>
            <p className="aca-lead">Released, dropped down, or written off — these players found routes back through consistency, character, and refusing to accept someone else&rsquo;s ceiling.</p>
            <div className="aca-cards-grid">

              <article className="aca-player-card" aria-label="Jake Tabor">
                <div className="aca-player-card__accent" />
                <div className="aca-player-card__body">
                  <div className="aca-player-card__tags">
                    <span className="aca-tag aca-tag--lime">Step 5 → Pro</span>
                    <span className="aca-tag aca-tag--ghost">Non-League</span>
                  </div>
                  <h3 className="aca-player-card__name">Jake Tabor</h3>
                  <p className="aca-player-card__role">Amersham Town → Swindon Town FC (2025)</p>
                  <p className="aca-player-card__quote">Released by Wycombe. Found his form at Combined Counties level. Scoring stopped being something scouts doubted and became something they couldn&rsquo;t ignore.</p>
                  <div className="aca-player-card__fact">127 goals in 91 non-league games · 5-division pro leap</div>
                </div>
              </article>

              <article className="aca-player-card" aria-label="Joshua Osude">
                <div className="aca-player-card__accent aca-player-card__accent--teal" />
                <div className="aca-player-card__body">
                  <div className="aca-player-card__tags">
                    <span className="aca-tag aca-tag--teal">National League</span>
                    <span className="aca-tag aca-tag--ghost">Step by Step</span>
                  </div>
                  <h3 className="aca-player-card__name">Joshua Osude</h3>
                  <p className="aca-player-card__role">Bishop&rsquo;s Stortford Swifts → Hashtag United → Woking → Forest Green Rovers (2026)</p>
                  <p className="aca-player-card__quote aca-player-card__quote--teal">A journey built one move at a time — using social-media football to raise his profile, then converting online attention into professional contracts.</p>
                  <div className="aca-player-card__fact aca-player-card__fact--teal">Non-League → National League in multiple club steps</div>
                </div>
              </article>

              <article className="aca-player-card" aria-label="Jamie Vardy">
                <div className="aca-player-card__accent aca-player-card__accent--amber" />
                <div className="aca-player-card__body">
                  <div className="aca-player-card__tags">
                    <span className="aca-tag aca-tag--amber">Premier League</span>
                    <span className="aca-tag aca-tag--ghost">Title Winner</span>
                  </div>
                  <h3 className="aca-player-card__name">Jamie Vardy</h3>
                  <p className="aca-player-card__role">Stocksbridge Park Steels → Fleetwood Town → Leicester City</p>
                  <p className="aca-player-card__quote aca-player-card__quote--amber">At 23, he was playing Step 4 non-league football and working in a factory. He became a Premier League title winner, Golden Boot contender, and England international.</p>
                  <div className="aca-player-card__fact aca-player-card__fact--amber">Non-league age 23 → Premier League Golden Boot</div>
                </div>
              </article>

              <article className="aca-player-card" aria-label="Chris Smalling">
                <div className="aca-player-card__accent aca-player-card__accent--coral" />
                <div className="aca-player-card__body">
                  <div className="aca-player-card__tags">
                    <span className="aca-tag aca-tag--coral">England International</span>
                  </div>
                  <h3 className="aca-player-card__name">Chris Smalling</h3>
                  <p className="aca-player-card__role">Maidstone United (Non-League) → Fulham → Manchester United → Roma</p>
                  <p className="aca-player-card__quote aca-player-card__quote--coral">Released by several academies, Smalling built his game in non-league football. He went on to win multiple trophies at Manchester United and represent England internationally.</p>
                  <div className="aca-player-card__fact aca-player-card__fact--coral">Non-League → Manchester United → England</div>
                </div>
              </article>

              <article className="aca-player-card" aria-label="Michail Antonio">
                <div className="aca-player-card__accent" />
                <div className="aca-player-card__body">
                  <div className="aca-player-card__tags">
                    <span className="aca-tag aca-tag--lime">International</span>
                    <span className="aca-tag aca-tag--ghost">Late Developer</span>
                  </div>
                  <h3 className="aca-player-card__name">Michail Antonio</h3>
                  <p className="aca-player-card__role">Tooting &amp; Mitcham (Non-League) → Sheffield Wednesday → West Ham United</p>
                  <p className="aca-player-card__quote">Nobody wanted him at academy level. Playing non-league in South London, he gradually climbed through the leagues on ability and relentless work rate to become a Premier League regular and Jamaica international.</p>
                  <div className="aca-player-card__fact">Non-League → Premier League · Jamaica International</div>
                </div>
              </article>

              <article className="aca-player-card" aria-label="Sekou Koné">
                <div className="aca-player-card__accent aca-player-card__accent--teal" />
                <div className="aca-player-card__body">
                  <div className="aca-player-card__tags">
                    <span className="aca-tag aca-tag--teal">Late Developer</span>
                  </div>
                  <h3 className="aca-player-card__name">Sekou Koné</h3>
                  <p className="aca-player-card__role">Non-League grassroots → professional pathway via persistence and showcases</p>
                  <p className="aca-player-card__quote aca-player-card__quote--teal">Representative of the thousands of players who use showcase games, football agents, and stepping-stone clubs to work their way into professional football from outside the academy system.</p>
                  <div className="aca-player-card__fact aca-player-card__fact--teal">Grassroots → Professional football through consistent performance</div>
                </div>
              </article>

            </div>
          </div>
        </section>

        {/* ── 4. FREEDOM PLAYERS ─────────────────────────────────────────── */}
        <section className="aca-section aca-section--alt" id="aca-freedom" aria-labelledby="aca-freedom-heading">
          <div className="aca-inner">
            <span className="aca-eyebrow">Life after pro football</span>
            <h2 className="aca-title" id="aca-freedom-heading">Ex-Pros Who <em>Chose Freedom</em></h2>
            <p className="aca-lead">Walking away from or leaving professional football isn&rsquo;t failure — for some, it&rsquo;s when their real story starts. These players found something that matched or exceeded what football gave them.</p>

            <div className="aca-freedom-grid">

              <article className="aca-freedom-card" aria-label="Reece Wabara">
                <div className="aca-freedom-card__win">~£34.7m/yr</div>
                <div className="aca-freedom-card__name">Reece Wabara</div>
                <div className="aca-freedom-card__was">Formerly: Manchester City, Ipswich Town</div>
                <p className="aca-freedom-card__body">Founded Manière De Voir, a luxury fashion brand, after leaving professional football. Built it to an estimated £34.7 million annual revenue — using the drive, discipline and network football gave him.</p>
                <div className="aca-freedom-card__tag-row">
                  <span className="aca-tag aca-tag--amber">Entrepreneur</span>
                  <span className="aca-tag aca-tag--ghost">Fashion</span>
                </div>
              </article>

              <article className="aca-freedom-card" aria-label="Jlloyd Samuel">
                <div className="aca-freedom-card__win">12th Tier</div>
                <div className="aca-freedom-card__name">Jlloyd Samuel</div>
                <div className="aca-freedom-card__was">Formerly: Aston Villa, Bolton Wanderers</div>
                <p className="aca-freedom-card__body">Chose to remain in football as a player-manager at the 12th tier of English football. Samuel&rsquo;s story challenges the idea that stepping down is stepping back — leadership, community, and joy on your own terms.</p>
                <div className="aca-freedom-card__tag-row">
                  <span className="aca-tag aca-tag--lime">Player-Manager</span>
                  <span className="aca-tag aca-tag--ghost">Community Football</span>
                </div>
              </article>

              <article className="aca-freedom-card" aria-label="Dominic Ball">
                <div className="aca-freedom-card__win">Mental Health Advocate</div>
                <div className="aca-freedom-card__name">Dominic Ball</div>
                <div className="aca-freedom-card__was">Cambridge United (active) + British Psychological Society</div>
                <p className="aca-freedom-card__body">Ball is vocal about the psychological gap in professional football. As a BPS mental health campaigner while still playing, he works to normalise seeking support — and challenges the culture of silence inside clubs.</p>
                <div className="aca-freedom-card__tag-row">
                  <span className="aca-tag aca-tag--teal">Campaigner</span>
                  <span className="aca-tag aca-tag--ghost">BPS</span>
                </div>
              </article>

              <article className="aca-freedom-card" aria-label="Stuart Ripley">
                <div className="aca-freedom-card__win">Law Degree</div>
                <div className="aca-freedom-card__name">Stuart Ripley</div>
                <div className="aca-freedom-card__was">Formerly: Blackburn Rovers, Southampton — Premier League title winner</div>
                <p className="aca-freedom-card__body">Earned a law degree after retiring from professional football. Ripley is proof that the work ethic that makes a professional footballer can be redirected into any demanding intellectual pursuit.</p>
                <div className="aca-freedom-card__tag-row">
                  <span className="aca-tag aca-tag--amber">Education</span>
                  <span className="aca-tag aca-tag--ghost">Law</span>
                </div>
              </article>

              <article className="aca-freedom-card" aria-label="Robbie Fowler">
                <div className="aca-freedom-card__win">Property Portfolio</div>
                <div className="aca-freedom-card__name">Robbie Fowler</div>
                <div className="aca-freedom-card__was">Formerly: Liverpool, Leeds United — Premier League icon</div>
                <p className="aca-freedom-card__body">Built a multi-property portfolio during and after his playing career — deliberately educating himself in property investment while he had a footballer&rsquo;s income. Now runs a property management business.</p>
                <div className="aca-freedom-card__tag-row">
                  <span className="aca-tag aca-tag--lime">Entrepreneur</span>
                  <span className="aca-tag aca-tag--ghost">Property</span>
                </div>
              </article>

              <article className="aca-freedom-card" aria-label="Luke Steele">
                <div className="aca-freedom-card__win">Meditation &amp; Coaching</div>
                <div className="aca-freedom-card__name">Luke Steele</div>
                <div className="aca-freedom-card__was">Formerly: Manchester United, West Brom, Barnsley</div>
                <p className="aca-freedom-card__body">After retirement, Steele became a mindfulness and performance coach — using skills developed partly through his playing career to help others manage pressure, setbacks, and mental performance.</p>
                <div className="aca-freedom-card__tag-row">
                  <span className="aca-tag aca-tag--teal">Wellbeing</span>
                  <span className="aca-tag aca-tag--ghost">Coaching</span>
                </div>
              </article>

            </div>
          </div>
        </section>

        {/* ── 5. PSYCHOLOGICAL LITERACY COURSES ──────────────────────────── */}
        <section className="aca-section" id="aca-courses" aria-labelledby="aca-courses-heading">
          <div className="aca-inner">
            <span className="aca-eyebrow">Filling the EPPP gap</span>
            <h2 className="aca-title" id="aca-courses-heading">Psychological <em>Literacy</em> Courses</h2>
            <p className="aca-lead">A 2024 Journal of Sports Sciences study found that academy managers report a &ldquo;lack of psychological literacy&rdquo; among coaches and limited EPPP guidance for integrating psychosocial skills. These courses exist to change that.</p>

            <div className="aca-courses-layout">
              <div className="aca-course-list" role="list">

                <article className="aca-course-item" role="listitem" aria-label="Applied Sport Psychology">
                  <div className="aca-course-item__num">Course 01</div>
                  <div className="aca-course-item__title">Applied Sport Psychology (Level 4 Certificate)</div>
                  <div className="aca-course-item__provider">BASES (British Association of Sport and Exercise Sciences)</div>
                  <div className="aca-course-item__desc">Covers mental toughness, performance anxiety, imagery, and self-confidence — directly mapped to the psychosocial skills missing from many academy curricula. Suitable for coaches, players transitioning, and support staff.</div>
                  <div className="aca-course-item__tags">
                    <span className="aca-tag aca-tag--lime">Mental toughness</span>
                    <span className="aca-tag aca-tag--ghost">Coaches</span>
                    <span className="aca-tag aca-tag--ghost">Players</span>
                  </div>
                </article>

                <article className="aca-course-item" role="listitem" aria-label="Youth Mental Health First Aid">
                  <div className="aca-course-item__num">Course 02</div>
                  <div className="aca-course-item__title">Youth Mental Health First Aid (MHFA England)</div>
                  <div className="aca-course-item__provider">MHFA England — endorsed by NHS Health Education England</div>
                  <div className="aca-course-item__desc">A 2-day accredited course equipping coaches, parents, and academy staff to recognise mental health challenges in young players and respond early — addressing the post-release crisis period identified by the BPS.</div>
                  <div className="aca-course-item__tags">
                    <span className="aca-tag aca-tag--teal">Post-release</span>
                    <span className="aca-tag aca-tag--ghost">2 days</span>
                    <span className="aca-tag aca-tag--ghost">Accredited</span>
                  </div>
                </article>

                <article className="aca-course-item" role="listitem" aria-label="FA Psychology in Coaching">
                  <div className="aca-course-item__num">Course 03</div>
                  <div className="aca-course-item__title">Psychology in Football Coaching (FA Coach Education)</div>
                  <div className="aca-course-item__provider">The Football Association (FA) — integrated into UEFA B licence pathway</div>
                  <div className="aca-course-item__desc">Addresses exactly the gap the Journal of Sports Sciences (2024) identified — providing coaches with practical psychological tools, identity development awareness, and strategies for managing player transitions with empathy.</div>
                  <div className="aca-course-item__tags">
                    <span className="aca-tag aca-tag--lime">EPPP aligned</span>
                    <span className="aca-tag aca-tag--ghost">UEFA B</span>
                  </div>
                </article>

                <article className="aca-course-item" role="listitem" aria-label="Career Transition Support">
                  <div className="aca-course-item__num">Course 04</div>
                  <div className="aca-course-item__title">Career Transition &amp; Dual Career Planning</div>
                  <div className="aca-course-item__provider">PFA After Academy — founded by Trent Alexander-Arnold</div>
                  <div className="aca-course-item__desc">Structured support programme helping released players map transferable skills, set identity goals beyond sport, and access networking, mentoring, and educational pathways. Specifically addresses the development gap for players exiting academies.</div>
                  <div className="aca-course-item__tags">
                    <span className="aca-tag aca-tag--amber">PFA endorsed</span>
                    <span className="aca-tag aca-tag--ghost">Transitioning players</span>
                  </div>
                </article>

                <article className="aca-course-item" role="listitem" aria-label="Performance Psychology MSc">
                  <div className="aca-course-item__num">Course 05</div>
                  <div className="aca-course-item__title">MSc Sport &amp; Exercise Psychology</div>
                  <div className="aca-course-item__provider">Loughborough / Leeds Beckett / St Mary&rsquo;s University — HCPC registration pathway</div>
                  <div className="aca-course-item__desc">The BPS recommends that released players have access to at least 3 sessions with an HCPC-registered psychologist. This pathway trains those psychologists — and is an option for former players who want to channel their experience into supporting others.</div>
                  <div className="aca-course-item__tags">
                    <span className="aca-tag aca-tag--teal">HCPC pathway</span>
                    <span className="aca-tag aca-tag--ghost">Academic</span>
                    <span className="aca-tag aca-tag--ghost">For former players</span>
                  </div>
                </article>

              </div>

              <div className="aca-ref-boxes" aria-label="Research references">

                <div className="aca-ref-box">
                  <div className="aca-ref-box__icon">📄</div>
                  <div className="aca-ref-box__label">Academic Research · 2024</div>
                  <div className="aca-ref-box__title">Journal of Sports Sciences — The EPPP Gap</div>
                  <div className="aca-ref-box__body">Academy managers report &ldquo;a lack of psychological literacy&rdquo; among coaching staff, and limited EPPP guidance for integrating psychosocial skills into academy curricula. Players receive technical development but not the mental tools to survive release.</div>
                  <a href="https://www.tandfonline.com/doi/full/10.1080/02640414.2024.2388978" target="_blank" rel="noopener" className="aca-ref-box__link">Read the study →</a>
                </div>

                <div className="aca-ref-box">
                  <div className="aca-ref-box__icon">🤝</div>
                  <div className="aca-ref-box__label">Player Support Initiative</div>
                  <div className="aca-ref-box__title">PFA After Academy — Trent Alexander-Arnold</div>
                  <div className="aca-ref-box__body">A PFA initiative co-founded by Trent Alexander-Arnold bridging the development gap for players leaving academies — covering career transition, mental health, education, and networking. Free to access for eligible players.</div>
                  <a href="https://theafteracademy.thepfa.com/about-the-initiative" target="_blank" rel="noopener" className="aca-ref-box__link">Visit After Academy →</a>
                </div>

                <div className="aca-ref-box">
                  <div className="aca-ref-box__icon">🧠</div>
                  <div className="aca-ref-box__label">BPS Recommendation</div>
                  <div className="aca-ref-box__title">British Psychological Society — Mandated Support</div>
                  <div className="aca-ref-box__body">The BPS calls for mandated psychological support for released academy players — specifically recommending a minimum of 3 sessions with an HCPC-registered psychologist as standard practice upon release, regardless of age or level.</div>
                  <a href="https://www.bps.org.uk" target="_blank" rel="noopener" className="aca-ref-box__link">BPS resources →</a>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ── 6. TRANSFERABLE LIFE SKILLS ────────────────────────────────── */}
        <section className="aca-section aca-section--alt" id="aca-skills" aria-labelledby="aca-skills-heading">
          <div className="aca-inner">
            <span className="aca-eyebrow">Your skills travel with you</span>
            <h2 className="aca-title" id="aca-skills-heading">Build <em>Transferable</em> Life Skills</h2>
            <p className="aca-lead">Discipline, resilience under pressure, teamwork, coachability, early rising, goal-setting — you already have these. These tiles show where they translate and how to build on them.</p>

            <div className="aca-skills-grid">

              <article className="aca-skill-tile" aria-label="Financial Literacy">
                <div className="aca-skill-tile__icon" aria-hidden="true">💷</div>
                <div className="aca-skill-tile__title">Financial Literacy</div>
                <p className="aca-skill-tile__body">Knowing how to manage money, avoid debt traps, and save is a life skill — not just a retirement concern. Several ex-pros have spoken publicly about financial mistakes that eroded career earnings.</p>
                <ul className="aca-skill-tile__bullets" role="list">
                  <li>Open a Lifetime ISA while young (government bonus)</li>
                  <li>Understand tax, NI, and self-employment basics</li>
                  <li>Learn about index funds and compound interest early</li>
                </ul>
              </article>

              <article className="aca-skill-tile" aria-label="Entrepreneurship">
                <div className="aca-skill-tile__icon" aria-hidden="true">🚀</div>
                <div className="aca-skill-tile__title">Entrepreneurship</div>
                <p className="aca-skill-tile__body">Reece Wabara turned Manière De Voir into a £34.7m/yr business. The drive and brand awareness that comes with football — even non-league football — is a real commercial asset.</p>
                <ul className="aca-skill-tile__bullets" role="list">
                  <li>Register a sole trader business (free via HMRC)</li>
                  <li>Start small: social media, clothing, coaching, media</li>
                  <li>Prince&rsquo;s Trust Enterprise Programme (18–30, free)</li>
                </ul>
              </article>

              <article className="aca-skill-tile" aria-label="Personal Brand">
                <div className="aca-skill-tile__icon" aria-hidden="true">📲</div>
                <div className="aca-skill-tile__title">Personal Brand</div>
                <p className="aca-skill-tile__body">Joshua Osude used Hashtag United — a social-media football club — to get noticed. Your football story, your training clips, your personality are content. Documented consistently, they open doors.</p>
                <ul className="aca-skill-tile__bullets" role="list">
                  <li>Post training, matchday, and behind-the-scenes content</li>
                  <li>Build an audience before you need it</li>
                  <li>Use platforms like LinkedIn for off-pitch identity</li>
                </ul>
              </article>

              <article className="aca-skill-tile" aria-label="Education">
                <div className="aca-skill-tile__icon" aria-hidden="true">📚</div>
                <div className="aca-skill-tile__title">Education</div>
                <p className="aca-skill-tile__body">Stuart Ripley earned a law degree after his playing career. Education runs parallel to football — not instead of it. BTECs, A-levels, HNCs, and degrees can all sit alongside non-league football.</p>
                <ul className="aca-skill-tile__bullets" role="list">
                  <li>Many non-league clubs actively support dual careers</li>
                  <li>Open University allows flexible, part-time degrees</li>
                  <li>Apprenticeships combine income with qualification</li>
                </ul>
              </article>

              <article className="aca-skill-tile" aria-label="Leadership">
                <div className="aca-skill-tile__icon" aria-hidden="true">🧭</div>
                <div className="aca-skill-tile__title">Leadership</div>
                <p className="aca-skill-tile__body">Captaining a side, motivating teammates, managing setbacks on the pitch — these are leadership skills that translate directly into management, coaching, teaching, and running a business.</p>
                <ul className="aca-skill-tile__bullets" role="list">
                  <li>Pursue FA coaching badges alongside playing</li>
                  <li>Volunteer-coach youth football in your community</li>
                  <li>CMI Level 3 Award in Management (distance learning)</li>
                </ul>
              </article>

              <article className="aca-skill-tile" aria-label="Networking">
                <div className="aca-skill-tile__icon" aria-hidden="true">🤝</div>
                <div className="aca-skill-tile__title">Networking</div>
                <p className="aca-skill-tile__body">Clubs, coaches, agents, community trusts, charities — every person you meet in football is a potential future connection. The non-league pyramid is small and people remember players who conduct themselves well.</p>
                <ul className="aca-skill-tile__bullets" role="list">
                  <li>Attend PFA After Academy events and workshops</li>
                  <li>Contact community trusts at EFL clubs directly</li>
                  <li>Keep a simple contacts log (try our Networking tracker)</li>
                </ul>
              </article>

            </div>
          </div>
        </section>

        {/* ── 7. WHAT SUPPORT SHOULD LOOK LIKE ───────────────────────────── */}
        <section className="aca-section" id="aca-support" aria-labelledby="aca-support-heading">
          <div className="aca-inner">
            <span className="aca-eyebrow">You deserve proper support</span>
            <h2 className="aca-title" id="aca-support-heading">What Support <em>Should</em> Look Like</h2>
            <p className="aca-lead">Too many players go through release with minimal support. Here&rsquo;s what good support looks like — both inside the academy system and at the moment of release. You have every right to expect this.</p>

            <div className="aca-support-grid">

              <div className="aca-support-col aca-support-col--during" aria-label="Support during academy years">
                <h3 className="aca-support-col__heading">During your academy years</h3>
                <ul className="aca-support-bullets" role="list">
                  <li className="aca-support-bullet"><span className="aca-bullet-dot aca-bullet-dot--teal" aria-hidden="true">✓</span><span><strong>Dedicated welfare officer</strong> — independent of the coaching staff, someone whose job it is to look after your wellbeing, not your performance metrics</span></li>
                  <li className="aca-support-bullet"><span className="aca-bullet-dot aca-bullet-dot--teal" aria-hidden="true">✓</span><span><strong>Dual career planning from age 14</strong> — education, vocational pathways, and fallback plans that run alongside your football development</span></li>
                  <li className="aca-support-bullet"><span className="aca-bullet-dot aca-bullet-dot--teal" aria-hidden="true">✓</span><span><strong>Access to a sport psychologist</strong> — not on an emergency basis, but regularly, to build psychological tools the same way you build technical skills</span></li>
                  <li className="aca-support-bullet"><span className="aca-bullet-dot aca-bullet-dot--teal" aria-hidden="true">✓</span><span><strong>Honest, early communication</strong> — if the club is likely to release you, you should hear it clearly and with enough time to plan, not a day&rsquo;s notice at the end of a season</span></li>
                  <li className="aca-support-bullet"><span className="aca-bullet-dot aca-bullet-dot--teal" aria-hidden="true">✓</span><span><strong>Identity-building beyond football</strong> — activities, interests, and conversations that remind you that who you are is not only about what position you play</span></li>
                  <li className="aca-support-bullet"><span className="aca-bullet-dot aca-bullet-dot--teal" aria-hidden="true">✓</span><span><strong>EPPP-embedded psychosocial curriculum</strong> — as called for by the Journal of Sports Sciences (2024): mental health literacy, resilience tools, and identity work baked into academy education</span></li>
                </ul>
              </div>

              <div className="aca-support-col aca-support-col--after" aria-label="Support when you are released">
                <h3 className="aca-support-col__heading">When you&rsquo;re released</h3>
                <ul className="aca-support-bullets" role="list">
                  <li className="aca-support-bullet"><span className="aca-bullet-dot aca-bullet-dot--coral" aria-hidden="true">✓</span><span><strong>Minimum 3 sessions with an HCPC psychologist</strong> — the BPS recommendation. Release is a grief process. Professional support should be standard, not a bonus.</span></li>
                  <li className="aca-support-bullet"><span className="aca-bullet-dot aca-bullet-dot--coral" aria-hidden="true">✓</span><span><strong>Written transition plan</strong> — routes back into football (trials, agent contacts, non-league links), plus alternative education and employment pathways</span></li>
                  <li className="aca-support-bullet"><span className="aca-bullet-dot aca-bullet-dot--coral" aria-hidden="true">✓</span><span><strong>Contact from PFA After Academy</strong> — the initiative co-founded by Trent Alexander-Arnold provides career transition, networking and mentoring specifically for released players</span></li>
                  <li className="aca-support-bullet"><span className="aca-bullet-dot aca-bullet-dot--coral" aria-hidden="true">✓</span><span><strong>30-day follow-up check</strong> — someone from the releasing club (or a neutral welfare organisation) should check in within a month of release</span></li>
                  <li className="aca-support-bullet"><span className="aca-bullet-dot aca-bullet-dot--coral" aria-hidden="true">✓</span><span><strong>Honest appraisal of what went wrong and what can improve</strong> — release meetings should be constructive, specific, and forward-facing, not just a brief conversation at the end of a corridor</span></li>
                  <li className="aca-support-bullet"><span className="aca-bullet-dot aca-bullet-dot--coral" aria-hidden="true">✓</span><span><strong>Your family&rsquo;s support included</strong> — parents and siblings are often deeply affected by release too. Good clubs acknowledge this and offer guidance for the whole family</span></li>
                </ul>
              </div>

            </div>

            <div className="aca-support-note" role="note">
              <strong>If you&rsquo;ve been released and haven&rsquo;t received this support:</strong> contact the PFA directly at <a href="https://theafteracademy.thepfa.com" target="_blank" rel="noopener">theafteracademy.thepfa.com</a>, or speak to your GP who can refer you to an HCPC-registered psychologist. You do not need to go through this alone, and what you&rsquo;re feeling — grief, anger, confusion — is a completely normal response to a real loss.
            </div>
          </div>
        </section>

        {/* ── 8. CTA ──────────────────────────────────────────────────────── */}
        <section className="aca-cta" id="aca-cta" aria-labelledby="aca-cta-heading">
          <div className="aca-cta-glow" aria-hidden="true" />
          <div className="aca-inner" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <span className="aca-eyebrow" style={{ display: 'block', marginBottom: '1rem' }}>Your next move</span>
            <h2 className="aca-cta-title" id="aca-cta-heading">What happens <em>next</em><br />is up to you.</h2>
            <p className="aca-cta-body">
              Jake Tabor was told he wasn&rsquo;t good enough. He scored 127 goals and proved them wrong. Whatever your situation — still in the pyramid, recently released, or figuring out life after football — there are real people and real resources ready to help you.
            </p>
            <div className="aca-cta-buttons">
              <a href="https://theafteracademy.thepfa.com" target="_blank" rel="noopener" className="aca-btn aca-btn--lime">PFA After Academy →</a>
              <a href="https://www.thefa.com/football-learning" target="_blank" rel="noopener" className="aca-btn aca-btn--outline">FA Coaching Badges</a>
              <a href="https://www.bps.org.uk" target="_blank" rel="noopener" className="aca-btn aca-btn--outline">BPS Mental Health</a>
            </div>
          </div>
        </section>

      </div>
    </SiteLayout>
  )
}
