import {
  Building,
  Calendar,
  Category,
  Clock,
  DocumentText,
  Drop,
  Home2,
  Layer,
  Location,
  Ruler,
  Wallet,
} from "iconsax-react";
import {
  formatDateFa,
  formatPrice,
  formatPriceCompact,
} from "@/lib/listings/format";
import { toEnglishDigits, toFaDigits } from "@/lib/auth";
import PropertySummary from "./PropertySummary";

/** سال شمسی جاری برای محاسبهٔ سن بنا */
function getCurrentPersianYear() {
  const formatted = new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
  }).format(new Date());
  const digits = toEnglishDigits(formatted).replace(/[^\d]/g, "");
  return Number(digits) || 0;
}

/**
 * مشخصات سریع و جزئیات کامل ملک.
 * شامل متراژ، اتاق‌ها، طبقه، سن بنا، شرایط معامله، اطلاعات آگهی و موقعیت.
 */
export default function PropertySpecs({ property }) {
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

  const initialPayment =
    (Number(property.deposit) || 0) + (Number(property.rent) || 0);
  const depositPerMeter =
    property.area > 0 && property.deposit > 0
      ? Math.round(property.deposit / property.area)
      : null;
  const rentPerMeter =
    property.area > 0 && property.rent > 0
      ? Math.round(property.rent / property.area)
      : null;
  const imagesCount = property.images?.length ?? 0;

  const quickFacts = [
    {
      icon: Ruler,
      label: "متراژ",
      value: `${toFaDigits(property.area)} متر`,
    },
    {
      icon: Home2,
      label: "اتاق خواب",
      value: property.rooms > 0 ? toFaDigits(property.rooms) : "بدون اتاق",
    },
    {
      icon: Drop,
      label: "سرویس بهداشتی",
      value: toFaDigits(property.bathrooms || 1),
    },
    {
      icon: Layer,
      label: "طبقه",
      value: floorLabel,
    },
    {
      icon: Building,
      label: "تعداد طبقات",
      value: toFaDigits(totalFloors),
    },
    {
      icon: Calendar,
      label: "سال ساخت",
      value: property.buildYear ? toFaDigits(property.buildYear) : "—",
    },
    {
      icon: Clock,
      label: "سن بنا",
      value: ageLabel,
    },
    {
      icon: Category,
      label: "نوع ملک",
      value: property.propertyTypeLabel,
    },
  ];

  const detailGroups = [
    {
      title: "شرایط معامله",
      icon: Wallet,
      rows: [
        { label: "نوع معامله", value: "رهن و اجاره" },
        { label: "رهن", value: property.depositLabel },
        { label: "اجارهٔ ماهانه", value: property.rentLabel },
        {
          label: "مبلغ اولیه",
          value: formatPrice(initialPayment),
          hint: "رهن + اجارهٔ یک ماه",
        },
        {
          label: "رهن هر متر",
          value: depositPerMeter
            ? `${formatPriceCompact(depositPerMeter)} تومان`
            : "—",
        },
        {
          label: "اجارهٔ هر متر",
          value: rentPerMeter
            ? `${formatPriceCompact(rentPerMeter)} تومان`
            : "—",
        },
      ],
    },
    {
      title: "اطلاعات آگهی",
      icon: DocumentText,
      rows: [
        { label: "کد آگهی", value: property.code, ltr: true },
        {
          label: "تاریخ انتشار",
          value: formatDateFa(property.createdAt) || "—",
        },
        {
          label: "آخرین بروزرسانی",
          value:
            formatDateFa(property.updatedAt ?? property.createdAt) || "—",
        },
        { label: "تعداد تصاویر", value: `${toFaDigits(imagesCount)} عکس` },
        { label: "بازدید", value: toFaDigits(property.viewsCount ?? 0) },
        {
          label: "وضعیت",
          value: property.isVerified ? "تاییدشده" : "فعال",
        },
      ],
    },
    {
      title: "موقعیت ملک",
      icon: Location,
      full: true,
      rows: [
        { label: "استان", value: property.provinceName },
        { label: "شهر", value: property.cityName },
        { label: "محله", value: property.neighborhood },
        { label: "آدرس", value: property.address, block: true },
      ],
    },
  ];

  return (
    <section className="rounded-2xl border border-gray-4 bg-white p-4 shadow-[0_4px_24px_rgba(12,12,12,0.03)] sm:p-5">
      <PropertySummary property={property} />

      <div className="my-4 border-t border-gray-3" />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="flex items-center gap-1.5 text-body-xxs font-bold text-gray-12 sm:text-body-s">
            <DocumentText
              size="17"
              color="currentColor"
              className="text-gray-8"
            />
            مشخصات و جزئیات ملک
          </h2>
          <p className="mt-1 text-[10px] text-gray-7">
            همهٔ جزئیات ثبت‌شده برای این آگهی
          </p>
        </div>
        <span className="rounded-full bg-primary-tint-1 px-2.5 py-1 text-[9px] text-primary">
          جزئیات کامل
        </span>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {quickFacts.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="rounded-xl border border-gray-3 bg-gray-1/70 p-2.5"
          >
            <dt className="flex items-center gap-1 text-[10px] text-gray-7">
              <Icon size="13" color="currentColor" className="text-gray-8" />
              {label}
            </dt>
            <dd className="mt-1 text-[11px] font-semibold text-gray-12 sm:text-body-xxs">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {detailGroups.map(({ title, icon: Icon, rows, full }) => (
          <div
            key={title}
            className={`rounded-xl border border-gray-3 bg-gray-1/40 p-3 ${
              full ? "lg:col-span-2" : ""
            }`}
          >
            <h3 className="flex items-center gap-1.5 text-[11px] font-bold text-gray-11">
              <Icon size="14" color="currentColor" className="text-gray-8" />
              {title}
            </h3>

            <dl
              className={
                full
                  ? "mt-2 grid grid-cols-1 gap-x-5 sm:grid-cols-2"
                  : "mt-2 divide-y divide-gray-3/80"
              }
            >
              {rows.map((row) => (
                <div
                  key={row.label}
                  className={`${
                    row.block
                      ? "flex flex-col items-start gap-1"
                      : "flex items-start justify-between gap-3"
                  } py-2 ${full && row.block ? "sm:col-span-2" : ""}`}
                >
                  <dt className="min-w-0">
                    <span className="block text-[10px] text-gray-7">
                      {row.label}
                    </span>
                    {row.hint && (
                      <span className="mt-0.5 block text-[9px] text-gray-6">
                        {row.hint}
                      </span>
                    )}
                  </dt>
                  <dd
                    dir={row.ltr ? "ltr" : undefined}
                    className={`min-w-0 text-[11px] font-semibold leading-5 text-gray-11 ${
                      row.block
                        ? "w-full text-right"
                        : "shrink-0 text-left"
                    }`}
                  >
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}
