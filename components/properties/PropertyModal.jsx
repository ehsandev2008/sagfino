"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { CloseCircle } from "iconsax-react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * پوستهٔ مشترک پاپ‌آپ‌های صفحهٔ جزئیات آگهی:
 * پردهٔ تاریک، انیمیشن باز/بسته شدن، قفل اسکرول، بستن با Escape،
 * محدود ماندن فوکوس داخل پاپ‌آپ و بازگرداندن فوکوس پس از بستن.
 */
export default function PropertyModal({
  open,
  onClose,
  labelledBy,
  children,
  maxWidth = "max-w-[480px]",
}) {
  const panelRef = useRef(null);
  const previousFocusRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;

    previousFocusRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current?.();
        return;
      }
      if (event.key !== "Tab") return;

      const nodes = Array.from(
        panelRef.current?.querySelectorAll(FOCUSABLE) ?? []
      ).filter((node) => node.offsetParent !== null);

      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const focusTimer = window.setTimeout(() => {
      const first = panelRef.current?.querySelector(FOCUSABLE);
      (first ?? panelRef.current)?.focus?.({ preventScroll: true });
    }, 140);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
      const target = previousFocusRef.current;
      if (target?.isConnected) target.focus?.({ preventScroll: true });
    };
  }, [open]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          dir="rtl"
          className="fixed inset-0 z-[75] flex items-end justify-center sm:items-center sm:p-4"
        >
          <motion.div
            aria-hidden="true"
            onClick={() => onCloseRef.current?.()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-0 bg-gray-13/55 backdrop-blur-[3px]"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            tabIndex={-1}
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: 22,
              scale: 0.97,
              transition: { duration: 0.18 },
            }}
            transition={{ duration: 0.34, ease: [0.32, 0.72, 0, 1] }}
            className={`relative z-10 w-full overflow-hidden rounded-t-3xl bg-white shadow-[0_24px_80px_rgba(12,12,12,0.28)] outline-none sm:rounded-3xl ${maxWidth}`}
          >
            <div className="max-h-[92dvh] overflow-y-auto overscroll-contain p-6 sm:p-7">
              {children}
            </div>

            <button
              type="button"
              aria-label="بستن"
              onClick={() => onCloseRef.current?.()}
              className="absolute left-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-gray-9 backdrop-blur-sm transition-colors hover:bg-gray-2 hover:text-gray-13 sm:left-4 sm:top-4"
            >
              <CloseCircle size="26" color="currentColor" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
