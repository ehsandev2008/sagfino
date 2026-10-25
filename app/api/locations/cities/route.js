import { NextResponse } from "next/server";
import {
  getCitiesOfProvince,
  popularCities,
  searchCities,
} from "@/lib/listings/locations";

/**
 * جست‌وجوی همهٔ شهرهای ایران
 * پارامترها: q، province، popular، limit
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const province = searchParams.get("province") ?? "";
  const popularOnly = searchParams.get("popular") === "1";
  const rawLimit = Number(searchParams.get("limit") ?? 30);
  const limit = Math.min(200, Math.max(1, Number.isFinite(rawLimit) ? rawLimit : 30));

  let data;

  if (popularOnly && !query && !province) {
    data = popularCities.slice(0, limit);
  } else if (province && !query) {
    data = getCitiesOfProvince(province, limit);
  } else {
    data = searchCities({ query, provinceId: province || null, limit });
  }

  return NextResponse.json(
    {
      cities: data,
      total: data.length,
      query,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    }
  );
}
