import { NextResponse } from "next/server";
import * as Property from "@/models/Property";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "شناسه ملک الزامی است" },
        { status: 400 }
      );
    }

    const property = await Property.findPropertyById(id);

    if (!property) {
      return NextResponse.json(
        { error: "ملک یافت نشد" },
        { status: 404 }
      );
    }

    await Property.incrementViews(id);

    return NextResponse.json({
      success: true,
      property,
    });
  } catch (error) {
    console.error("Property fetch error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت ملک" },
      { status: 500 }
    );
  }
}