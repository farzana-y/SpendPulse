# Metrics

## North Star Metric
**Audits completed per week**

This is the right North Star because the tool's value — and Credex's 
lead generation — only happens when someone completes a full audit. 
Pageviews don't matter if people bounce before seeing results. 
Signups don't matter if the audit wasn't useful. Completion is the 
moment value is delivered.

## 3 Input Metrics

1. **Audit start rate** (visitors who click "Get My Audit" ÷ total visitors)
   — measures landing page effectiveness and messaging clarity

2. **Audit completion rate** (completed audits ÷ audits started)
   — measures form friction and drop-off points

3. **Email capture rate** (emails submitted ÷ audits completed)
   — measures how compelling the results page is

## What I'd Instrument First
- Audit start event (CTA click)
- Each "Add Subscription" click (to see how many tools people add)
- Audit completion event
- Email capture submission
- Credex CTA click (for high-savings audits)

Simple implementation: a single analytics call at each step. 
Posthog free tier covers all of this with no backend needed.

## Pivot Trigger
If audit completion rate drops below 40% after 100 starts, the form 
has too much friction and needs to be simplified — likely fewer required 
fields or a single-tool fast path.

If email capture rate is below 15% of completed audits, the results 
page isn't showing enough value and the savings numbers or design need work.