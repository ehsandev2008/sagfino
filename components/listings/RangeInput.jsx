"use client";

import { toEnglishDigits } from "@/lib/auth";

export default function RangeInput({
  label,
  value,
  onChange,
  suffix,
  placeholder,
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-caption-md text-gray-7">{label}</span>
      <span className="relative block">
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(event) =>
            onChange(toEnglishDigits(event.target.value).replace(/[^\d]/g, ""))
          }
          placeholder={placeholder ?? "مثلاً ۲۰۰"}
          className="h-10 w-full rounded-xl border border-gray-4 bg-white px-3 pl-14 text-button-md text-gray-12 outline-none transition-colors placeholder:text-gray-6 hover:border-gray-6 focus:border-primary"
        />
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-7">
          {suffix}
        </span>
      </span>
    </label>
  );
}
