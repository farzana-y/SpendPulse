# Automated Tests

Run with: `npm run test`

File: `src/lib/audit-engine.test.ts`

| Test | What it covers |
|---|---|
| TEST 1 | ChatGPT Team → Plus downgrade for small teams |
| TEST 2 | Cursor Business → Pro downgrade for small teams |
| TEST 3 | Claude Team → Pro downgrade for small teams |
| TEST 4 | Copilot Enterprise → Business downgrade |
| TEST 5 | No savings invented for optimal plans |
| TEST 6 | ChatGPT Team not flagged when team is large enough |
| TEST 7 | Annual savings always = 12x monthly |
| TEST 8 | ChatGPT + Claude overlap detected |
| TEST 9 | Cursor + Copilot overlap detected |
| TEST 10 | No overlap for single subscription |

# TEST CASE 1 — ChatGPT + Claude overlap

| Tool     | Plan | Spend | Seats | Team Size | Use Case |
|-----------|------|--------|--------|------------|-----------|
| ChatGPT  | Team | 150    | 5      | 5          | Writing   |
| Claude   | Pro  | 60     | 3      | 3          | Research  |

---

# TEST CASE 2 — Cursor + Copilot overlap

| Tool    | Plan      | Spend | Seats | Team Size | Use Case |
|----------|-----------|--------|--------|------------|-----------|
| Cursor  | Business  | 120    | 3      | 3          | Coding    |
| Copilot | Business  | 57     | 3      | 3          | Coding    |

---

# TEST CASE 3 — Enterprise overkill

| Tool   | Plan       | Spend | Seats | Team Size | Use Case |
|---------|------------|--------|--------|------------|-----------|
| Cursor | Enterprise | 300    | 2      | 2          | Coding    |

---

# TEST CASE 4 — Healthy spending

| Tool     | Plan | Spend | Seats | Team Size | Use Case |
|-----------|------|--------|--------|------------|-----------|
| ChatGPT  | Plus | 20     | 1      | 1          | Writing   |

---

# TEST CASE 5 — Multiple overlaps

| Tool     | Plan     | Spend |
|-----------|----------|--------|
| ChatGPT  | Team     | 150    |
| Claude   | Team     | 120    |
| Cursor   | Business | 120    |
| Copilot  | Business | 57     |