// Real, open-source district-level boundary data for every Indian state/UT,
// sourced from OpenStreetMap-derived data (udit-001/india-maps-data).
// Fetched lazily per-state when the user picks one, to avoid loading all of
// India's boundary data at once.

export const STATE_GEOJSON_URLS: Record<string, string> = {
  "Andhra Pradesh": "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/states/andhra-pradesh.geojson",
  "Arunachal Pradesh": "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/states/arunachal-pradesh.geojson",
  "Assam": "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/states/assam.geojson",
  "Bihar": "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/states/bihar.geojson",
  "Chhattisgarh": "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/states/chhattisgarh.geojson",
  "Goa": "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/states/goa.geojson",
  "Gujarat": "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/states/gujarat.geojson",
  "Haryana": "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/states/haryana.geojson",
  "Himachal Pradesh": "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/states/himachal-pradesh.geojson",
  "Jharkhand": "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/states/jharkhand.geojson",
  "Karnataka": "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/states/karnataka.geojson",
  "Kerala": "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/states/kerala.geojson",
  "Madhya Pradesh": "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/states/madhya-pradesh.geojson",
  "Maharashtra": "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/states/maharashtra.geojson",
  "Manipur": "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/states/manipur.geojson",
  "Meghalaya": "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/states/meghalaya.geojson",
  "Mizoram": "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/states/mizoram.geojson",
  "Nagaland": "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/states/nagaland.geojson",
  "Odisha": "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/states/odisha.geojson",
  "Punjab": "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/states/punjab.geojson",
  "Rajasthan": "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/states/rajasthan.geojson",
  "Sikkim": "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/states/sikkim.geojson",
  "Tamil Nadu": "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/states/tamil-nadu.geojson",
  "Telangana": "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/states/telangana.geojson",
  "Tripura": "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/states/tripura.geojson",
  "Uttarakhand": "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/states/uttarakhand.geojson",
  "Uttar Pradesh": "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/states/uttar-pradesh.geojson",
  "West Bengal": "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/states/west-bengal.geojson",
  "Andaman and Nicobar Islands": "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/states/andaman-and-nicobar-islands.geojson",
  "Chandigarh": "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/states/chandigarh.geojson",
  "Delhi": "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/states/delhi.geojson",
  "Jammu and Kashmir": "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/states/jammu-and-kashmir.geojson",
  "Ladakh": "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/states/ladakh.geojson",
  "Puducherry": "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/states/puducherry.geojson",
};

export const STATE_NAMES = Object.keys(STATE_GEOJSON_URLS).sort();