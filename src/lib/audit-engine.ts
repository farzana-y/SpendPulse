type AuditInput = {
  tool: string;
  plan: string;
  monthlySpend: number;
  seats: number;
  teamSize: number;
  useCase: string;
};

export function generateAudit(input: AuditInput) {
  let recommendation = "";
  let savings = 0;
  let reason = "";

  if (
    input.tool === "ChatGPT" &&
    input.plan === "Team" &&
    input.seats <= 2
  ) {
    recommendation = "Switch to ChatGPT Plus";
    savings = 20;

    reason =
      "Team plans may be unnecessary for very small teams with lightweight collaboration needs.";
  }

  else if (
    input.tool === "Cursor" &&
    input.plan === "Business" &&
    input.teamSize <= 3
  ) {
    recommendation = "Switch to Cursor Pro";

    savings = 40;

    reason =
      "Cursor Business features may not justify the additional cost for smaller teams.";
  }

  else {
    recommendation = "Your current setup looks cost-efficient.";

    savings = 0;

    reason =
      "No major optimization opportunities were detected based on your current inputs.";
  }

  return {
    recommendation,
    savings,
    annualSavings: savings * 12,
    reason,
  };
}