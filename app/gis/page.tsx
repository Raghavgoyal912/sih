"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";

// Leaflet touches `window`, which doesn't exist during Next.js server
// rendering — dynamic import with ssr:false keeps it client-only.
const GeodataMap = dynamic(() => import("@/components/GeodataMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-on-surface-variant text-sm">
      Loading map...
    </div>
  ),
});

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
const DEMO_DISTRICT_ID = "cc333333-3333-3333-3333-333333333333";

type GeoFeature = {
  type: "Feature";
  id: string;
  properties: Record<string, any>;
  geometry: { type: string; coordinates: any };
};

type Layers = {
  parcel: GeoFeature[];
  hotspot: GeoFeature[];
  zone: GeoFeature[];
};

export default function GisDashboardPage() {
  const [layers, setLayers] = useState<Layers>({ parcel: [], hotspot: [], zone: [] });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<GeoFeature | null>(null);
  const [activeLayers, setActiveLayers] = useState({
    parcel: true,
    hotspot: true,
    zone: true,
  });

  const loadGeodata = useCallback(async () => {
    setStatus("loading");
    setErrorMessage(null);
    try {
      const res = await fetch(`${API_BASE}/api/geodata?districtId=${DEMO_DISTRICT_ID}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Failed to load geodata (${res.status})`);
      }
      const data = await res.json();
      setLayers(data.layers || { parcel: [], hotspot: [], zone: [] });
      setStatus("idle");
    } catch (err: any) {
      console.error("Geodata error:", err);
      setErrorMessage(err.message || "Could not load map data. Is the backend running?");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    loadGeodata();
  }, [loadGeodata]);

  return (
    <div className="w-full bg-surface min-h-[calc(100vh-6rem)] flex flex-col">
      {/* Top Jurisdiction Bar */}
      <section className="w-full bg-surface-container-lowest border-b border-surface-container shadow-sm px-4 lg:px-8 py-2.5">
        <div className="max-w-[88rem] mx-auto flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-low rounded-lg text-xs font-mono text-on-surface-variant">
              <span className="material-symbols-outlined text-[15px]">public</span>
              <span className="uppercase font-semibold">District:</span>
            </div>
            <span className="bg-surface-container-low text-xs font-semibold text-on-surface rounded-lg px-2.5 py-1.5 border border-surface-container">
              Sonipat District (Demo)
            </span>
            <button
              type="button"
              onClick={loadGeodata}
              className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">refresh</span>
              Refresh
            </button>
          </div>
        </div>
      </section>

      <div className="flex-1 max-w-[88rem] w-full mx-auto px-4 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Layer Controls */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container shadow-sm">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-surface-container">
                <h3 className="text-xs uppercase font-bold tracking-wider text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">layers</span>
                  Cadastral Layers
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                <label className="flex items-center justify-between p-2 rounded bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600" />
                    <span>Land Parcels ({layers.parcel.length})</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={activeLayers.parcel}
                    onChange={(e) => setActiveLayers({ ...activeLayers, parcel: e.target.checked })}
                    className="rounded text-primary focus:ring-primary w-3.5 h-3.5"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
                    <span>Dispute Hotspots ({layers.hotspot.length})</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={activeLayers.hotspot}
                    onChange={(e) => setActiveLayers({ ...activeLayers, hotspot: e.target.checked })}
                    className="rounded text-primary focus:ring-primary w-3.5 h-3.5"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                    <span>Land-Use Zones ({layers.zone.length})</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={activeLayers.zone}
                    onChange={(e) => setActiveLayers({ ...activeLayers, zone: e.target.checked })}
                    className="rounded text-primary focus:ring-primary w-3.5 h-3.5"
                  />
                </label>
              </div>
            </div>
          </aside>

          {/* Center Column: Real Map */}
          <div className="lg:col-span-6 bg-surface-container-lowest rounded-xl border border-surface-container shadow-sm overflow-hidden flex flex-col">
            <div className="px-4 py-3 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-secondary">explore</span>
                <span className="text-xs font-bold text-primary">Sonipat District Cadastre</span>
              </div>
            </div>

            <div className="relative w-full h-[500px]">
              {status === "loading" && (
                <div className="absolute inset-0 bg-surface-container-lowest/80 z-[1000] flex items-center justify-center">
                  <div className="text-on-surface text-sm flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span>Loading map data...</span>
                  </div>
                </div>
              )}

              {status === "error" ? (
                <div className="h-full flex items-center justify-center text-center px-6">
                  <div>
                    <p className="font-semibold text-sm mb-1 text-primary">Could not load map</p>
                    <p className="text-xs text-on-surface-variant">{errorMessage}</p>
                  </div>
                </div>
              ) : (
                <GeodataMap
                  layers={layers}
                  activeLayers={activeLayers}
                  onSelectFeature={setSelectedFeature}
                  selectedFeatureId={selectedFeature?.id ?? null}
                />
              )}
            </div>
          </div>

          {/* Right Column: Selected Feature Inspector */}
          <aside className="lg:col-span-3 bg-surface-container-lowest p-4 rounded-xl border border-surface-container shadow-sm space-y-4">
            <div className="pb-2 border-b border-surface-container">
              <span className="text-[10px] font-mono uppercase text-on-surface-variant font-bold">
                Selected Feature
              </span>
            </div>

            {!selectedFeature && (
              <p className="text-xs text-on-surface-variant">
                Click a parcel, hotspot, or zone on the map to see its details here.
              </p>
            )}

            {selectedFeature && (
              <div className="space-y-3 text-xs">
                {Object.entries(selectedFeature.properties || {}).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-[11px] text-on-surface-variant block capitalize">
                      {key.replace(/_/g, " ")}
                    </span>
                    <span className="font-semibold text-primary">{String(value)}</span>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}