"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { ArrowLeft2, Call, Star1, Verify } from "iconsax-react";
import AgencyModal from "@/components/home-pro/top-agencies/AgencyModal";
import { toFaDigits } from "@/lib/auth";

/**
 * دفاتر املاک مرتبط که بین آگهی‌ها نمایش داده می‌شوند.
 * کلیک روی هر دفتر، پاپ‌آپ اطلاعات آژانس را باز می‌کند.
 */
export default function AgencySpotlight({ agencies, cityName }) {
  const [activeAgency, setActiveAgency] = useState(null);

  const openAgency = useCallback((agency, element) => {
    setActiveAgency({
      agency,
      rect: element.getBoundingClientRect(),
      trigger: element,
    });
  }, []);

  if (!agencies?.length) return null;

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-3 bg-gray-2/70 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-tint-1 text-primary">
              <Verify size="18" variant="Bold" color="currentColor" />
            </span>
            <h2 className="text-body-xs font-bold text-gray-12 sm:text-body-s">
              دفاتر املاک مرتبط
            </h2>
          </div>
          <p className="mt-1.5 text-[11px] text-gray-8">
            {cityName
              ? `دفاتر فعال در ${cityName} با آگهی‌های تأییدشده`
              : "دفاتر املاک منتخب سقفینو در سراسر ایران"}
          </p>
        </div>
        <a
          href="/agents"
          className="nav-link flex shrink-0 items-center gap-1 text-[11px] text-gray-9 transition-colors hover:text-primary"
        >
          مشاهده همه
          <ArrowLeft2 size="14" color="currentColor" />
        </a>
      </div>

      <div className="mt-3.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {agencies.map((agency) => (
          <button
            key={agency.id}
            type="button"
            onClick={(event) => openAgency(agency, event.currentTarget)}
            className="group flex w-full items-center gap-3 rounded-xl border border-gray-4 bg-white p-2.5 text-right transition-all hover:border-primary/25 hover:shadow-[0_10px_25px_rgba(12,12,12,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-3 bg-gray-1">
              <Image
                src={agency.logo}
                alt={agency.name}
                width={64}
                height={48}
                className="h-full w-full object-contain p-1 transition-transform duration-300 group-hover:scale-105"
              />
            </span>

            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1">
                <span className="truncate text-[11px] font-semibold text-gray-12 sm:text-body-xxs">
                  {agency.name.replace(/^مشاور\s+املاک\s+/, "املاک ")}
                </span>
                {agency.verified && (
                  <Verify
                    size="13"
                    variant="Bold"
                    color="#2B66FF"
                    className="shrink-0"
                  />
                )}
              </span>

              <span className="mt-0.5 flex items-center gap-2 text-[10px] text-gray-7">
                <span className="flex items-center gap-0.5 text-warning">
                  <Star1 size="11" variant="Bold" color="currentColor" />
                  <span className="text-gray-9">{agency.ratingLabel}</span>
                </span>
                <span className="truncate">{agency.location}</span>
              </span>

              <span className="mt-1 flex items-center justify-between gap-1 text-[10px]">
                <span className="text-gray-7">
                  {agency.activeAdsLabel} آگهی فعال
                </span>
                <span className="flex items-center gap-1 text-gray-9">
                  <Call size="11" color="currentColor" />
                  {toFaDigits(agency.phones?.[0] ?? "")}
                </span>
              </span>
            </span>

            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-1 text-gray-7 transition-colors group-hover:bg-primary-tint-1 group-hover:text-primary">
              <ArrowLeft2 size="15" color="currentColor" />
            </span>
          </button>
        ))}
      </div>

      {activeAgency && (
        <AgencyModal
          agency={activeAgency.agency}
          originRect={activeAgency.rect}
          returnFocusTo={activeAgency.trigger}
          onClose={() => setActiveAgency(null)}
        />
      )}
    </section>
  );
}
