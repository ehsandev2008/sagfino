"use client";

import Image from "next/image";
import Link from "next/link";

/**
 * کارت مشاور املاک برتر
 */
export default function AdvisorCard({ advisor, compact = false }) {
  return (
    <article className="group flex h-full flex-col items-center rounded-xl border border-gray-4 bg-white px-5 pb-6 pt-7 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-gray-5 hover:shadow-lg">
      {/* تصویر مشاور */}
      <div
        className={`relative shrink-0 overflow-hidden rounded-full bg-gray-2 ring-1 ring-gray-3 ${
          compact ? "h-20 w-20 sm:h-28 sm:w-28" : "h-28 w-28"
        }`}
      >
        <Image
          src={advisor.image}
          alt={advisor.name}
          fill
          sizes={compact ? "(max-width: 639px) 80px, 112px" : "112px"}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      {/* نام و دفتر */}
      <h3
        className={`font-bold text-gray-12 ${
          compact
            ? "mt-3 text-center text-[12px] sm:mt-4 sm:text-body-s"
            : "mt-4 text-body-s"
        }`}
      >
        {advisor.name}
      </h3>
      <p
        className={`mt-1 text-gray-9 ${
          compact ? "text-[11px] sm:text-body-xxs" : "text-body-xxs"
        }`}
      >
        {advisor.office}
      </p>
      <p
        className={`mt-1 text-gray-9 ${
          compact ? "text-[11px] sm:text-body-xxs" : "text-body-xxs"
        }`}
      >
        امتیاز {advisor.rating} از ۵
      </p>

      {/* دکمه پروفایل */}
      <Link
        href={advisor.href}
        className={`inline-flex items-center justify-center rounded-lg border border-primary text-primary transition-colors duration-300 hover:bg-primary hover:text-white ${
          compact
            ? "mt-4 h-9 w-full max-w-[168px] px-2 text-[11px] sm:mt-5 sm:h-10 sm:px-6 sm:text-button-md"
            : "mt-5 h-10 min-w-[168px] px-6 text-button-md"
        }`}
      >
        نمایش پروفایل
      </Link>
    </article>
  );
}
