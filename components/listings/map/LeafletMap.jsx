"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { formatPriceShort } from "@/lib/listings/format";
import { toFaDigits } from "@/lib/auth";

const IRAN_CENTER = [32.4279, 53.688];

function createPriceIcon(point) {
  const label = formatPriceShort(point.rent);
  return L.divIcon({
    className: "saghfino-map-pin",
    html: `<div class="saghfino-pin ${
      point.isFeatured ? "saghfino-pin--featured" : ""
    }"><span class="saghfino-pin__body">${label}</span><span class="saghfino-pin__arrow"></span></div>`,
    iconSize: [82, 34],
    iconAnchor: [41, 34],
    popupAnchor: [0, -32],
  });
}

function MapController({ center, points }) {
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
    // در این حالت Leaflet نمی‌تواند flyTo را محاسبه کند.
    const apply = () => {
      if (!hasCenter) return;
      const size = map.getSize();
      if (!size.x || !size.y) return;

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
  }, [map, center?.lat, center?.lng, center?.zoom]);

  useEffect(() => {
    const timer = window.setTimeout(() => map.invalidateSize(), 350);
    return () => window.clearTimeout(timer);
  }, [map, points.length]);

  return null;
}

export default function LeafletMap({ points, center, cityName }) {
  const markers = useMemo(
    () =>
      points
        .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng))
        .map((point) => ({ point, icon: createPriceIcon(point) })),
    [points]
  );

  return (
    <MapContainer
      center={IRAN_CENTER}
      zoom={5}
      minZoom={4}
      maxZoom={18}
      scrollWheelZoom={false}
      zoomControl={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        subdomains={["a", "b", "c"]}
        maxZoom={19}
      />
      <ZoomControl position="bottomright" />
      <MapController center={center} points={points} />

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
                <span className="absolute bottom-2 right-2 rounded-md bg-white/92 px-2 py-1 text-[9px] font-medium text-gray-11">
                  {point.propertyTypeLabel}
                </span>
              </span>
              <span className="block p-3">
                <span className="line-clamp-2 block text-[11px] font-semibold leading-5 text-gray-12">
                  {point.title}
                </span>
                <span className="mt-1 flex items-center justify-between gap-2 text-[10px] text-gray-7">
                  <span className="truncate">
                    {point.neighborhood}، {point.cityName}
                  </span>
                  <span className="shrink-0">{toFaDigits(point.area)} متر</span>
                </span>
                <span className="mt-2 flex items-center justify-between gap-2 border-t border-gray-2 pt-2">
                  <span className="text-[10px] text-gray-7">
                    اجاره
                    <span className="mr-1 block text-[11px] font-bold text-primary">
                      {point.rentLabel}
                    </span>
                  </span>
                  <span className="rounded-lg bg-gray-1 px-2 py-1 text-[9px] text-gray-9">
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
