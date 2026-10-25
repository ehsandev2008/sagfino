function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-4 bg-white">
      <div className="listings-shimmer aspect-[16/10] w-full" />
      <div className="space-y-2.5 p-3.5">
        <div className="listings-shimmer h-4 w-11/12 rounded-md" />
        <div className="listings-shimmer h-3.5 w-2/3 rounded-md" />
        <div className="flex gap-2">
          <div className="listings-shimmer h-3 w-16 rounded-md" />
          <div className="listings-shimmer h-3 w-16 rounded-md" />
        </div>
        <div className="listings-shimmer h-[62px] w-full rounded-xl" />
        <div className="listings-shimmer h-8 w-full rounded-lg" />
      </div>
    </div>
  );
}

/**
 * اسکلت بارگذاری بخش نتایج /rent
 * هم به‌عنوان fallback ساسپنس و هم در app/rent/loading.js استفاده می‌شود.
 */
export default function RentPageSkeleton() {
  return (
    <div aria-busy="true" aria-label="در حال بارگذاری آگهی‌ها">
      <div className="rounded-2xl border border-gray-4 bg-white p-3">
        <div className="flex items-center gap-2.5">
          <div className="listings-shimmer h-11 w-[210px] rounded-xl" />
          <div className="hidden flex-1 grid-cols-4 gap-2.5 lg:grid">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="listings-shimmer h-11 rounded-xl" />
            ))}
          </div>
          <div className="listings-shimmer h-11 w-[120px] rounded-xl" />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-2xl border border-gray-4 bg-white px-3.5 py-3">
        <div className="flex items-center gap-2.5">
          <div className="listings-shimmer h-9 w-9 rounded-xl" />
          <div className="space-y-1.5">
            <div className="listings-shimmer h-3.5 w-28 rounded-md" />
            <div className="listings-shimmer h-2.5 w-20 rounded-md" />
          </div>
        </div>
        <div className="listings-shimmer h-9 w-[130px] rounded-xl" />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
