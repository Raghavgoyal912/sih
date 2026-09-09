# BhoomiSetu Backend

Express backend for the BhoomiSetu land governance platform, connecting to your existing Supabase project and Gemini (Google AI Studio).

## What's inside

- `POST /api/search` — semantic search over `documents` using Gemini embeddings + pgvector
- `GET /api/documents` — paginated, filterable document listing
- `GET /api/geodata?districtId=...` — GeoJSON for a district's parcels/hotspots/zones
- `POST /api/simulate` — rule-based policy simulation, saves to `simulation_runs`
- `supabase/migrations/006, 007, 008` — 3 SQL files you need to run in Supabase before this backend will work (see below)

## Setup

1. **Copy this whole `backend/` folder into your `bhoomisetu` project**, alongside your existing Next.js app (don't merge folders — keep it separate, e.g. `bhoomisetu/backend/`).

2. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Create your `.env` file:**
   ```bash
   cp .env.example .env
   ```
   Then fill in:
   - `SUPABASE_URL` — same URL as your frontend
   - `SUPABASE_SERVICE_ROLE_KEY` — from Supabase dashboard → Settings → API Keys → **Secret keys** (NOT the publishable key — this one bypasses RLS, so never expose it to the frontend or commit it)
   - `GEMINI_API_KEY` — from Google AI Studio → Get API key

4. **Run the 3 new SQL migrations in Supabase's SQL Editor, in this exact order:**
   - `supabase/migrations/006_fix_embedding_dim.sql` — fixes a dimension mismatch: your `documents.embedding` column was created as `vector(1536)` (OpenAI-sized), but this backend uses Gemini's `text-embedding-004` model, which returns 768-dim vectors. This migration resizes the column. **Run this before inserting any real documents** — if you already have rows with 1536-dim embeddings in there, this will fail or corrupt them; in that case, clear the table first.
   - `supabase/migrations/007_search_function.sql` — creates the `match_documents` Postgres function that `/api/search` calls for fast similarity search.
   - `supabase/migrations/008_geodata_geojson_function.sql` — creates the `geodata_as_geojson` function that `/api/geodata` calls to convert PostGIS geometry into GeoJSON.

5. **Run the server:**
   ```bash
   npm run dev
   ```
   You should see `BhoomiSetu backend running on http://localhost:4000`.

6. **Test it's alive:**
   ```bash
   curl http://localhost:4000/health
   ```

## Running tests

```bash
npm test
```
14 tests covering input validation and the simulation formula. These are schema/logic-level tests (no live Supabase calls), so they'll pass without a real `.env` — safe to run anytime.

## Known gaps / things to know before demo day

- **`/api/simulate` uses the service role key**, which bypasses Row Level Security — so the `org_id`/`user_id` auto-tagging you set up via JWT defaults (migration 004) won't fire here. Right now every simulation run saves with `org_id`/`user_id` as `NULL`. Fine for a hackathon demo; for anything beyond that, either pass `org_id`/`user_id` explicitly in the request body (after adding auth middleware) or switch this route to use the user's own JWT instead of the service role key.
- **`/api/documents` filtering by tag/district** assumes those live inside the `metadata` JSONB column (e.g. `{"tags": ["urban"], "district_id": "..."}`) — adjust the key names in `src/routes/documents.js` if your mock data uses a different shape.
- **No auth middleware yet** — none of these routes currently check who's calling them; they're wide open once the server is reachable. Fine for local dev; add a Supabase JWT verification middleware before deploying anywhere public.
- **Simulation formula is intentionally simple** — see the comment block at the top of `src/routes/simulate.js` for the exact weights, so you can explain it honestly if judges ask.

## Wiring this to your frontend

Once this is running, point your merged Next.js app's fetch calls (or the API client Antigravity sets up) at `http://localhost:4000/api/...` in development, and at your deployed Railway/Render URL in production.
