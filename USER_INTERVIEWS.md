1. Which AI tools do you currently pay for?
2. Do you feel you’re overpaying for any subscriptions?
3. Do multiple tools overlap in your workflow?
4. Have you ever forgotten active AI subscriptions?
5. Would cost optimization recommendations be useful?


## Interview 1 — B.B., Freelance Developer, Solo Projects

**Date:** 2026-05-11
**Duration:** ~10 minutes
**How I reached them:** WhatsApp, college contact

**Direct quotes:**
- "For coding I wouldn't go with ChatGPT — with Claude it's more advanced and better"
- "I actually did an entire project with Claude in 2 days which would've taken months to finish"
- "Right now I get suggestions and options from different reels on Instagram and then I try them out"
- "Do it quicker cause people are learning AI by themselves"

**Most surprising thing:** He discovers AI tools through Instagram Reels, not 
tech blogs or Twitter. This suggests the distribution channel for SpendPulse 
shouldn't assume a technical audience — short-form video could be a real 
acquisition channel.

**What it changed about my design:** His suggestion to break down each AI tool 
by specific use case and categorise by token efficiency confirmed that the 
"Primary Use Case" field in the audit form is the right approach. Also added 
urgency — he pointed out people are already self-educating on AI fast, so the 
window to be the go-to audit tool is now, not later.

## Interview 2 — J.D, Web app solo developer ,Vibe Coder

**Date:** 2026-05-11
**Duration:** async Reddit response
**How I reached them:** Messaged in Reddit about AI spending habits

**Direct quotes:**
- "Using Cursor API billing since I don't care about subscription, 
  overpaying massively. Convenience and reliability justifies cost."
- "For any heavy user quality of service comes first, price second."
- "If the recommendation to switch will be generalized instead of 
  tailored, it's worthless."
- "Comparison of all available inference API providers for specific 
  models with ability to see final pricing per in/out/cache/request 
  — many vibecoding enjoyers build AI-first apps and getting cheapest 
  inference would be massive. Haven't found a tool like that."

**Most surprising thing:** He actively knows he's overpaying and doesn't 
care. The assumption I built the tool around — that people want to save 
money — isn't universal. For power users, reliability and convenience 
outweigh cost. This completely reframes who the target user is.

**What it changed about my design:** The tool is better positioned for 
founders and engineering managers watching team budgets than for 
individual power users who've already made peace with their spend. 
Also noted his suggestion about API inference comparison as a potential 
week 2 feature — a table comparing inference providers by price, speed, 
and data policy would serve a real gap he identified.

## Interview 3 — V.D, Developer / API User

**Date:** 2026-05-11
**Duration:** async Reddit response
**How I reached them:** Messaged in Reddit about AI spending habits

**Direct quotes:**
- "I'm subscribed to like four different things that basically do 
  the same job"
- "I've started trying to consolidate everything by just using the 
  API directly instead of paying for a bunch of different UI wrappers"
- "It's way cheaper in the long run if you just pay for what you 
  actually use"
- "Unless a tool is giving me a specific workflow I can't build 
  myself in five minutes, I've been hitting that unsubscribe button 
  pretty fast lately"

**Most surprising thing:** He's already doing his own manual version 
of exactly what SpendPulse does — auditing his own stack and 
unsubscribing from redundant tools. He arrived at the same conclusion 
the product is built on, but through painful trial and error. This 
validates the core problem completely.

**What it changed about my design:** Reinforced that the overlap 
detection feature is the most valuable part of the audit — not the 
per-tool recommendations. Someone paying for "four things that do the 
same job" is the exact user SpendPulse helps most. Also his point 
about API-direct being cheaper than UI wrappers is now reflected in 
the audit engine's overlap logic.

## Interview 4 — Founder, Wellphases

**Date:** 2026-05-11  
**Duration:** async Reddit response  
**How I reached them:** Messaged in Reddit about AI spending habits  

**Direct quotes:**
- "Claude code with other models totally saves a lot for me"
- "I pay for Claude Pro and mostly API costs"
- "Not really cause I know where I spent quite clearly"

**Tools mentioned:**
- Claude Pro
- Claude Code
- Gemini
- ChatGPT
- Direct API usage

**Most surprising thing:**  
This user intentionally maintains multiple AI subscriptions and APIs at the same time, but does not consider it wasteful. Unlike earlier interviewees trying to reduce overlap, this founder sees different models as specialized tools within a workflow stack. The important distinction was visibility and intentionality — they were comfortable paying more because they clearly understood where the money was going and why.

**What it changed about my design:**  
This challenged one of the biggest assumptions in the project: overlap does not automatically equal overspending. Advanced users and founders may deliberately combine multiple models for reliability, experimentation, or workflow specialization. Because of this, SpendPulse should avoid aggressively recommending cancellation when the stack appears intentional and well-understood.  

It also introduced the idea of:
- distinguishing between accidental overlap and intentional multi-model workflows
- detecting “power user” behavior differently from casual subscriptions
- providing optimization confidence instead of assuming every duplicate tool should be removed

**Potential future feature inspired by this interview:**  
An "Intentional Stack" indicator that recognizes when users are strategically combining tools rather than wasting money — for example:
- Claude for coding
- ChatGPT for writing/reasoning
- Gemini for large context workflows
- APIs for production automation