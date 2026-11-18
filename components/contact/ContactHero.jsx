import { Call, Instagram, Whatsapp } from "iconsax-react";

const PHONE_NUMBER = "۰۲۱-۴۰۶۷۰۰۰۰";
const PHONE_LINK = "+982140670000";

export default function ContactHero() {
  return (
    <section className="px-4 pb-10 pt-8 sm:px-8 lg:px-16 lg:pb-14">
      <div
        dir="rtl"
        className="mx-auto max-w-6xl rounded-2xl border border-gray-4 px-5 py-7 sm:px-8 sm:py-9 lg:px-12 lg:py-8"
      >
        <p className="text-right text-base font-bold text-gray-11 sm:text-lg">
          تماس با ما
        </p>

        <div className="mx-auto mt-7 max-w-3xl text-center sm:mt-8">
          <h1 className="text-2xl font-bold leading-relaxed text-primary-shade-3 sm:text-3xl lg:text-4xl">
            تا پیدا کردن بهترین سقف در کنار شماییم
          </h1>
          <p className="mt-1 text-lg leading-relaxed text-gray-8 sm:text-2xl">
            با ما در تماس باشید
          </p>

          <div className="mt-8 flex justify-center gap-3">
            <a
              href="https://wa.me/982140670000"
              target="_blank"
              rel="noreferrer"
              aria-label="گفت‌وگو با سقفینو در واتساپ"
              className="text-primary transition-transform hover:scale-110"
            >
              <Whatsapp size="24" variant="Bold" />
            </a>
            <a
              href="https://www.instagram.com/saghfino/"
              target="_blank"
              rel="noreferrer"
              aria-label="صفحه اینستاگرام سقفینو"
              className="text-primary transition-transform hover:scale-110"
            >
              <Instagram size="24" variant="Bold" />
            </a>
          </div>
          <p className="mt-1 text-sm text-gray-8">پشتیبانی ۲۴ ساعته</p>

          <a
            href={`tel:${PHONE_LINK}`}
            dir="ltr"
            className="mx-auto mt-3 flex w-full max-w-sm items-center justify-center gap-3 rounded-lg bg-primary px-5 py-3 text-base font-medium text-white transition-colors hover:bg-primary-shade-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Call size="22" />
            <span dir="rtl">{PHONE_NUMBER}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
