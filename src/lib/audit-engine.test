import { describe, it, expect } from "vitest";
import { generateAudit, detectOverlaps, AuditInput } from "./audit-engine";

// ─── generateAudit tests ────────────────────────────────────────────────────

describe("generateAudit", () => {
  it("TEST 1: recommends downgrade from ChatGPT Team to Plus for very small teams", () => {
    const input: AuditInput = {
      tool: "ChatGPT",
      plan: "Team",
      monthlySpend: 60,
      seats: 2,
      teamSize: 2,
      useCase: "Writing",
    };
    const result = generateAudit(input);

    expect(result.recommendation).toContain("ChatGPT Plus");
    expect(result.savings).toBe(20);
    expect(result.annualSavings).toBe(240);
    expect(result.recommendedSpend).toBe(40);
  });

  it("TEST 2: recommends downgrade from Cursor Business to Pro for small teams", () => {
    const input: AuditInput = {
      tool: "Cursor",
      plan: "Business",
      monthlySpend: 120,
      seats: 3,
      teamSize: 3,
      useCase: "Coding",
    };
    const result = generateAudit(input);

    expect(result.recommendation).toContain("Cursor Pro");
    expect(result.savings).toBe(60);
    expect(result.annualSavings).toBe(720);
  });

  it("TEST 3: recommends downgrade from Claude Team to Pro for small teams", () => {
    const input: AuditInput = {
      tool: "Claude",
      plan: "Team",
      monthlySpend: 60,
      seats: 3,
      teamSize: 3,
      useCase: "Research",
    };
    const result = generateAudit(input);

    expect(result.recommendation).toContain("Claude Pro");
    expect(result.savings).toBe(9);
    expect(result.annualSavings).toBe(108);
  });

  it("TEST 4: recommends downgrade from Github Copilot Enterprise to Business for small teams", () => {
    const input: AuditInput = {
      tool: "Github Copilot",
      plan: "Enterprise",
      monthlySpend: 195,
      seats: 5,
      teamSize: 5,
      useCase: "Coding",
    };
    const result = generateAudit(input);

    expect(result.recommendation).toContain("GitHub Copilot Business");
    expect(result.savings).toBe(100);
    expect(result.annualSavings).toBe(1200);
  });

  it("TEST 5: reports cost-efficient for well-sized plans (no unnecessary savings invented)", () => {
    const input: AuditInput = {
      tool: "ChatGPT",
      plan: "Plus",
      monthlySpend: 20,
      seats: 1,
      teamSize: 1,
      useCase: "Writing",
    };
    const result = generateAudit(input);

    expect(result.savings).toBe(0);
    expect(result.annualSavings).toBe(0);
    expect(result.recommendedSpend).toBe(20);
    expect(result.recommendation).toContain("well-sized");
  });

  it("TEST 6: does NOT flag ChatGPT Team as overkill when team is large enough", () => {
    const input: AuditInput = {
      tool: "ChatGPT",
      plan: "Team",
      monthlySpend: 150,
      seats: 5,
      teamSize: 5,
      useCase: "Mixed",
    };
    const result = generateAudit(input);

    // seats > 2, so no downgrade should be recommended
    expect(result.savings).toBe(0);
    expect(result.recommendation).toContain("well-sized");
  });

  it("TEST 7: annualSavings is always exactly 12x monthly savings", () => {
    const input: AuditInput = {
      tool: "Cursor",
      plan: "Business",
      monthlySpend: 120,
      seats: 2,
      teamSize: 2,
      useCase: "Coding",
    };
    const result = generateAudit(input);

    expect(result.annualSavings).toBe(result.savings * 12);
  });
});

// ─── detectOverlaps tests ───────────────────────────────────────────────────

describe("detectOverlaps", () => {
  it("TEST 8: detects overlap between ChatGPT and Claude subscriptions", () => {
    const subs: AuditInput[] = [
      { tool: "ChatGPT", plan: "Team", monthlySpend: 150, seats: 5, teamSize: 5, useCase: "Writing" },
      { tool: "Claude", plan: "Pro", monthlySpend: 17, seats: 1, teamSize: 1, useCase: "Research" },
    ];
    const overlaps = detectOverlaps(subs);

    expect(overlaps.length).toBeGreaterThanOrEqual(1);
    expect(overlaps[0].title).toContain("ChatGPT");
    expect(overlaps[0].title).toContain("Claude");
    expect(overlaps[0].savings).toBe(17);
  });

  it("TEST 9: detects overlap between Cursor and Copilot subscriptions", () => {
    const subs: AuditInput[] = [
      { tool: "Cursor", plan: "Business", monthlySpend: 120, seats: 3, teamSize: 3, useCase: "Coding" },
      { tool: "Copilot", plan: "Business", monthlySpend: 57, seats: 3, teamSize: 3, useCase: "Coding" },
    ];
    const overlaps = detectOverlaps(subs);

    expect(overlaps.length).toBeGreaterThanOrEqual(1);
    expect(overlaps[0].title).toContain("Cursor");
    expect(overlaps[0].title).toContain("Copilot");
    expect(overlaps[0].savings).toBe(57);
  });

  it("TEST 10: returns no overlaps for a single subscription", () => {
    const subs: AuditInput[] = [
      { tool: "ChatGPT", plan: "Plus", monthlySpend: 20, seats: 1, teamSize: 1, useCase: "Writing" },
    ];
    const overlaps = detectOverlaps(subs);

    expect(overlaps.length).toBe(0);
  });
});