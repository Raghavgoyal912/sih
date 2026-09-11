import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env — copy .env.example to .env and fill both in.'
  );
}

// Explicitly using node-fetch instead of Node's built-in fetch (undici).
// Node's built-in fetch has a known intermittent issue on some Windows
// networks where POST/insert requests fail with a bare "TypeError: fetch
// failed" while GET/RPC requests succeed — node-fetch avoids it.
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
  global: { fetch },
});