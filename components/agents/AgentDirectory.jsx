"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CloseCircle, SearchNormal1 } from "iconsax-react";
import { toFaDigits } from "@/lib/auth";
import AdvisorCard from "@/components/home-pro/top-advisors/AdvisorCard";
import CityPicker, {
  CityPickerTrigger,
} from "@/components/listings/CityPicker";

function directoryHref({ query, city, province }) {
  const params = new URLSearchParams();
  if (query.trim()) params.set("q", query.trim());
  if (city) params.set("city", String(city.id));
  else if (province) params.set("province", String(province.id));
  const search = params.toString();
  return search ? `/agents?${search}` : "/agents";
}

export default function AgentDirectory({
  advisors,
  query,
  selectedCity,
  selectedProvince,
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(query);
  const [cityPickerOpen, setCityPickerOpen] = useState(false);

  const navigate = (next = {}) => {
    const values = {
      query: search,
      city: selectedCity,
      province: selectedProvince,
      ...next,
    };
    startTransition(() =>
      router.push(directoryHref(values), { scroll: false })
    );
  };

  return (
    <main
      dir="rtl"
      className="mx-auto w-[calc(100%-1.5rem)] max-w-[1224px] pb-16 pt-4 sm:w-[calc(100%-3rem)] lg:pt-8"
    >
      <header className="mb-7 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-h4 font-bold text-gray-12 sm:text-h3">
            مشاورین املاک
          </h1>
          <p className="mt-2 text-sm text-gray-8 sm:text-base">
            مشاور مورد نظر خود را در شهرهای ایران پیدا کنید
          </p>
        </div>
        <p className="text-sm text-gray-8" aria-live="polite">
          {isPending
            ? "در حال جست‌وجو…"
            : `${toFaDigits(advisors.length)} مشاور`}
        </p>
      </header>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          navigate();
        }}
        className="mb-8 grid grid-cols-1 gap-3 rounded-2xl border border-gray-4 bg-white p-3 shadow-[0_4px_24px_-12px_rgba(12,12,12,0.12)] sm:grid-cols-[minmax(0,1fr)_220px_auto] sm:items-center"
      >
        <label className="relative block">
          <span className="sr-only">جست‌وجوی نام مشاور یا دفتر</span>
          <SearchNormal1
            size="20"
            color="currentColor"
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-8"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="نام مشاور یا دفتر را جست‌وجو کنید"
            className="h-12 w-full rounded-xl border border-gray-4 bg-white py-2 pl-10 pr-11 text-button-md text-gray-12 outline-none transition-colors placeholder:text-gray-7 focus:border-primary"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                navigate({ query: "" });
              }}
              aria-label="پاک کردن جست‌وجو"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-7 hover:text-primary"
            >
              <CloseCircle size="20" color="currentColor" />
            </button>
          )}
        </label>

        <CityPickerTrigger
          selectedCity={selectedCity}
          selectedProvince={selectedProvince}
          onClick={() => setCityPickerOpen(true)}
        />

        <button
          type="submit"
          disabled={isPending}
          className="h-12 rounded-xl bg-primary px-6 text-button-md font-medium text-white transition-colors hover:bg-primary-shade-1 disabled:opacity-60"
        >
          جست‌وجو
        </button>
      </form>

      <p className="mb-5 text-sm text-gray-9">
        {advisors.length
          ? `${toFaDigits(advisors.length)} مشاور پیدا شد`
          : "مشاوری با این مشخصات پیدا نشد"}
      </p>

      {advisors.length ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {advisors.map((advisor) => (
            <AdvisorCard key={advisor.id} advisor={advisor} compact />
          ))}
        </div>
      ) : (
        <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-4 bg-gray-1 px-5 text-center">
          <p className="font-bold text-gray-11">نتیجه‌ای پیدا نشد</p>
          <p className="mt-2 text-sm text-gray-8">
            نام دیگری جست‌وجو کنید یا فیلتر شهر را تغییر دهید.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              navigate({ query: "", city: null, province: null });
            }}
            className="mt-4 rounded-lg px-4 py-2 text-sm font-medium text-primary hover:bg-primary-tint-1"
          >
            پاک کردن فیلترها
          </button>
        </div>
      )}

      <CityPicker
        open={cityPickerOpen}
        onClose={() => setCityPickerOpen(false)}
        selectedCity={selectedCity}
        selectedProvince={selectedProvince}
        onSelect={({ city, province }) => navigate({ city, province })}
      />
    </main>
  );
}
