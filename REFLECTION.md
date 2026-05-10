# Reflection

## 1. The hardest bug I hit and how I debugged it

The hardest bug was the results page showing "Your current setup looks 
cost-efficient" even when real savings were detected. The savings numbers 
were correct ($40/mo showing) but the recommendation text was wrong.

My first hypothesis was that localStorage wasn't saving the data correctly. 
I added console.logs to the Generate button handler and confirmed the audit 
object was being saved fine. Then I looked more carefully at the object 
structure — the savings number was correct but the recommendation string was 
coming from generateAudit() which only evaluates individual subscriptions. 
The $20 overlap savings were being added to the total but the recommendation 
text never reflected that.

The fix was to check separately whether overlapSavings > 0 and set the 
recommendation message based on that condition, rather than always taking 
the message from generateAudit(). Once I traced the data flow step by step 
through each function, the bug became obvious.

---

## 2. A decision I reversed mid-week

Initially I built the audit to run generateAudit() on the entire subscriptions 
array at once, trying to produce one combined result. Midway through I realized 
this made the logic impossible to reason about — each tool has different 
downgrade conditions and mixing them together produced wrong recommendations.

I reversed this and ran generateAudit() per subscription, then picked the best 
result using reduce(). This made the code much cleaner and easier to debug. It 
also made the overlap detection a separate concern which is architecturally 
cleaner — per-tool analysis and cross-tool overlap detection are genuinely 
different problems.

---

## 3. What I would build in week 2

- PDF export of the full audit report so founders can share it internally
- Benchmark mode: "your AI spend per developer is $X, companies your size 
  average $Y" — this requires collecting anonymized aggregate data which 
  week 2 would have enough submissions to start
- Better API usage audit — currently the tool asks for estimated monthly spend 
  for API users. Week 2 I'd add token consumption inputs so the math traces 
  back to actual usage patterns
- Embeddable widget a blogger could drop into their site with a script tag
- Referral system — share the tool, both parties get a perk, creates the 
  viral loop the shareable URL is meant to start

---

## 4. How I used AI tools

I used two AI tools throughout this project:

**ChatGPT** was my starting point. I had never worked with Next.js before 
this assignment, so I used it to understand the fundamentals — what app router 
is, how page.tsx works, what client vs server components mean, how to structure 
folders. The initial GitHub base was built with ChatGPT's help while I was 
learning. I treated it like a patient tutor — I'd ask "why does this work this 
way" not just "give me the code." Day 1 was almost entirely spent learning 
Next.js this way before writing a single line myself.

**Claude (claude.ai)** became my primary tool once I had the foundation. I used 
it for debugging specific bugs (the results page crash, the recommendation logic 
bug, the ESLint CI failures), fixing TypeScript errors, and writing the test 
suite. Claude was better at reasoning through multi-step bugs in my experience.

**What I didn't trust either tool with:**
Pricing data — verified every number myself against official vendor pages. AI 
tools hallucinate prices confidently and that would have been an instant fail 
given the assignment explicitly checks sources. The DEVLOG was written from 
memory of what I actually did. User interviews were real conversations, not 
generated responses.

I adjusted or rejected several AI suggestions that oversimplified API pricing 
models, proposed unrealistic enterprise pricing assumptions, or suggested 
over-engineered implementations too early in development.

**One specific time the AI was wrong and I caught it:**
Claude suggested a package.json with Next.js version ^9.3.3 paired with React 
19. These are completely incompatible — Next.js 9 requires React 16. The npm 
install failed immediately with a dependency conflict error. I caught it by 
reading the error message carefully and cross-checking the actual version I was 
already using (16.2.6). This reinforced the rule: always verify version numbers 
yourself, never copy them blindly from AI output.

---

## 5. Self-ratings

- **Discipline: 6/10** — Started with a clear plan but lost time to illness on 
  two days. Commits are spread across the week which reflects real work, not 
  cramming.

- **Code quality: 7/10** — TypeScript used properly throughout, audit logic is 
  separated from UI, 10 automated tests pass. Could improve by adding more edge 
  case coverage and cleaning up the localStorage persistence pattern.

- **Design sense: 7/10** — Dark theme looks professional and the results page 
  has clear visual hierarchy. The savings hero block is prominent. Could improve 
  the landing page and add more polish to empty states.

- **Problem-solving: 8/10** — Debugged the recommendation bug and CI failures 
  independently by tracing data flow. Didn't give up when the Anthropic API 
  wasn't working — found an alternative path.

- **Entrepreneurial thinking: 6/10** — I understand the product and who it's 
  for. The GTM and ECONOMICS files need more depth. User interviews happened 
  but were limited by my network as a student.