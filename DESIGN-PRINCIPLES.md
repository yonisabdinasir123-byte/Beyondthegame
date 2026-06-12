# Beyond the Game — Design Principles

This document governs all design and copy decisions on the platform.
All future work inherits these rules. Where a rule conflicts with a
feature idea, the rule wins.

**Who we design for:** users aged 16–22, UK-based, possibly low digital
literacy, possibly in emotional distress, reading age ~12. Max 2–3
sentences per text block. UK English, £, DD/MM/YYYY. Low-context
language: direct, literal, no idioms.

**The service is 100% free.** No payment, subscription, or paywall UI of
any kind, ever.

---

## 1. Visual system

- Light amber/cream palette tokens from `src/App.css :root` — `--bg #FFFBF5`,
  `--amber-50…900`, `--text-primary #1C1009`, `--text-secondary`, `--text-muted`.
  Reuse tokens; never hard-code new colours.
- Barlow body, Playfair Display headings, Barlow Condensed for stats/labels.
- One shared header/footer site-wide (`SiteLayout`). Sticky sub-navs sit at
  `top: var(--header-height)`; scroll offsets use `--header-height` +
  `--subheader-height`.
- Gestalt: ONE focal point per screen. Card grids use `align-items: stretch`,
  1.5rem gap, CTAs pinned with `margin-top: auto`.

## 2. Fogg prompt taxonomy (`src/components/PromptCard.jsx`)

Behaviour = Motivation × Ability × Prompt. Match the prompt to the user state:

| Type | User state | Use | Example placement |
|---|---|---|---|
| `facilitator` | high motivation, low ability | make it easier: restore drafts, pre-fill, tappable cards | CV builder "your answers are saved" |
| `spark` | high ability, low motivation | ignite: stories → one next step | after Peer Voices, after Player Stories |
| `signal` | high motivation, high ability | point at the action | goal-matched section prompts |

Rules:
- One prompt = ONE action. Never compete two CTAs in a prompt.
- Chain behaviours: every completion state offers the natural next step
  (story → pathway → goal → apply).
- Prompts are `role="note"`; dynamically appearing prompts use
  `aria-live="polite"`.
- **The Support page carries no prompts.** Users there may be in distress;
  it stays calm, slow, and free of persuasion pressure.

## 3. Goal gradient system (`src/utils/goal.js`, `src/components/GoalSystem.jsx`)

- Users pick ONE goal from four tappable cards (no typing). Stored as
  `btg:goal`. "Not now" is remembered (`btg:goal-skipped`) — the full
  picker never re-opens uninvited; only a quiet chip remains.
- Milestones are **derived from real usage signals** (postcode set, CV
  drafted, contact added…) — the progress bar never lies and never
  shows checkbox theatre.
- Near completion (one step left) the bar visually warms — effort
  accelerates near the goal. Completion celebrates once, then chains.
- Core motivators every feature must feed: PROGRESS, MASTERY, CONTROL.
- The mood board (`MoodBoard.jsx`) is reflective design: users assemble
  the identity they're building. Tap-first, ▲▼ keyboard reorder, drag as
  enhancement only.

## 4. Framing rules (Prospect Theory)

- Always gain-framed: "Build your future", never "Don't get left behind".
- Same true number, hope-first label: "98% build their future beyond the
  pitch", not "98% never make it".
- Anchoring: the first option in any list is the one most users need —
  order lists deliberately.
- Priming: pages open with progression language and imagery BEFORE any
  decision point.
- Real deadlines only (trial dates, application windows) — see §6.

## 5. Cialdini implementation map

| Principle | Where it lives |
|---|---|
| Reciprocity | "100% free" in hero badge, CTA band, signup — value given before anything is asked |
| Commitment | User's own goal reflected back ("My goal: ⚽ Find a Club") everywhere |
| Social proof | Peer stories carousel; ratings/endorsement components populate as data arrives |
| Liking | Peer voices, "their words, not ours", relatable UK language |
| Authority | PFA / BPS / FA links with credentials named; expert-created content labelled |
| Scarcity | TRUTHFUL ONLY — see §6 |

## 6. Scarcity & urgency — hard rules

- Allowed: real, verifiable time bounds. "Trial registration closes
  Friday 20 June — clubs run this once a season."
- Banned: manufactured urgency ("HURRY! 2 spots left!!"), countdown
  theatrics on non-deadlines, doom copy of any kind.
- Tone stays gain-framed even when time-bound: what they gain by acting,
  never what they lose by waiting.

## 7. No dark patterns — hard ethical rules

- NO confirm-shaming. Declining is a plain, equal-dignity action
  ("Not now"), never a humiliation ("No thanks, I don't want a future").
- NO fake scarcity, engagement traps, infinite scroll, or hyperbolic
  discounting tricks.
- Protective warnings are allowed when HONEST: warn before leaving only
  while work would genuinely be lost. Where work auto-saves (CV draft),
  no warning is shown — protection beats interruption.
- Error recovery: plain language, fix stated, never blame, input never
  cleared. "Your answers are saved — please try again."
- Persuasion serves the user's own stated goal, never the platform's.

## 8. Norman's three levels

- **Visceral:** warm tokens, clean cards, quality affordances — trust
  before a word is read.
- **Behavioural:** every action gives feedback. State changes announced
  (`aria-live="polite"`); optional `navigator.vibrate(10)` on goal set,
  milestone, submission — always a graceful no-op; sound off by default;
  none of these is ever the sole carrier of information.
- **Reflective (most emphasis):** the platform means "I'm someone
  building my future" — goal language, mood board, peer stories,
  leadership content all feed identity.

Short-lived emotions are action windows: completion and story moments
immediately offer one next step while the feeling is live.

## 9. Accessibility (POUR) — non-negotiable

- 44px minimum tap targets. Keyboard operability for everything.
- CVD-safe: state shown by icon + text + colour, never colour alone.
- All dynamic prompts/progress announced via `aria-live="polite"`.
- `prefers-reduced-motion` disables celebrations and smooth scrolling.
- Gestures (swipe, drag) ALWAYS have button fallbacks.
- Error-tolerant inputs; reading age ~12; no idioms.

## 10. Sustainable HCI

- Lean pages: emoji over image assets where meaning allows; no
  autoplaying media; no wasteful animation.
- Native browser capabilities first (CSS scroll-snap over JS carousels).
- Evergreen content structure; localStorage preference memory so users
  get what they need and get on with life.
- Web-first, app-portable: no hover-only functionality, touch-first,
  PWA-compatible patterns.
