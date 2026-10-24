/**
 * Seed کردن آگهی‌های اجاره و دفاتر املاک در MongoDB
 *
 * اجرا:
 *   npm run seed:listings
 */
import { readFileSync } from "node:fs";
import { MongoClient } from "mongodb";
import {
  createDemoAgencies,
  createDemoProperties,
} from "../lib/listings/demo-data.mjs";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/sagfino";
const locations = JSON.parse(
  readFileSync(new URL("../lib/data/iran-locations.json", import.meta.url), "utf8")
);

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

function cityOf(name) {
  return locations.cities.find((city) => city.name === name) ?? null;
}

try {
  await client.connect();
  const db = client.db("sagfino");

  const properties = createDemoProperties(locations, { now: Date.now() });
  const agencies = createDemoAgencies().map((agency) => {
    const city = cityOf(agency.cityName);
    return {
      ...agency,
      provinceId: city?.provinceId ?? null,
      provinceName: city?.provinceName ?? "",
      cityId: city?.id ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  // آژانس‌ها
  await db.collection("agencies").deleteMany({});
  await db.collection("agencies").insertMany(agencies);
  await db.collection("agencies").createIndex({ slug: 1 }, { unique: true });
  await db.collection("agencies").createIndex({ cityName: 1, featured: -1 });

  // آگهی‌ها
  await db.collection("properties").deleteMany({});
  await db.collection("properties").insertMany(properties);
  await db.collection("properties").createIndex({ code: 1 }, { unique: true });
  await db
    .collection("properties")
    .createIndex({ status: 1, dealType: 1, createdAt: -1 });
  await db.collection("properties").createIndex({ cityId: 1, propertyType: 1 });
  await db.collection("properties").createIndex({ rent: 1 });
  await db.collection("properties").createIndex({ area: 1 });

  console.log(
    `✅ ${properties.length} آگهی اجاره و ${agencies.length} دفتر املاک در MongoDB ذخیره شد.`
  );
  console.log(`   دیتابیس: ${uri}`);
} catch (error) {
  console.error("❌ خطا در Seed:", error.message);
  process.exitCode = 1;
} finally {
  await client.close();
}
