import { Suspense } from "react";
import { connection } from "next/server";
import RentHero from "@/components/listings/RentHero";
import RentPageSkeleton from "@/components/listings/RentPageSkeleton";
import FilterBar from "@/components/listings/FilterBar";
import ResultsToolbar from "@/components/listings/ResultsToolbar";
import ListingsGrid from "@/components/listings/ListingsGrid";
import EmptyState from "@/components/listings/EmptyState";
import Pagination from "@/components/listings/Pagination";
import RelatedLinks from "@/components/listings/RelatedLinks";
import MobileMap from "@/components/listings/MobileMap";
import MapPanel from "@/components/listings/map/MapPanel";
import {
  getCityById,
  getProvinceById,
} from "@/lib/listings/locations";
import { parseListingSearchParams } from "@/lib/listings/query";
import { getRelatedAgencies, getRentListings } from "@/lib/listings/service";
import { toFaDigits } from "@/lib/auth";

export const metadata = {
  title: "اجارهٔ مسکن و آپارتمان | سقفینو",
  description:
    "جست‌وجوی آگهی‌های اجاره در سراسر ایران؛ فیلتر بر اساس شهر، متراژ، تعداد اتاق، رهن و اجاره و مشاهدهٔ آگهی‌ها روی نقشه.",
};

const IRAN_CENTER = { lat: 32.4279, lng: 53.688, zoom: 5 };

export default function RentPage({ searchParams }) {
  return (
    <div className="pb-24 lg:pb-14">
      <RentHero />
      <section className="mx-auto mt-3 w-[calc(100%-1.5rem)] max-w-[1224px] lg:mt-5 lg:w-[80%]">
        <Suspense fallback={<RentPageSkeleton />}>
          <RentResults searchParams={searchParams} />
        </Suspense>
      </section>
    </div>
  );
}

async function RentResults({ searchParams }) {
  // داده‌های آگهی و MongoDB فقط در زمان درخواست خوانده می‌شوند.
  await connection();

  const rawParams = await searchParams;
  const filters = parseListingSearchParams(rawParams);

  const city = filters.city ? getCityById(filters.city) : null;
  const province =
    !city && filters.province ? getProvinceById(filters.province) : null;

  const [result, agencies] = await Promise.all([
    getRentListings(filters),
    getRelatedAgencies(filters),
  ]);

  const locationLabel = city
    ? `${city.name}، ${city.provinceName}`
    : province
      ? `استان ${province.name}`
      : "سراسر ایران";

  const mapCenter = IRAN_CENTER;

  return (
    <>
      <FilterBar
        filters={filters}
        selectedCity={city}
        selectedProvince={province}
      />

      <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start">
        <div
          id="rent-results"
          className="min-w-0 scroll-mt-28 lg:col-span-7 xl:col-span-8"
        >
          <ResultsToolbar
            filters={filters}
            total={result.total}
            page={result.page}
            totalPages={result.totalPages}
            locationLabel={locationLabel}
          />

          <div className="mt-3">
            {result.items.length > 0 ? (
              <ListingsGrid
                listings={result.items}
                agencies={agencies}
                cityName={city?.name ?? province?.name}
              />
            ) : (
              <EmptyState filters={filters} />
            )}
          </div>

          <Pagination
            page={result.page}
            totalPages={result.totalPages}
            total={result.total}
            filters={filters}
          />

          <RelatedLinks filters={filters} selectedCity={city} />

          <p className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-gray-6">
            نمایش {toFaDigits(result.items.length)} آگهی از مجموعاً{" "}
            {toFaDigits(result.total)} نتیجه
            {result.source === "demo" ? " · دادهٔ نمایشی" : ""}
          </p>
        </div>

        <aside className="hidden lg:col-span-5 lg:block xl:col-span-4">
          <div className="sticky top-[108px] h-[calc(100vh-132px)] min-h-[540px] max-h-[900px]">
            <MapPanel
              points={result.mapPoints}
              center={mapCenter}
              cityName={city?.name ?? province?.name}
              total={result.total}
              iranOnly
            />
          </div>
        </aside>
      </div>

      <MobileMap
        points={result.mapPoints}
        center={mapCenter}
        cityName={city?.name ?? province?.name}
        total={result.total}
        iranOnly
      />
    </>
  );
}
