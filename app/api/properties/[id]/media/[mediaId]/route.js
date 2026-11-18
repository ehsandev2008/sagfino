import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import { getListingMediaBucket, ObjectId } from "@/lib/mongodb";

const OBJECT_ID = /^[a-f\d]{24}$/i;

export async function GET(_request, { params }) {
  try {
    const { id: listingCode, mediaId } = await params;
    if (!listingCode || !OBJECT_ID.test(mediaId)) {
      return NextResponse.json({ error: "رسانه پیدا نشد" }, { status: 404 });
    }

    const bucket = await getListingMediaBucket();
    const id = ObjectId(mediaId);
    const file = await bucket.find({ _id: id }).next();
    if (!file) {
      return NextResponse.json({ error: "رسانه پیدا نشد" }, { status: 404 });
    }
    if (file.metadata?.listingCode !== listingCode) {
      return NextResponse.json({ error: "رسانه پیدا نشد" }, { status: 404 });
    }

    const contentType = file.metadata?.contentType;
    if (!["image/png", "image/jpeg", "image/webp", "video/mp4"].includes(contentType)) {
      return NextResponse.json({ error: "نوع رسانه معتبر نیست" }, { status: 415 });
    }

    const stream = bucket.openDownloadStream(id);
    return new Response(Readable.toWeb(stream), {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(file.length),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("[properties] reading listing media failed:", error);
    return NextResponse.json(
      { error: "خطا در دریافت رسانه" },
      { status: 500 }
    );
  }
}
