"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowDown2 } from "iconsax-react";

export default function CustomDropdown({
  options = [],
  value,
  onChange,
  placeholder = "انتخاب کنید",
  label,
  required,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="flex flex-col gap-1.5" ref={ref}>
      {label && (
        <label className="text-sm font-medium text-[#353535]">
          {label}
          {required && <span className="text-[#CB1B1B] mr-1">*</span>}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border bg-white transition-all duration-200 text-right ${
            open
              ? "border-[#CB1B1B] ring-2 ring-[#CB1B1B]/20"
              : "border-[#e1e1e1] hover:border-[#909090]"
          }`}
        >
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowDown2 size={18} color="#909090" />
          </motion.div>
          <span
            className={`text-sm ${selected ? "text-[#212121]" : "text-[#909090]"}`}
          >
            {selected ? selected.label : placeholder}
          </span>
        </button>

        <AnimatePresence>
          {open && (
            <motion.ul
              initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              style={{ transformOrigin: "top" }}
              className="absolute top-full mt-1 right-0 left-0 z-50 bg-white border border-[#e1e1e1] rounded-xl shadow-lg overflow-hidden py-1"
            >
              {options.map((opt) => (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={`w-full text-right px-4 py-2.5 text-sm transition-colors duration-150 ${
                      value === opt.value
                        ? "bg-[#CB1B1B]/10 text-[#CB1B1B] font-medium"
                        : "text-[#353535] hover:bg-[#f5f5f5]"
                    }`}
                  >
                    {opt.label}
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
