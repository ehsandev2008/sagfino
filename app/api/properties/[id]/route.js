import { NextResponse } from "next/server";
import * as Property from "@/models/Property";
import { getListingByCode } from "@/lib/listings/service";

const OBJECT_ID = /^[a-f\d]{24}$/i;

/**
 * جزئیات یک آگهی
 * - کد آگهی (مثل SG-51001) از سرویس آگهی‌ها
 * - شناسهٔ ObjectId برای سازگاری با مدل قدیمی Property
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "شناسه ملک الزامی است" },
        { status: 400 }
      );
    }

    const listing = await getListingByCode(decodeURIComponent(id));
    if (listing) {
      return NextResponse.json({
        success: true,
        property: listing,
        source: listing.code ? "listings" : "properties",
      });
    }

    if (!OBJECT_ID.test(id)) {
      return NextResponse.json({ error: "ملک یافت نشد" }, { status: 404 });
    }

    const property = await Property.findPropertyById(id);

    if (!property) {
      return NextResponse.json({ error: "ملک یافت نشد" }, { status: 404 });
    }

    await Property.incrementViews(id);

    return NextResponse.json({
      success: true,
      property,
      source: "properties",
    });
  } catch (error) {
    console.error("Property fetch error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت ملک" },
      { status: 500 }
    );
  }
}
