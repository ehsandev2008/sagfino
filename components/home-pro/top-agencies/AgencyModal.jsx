"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Add, Call } from "iconsax-react";
import { toEnglishDigits, toFaDigits } from "@/lib/auth";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** عنوان پاپ‌آپ: «مشاور املاک توسی» ← «املاک توسی» */
function getModalTitle(agency) {
  return agency.modalName ?? agency.name.replace(/^مشاور\s+املاک\s+/, "املاک ");
}

/**
 * پاپ‌آپ اطلاعات آژانس (تمام‌صفحه)
 * با انیمیشن GSAP از محل کارت کلیک‌شده باز و به همان سمت بسته می‌شود.
 */
export default function AgencyModal({ agency, originRect, returnFocusTo, onClose }) {
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const overlayRef = useRef(null);
  const shellRef = useRef(null);
  const contentRef = useRef(null);
  const closeBtnRef = useRef(null);
  const logoRef = useRef(null);
  const titleRef = useRef(null);
  const phonesRef = useRef(null);
  const previousFocusRef = useRef(null);
  const reducedRef = useRef(false);
  const closingRef = useRef(false);
  const introTlRef = useRef(null);

  const handleClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;

    // اگر کاربر وسط انیمیشن ورود دکمه بستن را بزند
    introTlRef.current?.kill();

    if (reducedRef.current) {
      onClose?.();
      return;
    }

    const shell = shellRef.current;
    const overlay = overlayRef.current;
    const content = contentRef.current;
    const closeBtn = closeBtnRef.current;

    const tl = gsap.timeline({
      onComplete: () => onClose?.(),
      defaults: { ease: "power2.inOut" },
    });

    tl.to([content, closeBtn], {
      opacity: 0,
      duration: 0.18,
      ease: "power1.in",
    });

    if (shell && originRect) {
      const vw = window.innerWidth || 1;
      const vh = window.innerHeight || 1;
      const scaleX = Math.min(Math.max(originRect.width / vw, 0.02), 1);
      const scaleY = Math.min(Math.max(originRect.height / vh, 0.02), 1);

      tl.to(
        shell,
        {
          x: originRect.left,
          y: originRect.top,
          scaleX,
          scaleY,
          borderRadius: 24,
          duration: 0.5,
          ease: "power3.inOut",
        },
        0.06
      );
      tl.to(
        overlay,
        { opacity: 0, duration: 0.32, ease: "power1.out" },
        0.2
      );
    } else {
      tl.to(shell, { opacity: 0, duration: 0.25 }, 0);
      tl.to(overlay, { opacity: 0, duration: 0.25 }, 0);
    }
  }, [onClose, originRect]);

  // انیمیشن ورود + بازگرداندن فوکوس به کارت بعد از بسته شدن
  useGSAP(
    () => {
      previousFocusRef.current = document.activeElement;
      reducedRef.current = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const shell = shellRef.current;
      const overlay = overlayRef.current;
      const content = contentRef.current;
      const closeBtn = closeBtnRef.current;
      const logo = logoRef.current;
      const title = titleRef.current;
      const phones = phonesRef.current;

      const vw = window.innerWidth || 1;
      const vh = window.innerHeight || 1;
      const rect = originRect ?? { left: vw / 2, top: vh / 2, width: 0, height: 0 };
      const scaleX = Math.min(Math.max(rect.width / vw, 0.001), 1);
      const scaleY = Math.min(Math.max(rect.height / vh, 0.001), 1);

      gsap.set(shell, {
        transformOrigin: "top left",
        x: rect.left,
        y: rect.top,
        scaleX,
        scaleY,
        borderRadius: 24,
      });
      gsap.set(overlay, { opacity: 0 });
      gsap.set(content, { opacity: 0 });
      gsap.set(closeBtn, { opacity: 0, scale: 0.8 });

      const tl = gsap.timeline();

      if (reducedRef.current) {
        gsap.set(shell, {
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          borderRadius: 0,
        });
        gsap.set(overlay, { opacity: 1 });
        gsap.set([content, closeBtn], { opacity: 1, scale: 1 });
      } else {
        tl.to(
          overlay,
          { opacity: 1, duration: 0.3, ease: "power2.out" },
          0
        )
          .to(
            shell,
            {
              x: 0,
              y: 0,
              scaleX: 1,
              scaleY: 1,
              borderRadius: 0,
              duration: 0.72,
              ease: "expo.out",
            },
            0
          )
          .to(
            closeBtn,
            { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" },
            0.3
          )
          .to(
            content,
            { opacity: 1, duration: 0.2, ease: "power1.out" },
            0.32
          )
          .from(
            logo,
            { opacity: 0, scale: 0.9, y: 14, duration: 0.55, ease: "power3.out" },
            0.34
          )
          .from(
            title,
            { opacity: 0, y: 14, duration: 0.45, ease: "power3.out" },
            0.44
          )
          .from(
            phones?.children ?? [],
            {
              opacity: 0,
              y: 18,
              duration: 0.45,
              stagger: 0.09,
              ease: "power3.out",
            },
            0.52
          );
      }

      introTlRef.current = tl;

      const focusTimer = window.setTimeout(() => {
        panelRef.current?.focus({ preventScroll: true });
      }, 40);

      return () => {
        window.clearTimeout(focusTimer);
        tl.kill();
        const target =
          returnFocusTo?.isConnected ? returnFocusTo : previousFocusRef.current;
        target?.focus?.({ preventScroll: true });
      };
    },
    { scope: rootRef }
  );

  // قفل اسکرول، Escape و نگه‌داشتن فوکوس داخل پاپ‌آپ
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      const nodes = Array.from(panel?.querySelectorAll(FOCUSABLE) ?? []).filter(
        (node) => node.offsetParent !== null
      );

      if (!nodes.length) {
        event.preventDefault();
        panel?.focus();
        return;
      }

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      const outside = !panel?.contains(active);

      if (event.shiftKey && (active === first || active === panel || outside)) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (active === last || active === panel || outside)
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [handleClose]);

  if (typeof document === "undefined") return null;

  const phones = agency.phones ?? [];

  return createPortal(
    <div ref={rootRef} className="fixed inset-0 z-[80]">
      {/* پرده تاریک پشت پنل */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="absolute inset-0 bg-gray-13/50"
      />

      {/* پوسته سفید که با FLIP از کارت تا تمام‌صفحه باز می‌شود */}
      <div
        ref={shellRef}
        aria-hidden="true"
        className="absolute inset-0 bg-white will-change-transform"
      />

      {/* محتوای پاپ‌آپ */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="agency-modal-title"
        tabIndex={-1}
        dir="rtl"
        className="absolute inset-0 flex items-center justify-center overflow-y-auto px-6 pb-12 pt-24 outline-none lg:px-10"
      >
        <button
          ref={closeBtnRef}
          type="button"
          onClick={handleClose}
          aria-label="بستن اطلاعات آژانس"
          className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-gray-4 bg-white text-gray-10 shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-colors hover:border-gray-6 hover:text-gray-13 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 lg:left-8 lg:top-8 lg:h-12 lg:w-12"
        >
          <Add
            size="22"
            variant="Linear"
            color="currentColor"
            className="rotate-45"
          />
        </button>

        <div
          ref={contentRef}
          className="flex w-full max-w-[420px] flex-col items-center text-center"
        >
          {/* لوگوی بزرگ آژانس */}
          <div
            ref={logoRef}
            className="flex h-[156px] w-[156px] items-center justify-center lg:h-[200px] lg:w-[200px]"
          >
            <Image
              src={agency.logo}
              alt={agency.name}
              width={340}
              height={240}
              className="h-full w-full object-contain"
            />
          </div>

          {/* نام آژانس */}
          <h2
            id="agency-modal-title"
            ref={titleRef}
            className="mt-6 text-h4 font-bold text-gray-13 lg:mt-8 lg:text-h3"
          >
            {getModalTitle(agency)}
          </h2>

          {/* شماره‌های تماس */}
          {phones.length > 0 && (
            <div
              ref={phonesRef}
              className="mt-10 flex flex-col items-center gap-4 lg:mt-14 lg:gap-6"
            >
              {phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${toEnglishDigits(phone)}`}
                  dir="ltr"
                  className="group flex items-center gap-3 rounded-xl px-3 py-1.5 transition-colors hover:bg-gray-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <Call
                    size="22"
                    variant="Bold"
                    color="#2B66FF"
                    className="shrink-0"
                  />
                  <span className="text-body-s font-semibold text-gray-12 transition-colors group-hover:text-primary lg:text-h5">
                    {toFaDigits(phone)}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
