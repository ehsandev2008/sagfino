"use client";

import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CloseCircle, InfoCircle, TickCircle } from "iconsax-react";
import { toast } from "./toast";

const POSITION_CLASSES = {
  "top-center": "top-24 left-1/2 -translate-x-1/2 items-center",
  "top-right": "top-24 right-4 items-end",
  "top-left": "top-24 left-4 items-start",
  "bottom-center": "bottom-6 left-1/2 -translate-x-1/2 items-center",
  "bottom-right": "bottom-6 right-4 items-end",
  "bottom-left": "bottom-6 left-4 items-start",
};

const EMPTY_SNAPSHOT = [];

const TYPE_STYLES = {
  success: {
    Icon: TickCircle,
    iconClass: "bg-success text-white",
    borderClass: "border-success/30",
    barClass: "bg-success",
  },
  error: {
    Icon: CloseCircle,
    iconClass: "bg-error text-white",
    borderClass: "border-error/30",
    barClass: "bg-error",
  },
  info: {
    Icon: InfoCircle,
    iconClass: "bg-primary text-white",
    borderClass: "border-primary/30",
    barClass: "bg-primary",
  },
  blank: {
    Icon: InfoCircle,
    iconClass: "bg-gray-10 text-white",
    borderClass: "border-gray-4",
    barClass: "bg-gray-6",
  },
  loading: {
    Icon: null,
    iconClass: "",
    borderClass: "border-gray-4",
    barClass: "",
  },
};

function ToastItem({ item, fromTop, duration }) {
  const { Icon, iconClass, borderClass, barClass } =
    TYPE_STYLES[item.type] ?? TYPE_STYLES.blank;

  return (
    <motion.div
      layout
      role="status"
      initial={{ opacity: 0, y: fromTop ? -24 : 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.18 } }}
      transition={{ type: "spring", stiffness: 400, damping: 32 }}
      className={`pointer-events-auto relative w-full overflow-hidden rounded-2xl border bg-white/95 shadow-[0_20px_50px_-16px_rgba(12,12,12,0.35)] backdrop-blur-md ${borderClass}`}
    >
      <div className="flex items-start gap-3 p-3.5">
        {item.type === "loading" ? (
          <span
            aria-hidden="true"
            className="h-6 w-6 shrink-0 animate-spin rounded-full border-2 border-gray-4 border-t-primary"
          />
        ) : (
          Icon && (
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
            >
              <Icon size="22" color="currentColor" variant="Bold" />
            </span>
          )
        )}
        <p className="min-w-0 flex-1 pt-1.5 text-body-xxs font-medium leading-7 text-gray-12">
          {item.message}
        </p>
        <button
          type="button"
          aria-label="بستن اعلان"
          onClick={() => toast.dismiss(item.id)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xl leading-none text-gray-8 transition-colors hover:bg-gray-2 hover:text-black"
        >
          ×
        </button>
      </div>
      {duration !== Infinity && (
        <motion.span
          aria-hidden="true"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: duration / 1000, ease: "linear" }}
          style={{ transformOrigin: "right" }}
          className={`absolute bottom-0 right-0 h-[3px] w-full ${barClass}`}
        />
      )}
    </motion.div>
  );
}

/**
 * رندرر toastها — یک‌بار در layout قرار می‌گیرد
 * @param {"top-center"|"top-right"|"top-left"|"bottom-center"|"bottom-right"|"bottom-left"} position
 * @param {number} duration - تاخیر پیش‌فرض بسته شدن (ms)
 */
export default function Toaster({ position = "top-center", duration = 4000 }) {
  const all = useSyncExternalStore(toast._subscribe, toast._getSnapshot, () => EMPTY_SNAPSHOT);
  const timers = useRef(new Map());

  useEffect(() => {
    const alive = new Set(all.map((t) => t.id));
    timers.current.forEach((timer, id) => {
      if (!alive.has(id)) {
        clearTimeout(timer);
        timers.current.delete(id);
      }
    });
    all.forEach((t) => {
      const d = t.duration ?? duration;
      if (d === Infinity || timers.current.has(t.id)) return;
      timers.current.set(
        t.id,
        setTimeout(() => {
          toast.dismiss(t.id);
          timers.current.delete(t.id);
        }, d)
      );
    });
  }, [all, duration]);

  const groups = useMemo(() => {
    const map = new Map();
    all.forEach((t) => {
      const key = t.position ?? position;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(t);
    });
    return [...map.entries()];
  }, [all, position]);

  return (
    <>
      {groups.map(([pos, items]) => (
        <div
          key={pos}
          aria-live="polite"
          className={`pointer-events-none fixed z-[80] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 ${POSITION_CLASSES[pos] ?? POSITION_CLASSES["top-center"]}`}
        >
          <AnimatePresence>
            {items.map((item) => (
              <ToastItem
                key={item.id}
                item={item}
                fromTop={!pos.startsWith("bottom")}
                duration={item.duration ?? duration}
              />
            ))}
          </AnimatePresence>
        </div>
      ))}
    </>
  );
}
