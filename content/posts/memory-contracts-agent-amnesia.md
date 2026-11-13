---
id: 11
title: "Memory Contracts: Curing Agent Amnesia Without Blowing Your Token Budget"
description: "Every agent session starts with amnesia. Memory fixes that, but unmanaged memory goes stale, duplicates, and quietly becomes your biggest token cost."
long_description: "Memory contracts define what an agent remembers between sessions, where it lives, who writes it, how long it persists, and what gets forgotten. This post covers the five memory problems (amnesia, the context ceiling, stale memory, eviction and duplication) and why input context is now the dominant share of AI spend."
createdAt: "2026-11-11T09:00:00.000Z"
series: "The Engineering Contract"
seriesOrder: 4
tags:
  - ai
  - spec-driven-development
  - engineering-leadership
  - context-engineering
category: leadership
author:
  name: Neel Parihar
  twitter: neelpariharr
  image: /images/avatar.png
---

The talk introduced memory contracts with a still from *Ghajini*. Its protagonist can't form new memories and runs his life on tattoos, Polaroids and notes to himself.

It's the perfect metaphor. **Every agent session starts with amnesia.** Whatever it figured out yesterday is gone: the weird reason a test is flaky, the decision to use one library over another, the fact that the staging database is shared. Unless someone wrote it down.

Memory is how you write it down. A **memory contract** is how you stop those notes from turning into a mess.

## What a memory contract defines

A memory contract answers five questions:

1. **What gets remembered**: decisions and their reasoning, non-obvious gotchas, conventions discovered during work. Not transcripts. Not things already in the code.
2. **Where it lives**: a file in the repo (like `MEMORIES.md` or a `docs/decisions/` folder), the agent tool's own memory store, or both. Repo files are reviewable and shared; tool memory is convenient but often per-person.
3. **Who writes it**: the agent proposes, a human approves? Agents write freely to a scratch area that gets promoted? This has to be explicit.
4. **How long it persists**: forever, until the related code changes, or for the duration of a feature.
5. **What gets forgotten**: the rules for pruning, and who does it.

## The five memory problems

Without a contract, teams run into the same problems in roughly this order.

### 1. Amnesia

The default. Each session rediscovers the same facts, makes the same wrong first attempt, and burns the same tokens getting back to where the last session ended. Painful, but at least it's obvious.

### 2. The context ceiling

Long-running agents hit a context ceiling. As a session (or a pile of memory) grows, everything has to fit in the model's context window, and quality drops well before you hit the hard limit.

This isn't only a quality problem. It's a cost problem, and it's growing. Data shared in the talk showed:

- **Input tokens went from ~82% to ~92% of input/output token volume** between January and April 2026.
- **Input tokens' share of price-equivalent cost rose from ~48% to ~70%** over the same period, even though input tokens are cheaper per unit.

![Input tokens rose from 81.9% to 91.9% of token volume and from 47.5% to 69.5% of token cost between January and April 2026.](/images/blog/engineering-contract/token-share.svg)

Put plainly: **past context is taking the lion's share of your AI spend.** The tokens you pay for most are the ones you're feeding *in*, not the ones the model writes. Every bloated memory file, every over-long system contract, every session that drags the whole conversation along is a line item.

For a leader, this reframes "memory" from a developer-experience nicety into a **cost-control lever.**

### 3. Stale memory

The memory says "the payments service uses API v2." That was true in March. It's November. The agent confidently writes v2 code against a v3 service.

Stale memory is worse than no memory, because the agent trusts it.

### 4. Eviction

When memory gets too big, something has to go. If you don't decide what, the tool will, often by recency, which means your most important architectural decision from six months ago is the first thing dropped.

### 5. Duplication

Three engineers each teach their agent the same fact, in three slightly different phrasings, in three places. Now you pay for it three times, and when it changes, you'll update one.

…and more. Contradictions between memory and code, memory leaking between unrelated projects, personal preferences masquerading as team rules. They all trace back to the same root cause: nobody decided how memory works.

## An example memory contract

Here's a lightweight version that works for most teams. It lives at the top of the memory file itself, so every agent that reads the file reads the rules too.

```markdown
# MEMORIES.md

<!-- Contract:
- Record: decisions + reasoning, non-obvious gotchas. Never: things visible in code.
- Format: one entry per item, dated, with the file/module it relates to.
- Writing: agents propose entries in PRs; humans approve in review.
- Expiry: an entry is removed when the code it describes is deleted or rewritten.
- Size budget: keep this file under ~150 lines. Prune before adding past that.
-->

## Decisions
- 2026-10-02 · `src/billing/` · Chose idempotency keys over DB locks for payout
  retries: locks deadlocked under the nightly batch. See PR #412.
- 2026-10-19 · `src/infra/queue.ts` · Max 3 retries, then dead-letter. Product
  agreed duplicate notifications are worse than delayed ones.

## Gotchas
- `npm test` uses a shared Postgres in CI; tests must clean up their own rows.
- The `legacy_users` table still receives writes from the mobile app. Don't drop it.
```

Key properties: it has a **size budget**, it has an **expiry rule**, and **writing goes through review**. Those three alone prevent most of the problems above.

## How memory connects to the rest of the stack

Memory is where the other contracts *learn*:

![Session learnings become proposed entries, get reviewed into MEMORIES.md, then graduate to AGENTS.md or a skill, or get deleted when the code changes.](/images/blog/engineering-contract/memory-flow.svg)

- When an agent hits the same mistake twice, that's a memory entry. If it's universal, it graduates into the **system contract**.
- When a gotcha only applies to one type of work, it graduates into a **skill**.
- When a feature ships, the decision log from its **plan** (next post) gets distilled into a couple of memory entries, and the plan itself gets archived.

Memory is the inbox. The other contracts are where knowledge goes once it's proven.

## What leaders should take from this post

1. **Decide where team memory lives**, and make it reviewable. Memory that only exists in one engineer's tool doesn't help the team.
2. **Give memory a size budget.** It's loaded into context, and context is now the majority of your spend.
3. **Make expiry explicit.** Stale memory is a correctness risk, not just clutter.
4. **Route memory through review.** An agent that can silently write its own long-term rules is an agent that can silently teach itself wrong things.

We now have the rules (system), the expertise (skills), and the history (memory). What's missing is the thing that ties them to a specific piece of work. Next in the series is the heart of spec-driven development: **the `plan.md` feature spec.**
