import {
  Box,
  Building,
  Car,
  Clock,
  Drop,
  Eye,
  Gallery,
  Game,
  Home2,
  Judge,
  Layer,
  Location,
  Map1,
  NoteText,
  Ruler,
  Sun1,
  TickCircle,
  Wind2,
} from "iconsax-react";
import MapPanel from "@/components/listings/map/MapPanel";
import {
  formatDateFa,
  formatPrice,
  formatRelativeTime,
} from "@/lib/listings/format";
import { toEnglishDigits, toFaDigits } from "@/lib/auth";
import {
  PropertyFeedback,
  PropertyHeaderActions,
  PropertyReportButton,
} from "./PropertyActions";

/** سال شمسی جاری برای محاسبهٔ سن بنا */
function getCurrentPersianYear() {
  const formatted = new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
  }).format(new Date());
  const digits = toEnglishDigits(formatted).replace(/[^\d]/g, "");
  return Number(digits) || 0;
}

function SectionTitle({ icon: Icon, title }) {
  return (
    <h2 className="flex items-center gap-1.5 text-body-xxs font-bold text-gray-12">
      <Icon size="16" color="currentColor" className="text-gray-8" />
      {title}
    </h2>
  );
}

function SectionDivider() {
  return <div className="my-4 border-t border-gray-3 sm:my-5" />;
}

/**
 * جزئیات کامل آگهی بر اساس طرح فیگما:
 * سربرگ دسته‌بندی و شهر، گرید مشخصات، ودیعه و اجاره، امکانات،
 * توضیحات، موقعیت روی نقشه و نوار آمار و بازخورد.
 */
