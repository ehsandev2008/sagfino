"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bookmark } from "iconsax-react";
import Reveal from "../ui/Reveal";

const ITEMS = [
  {
    image: "/imags/rent images/pexels-vecislavas-popa-1571468 1.webp",
    time: "۲ ساعت پیش",
    title: "رهن و اجاره آپارتمان تهران",
    address: "۱۳۸ متر، ساقدوش، بنی فاطمه، گلستان",
    deposit: "۱ میلیارد تومان رهن",
    rent: "۳۰ میلیون تومان اجاره",
    href: "/properties/1",
  },
  {
    image: "/imags/rent images/pexels-john-tekeridis-1428348.webp",
    time: "۲ ساعت پیش",
    title: "رهن و اجاره آپارتمان تهران",
    address: "۱۱۰ متر، چیذر، سلیمی",
    deposit: "۳۰۰ میلیون تومان رهن",
    rent: "۲۵ میلیون تومان اجاره",
    href: "/properties/2",
  },
  {
    image: "/imags/rent images/pexels-vecislavas-popa-1743227.webp",
    time: "۲ ساعت پیش",
    title: "رهن و اجاره آپارتمان تهران",
    address: "۱۲۰ متر، محدوده پاسداران، دیباجی",
    deposit: "۶۰۰ میلیون تومان رهن",
    rent: "۳۱ میلیون تومان اجاره",
    href: "/properties/3",
  },
  {
    image: "/imags/rent images/unsplash_9rYfG8sWRVo.webp",
    time: "۲ ساعت پیش",
    title: "رهن و اجاره آپارتمان تهران",
    address: "۱۵۰ متر، پاسداران، قبا",
    deposit: "۵۰۰ میلیون تومان رهن",
    rent: "۴۰ میلیون تومان اجاره",
    href: "/properties/4",
  },
  {
    image: "/imags/rent images/unsplash_mGZX2MOPR-s.webp",
    time: "۲ ساعت پیش",
    title: "رهن و اجاره آپارتمان تهران",
    address: "۱۱۰ متر، هروی، کلید نخورده",
    deposit: "۵۰۰ میلیون تومان رهن",
    rent: "۲۵ میلیون تومان اجاره",
    href: "/properties/5",
  },
  {
    image: "/imags/rent images/unsplash_XyGvEj587Mc.webp",
    time: "۲ ساعت پیش",
    title: "رهن و اجاره آپارتمان تهران",
    address: "۲۰۰ متر، گیشا، بلوار نصر",
    deposit: "۹۰۰ میلیون تومان رهن",
    rent: "۱۵ میلیون تومان اجاره",
    href: "/properties/6",
  },
  {
    image: "/imags/rent images/unsplash_tHkJAMcO3QE.webp",
    time: "۲ ساعت پیش",
    title: "رهن و اجاره آپارتمان تهران",
    address: "۱۲۰ متر، پاسداران، دیباجی",
    deposit: "۶۰۰ میلیون تومان رهن",
    rent: "۳۱ میلیون تومان اجاره",
    href: "/properties/7",
  },
  {
    image: "/imags/rent images/unsplash_hCU4fimRW-c.webp",
    time: "۲ ساعت پیش",
    title: "رهن و اجاره آپارتمان تهران",
    address: "۸۰ متر، محدوده پاسدارن، مکران جنوبی",
    deposit: "۴۰۰ میلیون تومان رهن",
    rent: "۱۵ میلیون تومان اجاره",
    href: "/properties/8",
  },
];

/** جدیدترین خانه‌های اجاره‌ای تهران — صفحه Home Pro User (مطابق با کامپوننت فیگما) */
export default function RentListings() {
  const [saved, setSaved] = useState({});

  return (
    <section className="bg-white py-10 lg:py-14">
      <div className="mx-auto w-[calc(100%-1.5rem)] lg:w-[80%]">
        <Reveal variant="rise">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-h5 text-black lg:text-h3">
              جدیدترین خانه‌های اجاره‌ای تهران
            </h2>
            <Link
              href="/properties?deal=rent&city=tehran&sort=newest"
              className="nav-link shrink-0 text-button-md text-gray-10"
            >
              مشاهده همه
            </Link>
          </div>
        </Reveal>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:mt-8 lg:grid-cols-4 lg:gap-6">
          {ITEMS.map((item, i) => (
            <Reveal key={item.href} variant={["wipe", "focus", "drift", "rise"][i % 4]} delay={(i % 4) * 0.06}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-4 bg-white transition-all duration-300 hover:border-gray-6 hover:shadow-md">
                {/* ── عکس ملک ── */}
                <div className="relative aspect-[288/169] w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* بج زمان (بالا سمت چپ مطابق فیگما) */}
                  <span className="absolute left-3 top-3 flex items-center justify-center rounded-[4px] bg-black/40 px-2 py-1 text-caption-md text-white backdrop-blur-sm lg:text-body-xs">
                    {item.time}
                  </span>
                </div>

                {/* ── اطلاعات کارت (Card Info) ── */}
                <div className="flex flex-1 flex-col pt-2.5 px-3.5 pb-5 lg:pb-6">
                  <div className="flex flex-1 flex-col gap-1">
                    {/* ردیف عنوان و بوکمارک */}
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="truncate text-body-xxs font-normal text-gray-8 lg:text-body-xs">
                        {item.title}
                      </h3>
                      <button
                        type="button"
                        aria-label={saved[item.href] ? "حذف از نشان‌شده‌ها" : "افزودن به نشان‌شده‌ها"}
                        onClick={() => setSaved((v) => ({ ...v, [item.href]: !v[item.href] }))}
                        className="shrink-0 text-gray-8 transition-colors hover:text-primary"
                      >
                        <Bookmark
                          size="24"
                          color="currentColor"
                          variant={saved[item.href] ? "Bold" : "Linear"}
                        />
                      </button>
                    </div>

                    {/* متراژ و آدرس */}
                    <p className="truncate text-body-xxs font-normal text-gray-10 lg:text-body-xs">
                      {item.address}
                    </p>

                    {/* مقدار رهن */}
                    <p className="text-body-xxs font-bold text-gray-11 lg:text-body-xs">
                      {item.deposit}
                    </p>

                    {/* مقدار اجاره */}
                    <p className="text-body-xxs font-bold text-gray-11 lg:text-body-xs">
                      {item.rent}
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
