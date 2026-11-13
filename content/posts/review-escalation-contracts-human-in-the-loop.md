---
id: 13
title: "Review and Escalation Contracts: Keeping Humans in the Loop as Agents Scale"
description: "Agents will get things wrong. Review and escalation contracts decide who catches it and when an agent has to stop and ask. Plus: which contracts you can safely skip, and how to roll the whole stack out."
long_description: "The final piece of the engineering contract stack: review contracts, escalation contracts, the optional contracts (traditional, boundary and handoff) and why they're optional, how always-on agents, parallel worktrees and plugin marketplaces change the picture, and a phased rollout plan for engineering leaders."
createdAt: "2026-11-13T09:00:00.000Z"
series: "The Engineering Contract"
seriesOrder: 6
tags:
  - ai
  - spec-driven-development
  - engineering-leadership
  - code-review
category: leadership
author:
  name: Neel Parihar
  twitter: neelpariharr
  image: /images/avatar.png
---

Everything in this series so far has been about helping agents do the right thing: system contracts for the rules, skills for the expertise, memory for the history, and plans for the specific piece of work.

This last post is about what happens when they don't. Because they won't, always. **Review and escalation contracts** decide who catches the mistake, and when an agent is required to stop and hand control back to a human.

## Review contracts: what gets reviewed, by whom, against what

A review contract makes review explicit instead of cultural. It answers:

- **What must a human review?** At minimum: every plan above a trivial size, and every PR that touches a never-touch or high-risk area.
- **Who reviews?** The plan's named reviewers. For high-risk areas (billing, auth, data deletion, migrations), a named owner, not "whoever's free."
- **Against what?** The plan's success criteria and constraints. Reviewers aren't checking whether they'd have written it the same way; they're checking whether it meets the contract.
- **What can be auto-approved?** Be explicit. Dependency patch bumps with green CI? Docs-only changes? Write it down so it's a decision, not a habit.

A simple tiering works well:

| Tier | Examples | Review required |
|---|---|---|
| Low | Docs, copy, test-only changes, internal tooling | Automated checks + any one reviewer |
| Standard | Typical feature work with an approved plan | Plan review + PR check against success criteria |
| High | Billing, auth, PII, migrations, infra, deletion | Plan review by area owner + PR review by area owner, never auto-merged |

The single most important rule: **agents can't merge without human approval.** That one constraint shrinks the blast radius of almost every failure mode more than any amount of clever prompting.

## Escalation contracts: when the agent must stop

An escalation contract is the list of situations where an agent must stop, explain what it found, and wait. The `plan.md` template from the previous post has a section for exactly this, but the defaults belong at the system level too:

- A step requires touching something on the never-touch list.
- The approved approach doesn't work and needs to change.
- A success criterion can't be met, or looks wrong.
- The task needs a new dependency, a schema change, new permissions, or new credentials.
- Tests are failing for reasons unrelated to the task.
- The agent is about to do something irreversible: delete data, rewrite history, force-push, send something externally.

Two things make escalation work in practice:

![When an agent hits an escalation trigger it stops and asks; otherwise it opens a PR, which is reviewed according to its risk tier. Agents never merge.](/images/blog/engineering-contract/escalation-flow.svg)

1. **Escalation is not failure.** If engineers or agents are implicitly rewarded for "never getting stuck," they'll route around the contract. Treat a well-timed escalation as the system working.
2. **Escalations update the contract.** Every escalation is a signal: either the plan was unclear, a skill is missing knowledge, or the system contract needs a new rule. Feed it back.

## The optional contracts, and why they're optional

The talk listed three more contracts with a question mark next to them: **traditional, boundary, and handoff.** They're real, and large organisations may want them formalised. But for most teams, the core stack already covers them.

### Traditional contracts (classic test suites as the gate)

- Evaluator agents already score output against success criteria.
- Agents generate code faster than hand-written tests can verify it.
- AI failure modes are architectural, not syntactic. The code compiles and the tests pass, but it solved the wrong problem.

Tests still matter enormously. But "the test suite is the contract" isn't enough on its own anymore. The **plan's success criteria and skill evals** are where architectural correctness gets checked.

