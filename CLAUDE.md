# neelparihar.com

Personal portfolio and blog for Neel Parihar, built with Nuxt.js 2 (static mode) and Tailwind CSS.

## Running locally

```bash
npm install
npm run dev        # dev server at localhost:3000
npm run generate   # static build to /dist
npm run build      # SSR build
npm test           # run tests
```

## Project structure

- `neelparihar.config.js` — all site-wide feature flags and content (name, domain, social links, which sections are enabled)
- `nuxt.config.js` — Nuxt/module config; reads from neelparihar.config.js
- `content/posts/*.md` — blog posts (frontmatter: id, title, description, createdAt, tags, category, author)
- `content/projects/*.md` — project entries (frontmatter: id, title, description, tech, logo, website, github, twitter)
- `pages/` — Nuxt pages (index, blog/index, blog/_slug, projects/index, projects/_slug, resume)
- `components/` — Vue components, organized by section (home/, blog/, projects/, logos/)
- `layouts/default.vue` — global layout with nav and footer
- `static/` — static assets served at root (images, PDFs, llms.txt, opensearch.xml, sw.js)
- `lang/` — i18n locale files

## Adding a blog post

Create `content/posts/<slug>.md` with this frontmatter:

```yaml
---
id: <unique-number>
title: "Post Title"
description: "One-sentence summary for meta tags and RSS."
createdAt: "YYYY-MM-DD HH:MM:SS"
tags:
  - tag1
  - tag2
category: dev  # or: interview, tutorial, etc.
author:
  name: Neel Parihar
  twitter: neelpariharr
  image: /images/avatar.png
---
```

Then set `blog.enabled: true` in `neelparihar.config.js`.

## Adding a project

Create `content/projects/<slug>.md` with:

```yaml
---
id: <unique-number>
title: "Project Name"
description: "Short description used in cards and meta tags."
tech: "Vue React Node"   # space-separated, used for filter tabs
logo: /images/logo.png
website: https://example.com
github: https://github.com/NeelParihar/repo
twitter: neelpariharr
---
```

## Feature flags (neelparihar.config.js)

| Flag | Default | Effect |
|---|---|---|
| `blog.enabled` | false | Enables blog pages, RSS feed, recent posts on homepage |
| `projects.enabled` | true | Enables /projects pages |
| `resume.enabled` | true | Enables /resume PDF viewer |
| `firebase.enabled` | false | Enables comments and likes on posts |
| `workedAt.enabled` | true | Shows company logos in hero section |
| `recommendations.enabled` | true | Shows recommendation cards on homepage |

## Deployment

Static site deployed to Netlify. `npm run generate` produces the `/dist` folder. The `generate:done` hook writes `dist/content/posts.json` and `dist/content/projects.json` as static JSON exports.

## Machine-readable endpoints (after deploy)

- `/llms.txt` — AI crawler description file
- `/sitemap.xml` — XML sitemap
- `/feed.xml` — RSS feed (when blog enabled)
- `/content/posts.json` — all posts as JSON
- `/content/projects.json` — all projects as JSON
- `/opensearch.xml` — OpenSearch description
