import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subscriptions, totalSavings, annualSavings } = body;

    const toolList = subscriptions
      .map(
        (s: { tool: string; plan: string; monthlySpend: number }) =>
          `${s.tool} (${s.plan}, $${s.monthlySpend}/mo)`,
      )
      .join(", ");

    const prompt = `You are an AI spend analyst. A startup is spending on these AI tools: ${toolList}. 
Their total potential monthly savings is $${totalSavings} ($${annualSavings}/year).
Write a concise, personalized 80-100 word audit summary for them. 
Be direct and specific — mention their actual tools by name. 
Point out the biggest saving opportunity. 
End with one actionable recommendation.
Do not use bullet points. Write in plain prose.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });
    
   
    const data = await response.json();
    console.log("OpenAI response:", JSON.stringify(data)); 
    const summary = data.choices?.[0]?.message?.content;

    if (!summary) throw new Error("No summary returned");

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Summary generation failed:", error);
    // Graceful fallback — never crashes the results page
    return NextResponse.json({
      summary:
        "Based on your current AI subscriptions, there are opportunities to optimize your spend by reviewing plan sizes relative to your team's actual usage. Consider consolidating overlapping tools and right-sizing plans to match your team's needs.",
    });
  }
}
