import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");

    return NextResponse.json({
      success: true,
      message: "خروج موفقیت‌آمیز بود",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "خطا در خروج" },
      { status: 500 }
    );
  }
}