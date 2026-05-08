"use client";

import { useEffect, useState } from "react";

export default function ResultsPage() {
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const storedResult =
      localStorage.getItem("auditResult");

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
        <h1 className="text-4xl font-bold">
          Audit Results
        </h1>

        <div className="mt-10 rounded-2xl border bg-white p-8 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border p-4">
              <p className="text-sm text-gray-500">
                Current Spend
              </p>

              <p className="mt-2 text-2xl font-bold">
                ${result.currentSpend}
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-sm text-gray-500">
                Recommended Spend
              </p>

              <p className="mt-2 text-2xl font-bold">
                ${result.recommendedSpend}
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-sm text-gray-500">
                Monthly Savings
              </p>

              <p className="mt-2 text-2xl font-bold">
                ${result.savings}
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-sm text-gray-500">
                Annual Savings
              </p>

              <p className="mt-2 text-2xl font-bold">
                ${result.annualSavings}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-xl border p-5">
            <h2 className="text-xl font-semibold">
              Recommendation
            </h2>

            <p className="mt-3">
              {result.recommendation}
            </p>

            <p className="mt-4 text-sm text-gray-600">
              {result.reason}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}