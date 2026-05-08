"use client";
import { generateAudit } from "@/lib/audit-engine";
import { useEffect, useState } from "react";

export default function AuditPage() {
  const [tool, setTool] = useState("");
  const [monthlySpend, setMonthlySpend] = useState("");
  const [seats, setSeats] = useState("");
  const [plan, setPlan] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [useCase, setUseCase] = useState("");
  const [result, setResult] = useState<any>(null);

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
              onChange={(e) => setTool(e.target.value)}
              className="w-full rounded-xl border p-3"
            >
              <option value="">Select a tool</option>
              <option value="Cursor">Cursor</option>
              <option value="ChatGPT">ChatGPT</option>
              <option value="Claude">Claude</option>
              <option value="Copilot">GitHub Copilot</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium">Monthly Spend ($)</label>

            <input
              type="number"
              value={monthlySpend}
              onChange={(e) => setMonthlySpend(e.target.value)}
              className="w-full rounded-xl border p-3"
            />
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
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="w-full rounded-xl border p-3"
            >
              <option value="">Select a plan</option>
              <option value="Free">Free</option>
              <option value="Pro">Pro</option>
              <option value="Team">Team</option>
              <option value="Enterprise">Enterprise</option>
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
              const audit = generateAudit({
                tool,
                plan,
                monthlySpend: Number(monthlySpend),
                seats: Number(seats),
                teamSize: Number(teamSize),
                useCase,
              });

              setResult(audit);
            }}
            className="rounded-xl bg-black px-6 py-3 text-white"
          >
            Generate Audit
          </button>
          {result && (
            <div className="mt-10 rounded-xl border p-6">
              <h2 className="text-2xl font-bold">Audit Result</h2>

              <p className="mt-4">
                <strong>Recommendation:</strong> {result.recommendation}
              </p>

              <p className="mt-2">
                <strong>Monthly Savings:</strong> ${result.savings}
              </p>

              <p className="mt-2">
                <strong>Annual Savings:</strong> ${result.annualSavings}
              </p>

              <p className="mt-2">
                <strong>Reason:</strong> {result.reason}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
