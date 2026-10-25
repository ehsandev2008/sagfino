import Link from "next/link";
import { ArrowLeft2, Radar } from "iconsax-react";
import { buildListingHref } from "@/lib/listings/query";
import { locations } from "@/lib/listings/locations";

function cityByName(name) {
  return locations.cities.find((city) => city.name === name) ?? null;
}

function buildLinks(filters, selectedCity) {
  const links = [];
  const add = (label, overrides) => {
    if (links.some((item) => item.label === label)) return;
    links.push({ label, href: buildListingHref({ sort: filters.sort }, { page: 1, ...overrides }) });
  };

  const focusCity = selectedCity ?? cityByName("تهران");

  if (focusCity) {
    add(`اجاره آپارتمان در ${focusCity.name}`, { city: focusCity.id, type: "apartment" });
    add(`اجاره ویلا در ${focusCity.name}`, { city: focusCity.id, type: "villa" });
    add(`خانه‌های ۲ اتاقه در ${focusCity.name}`, { city: focusCity.id, rooms: 2 });
    add(`اجاره دفتر کار در ${focusCity.name}`, { city: focusCity.id, type: "office" });
  }

  const mashhad = cityByName("مشهد");
  const isfahan = cityByName("اصفهان");
  const shiraz = cityByName("شیراز");
  const rasht = cityByName("رشت");
  const kish = cityByName("کیش");
  const karaj = cityByName("کرج");

  if (mashhad) add("اجاره آپارتمان در مشهد", { city: mashhad.id, type: "apartment" });
  if (isfahan) add("اجاره ویلا در اصفهان", { city: isfahan.id, type: "villa" });
  if (shiraz) add("اجاره خانه در شیراز", { city: shiraz.id });
  if (rasht) add("اجاره ویلا در رشت", { city: rasht.id, type: "villa" });
  if (kish) {
    add("اجاره سوئیت مبله در کیش", {
      city: kish.id,
      type: "apartment",
      features: ["furnished"],
    });
  }
  if (karaj) add("اجاره آپارتمان در کرج", { city: karaj.id, type: "apartment" });

  add("خانه‌های زیر ۱۰۰ متر", { area: "50-100" });
  add("اجاره با پارکینگ", { features: ["parking"] });

  return links.slice(0, 12);
}

export default function RelatedLinks({ filters, selectedCity }) {
  const links = buildLinks(filters, selectedCity);

  return (
    <section className="mt-6 rounded-2xl border border-gray-4 bg-white p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-1 text-gray-9">
          <Radar size="18" color="currentColor" />
        </span>
        <div>
          <h2 className="text-body-xs font-bold text-gray-12">جست‌وجوهای مرتبط</h2>
          <p className="mt-0.5 text-[10px] text-gray-7">
            سریع‌تر به آگهی‌های مورد نظرتان برسید
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {links.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="group inline-flex items-center gap-1.5 rounded-full border border-gray-4 bg-gray-1 px-3 py-1.5 text-[11px] text-gray-9 transition-all hover:border-primary/30 hover:bg-primary-tint-1 hover:text-primary"
          >
            <span>{item.label}</span>
            <ArrowLeft2
              size="12"
              color="currentColor"
              className="text-gray-5 transition-transform group-hover:-translate-x-0.5 group-hover:text-primary"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
