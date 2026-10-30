"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Buildings2, Call } from "iconsax-react";
import { toast } from "@/components/ui/toast";
import { toFaDigits } from "@/lib/auth";
import PropertyModal from "./PropertyModal";

/** نام دفتر را برای نمایش کوتاه می‌کند: «مشاور املاک سبز» → «املاک سبز» */
function agencyDisplayName(name = "") {
  return name.replace(/^مشاور\s+املاک\s+/, "املاک ").trim() || "دفتر املاک";
}

const RATINGS = [1, 2, 3, 4, 5];

/**
 * پاپ‌آپ اطلاعات تماس انتشاردهندهٔ آگهی:
 * لوگو و نام دفتر، نام مشاور، شماره‌های تماس، شناسهٔ آگهی
 * و امتیازدهی به مشاور.
 */
export default function PropertyContactModal({ open, onClose, agency, code }) {
  const [rating, setRating] = useState(1);

  const agencyName = agencyDisplayName(agency?.name);
  const agentName = agency?.agentName?.trim();
  const phones = Array.from(
    new Set((agency?.phones ?? []).filter((phone) => Boolean(phone)))
  );

  const ratingTarget = agentName
    ? `مشاور املاک ${agentName}`
    : agencyName;

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const rate = (value) => {
    if (value === rating) return;
    setRating(value);
    toast.success(`امتیاز ${toFaDigits(value)} از ۵ برای این مشاور ثبت شد.`);
  };

  return (
    <PropertyModal
      open={open}
      onClose={handleClose}
      labelledBy="property-contact-title"
      maxWidth="max-w-[440px]"
    >
      <h2
        id="property-contact-title"
        className="pe-12 text-start text-xl font-bold text-gray-13"
      >
        اطلاعات تماس
      </h2>

      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-gray-3 bg-gray-1 p-3.5">
        {agency?.logo ? (
          <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-white p-1.5">
            <Image
              src={agency.logo}
              alt={agencyName}
              width={56}
              height={56}
              className="h-full w-full object-contain"
            />
          </span>
        ) : (
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-primary-tint-1 text-primary">
            <Buildings2 size="26" color="currentColor" />
          </span>
        )}

        <div className="min-w-0">
          <p className="truncate text-base font-bold text-gray-12">
            {agencyName}
          </p>
          <p className="mt-0.5 truncate text-base text-gray-9">
            {agentName || "مشاور املاک"}
          </p>
        </div>
      </div>

      {phones.length > 0 ? (
        <div className="mt-4 space-y-2.5">
          {phones.map((phone) => (
            <a
              key={phone}
              href={`tel:${phone}`}
              className="group flex items-center gap-3 rounded-xl border border-gray-4 bg-white px-4 py-3 transition-colors hover:border-success/40 hover:bg-success-light-2"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-success-light-2 text-success transition-colors group-hover:bg-success group-hover:text-white">
                <Call size="20" variant="Bold" color="currentColor" />
              </span>
              <span
                dir="ltr"
                className="text-base font-bold tracking-wide text-gray-12"
              >
                {toFaDigits(phone)}
              </span>
              <span className="ms-auto text-base text-gray-8 transition-colors group-hover:text-success">
                تماس
              </span>
            </a>
          ))}
        </div>
      ) : (
        <p className="mt-4 flex h-12 items-center justify-center rounded-xl border border-gray-4 bg-gray-1 text-base text-gray-9">
          شمارهٔ تماس ثبت نشده است
        </p>
      )}

      <div className="mt-4 rounded-xl bg-[#f4f8ff] p-4">
        <p className="flex flex-wrap items-center gap-2 text-base font-medium text-[#2B66FF]">
          <span
            aria-hidden="true"
            className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#2B66FF] text-base font-extrabold leading-none text-white"
          >
            !
          </span>
          <span className="underline underline-offset-4">
            شناسه آگهی ملک:{" "}
            <span dir="ltr" className="font-bold">
              {code || "—"}
            </span>
          </span>
        </p>
        <p className="mt-2 text-base leading-7 text-gray-9">
          لطفاً این شناسه را هنگام تماس با مشاور به‌یاد داشته باشید
        </p>
      </div>

      <div className="mt-5 border-t border-gray-3 pt-5">
        <p className="text-base font-medium leading-7 text-gray-12">
          چه امتیازی به {ratingTarget} می‌دی؟
        </p>

        <div className="mt-3 flex items-center gap-2" role="group" aria-label="امتیاز مشاور">
          {RATINGS.map((value) => {
            const selected = rating === value;

            return (
              <button
                key={value}
                type="button"
                onClick={() => rate(value)}
                aria-label={`امتیاز ${toFaDigits(value)} از ۵`}
                aria-pressed={selected}
                className={`flex h-11 flex-1 items-center justify-center rounded-xl border text-base font-bold transition-all active:scale-95 ${
                  selected
                    ? "border-primary bg-primary text-white shadow-[0_6px_16px_rgba(203,27,27,0.24)]"
                    : "border-gray-4 bg-white text-gray-10 hover:border-primary/40 hover:text-primary"
                }`}
              >
                {toFaDigits(value)}
              </button>
            );
          })}
        </div>
      </div>
    </PropertyModal>
  );
}
