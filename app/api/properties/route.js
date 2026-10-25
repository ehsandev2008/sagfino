import { NextResponse } from "next/server";
import { parseListingSearchParams } from "@/lib/listings/query";
import { getRentListings } from "@/lib/listings/service";

/**
 * فهرست آگهی‌های اجاره با فیلتر، مرتب‌سازی و صفحه‌بندی
 * GET /api/properties?city=...&type=apartment&page=1
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const raw = Object.fromEntries(searchParams.entries());
    const filters = parseListingSearchParams(raw);
    const result = await getRentListings(filters);

    return NextResponse.json({
      success: true,
      ...result,
      filters,
    });
  } catch (error) {
    console.error("Listings fetch error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت آگهی‌ها" },
      { status: 500 }
    );
  }
}
