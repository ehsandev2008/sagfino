import Image from "next/image";
import Link from "next/link";
import Reveal from "../ui/Reveal";

const CARDS = [
  {
    image: "/imags/Illustration2.webp",
    imageSize: { width: 280, height: 145 },
    title: "به آسانی یک خانه اجاره کنید",
    description:
      "در میان صدها آگهی که روزانه به وب‌سایت سقفینو افزوده می‌شود، با استفاده از بیش از ۲۸ فیلتر کاربردی تلاش کرده‌ایم خانه‌ای که در جست‌وجوی آن هستید را هر چه سریعتر پیدا و اجاره کنید.",
    cta: "اجاره خانه",
    href: "/rent",
    variant: "drift",
  },
  {
    image: "/imags/illustration.webp",
    imageSize: { width: 1120, height: 580 },
    title: "خانه مورد علاقه‌تان را بخرید",
    description:
      "بالای ۱ میلیون آگهی فروش در وب‌سایت سقفینو وجود دارد. ما علاوه بر آگهی‌های فراوان با به‌کارگیری املاک و مشاورین متخصص در هر شهر، تلاش می‌کنیم در تجربه لذت یک خرید آسان با شما سهیم باشیم.",
    cta: "خرید خانه",
    href: "/buy",
    variant: "wipe",
  },
  {
    image: "/imags/Illustration3.webp",
    imageSize: { width: 280, height: 145 },
    title: "مالک هستید؟",
    description:
      "آیا می‌دانید میانگین بازدید از وب‌سایت به‌طور متوسط روزانه بالای هزاران نفر است؟ پس به‌سادگی و با چند کلیک ساده، ملکتان را به‌صورت رایگان در سقفینو آگهی و در سریع‌ترین زمان ممکن معامله کنید.",
    cta: "ثبت آگهی",
    href: "/new-ad",
    variant: "focus",
  },
];

/**
 * سکشن «سقفینو چطور به خانه‌دار شدن شما کمک می‌کند» — ادامه هیرو در صفحه اصلی
 */
export default function HelpSection() {
  return (
    <section className="bg-white py-14 lg:py-20">
      <div className="mx-auto w-[calc(100%-1.5rem)] lg:w-[80%]">
        <Reveal variant="rise">
          <h2 className="text-center text-h5 text-black lg:text-right lg:text-h3">
            سقفینو چطور به خانه‌دار شدن شما کمک می‌کند
          </h2>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:mt-10 lg:grid-cols-3">
          {CARDS.map((card, i) => (
            <Reveal key={card.title} variant={card.variant} delay={i * 0.12}>
              <article className="flex h-full flex-col rounded-2xl border border-gray-4 bg-gray-1 p-6 lg:p-8">
                <div className="flex h-44 items-center justify-center lg:h-52">
                  <Image
                    src={card.image}
                    alt={card.title}
                    width={card.imageSize.width}
                    height={card.imageSize.height}
                    className="h-full w-auto object-contain"
                  />
                </div>

                <h3 className="mt-6 text-center text-h5 text-black">{card.title}</h3>
                <p className="mx-auto mt-3 max-w-xl text-center text-body-xxs leading-8 text-gray-9">
                  {card.description}
                </p>

                <Link
                  href={card.href}
                  className="mt-6 rounded-md bg-primary-shade-1 py-3 text-center text-button-lg text-white transition-colors hover:bg-primary lg:mt-8"
                >
                  {card.cta}
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
