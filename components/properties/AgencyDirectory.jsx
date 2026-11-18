"use client";

import AgencyCard from "@/components/home-pro/top-agencies/AgencyCard";
import AgencyModal from "@/components/home-pro/top-agencies/AgencyModal";
import CityPicker, {
  CityPickerTrigger,
} from "@/components/listings/CityPicker";
import { toFaDigits } from "@/lib/auth";
import { CloseCircle, SearchNormal1 } from "iconsax-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

function directoryHref({ query, city, province, sort }) {
  const params = new URLSearchParams();
  if (query.trim()) params.set("q", query.trim());
  if (city) params.set("city", String(city.id));
  else if (province) params.set("province", String(province.id));
  if (sort !== "rating") params.set("sort", sort);
  const search = params.toString();
  return search ? `/properties?${search}` : "/properties";
}

export default function AgencyDirectory({
  agencies,
  total,
  source,
  query,
  sort,
  selectedCity,
  selectedProvince,
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(query);
  const [cityPickerOpen, setCityPickerOpen] = useState(false);
  const [activeAgency, setActiveAgency] = useState(null);
  const displayAgencies = agencies.map((agency) => ({
    ...agency,
    satisfaction: agency.ratingLabel,
    activeAds: agency.activeAdsLabel,
    reviewsCount: agency.reviewsLabel,
  }));

  const navigate = (next = {}) => {
    const values = {
      query: search,
      city: selectedCity,
      province: selectedProvince,
      sort,
      ...next,
    };
    startTransition(() =>
      router.push(directoryHref(values), { scroll: false }),
    );
  };

  const openAgency = (agency, rect, trigger) =>
    setActiveAgency({ agency, rect, trigger });

  return (
    <main
      dir="rtl"
      className="mx-auto w-[calc(100%-1.5rem)] max-w-[1224px] pb-16 pt-4 sm:w-[calc(100%-3rem)] lg:pt-8"
    >
      <header className="mb-7 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-h4 font-bold text-gray-12 sm:text-h3">
            املاک و مستغلات
          </h1>
          <p className="mt-2 text-sm text-gray-8 sm:text-base">
            دفاتر املاک و مشاوران شهر خود را پیدا کنید
          </p>
        </div>
        <p className="text-sm text-gray-8" aria-live="polite">
          {isPending ? "در حال جست‌وجو…" : `${toFaDigits(total)} دفتر املاک`}
          {source === "demo" && !isPending ? " · " : ""}
        </p>
      </header>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          navigate();
        }}
        className="mb-8 grid grid-cols-1 gap-3 rounded-2xl border border-gray-4 bg-white p-3 shadow-[0_4px_24px_rgba(12,12,12,0.03)] sm:grid-cols-[minmax(0,1fr)_220px_auto] sm:items-center"
      >
        <label className="relative block">
          <span className="sr-only">جست‌وجوی نام دفتر یا محله</span>
          <SearchNormal1
            size="20"
            color="currentColor"
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-8"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="نام دفتر یا محله را جست‌وجو کنید"
            className="h-12 w-full rounded-xl border border-gray-4 bg-white py-2 pr-11 pl-10 text-button-md text-gray-12 outline-none transition-colors placeholder:text-gray-7 focus:border-primary"
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

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-9">
          {total
            ? `${toFaDigits(total)} نتیجه پیدا شد`
            : "دفتر املاکی با این مشخصات پیدا نشد"}
        </p>
        <label className="flex items-center gap-2 text-sm text-gray-8">
          مرتب‌سازی
          <select
            value={sort}
            onChange={(event) => navigate({ sort: event.target.value })}
            className="h-10 rounded-xl border border-gray-4 bg-white px-3 text-gray-11 outline-none focus:border-primary"
          >
            <option value="rating">بیشترین رضایت</option>
            <option value="ads">بیشترین آگهی فعال</option>
            <option value="newest">جدیدترین</option>
          </select>
        </label>
      </div>

      {agencies.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {displayAgencies.map((agency) => (
            <AgencyCard key={agency.slug} agency={agency} onOpen={openAgency} />
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

      {activeAgency && (
        <AgencyModal
          agency={activeAgency.agency}
          originRect={activeAgency.rect}
          returnFocusTo={activeAgency.trigger}
          onClose={() => setActiveAgency(null)}
        />
      )}
    </main>
  );
}
