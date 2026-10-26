import { Fragment } from "react";
import ListingCard from "./ListingCard";
import AgencySpotlight from "./AgencySpotlight";

/**
 * گرید آگهی‌ها + نمایش دفاتر املاک مرتبط بین نتایج.
 * کارت‌ها مطابق صفحهٔ Home Pro در دو ستون نمایش داده می‌شوند.
 */
export default function ListingsGrid({ listings, agencies, cityName }) {
  const hasSpotlight = Boolean(agencies?.length) && listings.length > 1;
  const insertAfter =
    listings.length > 4 ? 3 : Math.min(3, Math.max(1, listings.length - 1));

  return (
    <div className="grid grid-cols-2 gap-3 lg:gap-4">
      {listings.map((property, index) => (
        <Fragment key={property.id}>
          <ListingCard property={property} priority={index < 3} />

          {hasSpotlight && index === insertAfter && (
            <div className="col-span-2">
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
