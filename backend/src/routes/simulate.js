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
 * Deliberately simple, explainable weighted model for demo purposes.
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

// POST /api/simulate — public, no login required.
router.post('/', async (req, res, next) => {
  try {
    const parsed = simulateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }
    const inputs = parsed.data;
    const outputs = runSimulation(inputs);

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