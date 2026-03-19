/**
 * Tests: components/home/HeroSection.vue
 * Verifies:
 *  - A named mousemove handler is stored so it can be removed
 *  - beforeDestroy hook is defined to clean up the event listener
 *  - Second eye image has correct alt="eye2"
 *
 * Run with: node --test tests/hero-section.test.mjs
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const heroSrc = readFileSync(
  path.join(__dirname, '..', 'components', 'home', 'HeroSection.vue'),
  'utf8'
);

test('HeroSection stores mousemove handler as a named instance property', () => {
  assert.ok(
    heroSrc.includes('this._mouseMoveHandler'),
    'mousemove listener must be stored as this._mouseMoveHandler to allow removal'
  );
});

test('HeroSection adds the named handler to document mousemove', () => {
  assert.ok(
    heroSrc.includes('document.addEventListener("mousemove", this._mouseMoveHandler)'),
    'document.addEventListener must pass this._mouseMoveHandler (not an anonymous function)'
  );
});

test('HeroSection has beforeDestroy hook that removes the event listener', () => {
  assert.ok(
    heroSrc.includes('beforeDestroy()'),
    'HeroSection must define a beforeDestroy() lifecycle hook'
  );
  assert.ok(
    heroSrc.includes('document.removeEventListener("mousemove", this._mouseMoveHandler)'),
    'beforeDestroy must call removeEventListener with this._mouseMoveHandler'
  );
});

test('Second eye image has alt="eye2"', () => {
  // Find all eye image lines
  const eyeLines = heroSrc
    .split('\n')
    .filter(line => line.includes('/images/eye2.png'));

  assert.equal(eyeLines.length, 2, 'There should be exactly 2 eye image elements');

  const [first, second] = eyeLines;
  assert.ok(first.includes('alt="eye1"'), `First eye should have alt="eye1", got: ${first.trim()}`);
  assert.ok(second.includes('alt="eye2"'), `Second eye should have alt="eye2", got: ${second.trim()}`);
});

test('HeroSection does not register an anonymous mousemove listener', () => {
  // After fix, the addEventListener call should not have an arrow function inline
  const addListenerMatch = heroSrc.match(/document\.addEventListener\("mousemove",\s*(.*?)\)/s);
  assert.ok(addListenerMatch, 'addEventListener call must exist');
  const handlerArg = addListenerMatch[1].trim();
  assert.ok(
    !handlerArg.startsWith('(e)') && !handlerArg.startsWith('function'),
    `mousemove handler should be a reference, not an inline function. Got: ${handlerArg}`
  );
});
