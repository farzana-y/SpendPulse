"use client";

import { useState } from "react";

export default function AuditPage() {
  const [tool, setTool] = useState("");
  const [monthlySpend, setMonthlySpend] = useState("");
  const [seats, setSeats] = useState("");

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold">
          AI Spend Audit
        </h1>

        <p className="mt-2 text-muted-foreground">
          Tell us about your AI stack.
        </p>

        <div className="mt-10 space-y-6">
          <div>
            <label className="mb-2 block font-medium">
              Tool
            </label>

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
            <label className="mb-2 block font-medium">
              Monthly Spend ($)
            </label>

            <input
              type="number"
              value={monthlySpend}
              onChange={(e) => setMonthlySpend(e.target.value)}
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Number of Seats
            </label>

            <input
              type="number"
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
              className="w-full rounded-xl border p-3"
            />
          </div>

          <button className="rounded-xl bg-black px-6 py-3 text-white">
            Generate Audit
          </button>
        </div>
      </div>
    </main>
  );
}