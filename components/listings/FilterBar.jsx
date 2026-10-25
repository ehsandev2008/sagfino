"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowDown2,
  CloseCircle,
  FilterSearch,
  Home2,
  Money4,
  Ruler,
} from "iconsax-react";
import {
  AREA_RANGES,
  PROPERTY_TYPE_OPTIONS,
  RENT_RANGES,
  ROOM_OPTIONS,
} from "@/lib/listings/constants";
import {
  buildListingHref,
  countActiveFilters,
  getActiveFilterChips,
} from "@/lib/listings/query";
import { toFaDigits } from "@/lib/auth";
import CityPicker, { CityPickerTrigger } from "./CityPicker";
import FilterMenu from "./FilterMenu";
import MoreFiltersContent from "./MoreFiltersContent";
import MobileFiltersSheet from "./MobileFiltersSheet";

const DEFAULT_OVERRIDES = {
  city: null,
  province: null,
  q: "",
  type: "",
  rooms: null,
  area: "",
  rent: "",
  deposit: "",
  minArea: null,
  maxArea: null,
  minRent: null,
  maxRent: null,
  minDeposit: null,
  maxDeposit: null,
  features: [],
  page: 1,
};

export default function FilterBar({ filters, selectedCity, selectedProvince }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [openMenu, setOpenMenu] = useState(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const moreRef = useRef(null);

  const activeCount = countActiveFilters(filters);
  const chips = getActiveFilterChips(filters, {
    cityName: selectedCity?.name,
    provinceName: selectedProvince?.name,
  });

  const go = useCallback(
    (overrides) => {
      const href = buildListingHref(filters, { page: 1, ...overrides });
      setOpenMenu(null);
      startTransition(() => {
        router.push(href, { scroll: false });
      });
      window.setTimeout(() => {
        document
          .getElementById("rent-results")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    },
    [filters, router]
  );

  // بستن پاپ‌اور فیلترهای بیشتر با کلیک بیرون / Escape
  useEffect(() => {
    if (!moreOpen) return undefined;
    const handlePointer = (event) => {
      if (!moreRef.current?.contains(event.target)) setMoreOpen(false);
    };
    const handleKey = (event) => {
      if (event.key === "Escape") setMoreOpen(false);
    };
    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [moreOpen]);

  const removeChip = (key) => {
    if (key === "location") return go({ city: null, province: null });
    if (key === "q") return go({ q: "" });
    if (key === "type") return go({ type: "" });
    if (key === "rooms") return go({ rooms: null });
    if (key === "area")
      return go({ area: "", minArea: null, maxArea: null });
    if (key === "rent")
      return go({ rent: "", minRent: null, maxRent: null });
    if (key === "deposit")
      return go({ deposit: "", minDeposit: null, maxDeposit: null });
    if (key.startsWith("feature:")) {
      const feature = key.split(":")[1];
      return go({
        features: (filters.features ?? []).filter((item) => item !== feature),
      });
    }
    return undefined;
  };

  const applyMore = (overrides) => {
    setMoreOpen(false);
    go(overrides);
  };

  const clearMore = () => {
    go({
      deposit: "",
      minDeposit: null,
      maxDeposit: null,
      minRent: null,
      maxRent: null,
      minArea: null,
      maxArea: null,
      features: [],
    });
  };

  const clearAll = () => {
    go(DEFAULT_OVERRIDES);
  };

  return (
    <>
      <div
        className={`relative rounded-2xl border border-gray-4 bg-white p-3 shadow-[0_4px_24px_rgba(12,12,12,0.035)] transition-shadow ${
          isPending ? "shadow-[0_10px_40px_rgba(203,27,27,0.08)]" : ""
        }`}
      >
        {isPending && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden rounded-t-2xl bg-primary-tint-2">
            <motion.span
              initial={{ x: "100%" }}
              animate={{ x: "-100%" }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="block h-full w-1/3 bg-primary"
            />
          </div>
        )}

        {/* دسکتاپ */}
        <div className="hidden items-center gap-2.5 lg:flex">
          <div className="w-[210px] shrink-0">
            <CityPickerTrigger
              selectedCity={selectedCity}
              selectedProvince={selectedProvince}
              onClick={() => setCityOpen(true)}
            />
          </div>

          <div className="grid min-w-0 flex-1 grid-cols-4 gap-2.5">
            <FilterMenu
              id="type"
              label="نوع ملک"
              value={filters.type}
              options={PROPERTY_TYPE_OPTIONS}
              onChange={(value) => go({ type: value })}
              openKey={openMenu}
              setOpenKey={setOpenMenu}
              icon={Home2}
            />
            <FilterMenu
              id="rooms"
              label="تعداد اتاق"
              value={filters.rooms == null ? "" : String(filters.rooms)}
              options={ROOM_OPTIONS}
              onChange={(value) =>
                go({ rooms: value === "" ? null : Number(value) })
              }
              openKey={openMenu}
              setOpenKey={setOpenMenu}
              icon={Home2}
            />
            <FilterMenu
              id="area"
              label="متراژ"
              value={filters.area}
              options={AREA_RANGES}
              onChange={(value) =>
                go({ area: value, minArea: null, maxArea: null })
              }
              openKey={openMenu}
              setOpenKey={setOpenMenu}
              icon={Ruler}
            />
            <FilterMenu
              id="rent"
              label="اجاره"
              value={filters.rent}
              options={RENT_RANGES}
              onChange={(value) =>
                go({ rent: value, minRent: null, maxRent: null })
              }
              openKey={openMenu}
              setOpenKey={setOpenMenu}
              icon={Money4}
            />
          </div>

          <div ref={moreRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => setMoreOpen((value) => !value)}
              aria-expanded={moreOpen}
              className={`flex h-11 items-center gap-2 rounded-xl border px-3.5 text-button-md transition-all ${
                moreOpen || filters.minDeposit != null || filters.maxDeposit != null
                  ? "border-primary/35 bg-primary-tint-1 text-primary"
                  : "border-gray-4 bg-white text-gray-11 hover:border-gray-6 hover:bg-gray-1"
              }`}
            >
              <FilterSearch size="18" color="currentColor" />
              <span>فیلتر بیشتر</span>
              {activeCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-white">
                  {toFaDigits(activeCount)}
                </span>
              )}
              <ArrowDown2
                size="14"
                color="currentColor"
                className={`text-gray-8 transition-transform ${
                  moreOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute left-0 top-[calc(100%+10px)] z-40 w-[390px] overflow-hidden rounded-2xl border border-gray-4 bg-white shadow-[0_24px_70px_rgba(12,12,12,0.16)]"
                >
                  <MoreFiltersContent
                    filters={filters}
                    onApply={applyMore}
                    onClear={clearMore}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {activeCount > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="flex h-11 shrink-0 items-center gap-1 rounded-xl px-2 text-caption-md text-gray-8 transition-colors hover:text-primary"
            >
              <CloseCircle size="17" color="currentColor" />
              پاک کردن
            </button>
          )}
        </div>

        {/* موبایل */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="min-w-0 flex-1">
            <CityPickerTrigger
              compact
              selectedCity={selectedCity}
              selectedProvince={selectedProvince}
              onClick={() => setCityOpen(true)}
            />
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className={`relative flex h-11 shrink-0 items-center gap-1.5 rounded-xl border px-3.5 text-button-md transition-colors ${
              activeCount > 0
                ? "border-primary/35 bg-primary-tint-1 text-primary"
                : "border-gray-4 bg-white text-gray-11"
            }`}
          >
            <FilterSearch size="18" color="currentColor" />
            فیلترها
            {activeCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-white">
                {toFaDigits(activeCount)}
              </span>
            )}
          </button>
        </div>

        {/* چیپ‌های فیلتر فعال */}
        {chips.length > 0 && (
          <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto border-t border-gray-2 pt-3">
            {chips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => removeChip(chip.key)}
                className="group inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-gray-4 bg-gray-1 px-3 text-[11px] text-gray-10 transition-colors hover:border-primary/30 hover:bg-primary-tint-1 hover:text-primary"
                aria-label={`حذف فیلتر ${chip.label}`}
              >
                <span>{chip.label}</span>
                <CloseCircle
                  size="14"
                  color="currentColor"
                  variant="Bold"
                  className="text-gray-6 transition-colors group-hover:text-primary"
                />
              </button>
            ))}
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full px-2.5 text-[11px] text-primary hover:bg-primary-tint-1"
            >
              حذف همه
            </button>
          </div>
        )}
      </div>

      {cityOpen && (
        <CityPicker
          open
          onClose={() => setCityOpen(false)}
          selectedCity={selectedCity}
          selectedProvince={selectedProvince}
          onSelect={({ city, province }) =>
            go({
              city: city?.id ?? null,
              province: city ? null : province?.id ?? null,
            })
          }
        />
      )}

      {mobileOpen && (
        <MobileFiltersSheet
          open
          onClose={() => setMobileOpen(false)}
          filters={filters}
          onSubmit={go}
        />
      )}
    </>
  );
}
