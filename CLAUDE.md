# CLAUDE.md — AI Assistant Guide for neelparihar.com

This file provides context and conventions for AI assistants (e.g., Claude) working in this repository.

---

## Project Overview

Personal portfolio and blog website for Neel Parihar. Built with **Nuxt.js 2** (Vue 2), **Tailwind CSS 3**, and optional **Firebase** backend. Deployed as a static site.

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | Nuxt.js 2 (Vue 2) |
| Styling | Tailwind CSS 3 (utility-first) |
| Content | Markdown files via `@nuxt/content` |
| State | Vuex |
| Backend (optional) | Firebase (Firestore + Auth) |
| Analytics | Google Analytics V4, optional Plausible |
| i18n | nuxt-i18n (English only currently) |
| Animations | AOS (Animate On Scroll), Vue Typer |
| Deployment | Netlify or AWS S3 + CloudFront |
| Package manager | npm (package-lock.json present) |

---

## Directory Structure

```
neelparihar.com/
├── assets/           # CSS (tailwind.css) and build-time assets
├── components/       # Reusable Vue components
│   ├── blog/         # BlogCard.vue
│   ├── home/         # HeroSection, GithubCalendar, RecentBlog, Recommendations
│   ├── logos/        # TheLogo.vue
│   └── projects/     # ProjectCard.vue
├── content/          # Markdown content (CMS)
│   ├── posts/        # Blog posts (.md)
│   └── projects/     # Project entries (.md)
├── lang/             # i18n strings (en_US.js sourced from neelparihar.config.js)
├── layouts/          # Nuxt layout files (default.vue, error.vue)
├── middleware/       # auth.js (Firebase init), analytics.js (Plausible)
├── pages/            # File-system routes
│   ├── index.vue     # Home page
│   ├── blog/         # Blog listing + _slug.vue (individual post)
│   ├── projects/     # Projects listing + _slug.vue (individual project)
│   ├── resume/       # Resume PDF viewer
│   └── uses/         # Uses/setup page (disabled by default)
├── plugins/          # Vue plugins (aos, vuetyper, directives, gtag, clapbutton)
├── static/           # Public files served at root (images, PDFs, favicon)
├── store/            # Vuex: state.js, mutations.js, actions.js, getters.js
├── neelparihar.config.js  # MAIN site config (features, content, strings)
├── nuxt.config.js    # Nuxt configuration (modules, build, runtime config)
└── tailwind.config.js     # Tailwind theme extensions and plugins
```

---

## Key Configuration: `neelparihar.config.js`

This is the **single source of truth** for site content and feature flags. Modify here instead of in individual components when possible.

### Feature Toggles

```js
blog:      { enabled: false }   // Blog listing, RSS, comments, likes
projects:  { enabled: true }    // Projects section
firebase:  { enabled: false }   // Firestore comments/likes + Google auth
resume:    { enabled: true }    // Resume page with PDF viewer
uses:      { enabled: false }   // Setup/uses page
workedAt:  { enabled: true }    // Company logos in hero section
recommendations: { enabled: true }
```

### Content Areas

- `social` — GitHub, LinkedIn, Twitter, Instagram URLs
- `workedAt` — Company logos/URLs displayed in hero
- `recommendations` — Mentor testimonials (name, text, image, social)
- i18n strings: nav labels, hero text, blog/project section titles

---

## Development Workflow

### Setup

```bash
npm install
cp .env.example .env   # Configure environment variables if using Firebase/analytics
npm run dev            # Start dev server at localhost:3000
```

### Build & Generate

```bash
npm run build     # Build for SSR (not typically used — site is static)
npm run generate  # Generate static site to /dist (used for deployment)
npm run start     # Start production server (after build)
```

### Deployment

- **Netlify**: Auto-deploy on push. Build command: `npm run generate`, publish dir: `dist`.
- **AWS S3 + CloudFront**: Use `gulpfile.js` tasks. Requires AWS credentials in `.env`.
- **GitHub Actions**: `.github/workflows/deploy.prod.yml` handles CI/CD.

---

## Content Management

### Adding a Blog Post

Create a Markdown file in `/content/posts/` with front matter:

```markdown
---
id: 1
title: "Post Title"
description: "Short description for SEO and cards."
long_description: "Longer description shown in post header."
author: "Neel Parihar"
github: "neelparihar"
twitter: "neelparihar_"
category: "tech"
tags: ["tag1", "tag2"]
createdAt: "2023-01-01T00:00:00.000Z"
---

Post content here in Markdown...
```

### Adding a Project

Create a Markdown file in `/content/projects/` with front matter:

```markdown
---
id: 1
title: "Project Name"
description: "Short description."
long_description: "Detailed description for the project page."
tech: ["Vue", "Firebase", "TailwindCSS"]
logo: "/images/project-logo.png"
github: "https://github.com/..."
website: "https://..."
---

Project details in Markdown...
```

