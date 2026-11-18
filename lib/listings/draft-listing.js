import { DEAL_TYPE_LABELS, PROPERTY_TYPE_LABELS } from "./constants";
import { toEnglishDigits, toFaDigits } from "@/lib/auth";

const FLOOR_VALUES = {
  basement: -1,
  ground: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  "6+": 6,
};

const COUNT_VALUES = {
  0: 0,
  1: 1,
  2: 2,
  "3+": 3,
};

function numeric(value) {
  const digits = toEnglishDigits(value ?? "").replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

function countValue(value) {
  if (value in COUNT_VALUES) return COUNT_VALUES[value];
  return numeric(value);
}

function currentPersianYear() {
  const formatted = new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
  }).format(new Date());
  return numeric(formatted);
}

/**
 * تبدیل داده‌های فرم شش‌مرحله‌ای به شکل آگهی مورد انتظار صفحهٔ جزئیات.
 * همهٔ فیلدهای قابل‌نمایش در صفحهٔ آگهی از همین‌جا پر می‌شوند.
 */
export function buildDraftListing(formData, { code, userPhone } = {}) {
  const transactionType = formData.transactionType || "rent";
  const dealType = transactionType === "sale" ? "buy" : transactionType;
  const dealTypeLabel = DEAL_TYPE_LABELS[dealType] ?? "رهن و اجاره";
  const propertyType = formData.propertyType || "apartment";
  const propertyTypeLabel =
    PROPERTY_TYPE_LABELS[propertyType] ?? propertyType;

  const area = numeric(formData.area);
  const roomsValue = formData.rooms === "5+" ? 5 : numeric(formData.rooms);
  const floor = FLOOR_VALUES[formData.floor] ?? 0;
  const totalFloors = Math.max(
    numeric(formData.totalFloors) || 1,
    floor > 0 ? floor : 1
  );
  const buildingAge = numeric(formData.buildingAge);
  const buildYear = buildingAge
    ? Math.max(1, currentPersianYear() - buildingAge)
    : null;

  const neighborhood = (formData.neighborhood || "").trim();
  const cityName = formData.cityName || "";
  const provinceName = formData.provinceName || "";
  const address = [
    provinceName && provinceName !== cityName ? provinceName : "",
    cityName,
    neighborhood,
    formData.mainStreet,
    formData.sideStreet,
  ]
    .filter((part) => part && String(part).trim())
    .join("، ");

  const title =
    (formData.title || "").trim() ||
    `${dealTypeLabel} ${propertyTypeLabel} ${toFaDigits(area)} متری${
      neighborhood ? ` در ${neighborhood}` : ""
    }`;

  const price = numeric(formData.price);
  const deposit = numeric(formData.deposit);
  const monthlyRent = numeric(formData.monthlyRent);

  const locationLat = Number(formData.locationLat);
  const locationLng = Number(formData.locationLng);
  const cityLat = Number(formData.cityLat);
  const cityLng = Number(formData.cityLng);
  const hasSelectedLocation =
    formData.locationLat != null &&
    formData.locationLng != null &&
    Number.isFinite(locationLat) &&
    Number.isFinite(locationLng);
  const hasCityLocation =
    formData.cityLat != null &&
    formData.cityLng != null &&
    Number.isFinite(cityLat) &&
    Number.isFinite(cityLng);

  return {
    id: code,
    code,
    slug: code?.toLowerCase?.() ?? "",
    title,
    description: formData.description || "",
    dealType,
    dealTypeLabel,
    propertyType,
    propertyTypeLabel,
    provinceId: formData.provinceId || "",
    provinceName,
    cityId: formData.cityId || "",
    cityName,
    neighborhood,
    address,
    lat: hasSelectedLocation
      ? locationLat
      : hasCityLocation
        ? cityLat
        : null,
    lng: hasSelectedLocation
      ? locationLng
      : hasCityLocation
        ? cityLng
        : null,
    area,
    rooms: roomsValue,
    bathrooms:
      formData.bathrooms === "4+" ? 4 : numeric(formData.bathrooms) || 1,
    floor,
    floorLabel: formData.floor === "basement" ? "زیرزمین" : null,
    totalFloors,
    buildYear,
    deposit: dealType === "rent" || dealType === "mortgage" ? deposit : 0,
    rent:
      dealType === "rent" || dealType === "mortgage" ? monthlyRent : 0,
    price:
      dealType === "buy" || dealType === "daily-rent" ? price : 0,
    pricePerMeter: numeric(formData.pricePerMeter),
    loanAmount: numeric(formData.loanAmount),
    unitCount:
      formData.unitCount === "4+" ? 4 : numeric(formData.unitCount) || 1,
    images: [],
    cover: null,
    features: [],
    parkingCount: countValue(formData.parking),
    storageCount: countValue(formData.storage),
    elevatorsCount: countValue(formData.elevator),
    floorMaterial: formData.floorMaterial || null,
    bathroomType: formData.bathroomType || null,
    coolingSystem: formData.coolingSystem || null,
    heatingSystem: formData.heatingSystem || null,
    buildingOrientation: formData.direction || null,
    deedType: formData.documentType || null,
    recreationalAmenities: Array.isArray(formData.recreationalAmenities)
      ? formData.recreationalAmenities
      : [],
    extraAmenities: Array.isArray(formData.extraAmenities)
      ? formData.extraAmenities
      : [],
    viewingHours: (formData.viewingHours || "").trim() || null,
    status: "active",
    agency: {
      name: "املاک سقفینو",
      agentName: "مشاور سقفینو",
      logo: null,
      agentAvatar: null,
      phones: userPhone ? [userPhone] : [],
      rating: 0,
      reviewsCount: 0,
      activeAds: 1,
      cityName,
      district: neighborhood,
    },
    isVerified: false,
    isFeatured: false,
    viewsCount: 0,
    favoritesCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    videoUrl: null,
  };
}
