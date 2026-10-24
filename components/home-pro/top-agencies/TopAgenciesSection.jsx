"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { ArrowLeft2 } from "iconsax-react";
import Reveal from "../../ui/Reveal";
import AgencyCard from "./AgencyCard";
import AgencyModal from "./AgencyModal";

const AGENCIES = [
  {
    id: 1,
    name: "مشاور املاک توسی",
    verified: true,
    location: "تهران، نیاوران",
    satisfaction: "۴/۹ از ۵",
    activeAds: "بیش از ۴۰۰۰",
    reviewsCount: "۱۲",
    logo: "/imags/amlak/agency-4.webp",
    phones: ["09123456789", "02112345678"],
  },
  {
    id: 2,
    name: "مشاور املاک ولیعصر",
    verified: true,
    location: "تهران، خیابان ولیعصر",
    satisfaction: "۴ از ۵",
    activeAds: "بیش از ۳۵۰۰",
    reviewsCount: "۱۲",
    logo: "/imags/amlak/agency-2.webp",
    phones: ["09127654321", "02188776655"],
  },
  {
    id: 3,
    name: "مشاور املاک فرشته",
    verified: false,
    location: "تهران، خیابان فرشته",
    satisfaction: "۴ از ۵",
    activeAds: "بیش از ۲۰۰۰",
    reviewsCount: "۱۲",
    logo: "/imags/amlak/agency-3.webp",
    phones: ["09121234567", "02122334455"],
  },
  {
    id: 4,
    name: "مشاور املاک سبز",
    verified: false,
    location: "تهران، پاسداران",
    satisfaction: "۴ از ۵",
    activeAds: "بیش از ۲۰۰۰",
    reviewsCount: "۱۲",
    logo: "/imags/amlak/agency-1.webp",
    phones: ["09129876543", "02177889900"],
  },
];

/**
 * سکشن «املاک برتر تهران»
 * دسکتاپ: گرید ۴ ستونه با دکمه ناوبری
 * موبایل: کاروسل افقی با اسکرول اسنپ و دکمه چپ
 */
export default function TopAgenciesSection() {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(true);
  const [activeAgency, setActiveAgency] = useState(null);

  const openAgency = useCallback((agency, rect, trigger) => {
    setActiveAgency({ agency, rect, trigger });
  }, []);

  const closeAgency = useCallback(() => {
    setActiveAgency(null);
  }, []);

  const scrollNext = () => {
    if (trackRef.current) {
      // In RTL, scroll left is negative
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
      track.addEventListener("scroll", handleScroll);
      return () => track.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <section className="bg-white py-10 lg:py-14">
      <div className="mx-auto w-[calc(100%-1.5rem)] lg:w-[80%] max-w-[1224px]">
        {/* ── تیتر سکشن ── */}
        <Reveal variant="rise">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-right text-h5 font-bold text-gray-12 lg:text-h4">
              املاک برتر تهران
            </h2>
          </div>
        </Reveal>

        {/* ── نسخه دسکتاپ (گرید 4 ستونه + دکمه اسکرول ناوبری) ── */}
        <div className="relative mt-8 hidden lg:block">
          <div className="grid grid-cols-4 gap-6">
            {AGENCIES.map((agency, index) => (
              <Reveal
                key={agency.id}
                variant={["wipe", "focus", "drift", "rise"][index % 4]}
                delay={index * 0.08}
              >
                <AgencyCard agency={agency} onOpen={openAgency} />
              </Reveal>
            ))}
          </div>

          {/* دکمه ناوبری سمت چپ دسکتاپ (مطابق عکس فیگما) */}
          <button
            type="button"
            onClick={scrollNext}
            aria-label="آژانس‌های بیشتر"
            className="absolute -left-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-gray-4 bg-white text-gray-11 shadow-md transition-all hover:border-primary hover:text-primary active:scale-95"
          >
            <ArrowLeft2 size="22" color="currentColor" />
          </button>
        </div>

        {/* ── نسخه موبایل (کاروسل اسکرولی مطابق با تصویر موبایل) ── */}
        <div className="relative mt-6 lg:hidden">
          <div
            ref={trackRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 py-2"
          >
            {AGENCIES.map((agency) => (
              <div
                key={agency.id}
                className="w-[72%] shrink-0 snap-center sm:w-[48%]"
              >
                <AgencyCard agency={agency} onOpen={openAgency} />
              </div>
            ))}
          </div>

          {/* دکمه اسکرول چپ موبایل */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={scrollNext}
              aria-label="اسلاید بعدی"
              className="absolute left-1 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-gray-3 bg-white/95 text-gray-11 shadow-md backdrop-blur-sm transition-transform active:scale-95"
            >
              <ArrowLeft2 size="20" color="currentColor" />
            </button>
          )}
        </div>
      </div>

      {/* پاپ‌آپ اطلاعات آژانس */}
      {activeAgency && (
        <AgencyModal
          agency={activeAgency.agency}
          originRect={activeAgency.rect}
          returnFocusTo={activeAgency.trigger}
          onClose={closeAgency}
        />
      )}
    </section>
  );
}
