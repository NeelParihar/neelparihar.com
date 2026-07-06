---
id: 4
title: "Making My Portfolio Agent-Ready, Part 1: I Scored 21 Out of 100 on an AI Audit"
description: I ran an AI readiness audit on my portfolio and got a humbling 21/100. Here's what that means, why it matters, and the first batch of fixes — JSON-LD, og:image, and llms.txt.
createdAt: "2026-07-01 10:00:00"
tags:
  - ai
  - webdev
  - portfolio
  - seo
category: dev
author:
  name: Neel Parihar
  twitter: neelpariharr
  image: /images/avatar.png
---

# Making My Portfolio Agent-Ready, Part 1: I Scored 21 Out of 100 on an AI Audit

A few weeks ago I decided to run my portfolio through [isitagentready.com](https://isitagentready.com) — a tool that audits your site for how well AI agents can discover, understand, and use it.

My score: **21 out of 100**.

I've shipped products used by tens of thousands of people. I have opinions about bundle sizes and Core Web Vitals. And apparently, my own website — the one thing that's supposed to represent me to the world — was nearly invisible to AI.

So I fixed it. This is a four-part series on everything I did.

<!--more-->

## Wait, what even is "agent ready"?

When a person visits your site, they click around, read things, figure out context. When an AI agent visits — whether it's a research tool, a job recruiter assistant, an LLM being asked "who is this developer" — it's doing something different. It's trying to extract structured information quickly.

If your site looks like a beautifully designed black box, an AI will mostly bounce off it. No schema, no discovery hints, no machine-readable version of your content. It'll maybe grab your `<title>` tag and call it a day.

The audit checks for things like:
- **Structured data** (JSON-LD schemas)
- **AI bot access** (are you blocking them in robots.txt?)
- **Machine-readable content** (can an agent fetch your content as markdown instead of HTML?)
- **Discovery signals** (can an agent find your feed, sitemap, and API endpoints?)

I had some of this. Not much.

## Fix 1: JSON-LD Structured Data

The most impactful single thing you can add to your site is a [JSON-LD](https://json-ld.org/) Person schema. It's a machine-readable block that tells any agent — search engine, AI crawler, browser extension — who you are, where you work, and how to reach you.

Add it to your `<head>` via a `<script type="application/ld+json">`:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Neel Parihar",
  "url": "https://neelparihar.com",
  "image": "https://neelparihar.com/images/avatar.png",
  "sameAs": [
    "https://github.com/neelpariharr",
    "https://twitter.com/neelpariharr",
    "https://linkedin.com/in/neel-parihar"
  ],
  "jobTitle": "Software Engineer",
  "description": "Full-stack developer who loves building things that scale",
  "email": "neel@example.com"
}
```

In Nuxt.js, this goes in your `nuxt.config.js` under `head.script`:

```js
head: {
  script: [
    {
      type: "application/ld+json",
      json: {
        "@context": "https://schema.org",
        "@type": "Person",
        name: config.name,
        url: `https://${config.domain}`,
        image: config.image,
        sameAs: [
          `https://github.com/${config.social.github}`,
          `https://twitter.com/${config.social.twitter}`,
        ],
        jobTitle: "Software Engineer",
        description: config.strings.en_US.hero.description,
        email: config.email,
      },
    },
  ],
}
```

The `json` key is Nuxt's way of handling the serialization for you — no need to `JSON.stringify` manually.

## Fix 2: The og:image Relative URL Disaster

My og:image was set to `/images/avatar.png`. That's a relative URL.

The Open Graph spec requires absolute URLs. When an AI (or Slack, or Discord, or Twitter) tries to preview your site, it doesn't know your domain — it just got a URL path pointing nowhere.

The fix is trivial but easy to miss:

```js
// Before — broken
image: "/images/avatar.png"

// After — correct
image: "https://neelparihar.com/images/avatar.png"
```

And then anywhere you reference it:

```js
{ property: "og:image", content: config.image } // now absolute
```

Check yours right now. Seriously. You probably have this bug.

## Fix 3: llms.txt — a Sitemap for AI

`llms.txt` is an emerging standard (defined at [llmstxt.org](https://llmstxt.org)) for giving AI crawlers a structured overview of your site. Think of it like `robots.txt`, but instead of telling crawlers what they can't access, you're telling them what's actually worth their time.

Create a file at `static/llms.txt` (or wherever your static root is):

```
# Neel Parihar

> Full-stack developer. I build things.

## Key Pages
- [Home](https://neelparihar.com/)
- [Projects](https://neelparihar.com/projects)
- [Blog](https://neelparihar.com/blog)

## Machine-Readable Endpoints
- [Posts JSON](https://neelparihar.com/content/posts.json): All blog posts with metadata
- [Projects JSON](https://neelparihar.com/content/projects.json): All projects with metadata
- [RSS Feed](https://neelparihar.com/feed.xml)
- [Sitemap](https://neelparihar.com/sitemap.xml)

## Contact
- Email: hello@neelparihar.com
- GitHub: https://github.com/neelpariharr
- Twitter: https://twitter.com/neelpariharr
```

The format is intentionally loose — it's markdown, so an LLM can read it directly. The key is giving agents a path straight to the content they want without making them crawl every page.

---

That's Part 1. We went from a Person with no digital identity to someone machines can actually understand. Next up in Part 2: the robots.txt overhaul — because "allow AI bots" sounds obvious until you realize most sites don't actually do it.

[Part 2 →](/blog/making-portfolio-agent-ready-part-2)
