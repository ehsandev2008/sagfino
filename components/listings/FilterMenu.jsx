"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDown2 } from "iconsax-react";

/**
 * منوی کشویی فیلتر (دسکتاپ)
 * فقط یک منو در هر لحظه باز است؛ والد با openKey کنترل می‌کند.
 */
export default function FilterMenu({
  id,
  label,
  value,
  options,
  onChange,
  openKey,
  setOpenKey,
  icon: Icon,
  className = "",
}) {
  const rootRef = useRef(null);
  const open = openKey === id;

  useEffect(() => {
    if (!open) return undefined;

    const handlePointer = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpenKey(null);
    };
    const handleKey = (event) => {
      if (event.key === "Escape") setOpenKey(null);
    };

    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, setOpenKey]);

  const selected =
    options.find((option) => String(option.value) === String(value ?? "")) ??
    options[0];
  const active = value !== "" && value != null;

  return (
    <div ref={rootRef} className={`relative min-w-0 ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpenKey(open ? null : id)}
        className={`flex h-11 w-full items-center justify-between gap-2 rounded-xl border px-3.5 text-button-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
          active
            ? "border-primary/35 bg-primary-tint-1 text-primary"
            : "border-gray-4 bg-white text-gray-11 hover:border-gray-6 hover:bg-gray-1"
        }`}
      >
        <span className="flex min-w-0 items-center gap-1.5">
          {Icon && (
            <Icon
              size="17"
              variant={active ? "Bold" : "Linear"}
              color="currentColor"
              className="shrink-0"
            />
          )}
          <span className="truncate">{active ? selected.label : label}</span>
        </span>
        <ArrowDown2
          size="15"
          color="currentColor"
          className={`shrink-0 text-gray-8 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute right-0 top-[calc(100%+8px)] z-40 min-w-full overflow-hidden rounded-2xl border border-gray-4 bg-white p-1.5 shadow-[0_18px_50px_rgba(12,12,12,0.14)]"
          >
            <ul role="listbox" aria-label={label} className="max-h-72 overflow-y-auto">
              {options.map((option) => {
                const isSelected =
                  String(option.value) === String(value ?? "");
                return (
                  <li key={option.value || "all"}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        onChange(option.value);
                        setOpenKey(null);
                      }}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-right text-button-md transition-colors ${
                        isSelected
                          ? "bg-primary-tint-1 text-primary"
                          : "text-gray-10 hover:bg-gray-1 hover:text-gray-13"
                      }`}
                    >
                      <span>{option.label}</span>
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                          isSelected
                            ? "border-primary bg-primary"
                            : "border-gray-5 bg-white"
                        }`}
                      >
                        {isSelected && (
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
