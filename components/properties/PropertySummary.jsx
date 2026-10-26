import { Clock, Eye, Location, TickCircle } from "iconsax-react";
import { formatRelativeTime } from "@/lib/listings/format";
import { toFaDigits } from "@/lib/auth";

/** خلاصهٔ بالای جزئیات: عنوان، نشان‌ها و اطلاعات تماس سریع آگهی */
export default function PropertySummary({ property }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="rounded-md bg-primary-tint-1 px-2 py-1 text-[10px] font-medium text-primary">
          {property.propertyTypeLabel}
        </span>
        <span className="rounded-md bg-gray-1 px-2 py-1 text-[10px] text-gray-9">
          رهن و اجاره
        </span>
        {property.isVerified && (
          <span className="flex items-center gap-1 rounded-md bg-success-light-2 px-2 py-1 text-[10px] text-success">
            <TickCircle size="12" variant="Bold" color="currentColor" />
            تاییدشده
          </span>
        )}
        {property.isFeatured && (
          <span className="rounded-md bg-warning-light-2 px-2 py-1 text-[10px] text-warning">
            آگهی ویژه
          </span>
        )}
      </div>

      <h1 className="mt-2.5 text-h6 leading-[1.6] text-gray-13 sm:text-h5 lg:text-h4">
        {property.title}
      </h1>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-8">
        <span className="flex items-center gap-1">
          <Location
            size="14"
            variant="Bold"
            color="currentColor"
            className="text-primary"
          />
          {property.address}
        </span>
        <span className="flex items-center gap-1">
          <Clock size="13" color="currentColor" />
          {formatRelativeTime(property.createdAt)}
        </span>
        <span className="flex items-center gap-1">
          <Eye size="13" color="currentColor" />
          {toFaDigits(property.viewsCount ?? 0)} بازدید
        </span>
      </div>
    </div>
  );
}
