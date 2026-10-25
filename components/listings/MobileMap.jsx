"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CloseCircle, Map1 } from "iconsax-react";
import { toFaDigits } from "@/lib/auth";
import MapPanel from "./map/MapPanel";

export default function MobileMap({ points, center, cityName, total }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-button-md text-white shadow-[0_14px_40px_rgba(203,27,27,0.35)] transition-transform active:scale-[0.99] lg:hidden"
      >
        <Map1 size="20" variant="Bold" color="currentColor" />
        نمایش روی نقشه
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1.5 text-[10px]">
          {toFaDigits(total)}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[78] flex flex-col bg-white lg:hidden"
          >
            <div className="flex items-center justify-between gap-3 border-b border-gray-3 px-4 py-3">
              <div>
                <h2 className="flex items-center gap-1.5 text-body-xs font-bold text-gray-12">
                  <Map1 size="17" color="#cb1b1b" variant="Bold" />
                  نقشهٔ آگهی‌ها
                </h2>
                <p className="mt-0.5 text-[10px] text-gray-7">
                  {cityName ?? "سراسر ایران"} · {toFaDigits(total)} آگهی
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="بستن نقشه"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-1 text-gray-9 transition-colors hover:bg-gray-2 hover:text-primary"
              >
                <CloseCircle size="24" color="currentColor" />
              </button>
            </div>
            <div className="min-h-0 flex-1">
              <MapPanel
                points={points}
                center={center}
                cityName={cityName}
                total={total}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
