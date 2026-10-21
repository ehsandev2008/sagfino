"use client";

import { ArrowDown2 } from "iconsax-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

/**
 * گروه لینک فوتر با دکمه «مشاهده بیشتر» واقعی و انیمیشن باز/بسته شدن
 */
export default function ExpandableGroup({ title, links, more = [] }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <h3 className="text-body-xs font-bold text-black lg:text-h6">{title}</h3>

      <ul className="mt-4 flex flex-col gap-3">
        {links.map((link) => (
          <li key={link}>
            <Link
              href="#"
              className="nav-link w-fit text-body-xxs text-gray-9 transition-colors hover:text-primary"
            >
              {link}
            </Link>
          </li>
        ))}
      </ul>

      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="flex flex-col gap-3 overflow-hidden"
          >
            <span className="pt-3" aria-hidden="true" />
            {more.map((link) => (
              <li key={link}>
                <Link
                  href="#"
                  className="nav-link w-fit text-body-xxs text-gray-9 transition-colors hover:text-primary"
                >
                  {link}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {more.length > 0 && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="mt-3 flex items-center cursor-pointer gap-1 text-button-s text-primary-shade-3 transition-colors hover:text-primary"
        >
          {open ? "بستن" : "مشاهده بیشتر"}
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex"
          >
            <ArrowDown2 size="16" color="currentColor" />
          </motion.span>
        </button>
      )}
    </div>
  );
}
