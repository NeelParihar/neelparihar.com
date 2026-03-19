/**
 * Tests: store/state.js factory function
 * Verifies that the factory returns a NEW object on each call (no singleton bug).
 *
 * Run with: node --test tests/state-factory.test.mjs
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const stateSrc = readFileSync(path.join(__dirname, '..', 'store', 'state.js'), 'utf8');

test('state.js exports a factory function (not an object)', () => {
  assert.ok(
    stateSrc.includes('export default function'),
    'state.js must export a factory function with "export default function"'
  );
});

test('state factory does NOT declare a shared const/let/var state outside the function', () => {
  // After the fix, the state object should be inline inside the function, not hoisted.
  const lines = stateSrc.split('\n');
  const stateVarLine = lines.find(
    line => /^const\s+state\s*=/.test(line.trim()) || /^let\s+state\s*=/.test(line.trim()) || /^var\s+state\s*=/.test(line.trim())
  );
  assert.ok(
    !stateVarLine,
    `state.js must not have a module-level state variable. Found: ${stateVarLine}`
  );
});

test('state factory returns a new object each invocation', async () => {
  // Dynamically evaluate the factory using a CJS-compatible approach.
  // We'll parse the module by replacing the ES module export with a plain assignment.
  const factorySrc = stateSrc
    .replace(/export default function\s*\(\)/, 'const stateFactory = function()')
    .replace(/export default/, 'const stateFactory =');

  // Use Function constructor to evaluate the CJS-converted source.
  const fn = new Function(`${factorySrc}; return stateFactory;`);
  const factory = fn();

  assert.equal(typeof factory, 'function', 'state export should be a function');

  const a = factory();
  const b = factory();

  assert.notEqual(a, b, 'Each factory call should return a different object reference');
  assert.deepEqual(a, b, 'Both objects should have the same initial structure');

  // Mutations should not affect each other
  a.user = 'testUser';
  assert.equal(b.user, null, 'Mutating one state instance must not affect another');
});
