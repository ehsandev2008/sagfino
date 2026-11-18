"use client";

import dynamic from "next/dynamic";

const ContactMapCanvas = dynamic(() => import("./ContactMapCanvas"), {
  ssr: false,
  loading: () => (
    <div
      role="status"
      className="grid h-full min-h-72 place-items-center bg-gray-2 text-sm text-gray-8"
    >
      در حال آماده‌سازی نقشه…
    </div>
  ),
});

export default function ContactMap() {
  return (
    <section aria-label="نشانی دفتر مرکزی سقفینو" className="relative">
      <div className="relative z-0 h-72 w-full sm:h-80 lg:h-[360px]">
        <ContactMapCanvas />
      </div>

      <div
        dir="rtl"
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-4 py-6"
      >
        <div className="pointer-events-auto grid w-full max-w-[410px] overflow-hidden border border-primary-tint-3 bg-white shadow-[0_8px_28px_rgba(12,12,12,0.12)] sm:min-h-[205px] sm:grid-cols-2">
          <div className="flex flex-col justify-center px-5 py-5 text-center sm:px-7">
            <h2 className="text-base font-bold text-gray-11">
              دفتر مرکزی سقفینو
            </h2>
            <p className="mt-2 text-sm leading-7 text-gray-8">
              شهرک گلستان، خیابان هوانیروز، ساختمان اداری کاج، طبقه ۱
            </p>
          </div>

          <a
            href="https://www.google.com/maps/search/?api=1&query=35.719%2C51.418"
            target="_blank"
            rel="noreferrer"
            className="flex min-h-24 flex-col items-center justify-center gap-2 bg-primary-shade-2 px-4 py-4 text-sm text-white transition-colors hover:bg-primary-shade-3 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white sm:min-h-0"
          >
            <svg
              aria-hidden="true"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <span>جست‌وجو با گوگل‌مپ</span>
          </a>
        </div>
      </div>
    </section>
  );
}
