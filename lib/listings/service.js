import { getCollection } from "@/lib/mongodb";
import { toFaDigits } from "@/lib/auth";
import {
  DEMO_PROPERTIES,
  filterDemoProperties,
  getDemoAgenciesForFilters,
  sortProperties,
  toDemoView,
} from "./demo";
import {
  FEATURE_TO_DEMO_LABEL,
  PROPERTY_TYPE_LABELS,
  SORT_QUERY,
} from "./constants";
import {
  formatArea,
  formatPrice,
  formatPriceCompact,
  formatRelativeTime,
} from "./format";
import {
  getCityById,
  getProvinceById,
  locations,
} from "./locations";
import {
  resolveAreaRange,
  resolveDepositRange,
  resolveRentRange,
} from "./query";

const COLLECTION = "properties";
const AGENCIES_COLLECTION = "agencies";
const MAP_POINT_LIMIT = 300;
const DB_CACHE_TTL = 30_000;

let dbStatus = { available: null, checkedAt: 0 };
let loggedDbError = false;

function logDbError(error) {
  if (loggedDbError) return;
  loggedDbError = true;
  console.warn(
    "[listings] MongoDB unavailable, serving demo data:",
    error?.message ?? error
  );
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function resolveFilters(filters) {
  const city = filters.city ? getCityById(filters.city) : null;
  const province =
    !city && filters.province ? getProvinceById(filters.province) : null;

  return { city, province };
}

function buildMongoQuery(filters) {
  const { city, province } = resolveFilters(filters);
  const query = { status: "active", dealType: "rent" };

  if (city) query.cityId = city.id;
  else if (province) query.provinceId = province.id;

  if (filters.type) query.propertyType = filters.type;

  if (filters.rooms != null && filters.rooms !== "") {
    query.rooms = Number(filters.rooms) >= 4 ? { $gte: 4 } : Number(filters.rooms);
  }

  const area = resolveAreaRange(filters);
  if (area.min != null || area.max != null) {
    query.area = {};
    if (area.min != null) query.area.$gte = area.min;
    if (area.max != null) query.area.$lte = area.max;
  }

  const rent = resolveRentRange(filters);
  if (rent.min != null || rent.max != null) {
    query.rent = {};
    if (rent.min != null) query.rent.$gte = rent.min * 1_000_000;
    if (rent.max != null) query.rent.$lte = rent.max * 1_000_000;
  }

  const deposit = resolveDepositRange(filters);
  if (deposit.min != null || deposit.max != null) {
    query.deposit = {};
    if (deposit.min != null) query.deposit.$gte = deposit.min * 1_000_000;
    if (deposit.max != null) query.deposit.$lte = deposit.max * 1_000_000;
  }

  const featureLabels = (filters.features ?? [])
    .map((feature) => FEATURE_TO_DEMO_LABEL[feature])
    .filter(Boolean);
  if (featureLabels.length) query.features = { $all: featureLabels };

  if (filters.q) {
    const search = new RegExp(escapeRegExp(filters.q), "i");
    query.$or = [
      { title: search },
      { address: search },
      { cityName: search },
      { neighborhood: search },
      { "agency.name": search },
      { code: search },
    ];
  }

  return query;
}

function decorate(property) {
  return {
    ...property,
    propertyTypeLabel:
      property.propertyTypeLabel ??
      PROPERTY_TYPE_LABELS[property.propertyType] ??
      property.propertyType,
    depositLabel: formatPrice(property.deposit),
    rentLabel: formatPrice(property.rent),
    depositCompact: formatPriceCompact(property.deposit),
    rentCompact: formatPriceCompact(property.rent),
    areaLabel: formatArea(property.area),
    timeLabel: formatRelativeTime(property.createdAt),
    href: `/properties/${property.code}`,
  };
}

function toDbView(doc) {
  return {
    id: String(doc._id),
    code: doc.code,
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    dealType: doc.dealType,
    propertyType: doc.propertyType,
    provinceId: doc.provinceId,
    provinceName: doc.provinceName,
    cityId: doc.cityId,
    cityName: doc.cityName,
    neighborhood: doc.neighborhood,
    address: doc.address,
    lat: doc.lat,
    lng: doc.lng,
    area: doc.area,
    rooms: doc.rooms,
    bathrooms: doc.bathrooms,
    floor: doc.floor,
    totalFloors: doc.totalFloors,
    buildYear: doc.buildYear,
    deposit: doc.deposit,
    rent: doc.rent,
    images: doc.images ?? [],
    cover: doc.cover ?? doc.images?.[0] ?? null,
    features: doc.features ?? [],
    parkingCount: doc.parkingCount ?? null,
    storageCount: doc.storageCount ?? null,
    elevatorsCount: doc.elevatorsCount ?? null,
    floorMaterial: doc.floorMaterial ?? null,
    bathroomType: doc.bathroomType ?? null,
    coolingSystem: doc.coolingSystem ?? null,
    heatingSystem: doc.heatingSystem ?? null,
    buildingOrientation: doc.buildingOrientation ?? null,
    deedType: doc.deedType ?? null,
    recreationalAmenities: doc.recreationalAmenities ?? [],
    extraAmenities: doc.extraAmenities ?? [],
    viewingHours: doc.viewingHours ?? null,
    status: doc.status ?? "active",
    agency: doc.agency ?? null,
    isVerified: Boolean(doc.isVerified),
    isFeatured: Boolean(doc.isFeatured),
    viewsCount: doc.viewsCount ?? 0,
    favoritesCount: doc.favoritesCount ?? 0,
    createdAt:
      doc.createdAt instanceof Date
        ? doc.createdAt.toISOString()
        : doc.createdAt ?? null,
    updatedAt:
      doc.updatedAt instanceof Date
        ? doc.updatedAt.toISOString()
        : doc.updatedAt ?? null,
  };
}

function toMapPoint(property) {
  return {
    id: property.code,
    code: property.code,
    lat: property.lat,
    lng: property.lng,
    title: property.title,
    cover: property.cover,
    rent: property.rent,
    deposit: property.deposit,
    rentLabel: formatPrice(property.rent),
    depositLabel: formatPrice(property.deposit),
    area: property.area,
    rooms: property.rooms,
    cityName: property.cityName,
    neighborhood: property.neighborhood,
    propertyTypeLabel:
      PROPERTY_TYPE_LABELS[property.propertyType] ?? property.propertyType,
    isFeatured: Boolean(property.isFeatured),
    href: `/properties/${property.code}`,
  };
}

function toAgencyView(agency) {
  const rating =
    typeof agency.rating === "number" ? agency.rating : Number(agency.rating ?? 0);
  return {
    id: agency.slug ?? String(agency._id),
    slug: agency.slug,
    name: agency.name,
    logo: agency.logo,
    phones: agency.phones ?? [],
    verified: Boolean(agency.verified),
    featured: Boolean(agency.featured),
    rating,
    ratingLabel: `${toFaDigits(String(rating).replace(".", "٫"))} از ۵`,
    reviewsCount: Number(agency.reviewsCount ?? 0),
    reviewsLabel: toFaDigits(agency.reviewsCount ?? 0),
    activeAds: Number(agency.activeAds ?? 0),
    activeAdsLabel: `بیش از ${toFaDigits(
      Number(agency.activeAds ?? 0).toLocaleString("en-US")
    ).replace(/,/g, "٬")}`,
    cityName: agency.cityName,
    district: agency.district,
    location: [agency.cityName, agency.district].filter(Boolean).join("، "),
    address: agency.address,
    since: agency.since,
    about: agency.about,
  };
}

async function isDatabaseReady(collection) {
  const now = Date.now();
  if (dbStatus.available != null && now - dbStatus.checkedAt < DB_CACHE_TTL) {
    return dbStatus.available;
  }

  const count = await collection.countDocuments({
    status: "active",
    dealType: "rent",
  });
  dbStatus = { available: count > 0, checkedAt: now };
  return count > 0;
}

async function searchDatabase(filters, collection) {
  const query = buildMongoQuery(filters);
  const pageSize = filters.pageSize;
  const total = await collection.countDocuments(query);

  if (total === 0) {
    const ready = await isDatabaseReady(collection);
    if (!ready) return null;

    return {
      items: [],
      total: 0,
      page: 1,
      pageSize,
      totalPages: 1,
      mapPoints: [],
      source: "database",
    };
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, filters.page), totalPages);

  const [docs, mapDocs] = await Promise.all([
    collection
      .find(query)
      .sort(SORT_QUERY[filters.sort] ?? SORT_QUERY.newest)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray(),
    collection
      .find(query, {
        projection: {
          code: 1,
          lat: 1,
          lng: 1,
          title: 1,
          cover: 1,
          images: 1,
          rent: 1,
          deposit: 1,
          area: 1,
          rooms: 1,
          cityName: 1,
          neighborhood: 1,
          propertyType: 1,
          createdAt: 1,
        },
      })
      .sort({ createdAt: -1 })
      .limit(MAP_POINT_LIMIT)
      .toArray(),
  ]);

  return {
    items: docs.map((doc) => decorate(toDbView(doc))),
    total,
    page,
    pageSize,
    totalPages,
    mapPoints: mapDocs.map((doc) => toMapPoint(toDbView(doc))),
    source: "database",
  };
}

