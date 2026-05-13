import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props) {
  return {
    title: "AI Spend Audit — SpendPulse",
    description: "See this AI subscription audit on SpendPulse",
    openGraph: {
      title: "AI Spend Audit — SpendPulse",
      description: "Free AI spend audit. See where your team is overpaying.",
      url: `https://your-deployed-url.vercel.app/share/${params.id}`,
    },
    twitter: {
      card: "summary",
      title: "AI Spend Audit — SpendPulse",
      description: "Free AI spend audit. See where your team is overpaying.",
    },
  };
}

export default async function SharePage({ params }: Props) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("audits")
    .select("audit, overlaps, subscriptions")
    .eq("id", params.id)
    .single();

  if (error || !data) return notFound();

  const audit = data.audit;
  const overlaps = data.overlaps ?? [];
  const subscriptions = data.subscriptions ?? [];

  const totalOverlapSavings = overlaps.reduce(
    (sum: number, o: { savings: number }) => sum + o.savings, 0
  );
  const totalMonthlySavings = audit.savings + totalOverlapSavings;

  return (
    <main className="min-h-screen bg-zinc-950 text-white py-12 px-4">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 12L6 7L9 9.5L13 4" stroke="black" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-bold text-lg">
              Spend<span className="text-emerald-400">Pulse</span>
            </span>
          </div>
          <h1 className="text-3xl font-bold">Shared AI Spend Audit</h1>
          <p className="text-zinc-400">
            This audit was generated with SpendPulse — free AI subscription auditor.
          </p>
        </div>

        {totalMonthlySavings > 0 ? (
          <div className="rounded-2xl border border-emerald-700 bg-emerald-950/50 p-8 text-center">
            <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-2">
              Potential Savings
            </p>
            <p className="text-5xl font-bold text-emerald-400">
              ${totalMonthlySavings}/mo
            </p>
            <p className="text-zinc-400 mt-1">${totalMonthlySavings * 12}/year</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-emerald-800 bg-emerald-950/40 p-8 text-center">
            <p className="text-2xl mb-2">✓</p>
            <p className="text-emerald-400 font-bold">Stack is well optimized</p>
          </div>
        )}

        <div className="space-y-3">
          {subscriptions.map((sub: {
            tool: string; plan: string;
            monthlySpend: number; seats: number
          }, i: number) => (
            <div key={i} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 flex justify-between">
              <div>
                <p className="font-semibold text-white">{sub.tool}</p>
                <p className="text-zinc-500 text-sm">{sub.plan} · {sub.seats} seat{sub.seats !== 1 ? "s" : ""}</p>
              </div>
              <p className="text-white font-bold">${sub.monthlySpend}/mo</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center space-y-3">
          <p className="text-white font-semibold">Audit your own AI stack — free</p>
          <a
            href="/"
            className="inline-block bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Get My Free Audit →
          </a>
        </div>
      </div>
    </main>
  );
}