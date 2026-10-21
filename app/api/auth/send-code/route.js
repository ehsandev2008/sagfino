import { NextResponse } from "next/server";
import { requestLoginCode, isValidIranianPhone, toEnglishDigits } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { error: "شماره موبایل الزامی است" },
        { status: 400 }
      );
    }

    const cleanPhone = toEnglishDigits(phone).trim();

    if (!isValidIranianPhone(cleanPhone)) {
      return NextResponse.json(
        { error: "شماره موبایل وارد شده معتبر نیست" },
        { status: 400 }
      );
    }

    await requestLoginCode(cleanPhone);

    return NextResponse.json({
      success: true,
      message: "کد تأیید ارسال شد",
      phone: cleanPhone,
    });
  } catch (error) {
    console.error("Send code error:", error);
    return NextResponse.json(
      { error: "خطا در ارسال کد تأیید" },
      { status: 500 }
    );
  }
}