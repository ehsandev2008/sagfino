"use client";

import { useCallback, useState } from "react";
import { toast } from "@/components/ui/toast";
import PropertyModal from "./PropertyModal";

const REASONS = [
  "ملک واگذار شده",
  "قیمت اشتباه",
  "عکس‌ها مرتبط نیست",
  "کسی پاسخگو نیست",
  "توضیحات ناقصه",
];

/**
 * پاپ‌آپ گزارش مشکل آگهی.
 * گزارش فقط در همین مرورگر ثبت می‌شود و پیام موفقیت نمایش داده می‌شود؛
 * چون هنوز سرویس پشتیبان برای ثبت گزارش تخلف وجود ندارد.
 */
export default function PropertyReportModal({ open, onClose }) {
  const [reasons, setReasons] = useState([]);
  const [comment, setComment] = useState("");

  const toggleReason = (reason) => {
    setReasons((current) =>
      current.includes(reason)
        ? current.filter((item) => item !== reason)
        : [...current, reason]
    );
  };

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (reasons.length === 0 && !comment.trim()) {
      toast.error("لطفاً حداقل یک مورد را انتخاب کنید یا توضیحی بنویسید.");
      return;
    }

    toast.success("گزارش شما ثبت شد و آگهی در حال بررسی است.");
    handleClose();
  };

  return (
    <PropertyModal
      open={open}
      onClose={handleClose}
      labelledBy="property-report-title"
    >
      <form onSubmit={handleSubmit}>
        <h2
          id="property-report-title"
          className="pe-12 text-start text-xl font-bold text-gray-13"
        >
          گزارش مشکل
        </h2>
        <p className="mt-1.5 text-base leading-7 text-gray-9">
          مشکل این آگهی را انتخاب کنید.
        </p>

        <div className="mt-5 space-y-2.5" role="group" aria-label="دلیل گزارش">
          {REASONS.map((reason) => {
            const checked = reasons.includes(reason);

            return (
              <label
                key={reason}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 transition-colors ${
                  checked
                    ? "border-primary/40 bg-primary-tint-1"
                    : "border-gray-4 bg-white hover:border-gray-6"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleReason(reason)}
                  className={`h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-md border bg-center bg-no-repeat transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1 ${
                    checked
                      ? "border-primary bg-primary bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22white%22 stroke-width=%223.5%22%3E%3Cpath d=%22M5 13l4 4L19 7%22/%3E%3C/svg%3E')]"
                      : "border-gray-5 bg-white"
                  }`}
                />
                <span className="text-base text-gray-11">{reason}</span>
              </label>
            );
          })}
        </div>

        <label
          htmlFor="property-report-comment"
          className="mt-5 block text-base font-medium text-gray-11"
        >
          توضیحات
        </label>
        <textarea
          id="property-report-comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="لطفا نظر خود را درباره این مشاور بنویسید"
          rows={4}
          className="mt-2 w-full resize-none rounded-xl border border-gray-4 bg-gray-1 px-4 py-3 text-base leading-7 text-gray-13 outline-none transition-colors placeholder:text-gray-7 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
        />

        <button
          type="submit"
          className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-primary text-base font-medium text-white shadow-[0_8px_20px_rgba(203,27,27,0.22)] transition-colors hover:bg-primary-shade-1 active:scale-[0.99]"
        >
          ارسال گزارش
        </button>
      </form>
    </PropertyModal>
  );
}
