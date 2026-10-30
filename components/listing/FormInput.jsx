"use client";

import { motion } from "motion/react";

/**
 * فیلد ورودی فرم با انیمیشن و استایل یکپارچه
 * @param {Object} props
 * @param {string} props.label - برچسب
 * @param {string} [props.placeholder]
 * @param {string} [props.type] - نوع اینپوت
 * @param {string} props.value
 * @param {(e: React.ChangeEvent<HTMLInputElement>) => void} props.onChange
 * @param {string} [props.error]
 * @param {string} [props.dir] - جهت متن
 * @param {string} [props.inputMode]
 * @param {boolean} [props.disabled]
 * @param {React.ReactNode} [props.suffix] - آیکون یا متن انتهایی
 * @param {"md"|"lg"} [props.size] - اندازهٔ فیلد (lg برای ویزارد ثبت آگهی)
 */
export default function FormInput({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  error,
  dir,
  inputMode,
  disabled = false,
  suffix,
  size = "md",
  ...rest
}) {
  const isLarge = size === "lg";

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          className={`font-medium text-gray-11 ${
            isLarge ? "text-body-xs lg:text-body-s" : "text-body-xxs"
          }`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          dir={dir}
          inputMode={inputMode}
          disabled={disabled}
          className={`w-full border bg-white outline-none transition-all duration-300 placeholder:text-gray-7 focus:border-primary focus:shadow-[0_0_0_3px_rgba(203,27,27,0.1)] disabled:cursor-not-allowed disabled:bg-gray-1 disabled:text-gray-7 ${
            isLarge
              ? "rounded-lg px-4 py-3.5 text-body-xs"
              : "rounded-xl px-4 py-3.5 text-body-xxs"
          } ${suffix ? "pl-20" : ""} ${
            error ? "border-error" : "border-gray-5 hover:border-gray-7"
          }`}
          {...rest}
        />
        {suffix && (
          <span
            className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-7 ${
              isLarge ? "text-body-xs" : "text-body-xxs"
            }`}
          >
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-body-xxs text-error"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
