"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDown2, Location, Sort, TickCircle } from "iconsax-react";
import { SORT_OPTIONS } from "@/lib/listings/constants";
import { buildListingHref, sortLabel } from "@/lib/listings/query";
import { toFaDigits } from "@/lib/auth";

/**
 * نوار نتایج: تعداد آگهی‌ها، محدودهٔ انتخابی و منوی مرتب‌سازی.
 * مرتب‌سازی با پارامتر `sort` در URL انجام می‌شود تا SSR حفظ شود.
 */
export default function ResultsToolbar({
  filters,
  total,
  page,
  totalPages,
  locationLabel,
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointer = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const handleKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const changeSort = (value) => {
    setOpen(false);
    if (value === filters.sort) return;

    startTransition(() => {
      router.push(buildListingHref(filters, { sort: value, page: 1 }), {
        scroll: false,
      });
    });
  };

  return (
    <div className="relative flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-4 bg-white px-3.5 py-3 shadow-[0_4px_24px_rgba(12,12,12,0.03)]">
      {isPending && (
        <span className="absolute inset-x-0 top-0 h-0.5 overflow-hidden rounded-t-2xl bg-primary-tint-2">
          <motion.span
            initial={{ x: "100%" }}
            animate={{ x: "-100%" }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="block h-full w-1/3 bg-primary"
          />
        </span>
      )}

      <div className="min-w-0">
        <h2 className="text-h5 text-gray-13">املاک اجاره‌ای</h2>
        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-caption-md">
          <span
            className={`font-semibold ${
              total > 0 ? "text-primary" : "text-gray-8"
            }`}
          >
            {total > 0
              ? `${toFaDigits(total)} مورد یافت شد`
              : "موردی یافت نشد"}
          </span>
          <span className="text-gray-5">·</span>
          <span className="flex min-w-0 items-center gap-1 truncate text-gray-7">
            <Location
              size="11"
              variant="Bold"
              color="currentColor"
              className="shrink-0 text-primary"
            />
            <span className="truncate">{locationLabel}</span>
          </span>
          {totalPages > 1 && (
            <span className="shrink-0 text-gray-6">
              · صفحهٔ {toFaDigits(page)} از {toFaDigits(totalPages)}
            </span>
          )}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span className="hidden text-caption-md text-gray-7 sm:inline">
          مرتب‌سازی:
        </span>
        <div ref={rootRef} className="relative">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className={`flex h-9 items-center gap-1.5 rounded-xl border px-3 text-button-s transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
              open
                ? "border-primary/35 bg-primary-tint-1 text-primary"
                : "border-gray-4 bg-white text-gray-11 hover:border-gray-6 hover:bg-gray-1"
            }`}
          >
            <Sort size="16" color="currentColor" />
            <span>{sortLabel(filters.sort)}</span>
            <ArrowDown2
              size="13"
              color="currentColor"
              className={`text-gray-8 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
                className="absolute left-0 top-[calc(100%+8px)] z-40 w-[190px] overflow-hidden rounded-2xl border border-gray-4 bg-white p-1.5 shadow-[0_18px_50px_rgba(12,12,12,0.14)]"
              >
                <ul role="listbox" aria-label="مرتب‌سازی آگهی‌ها">
                  {SORT_OPTIONS.map((option) => {
                    const selected = option.value === filters.sort;
                    return (
                      <li key={option.value}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={selected}
                          onClick={() => changeSort(option.value)}
                          className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-right text-button-md transition-colors ${
                            selected
                              ? "bg-primary-tint-1 text-primary"
                              : "text-gray-10 hover:bg-gray-1 hover:text-gray-13"
                          }`}
                        >
                          <span>{option.label}</span>
                          {selected && (
                            <TickCircle
                              size="16"
                              variant="Bold"
                              color="currentColor"
                            />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
