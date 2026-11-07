"use client";
import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "motion/react";

const RIGHT_PARAGRAPHS = [
  "توسعه اینترنت، روش‌های معاملات و خرید ما را به کلی دگرگون کرده است. منافع موجود در این شکل معاملات؛ آسانی و سرعت بیشتر، سبب شده تا مردم به‌سمت تجربه آن و ایجاد تغییر در الگوهای متداول انجام معامله ترغیب شوند.",
  "در حالیکه مشغله‌های روزانه فرصت لذت بردن از اوقات فراغت را کاهش داده، صرف زمان‌های طولانی برای انجام سفرهای درون شهری و رسیدگی به امورات روزانه معنای خود را از دست داده است.",
  "در این بین برخی هنوز به‌واسطه مجازی بودن فضا اعتماد کافی برای اقدام به معاملات از طریق این روش‌ها را ندارند.",
  "وب‌سایت سقفینو به صورت تخصصی در زمینه اجاره، خرید و فروش ملک در کشور فعالیت دارد.",
  "این وب‌سایت همواره تلاش می‌کند اطلاعات دقیق و به‌روز از مناطق مختلف را راستی‌آزمایی کرده و سپس در اختیار شما قرار",
];

const LEFT_PARAGRAPHS = [
  "دهد تا با خیالی راحت خرید اقدام به انجام معاملات کنید.",
  "وب‌سایت سقفینو همچنین با داشتن مجموعه بزرگی از املاک تایید‌شده و مشاورین املاکی که توسط اداره احراز هویت شده‌اند توانسته مجموعه کاملی از اطلاعات جامع در زمینه ملک در اکثر نقاط کشور را داشته باشد.",
  "همچنین ما با جذب مشاوران متخصص توانسته‌ایم امکان دادن مشاوره تخصصی به شما برای انتخاب بهتر و امن‌تر را فراهم آوریم.",
  "در سقفینو همیشه خانه‌ای منتظر شماست چه به‌دنبال پیدا کردن یک خانه دلنشین هستید، یا مدیر آژانس املاک و یا یک مشاور مستقل هستید، ما همیشه کنار شماییم.",
];

function FadeUp({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FadeIn({ children, delay = 0, x = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function StorySection() {
  return (
    <section
      dir="rtl"
      className="bg-white px-4 sm:px-8 lg:px-16 xl:px-24 py-10 lg:py-16"
    >
      <div className="max-w-6xl mx-auto">

        {/* برچسب */}
        <FadeUp delay={0} className="mb-6">
          <span className="text-sm font-bold text-gray-12 tracking-wide">
            داستان سقفینو
          </span>
        </FadeUp>

        {/* عنوان */}
        <FadeUp delay={0.08} className="mb-2">
          <h1
            className="font-bold text-primary leading-[1.4]"
            style={{ fontSize: "clamp(22px, 4vw, 38px)" }}
          >
            ما باور داریم هر شخصی، سقفی دارد
          </h1>
        </FadeUp>

        {/* زیرعنوان */}
        <FadeUp delay={0.15} className="mb-10 lg:mb-14">
          <p className="text-gray-9 text-body-xs leading-relaxed">
            تا پیدا کردن سقف دلخواه کنار شماییم
          </p>
        </FadeUp>

        {/* بدنه */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

          {/* تصویر */}
          <FadeIn x={40} delay={0.2} className="w-full lg:w-[36%] shrink-0">
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/sagfino story/story.png"
                alt="ساختمان سقفینو"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 36vw"
                priority
              />
            </div>
          </FadeIn>

          {/* دو ستون متن */}
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">

              {/* ستون راست */}
              <div className="flex flex-col gap-5">
                {RIGHT_PARAGRAPHS.map((para, i) => (
                  <FadeUp key={i} delay={0.25 + i * 0.07}>
                    <p className="text-body-xxs text-gray-11 leading-[2] text-justify">
                      {para}
                    </p>
                  </FadeUp>
                ))}
              </div>

              {/* ستون چپ */}
              <div className="flex flex-col gap-5">
                {LEFT_PARAGRAPHS.map((para, i) => (
                  <FadeUp key={i} delay={0.3 + i * 0.07}>
                    <p className="text-body-xxs text-gray-11 leading-[2] text-justify">
                      {para}
                    </p>
                  </FadeUp>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
