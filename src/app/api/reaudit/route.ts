import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateAudit } from "@/lib/audit-engine";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { auditId } = await req.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
      .from("audits")
      .select("subscriptions_data")
      .eq("id", auditId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 });
    }

    const newAudits = data.subscriptions_data.map((sub: {
      tool: string;
      plan: string;
      monthlySpend: number;
      seats: number;
      teamSize: number;
      useCase: string;
    }) => ({
      tool: sub.tool,
      ...generateAudit(sub),
    }));

    return NextResponse.json({ newAudits });
  } catch (error) {
    console.error("Reaudit error:", error);
    return NextResponse.json({ error: "Reaudit failed" }, { status: 500 });
  }
}