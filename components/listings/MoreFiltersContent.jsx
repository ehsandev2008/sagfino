"use client";

import { useMemo, useState } from "react";
import { TickCircle } from "iconsax-react";
import {
  DEPOSIT_RANGES,
  FEATURE_OPTIONS,
} from "@/lib/listings/constants";
import { toFaDigits, toEnglishDigits } from "@/lib/auth";
import RangeInput from "./RangeInput";

function numericValue(value) {
  const cleaned = toEnglishDigits(String(value ?? "")).replace(/[^\d]/g, "");
  if (!cleaned) return null;
  return Number(cleaned);
}

/**
 * محتوای فیلترهای بیشتر (هم برای پاپ‌اور دسکتاپ و هم شیت موبایل)
 */
export default function MoreFiltersContent({ filters, onApply, onClear }) {
  const initial = useMemo(
    () => ({
      deposit: filters.minDeposit == null && filters.maxDeposit == null ? filters.deposit || "" : "",
      minDeposit: filters.minDeposit?.toString() ?? "",
      maxDeposit: filters.maxDeposit?.toString() ?? "",
      minRent: filters.minRent?.toString() ?? "",
      maxRent: filters.maxRent?.toString() ?? "",
      minArea: filters.minArea?.toString() ?? "",
      maxArea: filters.maxArea?.toString() ?? "",
      features: [...(filters.features ?? [])],
    }),
    [filters]
  );

  const [draft, setDraft] = useState(initial);

  const activeCount =
    (draft.deposit ? 1 : 0) +
    (draft.minDeposit || draft.maxDeposit ? 1 : 0) +
    (draft.minRent || draft.maxRent ? 1 : 0) +
    (draft.minArea || draft.maxArea ? 1 : 0) +
    draft.features.length;

  const update = (patch) => setDraft((current) => ({ ...current, ...patch }));

  const selectDeposit = (value) => {
    update({
      deposit: value,
      minDeposit: value ? "" : draft.minDeposit,
      maxDeposit: value ? "" : draft.maxDeposit,
    });
  };

  const setCustom = (key, value) => {
    const patch = { [key]: value };
    if (key === "minDeposit" || key === "maxDeposit") patch.deposit = "";
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

  const apply = () => {
    onApply?.({
      deposit: draft.deposit || "",
      minDeposit: numericValue(draft.minDeposit),
      maxDeposit: numericValue(draft.maxDeposit),
      minRent: numericValue(draft.minRent),
      maxRent: numericValue(draft.maxRent),
      minArea: numericValue(draft.minArea),
      maxArea: numericValue(draft.maxArea),
      features: draft.features,
      page: 1,
    });
  };

  const clear = () => {
    setDraft({
      deposit: "",
      minDeposit: "",
      maxDeposit: "",
      minRent: "",
      maxRent: "",
      minArea: "",
      maxArea: "",
      features: [],
    });
    onClear?.();
  };

  return (
    <div className="flex min-h-0 flex-col">
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-4 sm:px-5">
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-button-md text-gray-12">محدودهٔ رهن</h3>
            {draft.deposit && (
              <button
                type="button"
                onClick={() => selectDeposit("")}
                className="text-[10px] text-primary hover:underline"
              >
                حذف
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {DEPOSIT_RANGES.filter((range) => range.value).map((range) => {
              const active = draft.deposit === range.value;
              return (
                <button
                  key={range.value}
                  type="button"
                  onClick={() => selectDeposit(active ? "" : range.value)}
                  className={`flex min-h-9 items-center justify-between gap-1 rounded-lg border px-2.5 py-1.5 text-right text-[11px] transition-colors ${
                    active
                      ? "border-primary/35 bg-primary-tint-1 text-primary"
                      : "border-gray-4 text-gray-10 hover:border-gray-6"
                  }`}
                >
                  <span>{range.label}</span>
                  {active && (
                    <TickCircle size="14" variant="Bold" color="currentColor" />
                  )}
                </button>
              );
            })}
          </div>
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
          <h3 className="mb-2 text-button-md text-gray-12">محدودهٔ اجاره</h3>
          <div className="grid grid-cols-2 gap-2">
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
          <h3 className="mb-2 text-button-md text-gray-12">متراژ دلخواه</h3>
          <div className="grid grid-cols-2 gap-2">
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
          <h3 className="mb-2 text-button-md text-gray-12">امکانات</h3>
          <div className="flex flex-wrap gap-1.5">
            {FEATURE_OPTIONS.map((feature) => {
              const active = draft.features.includes(feature.value);
              return (
                <button
                  key={feature.value}
                  type="button"
                  onClick={() => toggleFeature(feature.value)}
                  className={`inline-flex h-8 items-center gap-1 rounded-full border px-3 text-[11px] transition-colors ${
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

      <div className="flex items-center justify-between gap-3 border-t border-gray-3 bg-white px-4 py-3 sm:px-5">
        <button
          type="button"
          onClick={clear}
          className="text-button-md text-gray-8 transition-colors hover:text-primary"
        >
          پاک کردن
        </button>
        <button
          type="button"
          onClick={apply}
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-button-md text-white shadow-[0_8px_20px_rgba(203,27,27,0.22)] transition-all hover:bg-primary-shade-1 active:scale-[0.99] sm:flex-none"
        >
          اعمال فیلتر
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1 text-[10px]">
              {toFaDigits(activeCount)}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
