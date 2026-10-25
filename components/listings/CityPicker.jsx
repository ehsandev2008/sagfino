"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import {
  ArrowDown2,
  CloseCircle,
  Global,
  Location,
  SearchNormal1,
  TickCircle,
} from "iconsax-react";
import { toFaDigits } from "@/lib/auth";

const FOCUSABLE =
  'button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

async function fetchJson(url, signal) {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error("درخواست ناموفق بود");
  return response.json();
}

export default function CityPicker({
  open,
  onClose,
  selectedCity,
  selectedProvince,
  onSelect,
}) {
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [provinceId, setProvinceId] = useState(() =>
    selectedCity?.provinceId ? String(selectedCity.provinceId) : ""
  );
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const previousFocusRef = useRef(null);

  const close = useCallback(() => {
    onClose?.();
  }, [onClose]);

  // بارگذاری استان‌ها + شهرهای محبوب هنگام باز شدن
  useEffect(() => {
    if (!open) return undefined;

    previousFocusRef.current = document.activeElement;
    const controller = new AbortController();

    fetchJson("/api/locations/provinces", controller.signal)
      .then((data) => setProvinces(data.provinces ?? []))
      .catch(() => {
        if (!controller.signal.aborted) setError("دریافت فهرست استان‌ها ناموفق بود.");
      });

    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true });
    }, 180);

    return () => {
      controller.abort();
      window.clearTimeout(focusTimer);
      const target = previousFocusRef.current;
      if (target?.isConnected) target.focus?.({ preventScroll: true });
    };
  }, [open]);

  // قفل اسکرول و Escape
  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;

      const nodes = Array.from(
        panelRef.current?.querySelectorAll(FOCUSABLE) ?? []
      ).filter((node) => node.offsetParent !== null);

      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, close]);

  // دریافت شهرها از API (با debounce)
  useEffect(() => {
    if (!open) return undefined;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (provinceId) params.set("province", provinceId);
      if (!query.trim() && !provinceId) {
        params.set("popular", "1");
        params.set("limit", "14");
      } else {
        params.set("limit", "200");
      }

      setLoading(true);
      setError("");
      try {
        const data = await fetchJson(
          `/api/locations/cities?${params.toString()}`,
          controller.signal
        );
        setCities(data.cities ?? []);
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setError("دریافت شهرها ناموفق بود. دوباره تلاش کنید.");
          setCities([]);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, query ? 260 : 0);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [open, query, provinceId]);

  if (!open) return null;

  const activeProvince = provinces.find(
    (province) => String(province.id) === String(provinceId)
  );

  const chooseCity = (city) => {
    onSelect?.({ city, province: null });
    close();
  };

  const chooseProvince = () => {
    onSelect?.({ city: null, province: activeProvince ?? null });
    close();
  };

  const clearLocation = () => {
    onSelect?.({ city: null, province: null });
    close();
  };

  const content = (
    <div className="fixed inset-0 z-[75]">
      <motion.button
        type="button"
        aria-label="بستن انتخاب شهر"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={close}
        className="absolute inset-0 h-full w-full cursor-default bg-gray-13/45 backdrop-blur-[3px]"
      />

      <div className="pointer-events-none absolute inset-0 flex items-end justify-center p-0 sm:items-center sm:p-6">
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="city-picker-title"
          initial={{ opacity: 0, y: 30, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.99 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto flex max-h-[92vh] w-full max-w-[660px] flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:rounded-[28px]"
        >
          <div className="flex items-start justify-between gap-4 border-b border-gray-3 px-5 pb-4 pt-5 sm:px-6">
            <div>
              <h2 id="city-picker-title" className="text-h5 text-gray-13">
                انتخاب شهر
              </h2>
              <p className="mt-1 text-caption-md text-gray-8">
                همهٔ استان‌ها و شهرهای ایران ({toFaDigits(1481)} شهر)
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="بستن"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-8 transition-colors hover:bg-gray-1 hover:text-gray-13 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <CloseCircle size="24" color="currentColor" />
            </button>
          </div>

          <div className="space-y-3 px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="relative flex-1">
                <span className="sr-only">استان</span>
                <select
                  value={provinceId}
                  onChange={(event) => setProvinceId(event.target.value)}
                  className="h-11 w-full appearance-none rounded-xl border border-gray-4 bg-white px-3.5 pl-9 text-button-md text-gray-11 outline-none transition-colors hover:border-gray-6 focus:border-primary"
                >
                  <option value="">همه استان‌ها</option>
                  {provinces.map((province) => (
                    <option key={province.id} value={province.id}>
                      {province.name} ({toFaDigits(province.citiesCount)} شهر)
                    </option>
                  ))}
                </select>
                <ArrowDown2
                  size="16"
                  color="#909090"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                />
              </label>

              <label className="relative flex-[1.4]">
                <span className="sr-only">جست‌وجوی شهر</span>
                <SearchNormal1
                  size="18"
                  color="#909090"
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
                />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="نام شهر را جست‌وجو کنید…"
                  className="h-11 w-full rounded-xl border border-gray-4 bg-white pr-10 pl-3 text-button-md text-gray-12 outline-none transition-colors placeholder:text-gray-7 hover:border-gray-6 focus:border-primary"
                />
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={clearLocation}
                className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-caption-md transition-colors ${
                  !selectedCity && !selectedProvince
                    ? "border-primary/30 bg-primary-tint-1 text-primary"
                    : "border-gray-4 text-gray-10 hover:border-gray-6"
                }`}
              >
                <Global size="15" color="currentColor" />
                همه شهرها
              </button>

              {activeProvince && (
                <button
                  type="button"
                  onClick={chooseProvince}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-gray-4 px-3 text-caption-md text-gray-10 transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <Location size="15" color="currentColor" />
                  همهٔ شهرهای {activeProvince.name}
                </button>
              )}

              {!selectedCity && selectedProvince && (
                <span className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary-tint-1 px-3 text-caption-md text-primary">
                  <TickCircle size="15" variant="Bold" color="currentColor" />
                  فیلتر فعلی: استان {selectedProvince.name}
                </span>
              )}
            </div>
          </div>

          <div className="min-h-[180px] flex-1 overflow-y-auto border-t border-gray-3 px-5 py-4 sm:px-6">
            {loading ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div
                    key={index}
                    className="listings-shimmer h-11 rounded-xl"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                <p className="text-body-xs text-gray-10">{error}</p>
                <button
                  type="button"
                  onClick={() => setQuery((value) => `${value} `)}
                  className="text-button-md text-primary hover:underline"
                >
                  تلاش دوباره
                </button>
              </div>
            ) : cities.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                <p className="text-body-xs text-gray-10">
                  شهری با این نام پیدا نشد.
                </p>
                <p className="text-caption-md text-gray-7">
                  نام را کوتاه‌تر وارد کنید یا استان را تغییر دهید.
                </p>
              </div>
            ) : (
              <>
                <p className="mb-2 text-caption-md text-gray-7">
                  {query || provinceId
                    ? `${toFaDigits(cities.length)} شهر پیدا شد`
                    : "شهرهای پرجست‌وجو"}
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {cities.map((city) => {
                    const active =
                      String(selectedCity?.id ?? "") === String(city.id);
                    return (
                      <button
                        key={city.id}
                        type="button"
                        onClick={() => chooseCity(city)}
                        className={`group flex min-h-11 items-center justify-between gap-1 rounded-xl border px-3 py-2 text-right transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                          active
                            ? "border-primary/35 bg-primary-tint-1 text-primary"
                            : "border-gray-4 bg-white text-gray-11 hover:border-primary/30 hover:bg-primary-tint-1/40 hover:text-primary"
                        }`}
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-button-md">
                            {city.name}
                          </span>
                          <span className="block truncate text-[10px] text-gray-7">
                            {city.provinceName}
                          </span>
                        </span>
                        {active && (
                          <TickCircle
                            size="16"
                            variant="Bold"
                            color="currentColor"
                            className="shrink-0"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}

export function CityPickerTrigger({
  selectedCity,
  selectedProvince,
  onClick,
  compact = false,
}) {
  const label = selectedCity
    ? selectedCity.name
    : selectedProvince
      ? `استان ${selectedProvince.name}`
      : "همه شهرها";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-11 items-center justify-between gap-2 rounded-xl border px-3.5 text-button-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
        selectedCity || selectedProvince
          ? "border-primary/35 bg-primary-tint-1 text-primary"
          : "border-gray-4 bg-white text-gray-11 hover:border-gray-6 hover:bg-gray-1"
      } ${compact ? "w-full" : "w-full"}`}
    >
      <span className="flex min-w-0 items-center gap-2">
        <Location
          size="18"
          variant={selectedCity || selectedProvince ? "Bold" : "Linear"}
          color="currentColor"
          className="shrink-0"
        />
        <span className="truncate">{label}</span>
      </span>
      <ArrowDown2
        size="15"
        color="currentColor"
        className="shrink-0 text-gray-8"
      />
    </button>
  );
}
