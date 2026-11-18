"use client";

import CustomDropdown from "./CustomDropdown";
import FormInput from "./FormInput";

const ROOM_OPTIONS = [
  { value: "0", label: "بدون اتاق" },
  { value: "1", label: "۱ اتاق" },
  { value: "2", label: "۲ اتاق" },
  { value: "3", label: "۳ اتاق" },
  { value: "4", label: "۴ اتاق" },
  { value: "5+", label: "۵ اتاق و بیشتر" },
];

const FLOOR_OPTIONS = [
  { value: "basement", label: "زیرزمین" },
  { value: "ground", label: "همکف" },
  { value: "1", label: "طبقه ۱" },
  { value: "2", label: "طبقه ۲" },
  { value: "3", label: "طبقه ۳" },
  { value: "4", label: "طبقه ۴" },
  { value: "5", label: "طبقه ۵" },
  { value: "6+", label: "طبقه ۶ و بالاتر" },
];

const COUNT_OPTIONS = [
  { value: "0", label: "ندارد" },
  { value: "1", label: "۱" },
  { value: "2", label: "۲" },
  { value: "3+", label: "۳ و بیشتر" },
];

const BATHROOM_OPTIONS = [
  { value: "1", label: "۱" },
  { value: "2", label: "۲" },
  { value: "3", label: "۳" },
  { value: "4+", label: "۴ و بیشتر" },
];

const UNIT_COUNT_OPTIONS = [
  { value: "1", label: "۱ واحد" },
  { value: "2", label: "۲ واحد" },
  { value: "3", label: "۳ واحد" },
  { value: "4+", label: "۴ واحد و بیشتر" },
];

const BATHROOM_TYPE_OPTIONS = [
  { value: "فرنگی", label: "فرنگی" },
  { value: "ایرانی", label: "ایرانی" },
  { value: "فرنگی و ایرانی", label: "فرنگی و ایرانی" },
];

const COOLING_OPTIONS = [
  { value: "چیلر", label: "چیلر" },
  { value: "کولر گازی", label: "کولر گازی" },
  { value: "اسپلیت", label: "اسپلیت" },
  { value: "فن‌کوئل", label: "فن‌کوئل" },
  { value: "ندارد", label: "ندارد" },
];

const HEATING_OPTIONS = [
  { value: "پکیج", label: "پکیج" },
  { value: "شوفاژ", label: "شوفاژ" },
  { value: "بخاری", label: "بخاری" },
  { value: "رادیاتور", label: "رادیاتور" },
  { value: "ندارد", label: "ندارد" },
];

const FLOOR_MATERIAL_OPTIONS = [
  { value: "سرامیک", label: "سرامیک" },
  { value: "پارکت", label: "پارکت" },
  { value: "سنگ", label: "سنگ" },
  { value: "موزاییک", label: "موزاییک" },
];

const DOCUMENT_OPTIONS = [
  { value: "سند تک‌برگ", label: "سند تک‌برگ" },
  { value: "قولنامه‌ای", label: "قولنامه‌ای" },
  { value: "تعاونی", label: "تعاونی" },
  { value: "وقفی", label: "وقفی" },
  { value: "سایر", label: "سایر" },
];

const DIRECTION_OPTIONS = [
  { value: "شمالی", label: "شمالی" },
  { value: "جنوبی", label: "جنوبی" },
  { value: "شرقی", label: "شرقی" },
  { value: "غربی", label: "غربی" },
  { value: "دو نبش شمالی جنوبی", label: "دو نبش شمالی جنوبی" },
  { value: "دو نبش شرقی غربی", label: "دو نبش شرقی غربی" },
];

const RECREATIONAL_OPTIONS = [
  "استخر",
  "سونا",
  "جکوزی",
  "سالن ورزش",
  "روف‌گاردن",
  "اتاق بازی",
];

const EXTRA_OPTIONS = [
  "کمد دیواری",
  "پنجره UPVC",
  "درب ضدسرقت",
  "آیفون تصویری",
  "پارکت",
  "تراس",
];

