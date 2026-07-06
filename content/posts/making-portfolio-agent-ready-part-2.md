---
id: 5
title: "Making My Portfolio Agent-Ready, Part 2: robots.txt Has Trust Issues"
description: Your robots.txt is probably blocking AI bots without you realizing it. Here's how to explicitly invite the right ones in, add Content-Signal directives, wire up ai-plugin.json, and drop HTTP discovery hints.
createdAt: "2026-07-02 10:00:00"
tags:
  - ai
  - webdev
  - portfolio
  - robots
category: dev
author:
  name: Neel Parihar
  twitter: neelpariharr
  image: /images/avatar.png
---

# Making My Portfolio Agent-Ready, Part 2: robots.txt Has Trust Issues

If Part 1 was about making your site *understandable* to AI, Part 2 is about making it *accessible*. Turns out there's a subtle difference between "not blocked" and "explicitly allowed" — and AI crawlers care about that distinction.

<!--more-->

## The robots.txt Problem Nobody Talks About

Most developers have a `robots.txt` that looks like this:

```
User-agent: *
Allow: /
Sitemap: https://yoursite.com/sitemap.xml
```

"Allow everything, tell them where the sitemap is. Done." That's what I had.

The issue: a lot of security-conscious teams and some AI crawlers treat the *absence* of an explicit Allow rule for their specific user-agent as ambiguous. Is this site opting in to AI crawling, or did they just forget to block it?

More importantly, new directives like Content-Signal aren't recognized by `*` wildcards in some implementations — you need to state them clearly.

Here's my updated `robots.txt`:

```
User-agent: *
Allow: /
Sitemap: https://neelparihar.com/sitemap.xml
Content-Signal: ai-train=no, search=yes, ai-input=yes

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: Googlebot
Allow: /

User-agent: CCBot
Allow: /
```

Three things happening here:

**1. Explicit AI bot Allow rules** — Each major AI crawler (OpenAI's GPTBot, Anthropic's ClaudeBot, Perplexity, Apple's AI, Cohere) gets its own explicit `Allow: /`. No ambiguity.

**2. Content-Signal directive** — This is from an [IETF draft](https://datatracker.ietf.org/doc/draft-romm-aipref-contentsignals/) that defines how sites declare AI content preferences. The three flags:
- `ai-train=no` — please don't use my content to train models
- `search=yes` — use my content in AI search results / RAG
- `ai-input=yes` — agents can use my content as context for answering questions

This is a portfolio, so I'm happy to be cited and helpful — I just don't want my writing used to silently improve a model I'll never see.

**One important note**: if you're currently using a module like `@nuxtjs/robots` to generate your robots.txt, you'll probably need to ditch it and create a static file instead. The module likely doesn't support custom directives like Content-Signal — I had to make that swap.

## .well-known/ai-plugin.json

You've probably seen how ChatGPT plugins are described — there's a standard JSON file that tells agents "here's what this site can do and where to find its data."

Even if you're not building a ChatGPT plugin, you can use the same format to describe your site's machine-readable endpoints. Create `static/.well-known/ai-plugin.json`:

```json
{
  "schema_version": "v1",
  "name_for_human": "Neel Parihar",
  "name_for_model": "neel_parihar_portfolio",
  "description_for_human": "Portfolio of Neel Parihar — software engineer, projects, and blog.",
  "description_for_model": "Use this to look up Neel Parihar's projects, blog posts, work history, and contact info.",
  "auth": {
    "type": "none"
  },
  "api": {
    "type": "openapi",
    "url": "https://neelparihar.com/content/posts.json"
  },
  "logo_url": "https://neelparihar.com/images/avatar.png",
  "contact_email": "hello@neelparihar.com",
  "legal_info_url": "https://neelparihar.com",
  "endpoints": {
    "posts": "https://neelparihar.com/content/posts.json",
    "projects": "https://neelparihar.com/content/projects.json",
    "feed": "https://neelparihar.com/feed.xml",
    "sitemap": "https://neelparihar.com/sitemap.xml"
  }
}
```

The `/.well-known/` path is a [standardized location](https://datatracker.ietf.org/doc/html/rfc5785) for service metadata — many AI tools know to look there.

## HTTP Link Headers — the Quiet Discovery Layer

There's a layer of web standards that almost nobody uses: `Link` response headers. These let your server say, *in every response*, "hey, here's where my sitemap is" — without the client needing to know to look for it.

On Netlify, you can set these in a `_headers` file:

```
/*
  Link: <https://neelparihar.com/sitemap.xml>; rel="sitemap", <https://neelparihar.com/llms.txt>; rel="describedby"
```

Now every page your site serves tells the requester exactly where to find the sitemap and the llms.txt. AI crawlers that support HTTP Link discovery will pick this up without needing to parse your HTML at all.

## OpenSearch — For the Agents That Search

[OpenSearch](https://developer.mozilla.org/en-US/docs/Web/OpenSearch) is an old standard that lets browsers (and now some AI tools) autodiscover your site's search endpoint. Create `static/opensearch.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
  <ShortName>Neel Parihar</ShortName>
  <Description>Search Neel Parihar's blog and projects</Description>
  <Url type="text/html" template="https://neelparihar.com/blog?q={searchTerms}"/>
  <Image width="16" height="16" type="image/x-icon">https://neelparihar.com/favicon.ico</Image>
</OpenSearchDescription>
```

Then wire it up in your `<head>`:

```html
<link rel="search"
      type="application/opensearchdescription+xml"
      href="/opensearch.xml"
      title="Neel Parihar" />
```

In Nuxt:

```js
link: [
  {
    rel: "search",
    type: "application/opensearchdescription+xml",
    href: "/opensearch.xml",
    title: config.name
  }
]
```

---

Two parts down. Your site is now readable and reachable. In Part 3, we get to the weird part: teaching your static site to serve its content as markdown when an AI asks for it. Yes, content negotiation, on a Netlify static site, with edge functions. It's more fun than it sounds.

[← Part 1](/blog/making-portfolio-agent-ready-part-1) · [Part 3 →](/blog/making-portfolio-agent-ready-part-3)
