import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

export const simulateSchema = z.object({
  landCeilingChangePct: z.number().min(-20).max(20),
  registrationFeeReductionPct: z.number().min(0).max(50),
});

/**
 * TRANSPARENT RULE-BASED SIMULATION FORMULA (NOT real microsimulation)
 * See original comment block for full rationale — unchanged from before.
 */
export function runSimulation({ landCeilingChangePct, registrationFeeReductionPct }) {
  const disputeReductionPct = Number((landCeilingChangePct * -0.6).toFixed(2));
  const registrationUptakePct = Number((registrationFeeReductionPct * 0.8).toFixed(2));
  const revenueImpactPct = Number(
    (registrationFeeReductionPct * -0.5 + registrationUptakePct * 0.3).toFixed(2)
  );
  const magnitude = Math.abs(landCeilingChangePct) + registrationFeeReductionPct;
  const confidenceScore = Number(Math.min(0.55 + magnitude * 0.02, 0.85).toFixed(2));
  return { disputeReductionPct, registrationUptakePct, revenueImpactPct, confidenceScore };
}

// POST /api/simulate — now requires a logged-in user.
// req.supabase (set by requireAuth) is scoped to the caller's own JWT, so
// this insert now goes through RLS for real, and org_id/user_id populate
// from the JWT-backed DEFAULT values set in 004_auth_rbac.sql — no more
// NULL org_id/user_id like when the service-role key bypassed everything.
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const parsed = simulateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }
    const inputs = parsed.data;
    const outputs = runSimulation(inputs);

    const { data, error } = await req.supabase
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
