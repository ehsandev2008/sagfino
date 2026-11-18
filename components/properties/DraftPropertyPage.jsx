"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft2, SearchStatus } from "iconsax-react";
import PropertyGallery from "./PropertyGallery";
import PropertyDetails from "./PropertyDetails";
import PropertyContact from "./PropertyContact";
import { getListingDraft } from "@/lib/listings/drafts";
import { formatPrice } from "@/lib/listings/format";

/**
 * نمایش آگهی تازه‌ثبت‌شده‌ای که در IndexedDB مرورگر ذخیره شده است.
 * این صفحه بعد از ثبت نهایی `/new-ad` باز می‌شود و همان چیدمان
 * صفحهٔ جزئیات آگهی را با داده‌های فرم نمایش می‌دهد.
 */
export default function DraftPropertyPage({ code }) {
  const [state, setState] = useState({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    let createdUrls = [];

    getListingDraft(code)
      .then((result) => {
        if (!result) {
          if (!cancelled) setState({ status: "missing" });
          return;
        }

        createdUrls = [
          ...result.images.map((image) => image.url),
          result.video?.url,
        ].filter(Boolean);

        if (cancelled) {
          createdUrls.forEach((url) => URL.revokeObjectURL(url));
          return;
        }

        setState({
          status: "ready",
          draft: result.draft,
          images: result.images,
          video: result.video,
        });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "missing" });
      });

    return () => {
      cancelled = true;
      createdUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [code]);

  if (state.status === "loading") return <DraftSkeleton />;
  if (state.status === "missing") return <DraftMissing />;

  const { draft, images, video } = state;
  const property = { ...draft, videoUrl: video?.url ?? null };
  const hasLocation =
    Number.isFinite(property.lat) && Number.isFinite(property.lng);

  const mapPoint = {
    id: property.code,
    code: property.code,
    lat: property.lat,
    lng: property.lng,
    title: property.title,
    cover: images[0]?.url ?? null,
    dealType: property.dealType,
    price: property.price,
    rent: property.rent,
    deposit: property.deposit,
    priceLabel: formatPrice(property.price),
    rentLabel: formatPrice(property.rent),
    depositLabel: formatPrice(property.deposit),
    area: property.area,
    rooms: property.rooms,
    cityName: property.cityName,
    neighborhood: property.neighborhood,
    propertyTypeLabel: property.propertyTypeLabel,
    isFeatured: false,
    href: `/properties/${property.code}`,
  };

  const mapCenter = hasLocation
    ? { lat: property.lat, lng: property.lng, zoom: 15 }
    : { lat: 32.4279, lng: 53.688, zoom: 5 };

  return (
    <div className="mx-auto w-[calc(100%-1.5rem)] max-w-[1224px] py-4 lg:w-[80%] lg:py-6">
      <PropertyGallery
        key={property.code}
        images={images.map((image) => image.url)}
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

        <aside className="min-w-0 lg:sticky lg:top-28 lg:col-span-2 lg:self-start">
          <h2 className="sr-only">اطلاعات انتشاردهنده</h2>
          <PropertyContact agency={property.agency} code={property.code} />
        </aside>
      </div>
    </div>
  );
}

function DraftSkeleton() {
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

function DraftMissing() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-[calc(100%-1.5rem)] max-w-[560px] flex-col items-center justify-center py-16 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-full bg-gray-1 text-gray-8">
        <SearchStatus size="40" color="currentColor" />
      </span>
      <h1 className="mt-5 text-xl font-bold text-gray-13">
        آگهی مورد نظر پیدا نشد
      </h1>
      <p className="mt-2 text-base leading-8 text-gray-9">
        این آگهی در حافظهٔ مرورگر شما ذخیره نشده یا حذف شده است.
      </p>
      <Link
        href="/new-ad"
        className="mt-6 flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-medium text-white transition-colors hover:bg-primary-shade-1"
      >
        ثبت آگهی جدید
        <ArrowLeft2 size="18" color="currentColor" />
      </Link>
    </div>
  );
}
