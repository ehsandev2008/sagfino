"use client";

import Image from "next/image";
import Link from "next/link";
import { Verify } from "iconsax-react";

/**
 * کامپوننت کارت آژانس / مشاور املاک برتر
 */
export default function AgencyCard({ agency }) {
  return (
    <article className="group flex h-full flex-col items-center justify-between rounded-2xl border border-gray-4 bg-white p-6 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 hover:border-gray-5 hover:shadow-lg">
      <div className="flex w-full flex-col items-center">
        {/* لوگوی آژانس */}
        <div className="flex h-20 w-20 items-center justify-center">
          <Image
            src={agency.logo}
            alt={agency.name}
            width={80}
            height={80}
            className="max-h-20 max-w-20 object-contain transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>

        {/* نام آژانس و نشان تایید */}
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {agency.verified && (
            <Verify
              size="18"
              variant="Bold"
              color="#2B66FF"
              className="shrink-0"
            />
          )}
          <h3 className="text-body-xs font-bold text-gray-12 lg:text-body-s">
            {agency.name}
          </h3>
        </div>

        {/* موقعیت مکانی */}
        <p className="mt-2 text-caption-md text-gray-9 lg:text-body-xxs">
          {agency.location}
        </p>

        {/* میزان رضایتمندی */}
        <p className="mt-2 text-caption-md text-gray-9 lg:text-body-xxs">
          میزان رضایتمندی: {agency.satisfaction}
        </p>

        {/* آگهی‌های فعال */}
        <p className="mt-2 text-caption-md text-gray-9 lg:text-body-xxs">
          آگهی‌های فعال: {agency.activeAds}
        </p>
      </div>

      {/* لینک مشاهده نظرات */}
      <Link
        href={agency.href}
        className="mt-5 block text-caption-md font-medium text-gray-10 transition-colors hover:text-primary hover:underline lg:text-body-xxs"
      >
        مشاهده نظرات کاربران {agency.reviewsCount && `(${agency.reviewsCount} نظر)`}
      </Link>
    </article>
  );
}
