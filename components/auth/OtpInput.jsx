"use client";

import { useEffect, useRef, useState } from "react";
import { toEnglishDigits, toFaDigits } from "../../lib/auth";

/** ورودی کد تأیید چندخانه‌ای با پشتیبانی از فارسی، بک‌اسپیس و پیست */
export default function OtpInput({ length = 5, value, onChange, disabled }) {
  const inputs = useRef([]);
  const [focused, setFocused] = useState(0);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const commit = (arr) => onChange(arr.join("").slice(0, length));

  const handleChange = (index, raw) => {
    const clean = toEnglishDigits(raw).replace(/\D/g, "");
    if (!clean) {
      const arr = [...digits];
      arr[index] = "";
      commit(arr);
      return;
    }
    const arr = [...digits];
    const chars = clean.split("");
    for (let k = 0; k < chars.length && index + k < length; k++) {
      arr[index + k] = chars[k];
    }
    commit(arr);
    const next = Math.min(index + chars.length, length - 1);
    inputs.current[next]?.focus();
    setFocused(next);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      const arr = [...digits];
      arr[index - 1] = "";
      commit(arr);
      inputs.current[index - 1]?.focus();
      setFocused(index - 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const clean = toEnglishDigits(e.clipboardData.getData("text")).replace(/\D/g, "");
    if (clean) commit(clean.split(""));
  };

  return (
    <div dir="ltr" className="flex gap-2 sm:gap-3" role="group" aria-label="کد تأیید">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            inputs.current[i] = el;
          }}
          value={toFaDigits(digit)}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={() => setFocused(i)}
          disabled={disabled}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={2}
          aria-label={`رقم ${toFaDigits(i + 1)}`}
          className={`h-14 w-full rounded-md border bg-white text-center text-h5 text-black outline-none transition-all disabled:opacity-60 ${
            focused === i
              ? "border-primary ring-2 ring-primary/25"
              : digit
                ? "border-gray-8"
                : "border-gray-5"
          }`}
        />
      ))}
    </div>
  );
}
