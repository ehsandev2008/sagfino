import { NextResponse } from "next/server";
import { provinces } from "@/lib/listings/locations";

/** فهرست همهٔ استان‌های ایران به همراه تعداد شهرها */
export async function GET() {
  const data = provinces
    .map((province) => ({
      id: province.id,
      name: province.name,
      slug: province.slug,
      telPrefix: province.telPrefix,
      lat: province.lat,
      lng: province.lng,
      citiesCount: province.citiesCount,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "fa"));

  return NextResponse.json(
    { provinces: data, total: data.length },
    {
      headers: {
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    }
  );
}
