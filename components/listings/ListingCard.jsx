"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bookmark,
  Building,
  Clock,
  Home2,
  Location,
  Ruler,
  TickCircle,
  Verify,
} from "iconsax-react";
import { toFaDigits } from "@/lib/auth";

/**
 * کارت آگهی اجاره — تصویر، مشخصات، قیمت و دفتر املاک
 */
export default function ListingCard({ property, priority = false }) {
  const [saved, setSaved] = useState(false);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-4 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-6 hover:shadow-[0_18px_45px_rgba(12,12,12,0.08)]">
      <Link
        href={property.href}
        aria-label={`مشاهدهٔ ${property.title}`}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      />

      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-2">
        {property.cover ? (
          <Image
            src={property.cover}
            alt={property.title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="grid h-full place-items-center bg-gray-2 text-gray-6">
            <Home2 size="42" color="currentColor" />
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/30 to-transparent" />

        <span className="pointer-events-none absolute left-3 top-3 flex items-center gap-1 rounded-md bg-black/45 px-2 py-1 text-[10px] text-white backdrop-blur-sm">
          <Clock size="12" color="currentColor" />
          {property.timeLabel}
        </span>

        <button
          type="button"
          aria-label={
            saved ? "حذف از نشان‌شده‌ها" : "افزودن به نشان‌شده‌ها"
          }
          aria-pressed={saved}
          onClick={() => setSaved((value) => !value)}
          className={`absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all hover:scale-105 ${
            saved ? "text-primary" : "text-gray-10 hover:text-primary"
          }`}
        >
          <Bookmark
            size="18"
            color="currentColor"
            variant={saved ? "Bold" : "Linear"}
          />
        </button>

        <div className="pointer-events-none absolute bottom-3 right-3 flex flex-wrap gap-1.5">
          <span className="rounded-md bg-white/90 px-2 py-1 text-[10px] font-medium text-gray-11 shadow-sm backdrop-blur-sm">
            {property.propertyTypeLabel}
          </span>
          {property.isVerified && (
            <span className="flex items-center gap-1 rounded-md bg-success/90 px-2 py-1 text-[10px] font-medium text-white shadow-sm">
              <TickCircle size="12" variant="Bold" color="currentColor" />
              تاییدشده
            </span>
          )}
          {property.isFeatured && (
            <span className="rounded-md bg-primary/90 px-2 py-1 text-[10px] font-medium text-white shadow-sm">
              ویژه
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-3.5">
        <h3 className="line-clamp-2 text-body-xxs font-semibold leading-6 text-gray-12 transition-colors group-hover:text-primary lg:text-body-xs">
          {property.title}
        </h3>

        <p className="flex items-center gap-1 text-[11px] text-gray-8">
          <Location
            size="14"
            color="currentColor"
            variant="Bold"
            className="shrink-0 text-gray-6"
          />
          <span className="truncate">{property.address}</span>
        </p>

        <div className="flex items-center gap-3 text-[11px] text-gray-9">
          {property.rooms > 0 && (
            <span className="flex items-center gap-1">
              <Home2 size="14" color="currentColor" />
              {toFaDigits(property.rooms)} اتاق
            </span>
          )}
          <span className="flex items-center gap-1">
            <Ruler size="14" color="currentColor" />
            {property.areaLabel}
          </span>
          {property.floor > 0 && (
            <span className="flex items-center gap-1">
              <Building size="14" color="currentColor" />
              طبقهٔ {toFaDigits(property.floor)}
            </span>
          )}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 rounded-xl bg-gray-1 p-2.5">
          <div className="min-w-0">
            <span className="block text-[10px] text-gray-7">رهن</span>
            <p
              title={property.depositLabel}
              className="mt-0.5 truncate text-[11px] font-bold text-gray-11 lg:text-body-xxs"
            >
              {property.depositCompact ?? property.depositLabel}
            </p>
          </div>
          <div className="min-w-0 border-r border-gray-3 pr-2.5">
            <span className="block text-[10px] text-gray-7">اجارهٔ ماهانه</span>
            <p
              title={property.rentLabel}
              className="mt-0.5 truncate text-[11px] font-bold text-primary lg:text-body-xxs"
            >
              {property.rentCompact ?? property.rentLabel}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-gray-2 pt-2.5">
          <div className="flex min-w-0 items-center gap-1.5">
            {property.agency?.logo && (
              <span className="relative flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-3 bg-white">
                <Image
                  src={property.agency.logo}
                  alt={property.agency.name ?? "دفتر املاک"}
                  width={28}
                  height={28}
                  className="h-full w-full object-contain p-0.5"
                />
              </span>
            )}
            <span className="truncate text-[10px] text-gray-8">
              {property.agency?.name ?? "دفتر املاک"}
            </span>
            {property.agency?.verified && (
              <Verify
                size="13"
                variant="Bold"
                color="#2B66FF"
                className="shrink-0"
              />
            )}
          </div>
          <span className="flex shrink-0 items-center gap-1 text-[10px] text-gray-7">
            <Clock size="12" color="currentColor" />
            {toFaDigits(property.viewsCount ?? 0)} بازدید
          </span>
        </div>
      </div>
    </article>
  );
}