### Boundary contracts (who owns which module)

- `AGENTS.md` already defines module ownership and boundaries.
- Tool access in skill contracts already limits blast radius.
- Blast radius shrinks further when agents can't merge without human approval.

### Handoff contracts (passing context between people or agents)

- Git history and PR descriptions already carry context forward, especially if PR descriptions are generated from the plan.
- `MEMORIES.md` already captures decisions and reasoning.
- Small teams with a shared agent setup don't need a formal handoff layer.

**The pattern:** don't add a contract until you feel the specific pain it solves. Every contract has a maintenance cost, and an unmaintained contract is worse than none.

## Agentic behaviour is changing the shape of the work

A few capabilities covered at the end of the talk change *how* these contracts get used:

### Always-on agents

Agents that run in the cloud on triggers you set up: a schedule, a new PR, a failing build. The example from the talk was a daily "find critical bugs" automation: inspect recent commits, surface only issues that would cause data loss, crashes, security holes or significant user-facing breakage, and ignore style nits and theoretical concerns.

Notice that the instructions for that agent are *themselves a contract*: a goal, an investigation strategy, explicit things to ignore, and a limited set of tools (memory, Slack, open a PR). Everything in this series applies, and it matters more because nobody is watching it in real time. **Always-on agents should open PRs or post findings, never merge.**

### Multitasking and worktrees

Modern agent tools can split a request across parallel subagents instead of queueing it. The talk's honest aside was: *"I still just work with worktrees most of the time."* Separate git worktrees, one agent each, one plan each.

The leadership implication: parallelism multiplies output *and* review load. If one engineer can run four agents on four plans, your plan-review capacity, not your coding capacity, becomes the constraint. Plan for that.

### Marketplaces and plugins

Agent tools now have marketplaces of plugins: skills, MCP servers and integrations for Datadog, Grafana, Vercel, Shopify, Linear, Pinecone, turbopuffer and many more. These are, effectively, **pre-written skill contracts with tool access.**

Treat them like any other dependency: review what tools and permissions a plugin grants, decide centrally which are approved, and check that its instructions don't contradict your system contract.

## A rollout plan for engineering leaders

Putting the whole series together, here's a phased rollout that I'd recommend for most teams:

![Rollout timeline: foundation in weeks 1 to 2, plans in weeks 3 to 6, skills and memory in weeks 6 to 10, then scale.](/images/blog/engineering-contract/rollout-timeline.svg)

**Phase 1: One repo, the foundation (weeks 1–2)**
- Pick one active repo with an engaged tech lead.
- Write a short `AGENTS.md`: commands, boundaries, never-touch, house style.
- Set the non-negotiable: agents can't merge without human approval.

**Phase 2: Plans (weeks 3–6)**
- Require an approved `plan.md` for any agent-implemented feature above a trivial size.
- Humans write context, goals, success criteria, and constraints. Agents draft the rest.
- Start tracking plan rejection rate and post-merge rework.

**Phase 3: Skills and memory (weeks 6–10)**
- Turn your two or three most common task types into skills, each with success criteria and a minimal eval set.
- Introduce a reviewed `MEMORIES.md` with a size budget and expiry rule.
- Prune `AGENTS.md`, since some of what's in there now belongs in skills.

**Phase 4: Review tiers, escalation and scale (ongoing)**
- Formalise review tiers and the escalation list.
- Introduce always-on agents for narrow, high-value jobs (bug hunting, dependency updates), opening PRs only.
- Roll the contract stack out to the next repo, reusing skills where they apply.

## Closing the series

The thread through all six posts is the same idea the talk opened with: **the implicit contract between engineers and their systems has changed, from code author to system designer.**

Your engineers aren't being replaced by agents. They're being promoted to the job of telling agents what good looks like through system contracts, skills, memory, plans, and review. Leaders who make that shift explicit, give it structure, and measure it honestly will get compounding returns. Leaders who just buy more seats will get more code.

Those aren't the same thing.

*This series builds on "The Eng Contract", a talk by Yash Kalwani. If you're working through these problems on your own team, I'd love to hear what's working and what isn't.*
