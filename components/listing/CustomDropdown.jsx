"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowDown2, TickCircle } from "iconsax-react";

/**
 * دراپ‌داون سفارشی با انیمیشن حرفه‌ای
 * @param {Object} props
 * @param {string} props.label - برچسب دراپ‌داون
 * @param {string} props.placeholder - متن پیش‌فرض
 * @param {Array<{value: string, label: string}>} props.options
 * @param {string} props.value - مقدار انتخاب‌شده
 * @param {(value: string) => void} props.onChange
 * @param {string} [props.error] - پیام خطا
 * @param {"md"|"lg"} [props.size] - اندازهٔ فیلد (lg برای ویزارد ثبت آگهی)
 */
export default function CustomDropdown({
  label,
  placeholder = "انتخاب کنید",
  options = [],
  value,
  onChange,
  error,
  size = "md",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const selectedOption = options.find((o) => o.value === value);
  const isLarge = size === "lg";

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        close();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, close]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  return (
    <div className="flex flex-col gap-2" ref={containerRef}>
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
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className={`flex w-full items-center justify-between border bg-white transition-all duration-300 ${
            isLarge
              ? "rounded-lg px-4 py-3.5 text-body-xs"
              : "rounded-xl px-4 py-3.5 text-body-xxs"
          } ${
            isOpen
              ? "border-primary shadow-[0_0_0_3px_rgba(203,27,27,0.1)]"
              : error
              ? "border-error"
              : "border-gray-5 hover:border-gray-7"
          } ${selectedOption ? "text-black" : "text-gray-7"}`}
        >
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="flex text-gray-8"
          >
            <ArrowDown2 size="18" color="currentColor" />
          </motion.span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -8, scaleY: 0.96 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -8, scaleY: 0.96 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              style={{ transformOrigin: "top" }}
              className="absolute inset-x-0 top-[calc(100%+6px)] z-50 max-h-56 overflow-y-auto rounded-lg border border-gray-4 bg-white p-1.5 shadow-xl"
            >
              {options.map((opt, i) => {
                const isSelected = opt.value === value;
                return (
                  <motion.li
                    key={opt.value}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.2 }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onChange(opt.value);
                        close();
                      }}
                      className={`flex w-full items-center justify-between rounded-md px-3.5 transition-colors ${
                        isLarge ? "py-3 text-body-xs" : "py-2.5 text-body-xxs"
                      } ${
                        isSelected
                          ? "bg-primary-tint-1 font-medium text-primary"
                          : "text-gray-11 hover:bg-gray-1"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex text-primary"
                        >
                          <TickCircle
                            size="18"
                            variant="Bold"
                            color="currentColor"
                          />
                        </motion.span>
                      )}
                    </button>
                  </motion.li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
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
