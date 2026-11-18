import { randomBytes, randomUUID } from "node:crypto";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { NextResponse } from "next/server";
import { createProperty } from "@/models/Property";
import { getListingMediaBucket } from "@/lib/mongodb";
import { DEAL_TYPE_LABELS, PROPERTY_TYPE_LABELS } from "@/lib/listings/constants";
import { parseListingSearchParams } from "@/lib/listings/query";
import { getRentListings } from "@/lib/listings/service";

const MAX_IMAGES = 6;
const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const MAX_VIDEO_SIZE = 30 * 1024 * 1024;
const ALLOWED_DEAL_TYPES = new Set([
  "rent",
  "buy",
  "mortgage",
  "daily-rent",
]);
const ALLOWED_PROPERTY_TYPES = new Set(Object.keys(PROPERTY_TYPE_LABELS));

function isFile(value) {
  return value && typeof value.arrayBuffer === "function" && value.size > 0;
}

function detectMediaType(buffer) {
  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  ) {
    return "image/png";
  }
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }
  if (buffer.length >= 12 && buffer.toString("ascii", 4, 8) === "ftyp") {
    return "video/mp4";
  }
  return null;
}

function cleanString(value, maxLength = 500) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function createCode() {
  return `AD-${Date.now().toString(36).toUpperCase()}-${randomBytes(4)
    .toString("hex")
    .toUpperCase()}`;
}

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

