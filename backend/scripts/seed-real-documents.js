// Replaces the fabricated "Sonipat District (Demo)" boundary with the REAL
// Sonipat district boundary from OpenStreetMap-derived open data (via the
// udit-001/india-maps-data public GeoJSON repository).
//
// Per your decision: real district boundary + illustrative zones, NO fake
// parcels (since real parcel-level cadastral data isn't publicly available
// in India — that's the exact gap DILRMP/ULPIN is meant to eventually close).
// Hotspots are kept but clearly labeled "illustrative_sample" rather than
// pretending to be real dispute records.
//
// Run from inside the backend/ folder:
//   node scripts/seed-real-geodata.js

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ORG_ID = 'aa111111-1111-1111-1111-111111111111'; // Ministry of Lands (demo org)
const OLD_DEMO_DISTRICT_ID = 'cc333333-3333-3333-3333-333333333333';
const NEW_DISTRICT_ID = 'dd444444-4444-4444-4444-444444444444';

const HARYANA_GEOJSON_URL =
  'https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/states/haryana.geojson';

// Returns [minLon, minLat, maxLon, maxLat] for a Polygon's outer ring
function getBBox(coordinates) {
  const ring = coordinates[0];
  const lons = ring.map((p) => p[0]);
  const lats = ring.map((p) => p[1]);
  return [Math.min(...lons), Math.min(...lats), Math.max(...lons), Math.max(...lats)];
}

async function main() {
  console.log('Fetching real Haryana district boundaries from OpenStreetMap-derived data...');
  const res = await fetch(HARYANA_GEOJSON_URL);
  if (!res.ok) throw new Error(`Failed to fetch Haryana GeoJSON: ${res.status}`);
  const haryana = await res.json();

  const sonipatFeature = haryana.features.find(
    (f) => f.properties.district?.toLowerCase() === 'sonipat'
  );
  if (!sonipatFeature) {
    throw new Error('Could not find Sonipat in the fetched dataset — check the source file.');
  }

  console.log('Found real Sonipat district boundary. Bounding box:', getBBox(sonipatFeature.geometry.coordinates));

  // --- Step 1: remove the old fabricated demo district + its layers ---
  console.log('\nRemoving old fabricated demo district and its geodata layers...');
  await supabase.from('geodata_layers').delete().eq('org_id', ORG_ID); // clears old fake parcels/hotspots/zones
  await supabase.from('districts').delete().eq('id', OLD_DEMO_DISTRICT_ID);

  // --- Step 2: insert the REAL Sonipat district boundary ---
  console.log('Inserting real Sonipat district boundary...');
  const boundaryGeoJSON = JSON.stringify(sonipatFeature.geometry);

  const { error: districtError } = await supabase.rpc('insert_district_from_geojson', {
    p_id: NEW_DISTRICT_ID,
    p_org_id: ORG_ID,
    p_name: 'Sonipat District',
    p_geojson: boundaryGeoJSON,
    p_metadata: { state: 'Haryana', source: 'OpenStreetMap (via india-maps-data)', is_real_boundary: true },
  });

  if (districtError) {
    console.error('  FAILED to insert district:', districtError.message);
    console.error('  Make sure you ran supabase/migrations/014_insert_district_function.sql first.');
    process.exit(1);
  }
  console.log('  Real district boundary inserted.');

  // --- Step 3: illustrative land-use zones, honestly labeled ---
  // These are NOT official zoning data (India has no public parcel-level
  // zoning dataset) — they're plausible sub-areas within the REAL boundary,
  // clearly marked so nobody mistakes them for government records.
  const [minLon, minLat, maxLon, maxLat] = getBBox(sonipatFeature.geometry.coordinates);
  const midLon = (minLon + maxLon) / 2;
  const midLat = (minLat + maxLat) / 2;

  console.log('\nInserting illustrative land-use zones (clearly labeled, not official data)...');
  const zones = [
    {
      layer_type: 'zone',
      properties: {
        zone_type: 'agricultural (illustrative)',
        is_illustrative: true,
        note: 'Approximate sub-area for demo purposes — not official government zoning data',
      },
      geomGeoJSON: {
        type: 'Polygon',
        coordinates: [[[minLon, minLat], [midLon, minLat], [midLon, midLat], [minLon, midLat], [minLon, minLat]]],
      },
    },
    {
      layer_type: 'zone',
      properties: {
        zone_type: 'urban_expansion (illustrative)',
        is_illustrative: true,
        note: 'Approximate sub-area for demo purposes — not official government zoning data',
      },
      geomGeoJSON: {
        type: 'Polygon',
        coordinates: [[[midLon, midLat], [maxLon, midLat], [maxLon, maxLat], [midLon, maxLat], [midLon, midLat]]],
      },
    },
  ];

  const hotspots = [
    {
      layer_type: 'hotspot',
      properties: {
        dispute_type: 'boundary_encroachment (illustrative sample)',
        status: 'active',
        is_illustrative: true,
      },
      geomGeoJSON: { type: 'Point', coordinates: [midLon - 0.02, midLat + 0.01] },
    },
    {
      layer_type: 'hotspot',
      properties: {
        dispute_type: 'title_dispute (illustrative sample)',
        status: 'under_review',
        is_illustrative: true,
      },
      geomGeoJSON: { type: 'Point', coordinates: [midLon + 0.02, midLat - 0.01] },
    },
  ];

  for (const item of [...zones, ...hotspots]) {
    const { error } = await supabase.rpc('insert_geodata_from_geojson', {
      p_org_id: ORG_ID,
      p_layer_type: item.layer_type,
      p_properties: item.properties,
      p_geojson: JSON.stringify(item.geomGeoJSON),
    });
    if (error) {
      console.error(`  FAILED to insert ${item.layer_type}:`, error.message);
    } else {
      console.log(`  Inserted ${item.layer_type}: ${item.properties.zone_type || item.properties.dispute_type}`);
    }
  }

  console.log(
    `\nDone. Real district boundary is live (id: ${NEW_DISTRICT_ID}).\n` +
    `Update DEMO_DISTRICT_ID in your frontend GIS page from\n  '${OLD_DEMO_DISTRICT_ID}'\nto\n  '${NEW_DISTRICT_ID}'`
  );
}

main().catch((err) => {
  console.error('Script failed:', err);
  process.exit(1);
});