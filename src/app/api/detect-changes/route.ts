import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { pricing } from "@/lib/pricing";
import { generateAudit } from "@/lib/audit-engine";

export const runtime = "nodejs";

type Subscription = {
  tool: string;
  plan: string;
  monthlySpend: number;
  seats: number;
  teamSize: number;
  useCase: string;
};

type AuditRow = {
  id: string;
  email: string;
  subscriptions_data: Subscription[];
  audits_data: { tool: string; savings: number; recommendation: string; reason: string }[];
  pricing_snapshot: Record<string, Record<string, number | null>>;
};

function getPriceFromSnapshot(
  snapshot: Record<string, Record<string, number | null>>,
  tool: string,
  plan: string
): number | null {
  const price = snapshot?.[tool]?.[plan];
  return typeof price === "number" ? price : null;
}

function detectPricingChanges(snapshot: Record<string, Record<string, number | null>>) {
  const changes: { tool: string; plan: string; oldPrice: number; newPrice: number }[] = [];
  const currentPricing = pricing as unknown as Record<string, Record<string, number>>;
  for (const tool of Object.keys(snapshot)) {
    const snapshotPlans = snapshot[tool];
    const currentPlans = currentPricing[tool];
    if (!currentPlans || !snapshotPlans) continue;

    for (const plan of Object.keys(snapshotPlans)) {
      const oldPrice = snapshotPlans[plan];
      const newPrice = currentPlans[plan];
      if (
        newPrice !== undefined &&
        oldPrice !== undefined &&
        typeof oldPrice === "number" &&
        typeof newPrice === "number" &&
        oldPrice !== newPrice
      ) {
        changes.push({ tool, plan, oldPrice, newPrice });
      }
    }
  }
  return changes;
}

async function sendStaleEmail(
  email: string,
  auditId: string,
  changes: { tool: string; plan: string; oldPrice: number; newPrice: number }[],
  oldAudits: AuditRow["audits_data"],
  newAudits: AuditRow["audits_data"]
) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://spend-pulse.vercel.app";
  const rerunUrl = `${baseUrl}/results/diff/${auditId}`;

  const changeLines = changes
    .map((c) => `  • ${c.tool} ${c.plan}: $${c.oldPrice}/mo → $${c.newPrice}/mo`)
    .join("\n");

  const oldSavings = oldAudits.reduce((s, a) => s + a.savings, 0);
  const newSavings = newAudits.reduce((s, a) => s + a.savings, 0);
  const delta = newSavings - oldSavings;
  const deltaStr = delta >= 0 ? `+$${delta}` : `-$${Math.abs(delta)}`;

  const body = `Hi,

Pricing has changed for tools in your SpendPulse audit.

What changed:
${changeLines}

Impact on your audit:
  Your previous audit showed $${oldSavings}/mo in savings.
  With current pricing, that's now $${newSavings}/mo (${deltaStr}/mo).

See the full diff and re-run your audit here:
${rerunUrl}

— SpendPulse`;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "SpendPulse <onboarding@resend.dev>",
      to: [email],
      subject: "Your AI spend audit is out of date — pricing changed",
      text: body,
    }),
  });
}

export async function POST(req: NextRequest) {
  try {
    // Optional: accept a manual pricing override for testing
    // POST body: { tool: "Cursor", plan: "Pro", newPrice: 30 }
    const body = await req.json().catch(() => ({}));
    const override = body as { tool?: string; plan?: string; newPrice?: number };

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Fetch all non-stale audits that have an email
    const { data: audits, error } = await supabase
      .from("audits")
      .select("id, email, subscriptions_data, audits_data, pricing_snapshot")
      .eq("stale", false)
      .not("email", "is", null);

    if (error) throw error;
    if (!audits || audits.length === 0) {
      return NextResponse.json({ message: "No audits to check", checked: 0 });
    }

    let staleCount = 0;
    const emailsSent: string[] = [];

    // Group by email so we send one consolidated email per user
    const byEmail = new Map<string, { audit: AuditRow; changes: ReturnType<typeof detectPricingChanges> }[]>();

    for (const audit of audits as AuditRow[]) {
      if (!audit.pricing_snapshot) continue;

      // Apply manual override for testing if provided
      let snapshotToCheck = audit.pricing_snapshot;
      if (override.tool && override.plan && override.newPrice !== undefined) {
        snapshotToCheck = {
          ...snapshotToCheck,
          [override.tool]: {
            ...snapshotToCheck[override.tool],
            [override.plan]: override.newPrice - 1, // make it different from current
          },
        };
      }

      const changes = detectPricingChanges(snapshotToCheck);
      if (changes.length === 0) continue;

      // Re-run audit with current pricing
      const newAudits = audit.subscriptions_data.map((sub) => ({
        tool: sub.tool,
        ...generateAudit(sub),
      }));

      // Mark audit as stale
      await supabase
        .from("audits")
        .update({ stale: true })
        .eq("id", audit.id);

      staleCount++;

      if (audit.email) {
        const existing = byEmail.get(audit.email) ?? [];
        existing.push({ audit: { ...audit, audits_data: newAudits }, changes });
        byEmail.set(audit.email, existing);

        // Store new audit result for diff view
        await supabase
          .from("audits")
          .update({ audits_data: newAudits })
          .eq("id", audit.id);
      }
    }

    // Send one consolidated email per user
    for (const [email, entries] of byEmail.entries()) {
      const allChanges = entries.flatMap((e) => e.changes);
      const firstEntry = entries[0];
      const oldAudits = (audits as AuditRow[]).find(
        (a) => a.id === firstEntry.audit.id
      )?.audits_data ?? [];

      await sendStaleEmail(
        email,
        firstEntry.audit.id,
        allChanges,
        oldAudits,
        firstEntry.audit.audits_data
      );
      emailsSent.push(email);
    }

    return NextResponse.json({
      message: "Detection complete",
      checked: audits.length,
      staleFound: staleCount,
      emailsSent: emailsSent.length,
    });
  } catch (error) {
    console.error("Detect changes error:", error);
    return NextResponse.json({ error: "Detection failed" }, { status: 500 });
  }
}