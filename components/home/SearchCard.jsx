"use client";

import { SearchNormal1 } from "iconsax-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const TABS = [
  { id: "rent", label: "اجاره" },
  { id: "buy", label: "خرید" },
];

/**
 * کارت جست‌وجوی هیرو: تب اجاره/خرید + فیلد جست‌وجوی شهر
 */
export default function SearchCard() {
  const [tab, setTab] = useState("rent");
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: با ساخته شدن صفحه نتایج، مقصد نهایی را تنظیم کن
    router.push(
      `/properties?deal=${tab}&q=${encodeURIComponent(query.trim())}`,
    );
  };

  return (
    <div className="mx-auto w-full max-w-[680px] rounded-2xl bg-white p-4 shadow-[0_24px_60px_-20px_rgba(12,12,12,0.45)] lg:p-6">
      {/* تب‌ها */}
      <div
        role="tablist"
        aria-label="نوع معامله"
        className="grid grid-cols-2 border-b border-gray-4"
      >
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => setTab(t.id)}
              className={`relative pb-3 cursor-pointer text-button-lg transition-colors ${
                active ? "text-black" : "text-gray-8 hover:text-gray-11"
              }`}
            >
              {t.label}
              {active && (
                <motion.span
                  layoutId="hero-search-tab"
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  className="absolute -bottom-px right-0 h-[3px] w-full rounded-full bg-primary"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* فیلد جست‌وجو */}
      <form
        onSubmit={handleSubmit}
        role="search"
        className="mt-2 flex items-center gap-3 px-1 py-3"
      >
        <button
          type="submit"
          aria-label="جست‌وجو"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-primary-tint-1"
        >
          <SearchNormal1 size="24" color="#353535" />
        </button>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="search"
          placeholder="شهر مورد نظر را جست‌وجو کنید"
          aria-label="شهر مورد نظر را جست‌وجو کنید"
          className="w-full bg-transparent text-body-xs text-black outline-none placeholder:text-gray-7"
        />
      </form>
    </div>
  );
}
