"use client";
import { motion } from "motion/react";
import { TickCircle } from "iconsax-react";

const TOTAL_STEPS = 6;

export default function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-0 w-full mb-8">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => {
        const stepNum = i + 1;
        const isCompleted = stepNum < currentStep;
        const isCurrent = stepNum === currentStep;
        const isPending = stepNum > currentStep;

        return (
          <div key={stepNum} className="flex items-center">
            {/* Dot */}
            <motion.div
              initial={false}
              animate={{
                scale: isCurrent ? 1.15 : 1,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`relative flex items-center justify-center rounded-full transition-colors duration-300 ${
                isCurrent
                  ? "w-8 h-8 bg-[#CB1B1B]"
                  : isCompleted
                  ? "w-7 h-7 bg-[#CB1B1B]"
                  : "w-5 h-5 bg-[#e1e1e1]"
              }`}
            >
              {isCompleted && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <TickCircle size={16} color="white" variant="Bold" />
                </motion.div>
              )}
              {isCurrent && (
                <span className="text-white text-xs font-bold">{stepNum}</span>
              )}
              {isPending && (
                <span className="text-[#909090] text-xs font-medium">
                  {stepNum}
                </span>
              )}
            </motion.div>

            {/* Connector line */}
            {i < TOTAL_STEPS - 1 && (
              <div className="relative h-0.5 w-8 md:w-12 mx-0.5">
                <div className="absolute inset-0 bg-[#e1e1e1] rounded-full" />
                <motion.div
                  initial={false}
                  animate={{ scaleX: isCompleted ? 1 : 0 }}
                  style={{ transformOrigin: "right" }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute inset-0 bg-[#CB1B1B] rounded-full"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
