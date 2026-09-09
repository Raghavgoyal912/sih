import { test } from 'node:test';
import assert from 'node:assert';
import { searchSchema } from '../routes/search.js';

test('searchSchema: rejects empty query', () => {
  const parsed = searchSchema.safeParse({ query: '' });
  assert.strictEqual(parsed.success, false);
});

test('searchSchema: rejects missing query', () => {
  const parsed = searchSchema.safeParse({});
  assert.strictEqual(parsed.success, false);
});

test('searchSchema: applies default matchCount when omitted', () => {
  const parsed = searchSchema.safeParse({ query: 'land dispute reduction' });
  assert.strictEqual(parsed.success, true);
  assert.strictEqual(parsed.data.matchCount, 5);
});

test('searchSchema: accepts valid query with custom matchCount', () => {
  const parsed = searchSchema.safeParse({
    query: 'urban land dispute strategies',
    matchCount: 10,
  });
  assert.strictEqual(parsed.success, true);
  assert.strictEqual(parsed.data.matchCount, 10);
});
