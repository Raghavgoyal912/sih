import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY; // the PUBLIC/publishable key, not the service role key

if (!SUPABASE_ANON_KEY) {
  console.warn(
    'WARNING: SUPABASE_ANON_KEY is not set in backend .env — auth-protected routes will fail. ' +
    'This is the same publishable key your frontend uses (Settings -> API Keys -> Publishable key).'
  );
}

/**
 * requireAuth middleware:
 * - Reads the "Authorization: Bearer <token>" header sent by the frontend
 *   (the user's real Supabase session access token)
 * - Verifies it and attaches req.user
 * - Attaches req.supabase — a Supabase client scoped to THIS user's JWT,
 *   so RLS policies apply exactly as if the user queried directly.
 *
 * Use this on routes that write user/org-scoped data (e.g. /api/simulate).
 * Routes that are intentionally public (search, geodata, documents) don't
 * need this — they can keep using the service-role client.
 */
export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: 'Missing Authorization header. Please log in.' });
    }

    // A client scoped to this user's token — every query made with this
    // client is subject to RLS exactly as if the user made it themselves.
    const scopedClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
      global: { fetch, headers: { Authorization: `Bearer ${token}` } },
    });

    const { data: userData, error: userError } = await scopedClient.auth.getUser(token);
    if (userError || !userData?.user) {
      return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
    }

    req.user = userData.user;
    req.supabase = scopedClient;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ error: 'Authentication check failed.' });
  }
}
