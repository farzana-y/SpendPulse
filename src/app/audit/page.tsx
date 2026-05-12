"use client";
import { detectOverlaps, generateAudit } from "@/lib/audit-engine";
import { pricing } from "@/lib/pricing";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

type Subscription = {
  tool: string;
  plan: string;
  monthlySpend: number;
  seats: number;
  teamSize: number;
  useCase: string;
};

const toolPlans = Object.keys(pricing);

export default function AuditPage() {
  const router = useRouter();
  const [tool, setTool] = useState("");
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [monthlySpend, setMonthlySpend] = useState("");
  const [seats, setSeats] = useState("");
  const [plan, setPlan] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [useCase, setUseCase] = useState("");
  const [isAutoCalculated, setIsAutoCalculated] = useState(false);

  // Load persisted state
  useEffect(() => {
    setTool(localStorage.getItem("tool") ?? "");
    setMonthlySpend(localStorage.getItem("monthlySpend") ?? "");
    setSeats(localStorage.getItem("seats") ?? "");
    setPlan(localStorage.getItem("plan") ?? "");
    setTeamSize(localStorage.getItem("teamSize") ?? "");
    setUseCase(localStorage.getItem("useCase") ?? "");
    const saved = localStorage.getItem("subscriptions");
    if (saved) setSubscriptions(JSON.parse(saved));
  }, []);

  // Persist form state
  useEffect(() => {
    localStorage.setItem("tool", tool);
    localStorage.setItem("monthlySpend", monthlySpend);
    localStorage.setItem("seats", seats);
    localStorage.setItem("plan", plan);
    localStorage.setItem("teamSize", teamSize);
    localStorage.setItem("useCase", useCase);
  }, [tool, monthlySpend, seats, plan, teamSize, useCase]);

  // Persist subscriptions
  useEffect(() => {
    localStorage.setItem("subscriptions", JSON.stringify(subscriptions));
  }, [subscriptions]);

  // Auto-calculate spend from pricing data
  useEffect(() => {
    if (!tool || !plan || !seats) return;
    const toolPricing = pricing[tool as keyof typeof pricing];
    const selectedPrice = toolPricing?.[plan as keyof typeof toolPricing];
    if (typeof selectedPrice === "number" && selectedPrice > 0) {
      setMonthlySpend(String(selectedPrice * Number(seats)));
      setIsAutoCalculated(true);
    } else {
      setMonthlySpend("");
      setIsAutoCalculated(false);
    }
  }, [tool, plan, seats]);

  const defaultUseCases = [
    "Writing",
    "Coding",
    "Research",
    "Design",
    "Marketing",
    "Mixed",
  ];

  const apiUseCases = [
    "AI App",
    "Customer Support Bot",
    "Internal Tool",
    "Automation",
    "Research Pipeline",
    "AI Coding Assistant",
    "Document Processing",
    "Chatbot",
  ];

  const isFormValid =
    tool !== "" &&
    plan !== "" &&
    seats !== "" &&
    teamSize !== "" &&
    useCase !== "";

  const handleAdd = () => {
    if (!isFormValid) {
      alert("Please fill in all fields before adding.");
      return;
    }
    setSubscriptions((prev) => [
      ...prev,
      {
        tool,
        plan,
        monthlySpend: Number(monthlySpend) || 0,
        seats: Number(seats),
        teamSize: Number(teamSize),
        useCase,
      },
    ]);
    setTool("");
    setPlan("");
    setMonthlySpend("");
    setSeats("");
    setTeamSize("");
    setUseCase("");
    setIsAutoCalculated(false);
  };

  const handleGenerate = () => {
    if (subscriptions.length === 0) {
      alert("Please add at least one subscription first.");
      return;
    }

    const totalSpend = subscriptions.reduce(
      (total, sub) => total + sub.monthlySpend,
      0,
    );
    const overlaps = detectOverlaps(subscriptions);
    const overlapSavings = overlaps.reduce((t, o) => t + o.savings, 0);

    const auditResults = subscriptions.map((sub) => generateAudit(sub));
    const bestAudit = auditResults.reduce((best, curr) =>
      curr.savings > best.savings ? curr : best,
    );

    const totalSavings = bestAudit.savings + overlapSavings;

    // Pick the right recommendation message based on actual total savings
    const recommendation =
      totalSavings > 0
        ? overlaps.length > 0 && bestAudit.savings === 0
          ? "Overlapping subscriptions detected — consolidation recommended."
          : bestAudit.recommendation
        : "Your current setup looks cost-efficient.";

    const reason =
      totalSavings > 0
        ? overlaps.length > 0 && bestAudit.savings === 0
          ? `You have ${overlaps.length} overlapping AI tool${overlaps.length > 1 ? "s" : ""} that serve similar purposes. See the overlap section below.`
          : bestAudit.reason
        : "No major redundant spending detected.";

    const audits = subscriptions.map((sub) => ({
      tool: sub.tool,
      ...generateAudit(sub),
    }));

    localStorage.setItem(
      "auditResult",
      JSON.stringify({ audits, overlaps, subscriptions }),
    );
    router.push("/results");
  };
  const totalSpend = subscriptions.reduce(
    (total, sub) => total + sub.monthlySpend,
    0,
  );

  const inputClass =
    "w-full rounded-xl border border-zinc-700 bg-zinc-900 text-white p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-zinc-600";
  const selectClass =
    "w-full rounded-xl border border-zinc-700 bg-zinc-900 text-white p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500";

  return (
    <main className="min-h-screen bg-zinc-950 text-white py-12 px-4">
      <Navbar />
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">AI Spend Audit</h1>
          <p className="mt-2 text-zinc-400">
            Add each AI tool your team pays for, then generate your free audit.
          </p>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-5">
          <h2 className="font-semibold text-zinc-200">Add a subscription</h2>

          {/* Tool */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-400">
              Tool
            </label>
            <select
              value={tool}
              onChange={(e) => {
                setTool(e.target.value);
                setPlan("");
                setMonthlySpend("");
                setIsAutoCalculated(false);
              }}
              className={selectClass}
            >
              <option value="">Select a tool</option>
              {toolPlans.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Plan */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-400">
              Plan
            </label>
            <select
              disabled={!tool}
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className={`${selectClass} disabled:opacity-40`}
            >
              <option value="">Select a plan</option>
              {tool &&
                Object.keys(pricing[tool as keyof typeof pricing] || {}).map(
                  (p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ),
                )}
            </select>
          </div>

          {/* Seats + Team Size */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-400">
                Seats (paying users)
              </label>
              <input
                type="number"
                min="1"
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                placeholder="e.g. 5"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-400">
                Team size (total)
              </label>
              <input
                type="number"
                min="1"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                placeholder="e.g. 10"
                className={inputClass}
              />
            </div>
          </div>

          {/* Monthly spend */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-400">
              Monthly Spend ($)
            </label>
            <input
              type="number"
              min="0"
              value={monthlySpend}
              onChange={(e) => {
                setMonthlySpend(e.target.value);
                setIsAutoCalculated(false);
              }}
              placeholder="e.g. 100"
              className={`${inputClass} ${isAutoCalculated ? "text-zinc-400" : ""}`}
            />
            {isAutoCalculated && (
              <p className="mt-1.5 text-xs text-zinc-500">
                Auto-calculated from plan × seats. Adjust if your actual bill
                differs.
              </p>
            )}
            {plan === "Enterprise" && (
              <p className="mt-1.5 text-xs text-zinc-500">
                Enterprise pricing is custom. Enter your actual contract amount.
              </p>
            )}
            {plan === "Pay-as-you-go" && (
              <p className="mt-1.5 text-xs text-zinc-500">
                Enter your average monthly API spend.
              </p>
            )}
          </div>

          {/* Use case */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-400">
              Primary Use Case
            </label>
            <select
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              className={selectClass}
            >
              <option value="">Select use case</option>
              <option value="Coding">Coding</option>
              <option value="Writing">Writing</option>
              <option value="Research">Research</option>
              <option value="Data">Data</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>

          <button
            onClick={handleAdd}
            className="w-full rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3 transition-colors"
          >
            + Add Subscription
          </button>
        </div>

        {/* Subscription list */}
        <div className="mt-8 space-y-3">
          {subscriptions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-800 p-8 text-center text-zinc-600">
              No subscriptions added yet.
            </div>
          ) : (
            <>
              {subscriptions.map((sub, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-white">{sub.tool}</p>
                    <p className="text-sm text-zinc-500 mt-0.5">
                      {sub.plan} · {sub.seats} seat{sub.seats !== 1 ? "s" : ""}{" "}
                      · {sub.useCase}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">${sub.monthlySpend}</p>
                    <p className="text-xs text-zinc-500">/mo</p>
                  </div>
                </div>
              ))}

              {/* Total */}
              <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4 flex items-center justify-between">
                <p className="font-semibold text-zinc-300">
                  Total Monthly Spend
                </p>
                <p className="text-2xl font-bold text-white">${totalSpend}</p>
              </div>
            </>
          )}
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={subscriptions.length === 0}
          className="mt-6 w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold py-4 text-lg transition-colors"
        >
          Generate My Free Audit →
        </button>

        <p className="mt-3 text-center text-xs text-zinc-600">
          No login required. Results are instant.
        </p>
      </div>
    </main>
  );
}
