import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import {
  ArrowLeft2,
  Clock,
  DocumentText,
  Eye,
  Home2,
  Location,
  Map1,
  TickCircle,
  Warning2,
} from "iconsax-react";
import PropertyGallery from "@/components/properties/PropertyGallery";
import PropertySpecs from "@/components/properties/PropertySpecs";
import PropertyContact from "@/components/properties/PropertyContact";
import ListingCard from "@/components/listings/ListingCard";
import MapPanel from "@/components/listings/map/MapPanel";
import { getListingByCode, getRentListings } from "@/lib/listings/service";
import { parseListingSearchParams } from "@/lib/listings/query";
import { formatDateFa, formatRelativeTime } from "@/lib/listings/format";
import { toFaDigits } from "@/lib/auth";

export const metadata = {
  title: "جزئیات آگهی | سقفینو",
  description:
    "مشخصات کامل ملک، تصاویر، امکانات، موقعیت روی نقشه و شمارهٔ تماس دفتر املاک.",
};

export default function PropertyPage({ params }) {
  return (
    <div className="pb-16">
      <div className="border-b border-gray-3 bg-gray-1/70">
        <div className="mx-auto w-[calc(100%-1.5rem)] max-w-[1224px] py-3 lg:w-[80%]">
          <nav
            aria-label="مسیر صفحه"
            className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray-7"
          >
            <Link
              href="/"
              className="flex items-center gap-1 transition-colors hover:text-primary"
            >
              <Home2 size="13" color="currentColor" />
              خانه
            </Link>
            <ArrowLeft2 size="11" color="currentColor" className="text-gray-5" />
            <Link href="/rent" className="transition-colors hover:text-primary">
              اجارهٔ مسکن
            </Link>
            <ArrowLeft2 size="11" color="currentColor" className="text-gray-5" />
            <span className="text-gray-10">جزئیات آگهی</span>
          </nav>
        </div>
      </div>

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
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-md bg-primary-tint-1 px-2 py-1 text-[10px] font-medium text-primary">
              {property.propertyTypeLabel}
            </span>
            <span className="rounded-md bg-gray-1 px-2 py-1 text-[10px] text-gray-9">
              رهن و اجاره
            </span>
            {property.isVerified && (
              <span className="flex items-center gap-1 rounded-md bg-success-light-2 px-2 py-1 text-[10px] text-success">
                <TickCircle size="12" variant="Bold" color="currentColor" />
                تاییدشده
              </span>
            )}
            {property.isFeatured && (
              <span className="rounded-md bg-warning-light-2 px-2 py-1 text-[10px] text-warning">
                آگهی ویژه
              </span>
            )}
          </div>

          <h1 className="mt-2.5 text-h6 leading-[1.6] text-gray-13 sm:text-h5 lg:text-h4">
            {property.title}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-8">
            <span className="flex items-center gap-1">
              <Location
                size="14"
                variant="Bold"
                color="currentColor"
                className="text-primary"
              />
              {property.address}
            </span>
            <span className="flex items-center gap-1">
              <Clock size="13" color="currentColor" />
              {formatRelativeTime(property.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Eye size="13" color="currentColor" />
              {toFaDigits(property.viewsCount ?? 0)} بازدید
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-1.5 text-[10px]">
          <span className="rounded-lg border border-gray-4 bg-white px-2.5 py-1.5 text-gray-8">
            کد آگهی: <span className="font-semibold text-gray-11" dir="ltr">{property.code}</span>
          </span>
          <span className="rounded-lg border border-gray-4 bg-white px-2.5 py-1.5 text-gray-8">
            انتشار: {formatDateFa(property.createdAt)}
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start">
        <div className="space-y-4 lg:col-span-8">
          <PropertyGallery
            images={property.images}
            title={property.title}
            isVerified={property.isVerified}
            isFeatured={property.isFeatured}
          />

          <PropertySpecs property={property} />

          <section className="rounded-2xl border border-gray-4 bg-white p-4 shadow-[0_4px_24px_rgba(12,12,12,0.03)] sm:p-5">
            <h2 className="flex items-center gap-1.5 text-body-xxs font-bold text-gray-12 sm:text-body-s">
              <DocumentText size="17" color="currentColor" className="text-gray-8" />
              توضیحات آگهی
            </h2>
            <p className="mt-2.5 whitespace-pre-line text-caption-md leading-7 text-gray-9">
              {property.description}
            </p>
          </section>

          <section className="rounded-2xl border border-gray-4 bg-white p-4 shadow-[0_4px_24px_rgba(12,12,12,0.03)] sm:p-5">
            <h2 className="text-body-xxs font-bold text-gray-12 sm:text-body-s">
              امکانات و ویژگی‌ها
            </h2>
            {property.features?.length ? (
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {property.features.map((feature) => (
                  <li
                    key={feature}
                    className="inline-flex items-center gap-1 rounded-full border border-gray-3 bg-gray-1 px-3 py-1.5 text-[11px] text-gray-10"
                  >
                    <TickCircle
                      size="13"
                      variant="Bold"
                      color="#00966d"
                      className="shrink-0"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-caption-md text-gray-7">
                برای این ملک امکانات خاصی ثبت نشده است.
              </p>
            )}
          </section>

          <section className="overflow-hidden rounded-2xl border border-gray-4 bg-white shadow-[0_4px_24px_rgba(12,12,12,0.03)]">
            <div className="flex flex-wrap items-center justify-between gap-2 p-4 sm:p-5">
              <div>
                <h2 className="flex items-center gap-1.5 text-body-xxs font-bold text-gray-12 sm:text-body-s">
                  <Map1 size="17" color="currentColor" className="text-primary" />
                  موقعیت ملک روی نقشه
                </h2>
                <p className="mt-1 text-[10px] text-gray-7">
                  {property.neighborhood}، {property.cityName}
                </p>
              </div>
              <span className="rounded-lg bg-gray-1 px-2.5 py-1 text-[10px] text-gray-8">
                {property.provinceName}
              </span>
            </div>
            <div className="h-[320px] border-t border-gray-3">
              <MapPanel
                points={hasLocation ? [mapPoint] : []}
                center={mapCenter}
                cityName={property.cityName}
                total={hasLocation ? 1 : 0}
              />
            </div>
          </section>
        </div>

        <aside className="space-y-3 lg:col-span-4">
          <section className="overflow-hidden rounded-2xl border border-gray-4 bg-white shadow-[0_4px_24px_rgba(12,12,12,0.03)]">
            <div className="bg-gradient-to-l from-primary-tint-1 to-white p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-gray-8">اجارهٔ ماهانه</span>
                <span className="rounded-full bg-white px-2 py-1 text-[9px] text-primary shadow-sm">
                  قیمت روز
                </span>
              </div>
              <p className="mt-1 text-body-s font-bold text-primary sm:text-h6">
                {property.rentLabel}
              </p>
            </div>

            <div className="grid grid-cols-2 divide-x divide-x-reverse divide-gray-3 border-t border-gray-3 text-center">
              <div className="p-3">
                <span className="block text-[10px] text-gray-7">رهن</span>
                <span className="mt-0.5 block text-[11px] font-bold text-gray-11">
                  {property.depositLabel}
                </span>
              </div>
              <div className="p-3">
                <span className="block text-[10px] text-gray-7">اجاره</span>
                <span className="mt-0.5 block text-[11px] font-bold text-gray-11">
                  {property.rentLabel}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1 border-t border-gray-3 bg-gray-1/60 px-3 py-2 text-[9px] text-gray-7">
              <Warning2 size="12" color="currentColor" />
              مبلغ نهایی پس از بازدید و توافق با مالک مشخص می‌شود.
            </div>
          </section>

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
      <div className="listings-shimmer h-4 w-32 rounded-full" />
      <div className="listings-shimmer mt-3 h-8 w-3/4 max-w-xl rounded-xl" />
      <div className="listings-shimmer mt-2 h-3.5 w-1/2 rounded-md" />

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          <div className="listings-shimmer aspect-[16/10] w-full rounded-2xl" />
          <div className="listings-shimmer h-44 w-full rounded-2xl" />
          <div className="listings-shimmer h-36 w-full rounded-2xl" />
        </div>
        <div className="space-y-3 lg:col-span-4">
          <div className="listings-shimmer h-44 w-full rounded-2xl" />
          <div className="listings-shimmer h-64 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