/** ثبت آگهی و رسانه‌های آن در MongoDB و GridFS */
export async function POST(request) {
  const uploadedMediaIds = [];
  let bucket;

  try {
    const formData = await request.formData();
    const listingValue = formData.get("listing");
    if (typeof listingValue !== "string") {
      return NextResponse.json(
        { error: "اطلاعات آگهی ارسال نشده است" },
        { status: 400 }
      );
    }

    let listing;
    try {
      listing = JSON.parse(listingValue);
    } catch {
      return NextResponse.json(
        { error: "اطلاعات آگهی معتبر نیست" },
        { status: 400 }
      );
    }

    if (!listing || typeof listing !== "object" || Array.isArray(listing)) {
      return NextResponse.json(
        { error: "اطلاعات آگهی معتبر نیست" },
        { status: 400 }
      );
    }

    const dealType = cleanString(listing.dealType, 30);
    const propertyType = cleanString(listing.propertyType, 30);
    const cityId = cleanString(listing.cityId, 40);
    const cityName = cleanString(listing.cityName, 100);
    const title = cleanString(listing.title, 160);
    const address = cleanString(listing.address, 500);
    const area = Number(listing.area);

    if (
      !ALLOWED_DEAL_TYPES.has(dealType) ||
      !ALLOWED_PROPERTY_TYPES.has(propertyType) ||
      !cityId ||
      !cityName ||
      !title ||
      !address ||
      !Number.isFinite(area) ||
      area <= 0
    ) {
      return NextResponse.json(
        { error: "اطلاعات اصلی آگهی کامل یا معتبر نیست" },
        { status: 400 }
      );
    }

    const imageFiles = formData.getAll("images").filter(isFile);
    const videoFile = formData.get("video");
    if (imageFiles.length > MAX_IMAGES) {
      return NextResponse.json(
        { error: `حداکثر ${MAX_IMAGES} تصویر می‌توانید بارگذاری کنید` },
        { status: 400 }
      );
    }
    if (videoFile && (!isFile(videoFile) || videoFile.size > MAX_VIDEO_SIZE)) {
      return NextResponse.json(
        { error: "ویدئوی انتخاب‌شده معتبر نیست یا حجم آن بیش از حد مجاز است" },
        { status: 400 }
      );
    }
    if (imageFiles.some((file) => file.size > MAX_IMAGE_SIZE)) {
      return NextResponse.json(
        { error: "حجم هر تصویر باید حداکثر ۸ مگابایت باشد" },
        { status: 400 }
      );
    }

    const imageBuffers = [];
    for (const file of imageFiles) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const contentType = detectMediaType(buffer);
      if (!contentType?.startsWith("image/")) {
        return NextResponse.json(
          { error: "فرمت یکی از تصاویر معتبر نیست" },
          { status: 400 }
        );
      }
      imageBuffers.push({ buffer, contentType });
    }

    let videoBuffer = null;
    if (isFile(videoFile)) {
      videoBuffer = Buffer.from(await videoFile.arrayBuffer());
      if (detectMediaType(videoBuffer) !== "video/mp4") {
        return NextResponse.json(
          { error: "فرمت ویدئو باید MP4 باشد" },
          { status: 400 }
        );
      }
    }

    const code = createCode();
    bucket = await getListingMediaBucket();
    const images = [];

    for (const { buffer, contentType } of imageBuffers) {
      const upload = bucket.openUploadStream(randomUUID(), {
        metadata: { contentType, listingCode: code, kind: "image" },
      });
      uploadedMediaIds.push(upload.id);
      await pipeline(Readable.from([buffer]), upload);
      images.push(`/api/properties/${code}/media/${upload.id}`);
    }

    let videoUrl = null;
    if (videoBuffer) {
      const upload = bucket.openUploadStream(randomUUID(), {
        metadata: {
          contentType: "video/mp4",
          listingCode: code,
          kind: "video",
        },
      });
      uploadedMediaIds.push(upload.id);
      await pipeline(Readable.from([videoBuffer]), upload);
      videoUrl = `/api/properties/${code}/media/${upload.id}`;
    }

    const numericOrNull = (value) => {
      if (value == null || value === "") return null;
      const number = Number(value);
      return Number.isFinite(number) ? number : null;
    };
    const arrayOfStrings = (value) =>
      Array.isArray(value)
        ? value.filter((item) => typeof item === "string").slice(0, 50)
        : [];
    const phone = cleanString(listing.agency?.phones?.[0], 20);
    const provinceName = cleanString(listing.provinceName, 100);
    const neighborhood = cleanString(listing.neighborhood, 120);
    const cover = images[0] ?? null;

    const property = await createProperty({
      code,
      slug: code.toLowerCase(),
      title,
      description: cleanString(listing.description, 10_000),
      dealType,
      dealTypeLabel: DEAL_TYPE_LABELS[dealType] ?? dealType,
      propertyType,
      propertyTypeLabel: PROPERTY_TYPE_LABELS[propertyType],
      provinceId: cleanString(listing.provinceId, 40),
      provinceName,
      cityId,
      cityName,
      neighborhood,
      address,
      lat: numericOrNull(listing.lat),
      lng: numericOrNull(listing.lng),
      area,
      rooms: numericOrNull(listing.rooms) ?? 0,
      bathrooms: numericOrNull(listing.bathrooms) ?? 1,
      floor: numericOrNull(listing.floor) ?? 0,
      floorLabel: cleanString(listing.floorLabel, 40) || null,
      totalFloors: numericOrNull(listing.totalFloors) ?? 1,
      buildYear: numericOrNull(listing.buildYear),
      deposit: numericOrNull(listing.deposit) ?? 0,
      rent: numericOrNull(listing.rent) ?? 0,
      price: numericOrNull(listing.price) ?? 0,
      pricePerMeter: numericOrNull(listing.pricePerMeter) ?? 0,
      loanAmount: numericOrNull(listing.loanAmount) ?? 0,
      unitCount: numericOrNull(listing.unitCount) ?? 1,
      images,
      cover,
      videoUrl,
      features: arrayOfStrings(listing.features),
      parkingCount: numericOrNull(listing.parkingCount) ?? 0,
      storageCount: numericOrNull(listing.storageCount) ?? 0,
      elevatorsCount: numericOrNull(listing.elevatorsCount) ?? 0,
      floorMaterial: cleanString(listing.floorMaterial, 80) || null,
      bathroomType: cleanString(listing.bathroomType, 80) || null,
      coolingSystem: cleanString(listing.coolingSystem, 80) || null,
      heatingSystem: cleanString(listing.heatingSystem, 80) || null,
      buildingOrientation:
        cleanString(listing.buildingOrientation, 80) || null,
      deedType: cleanString(listing.deedType, 80) || null,
      recreationalAmenities: arrayOfStrings(listing.recreationalAmenities),
      extraAmenities: arrayOfStrings(listing.extraAmenities),
      viewingHours: cleanString(listing.viewingHours, 120) || null,
      status: "active",
      agency: {
        name: "املاک سقفینو",
        agentName: "مشاور سقفینو",
        logo: null,
        agentAvatar: null,
        phones: phone ? [phone] : [],
        rating: 0,
        reviewsCount: 0,
        activeAds: 1,
        cityName,
        district: neighborhood,
      },
    });

    return NextResponse.json(
      { success: true, code, propertyId: String(property._id) },
      { status: 201 }
    );
  } catch (error) {
    console.error("[properties] creating listing failed:", error);
    if (bucket) {
      await Promise.all(
        uploadedMediaIds.map((id) =>
          bucket.delete(id).catch((cleanupError) => {
            console.error("[properties] media cleanup failed:", cleanupError);
          })
        )
      );
    }
    return NextResponse.json(
      { error: "خطا در ذخیرهٔ آگهی در پایگاه داده" },
      { status: 500 }
    );
  }
}
