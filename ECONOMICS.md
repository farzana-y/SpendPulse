# ECONOMICS.md — Unit Economics

## What a converted lead is worth to Credex

Credex sells discounted AI infrastructure credits. Based on publicly available
information about the AI credits market:

- Average first purchase from a converted lead: ~$2,000–$5,000 in credits
- Gross margin on discounted credits: estimated 20–35% (buying at steep
  discount, selling at moderate discount vs retail)
- Estimated gross profit per conversion: $400–$1,750
- Conservative estimate used below: **$600 gross profit per converted customer**

A customer who buys once and sees value is likely to return. Estimated LTV
over 12 months (2–3 purchases): **$1,200–$2,000 per customer**.

---

## CAC at each channel from the GTM plan

All channels are $0 paid budget. CAC here means time cost only.

| Channel | Est. visitors | Audit completion (20%) | Email capture (12%) | Credex conversion (5%) | Leads | CAC (time est.) |
|---|---|---|---|---|---|---|
| HN Show HN | 400 | 80 | 10 | 0.5 | 0–1 | ~4 hrs total |
| Reddit posts | 200 | 40 | 5 | 0.25 | 0–1 | ~2 hrs total |
| Twitter thread | 150 | 30 | 4 | 0.2 | 0–1 | ~1 hr total |
| Credex warm list | 100 | 50 | 20 | 2 | 1–3 | Near zero |

The Credex warm list is the highest-converting channel by far because the
audience is pre-qualified (they already spend on AI credits).

Blended CAC across organic channels: effectively $0 cash, ~2–3 hours of
distribution work per week.

---

## Conversion funnel math

```
Landing page visitors
        ↓ 20–25% start audit
Audit started
        ↓ 60–70% complete it
Audit completed
        ↓ 10–15% submit email
Email captured
        ↓ 5–8% book Credex consult (high-savings cases only)
Credex consultation booked
        ↓ 30–40% purchase credits
Credit purchase (revenue)
```

For every 1,000 landing page visitors:
- 220 start an audit
- 154 complete it
- 18 submit their email
- ~5 book a Credex consultation (assuming 30% of audits show >$500 savings)
- ~1–2 purchase credits

At $600 gross profit per customer: **$600–$1,200 revenue per 1,000 visitors**

---

## What conversion rate makes this profitable

Since distribution cost is effectively $0, the tool is profitable at any
positive conversion rate. The real question is: what conversion rate justifies
Credex's engineering time to maintain it?

Assumption: 2 hours/week ongoing maintenance = ~8 hrs/month = ~$400/month in
opportunity cost at a $50/hr engineering rate.

Break-even: need ~1 credit purchase per month = ~500 landing page visitors/month

At a modest HN post + Reddit presence, 500 visitors/month is achievable within
30 days of launch. The tool covers its maintenance cost from month 1 if even
one high-savings user converts.

---

## What would have to be true for $1M ARR in 18 months

$1M ARR = ~$55,000/month revenue
At $600 gross profit per customer: need ~92 new customers/month
At 1–2% visitor-to-customer rate: need ~5,000–9,000 visitors/month

**Is 5,000–9,000 monthly visitors achievable in 18 months?**

Yes, if:
1. The tool gets featured on 2–3 major developer newsletters
   (TLDR, Pointer, JavaScript Weekly — combined 500k+ subscribers)
2. SEO builds over 6 months for queries like "cursor vs copilot cost",
   "is chatgpt team worth it" (low competition, high intent)
3. The shareable audit URL creates a viral loop — each shared result
   drives 3–5 new visitors on average
4. Credex actively promotes the tool to their existing customer base
   (even 200 emails with 30% open rate = 60 warm visits/send)

**The math that has to hold:**
- Month 1–3: 500–1,000 visitors/month (seeding phase)
- Month 4–9: 2,000–4,000 visitors/month (SEO + word of mouth compounding)
- Month 10–18: 5,000–10,000 visitors/month (established brand + newsletter features)

Cumulative customers over 18 months at 1.5% conversion:
~(500+1000+2000+3000+4000+5000+6000+7000+8000+9000+9000+9000+9000+9000+9000+9000+9000+9000)
× 1.5% ≈ 170 customers

At $1,200 LTV (2 purchases): **$204,000 gross profit over 18 months**

$1M ARR requires either higher LTV per customer (enterprise contracts),
higher conversion rates, or paid distribution on top of organic.
Realistic organic-only ceiling is $200k–$400k ARR in 18 months.
$1M ARR requires Credex to integrate SpendPulse into a sales motion with
enterprise-level credit commitments ($10k+/deal).

---

## Key assumptions and risks

These numbers are estimates built from first principles — I don't have 
access to Credex's actual margins or conversion data. I've been 
conservative where uncertain and flagged the key assumptions that would 
most change the outcome if wrong.

- Gross margin estimate (20–35%) is unverified — actual Credex margins may differ
- Conversion rate from audit → consult (5–8%) assumes strong results page design
  and a genuine high-savings case — may be lower for well-optimized stacks
- LTV assumes repeat purchases — first-time buyers may not return if they
  fully optimize their stack
- The viral loop only works if the shareable URL is genuinely interesting to
  share — this depends on the results page being screenshot-worthy