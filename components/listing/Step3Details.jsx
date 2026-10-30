"use client";

import CustomDropdown from "./CustomDropdown";
import FormInput from "./FormInput";

const NEIGHBORHOOD_TYPES = [
  { value: "north", label: "منطقه شمال" },
  { value: "south", label: "منطقه جنوب" },
  { value: "east", label: "منطقه شرق" },
  { value: "west", label: "منطقه غرب" },
  { value: "center", label: "منطقه مرکزی" },
];

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

const PARKING_OPTIONS = [
  { value: "none", label: "ندارد" },
  { value: "1", label: "۱ واحد" },
  { value: "2", label: "۲ واحد" },
  { value: "3+", label: "۳ واحد و بیشتر" },
];

const ELEVATOR_OPTIONS = [
  { value: "none", label: "ندارد" },
  { value: "has", label: "دارد" },
];

const STORAGE_OPTIONS = [
  { value: "none", label: "ندارد" },
  { value: "has", label: "دارد" },
];

const DOCUMENT_OPTIONS = [
  { value: "deed", label: "سند تک‌برگ" },
  { value: "assignment", label: "قولنامه‌ای" },
  { value: "cooperative", label: "تعاونی" },
  { value: "endowment", label: "وقفی" },
  { value: "other", label: "سایر" },
];

const DIRECTION_OPTIONS = [
  { value: "north", label: "شمالی" },
  { value: "south", label: "جنوبی" },
  { value: "east", label: "شرقی" },
  { value: "west", label: "غربی" },
  { value: "north-south", label: "دو نبش شمالی جنوبی" },
  { value: "east-west", label: "دو نبش شرقی غربی" },
];

const UNIT_COUNT_OPTIONS = [
  { value: "1", label: "۱ واحد" },
  { value: "2", label: "۲ واحد" },
  { value: "3", label: "۳ واحد" },
  { value: "4+", label: "۴ واحد و بیشتر" },
];

/**
 * مرحله ۳: مشخصات فیزیکی ملک + امکانات تکمیلی
 */
export default function Step3Details({ data, onChange, errors }) {
  return (
    <div className="flex flex-col">
      <h2 className="text-right text-h4 font-bold text-black lg:text-[30px]">
        مشخصات ملک را وارد کنید
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-8 lg:gap-5">
        <CustomDropdown
          size="lg"
          label="نوع محله"
          placeholder="محله را انتخاب کنید"
          options={NEIGHBORHOOD_TYPES}
          value={data.neighborhood}
          onChange={(v) => onChange({ neighborhood: v })}
          error={errors?.neighborhood}
        />
        <FormInput
          size="lg"
          label="کوچه مستقل"
          placeholder="نام کوچه"
          value={data.alley || ""}
          onChange={(e) => onChange({ alley: e.target.value })}
          error={errors?.alley}
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
            options={PARKING_OPTIONS}
            value={data.parking}
            onChange={(v) => onChange({ parking: v })}
            error={errors?.parking}
          />
          <CustomDropdown
            size="lg"
            label="آسانسور"
            placeholder="وضعیت آسانسور"
            options={ELEVATOR_OPTIONS}
            value={data.elevator}
            onChange={(v) => onChange({ elevator: v })}
            error={errors?.elevator}
          />
          <CustomDropdown
            size="lg"
            label="انباری"
            placeholder="وضعیت انباری"
            options={STORAGE_OPTIONS}
            value={data.storage}
            onChange={(v) => onChange({ storage: v })}
            error={errors?.storage}
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
          <CustomDropdown
            size="lg"
            label="تعداد واحد"
            placeholder="تعداد واحدهای ساختمان"
            options={UNIT_COUNT_OPTIONS}
            value={data.unitCount}
            onChange={(v) => onChange({ unitCount: v })}
            error={errors?.unitCount}
          />
        </div>
      </div>
    </div>
  );
}