The `tech` array drives the tech-filter tabs on the projects listing page.

---

## Vue & Component Conventions

### General

- **Vue 2** syntax (Options API). Do not use Vue 3 Composition API patterns.
- Components use `<template>`, `<script>`, `<style scoped>` ordering.
- `asyncData()` hook is used in page components for server-side data fetching.
- Lazy loading via `<LazyComponentName>` prefix (auto-import feature).

### Tailwind Usage

- Utility-first. Avoid writing custom CSS unless scoped animations or third-party overrides require it.
- Dark mode: class-based (`dark:`). Default theme is dark.
- Custom colors defined in `tailwind.config.js`:
  - `primary`: `#205295` (blue)
  - `hot-pink`: `#fd2d78` (accent, used on tech tags and highlights)
  - Custom grays for dark backgrounds
- Use `@apply` sparingly; prefer inline utilities.

### Styling Third-Party Components

Use `>>>` (deep selector) for styling slots/children of external components:

```vue
<style scoped>
.wrapper >>> .child-class {
  color: white;
}
</style>
```

### Routing & i18n

- Use `localePath()` for all internal links to ensure i18n compatibility.
- Dynamic routes use `_slug.vue` naming convention.

### Feature Flag Pattern

Components conditionally render based on `$config`:

```vue
<template>
  <div v-if="$config.blog.enabled">...</div>
</template>
```

Runtime config is exposed from `neelparihar.config.js` via `nuxt.config.js`.

---

## State Management (Vuex)

Store modules are flat (no namespacing). Key store shape:

```js
{
  user: null,       // Authenticated Firebase user or null
  comments: {},     // { [slug]: [Comment] }
  likes: {}         // { [slug]: { count, id } }
}
```

### Key Actions

| Action | Description |
|--------|-------------|
| `authAction()` | Initialize Firebase auth listener |
| `signInUserWithGoogle()` | Google OAuth popup |
| `signOut()` | Sign out current user |
| `postComment({ text, slug })` | Create comment for a post |
| `fetchComments({ slug })` | Fetch comments (cached in store) |
| `fetchLikes({ slug })` | Fetch like count |
| `incrementLikes({ count, slug, id })` | Increment like counter |

---

## Firebase (Optional)

Firebase is disabled by default. To enable:

1. Set `firebase.enabled: true` in `neelparihar.config.js`.
2. Add Firebase credentials to `.env` (see `.env.example`).
3. Configure Firestore security rules as documented in `README.md`.

When disabled, comments and likes components are hidden via feature flags.

---

## Animations

- **AOS (Animate On Scroll)**: Add `data-aos="fade-up"` (or other effects) attributes. Initialized in `plugins/aos.js` with 120px offset and 400ms duration.
- **Vue Typer**: Used for typewriter text effects. Registered globally via `plugins/vuetyper.js`.
- **Eye tracking** in `HeroSection.vue`: JavaScript mousemove listener moves eye pupils to track cursor. Logic is in scoped `<script>` section.
- **Hover transforms**: Use Tailwind classes like `hover:scale-110`, `hover:-rotate-12`, `transition-all`.

---

## Commit Message Conventions

This repo follows a conventional commit style:

```
<type>: <short description>
```

Common types used in this project:
- `feat:` — new feature
- `fix:` — bug fix
- `refactor:` — code improvement without behavior change
- `chore:` — dependency updates, config changes
- `docs:` — documentation changes

Examples:
```
feat: add personal profile component with details and images
refactor: simplify HeroSection.vue layout and improve text consistency
fix: resolve mobile menu overflow on small screens
```

---

## Environment Variables

See `.env.example` for all available variables. Key ones:

```
# Firebase (only needed if firebase.enabled = true)
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=

# AWS (only needed for S3/CloudFront deployment via gulpfile)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
S3_BUCKET=
CLOUDFRONT_DISTRIBUTION_ID=
```

Never commit `.env` — it is in `.gitignore`.

---

## Common Gotchas

1. **Nuxt 2, not Nuxt 3**: This is Nuxt 2 with Vue 2. Do not use `<script setup>`, `defineComponent`, or Vue 3 composition APIs.
2. **Static generation only**: `nuxt.config.js` sets `ssr: false, target: 'static'`. All data fetching must work at build time or client-side.
3. **Blog disabled by default**: `blog.enabled: false`. Enable in config to use blog features.
4. **Firebase disabled by default**: Comments and likes require Firebase. Do not add Firestore calls without checking the feature flag.
5. **Deep selectors**: Use `>>>` not `::v-deep` (Vue 2 scoped style syntax).
6. **i18n routes**: Always use `localePath()` not raw string paths for internal navigation.
7. **Reading time**: Auto-calculated via a Nuxt Content hook in `nuxt.config.js` — no manual front matter needed.
8. **Package manager**: `package-lock.json` is present — use `npm`, not `yarn` or `pnpm`.
