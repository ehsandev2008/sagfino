"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "../ui/Reveal";

const SERVICES = [
  {
    image: "/imags/home pro user/services-1.webp",
    text: "با ثبت آسان آگهی، ملک خود را برای اجاره یا فروش اعلان کنید",
    href: "/new-ad",
    variant: "drift",
  },
  {
    image: "/imags/home pro user/services-2.webp",
    text: "اگر در جست‌وجوی یک سقف نو هستید اینجا کلیک کنید",
    href: "/properties",
    variant: "wipe",
  },
  {
    image: "/imags/home pro user/services-3.webp",
    text: "مشاورین ما ۲۴ ساعته پاسخگوی سوالات ملکی شما هستند",
    href: "/advisors",
    variant: "focus",
  },
];

/**
 * سکشن «سقفینو فرصتی برای همه» (Services) — صفحه اصلی کاربر لاگین‌شده
 * پیاده‌سازی شده دقیقاً مطابق با نود 5354:33978 در فیگما
 */
export default function ServicesSection() {
  return (
    <section className="bg-white py-10 lg:py-14">
      <div className="mx-auto w-[calc(100%-1.5rem)] lg:w-[80%] max-w-[1224px]">
        {/* ── تیتر و توضیح ── */}
        <Reveal variant="rise">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-h5 font-bold text-gray-12 lg:text-h3">
              سقفینو فرصتی برای همه
            </h2>
            <p className="mt-2 text-body-xxs text-gray-11 lg:mt-3 lg:text-body-smd">
              اگر مالک یا در جست‌‌وجوی سقفی نو هستید، کلیک کنید
            </p>
          </div>
        </Reveal>

        {/* ── کارت‌های خدمات (Features) ── */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3 lg:mt-10">
          {SERVICES.map((item, index) => (
            <Reveal key={item.text} variant={item.variant} delay={index * 0.1}>
              <Link
                href={item.href}
                className="group flex h-full flex-col items-center justify-center rounded-2xl border border-gray-2 bg-white px-6 py-7 text-center shadow-[0_2px_8px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-300 hover:border-gray-4 hover:shadow-md lg:px-12 lg:py-7"
              >
                <div className="flex h-[138px] w-full items-center justify-center">
                  <Image
                    src={item.image}
                    alt={item.text}
                    width={264}
                    height={138}
                    className="h-full w-auto object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
                <p className="mt-3 text-body-xxs leading-relaxed text-gray-11 lg:text-body-regular">
                  {item.text}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
