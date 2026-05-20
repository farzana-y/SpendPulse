"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

type AuditItem = {
  tool: string;
  currentSpend: number;
  recommendedSpend: number;
  savings: number;
  recommendation: string;
  reason: string;
};

type DiffData = {
  audits: AuditItem[];
  overlaps: { title: string; savings: number; reason: string }[];
  subscriptions: { tool: string; plan: string; monthlySpend: number; seats: number }[];
  totalMonthlySavings: number;
  stale: boolean;
  pricingSnapshot: Record<string, Record<string, number>>;
};

export default function DiffPage() {
  const params = useParams();
  const id = params?.id as string;
  const [data, setData] = useState<DiffData | null>(null);
  const [newAudits, setNewAudits] = useState<AuditItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/audits?id=${id}`)
      .then(async (r) => {
        if (!r.ok) { setNotFound(true); return; }
        const json = await r.json();
        setData(json);

        // Re-run audit with current pricing via detect-changes
        const res = await fetch("/api/reaudit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ auditId: id }),
        });
        if (res.ok) {
          const { newAudits } = await res.json();
          setNewAudits(newAudits);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <main className="min-h-screen bg-zinc-950">
      <Navbar />
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="flex items-center gap-2 text-zinc-500">
          <div className="w-4 h-4 rounded-full border-2 border-zinc-700 border-t-emerald-400 animate-spin" />
          Running updated audit...
        </div>
      </div>
    </main>
  );

  if (notFound || !data) return (
    <main className="min-h-screen bg-zinc-950">
      <Navbar />
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center space-y-4">
          <p className="text-zinc-400">Audit not found.</p>
          <Link href="/audit" className="inline-block bg-emerald-500 text-black font-semibold px-6 py-3 rounded-xl">
            Run New Audit
          </Link>
        </div>
      </div>
    </main>
  );

  const oldAudits = data.audits;
  const compared = newAudits ?? oldAudits;

  const oldTotal = oldAudits.reduce((s, a) => s + a.savings, 0);
  const newTotal = compared.reduce((s, a) => s + a.savings, 0);
  const delta = newTotal - oldTotal;

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-12 space-y-10">

        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-900/40 border border-amber-700 rounded-full px-3 py-1 text-xs text-amber-400 mb-4">
            ⚠ Pricing has changed since this audit was generated
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Updated Audit</h1>
          <p className="text-zinc-400 mt-2">
            Showing what changed vs your original audit from{" "}
            <Link href={`/results/${id}`} className="text-emerald-400 hover:underline">
              the shared link
            </Link>
          </p>
        </div>

        {/* Savings delta hero */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
          <p className="text-zinc-400 text-sm uppercase tracking-widest mb-4">Savings Impact</p>
          <div className="flex flex-col sm:flex-row gap-8">
            <div>
              <p className="text-zinc-500 text-sm">Old monthly savings</p>
              <p className="text-3xl font-bold text-zinc-300 mt-1">${oldTotal}/mo</p>
            </div>
            <div className="sm:border-l border-zinc-700 sm:pl-8">
              <p className="text-zinc-500 text-sm">New monthly savings</p>
              <p className="text-3xl font-bold text-emerald-400 mt-1">${newTotal}/mo</p>
            </div>
            <div className="sm:border-l border-zinc-700 sm:pl-8">
              <p className="text-zinc-500 text-sm">Delta</p>
              <p className={`text-3xl font-bold mt-1 ${delta >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {delta >= 0 ? "+" : ""}${delta}/mo
              </p>
            </div>
          </div>
        </div>

        {/* Per-tool diff */}
        <div>
          <h2 className="text-xl font-bold mb-4">Per-Tool Comparison</h2>
          <div className="space-y-4">
            {oldAudits.map((oldAudit, i) => {
              const newAudit = compared[i];
              const changed = newAudit && (
                oldAudit.recommendation !== newAudit.recommendation ||
                oldAudit.savings !== newAudit.savings
              );

              return (
                <div key={i} className={`rounded-2xl border p-6 ${changed ? "border-amber-700 bg-amber-950/20" : "border-zinc-800 bg-zinc-900 opacity-60"}`}>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="font-bold text-lg">{oldAudit.tool}</h3>
                    {changed ? (
                      <span className="text-xs bg-amber-900/50 text-amber-400 border border-amber-700 px-2 py-1 rounded-full">Changed</span>
                    ) : (
                      <span className="text-xs bg-zinc-800 text-zinc-500 px-2 py-1 rounded-full">Same</span>
                    )}
                  </div>

                  {changed ? (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Old */}
                      <div className="rounded-xl bg-zinc-900 border border-zinc-700 p-4">
                        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">Before</p>
                        <p className="text-white font-medium">{oldAudit.recommendation}</p>
                        <p className="text-zinc-500 text-sm mt-1">{oldAudit.reason}</p>
                        <p className="text-emerald-400 font-bold mt-3">${oldAudit.savings}/mo savings</p>
                      </div>
                      {/* New */}
                      <div className="rounded-xl bg-emerald-950/30 border border-emerald-800 p-4">
                        <p className="text-xs text-emerald-500 uppercase tracking-widest mb-2">Now</p>
                        <p className="text-white font-medium">{newAudit.recommendation}</p>
                        <p className="text-zinc-500 text-sm mt-1">{newAudit.reason}</p>
                        <p className="text-emerald-400 font-bold mt-3">${newAudit.savings}/mo savings</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-zinc-500 text-sm">
                      <p>{oldAudit.recommendation}</p>
                      <p className="mt-1">Savings unchanged: ${oldAudit.savings}/mo</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center space-y-3">
          <p className="text-zinc-300 font-medium">Want to run a fresh audit with your current stack?</p>
          <Link href="/audit" className="inline-block bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-3 rounded-xl transition-colors">
            Run New Audit →
          </Link>
        </div>

      </div>
    </main>
  );
}