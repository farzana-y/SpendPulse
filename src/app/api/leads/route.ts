import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

// Simple in-memory rate limit: max 5 requests per IP per 10 minutes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const window = 10 * 60 * 1000; // 10 minutes
  const limit = 5;
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + window });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

async function sendConfirmationEmail(
  email: string,
  totalMonthlySavings: number,
  tools: string,
  isHighSavings: boolean
) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return; // gracefully skip if not configured

  const subject =
    totalMonthlySavings > 0
      ? `Your SpendPulse Audit: $${totalMonthlySavings}/mo in savings found`
      : "Your SpendPulse Audit: Your stack looks well-optimized";

  const body =
    totalMonthlySavings > 0
      ? `Hi,\n\nYour SpendPulse audit is complete. We found $${totalMonthlySavings}/mo ($${
          totalMonthlySavings * 12
        }/yr) in potential savings across: ${tools}.\n\n${
          isHighSavings
            ? "Because your savings are significant, a Credex advisor may reach out to discuss discounted AI credits that could save you even more.\n\n"
            : ""
        }Run another audit anytime at https://spend-pulse.vercel.app\n\n— SpendPulse`
      : `Hi,\n\nYour SpendPulse audit is complete. Good news — your AI stack looks well-optimized.\n\nWe'll notify you when new optimizations apply to your tools: ${tools}.\n\n— SpendPulse`;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "SpendPulse <audit@spendpulse.co>",
        to: [email],
        subject,
        text: body,
      }),
    });
  } catch (err) {
    console.error("Email send failed (non-fatal):", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, company, role, totalMonthlySavings, tools, _hp } = body;

    // Honeypot — bots fill hidden fields, humans leave them blank
    if (_hp && _hp.length > 0) {
      return NextResponse.json({ success: true }); // silent reject
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase.from("leads").insert([
      {
        email,
        company: company || null,
        role: role || null,
        total_monthly_savings: totalMonthlySavings || 0,
        tools: tools || null,
      },
    ]);

    if (error) throw error;

    const isHighSavings = (totalMonthlySavings ?? 0) >= 500;
    sendConfirmationEmail(email, totalMonthlySavings ?? 0, tools ?? "", isHighSavings).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead capture error:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}