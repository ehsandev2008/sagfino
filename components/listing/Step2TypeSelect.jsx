"use client";

import CustomDropdown from "./CustomDropdown";
import { PROPERTY_TYPE_OPTIONS } from "@/lib/listings/constants";

const TRANSACTION_TYPES = [
  { value: "sale", label: "فروش" },
  { value: "rent", label: "اجاره" },
  { value: "mortgage", label: "رهن و اجاره" },
  { value: "daily-rent", label: "اجاره روزانه" },
];

const PROPERTY_TYPES = PROPERTY_TYPE_OPTIONS.filter(
  (option) => option.value
);

/**
 * مرحله ۲: انتخاب نوع معامله و نوع ملک
 */
export default function Step2TypeSelect({ data, onChange, errors }) {
  return (
    <div className="flex flex-col">
      <h2 className="text-right text-h4 font-bold text-black lg:text-[30px]">
        نوع ملک و معامله را انتخاب کنید
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-[10.5vh] lg:gap-5">
        <CustomDropdown
          size="lg"
          label="نوع معامله"
          placeholder="نوع معامله را انتخاب کنید"
          options={TRANSACTION_TYPES}
          value={data.transactionType}
          onChange={(v) => onChange({ transactionType: v })}
          error={errors?.transactionType}
        />
        <CustomDropdown
          size="lg"
          label="نوع ملک"
          placeholder="نوع ملک را انتخاب کنید"
          options={PROPERTY_TYPES}
          value={data.propertyType}
          onChange={(v) => onChange({ propertyType: v })}
          error={errors?.propertyType}
        />
      </div>
    </div>
  );
}
