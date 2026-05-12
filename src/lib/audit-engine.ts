export type AuditInput = {
  tool: string;
  plan: string;
  monthlySpend: number;
  seats: number;
  teamSize: number;
  useCase: string;
};

export type AuditOutput = {
  currentSpend: number;
  recommendedSpend: number;
  savings: number;
  annualSavings: number;
  recommendation: string;
  reason: string;
};

export type OverlapResult = {
  title: string;
  savings: number;
  reason: string;
};

export function generateAudit(input: AuditInput): AuditOutput {
  const { tool, plan, seats, useCase, monthlySpend } = input;
  let recommendation = "";
  let savings = 0;
  let reason = "";

  // ── CURSOR ──────────────────────────────────────────────────────────────────
  if (tool === "Cursor") {
    if (plan === "Ultra" && seats >= 2) {
      recommendation = "Downgrade to Cursor Teams ($40/user)";
      savings = (200 - 40) * seats;
      reason = `Cursor Ultra at $200/user is designed for extreme individual power users. For teams, Ultra's extra quota rarely justifies 5x the cost of Teams ($40/user). At ${seats} seats you're paying $${200 * seats}/mo — Teams would cost $${40 * seats}/mo for the same collaboration features.`;
    } else if (plan === "Ultra" && seats === 1 && useCase !== "Coding") {
      recommendation = "Downgrade to Cursor Pro ($20/user)";
      savings = 200 - 20;
      reason = `Cursor Ultra's $200/mo cost is only justified for full-time agentic coding workflows. For ${useCase.toLowerCase()} use cases, Pro at $20/mo provides the same core AI assistance at 10% of the cost.`;
    } else if (plan === "Pro+" && seats >= 3) {
      recommendation = "Switch to Cursor Teams ($40/user)";
      savings = (60 - 40) * seats;
      reason = `Cursor Pro+ at $60/user gives individual quota boosts. Teams plan at $40/user includes centralized billing and admin controls at a lower per-seat cost for groups of ${seats}+.`;
    } else if ((plan === "Teams" || plan === "Business") && seats <= 3) {
      recommendation = "Switch to Cursor Pro ($20/user)";
      savings = (40 - 20) * seats;
      reason = `Cursor team plans are designed for larger organizations. For ${seats} users, Cursor Pro provides the same core AI coding capabilities at a lower monthly cost.`;
    } else {
      recommendation = "Your Cursor plan looks well-sized.";
      savings = 0;
      reason =
        "Plan and seat count appear appropriate for your team size and use case.";
    }
  }

  // ── GITHUB COPILOT ──────────────────────────────────────────────────────────
  else if (tool === "Copilot" || tool === "Github Copilot") {
    if (plan === "Enterprise" && seats <= 10) {
      recommendation = "Downgrade to GitHub Copilot Business ($19/user)";
      savings = (39 - 19) * seats;
      reason = `Copilot Enterprise at $39/user adds fine-tuned models and enterprise security policies. For teams under 10, Business at $19/user covers the same in-editor AI features. You'd save $${savings}/mo — Enterprise features are typically only needed at 20+ developers with compliance requirements.`;
    } else if (plan === "Pro+" && useCase !== "Coding") {
      recommendation = "Downgrade to GitHub Copilot Pro ($10/user)";
      savings = (39 - 10) * seats;
      reason = `Copilot Pro+ at $39/user unlocks frontier models. For non-coding use cases like ${useCase.toLowerCase()}, standard Pro at $10/user provides the same core completions at 74% less cost.`;
    } else if (plan === "Business" && seats <= 2) {
      recommendation =
        "Switch to GitHub Copilot Pro ($10/user) or Cursor Pro ($20/user)";
      savings = (19 - 10) * seats;
      reason = `GitHub Copilot Business is designed for larger engineering teams needing centralized policy management. For ${seats} developers, Copilot Pro at $10/user is more cost-efficient. Teams wanting deeper AI-native workflows may also consider Cursor Pro as an alternative coding environment.`;
    } else {
      recommendation = "Your GitHub Copilot plan looks appropriate.";
      savings = 0;
      reason = "Plan and seat count appear well-matched to your team size.";
    }
  }

  // ── CLAUDE ──────────────────────────────────────────────────────────────────
  else if (tool === "Claude") {
    if (plan === "Max" && seats >= 2) {
      recommendation = "Switch to Claude Team Standard ($20/user)";
      savings = (100 - 20) * seats;
      reason = `Claude Max at $100/user is an individual high-usage plan. For teams, Team Standard at $20/user includes collaboration features and is 80% cheaper per seat. At ${seats} seats: $${100 * seats}/mo vs $${20 * seats}/mo.`;
    } else if (
      plan === "Max" &&
      useCase !== "Coding" &&
      useCase !== "Research"
    ) {
      recommendation = "Downgrade to Claude Pro ($17/user)";
      savings = (100 - 17) * seats;
      reason = `Claude Max is designed for users who regularly hit Pro's usage limits — typically heavy coders and researchers. For ${useCase.toLowerCase()} use cases, Pro at $17/user provides sufficient access at 83% less cost.`;
    } else if (plan === "Pro" && seats >= 3) {
      recommendation = "Switch to Claude Team Standard ($20/user)";
      savings = Math.max(0, monthlySpend - 20 * seats);
      reason = `Claude Pro is an individual plan. For ${seats}+ users, Team Standard at $20/user is designed for teams and adds shared Projects and centralized billing at roughly the same per-seat cost.`;
    } else if ((plan === "Team Standard" || plan === "Team") && seats <= 3) {
      recommendation = "Switch to Claude Pro ($17/user)";
      savings = (20 - 17) * seats;
      reason = `Claude Team Standard's collaboration features add minimal value for ${seats} users. Pro at $17/user provides the same AI access at a slightly lower cost — team features become worthwhile at 3+ seats.`;
    } else if (
      plan === "Max" &&
      useCase !== "Coding" &&
      useCase !== "Research"
    ) {
      recommendation =
        "Downgrade to Claude Pro ($17/user) or consider ChatGPT Plus ($20/user)";
      savings = (100 - 17) * seats;
      reason = `Claude Max is designed for users who regularly hit Pro's usage limits — typically heavy coders and researchers. For ${useCase.toLowerCase()} use cases, Pro at $17/user provides sufficient access at 83% less cost. Teams focused on general-purpose AI assistance may also find ChatGPT Plus ($20/user) a viable alternative with comparable capabilities for non-specialized workflows.`;
    } else {
      recommendation = "Your Claude plan looks well-sized.";
      savings = 0;
      reason =
        "Plan and seat count appear appropriate for your team size and use case.";
    }
  }

  // ── CHATGPT ──────────────────────────────────────────────────────────────────
  else if (tool === "ChatGPT") {
    if (plan === "Pro" && seats >= 2) {
      recommendation = "Switch to ChatGPT Team ($30/user)";
      savings = (200 - 30) * seats;
      reason = `ChatGPT Pro at $200/user is an individual unlimited-access plan. For teams, Team at $30/user provides collaborative workspaces at 85% less per seat. At ${seats} seats: $${200 * seats}/mo vs $${30 * seats}/mo.`;
    } else if (plan === "Pro" && useCase === "Writing") {
      recommendation =
        "Downgrade to ChatGPT Plus ($20/user) or consider Claude Pro ($17/user) for writing-heavy workflows";
      savings = (200 - 20) * seats;
      reason = `ChatGPT Pro's unlimited reasoning models are typically unnecessary for writing-focused workflows. ChatGPT Plus at $20/user provides GPT-4o access which is sufficient for most content creation tasks at 90% lower cost. Teams primarily focused on long-form writing and editing may also find Claude Pro ($17/user) a cheaper alternative with comparable writing quality.`;
    } else if (plan === "Team" && seats <= 2) {
      recommendation = "Switch to ChatGPT Plus ($20/user)";
      savings = (30 - 20) * seats;
      reason = `ChatGPT Team's collaborative workspace features add limited value for ${seats} users. Plus at $20/user covers the same GPT-4o access — team features become worthwhile at 3+ seats.`;
    } else {
      recommendation = "Your ChatGPT plan looks well-sized.";
      savings = 0;
      reason =
        "Plan and seat count appear appropriate for your team size and use case.";
    }
  }

  // ── GEMINI ──────────────────────────────────────────────────────────────────
  else if (tool === "Gemini") {
    if (plan === "AI Ultra") {
      recommendation = "Downgrade to Gemini AI Pro ($19.99/user)";
      savings = Math.round((249.99 - 19.99) * seats);
      reason = `Gemini AI Ultra at $249.99/user targets enterprise power users needing Gemini's highest-tier models. For most ${useCase.toLowerCase()} workflows, AI Pro at $19.99 provides capable model access at 92% less cost — saving $${Math.round((249.99 - 19.99) * seats)}/mo.`;
    } else if (plan === "AI Pro" && useCase === "Coding") {
      recommendation =
        "Consider Cursor Pro ($20/user) or GitHub Copilot Pro ($10/user) for coding-focused workflows";

      savings = 0;

      reason = `Gemini AI Pro provides strong general-purpose AI capabilities, but dedicated coding tools like Cursor Pro and GitHub Copilot Pro offer deeper IDE integration, codebase awareness, and debugging workflows. For engineering-heavy teams, those tools often provide better productivity ROI at a similar or lower price point.`;
    } else {
      recommendation = "Your Gemini plan looks appropriate.";
      savings = 0;
      reason = "Plan and seat count appear well-matched to your use case.";
    }
  }

  // ── V0 ──────────────────────────────────────────────────────────────────────
  else if (tool === "v0") {
    if (plan === "Business" && seats <= 5) {
      recommendation = "Downgrade to v0 Team ($30/user)";
      savings = (100 - 30) * seats;
      reason = `v0 Business at $100/user is designed for larger organizations. For teams under 5, Team at $30/user covers the same generative UI capabilities at 70% less cost — saving $${(100 - 30) * seats}/mo.`;
    } else if (plan === "Team" && useCase !== "Coding") {
      recommendation =
        "Downgrade to v0 Free tier or Cursor Pro ($20/user) for coding use cases";
      savings = 30 * seats;
      reason = `v0 is optimized for frontend UI generation workflows. For non-development use cases, the free tier is likely sufficient. Developers already using Cursor may also find overlapping UI generation capabilities through Cursor's AI composer features.`;
    } else {
      recommendation = "Your v0 plan looks appropriate.";
      savings = 0;
      reason =
        "Plan appears well-matched to your team size and development workflow.";
    }
  }

  // ── WINDSURF ────────────────────────────────────────────────────────────────
  else if (tool === "Windsurf") {
    if (plan === "Teams" && seats <= 2) {
      recommendation = "Switch to Windsurf Pro ($15/user)";
      savings = (30 - 15) * seats;
      reason = `Windsurf Teams at $30/user adds centralized billing and admin analytics — unnecessary for ${seats} users. Pro at $15/user provides the same Cascade AI agent access at half the cost.`;
    } else {
      recommendation = "Your Windsurf plan looks well-sized.";
      savings = 0;
      reason = "Plan and seat count appear appropriate.";
    }
  }

  // ── ANTHROPIC API / OPENAI API ───────────────────────────────────────────────
  else if (tool === "Anthropic API" || tool === "OpenAI API") {
    const provider = tool === "Anthropic API" ? "Anthropic" : "OpenAI";
    if (monthlySpend >= 1000) {
      recommendation =
        "Your usage is large enough to qualify for lower enterprise pricing from " +
        provider;
      savings = Math.round(monthlySpend * 0.15);
      reason = `At roughly $${monthlySpend}/mo in API usage, your company may qualify for discounted enterprise pricing from ${provider}. Businesses at this level often reduce costs by committing to predictable monthly usage or negotiating volume-based pricing. Estimated potential savings: $${Math.round(monthlySpend * 0.15)}/mo.`;
    } else if (monthlySpend >= 500) {
      recommendation = "Enable prompt caching and batch API";
      savings = Math.round(monthlySpend * 0.3);
      reason = `At $${monthlySpend}/mo, enabling prompt caching (saves ~90% on repeated context) and batch processing (50% off non-realtime tasks) could reduce your bill by 25-40%. These are free features built into the API — no plan change required.`;
    } else if (monthlySpend > 0 && monthlySpend < 100) {
      recommendation = "Consider a subscription plan instead of API direct";
      savings = 0;
      reason = `At $${monthlySpend}/mo API usage, a subscription plan (Claude Pro $17/mo or ChatGPT Plus $20/mo) may offer better value — predictable billing and higher rate limits without managing token budgets manually.`;
    } else {
      recommendation = "Your API usage looks appropriately sized.";
      savings = 0;
      reason =
        "Usage-based billing is the right choice at your current spend level.";
    }
  }

  // ── FALLBACK ─────────────────────────────────────────────────────────────────
  else {
    recommendation = "Your current setup looks cost-efficient.";
    savings = 0;
    reason =
      "No major optimization opportunities detected based on your current inputs.";
  }

  savings = Math.max(0, Math.min(savings, monthlySpend));

  return {
    currentSpend: monthlySpend,
    recommendedSpend: monthlySpend - savings,
    savings,
    annualSavings: savings * 12,
    recommendation,
    reason,
  };
}

