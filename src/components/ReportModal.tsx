"use client";

import { useState } from "react";

type Props = {
  totalMonthlySavings: number;
  tools: string;
  onClose: () => void;
};

export default function ReportModal({ totalMonthlySavings, tools, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          company,
          role,
          totalMonthlySavings,
          tools,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      localStorage.setItem("auditEmail", email);
      setSubmitted(true);
      setTimeout(() => onClose(), 1500);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 p-8 shadow-2xl">

        {/* Skip button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-600 hover:text-zinc-400 text-sm transition-colors"
        >
          Skip →
        </button>

        {submitted ? (
          <div className="text-center space-y-3 py-4">
            <p className="text-4xl">✓</p>
            <p className="text-emerald-400 font-bold text-lg">Report sent!</p>
            <p className="text-zinc-500 text-sm">
              Check your inbox for the full breakdown.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-6">
              {totalMonthlySavings > 0 ? (
                <>
                  <div className="inline-flex items-center gap-2 bg-emerald-950/50 border border-emerald-800 rounded-full px-3 py-1 text-xs text-emerald-400 mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    ${totalMonthlySavings}/mo in savings identified
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Get the full report in your inbox
                  </h2>
                  <p className="text-zinc-400 text-sm mt-2">
                    See the complete per-tool breakdown, overlap analysis, and
                    step-by-step recommendations — delivered to your email.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-white">
                    Your stack looks optimized
                  </h2>
                  <p className="text-zinc-400 text-sm mt-2">
                    Enter your email and we&apos;ll notify you when new
                    optimizations apply to your stack.
                  </p>
                </>
              )}
            </div>

            {/* Form */}
            <div className="space-y-3">
              <input
                type="email"
                placeholder="you@company.com *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 text-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-zinc-600"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 text-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-zinc-600"
                />
                <input
                  type="text"
                  placeholder="Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 text-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-zinc-600"
                />
              </div>

              {error && <p className="text-red-400 text-xs">{error}</p>}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-bold py-3 text-sm transition-colors"
              >
                {loading ? "Sending..." : "Send Me the Full Report →"}
              </button>

              <p className="text-zinc-600 text-xs text-center">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}