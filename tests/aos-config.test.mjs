/**
 * Tests: plugins/aos.js configuration
 * Verifies:
 *  - No duplicate "aos/dist/aos.css" import (it's in nuxt.config.js css array already)
 *  - `once: true` (animations fire only once)
 *
 * Run with: node --test tests/aos-config.test.mjs
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const aosSrc = readFileSync(path.join(__dirname, '..', 'plugins', 'aos.js'), 'utf8');
const nuxtConfigSrc = readFileSync(path.join(__dirname, '..', 'nuxt.config.js'), 'utf8');

test('aos.js does not import aos.css (already in nuxt.config.js css array)', () => {
  assert.ok(
    !aosSrc.includes('aos/dist/aos.css'),
    'aos.js must not import aos.css — it is already imported via nuxt.config.js css array'
  );
});

test('nuxt.config.js css array includes aos/dist/aos.css', () => {
  assert.ok(
    nuxtConfigSrc.includes('aos/dist/aos.css'),
    'nuxt.config.js should include "aos/dist/aos.css" in the css array'
  );
});

test('AOS config has once: true', () => {
  const onceLine = aosSrc
    .split('\n')
    .find(line => line.trim().startsWith('once:'));
  assert.ok(onceLine, 'AOS config must have an "once" setting');
  assert.ok(
    onceLine.includes('true'),
    `AOS "once" should be true to avoid re-animating on scroll-up, got: ${onceLine.trim()}`
  );
});