// ─── Cross-tool overlap detection ────────────────────────────────────────────

export function detectOverlaps(subscriptions: AuditInput[]): OverlapResult[] {
  const results: OverlapResult[] = [];

  const has = (toolName: string) =>
    subscriptions.some((s) => s.tool === toolName);
  const get = (toolName: string) =>
    subscriptions.find((s) => s.tool === toolName);

  // ChatGPT + Claude — both general-purpose AI assistants
  if (has("ChatGPT") && has("Claude")) {
    const cheaper = Math.min(
      get("ChatGPT")!.monthlySpend,
      get("Claude")!.monthlySpend,
    );
    results.push({
      title: "Overlap: ChatGPT and Claude",
      savings: cheaper,
      reason: `Both cover general-purpose AI assistance, writing, and reasoning. Most teams pick one as primary and use the other's free tier for comparison. Dropping the cheaper subscription saves $${cheaper}/mo unless your team has workflows requiring both specifically.`,
    });
  }

  // Cursor + GitHub Copilot — both AI coding assistants
  if (has("Cursor") && (has("Copilot") || has("GitHub Copilot"))) {
    const copilot = (get("Copilot") || get("GitHub Copilot"))!;
    results.push({
      title: "Overlap: Cursor and GitHub Copilot",
      savings: copilot.monthlySpend,
      reason: `Both provide AI-powered code completions and chat in the editor. Cursor's deeper IDE integration makes Copilot largely redundant for teams already on Cursor — you're paying twice for the same core coding workflow.`,
    });
  }

  // Cursor + Windsurf — both AI code editors
  if (has("Cursor") && has("Windsurf")) {
    const windsurf = get("Windsurf")!;
    results.push({
      title: "Overlap: Cursor and Windsurf",
      savings: windsurf.monthlySpend,
      reason: `Both are AI-first code editors with similar capabilities. Developers use one editor, not two — running both is full spend overlap. Pick based on which model integration fits your workflow.`,
    });
  }

  // Claude subscription + Anthropic API — same models, two channels
  if (has("Claude") && has("Anthropic API")) {
    const api = get("Anthropic API")!;
    const claudeSub = get("Claude")!;
    if (api.monthlySpend > 0 && claudeSub.monthlySpend > 0) {
      results.push({
        title: "Overlap: Claude subscription and Anthropic API direct",
        savings: Math.min(claudeSub.monthlySpend, api.monthlySpend),
        reason: `You're accessing Claude models via both subscription and API — the same underlying models through two billing channels. Subscription is better for conversational use; API for building applications. Running both is rarely justified.`,
      });
    }
  }

  // ChatGPT + OpenAI API — same models, two channels
  if (has("ChatGPT") && has("OpenAI API")) {
    const api = get("OpenAI API")!;
    const chatgpt = get("ChatGPT")!;
    if (api.monthlySpend > 0 && chatgpt.monthlySpend > 0) {
      results.push({
        title: "Overlap: ChatGPT subscription and OpenAI API direct",
        savings: Math.min(chatgpt.monthlySpend, api.monthlySpend),
        reason: `ChatGPT subscription and OpenAI API both access GPT models. Paying for both means you're using one channel suboptimally — consolidate to whichever fits your primary use pattern.`,
      });
    }
  }

  // Cursor Ultra + Claude coding subscription — Ultra includes Claude access
  if (has("Cursor") && has("Claude")) {
    const cursor = get("Cursor")!;
    const claude = get("Claude")!;
    if (cursor.plan === "Ultra" && claude.useCase === "Coding") {
      results.push({
        title:
          "Overlap: Cursor Ultra includes Claude — separate subscription redundant",
        savings: claude.monthlySpend,
        reason: `Cursor Ultra ($200/user) includes generous built-in Claude model usage. A separate Claude subscription used primarily for coding duplicates that access — saving $${claude.monthlySpend}/mo by relying on Cursor's integrated Claude.`,
      });
    }
  }

  // v0 + Cursor for coding — significant feature overlap
  if (has("v0") && has("Cursor")) {
    const v0sub = get("v0")!;
    if (v0sub.useCase === "Coding") {
      results.push({
        title: "Overlap: v0 and Cursor for UI generation",
        savings: Math.round(v0sub.monthlySpend * 0.5),
        reason: `v0 specializes in generating React/UI components. Cursor handles the same through its AI Composer. For most coding workflows, Cursor covers 80% of v0's use case — consider whether v0 adds enough beyond what your AI editor already does.`,
      });
    }
  }

  return results;
}
