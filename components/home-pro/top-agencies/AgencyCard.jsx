"use client";

import Image from "next/image";
import { Verify } from "iconsax-react";

/**
 * کارت آژانس / مشاور املاک برتر
 * با کلیک روی کارت، پاپ‌آپ اطلاعات همان آژانس باز می‌شود.
 */
export default function AgencyCard({ agency, onOpen }) {
  const openModal = (element) => {
    onOpen?.(agency, element.getBoundingClientRect(), element);
  };

  const handleClick = (event) => {
    openModal(event.currentTarget);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openModal(event.currentTarget);
    }
  };

  return (
    <article
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
      aria-label={`مشاهده اطلاعات ${agency.name}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="group flex h-full w-full cursor-pointer flex-col items-center justify-between rounded-2xl border border-gray-4 bg-white p-6 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 hover:border-gray-5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
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

      {/* راهنمای مشاهده اطلاعات */}
      <span className="mt-5 block text-caption-md font-medium text-gray-10 transition-colors group-hover:text-primary group-hover:underline lg:text-body-xxs">
        مشاهده نظرات کاربران {agency.reviewsCount && `(${agency.reviewsCount} نظر)`}
      </span>
    </article>
  );
}
