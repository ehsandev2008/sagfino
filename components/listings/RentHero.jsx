import Link from "next/link";
import {
  ArrowLeft2,
  Buildings2,
  Flash,
  Global,
  Home2,
  Map1,
  ShieldTick,
} from "iconsax-react";
import { cities, provinces } from "@/lib/listings/locations";
import { formatNumberFa } from "@/lib/listings/format";
import { toFaDigits } from "@/lib/auth";

const QUICK_LINKS = [
  { label: "اجارهٔ آپارتمان", href: "/rent?type=apartment" },
  { label: "اجارهٔ ویلا", href: "/rent?type=villa" },
  { label: "دفتر کار", href: "/rent?type=office" },
  { label: "خانه‌های مبله", href: "/rent?features=furnished" },
];

const STATS = [
  {
    icon: Buildings2,
    value: toFaDigits(provinces.length),
    label: "استان",
  },
  {
    icon: Map1,
    value: formatNumberFa(cities.length),
    label: "شهر",
  },
  {
    icon: ShieldTick,
    value: "۲۴/۷",
    label: "پشتیبانی",
  },
];

/** سربرگ صفحهٔ اجاره: عنوان، مسیر صفحه، جست‌وجوهای سریع و آمار */
export default function RentHero() {
  return (
    <section className="relative overflow-hidden border-b border-gray-3 bg-gradient-to-l from-primary-tint-1/70 via-white to-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-28 h-72 w-72 rounded-full bg-primary-tint-2/70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 left-1/3 h-44 w-44 rotate-12 rounded-[40px] border border-primary/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 bottom-4 hidden text-primary/5 lg:block"
      >
        <Home2 size="150" variant="Bold" color="currentColor" />
      </div>

      <div className="relative mx-auto w-[calc(100%-1.5rem)] max-w-[1224px] py-5 lg:w-[80%] lg:py-8">
        <nav
          aria-label="مسیر صفحه"
          className="flex items-center gap-1.5 text-[11px] text-gray-7"
        >
          <Link
            href="/"
            className="flex items-center gap-1 transition-colors hover:text-primary"
          >
            <Home2 size="13" color="currentColor" />
            خانه
          </Link>
          <ArrowLeft2 size="11" color="currentColor" className="text-gray-5" />
          <span className="text-gray-10">اجارهٔ مسکن</span>
        </nav>

        <div className="mt-3.5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="min-w-0">
            <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-primary/15 bg-white/80 px-3 text-[10px] font-medium text-primary shadow-sm backdrop-blur">
              <Flash size="13" variant="Bold" color="currentColor" />
              بازار اجارهٔ سقفینو · به‌روزرسانی روزانه
            </span>

            <h1 className="mt-2.5 text-h4 leading-[1.4] text-gray-13 sm:text-h3 lg:text-h2">
              خانه‌ای برای <span className="text-primary">اجاره</span> پیدا کنید
            </h1>

            <p className="mt-2 max-w-2xl text-caption-md leading-6 text-gray-8 sm:text-body-xxs">
              هزاران آگهی اجاره از دفاتر املاک معتبر سراسر ایران؛ با فیلتر شهر،
              متراژ، رهن و اجاره، گزینهٔ مناسب خود را سریع‌تر پیدا کنید.
            </p>

            <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
              <span className="hidden items-center gap-1 text-[10px] text-gray-7 sm:flex">
                <Global size="13" color="currentColor" />
                جست‌وجوهای پرطرفدار:
              </span>
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group inline-flex h-8 items-center gap-1 rounded-full border border-gray-4 bg-white px-3 text-[11px] text-gray-9 shadow-sm transition-all hover:border-primary/30 hover:bg-primary-tint-1 hover:text-primary"
                >
                  {link.label}
                  <ArrowLeft2
                    size="12"
                    color="currentColor"
                    className="text-gray-5 transition-transform group-hover:-translate-x-0.5 group-hover:text-primary"
                  />
                </Link>
              ))}
            </div>
          </div>

          <div className="grid shrink-0 grid-cols-3 gap-2 lg:w-[360px]">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-gray-3 bg-white/90 px-2 py-3 text-center shadow-[0_6px_24px_rgba(12,12,12,0.04)] backdrop-blur"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-tint-1 text-primary">
                  <Icon size="17" variant="Bold" color="currentColor" />
                </span>
                <span className="text-body-xxs font-bold text-gray-12">
                  {value}
                </span>
                <span className="text-[9px] text-gray-7">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
