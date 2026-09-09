import { test } from 'node:test';
import assert from 'node:assert';
import { runSimulation, simulateSchema } from '../routes/simulate.js';

test('runSimulation: happy path returns all expected fields', () => {
  const result = runSimulation({
    landCeilingChangePct: 10,
    registrationFeeReductionPct: 20,
  });
  assert.ok('disputeReductionPct' in result);
  assert.ok('registrationUptakePct' in result);
  assert.ok('revenueImpactPct' in result);
  assert.ok('confidenceScore' in result);
});

test('runSimulation: confidence score is capped at 0.85', () => {
  const result = runSimulation({
    landCeilingChangePct: 20,
    registrationFeeReductionPct: 50,
  });
  assert.ok(result.confidenceScore <= 0.85);
});

test('runSimulation: zero inputs produce zero-effect outputs', () => {
  const result = runSimulation({
    landCeilingChangePct: 0,
    registrationFeeReductionPct: 0,
  });
  assert.strictEqual(result.disputeReductionPct, 0);
  assert.strictEqual(result.registrationUptakePct, 0);
  assert.strictEqual(result.revenueImpactPct, 0);
});

test('simulateSchema: rejects out-of-range landCeilingChangePct', () => {
  const parsed = simulateSchema.safeParse({
    landCeilingChangePct: 999,
    registrationFeeReductionPct: 10,
  });
  assert.strictEqual(parsed.success, false);
});

test('simulateSchema: rejects missing fields', () => {
  const parsed = simulateSchema.safeParse({});
  assert.strictEqual(parsed.success, false);
});

test('simulateSchema: accepts valid input', () => {
  const parsed = simulateSchema.safeParse({
    landCeilingChangePct: -5,
    registrationFeeReductionPct: 15,
  });
  assert.strictEqual(parsed.success, true);
});
