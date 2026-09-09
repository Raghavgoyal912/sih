import { Router } from 'express';
import { z } from 'zod';
import { supabase } from '../lib/supabase.js';

const router = Router();

export const simulateSchema = z.object({
  landCeilingChangePct: z.number().min(-20).max(20),
  registrationFeeReductionPct: z.number().min(0).max(50),
});

/**
 * TRANSPARENT RULE-BASED SIMULATION FORMULA (NOT real microsimulation)
 * ---------------------------------------------------------------------
 * This is a deliberately simple, explainable weighted model for demo
 * purposes. Documented here so it can be honestly described in the
 * pitch as "a simplified rules engine; production version would use
 * full microsimulation techniques."
 *
 * disputeReductionPct   = landCeilingChangePct * -0.6   (loosening ceiling
 *                          tends to reduce disputes; weight is illustrative)
 * registrationUptakePct = registrationFeeReductionPct * 0.8  (cheaper
 *                          registration -> more formal registrations)
 * revenueImpactPct      = registrationFeeReductionPct * -0.5
 *                          + registrationUptakePct * 0.3
 *                          (fee cut lowers revenue per transaction, partly
 *                          offset by higher transaction volume)
 * confidenceScore        = 0.55 base, +0.02 per pp of input magnitude,
 *                          capped at 0.85 (larger policy swings are modeled
 *                          with more historical precedent in a real system,
 *                          so confidence is intentionally capped low here)
 */
export function runSimulation({ landCeilingChangePct, registrationFeeReductionPct }) {
  const disputeReductionPct = Number((landCeilingChangePct * -0.6).toFixed(2));
  const registrationUptakePct = Number((registrationFeeReductionPct * 0.8).toFixed(2));
  const revenueImpactPct = Number(
    (registrationFeeReductionPct * -0.5 + registrationUptakePct * 0.3).toFixed(2)
  );

  const magnitude = Math.abs(landCeilingChangePct) + registrationFeeReductionPct;
  const confidenceScore = Number(
    Math.min(0.55 + magnitude * 0.02, 0.85).toFixed(2)
  );

  return {
    disputeReductionPct,
    registrationUptakePct,
    revenueImpactPct,
    confidenceScore,
  };
}

// POST /api/simulate
router.post('/', async (req, res, next) => {
  try {
    const parsed = simulateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }
    const inputs = parsed.data;
    const outputs = runSimulation(inputs);

    // Insert into simulation_runs. org_id/user_id are populated via the
    // DEFAULT values already set on this table (tied to the caller's JWT
    // claims) — see supabase/migrations/004_auth_rbac.sql. Since this
    // backend uses the service role key (which bypasses those defaults),
    // we pass status/timestamps explicitly instead.
    const { data, error } = await supabase
      .from('simulation_runs')
      .insert({
        inputs,
        outputs,
        confidence_score: outputs.confidenceScore,
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      const err = new Error(`Failed to save simulation run: ${error.message}`);
      err.status = 500;
      return next(err);
    }

    res.json({
      id: data.id,
      inputs,
      outputs,
      confidenceScore: outputs.confidenceScore,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
