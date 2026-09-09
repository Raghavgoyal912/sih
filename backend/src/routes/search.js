import { Router } from 'express';
import { z } from 'zod';
import { supabase } from '../lib/supabase.js';
import { embedText, generateInsight } from '../lib/gemini.js';

const router = Router();

export const searchSchema = z.object({
  query: z.string().trim().min(1, 'query cannot be empty').max(500),
  matchCount: z.number().int().positive().max(20).optional().default(5),
  orgId: z.string().uuid().optional(),
  includeInsight: z.boolean().optional().default(false),
});

// POST /api/search
router.post('/', async (req, res, next) => {
  try {
    const parsed = searchSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }
    const { query, matchCount, orgId, includeInsight } = parsed.data;

    // 1. Embed the query text via Gemini
    const queryEmbedding = await embedText(query);

    // 2. Run the pgvector similarity search RPC (defined in
    //    supabase/migrations/007_search_function.sql)
    const { data: results, error } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_count: matchCount,
      filter_org_id: orgId ?? null,
    });

    if (error) {
      const err = new Error(`Search query failed: ${error.message}`);
      err.status = 500;
      return next(err);
    }

    if (!results || results.length === 0) {
      return res.json({ query, results: [], insight: null });
    }

    // 3. Optional: generate a short AI Insight summary of the top 3 results
    let insight = null;
    if (includeInsight) {
      const top3 = results.slice(0, 3);
      const prompt = `Summarize the shared insight across these land governance research results in under 80 words, in one paragraph:\n\n${top3
        .map((r, i) => `${i + 1}. ${r.title}: ${(r.content || '').slice(0, 300)}`)
        .join('\n')}`;
      insight = await generateInsight(prompt);
    }

    res.json({
      query,
      results: results.map((r) => ({
        id: r.id,
        title: r.title,
        snippet: (r.content || '').slice(0, 240),
        score: Number(r.similarity.toFixed(4)),
        metadata: r.metadata,
      })),
      insight,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
