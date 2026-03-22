---
id: 2
title: "CSS Custom Properties: The Underrated Superpower for Dynamic Theming"
description: "CSS variables aren't just for colours. Used correctly, they unlock runtime theming, component scoping, and animation tricks that preprocessors simply can't do."
long_description: "A practical guide to CSS custom properties beyond the basics — covering cascading scope, JavaScript interop, animation with @property, and building a zero-JavaScript dark mode toggle."
createdAt: "2025-03-15T09:00:00.000Z"
image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
tags:
  - css
  - theming
  - frontend
  - dark-mode
category: frontend
author:
  name: Neel Parihar
  twitter: neelpariharr
  image: /images/avatar.png
---

SASS variables are compile-time constants. CSS custom properties are live, reactive values that cascade through the DOM, can be read and written from JavaScript, and can even be animated. Once you understand the difference, you'll reach for them for a whole class of problems you used to solve with JS state.

## The Cascade Is the Point

The killer feature of CSS custom properties is that they **inherit and cascade** like any other CSS property.

```css
:root {
  --color-primary: #205295;
  --spacing-base: 16px;
}

.card {
  /* Override just for this component and its children */
  --color-primary: #fd2d78;
  background: var(--color-primary);
}

.card__badge {
  /* Picks up the card's override, not root */
  color: var(--color-primary);
}
```

This is something SASS `$variables` can never do — the value resolves at *render time*, not compile time, based on where in the DOM the element lives.

## Dark Mode Without JavaScript

Most dark mode tutorials reach for JavaScript and `classList.toggle('dark')`. You can do it with **zero JS** using the `prefers-color-scheme` media query and custom properties:

```css
:root {
  --bg: #ffffff;
  --text: #18191a;
  --surface: #f4f4f4;
  --primary: #205295;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #18191a;
    --text: #ececec;
    --surface: #212324;
    --primary: #4a8fd4;
  }
}

body {
  background: var(--bg);
  color: var(--text);
}
```

Every component that uses these variables updates instantly. No JavaScript, no flash, no hydration issues.

## JavaScript Interop — Reading and Writing at Runtime

Custom properties bridge CSS and JS cleanly:

```js
// Read a value
const primary = getComputedStyle(document.documentElement)
  .getPropertyValue('--color-primary').trim()

// Write a value — triggers a CSS repaint, not a JS rerender
document.documentElement.style.setProperty('--color-primary', '#fd2d78')

// Scoped to a single element
card.style.setProperty('--card-angle', '12deg')
```

This pattern is significantly cheaper than updating inline styles directly, because you're changing a single variable and letting CSS do the fan-out across all properties that reference it.

## Animating with `@property` (Typed Custom Properties)

Browsers can't interpolate a regular custom property because they don't know its type — `--color` could be a color, a number, or a string. The `@property` at-rule fixes this:

```css
@property --gradient-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

.animated-border {
  background: conic-gradient(
    from var(--gradient-angle),
    #205295,
    #fd2d78,
    #205295
  );
  animation: rotate-gradient 4s linear infinite;
}

@keyframes rotate-gradient {
  to { --gradient-angle: 360deg; }
}
```

Without `@property`, that animation would not work — the browser would jump between the `0deg` and `360deg` values instead of interpolating. With it, you get a smooth rotating gradient, animated entirely in CSS, no JavaScript.

## Component-Scoped Design Tokens

Custom properties make it trivial to build components that are configurable without props or slots:

```css
/* Component defaults */
.button {
  --btn-bg: var(--color-primary, #205295);
  --btn-radius: 6px;
  --btn-padding: 8px 16px;

  background: var(--btn-bg);
  border-radius: var(--btn-radius);
  padding: var(--btn-padding);
}

/* Variant: override at the use site */
.hero .button {
  --btn-bg: transparent;
  --btn-radius: 9999px;
  border: 2px solid currentColor;
}
```

The button component has no knowledge of the hero variant. The caller overrides the contract (the custom properties) without touching the component internals.

## Fallback Chains

The `var()` function accepts a fallback as a second argument, and they can be chained:

```css
.element {
  /* Use --user-color if set, else --brand-color, else hardcoded */
  color: var(--user-color, var(--brand-color, #205295));
}
```

This makes custom properties great for theming APIs where consumers can override *some* tokens but not all.

## Practical: Stagger Animations with a Single Custom Property

Instead of writing `animation-delay` for every list item individually:

```html
<ul>
  <li style="--i: 0">Item 1</li>
  <li style="--i: 1">Item 2</li>
  <li style="--i: 2">Item 3</li>
</ul>
```

```css
li {
  animation: fade-in 0.4s both;
  animation-delay: calc(var(--i) * 80ms);
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

In Vue:

```html
<li
  v-for="(item, i) in items"
  :key="item.id"
  :style="{ '--i': i }"
>
  {{ item.label }}
</li>
```

One CSS rule. Zero JS animation logic. Infinitely scalable stagger.

## When Not to Use Custom Properties

- **Build-time values that never change** — keep those in SASS/PostCSS for colocation
- **Values read frequently in performance-critical JS** — `getComputedStyle` has a cost; cache it
- **IE11 support** — it doesn't exist, but worth knowing custom properties are a no-go there

CSS custom properties are one of those features that, once they click, you start seeing applications everywhere. They're not just a design token mechanism — they're a runtime reactivity system built into the cascade.
