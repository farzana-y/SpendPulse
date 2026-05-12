# PROMPTS.md

## Overview

SpendPulse uses one LLM prompt in production: the AI-generated audit summary
on the results page. The audit math itself uses hardcoded deterministic rules —
knowing when NOT to use AI is part of the design decision.

---

## Production Prompt — Audit Summary

### Where it's used
`src/app/api/summary/route.ts` — called after every audit with savings > $0.
For optimal stacks (savings = $0), a smart template is used instead of calling
the API, to avoid wasting tokens on a generic response.

### The prompt

```
You are an AI spend optimization consultant.

Generate a concise executive summary (~100 words).

Focus on:
- unnecessary spending
- overlapping subscriptions
- realistic optimization opportunities
- whether the stack is already efficient
- estimated savings

Be financially realistic. Do not exaggerate.
Tone: concise, professional, direct.

Audits:
[JSON array of per-tool audit results with savings and recommendations]

Overlaps:
[JSON array of detected cross-tool overlaps with savings]

Subscriptions:
[JSON array of user's subscriptions with tool, plan, spend, seats, use case]
```

System prompt:
```
You are a finance-aware AI software cost optimization advisor.
```

### Why I wrote it this way

**Structured JSON input over prose:** Sending the raw audit data as JSON rather
than summarizing it in the prompt means the model works from exact numbers, not
my paraphrase of them. This reduces hallucination of savings figures.

**Explicit "do not exaggerate" instruction:** Early versions produced summaries
that inflated savings estimates. Adding this constraint made outputs more
conservative and defensible to a finance person.

**~100 word target:** Long enough to be specific, short enough to be readable
on a results page without scrolling. The model naturally hits this range when
given the constraint.

**Temperature 0.5:** Low enough to be factually consistent, high enough to
avoid robotic-sounding output. Tested 0.3 (too stiff) and 0.7 (occasionally
dramatic).

**gpt-4o-mini model:** Sufficient capability for summarization at a fraction
of the cost of GPT-4o. For a free tool where the summary is a secondary
feature, cost matters.

---

## What I tried that didn't work

**Asking the model to generate the audit recommendations themselves:**
Early prototype asked the LLM to decide what to recommend. The outputs were
inconsistent — sometimes it recommended switching tools that were already
optimal, sometimes it ignored obvious overlaps. Switched to hardcoded rules
for all audit logic. AI is only used for the summary paragraph where slight
variation is acceptable and errors are low-stakes.

**One-shot prompt with all instructions inline:**
First version had a very long system prompt trying to explain pricing tiers.
The model ignored most of it. Cleaner to send the pre-computed audit results
as data and ask only for a summary, not for the model to re-derive the math.

**Asking for bullet points:**
Bullet point summaries looked like a generic checklist. Plain prose reads
better on the results page and feels more like a personalized advisor speaking
directly to the user.

---

## Fallback behavior

If the OpenAI API call fails for any reason (network error, invalid key, rate
limit), the endpoint returns a templated fallback summary and sets
`fallback: true` in the response. The results page detects this and shows
a small "AI unavailable — showing template" label so the user understands
what happened. The page never crashes or shows an empty summary box.

For optimal stacks, the API is not called at all — a contextual template that
mentions the user's actual tool names is shown instead. This avoids the
awkward situation of an AI generating a "you're spending well" message that
reads identically for every optimized stack.