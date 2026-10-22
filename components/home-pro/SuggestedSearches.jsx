"use client";

import Link from "next/link";
import Reveal from "../ui/Reveal";

const DESKTOP_ROWS = [
  [
    { name: "املاک در نارمک", href: "/properties?neighborhood=narmak" },
    { name: "املاک در پونک", href: "/properties?neighborhood=poonak" },
    { name: "املاک در ولنجک", href: "/properties?neighborhood=velenjak" },
    { name: "املاک در فرمانیه", href: "/properties?neighborhood=farmanieh" },
    { name: "املاک در نیاوران", href: "/properties?neighborhood=niavaran" },
    { name: "املاک در امانیه", href: "/properties?neighborhood=amanieh" },
  ],
  [
    { name: "املاک در دروس", href: "/properties?neighborhood=darrous" },
    { name: "املاک در الهیه", href: "/properties?neighborhood=elahieh" },
    { name: "املاک در قیطریه", href: "/properties?neighborhood=gheytariyeh" },
    { name: "املاک در دولت", href: "/properties?neighborhood=dolat" },
    { name: "املاک در قلهک", href: "/properties?neighborhood=gholhak" },
    { name: "املاک در ظفر", href: "/properties?neighborhood=zafar" },
  ],
];

const MOBILE_COLUMNS = [
  // ستون راست (موبایل)
  [
    { name: "املاک در نارمک", href: "/properties?neighborhood=narmak" },
    { name: "املاک در دروس", href: "/properties?neighborhood=darrous" },
    { name: "املاک در نیاوران", href: "/properties?neighborhood=niavaran" },
    { name: "املاک در قلهک", href: "/properties?neighborhood=gholhak" },
    { name: "املاک در پونک", href: "/properties?neighborhood=poonak" },
    { name: "املاک در الهیه", href: "/properties?neighborhood=elahieh" },
  ],
  // ستون چپ (موبایل)
  [
    { name: "املاک در فرمانیه", href: "/properties?neighborhood=farmanieh" },
    { name: "املاک در دولت", href: "/properties?neighborhood=dolat" },
    { name: "املاک در امانیه", href: "/properties?neighborhood=amanieh" },
    { name: "املاک در ظفر", href: "/properties?neighborhood=zafar" },
    { name: "املاک در ولنجک", href: "/properties?neighborhood=velenjak" },
    { name: "املاک در قیطریه", href: "/properties?neighborhood=gheytariyeh" },
  ],
];

/**
 * سکشن «جستجوهای پیشنهادی»
 * پیاده‌سازی شده دقیقاً مطابق با نودهای فیگما (دسکتاپ: 12495:17108 / موبایل: 12496:17109)
 */
export default function SuggestedSearches() {
  return (
    <section className="bg-white py-8 lg:py-12 border-t border-gray-3/80">
      <div className="mx-auto w-[calc(100%-1.5rem)] lg:w-[80%] max-w-[1224px]">
        {/* ── تیتر ── */}
        <Reveal variant="rise">
          <h2 className="text-right text-h5 font-bold text-gray-12 lg:text-h4">
            جستجوهای پیشنهادی
          </h2>
        </Reveal>

        {/* ── نسخه دسکتاپ (6 ستون در 2 ردیف) ── */}
        <div className="mt-6 hidden lg:flex lg:flex-col lg:gap-4">
          {DESKTOP_ROWS.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-6 gap-6">
              {row.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-right text-body-xs text-gray-10 transition-colors hover:text-primary"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* ── نسخه موبایل (2 ستون در 6 ردیف مطابق با فریم فیگما) ── */}
        <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3.5 lg:hidden">
          {/* ستون اول (راست) */}
          <div className="flex flex-col gap-3.5">
            {MOBILE_COLUMNS[0].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-right text-body-xxs text-gray-10 transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* ستون دوم (چپ) */}
          <div className="flex flex-col gap-3.5">
            {MOBILE_COLUMNS[1].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-right text-body-xxs text-gray-10 transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
