"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft2,
  ArrowRight2,
  CloseCircle,
  Gallery,
  Maximize2,
  TickCircle,
} from "iconsax-react";
import { toFaDigits } from "@/lib/auth";

const FALLBACK_IMAGE =
  "/imags/rent images/pexels-vecislavas-popa-1571468 1.webp";
const EASE = [0.22, 1, 0.36, 1];

const slideVariants = {
  enter: (direction) => ({
    opacity: 0,
    x: direction > 0 ? -44 : 44,
    scale: 1.015,
  }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (direction) => ({
    opacity: 0,
    x: direction > 0 ? 44 : -44,
    scale: 0.99,
  }),
};

const lightboxVariants = {
  enter: (direction) => ({ opacity: 0, x: direction > 0 ? -72 : 72 }),
  center: { opacity: 1, x: 0 },
  exit: (direction) => ({ opacity: 0, x: direction > 0 ? 72 : -72 }),
};

/** فقط تصاویر یکتا را نگه می‌دارد و در نبود تصویر، یک تصویر پیش‌فرض برمی‌گرداند. */
function resolvePhotos(images) {
  const unique = [...new Set((images ?? []).filter(Boolean))];
  return unique.length > 0 ? unique : [FALLBACK_IMAGE];
}

/**
 * گالری موزاییکی تصاویر آگهی.
 * - دسکتاپ: چیدمان پنج‌کادری با پیمایش انیمیشنی
 * - موبایل: اسلایدر تمام‌عرض با سوایپ
 * - کلیک روی هر تصویر: نمایش تمام‌صفحه با پیمایش کلیدهای جهت‌دار
 */
export default function PropertyGallery({
  images = [],
  title,
  isVerified = false,
  isFeatured = false,
}) {
  const photos = useMemo(() => resolvePhotos(images), [images]);
  const count = photos.length;

  const [start, setStart] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const isLightboxOpen = lightboxIndex !== null;

  const slots = useMemo(
    () =>
      Array.from({ length: Math.min(5, count) }, (_, index) => ({
        photo: photos[(start + index) % count],
        photoIndex: (start + index) % count,
      })),
    [photos, count, start]
  );

  const goMosaic = (step) => {
    if (count < 2) return;
    setDirection(step);
    setStart((current) => (current + step + count) % count);
  };

  const goMobile = (step) => {
    if (count < 2) return;
    setDirection(step);
    setMobileIndex((current) => (current + step + count) % count);
  };

  const openLightbox = (index) => {
    setDirection(1);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    if (lightboxIndex !== null) {
      setStart(lightboxIndex % count);
      setMobileIndex(lightboxIndex % count);
    }
    setLightboxIndex(null);
  };

  const goLightbox = (step) => {
    if (count < 2) return;
    setDirection(step);
    setLightboxIndex((current) =>
      current === null ? current : (current + step + count) % count
    );
  };

  const goLightboxTo = (index) => {
    setDirection(index >= (lightboxIndex ?? 0) ? 1 : -1);
    setLightboxIndex(index);
  };

  // قفل اسکرول صفحه هنگام نمایش گالری تمام‌صفحه
  useEffect(() => {
    if (!isLightboxOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isLightboxOpen]);

  // پیمایش گالری تمام‌صفحه با صفحه‌کلید
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setStart(lightboxIndex % count);
        setMobileIndex(lightboxIndex % count);
        setLightboxIndex(null);
        return;
      }
      if (count < 2) return;
      if (event.key === "ArrowLeft") {
        setDirection(1);
        setLightboxIndex((current) =>
          current === null ? current : (current + 1) % count
        );
      }
      if (event.key === "ArrowRight") {
        setDirection(-1);
        setLightboxIndex((current) =>
          current === null ? current : (current - 1 + count) % count
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, lightboxIndex, count]);

  const badges = (
    <span className="pointer-events-none absolute right-3 top-3 z-10 flex flex-wrap gap-1.5">
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
    </span>
  );

  return (
    <section aria-label="گالری تصاویر آگهی">
      {/* دسکتاپ: موزاییک پنج‌کادری */}
      <div className="relative hidden md:block">
        <div className="h-[clamp(340px,36vw,500px)]">
          {slots.length >= 3 ? (
            <div
              className={`grid h-full gap-2 ${
                slots.length === 4
                  ? "grid-cols-4 grid-rows-2"
                  : "grid-cols-5 grid-rows-2"
              }`}
            >
              <GalleryTile
                photo={slots[0].photo}
                photoIndex={slots[0].photoIndex}
                total={count}
                title={title}
                direction={direction}
                priority
                sizes="(max-width: 1024px) 55vw, 620px"
                onOpen={openLightbox}
                className={
                  slots.length === 4
                    ? "col-span-2 row-span-2"
                    : "col-span-3 row-span-2"
                }
                overlay={
                  <>
                    {badges}
                    <span className="pointer-events-none absolute bottom-3 right-3 z-10 flex items-center gap-1 rounded-lg bg-black/50 px-2.5 py-1.5 text-[10px] text-white backdrop-blur-sm">
                      <Gallery size="13" color="currentColor" />
                      مشاهدهٔ {toFaDigits(count)} عکس
                    </span>
                  </>
                }
              />

              {slots.slice(1).map((slot, index) => (
                <GalleryTile
                  key={`${slot.photoIndex}-${index}`}
                  photo={slot.photo}
                  photoIndex={slot.photoIndex}
                  total={count}
                  title={title}
                  direction={direction}
                  sizes="(max-width: 1024px) 25vw, 300px"
                  onOpen={openLightbox}
                  className={`${
                    slots.length === 4
                      ? index === 2
                        ? "col-span-2 row-span-1"
                        : "col-span-1 row-span-1"
                      : "col-span-1 row-span-1"
                  }`}
                />
              ))}
            </div>
          ) : (
            <div
              className={`grid h-full gap-2 ${
                slots.length === 2 ? "grid-cols-2" : "grid-cols-1"
              }`}
            >
              {slots.map((slot, index) => (
                <GalleryTile
                  key={`${slot.photoIndex}-${index}`}
                  photo={slot.photo}
                  photoIndex={slot.photoIndex}
                  total={count}
                  title={title}
                  direction={direction}
                  priority={index === 0}
                  sizes={slots.length === 2 ? "50vw" : "100vw"}
                  onOpen={openLightbox}
                  className="col-span-1 row-span-1"
                  overlay={index === 0 ? badges : null}
                />
              ))}
            </div>
          )}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => goMosaic(1)}
              aria-label="تصویر بعدی"
              className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-gray-12 shadow-[0_8px_24px_rgba(0,0,0,0.2)] backdrop-blur transition-all hover:bg-white hover:text-primary active:scale-95"
            >
              <ArrowLeft2 size="20" color="currentColor" />
            </button>
            <button
              type="button"
              onClick={() => goMosaic(-1)}
              aria-label="تصویر قبلی"
              className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-gray-12 shadow-[0_8px_24px_rgba(0,0,0,0.2)] backdrop-blur transition-all hover:bg-white hover:text-primary active:scale-95"
            >
              <ArrowRight2 size="20" color="currentColor" />
            </button>
          </>
        )}
      </div>

      {/* موبایل: اسلایدر سوایپ‌پذیر */}
      <div className="md:hidden">
        <div className="relative overflow-hidden rounded-2xl bg-gray-2 shadow-[0_10px_30px_rgba(12,12,12,0.08)]">
          <div className="relative aspect-[4/3]">
            <AnimatePresence initial={false} custom={direction} mode="sync">
              <motion.div
                key={photos[mobileIndex]}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: EASE }}
                drag={count > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.08}
                onTap={() => openLightbox(mobileIndex)}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -48) goMobile(1);
                  else if (info.offset.x > 48) goMobile(-1);
                }}
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
              >
                <Image
                  src={photos[mobileIndex]}
                  alt={`${title} — تصویر ${toFaDigits(mobileIndex + 1)}`}
                  fill
                  priority
                  sizes="100vw"
                  draggable={false}
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 to-transparent" />
            {badges}

            <span className="pointer-events-none absolute bottom-3 right-3 z-10 flex items-center gap-1 rounded-lg bg-black/50 px-2.5 py-1.5 text-[10px] text-white backdrop-blur-sm">
              <Gallery size="12" color="currentColor" />
              {toFaDigits(mobileIndex + 1)} از {toFaDigits(count)}
            </span>

            <button
              type="button"
              onClick={() => openLightbox(mobileIndex)}
              className="absolute bottom-3 left-3 z-20 flex items-center gap-1 rounded-lg bg-white/95 px-2.5 py-1.5 text-[10px] font-medium text-gray-11 shadow-sm backdrop-blur transition-colors hover:bg-white hover:text-primary"
            >
              <Maximize2 size="12" color="currentColor" />
              مشاهدهٔ همه
            </button>

            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => goMobile(1)}
                  aria-label="تصویر بعدی"
                  className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-11 shadow-md backdrop-blur transition-all hover:bg-white hover:text-primary active:scale-95"
                >
                  <ArrowLeft2 size="17" color="currentColor" />
                </button>
                <button
                  type="button"
                  onClick={() => goMobile(-1)}
                  aria-label="تصویر قبلی"
                  className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-11 shadow-md backdrop-blur transition-all hover:bg-white hover:text-primary active:scale-95"
                >
                  <ArrowRight2 size="17" color="currentColor" />
                </button>
              </>
            )}
          </div>
        </div>

        {count > 1 && (
          <div className="mt-2.5 flex justify-center gap-1.5">
            {photos.map((photo, index) => (
              <button
                key={photo}
                type="button"
                onClick={() => {
                  setDirection(index >= mobileIndex ? 1 : -1);
                  setMobileIndex(index);
                }}
                aria-label={`نمایش تصویر ${toFaDigits(index + 1)}`}
                aria-current={index === mobileIndex}
                className={`h-1.5 rounded-full transition-all ${
                  index === mobileIndex
                    ? "w-5 bg-primary"
                    : "w-1.5 bg-gray-4 hover:bg-gray-5"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* گالری تمام‌صفحه */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="گالری تصاویر آگهی"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[120] flex flex-col bg-black/95 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between gap-3 px-4 py-3 text-white sm:px-6">
              <span className="flex items-center gap-1.5 text-[11px] text-white/80">
                <Gallery size="15" color="currentColor" />
                {toFaDigits(lightboxIndex + 1)} از {toFaDigits(count)}
              </span>
              <button
                type="button"
                onClick={closeLightbox}
                aria-label="بستن گالری"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <CloseCircle size="26" variant="Bold" color="currentColor" />
              </button>
            </div>

            <div className="relative flex-1 overflow-hidden">
              <AnimatePresence initial={false} custom={direction} mode="sync">
                <motion.div
                  key={photos[lightboxIndex]}
                  custom={direction}
                  variants={lightboxVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.32, ease: EASE }}
                  drag={count > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.06}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -56) goLightbox(1);
                    else if (info.offset.x > 56) goLightbox(-1);
                  }}
                  className="absolute inset-0 p-3 sm:p-8"
                >
                  <Image
                    src={photos[lightboxIndex]}
                    alt={`${title} — تصویر ${toFaDigits(lightboxIndex + 1)}`}
                    fill
                    sizes="100vw"
                    draggable={false}
                    className="object-contain"
                  />
                </motion.div>
              </AnimatePresence>

              {count > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => goLightbox(1)}
                    aria-label="تصویر بعدی"
                    className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-11 shadow-lg backdrop-blur transition-all hover:bg-white hover:text-primary active:scale-95 sm:left-6"
                  >
                    <ArrowLeft2 size="20" color="currentColor" />
                  </button>
                  <button
                    type="button"
                    onClick={() => goLightbox(-1)}
                    aria-label="تصویر قبلی"
                    className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-11 shadow-lg backdrop-blur transition-all hover:bg-white hover:text-primary active:scale-95 sm:right-6"
                  >
                    <ArrowRight2 size="20" color="currentColor" />
                  </button>
                </>
              )}
            </div>

            {count > 1 && (
              <div className="no-scrollbar flex justify-center gap-2 overflow-x-auto px-4 pb-4 pt-1 sm:pb-6">
                {photos.map((photo, index) => (
                  <button
                    key={photo}
                    type="button"
                    onClick={() => goLightboxTo(index)}
                    aria-label={`نمایش تصویر ${toFaDigits(index + 1)}`}
                    aria-current={index === lightboxIndex}
                    className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                      index === lightboxIndex
                        ? "border-white opacity-100"
                        : "border-white/20 opacity-55 hover:opacity-90"
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
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function GalleryTile({
  photo,
  photoIndex,
  total,
  title,
  direction,
  sizes,
  priority = false,
  onOpen,
  className = "",
  overlay = null,
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(photoIndex)}
      aria-label={`مشاهده تصویر ${toFaDigits(photoIndex + 1)} از ${toFaDigits(
        total
      )}`}
      className={`group relative min-h-0 overflow-hidden rounded-2xl bg-gray-2 text-right shadow-[0_10px_30px_rgba(12,12,12,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${className}`}
    >
      <AnimatePresence initial={false} custom={direction} mode="sync">
        <motion.div
          key={photo}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.45, ease: EASE }}
          className="absolute inset-0"
        >
          <Image
            src={photo}
            alt={`${title} — تصویر ${toFaDigits(photoIndex + 1)}`}
            fill
            priority={priority}
            sizes={sizes}
            draggable={false}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        </motion.div>
      </AnimatePresence>

      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <span className="pointer-events-none absolute bottom-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-10 opacity-0 shadow-sm backdrop-blur transition-all duration-300 group-hover:opacity-100">
        <Maximize2 size="14" color="currentColor" />
      </span>
      {overlay}
    </button>
  );
}
