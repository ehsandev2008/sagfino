import Image from "next/image";
import Link from "next/link";
import { Calendar, ProfileCircle } from "iconsax-react";
import Carousel from "../ui/Carousel";
import Reveal from "../ui/Reveal";

const POSTS = [
  {
    image: "/imags/blog/post-recession.webp",
    title: "رکود بازار مسکن؛ فروشندگان در انتظار خریداران هستند",
    date: "۱۸ مهر ۱۴۰۵",
    author: "تحریریه سقفینو",
    href: "/blog/housing-market-recession",
  },
  {
    image: "/imags/blog/post-tower.webp",
    title: "خطر ویرانی زلزله در آسمان‌خراش‌ها بیشتر است یا خانه‌های ویلایی؟",
    date: "۱۲ مهر ۱۴۰۵",
    author: "علی رضایی",
    href: "/blog/earthquake-highrise",
  },
  {
    image: "/imags/blog/post-interior.webp",
    title: "بازار کساد کسب‌وکار معماران داخلی در پی بالا رفتن قیمت مسکن",
    date: "۵ مهر ۱۴۰۵",
    author: "نگار کریمی",
    href: "/blog/interior-designers-market",
  },
  {
    image: "/imags/blog/post-coastal.webp",
    title: "شهرک ساحلی زمزم در نور مازندران؛ از بزرگ‌ترین شهرک‌های کشور",
    date: "۲۸ شهریور ۱۴۰۵",
    author: "سارا محمدی",
    href: "/blog/zamzam-coastal-town",
  },
];

/**
 * سکشن بلاگ صفحه اصلی — دسکتاپ: ۴ ستون / موبایل: کاروسل
 */
export default function BlogSection() {
  return (
    <section className="bg-white pb-14 lg:pb-20">
      <div className="mx-auto w-[calc(100%-1.5rem)] lg:w-[80%]">
        <Reveal variant="rise">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-h5 text-black lg:text-h3">
              آخرین اخبار املاک را از سقفینو دنبال کنید
            </h2>
            <Link
              href="/blog"
              className="nav-link hidden shrink-0 text-button-md text-primary-shade-3 lg:block"
            >
              مشاهده همه
            </Link>
          </div>
        </Reveal>

        <div className="mt-8 lg:mt-10">
          <Carousel gridClass="lg:grid-cols-4" itemClassName="w-[76%] sm:w-[54%]">
            {POSTS.map((post, i) => (
              <Reveal key={post.href} variant={["wipe", "focus", "drift", "rise"][i % 4]} delay={i * 0.08}>
                <Link
                  href={post.href}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-4 bg-white transition-colors hover:border-primary/50"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 1024px) 76vw, 20vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="line-clamp-2 text-body-xs font-bold leading-7 text-black transition-colors group-hover:text-primary">
                      {post.title}
                    </h3>
                    <div className="mt-3 flex items-center gap-4 border-t border-gray-3 pt-3 text-caption-md text-gray-8">
                      <span className="flex items-center gap-1.5">
                        <Calendar size="16" color="currentColor" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <ProfileCircle size="16" color="currentColor" />
                        {post.author}
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </Carousel>
        </div>

        <div className="mt-6 text-center lg:hidden">
          <Link href="/blog" className="text-button-md text-primary-shade-3">
            مشاهده همه اخبار
          </Link>
        </div>
      </div>
    </section>
  );
}
