"use client";

import { CircleMarker, MapContainer, TileLayer, ZoomControl, useMap, useMapEvents } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

const IRAN_BOUNDS = [
  [24.5, 43.5],
  [40.2, 63.6],
];

function MapController({ center }) {
  const map = useMap();

  useEffect(() => {
    map.setView([center.lat, center.lng], center.zoom, { animate: false });
    const timer = window.setTimeout(() => map.invalidateSize(), 100);

    return () => window.clearTimeout(timer);
  }, [center.lat, center.lng, center.zoom, map]);

  return null;
}

function MapClickHandler({ onSelect }) {
  useMapEvents({
    click(event) {
      onSelect({
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      });
    },
  });

  return null;
}

export default function LocationPicker({ center, position, onSelect }) {
  return (
    <div className="h-64 overflow-hidden rounded-xl border border-gray-4 bg-gray-2">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={center.zoom}
        minZoom={4}
        maxZoom={19}
        maxBounds={IRAN_BOUNDS}
        maxBoundsViscosity={1}
        scrollWheelZoom={false}
        zoomControl={false}
        className="h-full w-full"
        aria-label="برای انتخاب موقعیت ملک روی نقشه کلیک کنید"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          subdomains={["a", "b", "c"]}
          maxZoom={19}
        />
        <ZoomControl position="bottomright" />
        <MapController center={center} />
        <MapClickHandler onSelect={onSelect} />
        {position && (
          <CircleMarker
            center={[position.lat, position.lng]}
            radius={9}
            pathOptions={{
              color: "#ffffff",
              weight: 3,
              fillColor: "#cb1b1b",
              fillOpacity: 1,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
