"use client";
import { useState } from "react";
import CustomDropdown from "../ui/CustomDropdown";
import StepNav from "../ui/StepNav";

const BATHROOM_TYPES = [
  { value: "iranian", label: "ایرانی" },
  { value: "western", label: "فرنگی" },
  { value: "both", label: "ایرانی و فرنگی" },
];

const COOLING_SYSTEMS = [
  { value: "split", label: "اسپلیت" },
  { value: "cooler", label: "کولر آبی" },
  { value: "central", label: "مرکزی" },
  { value: "none", label: "بدون سیستم سرمایش" },
];

const FLOOR_MATERIALS = [
  { value: "ceramic", label: "سرامیک" },
  { value: "parquet", label: "پارکت" },
  { value: "stone", label: "سنگ" },
  { value: "mosaic", label: "موزاییک" },
  { value: "laminate", label: "لمینت" },
];

const HEATING_SYSTEMS = [
  { value: "package", label: "پکیج" },
  { value: "floor_heating", label: "گرمایش از کف" },
  { value: "fireplace", label: "شومینه" },
  { value: "radiator", label: "رادیاتور" },
  { value: "none", label: "بدون سیستم گرمایش" },
];

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between py-3 px-4 rounded-xl border border-[#e1e1e1] bg-white cursor-pointer hover:border-[#909090] transition-colors duration-200">
      <span className="text-sm text-[#353535] font-medium">{label}</span>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-[#e1e1e1] rounded-full peer-checked:bg-[#CB1B1B] transition-colors duration-300" />
        <div className="absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 peer-checked:-translate-x-5" />
      </div>
    </label>
  );
}

export default function Step4Amenities({ data, onChange, onNext, onPrev }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (data.hasBathroom && !data.bathroomType) errs.bathroomType = "نوع سرویس بهداشتی را انتخاب کنید";
    if (!data.coolingSystem) errs.coolingSystem = "سیستم سرمایش الزامی است";
    if (!data.floorMaterial) errs.floorMaterial = "جنس کف الزامی است";
    if (!data.heatingSystem) errs.heatingSystem = "سیستم گرمایش الزامی است";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-[#212121] mb-1">امکانات ملک</h2>
        <p className="text-sm text-[#909090]">امکانات و تجهیزات ملک را مشخص کنید</p>
      </div>

      {/* Toggles */}
      <div className="flex flex-col gap-3">
        <Toggle
          label="پارکینگ"
          checked={data.parking || false}
          onChange={(v) => onChange({ parking: v })}
        />
        <Toggle
          label="سرویس بهداشتی"
          checked={data.hasBathroom || false}
          onChange={(v) => onChange({ hasBathroom: v, bathroomType: v ? data.bathroomType : "" })}
        />
        <Toggle
          label="انباری"
          checked={data.storage || false}
          onChange={(v) => onChange({ storage: v })}
        />
        <Toggle
          label="آسانسور"
          checked={data.elevator || false}
          onChange={(v) => onChange({ elevator: v })}
        />
      </div>

      {/* Bathroom type — shown only when hasBathroom is true */}
      {data.hasBathroom && (
        <div className="flex flex-col gap-1.5">
          <CustomDropdown
            label="نوع سرویس بهداشتی"
            required
            options={BATHROOM_TYPES}
            value={data.bathroomType}
            onChange={(v) => onChange({ bathroomType: v })}
            placeholder="انتخاب نوع سرویس بهداشتی"
          />
          {errors.bathroomType && (
            <p className="text-xs text-[#CB1B1B] text-right">{errors.bathroomType}</p>
          )}
        </div>
      )}

      {/* Cooling */}
      <div className="flex flex-col gap-1.5">
        <CustomDropdown
          label="سیستم سرمایش"
          required
          options={COOLING_SYSTEMS}
          value={data.coolingSystem}
          onChange={(v) => onChange({ coolingSystem: v })}
          placeholder="انتخاب سیستم سرمایش"
        />
        {errors.coolingSystem && (
          <p className="text-xs text-[#CB1B1B] text-right">{errors.coolingSystem}</p>
        )}
      </div>

      {/* Floor material */}
      <div className="flex flex-col gap-1.5">
        <CustomDropdown
          label="جنس کف"
          required
          options={FLOOR_MATERIALS}
          value={data.floorMaterial}
          onChange={(v) => onChange({ floorMaterial: v })}
          placeholder="انتخاب جنس کف"
        />
        {errors.floorMaterial && (
          <p className="text-xs text-[#CB1B1B] text-right">{errors.floorMaterial}</p>
        )}
      </div>

      {/* Heating */}
      <div className="flex flex-col gap-1.5">
        <CustomDropdown
          label="سیستم گرمایش"
          required
          options={HEATING_SYSTEMS}
          value={data.heatingSystem}
          onChange={(v) => onChange({ heatingSystem: v })}
          placeholder="انتخاب سیستم گرمایش"
        />
        {errors.heatingSystem && (
          <p className="text-xs text-[#CB1B1B] text-right">{errors.heatingSystem}</p>
        )}
      </div>

      <StepNav onNext={handleNext} onPrev={onPrev} />
    </div>
  );
}
