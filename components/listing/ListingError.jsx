"use client";

import { motion } from "motion/react";

/** تصویر پوشهٔ قرمز با علامت خطا */
function FolderErrorIllustration() {
  return (
    <svg
      viewBox="0 0 600 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-full"
      aria-hidden="true"
    >
      <ellipse cx="300" cy="390" rx="190" ry="17" fill="#0c0c0c" opacity="0.06" />
      <path
        d="M92 84h150c10 0 18 4 24 12l36 46h210c24 0 42 20 39 44l-26 180c-3 22-22 38-44 38H104c-26 0-46-22-43-48l28-230c2-24 22-42 46-42Z"
        fill="#9E3B3B"
      />
      <path
        d="M58 122h164c11 0 21 5 28 14l34 42h228c26 0 45 23 41 49l-27 166c-4 25-25 43-50 43H92c-30 0-53-27-48-57l30-208c3-27 27-49 54-49Z"
        fill="#F45B5B"
        transform="rotate(-1.5 300 240)"
      />
      <path
        d="M252 248l96 96m0-96l-96 96"
        stroke="#F9B4B4"
        strokeWidth="30"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * صفحهٔ خطای ثبت آگهی
 */
export default function ListingError({ onBack }) {
  return (
    <div className="flex min-h-dvh w-full flex-col items-center px-6 pt-[12vh] text-center">
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
        className="text-h4 font-bold text-black lg:text-h3"
      >
        مشکلی در ثبت آگهی شما به‌وجود آمده!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.4 }}
        className="mt-5 max-w-[440px] text-body-s leading-9 text-gray-9 lg:text-body-regular"
      >
        در قسمت ثبت آگهی، خطای مربوط به اطلاعات
        <br className="hidden sm:block" />
        برای شما مشخص شده است.
      </motion.p>

      <motion.button
        type="button"
        onClick={onBack}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.4 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="mt-5 rounded-lg border border-primary-tint-6 px-8 py-3.5 text-body-xs font-medium text-primary transition-colors hover:bg-primary-tint-1 lg:text-body-s"
      >
        بازگشت به ثبت آگهی
      </motion.button>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{
          delay: 0.3,
          type: "spring",
          stiffness: 120,
          damping: 16,
        }}
        className="mt-8 w-[300px] sm:w-[360px] lg:mt-4 lg:w-[440px]"
      >
        <FolderErrorIllustration />
      </motion.div>
    </div>
  );
}
