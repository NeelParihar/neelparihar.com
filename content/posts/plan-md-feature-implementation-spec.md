---
id: 12
title: "The Spec Before the Code: A plan.md Template for Feature Implementation"
description: "The plan.md is the heart of spec-driven development: a feature spec written and approved before an agent writes a line of code. Here's the template, and the workflow around it."
long_description: "A practical guide to the plan contract — the feature-level spec that ties system, skill and memory contracts to a specific piece of work. Includes a complete, downloadable plan.md template, a worked example, the human/agent split for each section, and how engineering leaders can use plan review as their main quality gate."
createdAt: "2026-11-12T09:00:00.000Z"
series: "The Engineering Contract"
seriesOrder: 5
tags:
  - ai
  - spec-driven-development
  - engineering-leadership
  - templates
category: leadership
author:
  name: Neel Parihar
  twitter: neelpariharr
  image: /images/avatar.png
---

So far in this series we've built three layers of contract: the **system contract** (how to behave in this repo), **skill contracts** (how to do a kind of task), and **memory contracts** (what we've learned). All three are reusable. None of them says what to build *right now*.

That's the job of the **plan contract**: a `plan.md` written for one feature, agreed *before* implementation starts, and used as the yardstick when the work comes back.

If you only adopt one practice from this series, make it this one. It's the cheapest, most effective quality gate you can add to AI-assisted engineering.

## Why the plan is the right unit of review

Here's the uncomfortable maths of agentic coding: **agents generate code faster than humans can review it.** If your quality gate is "a senior engineer reads every line of the PR," you've moved the bottleneck from writing to reviewing, and your seniors are now full-time diff readers.

The plan flips that. Instead of reviewing 2,000 lines of output, a reviewer reads a one-to-two-page spec and answers a few questions:

- Is this the right problem?
- Is this the right approach?
- Are the success criteria the right ones?
- Is anything being touched that shouldn't be?

A wrong decision caught in the plan costs a comment. The same wrong decision caught in a PR costs a rewrite. Caught in production, it costs an incident.

**For leaders, this is the key shift: the plan becomes the unit of accountability, not the PR.**

## Who writes what

The split between human and agent is the most important design choice in the template. Intent can't be delegated; investigation can.

| Section | Written by | Why |
|---|---|---|
| 1–4: Context, goals, success criteria, constraints | **Human** | This is intent and judgment. If an agent writes the success criteria, it's grading its own homework. |
| 5–8: Current state, approach, interfaces, steps | **Agent**, reviewed by human | The agent reads the codebase far faster than a person can. The human checks the reasoning. |
| 9–11: Tests, rollout, escalation | Agent drafts, **human approves** | Shared. The human makes sure the risky parts are covered. |
| 12–13: Open questions, decision log | Both, during work | A live record. Feeds memory when the feature ships. |

## The workflow

1. **Human drafts sections 1–4.** Usually 15–30 minutes. If you can't write the success criteria, you're not ready to build the feature.
2. **Agent drafts sections 5–11 in plan / read-only mode.** It reads the code, loads the relevant skills, and proposes an approach — without changing anything.
3. **Plan review.** A reviewer (tech lead, or a peer for small changes) approves, comments, or rejects. Status moves to `Approved`.
4. **Agent implements step by step.** It ticks off steps in section 8, runs each step's verification, and appends to the decision log as it goes.
5. **Escalation.** If any trigger in section 11 fires, the agent stops, updates the plan, and asks. It doesn't improvise its way around a constraint.
6. **Verification against success criteria.** The PR is reviewed against section 3 — not against the reviewer's mood that day.
7. **Close the loop.** The PR description is generated from the plan. The decision log is distilled into `MEMORIES.md`. The plan is archived in `docs/plans/`.

## The template

Here's the full template. You can also [download it as a file](/templates/plan.md) and drop it into `docs/plans/_template.md` in your repo.

