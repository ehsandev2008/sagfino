import Link from "next/link";
import { ArrowLeft2, Home2, SearchStatus, TickCircle } from "iconsax-react";
import { buildListingHref } from "@/lib/listings/query";

const SUGGESTIONS = [
  { label: "آپارتمان", overrides: { type: "apartment" } },
  { label: "ویلا", overrides: { type: "villa" } },
  { label: "دفتر کار", overrides: { type: "office" } },
  { label: "خانه‌های مبله", overrides: { features: ["furnished"] } },
];

/** حالت خالی بودن نتایج + پیشنهاد حذف فیلترها */
export default function EmptyState({ filters }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-4 bg-white px-5 py-10 text-center sm:px-8 sm:py-14">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-tint-1 text-primary">
        <SearchStatus size="34" variant="Bold" color="currentColor" />
      </div>

      <h2 className="mt-4 text-body-s font-bold text-gray-12 sm:text-h5">
        آگهی‌ای با این فیلترها پیدا نشد
      </h2>
      <p className="mx-auto mt-2 max-w-md text-caption-md leading-6 text-gray-8">
        محدودهٔ قیمت، متراژ یا شهر انتخابی ممکن است بیش از حد باریک باشد. فیلترها
        را پاک کنید یا یکی از جست‌وجوهای پیشنهادی زیر را امتحان کنید.
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <Link
          href="/rent"
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-button-md text-white shadow-[0_8px_20px_rgba(203,27,27,0.22)] transition-colors hover:bg-primary-shade-1"
        >
          <TickCircle size="18" variant="Bold" color="currentColor" />
          حذف همهٔ فیلترها
        </Link>
        <Link
          href="/"
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-4 px-5 text-button-md text-gray-10 transition-colors hover:border-gray-6 hover:text-gray-13"
        >
          <Home2 size="18" color="currentColor" />
          بازگشت به خانه
        </Link>
      </div>

      <div className="mx-auto mt-7 max-w-lg border-t border-gray-3 pt-5">
        <p className="text-[11px] text-gray-7">جست‌وجوهای پیشنهادی:</p>
        <div className="mt-2.5 flex flex-wrap justify-center gap-1.5">
          {SUGGESTIONS.map((item) => (
            <Link
              key={item.label}
              href={buildListingHref(
                { city: filters.city, province: filters.province, sort: filters.sort },
                { page: 1, ...item.overrides }
              )}
              className="group inline-flex items-center gap-1.5 rounded-full border border-gray-4 bg-gray-1 px-3 py-1.5 text-[11px] text-gray-9 transition-all hover:border-primary/30 hover:bg-primary-tint-1 hover:text-primary"
            >
              {item.label}
              <ArrowLeft2
                size="12"
                color="currentColor"
                className="text-gray-5 transition-transform group-hover:-translate-x-0.5 group-hover:text-primary"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
