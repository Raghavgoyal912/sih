"use client";

import { MapContainer, TileLayer, Polygon, CircleMarker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

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

type ActiveLayers = {
  parcel: boolean;
  hotspot: boolean;
  zone: boolean;
};

// GeoJSON stores coordinates as [lon, lat] — Leaflet wants [lat, lon].
function toLatLng([lon, lat]: [number, number]): [number, number] {
  return [lat, lon];
}

function polygonToLatLngs(coordinates: number[][][]): [number, number][] {
  return coordinates[0].map(([lon, lat]) => toLatLng([lon, lat]));
}

// Re-centers the map whenever the district's data first loads
function FitToData({ layers }: { layers: Layers }) {
  const map = useMap();

  useEffect(() => {
    const allPoints: [number, number][] = [];
    [...layers.parcel, ...layers.zone].forEach((f) => {
      if (f.geometry.type === "Polygon") {
        polygonToLatLngs(f.geometry.coordinates).forEach((p) => allPoints.push(p));
      }
    });
    layers.hotspot.forEach((f) => {
      allPoints.push(toLatLng(f.geometry.coordinates as [number, number]));
    });

    if (allPoints.length > 0) {
      map.fitBounds(allPoints as any, { padding: [30, 30] });
    }
  }, [layers, map]);

  return null;
}

export default function GeodataMap({
  layers,
  activeLayers,
  onSelectFeature,
  selectedFeatureId,
}: {
  layers: Layers;
  activeLayers: ActiveLayers;
  onSelectFeature: (feature: GeoFeature) => void;
  selectedFeatureId: string | null;
}) {
  // Fallback center (Sonipat, Haryana) used only until real data loads and fits bounds
  const defaultCenter: [number, number] = [29.0, 77.02];

  return (
    <MapContainer
      center={defaultCenter}
      zoom={12}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitToData layers={layers} />

      {activeLayers.zone &&
        layers.zone.map((feature) => (
          <Polygon
            key={feature.id}
            positions={polygonToLatLngs(feature.geometry.coordinates)}
            pathOptions={{
              color: "#3b82f6",
              weight: 1,
              fillColor: "#3b82f6",
              fillOpacity: 0.15,
            }}
            eventHandlers={{ click: () => onSelectFeature(feature) }}
          >
            <Popup>
              <strong>Land-use zone</strong>
              <br />
              {feature.properties.zone_type}
            </Popup>
          </Polygon>
        ))}

      {activeLayers.parcel &&
        layers.parcel.map((feature) => (
          <Polygon
            key={feature.id}
            positions={polygonToLatLngs(feature.geometry.coordinates)}
            pathOptions={{
              color: "#10b981",
              weight: selectedFeatureId === feature.id ? 3 : 1.5,
              fillColor: "#10b981",
              fillOpacity: selectedFeatureId === feature.id ? 0.5 : 0.3,
            }}
            eventHandlers={{ click: () => onSelectFeature(feature) }}
          >
            <Popup>
              <strong>Parcel {feature.properties.parcel_id}</strong>
              <br />
              {feature.properties.area_acres} acres
            </Popup>
          </Polygon>
        ))}

      {activeLayers.hotspot &&
        layers.hotspot.map((feature) => (
          <CircleMarker
            key={feature.id}
            center={toLatLng(feature.geometry.coordinates as [number, number])}
            radius={selectedFeatureId === feature.id ? 10 : 7}
            pathOptions={{
              color: "#ffffff",
              weight: 1.5,
              fillColor: "#ef4444",
              fillOpacity: 0.9,
            }}
            eventHandlers={{ click: () => onSelectFeature(feature) }}
          >
            <Popup>
              <strong>Dispute: {feature.properties.dispute_type}</strong>
              <br />
              Status: {feature.properties.status}
            </Popup>
          </CircleMarker>
        ))}
    </MapContainer>
  );
}