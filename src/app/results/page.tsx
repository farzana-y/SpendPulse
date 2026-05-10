"use client";

import { useEffect, useState } from "react";
import ResultCard from "@/components/ResultCard";

export default function ResultsPage() {
  type AuditResult = {
    audit: {
      currentSpend: number;
      recommendedSpend: number;
      savings: number;
      annualSavings: number;
      recommendation: string;
      reason: string;
    };
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
  const [result, setResult] = useState<AuditResult | null>(null);

  useEffect(() => {
    const storedResult = localStorage.getItem("auditResult");

    if (storedResult) {
      setResult(JSON.parse(storedResult));
    }
  }, []);

  if (!result) {
    return (
      <main className="p-8">
        <p>No audit result found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold">Audit Results</h1>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <ResultCard
            title="Current Spend"
            value={`$${result.audit.currentSpend}`}
          />

          <ResultCard
            title="Recommended Spend"
            value={`$${result.audit.recommendedSpend}`}
          />

          <ResultCard
            title="Monthly Savings"
            value={`$${result.audit.savings}`}
          />

          <ResultCard
            title="Annual Savings"
            value={`$${result.audit.annualSavings}`}
          />
        </div>
        <div className="mt-8 rounded-xl border p-5">
          <h2 className="text-xl font-semibold">Recommendation</h2>

          <p className="mt-3">{result.audit.recommendation}</p>

          <p className="mt-4 text-sm text-gray-600">{result.audit.reason}</p>
        </div>
        {result.overlaps?.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold">Overlap Detection</h2>

            <div className="mt-4 space-y-4">
              {result.overlaps.map((overlap, index) => (
                <div key={index} className="rounded-xl border p-5">
                  <h3 className="font-semibold">{overlap.title}</h3>

                  <p className="mt-2 text-sm text-gray-600">{overlap.reason}</p>

                  <p className="mt-3 font-bold">
                    Potential Savings: ${overlap.savings}/month
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="mt-10">
          <h2 className="text-2xl font-bold">Active Subscriptions</h2>

          <div className="mt-4 space-y-4">
            {result.subscriptions.map((sub, index) => (
              <div key={index} className="rounded-xl border p-5">
                <p>
                  <strong>Tool:</strong> {sub.tool}
                </p>

                <p>
                  <strong>Plan:</strong> {sub.plan}
                </p>

                <p>
                  <strong>Monthly Spend:</strong> ${sub.monthlySpend}
                </p>

                <p>
                  <strong>Seats:</strong> {sub.seats}
                </p>

                <p>
                  <strong>Use Case:</strong> {sub.useCase}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
