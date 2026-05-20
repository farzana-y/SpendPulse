import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import { pricing } from "@/lib/pricing";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { audits, overlaps, subscriptions, email } = body;

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

    const { error } = await supabase.from("audits").insert([{
      id,
      audits_data: audits,
      overlaps_data: overlaps ?? [],
      subscriptions_data: subscriptions ?? [],
      email: email ?? null,
      pricing_snapshot: pricing,
      total_monthly_savings: totalMonthlySavings,
      stale: false,
    }]);

    if (error) console.error("Supabase error:", error);

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
      .select("audits_data, overlaps_data, subscriptions_data, total_monthly_savings, stale, pricing_snapshot")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 });
    }

    return NextResponse.json({
      audits: data.audits_data,
      overlaps: data.overlaps_data,
      subscriptions: data.subscriptions_data,
      totalMonthlySavings: data.total_monthly_savings,
      stale: data.stale,
      pricingSnapshot: data.pricing_snapshot,
    });
  } catch (error) {
    console.error("Fetch audit error:", error);
    return NextResponse.json({ error: "Failed to fetch audit" }, { status: 500 });
  }
}