"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft2 } from "iconsax-react";
import Reveal from "../../ui/Reveal";
import AdvisorCard from "./AdvisorCard";

const ADVISORS = [
  {
    id: 1,
    name: "علی پرتو",
    office: "املاک توسی",
    rating: "۵",
    image: "/imags/realstate/agent-4.webp",
    href: "/advisors/ali-parto",
  },
  {
    id: 2,
    name: "زیبا تاجدار",
    office: "املاک فرشته",
    rating: "۴",
    image: "/imags/realstate/agent-3.webp",
    href: "/advisors/ziba-tajdar",
  },
  {
    id: 3,
    name: "رز دانش",
    office: "املاک سبز",
    rating: "۴/۸",
    image: "/imags/realstate/agent-2.webp",
    href: "/advisors/roz-danesh",
  },
  {
    id: 4,
    name: "ماندانا تبریزی",
    office: "املاک ولیعصر",
    rating: "۴",
    image: "/imags/realstate/agent-1.webp",
    href: "/advisors/mandana-tabrizi",
  },
];

/**
 * سکشن «مشاورین برتر تهران»
 * دسکتاپ: گرید ۴ ستونه با دکمه ناوبری
 * موبایل: کاروسل افقی با اسکرول اسنپ و دکمه چپ
 */
export default function TopAdvisorsSection() {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(true);

  const scrollNext = () => {
    if (trackRef.current) {
      // In RTL, scrolling to the next item is toward the left (negative)
      trackRef.current.scrollBy({ left: -280, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!trackRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
      const atEnd = Math.abs(scrollLeft) + clientWidth >= scrollWidth - 10;
      setCanScrollLeft(!atEnd);
    };

    const track = trackRef.current;
    if (track) {
      track.addEventListener("scroll", handleScroll, { passive: true });
      return () => track.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <section className="bg-white py-10 lg:py-14">
      <div className="mx-auto w-[calc(100%-1.5rem)] max-w-[1224px] lg:w-[80%]">
        {/* ── تیتر سکشن ── */}
        <Reveal variant="rise">
          <h2 className="text-right text-h5 font-bold text-gray-12 lg:text-h4">
            مشاورین برتر تهران
          </h2>
        </Reveal>

        {/* ── نسخه دسکتاپ (گرید ۴ ستونه + دکمه ناوبری) ── */}
        <div className="relative mt-8 hidden lg:block">
          <div className="grid grid-cols-4 gap-6">
            {ADVISORS.map((advisor, index) => (
              <Reveal
                key={advisor.id}
                variant={["wipe", "focus", "drift", "rise"][index % 4]}
                delay={index * 0.08}
                className="h-full"
              >
                <AdvisorCard advisor={advisor} />
              </Reveal>
            ))}
          </div>

          <button
            type="button"
            onClick={scrollNext}
            aria-label="مشاورین بیشتر"
            className="absolute -left-7 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-gray-3 bg-white text-gray-11 shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition-all duration-300 hover:border-primary hover:text-primary active:scale-95"
          >
            <ArrowLeft2 size="24" color="currentColor" />
          </button>
        </div>

        {/* ── نسخه موبایل (کاروسل اسکرولی) ── */}
        <div className="relative mt-6 lg:hidden">
          <div
            ref={trackRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 py-2"
          >
            {ADVISORS.map((advisor) => (
              <div
                key={advisor.id}
                className="w-[72%] shrink-0 snap-center sm:w-[48%]"
              >
                <AdvisorCard advisor={advisor} />
              </div>
            ))}
          </div>

          {canScrollLeft && (
            <button
              type="button"
              onClick={scrollNext}
              aria-label="مشاور بعدی"
              className="absolute left-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-3 bg-white/95 text-gray-11 shadow-md backdrop-blur-sm transition-transform active:scale-95"
            >
              <ArrowLeft2 size="20" color="currentColor" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
