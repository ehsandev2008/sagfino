"use client";
import { useState } from "react";
import CustomDropdown from "../ui/CustomDropdown";
import FormField from "../ui/FormField";
import StepNav from "../ui/StepNav";

const DEAL_TYPES = [
  { value: "rent", label: "اجاره" },
  { value: "sell", label: "فروش" },
  { value: "mortgage", label: "رهن کامل" },
  { value: "mortgage_rent", label: "رهن و اجاره" },
  { value: "presell", label: "پیش‌فروش" },
];

const PROPERTY_TYPES = [
  { value: "apartment", label: "آپارتمان" },
  { value: "villa", label: "ویلا" },
  { value: "office", label: "اداری" },
  { value: "shop", label: "مغازه" },
  { value: "land", label: "زمین" },
  { value: "warehouse", label: "انبار" },
];

export default function Step2DealType({ data, onChange, onNext, onPrev }) {
  const [errors, setErrors] = useState({});

  const isRentable =
    data.dealType === "rent" ||
    data.dealType === "mortgage" ||
    data.dealType === "mortgage_rent";

  const validate = () => {
    const errs = {};
    if (!data.dealType) errs.dealType = "نوع معامله الزامی است";
    if (!data.propertyType) errs.propertyType = "نوع ملک الزامی است";
    if (isRentable) {
      if (data.dealType !== "rent" && !data.mortgage?.trim())
        errs.mortgage = "مبلغ رهن الزامی است";
      if (data.dealType !== "mortgage" && !data.rent?.trim())
        errs.rent = "مبلغ اجاره الزامی است";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-[#212121] mb-1">نوع معامله</h2>
        <p className="text-sm text-[#909090]">نوع معامله و ملک را مشخص کنید</p>
      </div>

      <CustomDropdown
        label="نوع معامله"
        required
        options={DEAL_TYPES}
        value={data.dealType}
        onChange={(v) => onChange({ dealType: v, mortgage: "", rent: "" })}
        placeholder="انتخاب نوع معامله"
      />
      {errors.dealType && (
        <p className="text-xs text-[#CB1B1B] -mt-4 text-right">{errors.dealType}</p>
      )}

      <CustomDropdown
        label="نوع ملک"
        required
        options={PROPERTY_TYPES}
        value={data.propertyType}
        onChange={(v) => onChange({ propertyType: v })}
        placeholder="انتخاب نوع ملک"
      />
      {errors.propertyType && (
        <p className="text-xs text-[#CB1B1B] -mt-4 text-right">{errors.propertyType}</p>
      )}

      {/* Rent/Mortgage fields */}
      {isRentable && (
        <div className="flex flex-col gap-4">
          {data.dealType !== "rent" && (
            <FormField
              label="مبلغ رهن"
              required
              placeholder="۰"
              suffix="تومان"
              inputMode="numeric"
              value={data.mortgage || ""}
              onChange={(v) => onChange({ mortgage: v })}
              error={errors.mortgage}
            />
          )}
          {data.dealType !== "mortgage" && (
            <FormField
              label="مبلغ اجاره ماهانه"
              required
              placeholder="۰"
              suffix="تومان"
              inputMode="numeric"
              value={data.rent || ""}
              onChange={(v) => onChange({ rent: v })}
              error={errors.rent}
            />
          )}

          {/* قابل تبدیل */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div className="relative">
              <input
                type="checkbox"
                checked={data.convertible || false}
                onChange={(e) => onChange({ convertible: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-5 h-5 rounded border-2 border-[#e1e1e1] peer-checked:bg-[#CB1B1B] peer-checked:border-[#CB1B1B] transition-colors duration-200 flex items-center justify-center">
                {data.convertible && (
                  <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                    <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm text-[#353535]">قابل تبدیل</span>
          </label>
        </div>
      )}

      <StepNav onNext={handleNext} onPrev={onPrev} />
    </div>
  );
}
