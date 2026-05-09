"use client";

import { useEffect, useState } from "react";
import ResultCard from "@/components/ResultCard";

export default function ResultsPage() {
  const [result, setResult] = useState<any>(null);

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
          <ResultCard title="Current Spend" value={`$${result.currentSpend}`} />

          <ResultCard
            title="Recommended Spend"
            value={`$${result.recommendedSpend}`}
          />

          <ResultCard title="Monthly Savings" value={`$${result.savings}`} />

          <ResultCard
            title="Annual Savings"
            value={`$${result.annualSavings}`}
          />
        </div>
      </div>
    </main>
  );
}
