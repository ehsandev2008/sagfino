"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "../anim/gsap";
import SearchCard from "../home/SearchCard";

/**
 * هیروسکشن صفحه اصلی کاربر وارد شده (Home Pro User)
 * عین هیروسکشن پیش‌فرض صفحه اصلی (hero.webp)
 */
export default function HeroProSection() {
  const root = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".hero-bg",
        { scale: 1.15 },
        { scale: 1, duration: 2, ease: "power2.out" },
        0,
      )
        .fromTo(
          ".hero-title .line-inner",
          { yPercent: 115, rotate: 2.5 },
          { yPercent: 0, rotate: 0, duration: 1.05, stagger: 0.12 },
          0.15,
        )
        .fromTo(
          ".hero-sub",
          { opacity: 0, y: 18, filter: "blur(8px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8 },
          0.55,
        )
        .fromTo(
          ".hero-card",
          { opacity: 0, y: 44, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "back.out(1.5)" },
          0.7,
        );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative -mt-24 overflow-hidden bg-[#141414] lg:-mt-32"
    >
      {/* عکس پس‌زمینه */}
      <div className="hero-bg absolute inset-0">
        <Image
          src="/imags/hero.webp"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      {/* اورلی تیره برای خوانایی متن */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/60"
      />

      <div className="relative mx-auto w-[calc(100%-1.5rem)] pb-14 pt-36 lg:w-[80%] lg:pb-24 lg:pt-60">
        <div className="flex flex-col items-center text-center">
          <h1 className="hero-title text-h4 font-bold text-white lg:text-display-2">
            <span className="block overflow-hidden pb-1">
              <span className="line-inner block">سقفینو؛ سقفی برای همه</span>
            </span>
          </h1>

          <p className="hero-sub mt-4 max-w-2xl text-body-xxs leading-8 text-white/90 lg:text-body-regular">
            آسانی و سرعت در پیدا کردن یک سقف تازه را در سقفینو تجربه کنید
          </p>

          <div className="hero-card mt-8 w-full lg:mt-10">
            <SearchCard />
          </div>
        </div>
      </div>
    </section>
  );
}
