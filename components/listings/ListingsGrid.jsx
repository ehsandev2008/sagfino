import { Fragment } from "react";
import ListingCard from "./ListingCard";
import AgencySpotlight from "./AgencySpotlight";

/**
 * گرید آگهی‌ها + نمایش دفاتر املاک مرتبط بین نتایج.
 * در دسکتاپ ۳ ستون، تبلت ۲ ستون و موبایل تک‌ستونه است.
 */
export default function ListingsGrid({ listings, agencies, cityName }) {
  const hasSpotlight = Boolean(agencies?.length) && listings.length > 1;
  const insertAfter =
    listings.length > 6 ? 5 : Math.min(3, Math.max(1, listings.length - 1));

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {listings.map((property, index) => (
        <Fragment key={property.id}>
          <ListingCard property={property} priority={index < 3} />

          {hasSpotlight && index === insertAfter && (
            <div className="sm:col-span-2 xl:col-span-3">
              <AgencySpotlight
                agencies={agencies}
                cityName={cityName}
              />
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
}
