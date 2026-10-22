"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft2 } from "iconsax-react";
import Reveal from "../ui/Reveal";

const SERVICES = [
  {
    image: "/imags/home pro user/services-1.webp",
    desktopText: "با ثبت آسان آگهی، ملک خود را برای اجاره یا فروش اعلان کنید",
    mobileText: "برای ثبت آگهی اجاره\nکلیک کن",
    href: "/new-ad",
    variant: "drift",
  },
  {
    image: "/imags/home pro user/services-2.webp",
    desktopText: "اگر در جست‌وجوی یک سقف نو هستید اینجا کلیک کنید",
    mobileText: "برای جستجوی\nیه سقف\nنو کلیک کن",
    href: "/properties",
    variant: "wipe",
  },
  {
    image: "/imags/home pro user/services-3.webp",
    desktopText: "مشاورین ما ۲۴ ساعته پاسخگوی سوالات ملکی شما هستند",
    mobileText: "مشاورین ۲۴ ساعته\nپاسخگوی شما\nکلیک کن",
    href: "/advisors",
    variant: "focus",
  },
];

/**
 * سکشن «سقفینو فرصتی برای همه» (Services)
 * دسکتاپ: گرید ۳ تایی با شادو و بردر
 * موبایل: کاروسل اسکرولی با کارت‌های مربعی و دکمه ناوبری (مطابق نود 12496:17110 فیگما)
 */
export default function ServicesSection() {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(true);

  const scrollNext = () => {
    if (trackRef.current) {
      // In RTL, scrolling left is negative scrollLeft
      trackRef.current.scrollBy({ left: -260, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!trackRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
      // In RTL, scrollLeft can be 0 at start and negative as you scroll left
      const atEnd = Math.abs(scrollLeft) + clientWidth >= scrollWidth - 10;
      setCanScrollLeft(!atEnd);
    };

    const track = trackRef.current;
    if (track) {
      track.addEventListener("scroll", handleScroll);
      return () => track.removeEventListener("scroll", handleScroll);
    }
  }, []);

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

        {/* ── حالت دسکتاپ (3 ستون ثابت) ── */}
        <div className="mt-10 hidden lg:grid lg:grid-cols-3 lg:gap-6">
          {SERVICES.map((item, index) => (
            <Reveal key={item.desktopText} variant={item.variant} delay={index * 0.1}>
              <Link
                href={item.href}
                className="group flex h-full flex-col items-center justify-center rounded-2xl border border-gray-2 bg-white px-6 py-7 text-center shadow-[0_2px_8px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-300 hover:border-gray-4 hover:shadow-md lg:px-12 lg:py-7"
              >
                <div className="flex h-[138px] w-full items-center justify-center">
                  <Image
                    src={item.image}
                    alt=""
                    width={264}
                    height={138}
                    className="h-full w-auto object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
                <p className="mt-3 text-body-xxs leading-relaxed text-gray-11 lg:text-body-regular">
                  {item.desktopText}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* ── حالت موبایل (کاروسل اسکرولی مطابق تصویر فیگما 12496:17110) ── */}
        <div className="relative mt-8 lg:hidden">
          <div
            ref={trackRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 py-2"
          >
            {SERVICES.map((item) => (
              <div
                key={item.href}
                className="w-[68%] shrink-0 snap-center sm:w-[48%]"
              >
                <Link
                  href={item.href}
                  className="flex h-full min-h-[290px] flex-col items-center justify-between rounded-3xl border border-gray-3 bg-white p-6 text-center shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all active:scale-[0.98]"
                >
                  <div className="flex h-[140px] w-full items-center justify-center">
                    <Image
                      src={item.image}
                      alt=""
                      width={220}
                      height={130}
                      className="max-h-[130px] w-auto object-contain"
                    />
                  </div>
                  <p className="mt-4 whitespace-pre-line text-body-xs font-bold leading-relaxed text-gray-12">
                    {item.mobileText}
                  </p>
                </Link>
              </div>
            ))}
          </div>

          {/* دکمه اسکرول ناوبری به چپ (مطابق با علامت < در عکس فیگما) */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={scrollNext}
              aria-label="کارت بعدی"
              className="absolute left-1 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-gray-11 shadow-md border border-gray-3 backdrop-blur-sm transition-transform active:scale-95"
            >
              <ArrowLeft2 size="20" color="currentColor" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
