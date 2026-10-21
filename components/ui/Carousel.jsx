"use client";

import { Children, useEffect, useRef, useState } from "react";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";

/**
 * کاروسل عمومی: موبایل اسکرول snap + دکمه و دات، دسکتاپ گرید
 * @param {string} itemClassName - عرض آیتم در حالت کاروسل
 * @param {string} gridClass - کلاس گرید دسکتاپ (مثلا lg:grid-cols-4)
 */
export default function Carousel({
  children,
  itemClassName = "w-[74%] sm:w-[52%]",
  gridClass = "lg:grid-cols-3",
}) {
  const trackRef = useRef(null);
  const itemRefs = useRef([]);
  const [active, setActive] = useState(0);
  const count = Children.count(children);

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
    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [count]);

  const goTo = (index) => {
    const clamped = Math.max(0, Math.min(count - 1, index));
    itemRefs.current[clamped]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  return (
    <div>
      <div
        ref={trackRef}
        className={`no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:grid lg:gap-6 lg:overflow-visible lg:pb-0 ${gridClass}`}
      >
        {Children.map(children, (child, i) => (
          <div
            key={i}
            data-index={i}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className={`shrink-0 snap-center ${itemClassName} lg:w-auto`}
          >
            {child}
          </div>
        ))}
      </div>

      {count > 1 && (
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
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
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
            disabled={active === count - 1}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-4 text-black transition-opacity disabled:opacity-30"
          >
            <ArrowLeft2 size="20" color="currentColor" />
          </button>
        </div>
      )}
    </div>
  );
}
