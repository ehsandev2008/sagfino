"use client";

import FormInput from "./FormInput";

/**
 * مرحله ۱: آدرس ملک
 * مطابق تصویر مرجع، فقط خیابان اصلی و خیابان فرعی/کوچه.
 */
export default function Step1Address({ data, onChange, errors }) {
  return (
    <div className="flex flex-col">
      <h2 className="text-right text-h4 font-bold text-black lg:text-[30px]">
        لطفا موارد زیر را تکمیل کنید
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-[10.5vh] lg:gap-5">
        <FormInput
          size="lg"
          label="خیابان اصلی"
          placeholder="آدرس خود را وارد کنید"
          value={data.mainStreet || ""}
          onChange={(e) => onChange({ mainStreet: e.target.value })}
          error={errors?.mainStreet}
          autoComplete="address-line1"
        />
        <FormInput
          size="lg"
          label="خیابان فرعی/کوچه"
          placeholder="جزئیات آدرس را وارد کنید"
          value={data.sideStreet || ""}
          onChange={(e) => onChange({ sideStreet: e.target.value })}
          error={errors?.sideStreet}
          autoComplete="address-line2"
        />
      </div>
    </div>
  );
}
