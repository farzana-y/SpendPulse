## Day 1 — 2026-05-06

**Hours worked:** 0

**What I did:** Received the assignment in the evening. Read through all
requirements carefully. Was not feeling well so focused on understanding
the scope and rested.

**What I learned:** The assignment weighs product thinking and documentation
as heavily as code. DEVLOG, USER_INTERVIEWS, ECONOMICS are major evaluation
criteria.

**Blockers / what I'm stuck on:** Nothing technical yet — planning stack
and architecture.

**Plan for tomorrow:** Choose stack, initialize repo, set up deployment,
scaffold docs.

---

## Day 2 — 2026-05-07

**Hours worked:** 0

**What I did:** Was still unwell. Spent time studying Next.js fundamentals
using ChatGPT — understanding app router, how page.tsx works, client vs
server components, folder structure. Did not write production code but built
enough mental model to start properly the next day.

**What I learned:** Next.js App Router is meaningfully different from Pages
Router. Client components need "use client" directive. Layout files wrap all
child pages automatically.

**Blockers / what I'm stuck on:** No technical blockers — preparation day.

**Plan for tomorrow:** Initialize repo, set up Tailwind + shadcn, build
landing page and audit form, start pricing data research.

---

## Day 3 — 2026-05-08

**Hours worked:** 6

**What I did:** Initialized the repository with Next.js + Tailwind + shadcn.
Built the landing page, audit form with dynamic plan selection based on tool,
localStorage persistence for form state, initial audit recommendation engine,
and the results page. Researched and verified pricing data for Cursor, GitHub
Copilot, Claude, ChatGPT, Gemini, v0 against official vendor pages. Deployed
to Vercel.

**What I learned:** How to structure a Next.js project from scratch. How
localStorage persistence works with useEffect. How to type a dynamic pricing
object in TypeScript.

**Blockers / what I'm stuck on:** Audit engine only handles one tool at a
time — multi-subscription flow not yet built.

**Plan for tomorrow:** Multi-subscription audit flow, CI pipeline, automated
tests, fix ESLint issues.

---

## Day 4 — 2026-05-09

**Hours worked:** 5

**What I did:** Built multi-subscription audit flow with detectOverlaps().
Set up Vitest with 10 automated tests covering generateAudit() and
detectOverlaps(). Added GitHub Actions CI workflow. Fixed ESLint conflicts
around the set-state-in-effect rule. Added verified pricing data for all
tools. Fixed TypeScript indexing errors on the pricing object that were
breaking the Vercel build.

**What I learned:** How to configure Vitest with Next.js. How CI failures
present in GitHub Actions logs — the lint error was obvious once I ran
npm run lint locally. TypeScript requires explicit key casting for dynamic
object indexing.

**Blockers / what I'm stuck on:** ESLint flagging legitimate localStorage
useEffect pattern — resolved by disabling that specific rule.

**Plan for tomorrow:** Add missing tools to form, fix recommendation bug,
redesign UI to dark theme, OpenAI API summary integration.

---

## Day 5 — 2026-05-10

**Hours worked:** 5

**What I did:** Added Windsurf, Anthropic API direct, OpenAI API direct to
pricing.ts and PRICING_DATA.md with verified sources. Fixed critical bug
where results showed "cost-efficient" despite overlap savings — traced it to
generateAudit() only evaluating individual subscriptions not cross-tool
overlaps. Added SpendPulse branding and Navbar component. Redesigned audit
and results pages to dark theme. Wrote DEVLOG, REFLECTION, ARCHITECTURE,
README, METRICS, LANDING_COPY. Was unwell but pushed through.

**What I learned:** Debugging by tracing data flow through localStorage
stage by stage. The recommendation text and savings number were coming from
different places in the code — console.logging each made it obvious.

**Blockers / what I'm stuck on:** Anthropic API key not activating. Switched
to OpenAI API instead. Vercel deployment failing due to TypeScript errors on
pricing object indexing — fixed with keyof typeof casting.

**Plan for tomorrow:** OpenAI summary integration, fix build errors, add
remaining tools, conduct user interviews, write GTM/ECONOMICS/PROMPTS.

---

## Day 6 — 2026-05-11

**Hours worked:** 6

**What I did:** Integrated OpenAI API for AI-generated audit summary with
graceful fallback. Fixed build-time API key error by replacing OpenAI SDK
with direct fetch calls and adding nodejs runtime directive. Improved audit
engine with comprehensive per-tool rules covering all pricing tiers. Fixed
results page navbar duplication. Conducted 4 user interviews via WhatsApp
and Reddit — got real responses including one that challenged core product
assumptions. Wrote GTM.md, ECONOMICS.md, PROMPTS.md, USER_INTERVIEWS.md.
Fixed subscription persistence bug (old subscriptions showing on new audit).

**What I learned:** Next.js SDK imports that initialize at module load time
crash the build — must use fetch directly for API calls in route handlers.
User interviews revealed that power users know they overpay and don't care —
the real target user is engineering managers watching team budgets, not
individual developers.

**Blockers / what I'm stuck on:** Email capture and shareable URL not yet
built. Supabase not set up.

**Plan for tomorrow:** Supabase email capture, shareable URL with OG tags,
final UI polish, update DEVLOG Day 7, deploy and verify, submit.

---

## Day 7 — 2026-05-12

**Hours worked:**

**What I did:**

**What I learned:**

**Blockers / what I'm stuck on:**

**Plan for tomorrow:** Submit.