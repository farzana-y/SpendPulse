# SpendPulse — Free AI Spend Audit

SpendPulse helps startup founders and engineering managers find out 
exactly where they're overspending on AI tools like Cursor, ChatGPT, 
Claude, and GitHub Copilot — and what to do about it.

**[Live Demo →] https://spend-pulse.vercel.app/**

---

## Screenshots

> **Add 2–3 screenshots here before submitting:**
> 1. Landing page (`/`) — hero section
> 2. Audit form (`/audit`) — with subscriptions filled in
> 3. Results page (`/results`) — showing savings breakdown + shareable URL
>
> Take screenshots from your live Vercel URL and drag them into this section on GitHub, or add a 30-second Loom recording link.
>
> **Live demo:** https://spend-pulse.vercel.app

---

## Quick Start

```bash
git clone https://github.com/farzana-y/SpendPulse
cd ai-spend-audit
npm install
npm run dev
```

Open http://localhost:3000

### Environment Variables

Create a `.env.local` file:
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
GEMINI_API_KEY=your_key

---

## Decisions

1. **Next.js over plain React** — needed SSR for Open Graph tags on 
   shareable audit URLs. Static React can't generate per-audit OG previews.

2. **Hardcoded audit rules over AI** — the audit math uses deterministic 
   rules, not an LLM. A finance person should be able to read the logic 
   and agree with it. AI is only used for the summary paragraph where 
   personalization matters and errors are low-stakes.

3. **localStorage over a database for audit state** — no login required 
   was a hard requirement. localStorage lets the tool work instantly 
   without any backend. The tradeoff is audits don't persist across 
   devices, which is acceptable for an MVP.

4. **Vitest over Jest** — faster, works natively with TypeScript and 
   Next.js without extra babel config. No meaningful tradeoff at this scale.

5. **Supabase over custom Postgres** — free tier, instant setup, 
   built-in auth if needed later. The tradeoff is vendor lock-in, 
   but for an MVP the speed advantage is worth it.