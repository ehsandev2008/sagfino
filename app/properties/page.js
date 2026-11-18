import { Suspense } from "react";
import { connection } from "next/server";
import AgencyDirectory from "@/components/properties/AgencyDirectory";
import { getAgencyDirectory } from "@/lib/listings/service";
import { getCityById, getProvinceById } from "@/lib/listings/locations";

export const metadata = {
  title: "املاک و مستغلات | سقفینو",
  description:
    "جست‌وجو و مقایسهٔ دفاتر املاک و مشاوران معتبر در شهرهای ایران.",
};

export default function PropertiesPage({ searchParams }) {
  return (
    <Suspense
      fallback={
        <main
          dir="rtl"
          className="mx-auto min-h-64 w-[calc(100%-1.5rem)] max-w-[1224px] py-12 text-center text-gray-8 sm:w-[calc(100%-3rem)]"
          role="status"
        >
          در حال بارگذاری دفاتر املاک…
        </main>
      }
    >
      <AgencyDirectoryPage searchParams={searchParams} />
    </Suspense>
  );
}

async function AgencyDirectoryPage({ searchParams }) {
  await connection();

  const raw = await searchParams;
  const first = (value) => (Array.isArray(value) ? value[0] : value);
  const q = String(first(raw.q) ?? "").trim().slice(0, 80);
  const cityId = String(first(raw.city) ?? "").replace(/[^\d]/g, "");
  const provinceId = String(first(raw.province) ?? "").replace(/[^\d]/g, "");
  const sort = ["rating", "ads", "newest"].includes(first(raw.sort))
    ? first(raw.sort)
    : "rating";

  const city = cityId ? getCityById(cityId) : null;
  const province =
    !city && provinceId ? getProvinceById(provinceId) : null;
  const result = await getAgencyDirectory({
    q,
    cityId: city?.id ?? null,
    provinceId: province?.id ?? null,
    sort,
  });

  return (
    <AgencyDirectory
      agencies={result.items}
      total={result.total}
      source={result.source}
      query={q}
      sort={sort}
      selectedCity={city}
      selectedProvince={province}
    />
  );
}
