"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "motion/react";
import {
  AddSquare,
  CloseCircle,
  Document,
  HambergerMenu,
  Heart,
  House2,
  Logout,
  Profile,
  Receipt,
  Setting2,
} from "iconsax-react";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";

const NAV_LINKS = [
  { label: "اجاره", href: "/rent" },
  { label: "خرید", href: "/buy" },
  { label: "املاک و مستغلات", href: "/properties" },
  { label: "مشاورین املاک", href: "/agents" },
  { label: "اخبار روز", href: "/news" },
];

const USER_MENU = [
  { label: "پروفایل من", href: "/profile", Icon: Profile },
  { label: "ملک‌های نشان‌شده", href: "/saved", Icon: Heart },
  { label: "آگهی‌های من", href: "/my-ads", Icon: Document },
  { label: "ثبت آگهی", href: "/new-ad", Icon: AddSquare },
  { label: "املاک و مستغلات", href: "/properties", Icon: House2 },
  { label: "پیش‌فاکتورهای من", href: "/invoices", Icon: Receipt },
  { label: "تنظیمات", href: "/settings", Icon: Setting2 },
];

/**
 * هدر شناور: باکس جدا از صفحه با گوشه نرم، عرض ۸۰٪ وسط صفحه.
 * با اسکرول به پایین مخفی و با اسکرول به بالا نمایان می‌شود.
 */
export default function Header() {
  const { isLoggedIn, user, openLogin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 140);
  });

  const close = () => setMenuOpen(false);
  const handleLogout = () => {
    logout();
    close();
  };

  return (
    <>
      <motion.header
        animate={{ y: hidden && !menuOpen ? "-140%" : "0%" }}
        transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
        className="fixed inset-x-0 top-3 z-50 mx-auto w-[calc(100%-1.5rem)] rounded-xl border border-gray-5 bg-white/95 backdrop-blur-md lg:top-5 lg:w-[80%] lg:rounded-[20px]"
      >
        <div className="px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-20">
            {/* موبایل: همبرگر | دسکتاپ: لوگو */}
            <div className="flex items-center">
              <motion.button
                type="button"
                aria-label={menuOpen ? "بستن منو" : "باز کردن منو"}
                onClick={() => setMenuOpen((v) => !v)}
                whileTap={{ scale: 0.88 }}
                className="flex h-10 w-10 items-center justify-center rounded-md text-black lg:hidden"
              >
                <motion.span animate={{ rotate: menuOpen ? 90 : 0 }} transition={{ duration: 0.25 }} className="flex">
                  <HambergerMenu size="24" color="#0C0C0C" />
                </motion.span>
              </motion.button>
              <div className="hidden lg:block">
                <Logo />
              </div>
            </div>

            {/* موبایل: لوگو وسط */}
            <div className="lg:hidden">
              <Logo />
            </div>

            {/* دسکتاپ: ناوبری وسط */}
            <nav aria-label="ناوبری اصلی" className="hidden lg:block">
              <ul className="flex items-center gap-8">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="nav-link text-body-xs text-gray-11 transition-colors hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* اکشن‌ها */}
            <div className="flex items-center gap-4 lg:gap-6">
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={openLogin}
                  className="hidden items-center gap-2 text-body-xs text-gray-11 transition-colors hover:text-primary lg:flex"
                >
                  <Profile size="22" color="currentColor" />
                  پروفایل
                </button>
              ) : (
                <button
                  type="button"
                  onClick={openLogin}
                  className="hidden text-body-xs text-gray-11 transition-colors hover:text-primary lg:block"
                >
                  ورود
                </button>
              )}
              <motion.span whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex">
                <Link
                  href="/new-ad"
                  className="rounded-full border border-primary px-4 py-2 text-button-s text-primary transition-colors hover:bg-primary hover:text-white lg:rounded-md lg:px-6 lg:py-2.5 lg:text-button-lg"
                >
                  ثبت آگهی
                </Link>
              </motion.span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* منوی موبایل */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
              onClick={close}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              className="absolute inset-y-0 right-0 flex w-[86%] max-w-[340px] flex-col overflow-hidden bg-white shadow-2xl"
            >
              {/* سربرگ مودال */}
              <div className="flex items-center justify-between border-b border-gray-3 px-5 py-4">
                <Logo />
                <motion.button
                  type="button"
                  aria-label="بستن منو"
                  onClick={close}
                  whileTap={{ scale: 0.88 }}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-gray-9 transition-colors hover:bg-gray-2 hover:text-black"
                >
                  <CloseCircle size="22" color="currentColor" />
                </motion.button>
              </div>

              {/* پروفایل کاربر در حالت لاگین */}
              {isLoggedIn && (
                <div className="flex items-center gap-3 border-b border-gray-3 bg-gray-1 px-5 py-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white">
                    <Profile size="22" color="currentColor" variant="Bold" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-body-xs font-bold text-black">
                      {user?.phone ? user.phone.replace(/^0/, "+98 ") : "پروفایل"}
                    </p>
                    <p className="text-caption-md text-gray-9">کاربر سقفینو</p>
                  </div>
                </div>
              )}

              <div className="flex-1 overflow-y-auto px-3 py-4">
                {/* بخش کاربر */}
                {isLoggedIn && (
                  <section className="mb-4">
                    <p className="px-2 pb-2 text-caption-md text-gray-7">حساب کاربری</p>
                    <ul className="flex flex-col gap-1">
                      {USER_MENU.map((item, i) => {
                        const Icon = item.Icon;
                        return (
                          <motion.li
                            key={item.href}
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.06 + i * 0.04, duration: 0.3 }}
                          >
                            <Link
                              href={item.href}
                              onClick={close}
                              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-body-xs text-gray-11 transition-colors hover:bg-primary-tint-1 hover:text-primary"
                            >
                              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-2 text-gray-10">
                                <Icon size="20" color="currentColor" />
                              </span>
                              {item.label}
                            </Link>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </section>
                )}

                {/* ناوبری اصلی */}
                <section className={isLoggedIn ? "border-t border-gray-3 pt-4" : ""}>
                  <p className="px-2 pb-2 text-caption-md text-gray-7">منوی اصلی</p>
                  <ul className="flex flex-col gap-1">
                    {NAV_LINKS.map((link, i) => (
                      <motion.li
                        key={link.href}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.04 + i * 0.04, duration: 0.3 }}
                      >
                        <Link
                          href={link.href}
                          onClick={close}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-body-xs text-gray-11 transition-colors hover:bg-primary-tint-1 hover:text-primary"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-gray-5" />
                          {link.label}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </section>
              </div>

              {/* پاورقی مودال */}
              <div className="border-t border-gray-3 p-4">
                {isLoggedIn ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-4 py-2.5 text-body-xs text-gray-11 transition-colors hover:border-error/40 hover:bg-error-light-2 hover:text-error"
                  >
                    <Logout size="20" color="currentColor" />
                    خروج از حساب
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      openLogin();
                    }}
                    className="w-full rounded-xl bg-primary py-3 text-button-lg text-white transition-colors hover:bg-primary-shade-1"
                  >
                    ورود یا ثبت‌نام
                  </button>
                )}
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
