---
id: 6
title: "Making My Portfolio Agent-Ready, Part 3: Teaching a Static Site to Speak Markdown"
description: HTML is great for humans. For AI agents, markdown is faster and cheaper to process. Here's how I built an edge function that serves content as markdown when an agent asks for it — on a purely static Netlify site.
createdAt: "2026-07-03 10:00:00"
tags:
  - ai
  - webdev
  - netlify
  - edge-functions
  - markdown
category: dev
author:
  name: Neel Parihar
  twitter: neelpariharr
  image: /images/avatar.png
---

# Making My Portfolio Agent-Ready, Part 3: Teaching a Static Site to Speak Markdown

Here's the scenario: an AI agent visits your portfolio page. It wants your blog posts. Your site returns 200KB of HTML — navigation, scripts, styles, the whole thing — and the agent has to parse all of it to find the three paragraphs it actually wants.

Now imagine if the agent could just ask, *"can I have this as markdown instead?"* — and your site said yes.

That's what we're doing in Part 3.

<!--more-->

## Content Negotiation (The 30-Second Version)

[Content negotiation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Content_negotiation) is an HTTP feature where the client tells the server what format it prefers, and the server picks the best match. It uses the `Accept` header.

```
Accept: text/markdown
```

When a request comes in with that header, a well-behaved server should return markdown instead of HTML. AI tools are increasingly doing this — it's cheaper to process (fewer tokens), easier to parse, and the signal-to-noise ratio is way better.

The problem: my site is a **static Nuxt.js site deployed on Netlify**. There is no server. Once it's built, the files are just files. A static server can't inspect request headers and do anything different.

Enter: Netlify Edge Functions.

## Netlify Edge Functions — Serverless Logic at the CDN Layer

[Netlify Edge Functions](https://docs.netlify.com/edge-functions/overview/) run at the edge — meaning they intercept requests before Netlify serves the static file. They run on Deno, they're fast, and the free tier covers way more traffic than my portfolio gets.

Here's the complete edge function I wrote at `netlify/edge-functions/markdown-negotiation.js`:

```js
export default async function handler(request, context) {
  const accept = request.headers.get("accept") || "";

  // Only intercept requests that explicitly ask for markdown
  if (!accept.includes("text/markdown")) {
    return context.next();
  }

  const { pathname } = new URL(request.url);
  const path = pathname.replace(/\/$/, "") || "/";

  // Map URL paths to pre-built markdown files
  let mdPath = null;
  if (path === "/") {
    mdPath = "/md/index.md";
  } else if (path === "/projects") {
    mdPath = "/md/projects.md";
  } else if (path.startsWith("/projects/")) {
    const slug = path.slice("/projects/".length);
    if (slug) mdPath = `/projects/${slug}.md`;
  } else if (path.startsWith("/blog/")) {
    const slug = path.slice("/blog/".length);
    if (slug) mdPath = `/posts/${slug}.md`;
  }

  if (!mdPath) return context.next();

  try {
    const mdRes = await fetch(new URL(mdPath, request.url).toString());
    if (!mdRes.ok) return context.next();

    const markdown = await mdRes.text();

    return new Response(markdown, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "x-markdown-tokens": String(Math.ceil(markdown.length / 4)),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return context.next();
  }
}

export const config = { path: "/*" };
```

And wire it up in `netlify.toml`:

```toml
[build]
  command = "npm run generate"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

[[edge_functions]]
  path = "/*"
  function = "markdown-negotiation"
```

The logic is simple: if the request wants markdown, fetch the pre-built `.md` file and return it. Otherwise, fall through to the normal static file serving.

The `x-markdown-tokens` header is a bonus — it gives the caller a rough token count estimate so an agent can decide whether to request the full page or be selective.

## But Wait — Where Do the .md Files Come From?

The edge function fetches from paths like `/posts/my-post.md` and `/md/index.md`. On a static site, those files need to exist at build time.

My site uses `@nuxt/content` which manages markdown source files in `content/posts/`. During `npm run generate`, these get compiled into HTML pages. The raw `.md` files don't end up in `dist/` by default.

I added a `generate:done` hook to `nuxt.config.js` that:

1. **Copies raw markdown files** from `content/posts/` → `dist/posts/` and `content/projects/` → `dist/projects/`
2. **Generates page-level summaries** in `dist/md/` — pre-written markdown files for the homepage and projects listing

```js
hooks: {
  "generate:done": async (generator) => {
    const { $content } = require("@nuxt/content");
    const fs = require("fs");
    const path = require("path");
    const distDir = generator.nuxt.options.generate.dir || "dist";

    // Copy raw markdown source files
    const postsDir = path.join(distDir, "posts");
    if (!fs.existsSync(postsDir)) fs.mkdirSync(postsDir, { recursive: true });
    fs.readdirSync(path.join(__dirname, "content", "posts"))
      .filter(f => f.endsWith(".md"))
      .forEach(f =>
        fs.copyFileSync(
          path.join(__dirname, "content", "posts", f),
          path.join(postsDir, f)
        )
      );

    // Generate summary markdown for key pages
    const mdDir = path.join(distDir, "md");
    if (!fs.existsSync(mdDir)) fs.mkdirSync(mdDir, { recursive: true });

    const allProjects = await $content("projects")
      .without(["body", "toc"])
      .sortBy("id", "asc")
      .fetch();

    const indexMd = [
      `# Neel Parihar`,
      ``,
      `Full-stack developer. I build things.`,
      ``,
      `## Projects`,
      ``,
      ...allProjects.map(p =>
        `- **[${p.title}](https://neelparihar.com/projects/${p.slug})** — ${p.description}`
      ),
    ].join("\n");

    fs.writeFileSync(path.join(mdDir, "index.md"), indexMd);
  },
},
```

Now every generated page has a corresponding `.md` file in `dist/`, ready for the edge function to serve.

## Bonus: Static JSON Endpoints

While I was in the `generate:done` hook, I added a quick static JSON export of all posts and projects metadata:

```js
const contentDir = path.join(distDir, "content");
if (!fs.existsSync(contentDir)) fs.mkdirSync(contentDir, { recursive: true });

const posts = await $content("posts").without(["body", "toc"]).fetch();
fs.writeFileSync(
  path.join(contentDir, "posts.json"),
  JSON.stringify(posts, null, 2)
);

const projects = await $content("projects").without(["body", "toc"]).fetch();
fs.writeFileSync(
  path.join(contentDir, "projects.json"),
  JSON.stringify(projects, null, 2)
);
```

These get served at `/content/posts.json` and `/content/projects.json`. Now any agent that wants a list of my posts or projects can get clean JSON without parsing HTML or dealing with the `/_content/` API (which doesn't exist on a deployed static site anyway).

## Testing It

Once deployed, you can verify content negotiation works:

```bash
curl -H "Accept: text/markdown" https://neelparihar.com/
# Should return markdown, not HTML

curl https://neelparihar.com/content/posts.json
# Should return clean JSON list of posts
```

---

That's the fun part done. In Part 4, we cover the less glamorous fixes — the ones that don't get their own clever names but collectively matter more than everything else.

[← Part 2](/blog/making-portfolio-agent-ready-part-2) · [Part 4 →](/blog/making-portfolio-agent-ready-part-4)
