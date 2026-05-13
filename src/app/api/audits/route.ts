import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { audits, overlaps, subscriptions } = body;

    if (!audits || !Array.isArray(audits)) {
      return NextResponse.json({ error: "Invalid audit data" }, { status: 400 });
    }

    const id = randomUUID();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const totalMonthlySavings =
      audits.reduce((sum: number, a: { savings: number }) => sum + a.savings, 0) +
      (overlaps ?? []).reduce((sum: number, o: { savings: number }) => sum + o.savings, 0);

    const toolNames = (subscriptions ?? [])
      .map((s: { tool: string }) => s.tool)
      .join(", ");

    const { error } = await supabase.from("audits").insert([
      {
        id,
        audits: JSON.stringify(audits),
        overlaps: JSON.stringify(overlaps ?? []),
        subscriptions: JSON.stringify(subscriptions ?? []),
        total_monthly_savings: totalMonthlySavings,
        tool_names: toolNames,
      },
    ]);

    if (error) {
      console.error("Supabase error:", error);
      // Still return the ID so the app works even if DB fails
    }

    return NextResponse.json({ id });
  } catch (error) {
    console.error("Save audit error:", error);
    return NextResponse.json({ error: "Failed to save audit" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
      .from("audits")
      .select("audits, overlaps, subscriptions, total_monthly_savings, tool_names")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 });
    }

    return NextResponse.json({
      audits: JSON.parse(data.audits),
      overlaps: JSON.parse(data.overlaps),
      subscriptions: JSON.parse(data.subscriptions),
      totalMonthlySavings: data.total_monthly_savings,
      toolNames: data.tool_names,
    });
  } catch (error) {
    console.error("Fetch audit error:", error);
    return NextResponse.json({ error: "Failed to fetch audit" }, { status: 500 });
  }
}
