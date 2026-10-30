"use client";

import { motion } from "motion/react";

const ACTIVE = "#f05c5c";
const IDLE = "#e9e9e9";

/**
 * استپر افقی ثبت آگهی — نقطه‌های تکمیل‌شده با تیک، مرحلهٔ فعلی با
 * نشانگر چرخان و مرحله‌های بعدی خاکستری نمایش داده می‌شوند.
 *
 * @param {Object} props
 * @param {number} props.currentStep - شماره مرحله فعلی (۰-base)
 * @param {number} props.totalSteps - تعداد کل مراحل
 */
export default function StepProgress({ currentStep, totalSteps }) {
  return (
    <div
      className="flex w-full items-center"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-valuenow={currentStep + 1}
      aria-label={`مرحله ${currentStep + 1} از ${totalSteps}`}
    >
      {Array.from({ length: totalSteps }).map((_, i) => {
        const isCompleted = i < currentStep;
        const isCurrent = i === currentStep;
        const isLast = i === totalSteps - 1;

        return (
          <div
            key={i}
            className={`flex items-center ${isLast ? "shrink-0" : "flex-1"}`}
          >
            <motion.div
              initial={false}
              animate={{
                scale: isCurrent ? 1.08 : 1,
                backgroundColor:
                  isCompleted || isCurrent ? ACTIVE : IDLE,
              }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full lg:h-7 lg:w-7"
            >
              {isCompleted && (
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5 lg:h-4 lg:w-4"
                  fill="none"
                  aria-hidden="true"
                >
                  <motion.path
                    d="M6 12.5l3.6 3.6L18 8"
                    stroke="#ffffff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  />
                </svg>
              )}

              {isCurrent && (
                <motion.svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5 lg:h-4 lg:w-4"
                  fill="none"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="7"
                    stroke="#ffffff"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeDasharray="32 12"
                  />
                </motion.svg>
              )}
            </motion.div>

            {!isLast && (
              <div className="relative mx-1.5 h-[2px] flex-1 overflow-hidden rounded-full bg-[#e9e9e9] sm:mx-2">
                <motion.div
                  initial={false}
                  animate={{ scaleX: isCompleted ? 1 : 0 }}
                  transition={{
                    duration: 0.45,
                    ease: [0.32, 0.72, 0, 1],
                  }}
                  style={{ transformOrigin: "right" }}
                  className="absolute inset-0 rounded-full bg-[#f05c5c]"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
