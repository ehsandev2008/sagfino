"use client";
import { motion } from "motion/react";
import { ArrowRight } from "iconsax-react";

export default function StepNav({
  onNext,
  onPrev,
  nextLabel = "ادامه",
  prevLabel = "قبلی",
  showPrev = true,
  loading = false,
  disabled = false,
}) {
  return (
    <div className={`flex items-center gap-3 mt-8 ${showPrev ? "justify-between" : "justify-end"}`}>
      {showPrev && (
        <motion.button
          type="button"
          onClick={onPrev}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#e1e1e1] text-sm font-medium text-[#353535] hover:border-[#909090] transition-colors duration-200"
        >
          <ArrowRight size={16} />
          {prevLabel}
        </motion.button>
      )}

      <motion.button
        type="button"
        onClick={onNext}
        disabled={loading || disabled}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.01 }}
        className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#CB1B1B] text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-200 shadow-sm hover:bg-[#b01818]"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            در حال ثبت...
          </span>
        ) : (
          nextLabel
        )}
      </motion.button>
    </div>
  );
}
