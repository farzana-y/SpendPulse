import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { audits, overlaps, subscriptions } = body;

    const prompt = `
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
${JSON.stringify(audits, null, 2)}

Overlaps:
${JSON.stringify(overlaps, null, 2)}

Subscriptions:
${JSON.stringify(subscriptions, null, 2)}
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a finance-aware AI software cost optimization advisor.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 180,
      }),
    });

    const data = await response.json();
    const summary =
      data.choices?.[0]?.message?.content ||
      "Your stack appears reasonably optimized.";

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("SUMMARY API ERROR:", error);
    return NextResponse.json({
      summary:
        "We analyzed your AI stack and identified potential optimization opportunities based on pricing, overlap, and usage patterns.",
      fallback: true,
    });
  }
}