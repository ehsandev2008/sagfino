import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { ArrowLeft2 } from "iconsax-react";
import PropertyGallery from "@/components/properties/PropertyGallery";
import PropertyDetails from "@/components/properties/PropertyDetails";
import PropertyContact from "@/components/properties/PropertyContact";
import ListingCard from "@/components/listings/ListingCard";
import { getListingByCode, getRentListings } from "@/lib/listings/service";
import { parseListingSearchParams } from "@/lib/listings/query";

export const metadata = {
  title: "جزئیات آگهی | سقفینو",
  description:
    "مشخصات کامل ملک، تصاویر، امکانات، موقعیت روی نقشه و شمارهٔ تماس دفتر املاک.",
};

export default function PropertyPage({ params }) {
  return (
    <div className="pb-16">
      <Suspense fallback={<PropertySkeleton />}>
        <PropertyContent params={params} />
      </Suspense>
    </div>
  );
}

async function PropertyContent({ params }) {
  // جزئیات آگهی و آگهی‌های مشابه در هر درخواست از دیتابیس خوانده می‌شوند.
  await connection();

  const { id } = await params;
  const property = await getListingByCode(decodeURIComponent(id));

  if (!property) notFound();

  const similarFilters = parseListingSearchParams({
    city: property.cityId ? String(property.cityId) : "",
    page: "1",
  });

  const similarResult = await getRentListings({
    ...similarFilters,
    pageSize: 4,
  });

  const similarListings = similarResult.items
    .filter((item) => item.code !== property.code)
    .slice(0, 3);

  const hasLocation =
    Number.isFinite(property.lat) && Number.isFinite(property.lng);

  const mapPoint = {
    id: property.code,
    code: property.code,
    lat: property.lat,
    lng: property.lng,
    title: property.title,
    cover: property.cover,
    rent: property.rent,
    deposit: property.deposit,
    rentLabel: property.rentLabel,
    depositLabel: property.depositLabel,
    area: property.area,
    rooms: property.rooms,
    cityName: property.cityName,
    neighborhood: property.neighborhood,
    propertyTypeLabel: property.propertyTypeLabel,
    isFeatured: property.isFeatured,
    href: property.href,
  };

  const mapCenter = hasLocation
    ? { lat: property.lat, lng: property.lng, zoom: 15 }
    : { lat: 32.4279, lng: 53.688, zoom: 5 };

  return (
    <div className="mx-auto w-[calc(100%-1.5rem)] max-w-[1224px] py-4 lg:w-[80%] lg:py-6">
      <PropertyGallery
        key={property.code}
        images={property.images}
        title={property.title}
      />

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-5 lg:items-start">
        <div className="min-w-0 lg:col-span-3">
          <PropertyDetails
            property={property}
            mapPoint={mapPoint}
            mapCenter={mapCenter}
            hasLocation={hasLocation}
          />
        </div>

        <aside className="lg:sticky lg:top-4 lg:col-span-2">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h2 className="text-body-xxs font-bold text-gray-12">
              اطلاعات انتشاردهنده
            </h2>
            <span className="text-[10px] text-gray-7">دفتر املاک</span>
          </div>
          <PropertyContact agency={property.agency} code={property.code} />
        </aside>
      </div>

      {similarListings.length > 0 && (
        <section className="mt-7">
          <div className="mb-3 flex items-end justify-between gap-2">
            <div>
              <h2 className="text-body-xs font-bold text-gray-12 sm:text-body-s">
                آگهی‌های مشابه در {property.cityName}
              </h2>
              <p className="mt-1 text-[10px] text-gray-7">
                گزینه‌های دیگری که ممکن است به کارتان بیاید
              </p>
            </div>
            <Link
              href={`/rent?city=${property.cityId}`}
              className="nav-link flex shrink-0 items-center gap-1 text-[11px] text-gray-9 transition-colors hover:text-primary"
            >
              مشاهده همه
              <ArrowLeft2 size="14" color="currentColor" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {similarListings.map((item) => (
              <ListingCard key={item.id} property={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function PropertySkeleton() {
  return (
    <div
      className="mx-auto w-[calc(100%-1.5rem)] max-w-[1224px] py-4 lg:w-[80%] lg:py-6"
      aria-busy="true"
      aria-label="در حال بارگذاری آگهی"
    >
      <div className="listings-shimmer h-[clamp(240px,36vw,500px)] w-full rounded-2xl" />

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="listings-shimmer h-[760px] w-full rounded-2xl" />
        </div>
        <div className="space-y-3 lg:col-span-2">
          <div className="listings-shimmer h-5 w-40 rounded-md" />
          <div className="listings-shimmer h-80 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
