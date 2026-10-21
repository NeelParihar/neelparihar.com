---
id: 0
title: retrace
description: trace every step of an llm agent — model calls, tool calls, tokens and cost — then replay it step by step or fork it from any step with edited input.
tech: nextjs react typescript tailwindcss supabase claude
logo: /images/retrace.svg
website: https://retrace-neel.netlify.app/
github: https://github.com/NeelParihar/retrace
twitter: neelparihar0
---

Trace every step of an LLM agent — model calls, tool calls, tokens and cost — then **replay** it step by step or **fork it from any step** with edited input and watch the new branch run live.

# Features of retrace:

- **Tracing** — every model and tool call becomes a step with input, output, tokens, cost (priced server-side) and timing.
- **Replay** — scrub or play a trace step by step; token and cost counters accumulate as you go.
- **Fork from step N** — copy the earlier steps into a new trace, edit the message or tool result at step N, and resume the agent. Forks link to their parent and get a side-by-side compare view.
- **Ingestion API + TypeScript SDK** — batched, idempotent ingest endpoint with project keys; the SDK buffers, retries, and never throws into your code.
- **Simulated or live** — a deterministic simulated model by default, or Claude Haiku 4.5 with per-IP rate limits and a daily cost cap.

# Stack:

Next.js 15 · React 19 · TypeScript · Tailwind CSS v4 · Zod · Supabase Postgres · Vitest · Playwright · Netlify