function toggleItem(list, item) {
  return list.includes(item)
    ? list.filter((value) => value !== item)
    : [...list, item];
}

/**
 * مرحله ۳: مشخصات فیزیکی ملک + امکانات تکمیلی
 */
export default function Step3Details({ data, onChange, errors }) {
  const recreationalAmenities = data.recreationalAmenities ?? [];
  const extraAmenities = data.extraAmenities ?? [];

  return (
    <div className="flex flex-col">
      <h2 className="text-right text-h4 font-bold text-black lg:text-[30px]">
        مشخصات ملک را وارد کنید
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-8 lg:gap-5">
        <div className="sm:col-span-2">
          <FormInput
            size="lg"
            label="عنوان آگهی"
            placeholder="مثلاً آپارتمان ۱۲۰ متری در زعفرانیه"
            value={data.title || ""}
            onChange={(e) => onChange({ title: e.target.value })}
            error={errors?.title}
          />
        </div>
        <FormInput
          size="lg"
          label="محله"
          placeholder="نام محله"
          value={data.neighborhood || ""}
          onChange={(e) => onChange({ neighborhood: e.target.value })}
          error={errors?.neighborhood}
        />
        <FormInput
          size="lg"
          label="متراژ"
          placeholder="متراژ ملک"
          type="text"
          inputMode="numeric"
          value={data.area || ""}
          onChange={(e) =>
            onChange({ area: e.target.value.replace(/\D/g, "") })
          }
          suffix="متر مربع"
          error={errors?.area}
        />
        <CustomDropdown
          size="lg"
          label="اتاق"
          placeholder="تعداد اتاق"
          options={ROOM_OPTIONS}
          value={data.rooms}
          onChange={(v) => onChange({ rooms: v })}
          error={errors?.rooms}
        />
        <CustomDropdown
          size="lg"
          label="طبقه"
          placeholder="طبقه ملک"
          options={FLOOR_OPTIONS}
          value={data.floor}
          onChange={(v) => onChange({ floor: v })}
          error={errors?.floor}
        />
        <FormInput
          size="lg"
          label="تعداد کل طبقات"
          placeholder="تعداد طبقات ساختمان"
          type="text"
          inputMode="numeric"
          value={data.totalFloors || ""}
          onChange={(e) =>
            onChange({ totalFloors: e.target.value.replace(/\D/g, "") })
          }
          suffix="طبقه"
          error={errors?.totalFloors}
        />
        <FormInput
          size="lg"
          label="سن بنا"
          placeholder="سال ساخت بنا"
          type="text"
          inputMode="numeric"
          value={data.buildingAge || ""}
          onChange={(e) =>
            onChange({ buildingAge: e.target.value.replace(/\D/g, "") })
          }
          suffix="سال"
          error={errors?.buildingAge}
        />
        <CustomDropdown
          size="lg"
          label="تعداد واحد"
          placeholder="تعداد واحدهای ساختمان"
          options={UNIT_COUNT_OPTIONS}
          value={data.unitCount}
          onChange={(v) => onChange({ unitCount: v })}
          error={errors?.unitCount}
        />
        <CustomDropdown
          size="lg"
          label="تعداد سرویس بهداشتی"
          placeholder="تعداد سرویس بهداشتی"
          options={BATHROOM_OPTIONS}
          value={data.bathrooms}
          onChange={(v) => onChange({ bathrooms: v })}
          error={errors?.bathrooms}
        />
      </div>

      <div className="mt-8 border-t border-gray-3 pt-6 lg:mt-10 lg:pt-8">
        <h3 className="mb-5 text-body-xs font-bold text-gray-11 lg:text-body-s">
          امکانات ملک
        </h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6">
          <CustomDropdown
            size="lg"
            label="پارکینگ"
            placeholder="وضعیت پارکینگ"
            options={COUNT_OPTIONS}
            value={data.parking}
            onChange={(v) => onChange({ parking: v })}
            error={errors?.parking}
          />
          <CustomDropdown
            size="lg"
            label="انباری"
            placeholder="وضعیت انباری"
            options={COUNT_OPTIONS}
            value={data.storage}
            onChange={(v) => onChange({ storage: v })}
            error={errors?.storage}
          />
          <CustomDropdown
            size="lg"
            label="آسانسور"
            placeholder="تعداد آسانسور"
            options={COUNT_OPTIONS}
            value={data.elevator}
            onChange={(v) => onChange({ elevator: v })}
            error={errors?.elevator}
          />
          <CustomDropdown
            size="lg"
            label="نوع سرویس بهداشتی"
            placeholder="نوع سرویس بهداشتی"
            options={BATHROOM_TYPE_OPTIONS}
            value={data.bathroomType}
            onChange={(v) => onChange({ bathroomType: v })}
            error={errors?.bathroomType}
          />
          <CustomDropdown
            size="lg"
            label="سیستم سرمایش"
            placeholder="سیستم سرمایش"
            options={COOLING_OPTIONS}
            value={data.coolingSystem}
            onChange={(v) => onChange({ coolingSystem: v })}
            error={errors?.coolingSystem}
          />
          <CustomDropdown
            size="lg"
            label="سیستم گرمایش"
            placeholder="سیستم گرمایش"
            options={HEATING_OPTIONS}
            value={data.heatingSystem}
            onChange={(v) => onChange({ heatingSystem: v })}
            error={errors?.heatingSystem}
          />
          <CustomDropdown
            size="lg"
            label="جنس کف"
            placeholder="جنس کف ملک"
            options={FLOOR_MATERIAL_OPTIONS}
            value={data.floorMaterial}
            onChange={(v) => onChange({ floorMaterial: v })}
            error={errors?.floorMaterial}
          />
          <CustomDropdown
            size="lg"
            label="نوع سند"
            placeholder="نوع سند ملک"
            options={DOCUMENT_OPTIONS}
            value={data.documentType}
            onChange={(v) => onChange({ documentType: v })}
            error={errors?.documentType}
          />
          <CustomDropdown
            size="lg"
            label="جهت ساختمان"
            placeholder="جهت ساختمان"
            options={DIRECTION_OPTIONS}
            value={data.direction}
            onChange={(v) => onChange({ direction: v })}
            error={errors?.direction}
          />
        </div>
      </div>

      <div className="mt-8 border-t border-gray-3 pt-6 lg:mt-10 lg:pt-8">
        <h3 className="mb-4 text-body-xs font-bold text-gray-11 lg:text-body-s">
          امکانات تفریحی
        </h3>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {RECREATIONAL_OPTIONS.map((option) => {
            const checked = recreationalAmenities.includes(option);

            return (
              <label
                key={option}
                className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-body-xxs transition-colors ${
                  checked
                    ? "border-primary/40 bg-primary-tint-1 text-gray-12"
                    : "border-gray-4 bg-white text-gray-9 hover:border-gray-6"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    onChange({
                      recreationalAmenities: toggleItem(
                        recreationalAmenities,
                        option
                      ),
                    })
                  }
                  className="h-4 w-4 shrink-0 accent-primary"
                />
                {option}
              </label>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-4 text-body-xs font-bold text-gray-11 lg:text-body-s">
          سایر امکانات
        </h3>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {EXTRA_OPTIONS.map((option) => {
            const checked = extraAmenities.includes(option);

            return (
              <label
                key={option}
                className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-body-xxs transition-colors ${
                  checked
                    ? "border-primary/40 bg-primary-tint-1 text-gray-12"
                    : "border-gray-4 bg-white text-gray-9 hover:border-gray-6"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    onChange({
                      extraAmenities: toggleItem(extraAmenities, option),
                    })
                  }
                  className="h-4 w-4 shrink-0 accent-primary"
                />
                {option}
              </label>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormInput
          size="lg"
          label="زمان بازدید"
          placeholder="مثلاً ۹ صبح تا ۹ شب"
          value={data.viewingHours || ""}
          onChange={(e) => onChange({ viewingHours: e.target.value })}
          error={errors?.viewingHours}
        />
      </div>
    </div>
  );
}
