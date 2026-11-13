# Plan: <Feature name>

> **Status:** Draft | In review | Approved | In progress | Shipped
> **Owner:** <human accountable for this feature>
> **Reviewers:** <who must approve this plan before implementation>
> **Linked issue:** <ticket / issue URL>
> **Last updated:** <YYYY-MM-DD>

<!--
How to use this file
- Sections 1–4 are written by a HUMAN. They capture intent and cannot be delegated.
- Sections 5–8 are drafted by the AGENT (in plan / read-only mode) after reading the codebase.
- The plan is reviewed and set to "Approved" BEFORE any implementation starts.
- During implementation the agent ticks off steps (section 8) and appends to the
  decision log (section 13). It never rewrites sections 1–4.
- Anything in section 11 means: stop, update this file, and ask a human.
-->

## 1. Context: why are we doing this?
<!-- The problem, who has it, and why now. Link to data, tickets or customer feedback. 3–6 sentences. -->

## 2. Goal and non-goals
**Goal:** <one sentence describing the outcome, not the implementation>

**Non-goals:**
- <explicitly out of scope: things a helpful agent might otherwise "also fix">
- <…>

## 3. Success criteria
<!-- Observable and, wherever possible, machine-checkable. 3–5 items. -->
- [ ] <e.g. `GET /api/x` returns 200 with schema Y for an authenticated user>
- [ ] <e.g. p95 latency under 200ms in `npm run load-test`>
- [ ] <e.g. all existing tests pass; new tests cover the cases in section 9>
- [ ] <e.g. no new lint or type errors>

## 4. Constraints and boundaries
<!-- Feature-specific rules ON TOP of AGENTS.md and any skills. -->
- **Must not touch:** <files / modules / tables that are off-limits for this feature>
- **Must use:** <existing utilities, patterns or services to reuse>
- **Skills to load:** <e.g. pii-compliance, db-migrations>
- **Compatibility:** <backward compatibility, API versioning, data constraints>

## 5. Current state
<!-- Drafted by the agent. What exists today that this feature touches. -->
- `<path/to/file>`: <what it does, why it matters here>
- <relevant data models, endpoints, jobs, flags>

## 6. Proposed approach
<!-- Drafted by the agent. The design in prose. Include alternatives considered and why they were rejected. -->

**Alternatives considered:**
- <option>: rejected because <reason>

## 7. Interfaces and contracts
<!-- New or changed APIs, function signatures, DB schema, events, config, feature flags. -->
- <e.g. `POST /api/payouts/export` → body `{ from, to }` → `202 { jobId }`>
- <e.g. new column `payouts.exported_at TIMESTAMP NULL`>

## 8. Implementation steps
<!-- Ordered. Each step small, independently verifiable, and ideally one commit. -->
- [ ] **Step 1:** <change>. *Verify:* <command or check>
- [ ] **Step 2:** <change>. *Verify:* <command or check>
- [ ] **Step 3:** <change>. *Verify:* <command or check>

## 9. Test plan and evals
- **Unit:** <cases>
- **Integration:** <cases>
- **Edge cases:** <empty input, large input, permissions, concurrency, failure of dependencies>
- **Manual check:** <what a human should click through before merge, if anything>

## 10. Risks, rollout and rollback
- **Risks:** <what could go wrong and its blast radius>
- **Rollout:** <feature flag, % rollout, migration order>
- **Rollback:** <exact steps to undo safely>

## 11. Escalation triggers: stop and ask a human if…
- A step requires touching anything listed under "Must not touch".
- The approach in section 6 turns out not to work and needs to change.
- A success criterion can't be met, or seems wrong.
- A change needs a new dependency, schema change or permission not listed here.
- Tests fail for reasons unrelated to this feature.
- <feature-specific trigger>

## 12. Open questions
- [ ] <question>, *owner:* <name>

## 13. Decision log
<!-- Append-only. Date · decision · reason. Distilled into MEMORIES.md when the feature ships. -->
- <YYYY-MM-DD> · <decision> · <reason>
