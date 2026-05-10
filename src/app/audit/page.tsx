"use client";
import { detectOverlaps } from "@/lib/audit-engine";
import { pricing } from "@/lib/pricing";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
type Subscription = {
  tool: string;
  plan: string;
  monthlySpend: number;
  seats: number;
  teamSize: number;
  useCase: string;
};
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
 
  useEffect(() => {
    const savedTool = localStorage.getItem("tool");
    const savedSpend = localStorage.getItem("monthlySpend");
    const savedSeats = localStorage.getItem("seats");
    const savedPlan = localStorage.getItem("plan");
    const savedTeamSize = localStorage.getItem("teamSize");
    const savedUseCase = localStorage.getItem("useCase");

    if (savedTool) setTool(savedTool);
    if (savedSpend) setMonthlySpend(savedSpend);
    if (savedSeats) setSeats(savedSeats);
    if (savedPlan) setPlan(savedPlan);
    if (savedTeamSize) setTeamSize(savedTeamSize);
    if (savedUseCase) setUseCase(savedUseCase);
  }, []);
  useEffect(() => {
    localStorage.setItem("tool", tool);
    localStorage.setItem("monthlySpend", monthlySpend);
    localStorage.setItem("seats", seats);
    localStorage.setItem("plan", plan);
    localStorage.setItem("teamSize", teamSize);
    localStorage.setItem("useCase", useCase);
  }, [tool, monthlySpend, seats, plan, teamSize, useCase]);
  useEffect(() => {
    if (!tool || !plan || !seats) return;

    const selectedPrice =
      pricing[tool as keyof typeof pricing]?.[
        plan as keyof (typeof pricing)[keyof typeof pricing]
      ];

    if (selectedPrice !== null && typeof selectedPrice === "number") {
      const total = selectedPrice * Number(seats);

      setMonthlySpend(String(total));
      setIsAutoCalculated(true);
    } else {
      setMonthlySpend("");
    }
  }, [tool, plan, seats]);
  const toolPlans = Object.keys(pricing);
  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold">AI Spend Audit</h1>

        <p className="mt-2 text-muted-foreground">
          Tell us about your AI stack.
        </p>

        <div className="mt-10 space-y-6">
          <div>
            <label className="mb-2 block font-medium">Tool</label>

            <select
              value={tool}
              onChange={(e) => {
                setTool(e.target.value);
                setPlan("");
                setMonthlySpend("");
              }}
              className="w-full rounded-xl border p-3"
            >
              <option value="">Select a tool</option>
              {toolPlans.map((toolName) => (
                <option key={toolName} value={toolName}>
                  {toolName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium">Monthly Spend ($)</label>

            <input
              type="number"
              value={monthlySpend}
              onChange={(e) => {
                setMonthlySpend(e.target.value);
                setIsAutoCalculated(false);
              }}
              className={`w-full rounded-xl border p-3 ${
                isAutoCalculated ? "bg-gray-50 text-gray-500" : "bg-white"
              }`}
            />
            {isAutoCalculated && (
              <p className="mt-2 text-sm text-gray-500">
                Estimated from selected plan and seats. You can adjust this to
                reflect actual monthly spending.
              </p>
            )}
            {plan === "Enterprise" && (
              <p className="mt-2 text-sm text-gray-500">
                Enterprise pricing is custom and may vary depending on
                organization size and contract terms.
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block font-medium">Number of Seats</label>

            <input
              type="number"
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
              className="w-full rounded-xl border p-3"
            />
          </div>
          <div>
            <label className="mb-2 block font-medium">Plan</label>

            <select
              disabled={!tool}
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="w-full rounded-xl border p-3"
            >
              <option value="">Select a plan</option>
              {tool &&
                Object.keys(pricing[tool as keyof typeof pricing] || {})
                  .filter((plan) => plan !== "API")
                  .map((planOption) => (
                    <option key={planOption} value={planOption}>
                      {planOption}
                    </option>
                  ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block font-medium">Team Size</label>

            <input
              type="number"
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)}
              className="w-full rounded-xl border p-3"
            />
          </div>
          <div>
            <label className="mb-2 block font-medium">Primary Use Case</label>

            <select
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              className="w-full rounded-xl border p-3"
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
            onClick={() => {
              if (subscriptions.length === 0) {
                alert("Please add at least one subscription.");
                return;
              }

              const totalSpend = subscriptions.reduce(
                (total, sub) => total + sub.monthlySpend,
                0,
              );

              const overlaps = detectOverlaps(subscriptions);

              const totalSavings = overlaps.reduce(
                (total, overlap) => total + overlap.savings,
                0,
              );

              const audit = {
                currentSpend: totalSpend,

                recommendedSpend: totalSpend - totalSavings,

                savings: totalSavings,

                annualSavings: totalSavings * 12,

                recommendation:
                  overlaps.length > 0
                    ? "Optimization opportunities detected."
                    : "Current setup appears cost-efficient.",

                reason:
                  overlaps.length > 0
                    ? "Multiple overlapping AI subscriptions were identified."
                    : "No major redundant spending detected.",
              };

              localStorage.setItem(
                "auditResult",
                JSON.stringify({
                  audit,
                  overlaps,
                  subscriptions,
                }),
              );

              router.push("/results");
            }}
            className="rounded-xl border px-6 py-3"
          >
            Generate Audit
          </button>
          <button
            onClick={() => {
              if (
                tool === "" ||
                plan === "" ||
                monthlySpend === "" ||
                seats === "" ||
                teamSize === "" ||
                useCase === ""
              ) {
                alert("Please fill all fields.");
                return;
              }

              const newSubscription = {
                tool,
                plan,
                monthlySpend: Number(monthlySpend),
                seats: Number(seats),
                teamSize: Number(teamSize),
                useCase,
              };

              setSubscriptions([...subscriptions, newSubscription]);

              setTool("");
              setPlan("");
              setMonthlySpend("");
              setSeats("");
              setTeamSize("");
              setUseCase("");
            }}
            className="mt-4 rounded-xl bg-black px-6 py-3 text-white"
          >
            Add Subscription
          </button>
          <div className="mt-10 space-y-4">
            {subscriptions.map((sub, index) => (
              <div
                key={index}
                className="rounded-2xl border bg-white p-5 shadow-sm"
              >
                <p>
                  <strong>Tool:</strong> {sub.tool}
                </p>

                <div className="mt-2">
                  <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm font-medium">
                    {sub.plan}
                  </span>
                </div>

                <p>
                  <strong>Monthly Spend:</strong> ${sub.monthlySpend}
                </p>
              </div>
            ))}
            {subscriptions.length === 0 && (
              <div className="rounded-2xl border border-dashed p-8 text-center text-gray-500">
                No subscriptions added yet.
              </div>
            )}
          </div>
          {subscriptions.length > 0 && (
            <p className="mt-6 text-2xl font-bold">
              Total Monthly Spend: $
              {subscriptions.reduce(
                (total, sub) => total + sub.monthlySpend,
                0,
              )}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
