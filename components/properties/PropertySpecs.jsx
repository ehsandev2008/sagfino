import {
  Building,
  Calendar,
  Drop,
  Home2,
  Layer,
  Ruler,
} from "iconsax-react";
import { toFaDigits } from "@/lib/auth";

/** جدول مشخصات اصلی ملک در صفحهٔ جزئیات */
export default function PropertySpecs({ property }) {
  const floorLabel =
    property.totalFloors > 1
      ? `${
          property.floor === 0 ? "همکف" : toFaDigits(property.floor)
        } از ${toFaDigits(property.totalFloors)}`
      : "همکف";

  const items = [
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
      icon: Calendar,
      label: "سال ساخت",
      value: property.buildYear ? toFaDigits(property.buildYear) : "—",
    },
    {
      icon: Building,
      label: "نوع ملک",
      value: property.propertyTypeLabel,
    },
  ];

  return (
    <section className="rounded-2xl border border-gray-4 bg-white p-4 shadow-[0_4px_24px_rgba(12,12,12,0.03)] sm:p-5">
      <h2 className="text-body-xxs font-bold text-gray-12 sm:text-body-s">
        مشخصات ملک
      </h2>

      <dl className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {items.map(({ icon: Icon, label, value }) => (
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
    </section>
  );
}
