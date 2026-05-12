"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ReportModal from "@/components/ReportModal";

type AuditItem = {
  tool: string;
  currentSpend: number;
  recommendedSpend: number;
  savings: number;
  annualSavings: number;
  recommendation: string;
  reason: string;
};

type AuditResult = {
  audits: AuditItem[];
  overlaps: {
    title: string;
    savings: number;
    reason: string;
  }[];
  subscriptions: {
    tool: string;
    plan: string;
    monthlySpend: number;
    seats: number;
    useCase: string;
  }[];
};

export default function ResultsPage() {
  const [result, setResult] = useState<AuditResult | null>(null);
  const [summary, setSummary] = useState<string>("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedResult = localStorage.getItem("auditResult");
    if (storedResult) {
      try {
        setResult(JSON.parse(storedResult));
      } catch {
        // corrupted data
      }
    }
  }, []);

  useEffect(() => {
    if (!result) return;

    const auditSavings = result.audits.reduce((sum, a) => sum + a.savings, 0);
    const overlapSavings = (result.overlaps ?? []).reduce(
      (sum, o) => sum + o.savings,
      0,
    );
    const totalSavings = auditSavings + overlapSavings;
    const isOptimal = totalSavings === 0;

    setSummaryLoading(true);

    // For optimal stacks, skip the API and use a smart template
    if (isOptimal) {
      const toolNames = result.subscriptions.map((s) => s.tool).join(", ");
      setSummary(
        `Your current AI stack (${toolNames}) appears well-optimized. Each tool is appropriately sized for your team and use case — no redundant overlap or over-provisioned plans were detected. Continue monitoring usage as your team grows, since thresholds for plan upgrades or consolidation can shift quickly when headcount or workload changes.`,
      );
      setSummaryLoading(false);
      setTimeout(() => setShowModal(true), 800);
      return;
    }

    fetch("/api/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        audits: result.audits,
        overlaps: result.overlaps ?? [],
        subscriptions: result.subscriptions ?? [],
      }),
    })
      .then(async (r) => {
        const data = await r.json();
        setSummary(data.summary);
        setUsedFallback(!!data.fallback);
      })
      .catch(() => {
        setSummary(
          "Based on your subscriptions, there are opportunities to optimize your AI spend by right-sizing plans and consolidating overlapping tools.",
        );
        setUsedFallback(true);
      })
      .finally(() => {
        setSummaryLoading(false);
        setTimeout(() => setShowModal(true), 800);
      });
  }, [result]);

  if (!result) {
    return (
      <main className="min-h-screen bg-zinc-950">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center space-y-4">
            <p className="text-zinc-400 text-lg">No audit result found.</p>
            <Link
              href="/audit"
              className="inline-block bg-emerald-500 text-black font-semibold px-6 py-3 rounded-xl hover:bg-emerald-400 transition-colors"
            >
              Run an Audit
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const totalOverlapSavings = (result.overlaps ?? []).reduce(
    (sum, o) => sum + o.savings,
    0,
  );
  const auditSavings = result.audits.reduce((sum, a) => sum + a.savings, 0);
  const totalMonthlySavings = auditSavings + totalOverlapSavings;
  const totalAnnualSavings = totalMonthlySavings * 12;
  const isOptimal = totalMonthlySavings === 0;
  const isHighSavings = totalMonthlySavings >= 500;

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {showModal && (
        <ReportModal
          totalMonthlySavings={totalMonthlySavings}
          tools={result.subscriptions.map((s) => s.tool).join(", ")}
          onClose={() => setShowModal(false)}
        />
      )}
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-12 space-y-10">
        {/* Header */}
        <div>
          <Link
            href="/audit"
            className="text-zinc-500 text-sm hover:text-zinc-300 transition-colors"
          >
            ← Run another audit
          </Link>
          <h1 className="text-4xl font-bold mt-4 tracking-tight">
            Your AI Spend Audit
          </h1>
          <p className="text-zinc-400 mt-2">
            Here&apos;s what we found about your current AI subscriptions.
          </p>
        </div>

        {/* Hero savings block */}
        {isOptimal ? (
          <div className="rounded-2xl border border-emerald-800 bg-emerald-950/40 p-8 text-center">
            <div className="text-5xl mb-3">✓</div>
            <h2 className="text-2xl font-bold text-emerald-400">
              You&apos;re spending well
            </h2>
            <p className="text-zinc-400 mt-2">
              No major optimizations detected for your current stack.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-emerald-700 bg-emerald-950/50 p-8">
            <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-4">
              Potential Savings
            </p>
            <div className="flex flex-col sm:flex-row gap-8">
              <div>
                <p className="text-zinc-400 text-sm">Monthly</p>
                <p className="text-5xl font-bold text-emerald-400 mt-1">
                  ${totalMonthlySavings}
                </p>
              </div>
              <div className="sm:border-l border-zinc-700 sm:pl-8">
                <p className="text-zinc-400 text-sm">Annual</p>
                <p className="text-5xl font-bold text-white mt-1">
                  ${totalAnnualSavings}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AI Summary */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              AI-Generated Summary
            </p>
            {usedFallback && (
              <span className="text-xs text-amber-500">
                AI unavailable — showing template
              </span>
            )}
          </div>
          {summaryLoading ? (
            <div className="flex items-center gap-2 text-zinc-500 text-sm">
              <div className="w-3 h-3 rounded-full border-2 border-zinc-600 border-t-emerald-400 animate-spin" />
              Generating your personalized summary...
            </div>
          ) : (
            <p className="text-white leading-relaxed text-sm">{summary}</p>
          )}
        </div>

        {/* Credex CTA for high savings */}
        {isHighSavings && (
          <div className="rounded-2xl border border-amber-700 bg-amber-950/40 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-amber-400 text-lg">
                You could save even more with Credex
              </h3>
              <p className="text-zinc-400 text-sm mt-1">
                Credex sells discounted AI credits for Cursor, Claude, ChatGPT
                Enterprise and more — sourced from companies that overforecast.
                Book a free consultation to see what&apos;s available for your
                stack.
              </p>
            </div>
            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 bg-amber-400 text-black font-semibold px-5 py-2.5 rounded-xl hover:bg-amber-300 transition-colors text-sm"
            >
              Book a consult →
            </a>
          </div>
        )}

        {/* Per-tool breakdown */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-zinc-100">
            Per-Tool Breakdown
          </h2>
          <div className="space-y-4">
            {result.audits.map((audit, index) => (
              <div
                key={index}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-white mb-2">
                      {audit.tool}
                    </h3>
                    <p className="text-zinc-400 text-xs uppercase tracking-widest mb-1">
                      Recommendation
                    </p>
                    <p className="font-semibold text-white">
                      {audit.recommendation}
                    </p>
                    <p className="text-zinc-500 text-sm mt-2">{audit.reason}</p>
                  </div>
                  {audit.savings > 0 && (
                    <div className="text-right shrink-0">
                      <p className="text-zinc-500 text-xs">Save</p>
                      <p className="text-emerald-400 font-bold text-xl">
                        ${audit.savings}/mo
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-800 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-zinc-500">Current spend</p>
                    <p className="text-white font-medium mt-0.5">
                      ${audit.currentSpend}/mo
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Recommended spend</p>
                    <p className="text-emerald-400 font-medium mt-0.5">
                      ${audit.recommendedSpend}/mo
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overlaps */}
        {(result.overlaps ?? []).length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-zinc-100">
              Subscription Overlaps
            </h2>
            <div className="space-y-4">
              {result.overlaps.map((overlap, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-white">
                        {overlap.title}
                      </p>
                      <p className="text-zinc-500 text-sm mt-2">
                        {overlap.reason}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-zinc-500 text-xs">Save</p>
                      <p className="text-emerald-400 font-bold text-xl">
                        ${overlap.savings}/mo
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active subscriptions */}
        {(result.subscriptions ?? []).length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-zinc-100">
              Your Subscriptions
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {result.subscriptions.map((sub, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 space-y-2 text-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-white text-base">
                      {sub.tool}
                    </p>
                    <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md text-xs">
                      {sub.plan}
                    </span>
                  </div>
                  <div className="text-zinc-400 space-y-1 pt-1">
                    <p>
                      ${sub.monthlySpend}/mo · {sub.seats} seat
                      {sub.seats !== 1 ? "s" : ""}
                    </p>
                    <p>Use case: {sub.useCase}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Low savings notify CTA */}
        {!isHighSavings && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center space-y-3">
            <p className="text-zinc-300 font-medium">
              Want to know when new optimizations apply to your stack?
            </p>
            <p className="text-zinc-500 text-sm">
              We&apos;ll notify you when better pricing or alternatives become
              available.
            </p>
            <Link
              href="/audit"
              className="inline-block bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-5 py-2.5 rounded-xl transition-colors text-sm"
            >
              Update my stack
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
