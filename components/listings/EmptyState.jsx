import Image from "next/image";
import Link from "next/link";

/** حالت خالی بودن نتایج؛ وقتی هیچ آگهی‌ای با فیلترهای کاربر پیدا نمی‌شود. */
export default function EmptyState() {
  return (
    <section
      aria-labelledby="empty-state-title"
      className="flex flex-col items-center rounded-2xl border border-gray-4 bg-white px-4 py-10 text-center sm:px-8 sm:py-14"
    >
      <Image
        src="/notfound/no-results.png"
        alt="ملکی با این مشخصات پیدا نشد"
        width={2009}
        height={1381}
        sizes="(max-width: 640px) 88vw, 430px"
        className="h-auto w-full max-w-[430px] select-none"
      />

      <h2
        id="empty-state-title"
        className="mt-5 text-h5 font-bold text-gray-13 sm:mt-7 sm:text-h4"
      >
        ملک با مشخصات مورد نظر پیدا نشد!
      </h2>
      <p className="mt-2 text-caption-md text-gray-8 sm:text-body-xxs">
        در صفحه اصلی املاک مشابهی منتظر شما هستند
      </p>

      <Link
        href="/"
        className="mt-7 inline-flex h-11 w-full max-w-[416px] items-center justify-center rounded-lg bg-primary px-5 text-button-md text-white transition-colors hover:bg-primary-shade-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 sm:mt-8"
      >
        بازگشت به صفحه اصلی
      </Link>
    </section>
  );
}
