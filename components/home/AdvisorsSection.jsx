"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import Reveal from "../ui/Reveal";

const ITEMS = [
  {
    image: "/imags/feat-pin.webp",
    text: "امکان خرید و اجاره ملک در اکثر نقاط کشور",
  },
  {
    image: "/imags/feat-time.webp",
    text: "مقایسه و بررسی صدها ملک براحتی و در کمترین زمان",
  },
  {
    image: "/imags/feat-team.webp",
    text: "ارتباط آسان با برترین املاک و مشاورین کشور",
  },
];

/**
 * سکشن مشاوران سقفینو — دسکتاپ: ۳ ستون / موبایل: کاروسل
 */
export default function AdvisorsSection() {
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number(entry.target.dataset.index));
        });
      },
      { root: track, threshold: 0.6 }
    );
    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const goTo = (index) => {
    const clamped = Math.max(0, Math.min(ITEMS.length - 1, index));
    cardRefs.current[clamped]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  return (
    <section className="bg-white pb-14 lg:pb-20">
      <div className="mx-auto w-[calc(100%-1.5rem)] lg:w-[80%]">
        <Reveal variant="rise">
          <h2 className="text-center text-h5 font-bold text-black lg:text-h3">
            همه به شما مشاوره می‌دهند!
          </h2>
          <p className="mt-3 text-center text-body-xxs text-black lg:text-body-xs">
            اما در سقفینو مشاوران املاک کنار شما می‌مانند
          </p>
        </Reveal>

        {/* موبایل: کاروسل | دسکتاپ: گرید */}
        <div
          ref={trackRef}
          className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:mt-10 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:pb-0"
        >
          {ITEMS.map((item, i) => (
            <div
              key={item.text}
              data-index={i}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="w-[74%] shrink-0 snap-center sm:w-[52%] lg:w-auto"
            >
              <Reveal variant={["wipe", "focus", "drift"][i % 3]} delay={i * 0.08}>
                <article className="flex h-full flex-col items-center rounded-2xl border border-gray-4 bg-white p-6 text-center shadow-[0_8px_30px_-16px_rgba(12,12,12,0.18)]">
                  <div className="flex h-28 items-center justify-center">
                    <Image
                      src={item.image}
                      alt=""
                      width={200}
                      height={112}
                      className="h-full w-auto object-contain"
                    />
                  </div>
                  <p className="mt-5 text-body-xs leading-8 text-black">{item.text}</p>
                </article>
              </Reveal>
            </div>
          ))}
        </div>

        {/* کنترل‌های کاروسل (فقط موبایل) */}
        <div className="mt-4 flex items-center justify-center gap-4 lg:hidden">
          <button
            type="button"
            aria-label="قبلی"
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-4 text-black transition-opacity disabled:opacity-30"
          >
            <ArrowRight2 size="20" color="currentColor" />
          </button>
          <div className="flex items-center gap-2" role="tablist" aria-label="اسلایدها">
            {ITEMS.map((item, i) => (
              <button
                key={item.text}
                type="button"
                role="tab"
                aria-selected={active === i}
                aria-label={`اسلاید ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  active === i ? "w-6 bg-primary" : "w-2 bg-gray-5"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="بعدی"
            onClick={() => goTo(active + 1)}
            disabled={active === ITEMS.length - 1}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-4 text-black transition-opacity disabled:opacity-30"
          >
            <ArrowLeft2 size="20" color="currentColor" />
          </button>
        </div>
      </div>
    </section>
  );
}
