"use client";

import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const OFFICE_LOCATION = [35.719, 51.418];

export default function ContactMapCanvas() {
  return (
    <MapContainer
      center={OFFICE_LOCATION}
      zoom={15}
      scrollWheelZoom={false}
      zoomControl={false}
      className="h-full w-full"
      aria-label="نقشهٔ موقعیت دفتر مرکزی سقفینو"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        subdomains={["a", "b", "c"]}
        maxZoom={19}
      />
      <ZoomControl position="bottomright" />
      <CircleMarker
        center={OFFICE_LOCATION}
        radius={9}
        pathOptions={{
          color: "#ffffff",
          weight: 3,
          fillColor: "#cb1b1b",
          fillOpacity: 1,
        }}
      >
        <Popup>دفتر مرکزی سقفینو</Popup>
      </CircleMarker>
    </MapContainer>
  );
}
