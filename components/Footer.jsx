import { Call, Instagram, Send2 } from "iconsax-react";
import Image from "next/image";
import Link from "next/link";
import ExpandableGroup from "./ExpandableGroup";
import Logo from "./Logo";

const TOP_GROUPS = [
  {
    title: "بازارهای املاک و مستغلات",
    links: [
      "بازار املاک و مستغلات تهران",
      "بازار املاک و مستغلات اصفهان",
      "بازار املاک و مستغلات شمال",
    ],
    more: [
      "بازار املاک و مستغلات مشهد",
      "بازار املاک و مستغلات تبریز",
      "بازار املاک و مستغلات کرج",
    ],
  },
  {
    title: "بیشترین جست‌وجوها",
    links: [
      "آپارتمان نزدیک مترو",
      "خانه نزدیک بر اصلی خیابان",
      "آپارتمان تک واحده",
    ],
    more: ["آپارتمان نوساز", "خانه ویلایی", "رهن و اجاره آپارتمان"],
  },
  {
    title: "پرامتیازترین مشاوران املاک",
    links: ["میترا جباری", "حسام‌الدین عزیزی", "بهرام مشعوف"],
    more: ["سارا محمدی", "علی رضایی", "نگار کریمی"],
  },
];

const CONTACTS = [
  { label: "تلفن", Icon: Call },
  { label: "اینستاگرام", Icon: Instagram },
  { label: "تلگرام", Icon: Send2 },
];

const SERVICE_LINKS = [
  "اجاره",
  "خرید",
  "ثبت رایگان آگهی ملک",
  "املاک و مستغلات",
  "مشاورین املاک",
  "اخبار روز املاک",
  "سوال ملکی دارید؟",
];

const INFO_LINKS = [
  "دانلود اپلیکیشن سقفینو",
  "تماس با ما",
  "داستان سقفینو",
  "پرسش‌های پرتکرار",
  "یک سقف؛ بلاگ سقفینو",
  "حریم شخصی شما",
  "تعهدات ما و شما",
];

const ACCOUNT_LINKS = ["پروفایل من", "ملک‌های نشان‌شده", "آگهی‌های من"];

/**
 * فوتر سایت — ریسپانسیو (دسکتاپ / موبایل)
 */
export default function Footer() {
  return (
    <footer className="bg-gray-1">
      <div className="mx-auto w-[calc(100%-1.5rem)] px-4 pt-10 lg:w-[80%] lg:px-8 lg:pt-14">
        {/* تیتر */}
        <h2 className="text-center text-h4 text-black lg:text-h3">
          سقفینو؛ سقفی ایده‌آل برای زندگی
        </h2>

        {/* ردیف اول لینک‌ها */}
        <div className="mt-8 grid grid-cols-2 gap-8 lg:mt-10 lg:grid-cols-4">
          {TOP_GROUPS.map((group) => (
            <ExpandableGroup
              key={group.title}
              title={group.title}
              links={group.links}
              more={group.more}
            />
          ))}

          {/* ارتباط با ما */}
          <div>
            <h3 className="text-body-xs font-bold text-black lg:text-h6">
              با ما در ارتباط باشید
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {CONTACTS.map(({ label, Icon }) => (
                <li key={label}>
                  <Link
                    href="#"
                    className="flex items-center gap-2 text-body-xxs text-gray-9 transition-colors hover:text-primary"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                      <Icon size="18" color="#FFFFFF" variant="Bold" />
                    </span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="mt-10 border-gray-4" />

        {/* ردیف دوم */}
        <div className="grid grid-cols-2 gap-8 py-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:py-12">
          {/* برند */}
          <div className="col-span-2 lg:col-span-1">
            <Logo size="lg" />
            <p className="mt-4 text-body-xs font-medium text-black">
              تجربه لذت خانه‌دار شدن سریع و آسان
            </p>
            <p className="mt-3 max-w-sm text-body-xxs leading-8 text-gray-9">
              سقفینو پلی است تا به سرعت در بین هزاران آگهی ثبت‌شده جست‌وجو کنید.
              ملک مورد نظر را پیدا کنید و برای انجام معامله‌ای مطمئن، با مشاورین
              املاک معتمد و متخصص شهرتان در ارتباط باشید.
            </p>
          </div>

          {/* خدمات */}
          <div>
            <h3 className="text-body-xs font-bold text-black lg:text-h6">
              خدمات
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {SERVICE_LINKS.map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="nav-link text-body-xxs text-gray-9 transition-colors hover:text-primary"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* اطلاعات */}
          <div>
            <h3 className="text-body-xs font-bold text-black lg:text-h6">
              اطلاعات
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {INFO_LINKS.map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="nav-link text-body-xxs text-gray-9 transition-colors hover:text-primary"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* حساب کاربری */}
          <div>
            <h3 className="text-body-xs font-bold text-black lg:text-h6">
              حساب کاربری
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {ACCOUNT_LINKS.map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="nav-link text-body-xxs text-gray-9 transition-colors hover:text-primary"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex h-20 w-20 items-center justify-center rounded-md border border-gray-4 bg-white px-2 text-center text-caption-md text-gray-9">
              نماد اعتماد الکترونیکی
            </div>
          </div>
        </div>
      </div>

      {/* ایلاستریشن شهر */}
      <div className="w-full flex items-center justify-center ">
        <Image
          src="/imags/footer-desktop.webp"
          alt=""
          aria-hidden="true"
          width={1472}
          height={246}
          className="hidden h-auto w-275 max-w-full md:block"
        />
        <Image
          src="/imags/footer-mobile.webp"
          alt=""
          aria-hidden="true"
          width={648}
          height={120}
          className="h-auto w-full md:hidden"
        />
      </div>

      {/* کپی‌رایت */}
      <div className="bg-gray-3 py-4 text-center text-caption-md text-gray-9">
        حقوق این سایت متعلق به سقفینو است
      </div>
    </footer>
  );
}
