"use client";

import { useState } from "react";
import Image from "next/image";
import { Buildings2, Call, Copy, Profile } from "iconsax-react";
import { toast } from "@/components/ui/toast";
import { toFaDigits } from "@/lib/auth";
import { formatNumberFa } from "@/lib/listings/format";

/** نام دفتر را برای نمایش کوتاه می‌کند: «مشاور املاک سبز» → «املاک سبز» */
function agencyDisplayName(name = "") {
  return name.replace(/^مشاور\s+املاک\s+/, "املاک ").trim() || "دفتر املاک";
}

/**
 * کارت شناور انتشاردهندهٔ آگهی:
 * لوگو و نام دفتر، تصویر و نام مشاور، امتیاز، تعداد آگهی فعال
 * و دکمهٔ نمایش اطلاعات تماس.
 */
export default function PropertyContact({ agency }) {
  const [revealed, setRevealed] = useState(false);

  const agencyName = agencyDisplayName(agency?.name);
  const agentName = agency?.agentName?.trim() || "مشاور املاک";
  const agentAvatar = agency?.agentAvatar;
  const phone = agency?.phones?.find(Boolean) ?? "";
  const rating = Number(agency?.rating);
  const ratingLabel =
    Number.isFinite(rating) && rating > 0
      ? toFaDigits(String(rating).replace(".", "٫"))
      : null;
  const activeAdsLabel = formatNumberFa(Number(agency?.activeAds) || 0);

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(phone);
      toast.success("شمارهٔ تماس کپی شد.");
    } catch {
      toast.error("کپی شمارهٔ تماس ممکن نشد.");
    }
  };

  return (
    <div className="rounded-2xl border border-gray-4 bg-white p-5 shadow-[0_10px_35px_rgba(12,12,12,0.05)] sm:rounded-3xl sm:p-6 xl:p-7">
      <div className="flex items-start gap-4 sm:gap-5">
        {/* تصویر مشاور */}
        {agentAvatar ? (
          <span className="relative block h-20 w-20 shrink-0 overflow-hidden rounded-full bg-gray-2 sm:h-24 sm:w-24 lg:h-20 lg:w-20 xl:h-[100px] xl:w-[100px]">
            <Image
              src={agentAvatar}
              alt={agentName}
              fill
              sizes="(max-width: 640px) 80px, 100px"
              className="object-cover"
            />
          </span>
        ) : (
          <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-primary-tint-1 text-primary sm:h-24 sm:w-24 lg:h-20 lg:w-20 xl:h-[100px] xl:w-[100px]">
            <Profile size="30" variant="Bold" color="currentColor" />
          </span>
        )}

        <div className="min-w-0 flex-1">
          {/* لوگو و نام دفتر */}
          <div className="flex items-center justify-start gap-2">
            {agency?.logo ? (
              <Image
                src={agency.logo}
                alt={agencyName}
                width={56}
                height={40}
                className="h-8 w-11 shrink-0 object-contain"
              />
            ) : (
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary-tint-1 text-primary">
                <Buildings2 size="18" color="currentColor" />
              </span>
            )}
            <span className="min-w-0 truncate text-base font-bold text-gray-12">
              {agencyName}
            </span>
          </div>

          <p className="mt-2.5 truncate text-start text-[22px] font-extrabold leading-8 text-gray-13 sm:text-2xl xl:text-[25px]">
            {agentName}
          </p>

          <p className="mt-1 text-start text-base text-gray-9">
            {ratingLabel ? (
              <>
                امتیاز{" "}
                <span className="font-medium text-gray-9">{ratingLabel}</span>{" "}
                از ۵
              </>
            ) : (
              "امتیاز ثبت نشده"
            )}
          </p>

          <p className="mt-1 text-start text-base text-gray-10">
            {activeAdsLabel} آگهی فعال
          </p>

          {phone ? (
            revealed ? (
              <div className="mt-4 flex items-center gap-2 sm:mt-5">
                <a
                  href={`tel:${phone}`}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary text-base font-medium text-white shadow-[0_8px_20px_rgba(203,27,27,0.22)] transition-colors hover:bg-primary-shade-1"
                >
                  <Call size="17" variant="Bold" color="currentColor" />
                  <span dir="ltr">{toFaDigits(phone)}</span>
                </a>
                <button
                  type="button"
                  onClick={copyPhone}
                  aria-label="کپی شمارهٔ تماس"
                  title="کپی شمارهٔ تماس"
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-gray-4 bg-white text-gray-9 transition-colors hover:border-primary/30 hover:bg-primary-tint-1 hover:text-primary"
                >
                  <Copy size="17" color="currentColor" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setRevealed(true)}
                className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-primary text-base font-medium text-white shadow-[0_8px_20px_rgba(203,27,27,0.22)] transition-colors hover:bg-primary-shade-1 active:scale-[0.99] sm:mt-5"
              >
                اطلاعات تماس
              </button>
            )
          ) : (
            <p className="mt-4 flex h-12 items-center justify-center rounded-xl border border-gray-4 bg-gray-1 text-base text-gray-9 sm:mt-5">
              شمارهٔ تماس ثبت نشده است
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