export default function PropertyDetails({
  property,
  mapPoint,
  mapCenter,
  hasLocation = false,
}) {
  const totalFloors = Number(property.totalFloors) || 1;
  const floor = Number(property.floor) || 0;
  const floorLabel =
    totalFloors > 1
      ? `${floor === 0 ? "همکف" : toFaDigits(floor)} از ${toFaDigits(
          totalFloors
        )}`
      : "همکف";

  const currentYear = getCurrentPersianYear();
  const age =
    property.buildYear && currentYear
      ? Math.max(0, currentYear - Number(property.buildYear))
      : null;
  const ageLabel =
    age === null ? "—" : age === 0 ? "نوساز" : `${toFaDigits(age)} سال`;

  const countLabel = (value) => {
    const count = Number(value) || 0;
    return count > 0 ? toFaDigits(count) : "ندارد";
  };

  const listLabel = (list) =>
    Array.isArray(list) && list.length ? list.join("، ") : "—";

  const quickFacts = [
    {
      icon: Ruler,
      label: "متراژ",
      value: `${toFaDigits(property.area)} متر`,
    },
    {
      icon: Home2,
      label: "اتاق",
      value:
        property.rooms > 0 ? `${toFaDigits(property.rooms)} خواب` : "بدون اتاق",
    },
    {
      icon: Layer,
      label: "طبقه",
      value: floorLabel,
    },
  ];

  const priceRows = [
    {
      label: "ودیعه",
      value: property.depositLabel ?? formatPrice(property.deposit),
    },
    {
      label: "اجاره ماهیانه",
      value: property.rentLabel ?? formatPrice(property.rent),
    },
  ];

  const amenities = [
    { icon: Car, label: "پارکینگ", value: countLabel(property.parkingCount) },
    {
      icon: Drop,
      label: "سرویس بهداشتی",
      value: toFaDigits(property.bathrooms || 1),
    },
    { icon: Box, label: "انباری", value: countLabel(property.storageCount) },
    {
      icon: Drop,
      label: "نوع سرویس بهداشتی",
      value: property.bathroomType ?? "—",
    },
    {
      icon: Building,
      label: "آسانسور",
      value: countLabel(property.elevatorsCount),
    },
    {
      icon: Wind2,
      label: "سیستم سرمایش",
      value: property.coolingSystem ?? "—",
    },
    {
      icon: Layer,
      label: "جنس کف",
      value: property.floorMaterial ?? "—",
    },
    {
      icon: Sun1,
      label: "سیستم گرمایش",
      value: property.heatingSystem ?? "—",
    },
  ];

  const descriptionRows = [
    { icon: Clock, label: "سن بنا", value: ageLabel },
    {
      icon: Location,
      label: "موقعیت جغرافیایی بنا",
      value: property.buildingOrientation ?? "—",
    },
    { icon: Judge, label: "نوع سند", value: property.deedType ?? "—" },
    {
      icon: Game,
      label: "امکانات تفریحی",
      value: listLabel(property.recreationalAmenities),
    },
    {
      icon: NoteText,
      label: "سایر امکانات",
      value: listLabel(property.extraAmenities),
    },
    {
      icon: Clock,
      label: "زمان بازدید",
      value: property.viewingHours ?? "هماهنگی با مشاور",
    },
  ];

  const imagesCount = property.images?.length ?? 0;
  const statusLabel = property.status === "expired" ? "منقضی شده" : "فعال";
  const statusClass =
    property.status === "expired" ? "text-error" : "text-success";

  return (
    <section
      aria-labelledby="property-details-title"
      className="overflow-hidden rounded-2xl border border-gray-4 bg-white shadow-[0_4px_24px_rgba(12,12,12,0.03)]"
    >
      {/* سربرگ: دسته‌بندی و شهر + اشتراک‌گذاری و نشان کردن */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-gray-7">
              <span>رهن و اجاره</span>
              <span className="h-1 w-1 rounded-full bg-gray-5" />
              <span>{property.propertyTypeLabel}</span>
              <span className="h-1 w-1 rounded-full bg-gray-5" />
              <span>{property.cityName}</span>
            </div>

            <h1
              id="property-details-title"
              className="mt-2 text-body-xxs font-bold leading-7 text-gray-13 sm:text-body-s"
            >
              {property.title}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {property.isVerified && (
                <span className="flex items-center gap-1 rounded-md bg-success-light-2 px-2 py-1 text-[9px] text-success">
                  <TickCircle size="12" variant="Bold" color="currentColor" />
                  تاییدشده
                </span>
              )}
              {property.isFeatured && (
                <span className="rounded-md bg-warning-light-2 px-2 py-1 text-[9px] text-warning">
                  آگهی ویژه
                </span>
              )}
              <span className="flex items-center gap-1 rounded-md bg-gray-1 px-2 py-1 text-[9px] text-gray-8">
                <Location size="11" color="currentColor" />
                {property.neighborhood}
              </span>
            </div>
          </div>

          <PropertyHeaderActions title={property.title} />
        </div>
      </div>

      {/* گرید مشخصات سریع */}
      <div className="grid grid-cols-3 gap-2 px-4 sm:px-5">
        {quickFacts.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="rounded-xl border border-gray-3 bg-gray-1/60 px-2 py-3 text-center"
          >
            <div className="flex items-center justify-center gap-1 text-[10px] text-gray-7">
              <Icon size="14" color="currentColor" className="text-gray-8" />
              {label}
            </div>
            <p className="mt-1 text-[11px] font-bold text-gray-12 sm:text-body-xxs">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* ودیعه و اجاره */}
      <div className="mt-2.5 space-y-1.5 px-4 sm:px-5">
        {priceRows.map(({ label, value }) => (
          <div
            key={label}
            className="flex items-center justify-between gap-3 rounded-xl border border-gray-3 bg-white px-3 py-2.5"
          >
            <span className="text-[10px] text-gray-7">{label}</span>
            <span className="text-[11px] font-bold text-gray-12">{value}</span>
          </div>
        ))}
      </div>

      {/* ساعت بازدید، کد ملک و گزارش تخلف */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 sm:px-5">
        <span className="flex items-center gap-1 text-[10px] text-gray-7">
          <Clock size="13" color="currentColor" />
          ساعت‌های بازدید:
          <span className="font-medium text-gray-11">
            {property.viewingHours ?? "هماهنگی با مشاور"}
          </span>
        </span>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-[10px] text-gray-7">
            کد ملک:{" "}
            <span className="font-semibold text-gray-11" dir="ltr">
              {property.code}
            </span>
          </span>
          <PropertyReportButton />
        </div>
      </div>

      <SectionDivider />

      {/* امکانات */}
      <div className="px-4 sm:px-5">
        <SectionTitle icon={Home2} title="امکانات" />
        <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
          {amenities.map(({ icon: Icon, label, value }) => (
            <li
              key={label}
              className="flex items-center gap-1.5 text-[11px] leading-6"
            >
              <Icon
                size="15"
                color="currentColor"
                className="shrink-0 text-gray-8"
              />
              <span className="text-gray-7">{label}:</span>
              <span className="font-medium text-gray-11">{value}</span>
            </li>
          ))}
        </ul>
      </div>

      <SectionDivider />

      {/* توضیحات */}
      <div className="px-4 sm:px-5">
        <SectionTitle icon={NoteText} title="توضیحات" />
        <p className="mt-2 whitespace-pre-line text-[11px] leading-6 text-gray-9">
          {property.description}
        </p>

        <dl className="mt-3 space-y-1.5">
          {descriptionRows.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex flex-wrap items-baseline gap-x-1.5 text-[11px] leading-6"
            >
              <dt className="flex items-center gap-1 text-gray-7">
                <Icon
                  size="13"
                  color="currentColor"
                  className="shrink-0 text-gray-8"
                />
                {label}:
              </dt>
              <dd className="text-gray-11">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <SectionDivider />

      {/* موقعیت */}
      <div className="px-4 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <SectionTitle icon={Map1} title="موقعیت" />
          <span className="flex items-center gap-1 text-[10px] text-gray-7">
            <Location
              size="12"
              variant="Bold"
              color="currentColor"
              className="text-primary"
            />
            {property.address}
          </span>
        </div>

        <div className="mt-3 h-[300px] overflow-hidden rounded-xl border border-gray-3">
          <MapPanel
            compact
            points={hasLocation ? [mapPoint] : []}
            center={mapCenter}
            cityName={property.cityName}
            total={hasLocation ? 1 : 0}
          />
        </div>
      </div>

      {/* نوار آمار و بازخورد */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-3 bg-gray-1/60 px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-gray-7">
          <span className="flex items-center gap-1">
            <Clock size="12" color="currentColor" />
            زمان ثبت آگهی:{" "}
            <span className="text-gray-10" title={formatDateFa(property.createdAt)}>
              {formatRelativeTime(property.createdAt)}
            </span>
          </span>
          <span className="h-3 w-px bg-gray-4" />
          <span className="flex items-center gap-1">
            <Eye size="12" color="currentColor" />
            تعداد مشاهده:{" "}
            <span className="text-gray-10">
              {toFaDigits(property.viewsCount ?? 0)}
            </span>
          </span>
          <span className="h-3 w-px bg-gray-4" />
          <span className="flex items-center gap-1">
            <Gallery size="12" color="currentColor" />
            تعداد تصاویر:{" "}
            <span className="text-gray-10">{toFaDigits(imagesCount)}</span>
          </span>
          <span className="h-3 w-px bg-gray-4" />
          <span>
            وضعیت: <span className={statusClass}>{statusLabel}</span>
          </span>
        </div>

        <PropertyFeedback />
      </div>
    </section>
  );
}
