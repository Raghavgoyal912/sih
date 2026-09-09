-- RPC function used by GET /api/geodata.
-- PostgREST (Supabase's auto-API) can't run ST_AsGeoJSON() inline in a
-- normal select, so this function does the PostGIS -> GeoJSON conversion
-- server-side and returns plain rows the backend can group by layer_type.

CREATE OR REPLACE FUNCTION geodata_as_geojson (
  district_id_input UUID
)
RETURNS TABLE (
  id UUID,
  layer_type TEXT,
  properties JSONB,
  geojson TEXT
)
LANGUAGE sql STABLE
AS $$
  SELECT
    geodata_layers.id,
    geodata_layers.layer_type,
    geodata_layers.properties,
    ST_AsGeoJSON(geodata_layers.geom) AS geojson
  FROM geodata_layers
  JOIN districts ON districts.id = district_id_input
  WHERE
    geodata_layers.org_id = districts.org_id
    AND ST_Intersects(geodata_layers.geom, districts.boundary);
$$;

GRANT EXECUTE ON FUNCTION geodata_as_geojson TO anon, authenticated;
