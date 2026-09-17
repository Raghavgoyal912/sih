import { Router } from 'express';
import { z } from 'zod';
import { supabase } from '../lib/supabase.js';

const router = Router();

const DEFAULT_ORG_ID = 'aa111111-1111-1111-1111-111111111111'; // Ministry of Lands (demo org)

const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1, 'Workspace name is required').max(120),
  description: z.string().trim().max(500).optional().default(''),
  isPrivate: z.boolean().optional().default(false),
});

// GET /api/workspaces — public, no login required.
router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('workspaces')
      .select('id, name, description, is_private, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      const err = new Error(`Failed to fetch workspaces: ${error.message}`);
      err.status = 500;
      return next(err);
    }

    res.json({ workspaces: data });
  } catch (err) {
    next(err);
  }
});

// POST /api/workspaces — public, no login required.
router.post('/', async (req, res, next) => {
  try {
    const parsed = createWorkspaceSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }
    const { name, description, isPrivate } = parsed.data;

    const { data, error } = await supabase
      .from('workspaces')
      .insert({
        org_id: DEFAULT_ORG_ID,
        name,
        description,
        is_private: isPrivate,
      })
      .select()
      .single();

    if (error) {
      const err = new Error(`Failed to create workspace: ${error.message}`);
      err.status = 500;
      return next(err);
    }

    res.status(201).json({ workspace: data });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/workspaces/:id — public, no login required.
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('workspaces').delete().eq('id', id);

    if (error) {
      const err = new Error(`Failed to delete workspace: ${error.message}`);
      err.status = 500;
      return next(err);
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;