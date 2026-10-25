"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Call,
  Clock,
  Copy,
  ShieldTick,
  Star1,
  TickCircle,
  Verify,
} from "iconsax-react";
import { toast } from "@/components/ui/toast";
import { toFaDigits } from "@/lib/auth";

/** ماسک کردن شمارهٔ تماس تا زمانی که کاربر دکمهٔ نمایش را نزند */
function maskPhone(phone = "") {
  const digits = String(phone);
  if (digits.length < 5) return "—";
  return `${"•".repeat(Math.max(0, digits.length - 4))}${digits.slice(-4)}`;
}

/**
 * کارت تماس با دفتر املاک در صفحهٔ جزئیات
 */
export default function PropertyContact({ agency, code }) {
  const [revealed, setRevealed] = useState(false);
  const phone = agency?.phones?.[0] ?? "";

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("کد آگهی کپی شد.");
    } catch {
      toast.error("کپی کد آگهی ممکن نشد.");
    }
  };

  return (
    <div className="rounded-2xl border border-gray-4 bg-white p-4 shadow-[0_4px_24px_rgba(12,12,12,0.03)]">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[10px] text-gray-7">
          <Clock size="13" color="currentColor" />
          پاسخگویی در ساعات کاری
        </span>
        <span className="flex items-center gap-1 rounded-full bg-success-light-2 px-2 py-1 text-[9px] text-success">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          آنلاین
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2.5">
        {agency?.logo ? (
          <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-3 bg-gray-1">
            <Image
              src={agency.logo}
              alt={agency.name ?? "دفتر املاک"}
              width={64}
              height={52}
              className="h-full w-full object-contain p-1"
            />
          </span>
        ) : (
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary-tint-1 text-primary">
            <Call size="20" color="currentColor" />
          </span>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="truncate text-body-xxs font-bold text-gray-12">
              {(agency?.name ?? "دفتر املاک").replace(
                /^مشاور\s+املاک\s+/,
                "املاک "
              )}
            </span>
            {agency?.verified && (
              <Verify
                size="14"
                variant="Bold"
                color="#2B66FF"
                className="shrink-0"
              />
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-[10px] text-gray-7">
            <span className="flex items-center gap-0.5 text-warning">
              <Star1 size="11" variant="Bold" color="currentColor" />
              <span className="text-gray-9">
                {toFaDigits(
                  String(agency?.rating ?? 0).replace(".", "٫")
                )}{" "}
                از ۵
              </span>
            </span>
            <span className="truncate">{agency?.district ?? agency?.cityName}</span>
          </div>
        </div>
      </div>

      {revealed ? (
        <a
          href={`tel:${phone}`}
          className="mt-3 flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-button-md text-white shadow-[0_8px_20px_rgba(203,27,27,0.22)] transition-colors hover:bg-primary-shade-1"
        >
          <Call size="18" variant="Bold" color="currentColor" />
          <span dir="ltr">{toFaDigits(phone)}</span>
        </a>
      ) : (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-button-md text-white shadow-[0_8px_20px_rgba(203,27,27,0.22)] transition-colors hover:bg-primary-shade-1"
        >
          <Call size="18" variant="Bold" color="currentColor" />
          نمایش شمارهٔ تماس
          <span className="text-[10px] text-white/70" dir="ltr">
            {toFaDigits(maskPhone(phone))}
          </span>
        </button>
      )}

      <button
        type="button"
        onClick={copyCode}
        className="mt-2 flex h-9 w-full items-center justify-center gap-1.5 rounded-xl border border-gray-4 text-[11px] text-gray-9 transition-colors hover:border-primary/30 hover:bg-primary-tint-1 hover:text-primary"
      >
        <Copy size="14" color="currentColor" />
        کپی کد آگهی
        <span className="font-semibold" dir="ltr">
          {code}
        </span>
      </button>

      <div className="mt-3 flex items-start gap-1.5 rounded-xl bg-warning-light-2/70 p-2.5 text-[10px] leading-5 text-warning">
        <ShieldTick
          size="15"
          variant="Bold"
          color="currentColor"
          className="mt-0.5 shrink-0"
        />
        پیش از هر پرداخت، ملک را حضوری بازدید کنید و قرارداد را با مشاور
        بررسی کنید.
      </div>

      <p className="mt-2 flex items-center justify-center gap-1 text-[9px] text-gray-6">
        <TickCircle size="11" variant="Bold" color="currentColor" />
        شماره‌ها فقط برای پیگیری این آگهی است.
      </p>
    </div>
  );
}
