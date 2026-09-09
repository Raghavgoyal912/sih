import { Router } from 'express';
import { z } from 'zod';
import { supabase } from '../lib/supabase.js';

const router = Router();

const geodataSchema = z.object({
  districtId: z.string().uuid('districtId must be a valid UUID'),
});

// GET /api/geodata?districtId=...
// Returns GeoJSON layers (parcel / hotspot / zone) for one district,
// converting PostGIS geometry -> GeoJSON via the ST_AsGeoJSON RPC below.
router.get('/', async (req, res, next) => {
  try {
    const parsed = geodataSchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }
    const { districtId } = parsed.data;

    // Uses the geodata_as_geojson RPC (see supabase/migrations/008_geodata_geojson_function.sql)
    // since PostgREST can't call ST_AsGeoJSON directly in a .select().
    const { data, error } = await supabase.rpc('geodata_as_geojson', {
      district_id_input: districtId,
    });

    if (error) {
      const err = new Error(`Failed to fetch geodata: ${error.message}`);
      err.status = 500;
      return next(err);
    }

    if (!data || data.length === 0) {
      return res.json({ districtId, layers: { parcel: [], hotspot: [], zone: [] } });
    }

    // Group flat rows into { parcel: [...], hotspot: [...], zone: [...] }
    const layers = { parcel: [], hotspot: [], zone: [] };
    for (const row of data) {
      const feature = {
        type: 'Feature',
        id: row.id,
        properties: row.properties,
        geometry: JSON.parse(row.geojson),
      };
      if (layers[row.layer_type]) layers[row.layer_type].push(feature);
    }

    res.json({ districtId, layers });
  } catch (err) {
    next(err);
  }
});

export default router;
