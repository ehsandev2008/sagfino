"use client";

import dynamic from "next/dynamic";
import { InfoCircle, Location, Map1 } from "iconsax-react";
import { toFaDigits } from "@/lib/auth";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="relative h-full w-full overflow-hidden bg-gray-2">
      <div className="absolute inset-0 listings-shimmer opacity-60" />
      <div className="absolute inset-0 grid place-items-center">
        <div className="flex flex-col items-center gap-2 text-gray-7">
          <Map1 size="34" color="currentColor" />
          <span className="text-[11px]">در حال آماده‌سازی نقشه…</span>
        </div>
      </div>
    </div>
  ),
});

export default function MapPanel({
  points = [],
  center,
  cityName,
  total = 0,
  iranOnly = false,
}) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-gray-4 bg-gray-2 shadow-[0_6px_30px_rgba(12,12,12,0.04)]">
      <div className="absolute inset-0 z-0">
        <LeafletMap points={points} center={center} iranOnly={iranOnly} />
      </div>

      <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex items-start justify-between gap-2">
        <div className="rounded-xl border border-white/60 bg-white/95 px-3 py-2 shadow-[0_8px_24px_rgba(12,12,12,0.1)] backdrop-blur-md">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-12">
            <Map1 size="15" variant="Bold" color="#cb1b1b" />
            {toFaDigits(total || points.length)} آگهی روی نقشه
          </span>
          <span className="mt-0.5 flex items-center gap-1 text-[9px] text-gray-7">
            <Location size="11" variant="Bold" color="currentColor" />
            {cityName ?? "سراسر ایران"}
          </span>
        </div>

        <div className="rounded-lg bg-white/90 px-2.5 py-1.5 text-[9px] text-gray-7 shadow-sm backdrop-blur-md">
          برای جزئیات روی قیمت‌ها کلیک کنید
        </div>
      </div>

      {points.length === 0 && (
        <div className="pointer-events-none absolute inset-0 z-[9] grid place-items-center">
          <div className="flex flex-col items-center gap-2 rounded-2xl bg-white/95 px-5 py-4 text-center shadow-lg backdrop-blur">
            <InfoCircle size="26" color="#909090" />
            <p className="text-[11px] font-medium text-gray-10">
              آگهی‌ای با این فیلترها روی نقشه نیست
            </p>
            <p className="text-[9px] text-gray-7">
              فیلترها را تغییر دهید یا شهر دیگری را انتخاب کنید.
            </p>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-center pb-3">
        <span className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-[9px] text-gray-7 shadow-sm backdrop-blur-md">
          <InfoCircle size="12" color="currentColor" />
          نقشهٔ تعاملی · {toFaDigits(points.length)} نقطه در محدودهٔ انتخابی
        </span>
      </div>
    </div>
  );
}
