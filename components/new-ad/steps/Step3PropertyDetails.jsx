"use client";
import { useState } from "react";
import FormField from "../ui/FormField";
import StepNav from "../ui/StepNav";

export default function Step3PropertyDetails({ data, onChange, onNext, onPrev }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!data.area?.trim()) errs.area = "متراژ الزامی است";
    if (!data.rooms?.trim()) errs.rooms = "تعداد اتاق الزامی است";
    if (!data.floor?.trim()) errs.floor = "طبقه الزامی است";
    if (!data.totalFloors?.trim()) errs.totalFloors = "تعداد طبقات الزامی است";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-[#212121] mb-1">مشخصات ملک</h2>
        <p className="text-sm text-[#909090]">ابعاد و مشخصات اصلی ملک را وارد کنید</p>
      </div>

      {/* Area */}
      <FormField
        label="متراژ"
        required
        placeholder="۰"
        suffix="متر مربع"
        inputMode="numeric"
        value={data.area || ""}
        onChange={(v) => onChange({ area: v })}
        error={errors.area}
      />

      {/* Rooms */}
      <FormField
        label="تعداد اتاق"
        required
        placeholder="۰"
        inputMode="numeric"
        value={data.rooms || ""}
        onChange={(v) => onChange({ rooms: v })}
        error={errors.rooms}
      />

      {/* Floor & Total floors side by side */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="طبقه"
          required
          placeholder="۰"
          inputMode="numeric"
          value={data.floor || ""}
          onChange={(v) => onChange({ floor: v })}
          error={errors.floor}
        />
        <FormField
          label="تعداد طبقات"
          required
          placeholder="۰"
          inputMode="numeric"
          value={data.totalFloors || ""}
          onChange={(v) => onChange({ totalFloors: v })}
          error={errors.totalFloors}
        />
      </div>

      <StepNav onNext={handleNext} onPrev={onPrev} />
    </div>
  );
}
