import { Router } from 'express';
import { z } from 'zod';
import { supabase } from '../lib/supabase.js';

const router = Router();

export const listSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(50).optional().default(10),
  tag: z.string().trim().optional(),
  districtId: z.string().uuid().optional(),
});

// GET /api/documents?page=1&pageSize=10&tag=urban&districtId=...
router.get('/', async (req, res, next) => {
  try {
    const parsed = listSchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }
    const { page, pageSize, tag, districtId } = parsed.data;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let q = supabase
      .from('documents')
      .select('id, title, content, metadata, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    // tags/district are expected inside the metadata JSONB column —
    // adjust the key names below if your mock data uses different ones
    if (tag) q = q.contains('metadata', { tags: [tag] });
    if (districtId) q = q.eq('metadata->>district_id', districtId);

    const { data, error, count } = await q;

    if (error) {
      const err = new Error(`Failed to fetch documents: ${error.message}`);
      err.status = 500;
      return next(err);
    }

    res.json({
      page,
      pageSize,
      total: count ?? data.length,
      documents: data.map((d) => ({
        id: d.id,
        title: d.title,
        snippet: (d.content || '').slice(0, 240),
        metadata: d.metadata,
        createdAt: d.created_at,
      })),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/documents/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('documents')
      .select('id, title, content, metadata, created_at')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
