import RentPageSkeleton from "@/components/listings/RentPageSkeleton";

/** اسکلت مسیر /rent هنگام بارگذاری اولیه */
export default function Loading() {
  return (
    <div className="pb-24 lg:pb-14" aria-busy="true">
      <div className="border-b border-gray-3 bg-gray-1/60">
        <div className="mx-auto w-[calc(100%-1.5rem)] max-w-[1224px] py-6 lg:w-[80%] lg:py-9">
          <div className="listings-shimmer h-3 w-32 rounded-full" />
          <div className="listings-shimmer mt-4 h-8 w-3/4 max-w-lg rounded-xl lg:h-10" />
          <div className="listings-shimmer mt-3 h-4 w-2/3 max-w-xl rounded-md" />
          <div className="mt-4 flex gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="listings-shimmer h-8 w-24 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-3 w-[calc(100%-1.5rem)] max-w-[1224px] lg:mt-5 lg:w-[80%]">
        <RentPageSkeleton />
      </div>
    </div>
  );
}
