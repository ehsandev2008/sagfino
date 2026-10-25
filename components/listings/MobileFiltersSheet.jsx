"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { CloseCircle, TickCircle } from "iconsax-react";
import { toFaDigits } from "@/lib/auth";
import {
  AREA_RANGES,
  DEPOSIT_RANGES,
  FEATURE_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  RENT_RANGES,
  ROOM_OPTIONS,
} from "@/lib/listings/constants";
import RangeInput from "./RangeInput";

function numericValue(value) {
  const cleaned = String(value ?? "").replace(/[^\d]/g, "");
  return cleaned ? Number(cleaned) : null;
}

function ChipGroup({ options, value, onChange, columns = 3 }) {
  return (
    <div
      className={`grid gap-1.5 ${
        columns === 2 ? "grid-cols-2" : "grid-cols-3"
      }`}
    >
      {options.map((option) => {
        const active = String(option.value) === String(value ?? "");
        return (
          <button
            key={option.value || "all"}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex min-h-9 items-center justify-center gap-1 rounded-lg border px-2 py-1.5 text-center text-[11px] leading-4 transition-colors ${
              active
                ? "border-primary/35 bg-primary-tint-1 font-medium text-primary"
                : "border-gray-4 bg-white text-gray-10 hover:border-gray-6"
            }`}
          >
            {active && (
              <TickCircle size="13" variant="Bold" color="currentColor" />
            )}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function MobileFiltersSheet({
  open,
  onClose,
  filters,
  onSubmit,
}) {
  const initial = useMemo(
    () => ({
      type: filters.type || "",
      rooms: filters.rooms == null ? "" : String(filters.rooms),
      area: filters.minArea == null && filters.maxArea == null ? filters.area || "" : "",
      rent: filters.minRent == null && filters.maxRent == null ? filters.rent || "" : "",
      deposit:
        filters.minDeposit == null && filters.maxDeposit == null
          ? filters.deposit || ""
          : "",
      minArea: filters.minArea?.toString() ?? "",
      maxArea: filters.maxArea?.toString() ?? "",
      minRent: filters.minRent?.toString() ?? "",
      maxRent: filters.maxRent?.toString() ?? "",
      minDeposit: filters.minDeposit?.toString() ?? "",
      maxDeposit: filters.maxDeposit?.toString() ?? "",
      features: [...(filters.features ?? [])],
    }),
    [filters]
  );

  const [draft, setDraft] = useState(initial);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const update = (patch) => setDraft((current) => ({ ...current, ...patch }));

  const selectPreset = (key, value) => {
    const patch = { [key]: value };
    if (key === "area") {
      patch.minArea = "";
      patch.maxArea = "";
    }
    if (key === "rent") {
      patch.minRent = "";
      patch.maxRent = "";
    }
    if (key === "deposit") {
      patch.minDeposit = "";
      patch.maxDeposit = "";
    }
    update(patch);
  };

  const setCustom = (key, value) => {
    const patch = { [key]: value };
    if (key.endsWith("Area")) patch.area = "";
    if (key.endsWith("Rent")) patch.rent = "";
    if (key.endsWith("Deposit")) patch.deposit = "";
    update(patch);
  };

  const toggleFeature = (feature) => {
    setDraft((current) => ({
      ...current,
      features: current.features.includes(feature)
        ? current.features.filter((item) => item !== feature)
        : [...current.features, feature],
    }));
  };

  const activeCount =
    (draft.type ? 1 : 0) +
    (draft.rooms !== "" ? 1 : 0) +
    (draft.area || draft.minArea || draft.maxArea ? 1 : 0) +
    (draft.rent || draft.minRent || draft.maxRent ? 1 : 0) +
    (draft.deposit || draft.minDeposit || draft.maxDeposit ? 1 : 0) +
    draft.features.length;

  const submit = () => {
    onSubmit?.({
      type: draft.type,
      rooms: draft.rooms === "" ? null : Number(draft.rooms),
      area: draft.area,
      rent: draft.rent,
      deposit: draft.deposit,
      minArea: numericValue(draft.minArea),
      maxArea: numericValue(draft.maxArea),
      minRent: numericValue(draft.minRent),
      maxRent: numericValue(draft.maxRent),
      minDeposit: numericValue(draft.minDeposit),
      maxDeposit: numericValue(draft.maxDeposit),
      features: draft.features,
      page: 1,
    });
    onClose?.();
  };

  const reset = () => {
    setDraft({
      type: "",
      rooms: "",
      area: "",
      rent: "",
      deposit: "",
      minArea: "",
      maxArea: "",
      minRent: "",
      maxRent: "",
      minDeposit: "",
      maxDeposit: "",
      features: [],
    });
  };

  const content = (
    <div className="fixed inset-0 z-[72]">
      <motion.button
        type="button"
        aria-label="بستن فیلترها"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-gray-13/45 backdrop-blur-[3px]"
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-filters-title"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 32, stiffness: 320 }}
        className="absolute inset-x-0 bottom-0 flex max-h-[92dvh] flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-gray-3 px-5 py-4">
          <div className="flex items-center gap-2">
            <h2 id="mobile-filters-title" className="text-h5 text-gray-13">
              فیلترها
            </h2>
            {activeCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] text-white">
                {toFaDigits(activeCount)}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-8 transition-colors hover:bg-gray-1 hover:text-gray-13"
          >
            <CloseCircle size="24" color="currentColor" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
          <section>
            <h3 className="mb-2 text-button-md text-gray-12">نوع ملک</h3>
            <ChipGroup
              options={PROPERTY_TYPE_OPTIONS}
              value={draft.type}
              onChange={(value) => update({ type: value })}
              columns={3}
            />
          </section>

          <section>
            <h3 className="mb-2 text-button-md text-gray-12">تعداد اتاق</h3>
            <ChipGroup
              options={ROOM_OPTIONS}
              value={draft.rooms}
              onChange={(value) => update({ rooms: value })}
              columns={3}
            />
          </section>

          <section>
            <h3 className="mb-2 text-button-md text-gray-12">متراژ</h3>
            <ChipGroup
              options={AREA_RANGES}
              value={draft.area}
              onChange={(value) => selectPreset("area", value)}
              columns={2}
            />
            <div className="mt-2 grid grid-cols-2 gap-2">
              <RangeInput
                label="از"
                value={draft.minArea}
                onChange={(value) => setCustom("minArea", value)}
                suffix="متر"
              />
              <RangeInput
                label="تا"
                value={draft.maxArea}
                onChange={(value) => setCustom("maxArea", value)}
                suffix="متر"
              />
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-button-md text-gray-12">اجارهٔ ماهانه</h3>
            <ChipGroup
              options={RENT_RANGES}
              value={draft.rent}
              onChange={(value) => selectPreset("rent", value)}
              columns={2}
            />
            <div className="mt-2 grid grid-cols-2 gap-2">
              <RangeInput
                label="از"
                value={draft.minRent}
                onChange={(value) => setCustom("minRent", value)}
                suffix="میلیون"
              />
              <RangeInput
                label="تا"
                value={draft.maxRent}
                onChange={(value) => setCustom("maxRent", value)}
                suffix="میلیون"
              />
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-button-md text-gray-12">رهن</h3>
            <ChipGroup
              options={DEPOSIT_RANGES}
              value={draft.deposit}
              onChange={(value) => selectPreset("deposit", value)}
              columns={2}
            />
            <div className="mt-2 grid grid-cols-2 gap-2">
              <RangeInput
                label="از"
                value={draft.minDeposit}
                onChange={(value) => setCustom("minDeposit", value)}
                suffix="میلیون"
              />
              <RangeInput
                label="تا"
                value={draft.maxDeposit}
                onChange={(value) => setCustom("maxDeposit", value)}
                suffix="میلیون"
              />
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-button-md text-gray-12">امکانات</h3>
            <div className="flex flex-wrap gap-1.5">
              {FEATURE_OPTIONS.map((feature) => {
                const active = draft.features.includes(feature.value);
                return (
                  <button
                    key={feature.value}
                    type="button"
                    onClick={() => toggleFeature(feature.value)}
                    className={`inline-flex h-9 items-center gap-1 rounded-full border px-3.5 text-[11px] transition-colors ${
                      active
                        ? "border-primary/35 bg-primary-tint-1 text-primary"
                        : "border-gray-4 text-gray-10 hover:border-gray-6"
                    }`}
                  >
                    {active && (
                      <TickCircle size="13" variant="Bold" color="currentColor" />
                    )}
                    {feature.label}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <div className="flex items-center gap-3 border-t border-gray-3 bg-white px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3">
          <button
            type="button"
            onClick={reset}
            className="text-button-md text-gray-8 transition-colors hover:text-primary"
          >
            پاک کردن
          </button>
          <button
            type="button"
            onClick={submit}
            className="flex h-11 flex-1 items-center justify-center rounded-xl bg-primary text-button-md text-white shadow-[0_8px_20px_rgba(203,27,27,0.22)] transition-colors hover:bg-primary-shade-1"
          >
            نمایش آگهی‌ها
          </button>
        </div>
      </motion.div>
    </div>
  );

  return createPortal(content, document.body);
}