```markdown
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

## 1. Context — why are we doing this?
<!-- The problem, who has it, and why now. Link to data, tickets or customer feedback. 3–6 sentences. -->

## 2. Goal and non-goals
**Goal:** <one sentence describing the outcome, not the implementation>

**Non-goals:**
- <explicitly out of scope — things a helpful agent might otherwise "also fix">
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
- `<path/to/file>` — <what it does, why it matters here>
- <relevant data models, endpoints, jobs, flags>

## 6. Proposed approach
<!-- Drafted by the agent. The design in prose. Include alternatives considered and why they were rejected. -->

**Alternatives considered:**
- <option> — rejected because <reason>

## 7. Interfaces and contracts
<!-- New or changed APIs, function signatures, DB schema, events, config, feature flags. -->
- <e.g. `POST /api/payouts/export` → body `{ from, to }` → `202 { jobId }`>
- <e.g. new column `payouts.exported_at TIMESTAMP NULL`>

## 8. Implementation steps
<!-- Ordered. Each step small, independently verifiable, and ideally one commit. -->
- [ ] **Step 1:** <change> — *verify:* <command or check>
- [ ] **Step 2:** <change> — *verify:* <command or check>
- [ ] **Step 3:** <change> — *verify:* <command or check>

## 9. Test plan and evals
- **Unit:** <cases>
- **Integration:** <cases>
- **Edge cases:** <empty input, large input, permissions, concurrency, failure of dependencies>
- **Manual check:** <what a human should click through before merge, if anything>

## 10. Risks, rollout and rollback
- **Risks:** <what could go wrong and its blast radius>
- **Rollout:** <feature flag, % rollout, migration order>
- **Rollback:** <exact steps to undo safely>

## 11. Escalation triggers — stop and ask a human if…
- A step requires touching anything listed under "Must not touch".
- The approach in section 6 turns out not to work and needs to change.
- A success criterion can't be met, or seems wrong.
- A change needs a new dependency, schema change or permission not listed here.
- Tests fail for reasons unrelated to this feature.
- <feature-specific trigger>

## 12. Open questions
- [ ] <question> — *owner:* <name>

## 13. Decision log
<!-- Append-only. Date · decision · reason. Distilled into MEMORIES.md when the feature ships. -->
- <YYYY-MM-DD> · <decision> · <reason>
```

## A worked example (abridged)

To make it concrete, here's what sections 1–4 might look like for a real-ish feature — exporting affiliate payouts as CSV. This is the part a human writes.

```markdown
# Plan: Affiliate payout CSV export

> **Status:** In review
> **Owner:** Payments tech lead
> **Reviewers:** Payments tech lead, Finance ops

## 1. Context — why are we doing this?
Finance reconciles affiliate payouts manually by copying rows from the admin
dashboard into a spreadsheet each month. It takes about two days and has caused
two mis-payments this quarter. They need a downloadable export they can import
directly into the accounting tool.

## 2. Goal and non-goals
**Goal:** Finance can export all payouts for a date range as a CSV in one click.

**Non-goals:**
- Changing how payouts are calculated.
- Scheduled / emailed exports (separate plan).
- Any change to the affiliate-facing dashboard.

## 3. Success criteria
- [ ] Admin users can export payouts for any range up to 12 months.
- [ ] CSV columns match `docs/finance/payout-export-format.md` exactly.
- [ ] Exports of 100k rows complete in under 60s without blocking the API.
- [ ] Non-admin users get 403.
- [ ] No affiliate email or bank details in the export (pii-compliance passes).

## 4. Constraints and boundaries
- **Must not touch:** `src/billing/calculate*`, existing payout tables' columns.
- **Must use:** the existing background job runner in `src/infra/jobs/`.
- **Skills to load:** pii-compliance, background-jobs
- **Compatibility:** additive DB changes only.
```

From there the agent reads the codebase and proposes sections 5–11. A good reviewer will spend most of their time on section 6 (is the approach sound?) and section 11 (are we stopping at the right moments?).

## Common failure modes

Teams new to this tend to fail in the same few ways:

- **The plan is a novel.** If it's longer than about two pages, it's either too big a feature (split it) or the agent is padding. Push back.
- **Success criteria are vibes.** "Works well" and "is performant" are not criteria. Every criterion should be something you could hand to someone else to check.
- **The agent wrote sections 1–4.** Then nobody actually decided what to build. Rejected.
- **The plan is approved and then ignored.** If implementation drifts from the plan, either the plan gets updated (and re-approved for big changes) or the work stops. A plan that doesn't match the code is worse than no plan.
- **Plans pile up forever.** Archive shipped plans. Distil decisions into memory. The plan is a working document, not a permanent one.

## How leaders should measure it

A few signals tell you whether plan contracts are working:

- **Plan rejection rate.** Some rejections are healthy — that's the gate doing its job. Near zero means rubber-stamping. Very high means the human sections aren't clear enough.
- **Rework after merge.** How often does a merged feature need follow-up fixes? This should drop.
- **Escalation frequency.** Agents should escalate sometimes. Never escalating means the triggers are too loose or being ignored.
- **Time from approved plan to merged PR.** This is where the speed-up should show — not in how fast people write plans.

## What leaders should take from this post

1. **Make an approved `plan.md` a precondition** for any agent-implemented feature above a trivial size.
2. **Keep intent human.** Context, goals, success criteria and constraints are written by a person who is accountable for them.
3. **Move your review effort upstream.** Review plans properly; review PRs against the plan.
4. **Close the loop into memory** so every feature makes the next one easier.

The plan says what *should* happen. The last piece of the stack decides what happens when reality disagrees. Last in the series: **Review and Escalation Contracts** — where humans stay in the loop, which contracts are optional, and how to roll all of this out.
