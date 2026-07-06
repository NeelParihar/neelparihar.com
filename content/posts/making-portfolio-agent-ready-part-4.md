---
id: 7
title: "Making My Portfolio Agent-Ready, Part 4: The Unglamorous Fixes That Actually Matter"
description: No catchy framework names here. Just the quiet, easy-to-miss fixes — schema per page, semantic HTML, and a Nuxt hydration bug that made the homepage blank on first AI crawl. The boring stuff that does the real work.
createdAt: "2026-07-04 10:00:00"
tags:
  - ai
  - webdev
  - nuxt
  - portfolio
  - seo
category: dev
author:
  name: Neel Parihar
  twitter: neelpariharr
  image: /images/avatar.png
---

# Making My Portfolio Agent-Ready, Part 4: The Unglamorous Fixes That Actually Matter

The previous three parts had satisfying, self-contained things you could ship: a JSON-LD block, a new robots.txt, an edge function. This part is different. These are the fixes that individually look small but collectively are what separates a site that *works* from a site that *works correctly*.

None of these will make it into a conference talk. All of them are worth doing.

<!--more-->

## Fix 1: Per-Page Schema — BlogPosting and SoftwareApplication

In Part 1, I added a `Person` schema to the global head. But that only describes *you* — not the content on each page. Blog posts and project pages need their own schema.

For blog posts (`pages/blog/_slug.vue`), I added a `BlogPosting` schema in the `head()` method:

```js
head() {
  return {
    title: `${this.article.title} — Neel Parihar`,
    meta: [
      { property: "og:type", content: "article" },
      { property: "og:url", content: `https://neelparihar.com/blog/${this.article.slug}` },
      { property: "og:title", content: this.article.title },
      { property: "og:description", content: this.article.description },
    ],
    script: [
      {
        type: "application/ld+json",
        json: {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: this.article.title,
          description: this.article.description,
          datePublished: this.article.createdAt,
          author: {
            "@type": "Person",
            name: this.article.author?.name,
            url: "https://neelparihar.com",
          },
          url: `https://neelparihar.com/blog/${this.article.slug}`,
          image: this.article.image || "https://neelparihar.com/images/avatar.png",
        },
      },
    ],
  };
},
```

For projects (`pages/projects/_slug.vue`), a `SoftwareApplication` schema:

```js
head() {
  return {
    title: `${this.project.title} — Neel Parihar`,
    meta: [
      { property: "og:type", content: "website" },
      { property: "og:url", content: `https://neelparihar.com/projects/${this.project.slug}` },
    ],
    script: [
      {
        type: "application/ld+json",
        json: {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: this.project.title,
          description: this.project.description,
          applicationCategory: "DeveloperApplication",
          author: {
            "@type": "Person",
            name: "Neel Parihar",
            url: "https://neelparihar.com",
          },
          url: `https://neelparihar.com/projects/${this.project.slug}`,
        },
      },
    ],
  };
},
```

Why this matters: when an AI is asked "what projects has Neel built?", it can now extract structured data from each project page. Without the schema, it's guessing from free text. With it, it knows exactly what type of thing each page represents.

Also make sure your `description:` frontmatter field is filled in on every post and project. An empty `description` in JSON-LD looks bad and makes the schema mostly useless.

## Fix 2: The Nuxt asyncData vs created() Bug

This one is subtle and took me a moment to spot.

My homepage was fetching recent blog posts using `created()`:

```js
// pages/index.vue — broken for SSG
async created() {
  const posts = await this.$content("posts")
    .sortBy("createdAt", "desc")
    .limit(3)
    .fetch();
  this.posts = posts;
}
```

The problem: my site uses `ssr: false` with `target: static` — static site generation (SSG) without server-side rendering. In SSG mode, `created()` runs in the browser, not during static generation. So when Nuxt pre-renders the homepage at build time, the posts array is empty. Any AI crawler fetching the pre-rendered HTML sees no posts.

The fix is `asyncData()`, which *does* run during static generation:

```js
// pages/index.vue — correct for SSG
async asyncData({ $content, $config }) {
  const posts = await $content("posts")
    .sortBy("createdAt", "desc")
    .limit(3)
    .fetch();
  return { posts };
}
```

Remove the `data()` initialization for `posts` and the `created()` hook entirely. `asyncData` returns values that get merged into the component's data automatically.

This affects any page that fetches content dynamically. If your Nuxt static site has pages with `created()` fetching `$content`, they're all generating blank HTML.

## Fix 3: Semantic HTML — One Main Landmark

Semantic HTML is one of those things that's easy to deprioritize because it doesn't affect how the site looks. But for agents, screen readers, and automated tools, it's how they understand page structure.

The key fix: **every page should have exactly one `<main>` element** wrapping the primary content.

I had this in my `layouts/default.vue`:

```html
<!-- Before -->
<div>
  <Nuxt />
</div>

<!-- After -->
<main>
  <Nuxt />
</main>
```

But then I also had a `<main>` tag in my `HeroSection.vue` component — which meant the homepage had two `<main>` elements. The fix was changing the component's tag to a `<section>` with an aria-label:

```html
<!-- components/home/HeroSection.vue -->
<section aria-label="Hero">
  <!-- ... -->
</section>
```

Similarly, page headings should follow a logical hierarchy: one `<h1>` per page, `<h2>` for sections, and so on. I had both the blog listing and projects listing pages using `<h2>` as their primary heading — changed both to `<h1>`.

These are quick wins for both accessibility and AI comprehension.

## Fix 4: Don't Let Your Service Worker Lie About Who It Is

This one's easy to miss entirely. My service worker at `static/sw.js` had:

```js
// Before
var cacheId = "karngyan.com-prod";
```

This site is built from an open-source template originally created by [karn](https://github.com/karngyan). My fork still had the original developer's domain in the cache key. That means cached resources were namespaced under someone else's domain — not a security issue, but messy, and potentially confusing if anything ever inspects service worker metadata.

```js
// After
var cacheId = "neelparihar.com-prod";
```

While you're in there: check your content/posts frontmatter for the `author.twitter` field. My template had `twitter: neelparihar0` (a typo) in several project files. An AI extracting your contact info from structured content would get the wrong handle.

## The Audit Score, Revisited

Started at **21/100**. After all four parts:

| Area | Before | After |
|------|--------|-------|
| Structured data | None | Person schema site-wide, BlogPosting per post, SoftwareApplication per project |
| AI crawl access | Implicit | Explicit Allow for 8 major AI crawlers |
| Machine-readable content | None | Markdown via edge function, JSON endpoints |
| Discovery | Sitemap only | llms.txt, ai-plugin.json, Link headers, OpenSearch |
| Content preferences | Undeclared | Content-Signal in robots.txt |
| Semantic HTML | Mixed | Proper landmark + heading hierarchy |
| SSG pre-rendering | Broken on homepage | asyncData fixes content at build time |

None of this took more than a few hours spread across an afternoon. Most of it is configuration and small files. The tooling (Netlify Edge Functions, schema.org, llms.txt) is all free and well-documented.

If you want to know where your own site stands: run it through [isitagentready.com](https://isitagentready.com) and use this series as a checklist for the fixes that make sense for your stack.

---

[← Part 3](/blog/making-portfolio-agent-ready-part-3)
