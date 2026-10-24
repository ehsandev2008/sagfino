"use client";

import Image from "next/image";
import Link from "next/link";

/**
 * کارت مشاور املاک برتر
 */
export default function AdvisorCard({ advisor }) {
  return (
    <article className="group flex h-full flex-col items-center rounded-xl border border-gray-4 bg-white px-5 pb-6 pt-7 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-gray-5 hover:shadow-lg">
      {/* تصویر مشاور */}
      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full bg-gray-2 ring-1 ring-gray-3">
        <Image
          src={advisor.image}
          alt={advisor.name}
          fill
          sizes="112px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      {/* نام و دفتر */}
      <h3 className="mt-4 text-body-s font-bold text-gray-12">
        {advisor.name}
      </h3>
      <p className="mt-1 text-body-xxs text-gray-9">{advisor.office}</p>
      <p className="mt-1 text-body-xxs text-gray-9">
        امتیاز {advisor.rating} از ۵
      </p>

      {/* دکمه پروفایل */}
      <Link
        href={advisor.href}
        className="mt-5 inline-flex h-10 min-w-[168px] items-center justify-center rounded-lg border border-primary px-6 text-button-md text-primary transition-colors duration-300 hover:bg-primary hover:text-white"
      >
        نمایش پروفایل
      </Link>
    </article>
  );
}
