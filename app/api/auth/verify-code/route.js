import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyLoginCode, toEnglishDigits } from "@/lib/auth";
import * as User from "@/models/User";

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone, code } = body;

    if (!phone || !code) {
      return NextResponse.json(
        { error: "شماره موبایل و کد تأیید الزامی است" },
        { status: 400 }
      );
    }

    const cleanPhone = toEnglishDigits(phone).trim();
    const cleanCode = toEnglishDigits(code).trim();

    const { ok } = await verifyLoginCode(cleanPhone, cleanCode);

    if (!ok) {
      return NextResponse.json(
        { error: "کد تأیید صحیح نیست" },
        { status: 400 }
      );
    }

    let user = await User.findUserByPhone(cleanPhone);
    
    if (!user) {
      user = await User.createUser({
        phone: cleanPhone,
        isVerified: true,
        verifiedAt: new Date(),
      });
    }

    const cookieStore = await cookies();
    cookieStore.set("auth_token", user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "ورود موفقیت‌آمیز بود",
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Verify code error:", error);
    return NextResponse.json(
      { error: "خطا در تأیید کد" },
      { status: 500 }
    );
  }
}