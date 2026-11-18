/**
 * Seed کردن ۲۰ دفتر املاک و ۲۰ آگهی نمونه بدون حذف داده‌های موجود.
 *
 * تصاویر نمونه از Unsplash دریافت شده، با convert-images.mjs به WebP
 * تبدیل می‌شوند و فایل‌های اصلی پس از تبدیل موفق حذف می‌شوند.
 */
import { existsSync, readFileSync } from "node:fs";
import { MongoClient } from "mongodb";
import {
  AGENCY_SEEDS,
  createDemoProperties,
} from "../lib/listings/demo-data.mjs";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/sagfino";
const locations = JSON.parse(
  readFileSync(
    new URL("../lib/data/iran-locations.json", import.meta.url),
    "utf8"
  )
);
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
const SAMPLE_COUNT = 20;

for (let index = 1; index <= SAMPLE_COUNT; index++) {
  const imagePath = new URL(
    `../public/imags/properties/sample-${String(index).padStart(2, "0")}.webp`,
    import.meta.url
  );
  if (!existsSync(imagePath)) {
    throw new Error(
      `تصویر نمونهٔ ${index} پیدا نشد؛ ابتدا اسکریپت convert-images.mjs را اجرا کنید.`
    );
  }
}

function cityOf(name) {
  return locations.cities.find((city) => city.name === name) ?? null;
}

try {
  await client.connect();
  const db = client.db("sagfino");
  const now = new Date();

  const agencies = AGENCY_SEEDS.slice(0, SAMPLE_COUNT).map((agency, index) => {
    const city = cityOf(agency.cityName);
    if (!city) {
      throw new Error(`شهر دفتر ${agency.name} در فهرست مکان‌ها پیدا نشد.`);
    }

    return {
      ...agency,
      provinceId: city.provinceId,
      provinceName: city.provinceName,
      cityId: city.id,
      createdAt: new Date(now.getTime() - index * 24 * 60 * 60 * 1000),
      updatedAt: now,
    };
  });

  const properties = createDemoProperties(locations, { now: now.getTime() })
    .slice(0, SAMPLE_COUNT)
    .map((property, index) => {
      const image = `/imags/properties/sample-${String(index + 1).padStart(
        2,
        "0"
      )}.webp`;
      const code = `SP-${52001 + index}`;
      return {
        ...property,
        code,
        slug: `sample-${52001 + index}`,
        images: [image],
        cover: image,
        createdAt: new Date(now.getTime() - index * 60 * 60 * 1000),
        updatedAt: now,
      };
    });

  const agencyResult = await db.collection("agencies").bulkWrite(
    agencies.map((agency) => ({
      updateOne: {
        filter: { slug: agency.slug },
        update: { $setOnInsert: agency },
        upsert: true,
      },
    })),
    { ordered: true }
  );
  const propertyResult = await db.collection("properties").bulkWrite(
    properties.map((property) => ({
      updateOne: {
        filter: { code: property.code },
        update: { $setOnInsert: property },
        upsert: true,
      },
    })),
    { ordered: true }
  );

  await db.collection("agencies").createIndex({ slug: 1 }, { unique: true });
  await db.collection("agencies").createIndex({ cityId: 1, rating: -1 });
  await db.collection("properties").createIndex({ code: 1 }, { unique: true });
  await db
    .collection("properties")
    .createIndex({ status: 1, dealType: 1, createdAt: -1 });

  console.log(
    `۲۰ دفتر املاک و ۲۰ آگهی نمونه آماده شد. دفاتر جدید: ${agencyResult.upsertedCount}، آگهی‌های جدید: ${propertyResult.upsertedCount}.`
  );
  console.log("دیتابیس: sagfino");
} catch (error) {
  console.error("خطا در seed املاک:", error);
  process.exitCode = 1;
} finally {
  await client.close();
}
