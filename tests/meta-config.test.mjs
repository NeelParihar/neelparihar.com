/**
 * Tests: Meta tag configuration in nuxt.config.js
 * Verifies og:url uses config.domain (not config.social object)
 * and twitter:card is "summary_large_image".
 *
 * Uses Node.js built-in test runner (node:test) — no extra deps needed.
 * Run with: node --test tests/meta-config.test.mjs
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const nuxtConfigSrc = readFileSync(path.join(__dirname, '..', 'nuxt.config.js'), 'utf8');

test('og:url uses config.domain, not config.social', () => {
  // Must contain config.domain reference for og:url
  assert.ok(
    nuxtConfigSrc.includes('property: "og:url"') &&
    nuxtConfigSrc.includes('config.domain'),
    'og:url should reference config.domain'
  );

  // Must NOT use config.social as og:url value
  const ogUrlLine = nuxtConfigSrc
    .split('\n')
    .find(line => line.includes('"og:url"'));
  assert.ok(ogUrlLine, 'og:url meta tag must exist');
  assert.ok(
    !ogUrlLine.includes('config.social'),
    `og:url line should NOT reference config.social, got: ${ogUrlLine.trim()}`
  );
});

test('twitter:card is "summary_large_image", not an image path', () => {
  const twitterCardLine = nuxtConfigSrc
    .split('\n')
    .find(line => line.includes('"twitter:card"'));
  assert.ok(twitterCardLine, 'twitter:card meta tag must exist');
  assert.ok(
    twitterCardLine.includes('summary_large_image'),
    `twitter:card should be "summary_large_image", got: ${twitterCardLine.trim()}`
  );
  assert.ok(
    !twitterCardLine.includes('config.image'),
    `twitter:card must not be set to an image path, got: ${twitterCardLine.trim()}`
  );
});

test('twitter:url has https:// prefix', () => {
  const twitterUrlLine = nuxtConfigSrc
    .split('\n')
    .find(line => line.includes('"twitter:url"'));
  assert.ok(twitterUrlLine, 'twitter:url meta tag must exist');
  assert.ok(
    twitterUrlLine.includes('https://'),
    `twitter:url should include https://, got: ${twitterUrlLine.trim()}`
  );
});

test('favicon href is absolute path /favicon.ico', () => {
  const faviconLine = nuxtConfigSrc
    .split('\n')
    .find(line => line.includes('favicon.ico'));
  assert.ok(faviconLine, 'favicon link must exist');
  assert.ok(
    faviconLine.includes('"/favicon.ico"'),
    `favicon href should be "/favicon.ico" (absolute), got: ${faviconLine.trim()}`
  );
});

test('vueGtag plugin is removed from plugins array', () => {
  assert.ok(
    !nuxtConfigSrc.includes('vueGtag'),
    'nuxt.config.js should not reference vueGtag plugin'
  );
});

test('content liveEdit is false', () => {
  const liveEditLine = nuxtConfigSrc
    .split('\n')
    .find(line => line.includes('liveEdit'));
  assert.ok(liveEditLine, 'liveEdit config must exist');
  assert.ok(
    liveEditLine.includes('false'),
    `liveEdit should be false, got: ${liveEditLine.trim()}`
  );
});
