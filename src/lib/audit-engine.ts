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

  if (input.tool === "ChatGPT" && input.plan === "Team" && input.seats <= 2) {
    recommendation = "Switch to ChatGPT Plus";
    savings = 20;

    reason =
      "Team plans may be unnecessary for very small teams with lightweight collaboration needs.";
  } else if (
    input.tool === "Cursor" &&
    input.plan === "Business" &&
    input.teamSize <= 3
  ) {
    recommendation = "Switch to Cursor Pro";

    savings = 40;

    reason =
      "Cursor Business features may not justify the additional cost for smaller teams.";
  } else if (
    input.tool === "Claude" &&
    input.plan === "Team" &&
    input.teamSize <= 3
  ) {
    recommendation = "Switch to Claude Pro";

    savings = 30;

    reason =
      "Claude Team pricing may be unnecessary for smaller teams without advanced collaboration needs.";
  } else if (
    input.tool === "Copilot" &&
    input.plan === "Enterprise" &&
    input.teamSize <= 5
  ) {
    recommendation = "Switch to GitHub Copilot Business";

    savings = 50;

    reason =
      "Enterprise-grade administrative controls may not be necessary for smaller engineering teams.";
  } else {
    recommendation = "Your current setup looks cost-efficient.";

    savings = 0;

    reason =
      "No major optimization opportunities were detected based on your current inputs.";
  }

  return {
    currentSpend: input.monthlySpend,

    recommendedSpend: input.monthlySpend - savings,

    savings,

    annualSavings: savings * 12,

    recommendation,

    reason,
  };
}
export function detectOverlaps(
  subscriptions: any[]
) {
  const recommendations = [];

  const hasChatGPT = subscriptions.some(
    (sub) => sub.tool === "ChatGPT"
  );

  const hasClaude = subscriptions.some(
    (sub) => sub.tool === "Claude"
  );

  const hasCursor = subscriptions.some(
    (sub) => sub.tool === "Cursor"
  );

  const hasCopilot = subscriptions.some(
    (sub) => sub.tool === "Copilot"
  );

  if (hasChatGPT && hasClaude) {
    recommendations.push({
      title:
        "Potential overlap between ChatGPT and Claude",

      savings: 20,

      reason:
        "Both tools provide strong general-purpose AI assistance. Some teams may not require premium subscriptions to both simultaneously.",
    });
  }

  if (hasCursor && hasCopilot) {
    recommendations.push({
      title:
        "Potential overlap between Cursor and Copilot",

      savings: 19,

      reason:
        "Both tools serve AI-assisted coding workflows and may create redundant spend for smaller teams.",
    });
  }

  return recommendations;
}
