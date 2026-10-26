"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bookmark, Home2 } from "iconsax-react";

/**
 * کارت آگهی صفحهٔ اجاره — همان کارت صفحهٔ Home Pro
 * تصویر، زمان انتشار، عنوان، آدرس و مبلغ رهن و اجاره.
 */
export default function ListingCard({ property, priority = false }) {
  const [saved, setSaved] = useState(false);
  const deposit =
    property.depositLabel === "توافقی"
      ? "رهن توافقی"
      : `${property.depositLabel} رهن`;
  const rent =
    property.rentLabel === "توافقی"
      ? "اجاره توافقی"
      : `${property.rentLabel} اجاره`;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-4 bg-white transition-all duration-300 hover:border-gray-6 hover:shadow-md">
      <Link
        href={property.href}
        aria-label={`مشاهدهٔ ${property.title}`}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      />

      <div className="relative aspect-[288/169] w-full overflow-hidden bg-gray-2">
        {property.cover ? (
          <Image
            src={property.cover}
            alt={property.title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 30vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-gray-6">
            <Home2 size="36" color="currentColor" />
          </div>
        )}

        <span className="absolute left-3 top-3 flex items-center justify-center rounded-[4px] bg-black/40 px-2 py-1 text-caption-md text-white backdrop-blur-sm lg:text-body-xs">
          {property.timeLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-3.5 pb-5 pt-2.5 lg:pb-6">
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-body-xxs font-normal text-gray-8 lg:text-body-xs">
              {property.title}
            </h3>
            <button
              type="button"
              aria-label={
                saved ? "حذف از نشان‌شده‌ها" : "افزودن به نشان‌شده‌ها"
              }
              aria-pressed={saved}
              onClick={() => setSaved((value) => !value)}
              className={`relative z-20 shrink-0 transition-colors hover:text-primary ${
                saved ? "text-primary" : "text-gray-8"
              }`}
            >
              <Bookmark
                size="24"
                color="currentColor"
                variant={saved ? "Bold" : "Linear"}
              />
            </button>
          </div>

          <p className="truncate text-body-xxs font-normal text-gray-10 lg:text-body-xs">
            {property.address}
          </p>

          <p className="text-body-xxs font-bold text-gray-11 lg:text-body-xs">
            {deposit}
          </p>

          <p className="text-body-xxs font-bold text-gray-11 lg:text-body-xs">
            {rent}
          </p>
        </div>
      </div>
    </article>
  );
}
