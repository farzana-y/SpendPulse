"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

type AuditItem = {
  tool: string;
  currentSpend: number;
  recommendedSpend: number;
  savings: number;
  annualSavings: number;
  recommendation: string;
  reason: string;
};

type SharedData = {
  audits: AuditItem[];
  overlaps: { title: string; savings: number; reason: string }[];
  subscriptions: { tool: string; plan: string; monthlySpend: number; seats: number; useCase: string }[];
  totalMonthlySavings: number;
  toolNames: string;
};

export default function SharedResultClient({ id }: { id: string }) {
  const [data, setData] = useState<SharedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/audits?id=${id}`)
      .then(async (r) => {
        if (!r.ok) { setNotFound(true); return; }
        setData(await r.json());
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="flex items-center gap-2 text-zinc-500">
            <div className="w-4 h-4 rounded-full border-2 border-zinc-700 border-t-emerald-400 animate-spin" />
            Loading audit...
          </div>
        </div>
      </main>
    );
  }

  if (notFound || !data) {
    return (
      <main className="min-h-screen bg-zinc-950">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center space-y-4">
            <p className="text-zinc-400 text-lg">Audit not found.</p>
            <Link href="/audit" className="inline-block bg-emerald-500 text-black font-semibold px-6 py-3 rounded-xl hover:bg-emerald-400 transition-colors">
              Run Your Own Audit
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const totalMonthly = data.totalMonthlySavings;
  const totalAnnual = totalMonthly * 12;
  const isOptimal = totalMonthly === 0;
  const isHighSavings = totalMonthly >= 500;

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-12 space-y-10">
        <div>
          <div className="inline-flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-full px-3 py-1 text-xs text-zinc-400 mb-4">
            Shared AI spend audit
          </div>
          <h1 className="text-4xl font-bold tracking-tight">AI Spend Audit</h1>
          <p className="text-zinc-400 mt-2">Tools audited: {data.toolNames}</p>
          <div className="flex items-center gap-3 mt-4">
            <button onClick={handleCopy} className="inline-flex items-center gap-2 text-sm bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 px-4 py-2 rounded-lg transition-colors">
              {copied ? "✓ Copied!" : "Copy link"}
            </button>
            <Link href="/audit" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
              Run your own audit →
            </Link>
          </div>
        </div>

        {isOptimal ? (
          <div className="rounded-2xl border border-emerald-800 bg-emerald-950/40 p-8 text-center">
            <div className="text-5xl mb-3">✓</div>
            <h2 className="text-2xl font-bold text-emerald-400">Well-optimized stack</h2>
            <p className="text-zinc-400 mt-2">No major savings opportunities detected.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-emerald-700 bg-emerald-950/50 p-8">
            <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-4">Potential Savings</p>
            <div className="flex flex-col sm:flex-row gap-8">
              <div>
                <p className="text-zinc-400 text-sm">Monthly</p>
                <p className="text-5xl font-bold text-emerald-400 mt-1">${totalMonthly}</p>
              </div>
              <div className="sm:border-l border-zinc-700 sm:pl-8">
                <p className="text-zinc-400 text-sm">Annual</p>
                <p className="text-5xl font-bold text-white mt-1">${totalAnnual}</p>
              </div>
            </div>
          </div>
        )}

        {isHighSavings && (
          <div className="rounded-2xl border border-amber-700 bg-amber-950/40 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-amber-400 text-lg">Save even more with Credex</h3>
              <p className="text-zinc-400 text-sm mt-1">Credex sells discounted AI credits for Cursor, Claude, ChatGPT Enterprise and more.</p>
            </div>
            <Link href="https://credex.rocks" target="_blank" rel="noopener noreferrer" className="shrink-0 bg-amber-400 text-black font-semibold px-5 py-2.5 rounded-xl hover:bg-amber-300 transition-colors text-sm">
              Book a consult →
            </Link>
          </div>
        )}

        <div>
          <h2 className="text-xl font-bold mb-4 text-zinc-100">Per-Tool Breakdown</h2>
          <div className="space-y-4">
            {data.audits.map((audit, i) => (
              <div key={i} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-white mb-2">{audit.tool}</h3>
                    <p className="text-zinc-400 text-xs uppercase tracking-widest mb-1">Recommendation</p>
                    <p className="font-semibold text-white">{audit.recommendation}</p>
                    <p className="text-zinc-500 text-sm mt-2">{audit.reason}</p>
                  </div>
                  {audit.savings > 0 && (
                    <div className="text-right shrink-0">
                      <p className="text-zinc-500 text-xs">Save</p>
                      <p className="text-emerald-400 font-bold text-xl">${audit.savings}/mo</p>
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-800 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-zinc-500">Current spend</p>
                    <p className="text-white font-medium mt-0.5">${audit.currentSpend}/mo</p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Recommended spend</p>
                    <p className="text-emerald-400 font-medium mt-0.5">${audit.recommendedSpend}/mo</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {data.overlaps.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-zinc-100">Subscription Overlaps</h2>
            <div className="space-y-4">
              {data.overlaps.map((overlap, i) => (
                <div key={i} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-white">{overlap.title}</p>
                      <p className="text-zinc-500 text-sm mt-2">{overlap.reason}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-zinc-500 text-xs">Save</p>
                      <p className="text-emerald-400 font-bold text-xl">${overlap.savings}/mo</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center space-y-3">
          <p className="text-zinc-300 font-medium">Audit your own AI stack — it&apos;s free</p>
          <p className="text-zinc-500 text-sm">No login required. Results in under a minute.</p>
          <Link href="/audit" className="inline-block bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-3 rounded-xl transition-colors">
            Run My Audit →
          </Link>
        </div>
      </div>
    </main>
  );
}
