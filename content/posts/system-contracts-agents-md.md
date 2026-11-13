---
id: 9
title: "System Contracts: Writing an AGENTS.md Your Agents Actually Follow"
description: "Your repo-wide agent rules are a contract, not an essay. Here's what the best system contracts cover — and why longer files make agents worse, not better."
long_description: "System contracts are the repo-level rules every coding agent reads before it touches your code. This post covers the four things every good AGENTS.md defines — commands, boundaries, never-touch zones, and house style — why bloated files hurt performance and cost, and how engineering leaders should own and govern them."
createdAt: "2026-11-09T09:00:00.000Z"
series: "The Engineering Contract"
seriesOrder: 2
tags:
  - ai
  - spec-driven-development
  - engineering-leadership
  - agents-md
category: leadership
author:
  name: Neel Parihar
  twitter: neelpariharr
  image: /images/avatar.png
---

Every agent session in your codebase starts the same way: the agent reads a file of instructions, then gets to work. That file is your **system contract**. It's the single highest-leverage piece of text in your repo, because every agent, for every engineer, on every task, reads it first.

Most teams treat it as an afterthought. Someone ran an `/init` command once, got a 400-line auto-generated summary of the codebase, committed it, and never looked at it again.

That's a mistake. Here's how to treat it like the contract it is.

## Why AGENTS.md, specifically

For a while, every tool had its own config file. One tool read one filename, another read a different one, a third had a settings panel. If your team used three tools, you maintained three slightly different versions of the truth — and they drifted.

`AGENTS.md` fixed that. It's now stewarded under the Linux Foundation, it was donated as an open format rather than owned by one vendor, and it's cross-functional: most major coding agents and tools read it. That makes it the right place for rules that need to hold regardless of which tool an engineer prefers.

**Leadership takeaway:** standardise on `AGENTS.md` as the canonical system contract. If a tool needs its own file, make that file point back to `AGENTS.md` rather than duplicating it.

## What the best system contracts always cover

A good system contract answers four questions, and very little else.

### 1. Custom commands — "how do I do things here?"

The exact commands to install, run, test, lint, type-check, and build. Agents waste an astonishing amount of time (and tokens) guessing at these. One line each saves dozens of failed attempts.

### 2. Explicit boundaries — "what's in scope?"

Which directories own what. Which modules are safe to refactor freely and which are load-bearing. Where new code should go. If your repo is a monorepo, this is where you say which package owns which concern.

### 3. Things the agent must never touch

This is the section that prevents incidents. Generated files. Migration history. Lockfiles. Secrets and `.env` files. Billing logic that requires a second human reviewer. Vendored code. Anything where an agent's "helpful cleanup" would be catastrophic.

Write these as hard rules, not suggestions. "Never edit files under `db/migrations/`. Create a new migration instead." is a contract. "Be careful with migrations" is a vibe.

### 4. Your "specific" or "unique" code style

Not generic advice the model already knows ("write clean code," "use meaningful names"). Only the things that are *particular to your team* — the conventions an agent would get wrong without being told.

"We use Options API, not Composition API." "Errors are returned, not thrown, in the service layer." "All money is integer cents." Those are worth tokens. "Follow best practices" is not.

## Contracts, not essays

The most counter-intuitive lesson from the talk: **longer system contracts make agents perform worse.**

Three reasons:

- **Longer files are token-expensive.** The system contract is loaded into *every* session. A 2,000-token file across hundreds of daily sessions across your whole team is a real line item.
- **Performance degrades, counter-intuitively.** The more instructions you add, the more the important ones get diluted. A model following 15 sharp rules does better than one wading through 150 soft ones.
- **Bloat compounds.** Every incident adds a rule. Nobody removes old ones. Six months later the file contradicts itself.

A useful test: **for every line, ask "would the agent get this wrong without being told?"** If not, delete it.

## An example system contract

Here's roughly what a healthy one looks like for a typical web service. Notice how short it is.

```markdown
# AGENTS.md

## Commands
- Install: `npm ci`
- Dev server: `npm run dev`
- Test (all): `npm test` · Test (one file): `npm test -- path/to/file`
- Lint + types: `npm run lint && npm run typecheck` (must pass before any commit)

## Boundaries
- `src/api/` — HTTP handlers only. No business logic here.
- `src/domain/` — business logic. Pure functions where possible.
- `src/infra/` — DB, queues, third-party clients.
- New features get a `plan.md` in `docs/plans/` before implementation.

## Never touch
- `db/migrations/*` — never edit; create a new migration.
- `src/billing/**` — read-only for agents. Propose changes in the plan instead.
- `*.generated.ts`, `package-lock.json`, `.env*`

## House style
- Money is integer cents (`amountCents`), never floats.
- Service functions return `Result<T, E>`; do not throw across layers.
- Feature flags via `flags.isEnabled('name')` — never read env vars directly.
- Commit format: `type: short description` (feat, fix, refactor, chore, docs).
```

That's under 300 words, and every line prevents a specific, real mistake.

## Who owns the system contract?

This is a governance question, and it's yours to answer as a leader.

- **Ownership:** the tech lead of the repo owns `AGENTS.md`, the same way they own the CI config. Changes go through normal code review.
- **Change trigger:** when an agent makes the same mistake twice, that's a candidate for a new rule. When a rule hasn't prevented anything in a quarter, that's a candidate for deletion.
- **Review cadence:** a short quarterly pass to prune. Bloat is the default; pruning has to be deliberate.
- **Layering:** in a monorepo, a root `AGENTS.md` holds org-wide rules and each package can have its own, scoped to that package. Keep them non-overlapping.

## What leaders should take from this post

1. **Standardise on `AGENTS.md`** as the single system contract across tools.
2. **Cover the four essentials** — commands, boundaries, never-touch, house style — and resist adding anything else.
3. **Treat length as a cost.** Every line is paid for in tokens and attention on every session.
4. **Assign an owner** and a pruning cadence. An unowned contract rots.

The system contract tells an agent how to behave *everywhere*. But most real work needs deep knowledge of *one* domain — and that knowledge doesn't belong in the system contract. Next in the series: **Skill Contracts**, and why success criteria are the difference between engineering and vibes.
