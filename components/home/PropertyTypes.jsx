import Image from "next/image";
import Link from "next/link";
import Reveal from "../ui/Reveal";

const TYPES = [
  {
    image: "/imags/type-residential.webp",
    count: "۲۸.۹۰۰",
    label: "خانه مسکونی",
    href: "/properties?type=residential",
  },
  {
    image: "/imags/type-apartment.webp",
    count: "۳۰۹.۷۹۸",
    label: "آپارتمان و برج",
    href: "/properties?type=apartment",
  },
  {
    image: "/imags/type-villa.webp",
    count: "۹۴۶",
    label: "ویلا",
    href: "/properties?type=villa",
  },
  {
    image: "/imags/type-commercial.webp",
    count: "۲۷.۳۳۹",
    label: "تجاری و اداری",
    href: "/properties?type=commercial",
  },
];

const VARIANTS = ["wipe", "focus", "drift", "rise"];

/**
 * سکشن «در سقفینو دنبال چه نوع ملکی هستید» — صفحه اصلی
 */
export default function PropertyTypes() {
  return (
    <section className="bg-white pb-14 lg:pb-20">
      <div className="mx-auto w-[calc(100%-1.5rem)] lg:w-[80%]">
        <Reveal variant="rise">
          <h2 className="text-center text-h5 text-black lg:text-right lg:text-h3">
            در سقفینو دنبال چه نوع ملکی هستید
          </h2>
        </Reveal>

        <div className="mt-8 grid grid-cols-2 gap-4 lg:mt-10 lg:grid-cols-4 lg:gap-6">
          {TYPES.map((type, i) => (
            <Reveal key={type.label} variant={VARIANTS[i % VARIANTS.length]} delay={i * 0.1}>
              <Link
                href={type.href}
                className="group block overflow-hidden rounded-2xl border border-gray-4 bg-white transition-colors hover:border-primary/50"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={type.image}
                    alt={type.label}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="p-4 text-center">
                  <p className="text-h6 font-bold text-black">{type.count}</p>
                  <p className="mt-1 text-body-xxs text-gray-9">{type.label}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
