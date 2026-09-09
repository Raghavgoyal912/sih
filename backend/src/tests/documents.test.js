import { test } from 'node:test';
import assert from 'node:assert';
import { listSchema } from '../routes/documents.js';

test('listSchema: applies defaults when query params omitted', () => {
  const parsed = listSchema.safeParse({});
  assert.strictEqual(parsed.success, true);
  assert.strictEqual(parsed.data.page, 1);
  assert.strictEqual(parsed.data.pageSize, 10);
});

test('listSchema: rejects pageSize above the max of 50', () => {
  const parsed = listSchema.safeParse({ pageSize: '999' });
  assert.strictEqual(parsed.success, false);
});

test('listSchema: rejects invalid districtId (not a UUID)', () => {
  const parsed = listSchema.safeParse({ districtId: 'not-a-uuid' });
  assert.strictEqual(parsed.success, false);
});

test('listSchema: accepts valid tag filter', () => {
  const parsed = listSchema.safeParse({ tag: 'urban' });
  assert.strictEqual(parsed.success, true);
  assert.strictEqual(parsed.data.tag, 'urban');
});
