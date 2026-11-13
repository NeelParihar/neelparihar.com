---
id: 10
title: "Skill Contracts: Surgical Domain Knowledge and Success Criteria That Aren't Vibes"
description: "Skills give agents deep, task-specific knowledge only when they need it. The part most teams skip, success criteria and evals, is what makes them scale."
long_description: "Skill contracts package domain knowledge, tool access, constraints and success criteria for a specific kind of task. This post explains how they differ from system contracts, why domain knowledge should be surgical, and why measurable success criteria and evals are what separate a repeatable engineering system from 'make me an app, make no mistakes'."
createdAt: "2026-11-10T09:00:00.000Z"
series: "The Engineering Contract"
seriesOrder: 3
tags:
  - ai
  - spec-driven-development
  - engineering-leadership
  - evals
category: leadership
author:
  name: Neel Parihar
  twitter: neelpariharr
  image: /images/avatar.png
---

There's a meme from the talk that I can't stop thinking about. A guy at a computer, typing: *"ok ChatGPT, make me an app that makes $1M/month. Don't make any mistakes."*

It's funny because it's exactly how a lot of teams use agents. A goal, a vague constraint, and hope.

**Skill contracts** are the fix. They're where you encode *how your team does a specific kind of work*. Just as important, they define how you'll know it was done right.

## What a skill contract gives the agent

A skill contract enables the AI to:

- **Gain domain knowledge**: the specifics of *this* task in *this* codebase, like the PII rules, the payment provider's quirks, the testing conventions.
- **Access the right tools**, and only the right tools. A skill that writes database migrations might get DB access; a skill that writes documentation doesn't need it.
- **Know its success criteria**: what "done" looks like, in terms a machine can check.
- **Respect constraints**: the hard limits specific to this task, on top of the system contract.

Most agent tools now support skills as a folder containing a `SKILL.md` (with a short name and description the agent uses to decide when to load it) plus any scripts or reference files it needs. The agent only reads the full skill when a task calls for it.

## Skill vs. system contracts

This is the distinction that matters most:

> The PII compliance skill doesn't need to know about your frontend component conventions.
>
> The test-writing skill doesn't need to know about your Stripe webhook signatures.

**Domain knowledge in a skill is surgical: only what's relevant, nothing else.**

![The system contract is always loaded; each task loads only the one skill it needs.](/images/blog/engineering-contract/skill-routing.svg)

The system contract is loaded into every session, so it must be short and universal. Skills are loaded on demand, so they can be deep. That's the trade: when a team crams domain knowledge into `AGENTS.md`, every session pays for knowledge it doesn't use, and the agent gets *worse* at the task in front of it because the signal is diluted.

A useful rule of thumb for leaders reviewing a team's setup:

| If the knowledge is… | It belongs in… |
|---|---|
| True for every task in the repo | System contract (`AGENTS.md`) |
| True for one *kind* of task, across features | A skill |
| True for one specific feature | The feature's `plan.md` |
| Learned during work and worth keeping | Memory |

## Success criteria: the part everyone skips

Without success criteria, you're on vibes. And **vibes don't scale.**

One engineer with good taste can vibe their way to good output, because they're the success criteria. They look at the result and know. But you can't hire enough people with that taste, and they can't review everything. The moment you want ten engineers getting consistent results, "it looks right to me" stops working.

Good success criteria are:

- **Observable**: "all endpoints return within 200ms at p95 in the load test," not "it's fast."
- **Checkable by a machine where possible**: a test passes, a linter is clean, a script exits 0.
- **Specific to the skill**: the migration skill checks reversibility; the PII skill checks that no new field logs raw email addresses.
- **Few**: three to five sharp criteria beat fifteen fuzzy ones.

## Evals: success criteria you can run

The talk underlined one word on that slide: **EVALS**.

An eval is success criteria turned into something you can execute repeatedly. For a skill, that usually means a small set of representative tasks with known-good outcomes, and a check for each one. When you change the skill, you rerun the evals and see whether it got better or worse.

![The eval loop: change the skill, run the eval set, compare the score, keep or revert.](/images/blog/engineering-contract/eval-loop.svg)

This is what turns skills from "prompts someone wrote once" into **engineering assets you can version, test, and improve.** Without evals, every edit to a skill is a guess. With them, it's a measurable change.

You don't need a fancy framework to start. Five real tasks from your backlog, the expected result for each, and a script that checks them is enough.

## An example skill contract

Here's a sketch of a PII compliance skill:

```markdown
---
name: pii-compliance
description: Use when adding or changing any code that stores, logs, transmits or
  displays personal data (email, phone, address, payment details, IP).
---

# PII compliance

## Domain knowledge
- PII fields are tagged with the `@pii` decorator in `src/domain/models/`.
- Logging goes through `logger.safe()`, which redacts `@pii` fields. Never use
  `console.log` or `logger.raw()` with user objects.
- PII may only leave the system via `src/infra/exports/` (audited).

## Tools
- Allowed: read repo, run tests, run `scripts/pii-scan.sh`.
- Not allowed: database access, network calls.

## Constraints
- Never add a new PII field without the `@pii` decorator.
- Never include PII in error messages, URLs, or analytics events.

## Success criteria
1. `scripts/pii-scan.sh` exits 0.
2. Every new model field holding personal data has `@pii`.
3. No new `logger.raw()` or `console.log` calls touching user objects.
4. Tests in `tests/pii/` pass.
```

Notice what it *doesn't* contain: anything about component styles, deployment, or how to write a good commit message. Surgical.

## What leaders should take from this post

1. **Inventory your recurring task types.** Migrations, API endpoints, test writing, data exports, compliance checks. Each recurring type is a candidate skill.
2. **Keep domain knowledge out of `AGENTS.md`.** If it's only relevant sometimes, it's a skill.
3. **Insist on success criteria in every skill.** A skill without success criteria is a prompt, not a contract.
4. **Fund evals.** Even a minimal eval set per skill turns your AI setup from folklore into something you can improve on purpose.

Skills give an agent depth for a task. But every agent session still starts with amnesia. It doesn't remember what it learned yesterday. Next in the series: **Memory Contracts**, and the surprisingly expensive problem of context.