function searchDemo(filters) {
  const all = filterDemoProperties(filters);
  const pageSize = filters.pageSize;
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, filters.page), totalPages);
  const start = (page - 1) * pageSize;

  return {
    items: all
      .slice(start, start + pageSize)
      .map((property) => decorate(toDemoView(property))),
    total,
    page,
    pageSize,
    totalPages,
    mapPoints: sortProperties(all, "newest")
      .slice(0, MAP_POINT_LIMIT)
      .map((property) => toMapPoint(toDemoView(property))),
    source: "demo",
  };
}

/** نتیجهٔ کامل جست‌وجو؛ اول دیتابیس، در صورت خالی/خطا دادهٔ دمو */
export async function getRentListings(filters) {
  try {
    const collection = await getCollection(COLLECTION);
    const result = await searchDatabase(filters, collection);
    if (result) return result;
  } catch (error) {
    logDbError(error);
  }

  return searchDemo(filters);
}

async function getDatabaseAgencies(filters) {
  const collection = await getCollection(AGENCIES_COLLECTION);
  const { city, province } = resolveFilters(filters);
  const query = {};

  if (city) query.cityName = city.name;
  else if (province) {
    const provinceCityNames = locations.cities
      .filter((item) => item.provinceId === province.id)
      .map((item) => item.name);
    query.cityName = { $in: provinceCityNames };
  }

  let agencies = await collection
    .find(query)
    .sort({ featured: -1, rating: -1 })
    .limit(4)
    .toArray();

  if (!agencies.length && (city || province)) {
    agencies = await collection
      .find({ featured: true })
      .sort({ rating: -1 })
      .limit(4)
      .toArray();
  }

  return agencies.map(toAgencyView);
}

/** دفاتر املاک مرتبط با فیلتر مکان */
export async function getRelatedAgencies(filters) {
  try {
    const agencies = await getDatabaseAgencies(filters);
    if (agencies.length) return agencies;
  } catch (error) {
    logDbError(error);
  }

  return getDemoAgenciesForFilters(filters).map(toAgencyView);
}

/** دریافت یک آگهی با کد برای صفحهٔ جزئیات */
export async function getListingByCode(code) {
  if (!code) return null;

  try {
    const collection = await getCollection(COLLECTION);
    const doc = await collection.findOne({ code, status: "active" });
    if (doc) return decorate(toDbView(doc));
  } catch (error) {
    logDbError(error);
  }

  const demo = DEMO_PROPERTIES.find(
    (property) => property.code === code || property.slug === code
  );
  return demo ? decorate(toDemoView(demo)) : null;
}

export async function getListingCounts() {
  const demo = DEMO_PROPERTIES;
  try {
    const collection = await getCollection(COLLECTION);
    const total = await collection.countDocuments({
      status: "active",
      dealType: "rent",
    });
    if (total > 0) return { total, source: "database" };
  } catch (error) {
    logDbError(error);
  }
  return { total: demo.length, source: "demo" };
}
