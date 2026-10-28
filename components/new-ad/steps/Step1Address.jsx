"use client";
import { useState } from "react";
import FormField from "../ui/FormField";
import StepNav from "../ui/StepNav";

export default function Step1Address({ data, onChange, onNext }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!data.mainStreet?.trim()) errs.mainStreet = "خیابان اصلی الزامی است";
    if (!data.subStreet?.trim()) errs.subStreet = "خیابان فرعی الزامی است";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-[#212121] mb-1">آدرس ملک</h2>
        <p className="text-sm text-[#909090]">آدرس دقیق ملک را وارد کنید</p>
      </div>

      <FormField
        label="خیابان اصلی"
        required
        placeholder="مثال: ولیعصر"
        value={data.mainStreet || ""}
        onChange={(v) => onChange({ mainStreet: v })}
        error={errors.mainStreet}
      />

      <FormField
        label="خیابان فرعی / کوچه"
        required
        placeholder="مثال: کوچه بهار"
        value={data.subStreet || ""}
        onChange={(v) => onChange({ subStreet: v })}
        error={errors.subStreet}
      />

      <StepNav onNext={handleNext} showPrev={false} />
    </div>
  );
}
