---
id: 8
title: "The Engineering Contract: Why Spec-Driven Development Is Now a Leadership Problem"
description: "The implicit deal between engineers and their systems just changed — from code author to system designer. Here's what that means for how you run an engineering org."
long_description: "An introduction to spec-driven development for engineering leaders: the shift from the old contract (engineers write code) to the new contract (engineers govern agentic systems), the identity crisis that comes with it, and the stack of contracts — system, skill, memory, plan, review and escalation — that make AI-assisted engineering repeatable across a team."
createdAt: "2026-11-08T09:00:00.000Z"
series: "The Engineering Contract"
seriesOrder: 1
tags:
  - ai
  - spec-driven-development
  - engineering-leadership
  - agents
category: leadership
author:
  name: Neel Parihar
  twitter: neelpariharr
  image: /images/avatar.png
---

Most engineering leaders I talk to are asking the same question in slightly different words: *"How do I make my team more effective with AI, without it turning into chaos?"*

They've bought the seats. They've watched token spend climb. They've seen a handful of engineers become dramatically more productive while everyone else quietly ignores the tools. And they've reviewed at least one pull request that was 2,000 lines long, confidently wrong, and nobody could explain.

This series is my answer. It's built on a framework from **"The Eng Contract"**, a talk by Yash Kalwani (Head of Engineering at Saral), and expanded with the practical artifacts — templates, file layouts, review gates — that I think a leadership team needs to actually roll it out.

The core idea is simple: **if agents are going to write a large share of your code, the thing your engineers own is no longer the code. It's the contract the code is written against.**

That's what spec-driven development really is. Not a new tool. A new deal.

## The old contract vs. the new contract

For most of our careers the implicit deal looked like this:

| | Old contract | New contract |
|---|---|---|
| Engineer's core output | Code | Specs, constraints, and verification |
| Where time goes | Executing tasks | Governing the system that executes tasks |
| Source of truth | The codebase | The contract *plus* the codebase |
| What review means | Reading every line | Approving the plan, checking against success criteria |
| Unit of accountability | The PR | The spec that produced the PR |

The slide that framed this best had one line on it: **less time executing tasks, more time governing the systems.**

Engineers were the people everyone depended on for "the code." That dependency created a real sense of ownership, pride, and control. Then, almost overnight, a machine started producing large portions of that same work — faster, often cleaner, and without fatigue.

## Name the identity crisis out loud

This is the part most AI rollouts skip, and it's the part that decides whether yours works.

When a senior engineer refuses to use an agent, or uses it once and declares it useless, it's tempting to read that as stubbornness or laziness. Usually it isn't. **They're protecting their identity.** The thing that made them valuable — being the person who could hold the whole system in their head and turn it into working code — is suddenly being done by something else.

As a leader, you have to acknowledge this directly. Not with a pep talk about "10x productivity," but with a clear answer to *"what am I responsible for now?"*

The answer this series gives: **you're responsible for the contract.** Designing the boundaries, writing the success criteria, deciding what the agent may and may not touch, and being accountable when the system produces the wrong thing. That's not a demotion. It's the same work a principal engineer or architect has always done — now it's everyone's job.

## Who this is for (and who it isn't)

The talk was explicit about audience, and I think that's worth repeating:

**This is for founders, CTOs, VPs and engineering managers** who want a framework to standardise AI-assisted engineering across a small or large team — something more durable than "everyone figure out their own prompts."

**It's for senior engineers and architects** who want to experiment, who are feeling that identity shift, and who'd rather shape the new way of working than have it imposed on them.

**It's not for beginners, or for people who just want to vibe-code a working prototype.** If that's you, use the basics first. Contracts add structure, and structure only pays off once you're shipping into a codebase other people (and agents) have to live with.

## No instant gratification

One more honest disclaimer: **none of this pays off on day one.**

Writing a good system contract takes an afternoon of arguing with your team about what "our style" actually is. Skills need iteration. Memory needs pruning. The first few plans your team writes will be too long, or too vague, or both.

The payoff is compounding. Every contract you write is reused by every agent session, for every engineer, on every task. By the end of the series you'll see why the talk crossed out the "No" in "No instant gratification" — once the contracts exist, the gratification *is* instant. You just have to pay for it upfront.

## The contract stack

Here's the map for the rest of the series. Think of these as layers, from the most stable to the most specific:

1. **System contracts** — the repo-wide rules every agent follows: commands, boundaries, things it must never touch, and your house code style. Lives in `AGENTS.md`.
2. **Skill contracts** — surgical, task-specific domain knowledge with tool access, constraints, and *measurable* success criteria. Loaded only when relevant.
3. **Memory contracts** — what gets remembered between sessions, where it lives, who writes it, how long it persists, and what gets forgotten.
4. **Plan contracts** — the feature-level spec. A `plan.md` written and approved *before* implementation starts. This is the heart of spec-driven development.
5. **Review and escalation contracts** — where humans stay in the loop: what must be reviewed, by whom, and when an agent has to stop and ask.

There's also a set of *optional* contracts — traditional, boundary, and handoff — that matter more as teams scale. We'll cover why they're optional at the end.

## What leaders should take from this post

If you only do three things after reading this:

1. **Reframe the job.** Tell your team explicitly that their output is shifting from code to contracts, and that writing a good spec is senior-level work — not paperwork.
2. **Pick one repo.** Don't roll this out org-wide. Choose one active codebase with an engaged tech lead and build the contract stack there first.
3. **Measure the right thing.** Not token usage or lines generated. Measure how often an agent's output is accepted without rework, and how often plans get rejected at review. Those tell you whether your contracts are working.

Next in the series: **System Contracts** — how to write an `AGENTS.md` that agents actually follow, and why shorter is almost always better.
