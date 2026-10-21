"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * ریویل اسکرولی ساده و متنوع با GSAP
 * @param {"wipe" | "focus" | "drift" | "rise"} variant
 */
const PRESETS = {
  // بالا آمدن کوتاه
  wipe: {
    from: { y: 20, opacity: 0 },
    to: { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" },
  },
  // نمایان شدن با زوم خیلی خفیف
  focus: {
    from: { scale: 0.97, opacity: 0 },
    to: { scale: 1, opacity: 1, duration: 0.7, ease: "power2.out" },
  },
  // لغزش کوتاه افقی (هم‌جهت با راست‌به‌چپ)
  drift: {
    from: { x: 24, opacity: 0 },
    to: { x: 0, opacity: 1, duration: 0.7, ease: "power2.out" },
  },
  // محو ساده (برای تیترها)
  rise: {
    from: { opacity: 0 },
    to: { opacity: 1, duration: 0.6, ease: "power1.out" },
  },
};

export default function Reveal({ variant = "wipe", delay = 0, className = "", children }) {
  const ref = useRef(null);
  const preset = PRESETS[variant] ?? PRESETS.wipe;

  useGSAP(
    () => {
      gsap.fromTo(ref.current, preset.from, {
        ...preset.to,
        delay,
        scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
      });
    },
    { scope: ref, dependencies: [variant, delay] }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
