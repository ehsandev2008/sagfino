"use client";

import { useState } from "react";
import {
  Dislike,
  Export,
  Like,
  Save2,
  Warning2,
} from "iconsax-react";
import { toast } from "@/components/ui/toast";

/**
 * دکمه‌های اشتراک‌گذاری و نشان کردن آگهی در سربرگ صفحهٔ جزئیات.
 * در صورت پشتیبانی مرورگر از Web Share از آن استفاده می‌شود،
 * در غیر این صورت لینک آگهی کپی می‌شود.
 */
export function PropertyHeaderActions({ title }) {
  const [saved, setSaved] = useState(false);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success("لینک آگهی کپی شد.");
    } catch (error) {
      if (error?.name === "AbortError") return;
      toast.error("اشتراک‌گذاری آگهی ممکن نشد.");
    }
  };

  const toggleSaved = () => {
    const next = !saved;
    setSaved(next);
    if (next) toast.success("آگهی در نشان‌شده‌ها ذخیره شد.");
    else toast.info("آگهی از نشان‌شده‌ها حذف شد.");
  };

  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <button
        type="button"
        onClick={share}
        aria-label="اشتراک‌گذاری آگهی"
        title="اشتراک‌گذاری آگهی"
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-4 bg-white text-gray-8 transition-colors hover:border-primary/30 hover:bg-primary-tint-1 hover:text-primary active:scale-95"
      >
        <Export size="17" color="currentColor" />
      </button>
      <button
        type="button"
        onClick={toggleSaved}
        aria-label={saved ? "حذف از نشان‌شده‌ها" : "نشان کردن آگهی"}
        aria-pressed={saved}
        title={saved ? "حذف از نشان‌شده‌ها" : "نشان کردن آگهی"}
        className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors active:scale-95 ${
          saved
            ? "border-primary/30 bg-primary-tint-1 text-primary"
            : "border-gray-4 bg-white text-gray-8 hover:border-primary/30 hover:bg-primary-tint-1 hover:text-primary"
        }`}
      >
        <Save2
          size="17"
          variant={saved ? "Bold" : "Outline"}
          color="currentColor"
        />
      </button>
    </div>
  );
}

/** دکمهٔ گزارش تخلف آگهی در ردیف اطلاعات تکمیلی */
export function PropertyReportButton() {
  return (
    <button
      type="button"
      onClick={() =>
        toast.success("گزارش تخلف ثبت شد و آگهی در حال بررسی است.")
      }
      className="flex items-center gap-1 text-[10px] text-gray-7 transition-colors hover:text-error"
    >
      <Warning2 size="13" variant="Bold" color="#c30000" />
      گزارش تخلف آگهی
    </button>
  );
}

/** بازخورد مفید بودن آگهی در فوتر جزئیات */
export function PropertyFeedback() {
  const [vote, setVote] = useState(null);

  const voteFor = (value) => {
    setVote(value);
    toast.success(
      value === "up"
        ? "ممنون! بازخورد مثبت شما ثبت شد."
        : "بازخورد شما ثبت شد و بررسی می‌شود."
    );
  };

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] text-gray-7">
        بازخورد خود درباره این آگهی چیست؟
      </span>
      <button
        type="button"
        onClick={() => voteFor("up")}
        aria-label="بله، مفید بود"
        aria-pressed={vote === "up"}
        className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-colors ${
          vote === "up"
            ? "border-success/30 bg-success-light-2 text-success"
            : "border-gray-4 bg-white text-gray-7 hover:text-success"
        }`}
      >
        <Like size="14" variant={vote === "up" ? "Bold" : "Outline"} color="currentColor" />
      </button>
      <button
        type="button"
        onClick={() => voteFor("down")}
        aria-label="خیر، مفید نبود"
        aria-pressed={vote === "down"}
        className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-colors ${
          vote === "down"
            ? "border-error/30 bg-error-light-2 text-error"
            : "border-gray-4 bg-white text-gray-7 hover:text-error"
        }`}
      >
        <Dislike
          size="14"
          variant={vote === "down" ? "Bold" : "Outline"}
          color="currentColor"
        />
      </button>
    </div>
  );
}
