import Link from "next/link";
import { Home2, SearchStatus } from "iconsax-react";

export const metadata = {
  title: "صفحه پیدا نشد | سقفینو",
};

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[55vh] w-[calc(100%-1.5rem)] max-w-[1224px] flex-col items-center justify-center py-12 text-center lg:w-[80%]">
      <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-tint-1 text-primary">
        <SearchStatus size="42" variant="Bold" color="currentColor" />
      </span>
      <h1 className="mt-5 text-h4 text-gray-13 sm:text-h3">
        صفحه‌ای که می‌خواستید پیدا نشد
      </h1>
      <p className="mt-2 max-w-md text-caption-md leading-7 text-gray-8">
        ممکن است آگهی حذف شده باشد یا نشانی را اشتباه وارد کرده باشید. می‌توانید
        از فهرست آگهی‌های اجاره ادامه دهید.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Link
          href="/rent"
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-button-md text-white shadow-[0_8px_20px_rgba(203,27,27,0.22)] transition-colors hover:bg-primary-shade-1"
        >
          <Home2 size="18" color="currentColor" />
          مشاهدهٔ آگهی‌های اجاره
        </Link>
        <Link
          href="/"
          className="inline-flex h-10 items-center rounded-xl border border-gray-4 px-5 text-button-md text-gray-10 transition-colors hover:border-gray-6 hover:text-gray-13"
        >
          بازگشت به خانه
        </Link>
      </div>
    </div>
  );
}
