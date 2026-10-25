"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft2,
  ArrowRight2,
  Gallery,
  TickCircle,
} from "iconsax-react";
import { toFaDigits } from "@/lib/auth";

/**
 * گالری تصاویر آگهی با تعویض نرم و بندانگشتی‌ها.
 * اگر آگهی تصویری نداشته باشد، یک تصویر پیش‌فرض نمایش داده می‌شود.
 */
export default function PropertyGallery({
  images = [],
  title,
  isVerified = false,
  isFeatured = false,
}) {
  const photos =
    images.length > 0
      ? images
      : ["/imags/rent images/pexels-vecislavas-popa-1571468 1.webp"];
  const [index, setIndex] = useState(0);

  const go = (step) => {
    setIndex((current) => (current + step + photos.length) % photos.length);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-4 bg-white shadow-[0_4px_24px_rgba(12,12,12,0.03)]">
      <div className="group relative aspect-[16/10] w-full overflow-hidden bg-gray-2">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${index}-${photos[index]}`}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={photos[index]}
              alt={`${title} — تصویر ${toFaDigits(index + 1)}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/35 to-transparent" />

        <div className="absolute right-3 top-3 flex flex-wrap gap-1.5">
          {isVerified && (
            <span className="flex items-center gap-1 rounded-md bg-success/90 px-2 py-1 text-[10px] font-medium text-white shadow-sm backdrop-blur-sm">
              <TickCircle size="12" variant="Bold" color="currentColor" />
              تاییدشده
            </span>
          )}
          {isFeatured && (
            <span className="rounded-md bg-primary/90 px-2 py-1 text-[10px] font-medium text-white shadow-sm backdrop-blur-sm">
              آگهی ویژه
            </span>
          )}
        </div>

        <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1 rounded-md bg-black/45 px-2 py-1 text-[10px] text-white backdrop-blur-sm">
          <Gallery size="12" color="currentColor" />
          {toFaDigits(index + 1)} از {toFaDigits(photos.length)}
        </span>

        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="تصویر بعدی"
              className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-11 shadow-md backdrop-blur transition-all hover:bg-white hover:text-primary active:scale-95"
            >
              <ArrowLeft2 size="18" color="currentColor" />
            </button>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="تصویر قبلی"
              className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-11 shadow-md backdrop-blur transition-all hover:bg-white hover:text-primary active:scale-95"
            >
              <ArrowRight2 size="18" color="currentColor" />
            </button>
          </>
        )}
      </div>

      {photos.length > 1 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto border-t border-gray-3 p-2.5">
          {photos.map((photo, photoIndex) => {
            const active = photoIndex === index;
            return (
              <button
                key={`${photo}-${photoIndex}`}
                type="button"
                onClick={() => setIndex(photoIndex)}
                aria-label={`نمایش تصویر ${toFaDigits(photoIndex + 1)}`}
                aria-current={active}
                className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                  active
                    ? "border-primary opacity-100"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={photo}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
