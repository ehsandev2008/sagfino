"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  GeoJSON,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import iranGeo from "@/lib/data/iran.geo.json";
import { formatPriceShort } from "@/lib/listings/format";
import { toFaDigits } from "@/lib/auth";

const IRAN_CENTER = [32.4279, 53.688];
const IRAN_BOUNDS = [
  [24.5, 43.5],
  [40.2, 63.6],
];

// مرزهای ایران به‌صورت یک حفره در یک چندضلعی بزرگ‌تر قرار می‌گیرد تا
// فقط خاک ایران روی نقشه دیده شود و کشورهای همسایه پوشانده شوند.
const MASK_OUTER_RING = [
  [-80, -60],
  [140, -60],
  [140, 80],
  [-80, 80],
  [-80, -60],
];
const IRAN_MASK = {
  type: "Feature",
  properties: {},
  geometry: {
    type: "Polygon",
    coordinates: [MASK_OUTER_RING, iranGeo.features[0].geometry.coordinates[0]],
  },
};

function createPriceIcon(point, large = false) {
  const label = formatPriceShort(point.rent);
  return L.divIcon({
    className: "saghfino-map-pin",
    html: `<div class="saghfino-pin ${
      point.isFeatured ? "saghfino-pin--featured" : ""
    } ${large ? "saghfino-pin--large" : ""}"><span class="saghfino-pin__body">${label}</span><span class="saghfino-pin__arrow"></span></div>`,
    iconSize: large ? [112, 42] : [82, 34],
    iconAnchor: large ? [56, 42] : [41, 34],
    popupAnchor: [0, large ? -40 : -32],
  });
}

function MapController({ center, points, iranOnly = false }) {
  const map = useMap();

  useEffect(() => {
    let timer;
    let resizeTimer;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasCenter =
      Number.isFinite(center?.lat) &&
      Number.isFinite(center?.lng) &&
      Number.isFinite(center?.zoom);

    // نقشهٔ دسکتاپ در موبایل با CSS پنهان می‌شود و ابعاد صفر دارد؛
    // در این حالت Leaflet نمی‌تواند مختصات را محاسبه کند.
    const apply = () => {
      const size = map.getSize();
      if (!size.x || !size.y) return;

      if (iranOnly) {
        map.fitBounds(IRAN_BOUNDS, {
          padding: [18, 18],
          animate: false,
          maxZoom: 6,
        });
        return;
      }

      if (!hasCenter) return;

      if (reduced) {
        map.setView([center.lat, center.lng], center.zoom, { animate: false });
      } else {
        map.flyTo([center.lat, center.lng], center.zoom, {
          animate: true,
          duration: 1.5,
          easeLinearity: 0.22,
        });
      }
    };

    timer = window.setTimeout(apply, 550);

    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        map.invalidateSize({ pan: false });
        apply();
      }, 250);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, [map, center?.lat, center?.lng, center?.zoom, iranOnly]);

  useEffect(() => {
    const timer = window.setTimeout(() => map.invalidateSize(), 350);
    return () => window.clearTimeout(timer);
  }, [map, points.length]);

  return null;
}

export default function LeafletMap({
  points,
  center,
  iranOnly = false,
  largePins = false,
}) {
  const markers = useMemo(
    () =>
      points
        .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng))
        .map((point) => ({ point, icon: createPriceIcon(point, largePins) })),
    [points, largePins]
  );

  return (
    <MapContainer
      center={IRAN_CENTER}
      zoom={5}
      minZoom={4}
      maxZoom={18}
      maxBounds={IRAN_BOUNDS}
      maxBoundsViscosity={1}
      scrollWheelZoom={false}
      zoomControl={false}
      zoomSnap={0.25}
      className="h-full w-full"
      style={{ background: "#f4f5f6" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        subdomains={["a", "b", "c"]}
        maxZoom={19}
      />
      <ZoomControl position="bottomright" />

      {iranOnly && (
        <>
          <GeoJSON
            data={IRAN_MASK}
            interactive={false}
            style={{
              stroke: false,
              fill: true,
              fillColor: "#f4f5f6",
              fillOpacity: 1,
              fillRule: "evenodd",
            }}
          />
          <GeoJSON
            data={iranGeo}
            interactive={false}
            style={{
              color: "#b9bec6",
              weight: 1.5,
              fill: false,
              opacity: 1,
            }}
          />
        </>
      )}

      <MapController center={center} points={points} iranOnly={iranOnly} />

      {markers.map(({ point, icon }) => (
        <Marker key={point.id} position={[point.lat, point.lng]} icon={icon}>
          <Popup closeButton maxWidth={260} minWidth={230} autoPanPadding={[24, 24]}>
            <Link href={point.href} className="block text-right" dir="rtl">
              <span className="relative block h-[112px] w-full overflow-hidden bg-gray-2">
                {point.cover ? (
                  <Image
                    src={point.cover}
                    alt={point.title}
                    fill
                    sizes="260px"
                    className="object-cover"
                  />
                ) : null}
                <span
                  className={`absolute bottom-2 right-2 rounded-md bg-white/92 px-2 py-1 font-medium text-gray-11 ${
                    largePins ? "text-base" : "text-[9px]"
                  }`}
                >
                  {point.propertyTypeLabel}
                </span>
              </span>
              <span className="block p-3">
                <span
                  className={`line-clamp-2 block font-semibold text-gray-12 ${
                    largePins ? "text-base leading-7" : "text-[11px] leading-5"
                  }`}
                >
                  {point.title}
                </span>
                <span
                  className={`mt-1 flex items-center justify-between gap-2 text-gray-9 ${
                    largePins ? "text-base" : "text-[10px]"
                  }`}
                >
                  <span className="truncate">
                    {point.neighborhood}، {point.cityName}
                  </span>
                  <span className="shrink-0">{toFaDigits(point.area)} متر</span>
                </span>
                <span className="mt-2 flex items-center justify-between gap-2 border-t border-gray-2 pt-2">
                  <span
                    className={`text-gray-9 ${largePins ? "text-base" : "text-[10px]"}`}
                  >
                    اجاره
                    <span
                      className={`mr-1 block font-bold text-primary ${
                        largePins ? "text-base" : "text-[11px]"
                      }`}
                    >
                      {point.rentLabel}
                    </span>
                  </span>
                  <span
                    className={`rounded-lg bg-gray-1 px-2 py-1 text-gray-9 ${
                      largePins ? "text-base" : "text-[9px]"
                    }`}
                  >
                    مشاهده آگهی
                  </span>
                </span>
              </span>
            </Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
