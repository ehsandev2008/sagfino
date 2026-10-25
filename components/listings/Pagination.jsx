"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import { toFaDigits } from "@/lib/auth";
import { buildListingHref } from "@/lib/listings/query";

function getPages(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages = [1];

  if (current > 4) pages.push("start-ellipsis");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let page = start; page <= end; page += 1) pages.push(page);

  if (current < total - 3) pages.push("end-ellipsis");
  pages.push(total);

  return pages;
}

export default function Pagination({ page, totalPages, total, filters }) {
  if (!totalPages || totalPages <= 1) return null;

  const pages = getPages(page, totalPages);
  const progress = Math.min(100, Math.round((page / totalPages) * 100));

  const scrollToResults = () => {
    document
      .getElementById("rent-results")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="صفحه‌بندی آگهی‌ها"
      className="mt-6 rounded-2xl border border-gray-4 bg-white p-3 shadow-[0_4px_24px_rgba(12,12,12,0.03)] sm:p-4"
    >
      <div className="mb-3 flex items-center justify-between gap-3 px-1 sm:hidden">
        <span className="text-[11px] text-gray-8">
          صفحه {toFaDigits(page)} از {toFaDigits(totalPages)}
        </span>
        <span className="text-[10px] text-gray-6">
          {toFaDigits(total)} آگهی
        </span>
      </div>
      <div className="mb-3 h-1 overflow-hidden rounded-full bg-gray-2 sm:hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full rounded-full bg-primary"
        />
      </div>

      <div className="flex items-center justify-between gap-2">
        <Link
          href={
            page > 1
              ? buildListingHref(filters, { page: page - 1 })
              : "#"
          }
          aria-disabled={page <= 1}
          tabIndex={page <= 1 ? -1 : undefined}
          onClick={(event) => {
            if (page <= 1) {
              event.preventDefault();
              return;
            }
            scrollToResults();
          }}
          className={`flex h-9 items-center gap-1 rounded-xl border px-2.5 text-[11px] transition-all sm:h-10 sm:px-3 ${
            page > 1
              ? "border-gray-4 text-gray-10 hover:border-primary/30 hover:bg-primary-tint-1 hover:text-primary"
              : "cursor-not-allowed border-gray-2 text-gray-5"
          }`}
        >
          <ArrowRight2 size="15" color="currentColor" />
          <span className="hidden sm:inline">قبلی</span>
        </Link>

        <div className="flex items-center gap-1">
          {pages.map((item) =>
            typeof item === "number" ? (
              <Link
                key={item}
                href={buildListingHref(filters, { page: item })}
                aria-current={item === page ? "page" : undefined}
                aria-label={`صفحهٔ ${item}`}
                onClick={scrollToResults}
                className={`relative flex h-9 w-9 items-center justify-center rounded-xl text-[11px] transition-colors sm:h-10 sm:w-10 sm:text-body-xxs ${
                  item === page
                    ? "text-white"
                    : "text-gray-9 hover:bg-gray-1 hover:text-primary"
                }`}
              >
                {item === page && (
                  <motion.span
                    layoutId="active-page-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-xl bg-primary shadow-[0_8px_20px_rgba(203,27,27,0.25)]"
                  />
                )}
                <span className="relative">{toFaDigits(item)}</span>
              </Link>
            ) : (
              <span
                key={item}
                className="flex h-9 w-6 items-center justify-center text-gray-5 sm:h-10"
                aria-hidden="true"
              >
                …
              </span>
            )
          )}
        </div>

        <Link
          href={
            page < totalPages
              ? buildListingHref(filters, { page: page + 1 })
              : "#"
          }
          aria-disabled={page >= totalPages}
          tabIndex={page >= totalPages ? -1 : undefined}
          onClick={(event) => {
            if (page >= totalPages) {
              event.preventDefault();
              return;
            }
            scrollToResults();
          }}
          className={`flex h-9 items-center gap-1 rounded-xl border px-2.5 text-[11px] transition-all sm:h-10 sm:px-3 ${
            page < totalPages
              ? "border-gray-4 text-gray-10 hover:border-primary/30 hover:bg-primary-tint-1 hover:text-primary"
              : "cursor-not-allowed border-gray-2 text-gray-5"
          }`}
        >
          <span className="hidden sm:inline">بعدی</span>
          <ArrowLeft2 size="15" color="currentColor" />
        </Link>
      </div>

      <p className="mt-3 hidden text-center text-[10px] text-gray-6 sm:block">
        صفحه {toFaDigits(page)} از {toFaDigits(totalPages)} · مجموعاً{" "}
        {toFaDigits(total)} آگهی
      </p>
    </nav>
  );
}
