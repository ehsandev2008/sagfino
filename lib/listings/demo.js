import locationsData from "@/lib/data/iran-locations.json";
import {
  createDemoAgencies,
  createDemoProperties,
} from "./demo-data.mjs";
import { normalizeSearchText, getCityById, getProvinceById } from "./locations";
import {
  resolveAreaRange,
  resolveDepositRange,
  resolveRentRange,
} from "./query";
import { FEATURE_TO_DEMO_LABEL, PROPERTY_TYPE_LABELS } from "./constants";

/** دیتاست قطعی دمو — یک‌بار در طول عمر پروسه ساخته می‌شود */
export const DEMO_PROPERTIES = createDemoProperties(locationsData, {
  now: Date.now(),
});

export const DEMO_AGENCIES = createDemoAgencies();

export function isDemoProperty(property) {
  return typeof property?.code === "string" && property.code.startsWith("SG-");
}

/** فیلتر کردن دیتاست دمو (همان منطق API) */
export function filterDemoProperties(filters) {
  const area = resolveAreaRange(filters);
  const rent = resolveRentRange(filters);
  const deposit = resolveDepositRange(filters);

  const city = filters.city ? getCityById(filters.city) : null;
  const province = !city && filters.province ? getProvinceById(filters.province) : null;

  const query = normalizeSearchText(filters.q);
  const featureLabels = (filters.features ?? [])
    .map((feature) => FEATURE_TO_DEMO_LABEL[feature])
    .filter(Boolean);

  const matched = DEMO_PROPERTIES.filter((property) => {
    if (city && String(property.cityId) !== String(city.id)) return false;
    if (province && String(property.provinceId) !== String(province.id)) return false;
    if (filters.type && property.propertyType !== filters.type) return false;

    if (filters.rooms != null && filters.rooms !== "") {
      const rooms = Number(filters.rooms);
      if (rooms >= 4) {
        if (property.rooms < 4) return false;
      } else if (property.rooms !== rooms) {
        return false;
      }
    }

    if (area.min != null && property.area < area.min) return false;
    if (area.max != null && property.area > area.max) return false;
    if (rent.min != null && property.rent < rent.min * 1_000_000) return false;
    if (rent.max != null && property.rent > rent.max * 1_000_000) return false;
    if (deposit.min != null && property.deposit < deposit.min * 1_000_000)
      return false;
    if (deposit.max != null && property.deposit > deposit.max * 1_000_000)
      return false;

    if (featureLabels.length) {
      const propertyFeatures = new Set(property.features ?? []);
      if (!featureLabels.every((label) => propertyFeatures.has(label))) return false;
    }

    if (query) {
      const haystack = normalizeSearchText(
        [
          property.title,
          property.address,
          property.cityName,
          property.neighborhood,
          property.agency?.name,
          property.code,
        ].join(" ")
      );
      if (!haystack.includes(query)) return false;
    }

    return true;
  });

  return sortProperties(matched, filters.sort);
}

export function sortProperties(properties, sort = "newest") {
  const list = [...properties];

  switch (sort) {
    case "cheapest":
      return list.sort((a, b) => a.rent - b.rent);
    case "most-expensive":
      return list.sort((a, b) => b.rent - a.rent);
    case "largest":
      return list.sort((a, b) => b.area - a.area);
    case "newest":
    default:
      return list.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
}

export function getDemoAgenciesForFilters(filters) {
  const city = filters.city ? getCityById(filters.city) : null;
  const province = !city && filters.province ? getProvinceById(filters.province) : null;

  let agencies = DEMO_AGENCIES;

  if (city) {
    agencies = agencies.filter(
      (agency) => agency.cityName === city.name
    );
  } else if (province) {
    agencies = agencies.filter((agency) => {
      const agencyCity = locationsData.cities.find(
        (item) => item.name === agency.cityName
      );
      return agencyCity?.provinceId === province.id;
    });
  }

  if (!agencies.length) {
    agencies = DEMO_AGENCIES.filter((agency) => agency.featured);
  }
  if (!agencies.length) agencies = DEMO_AGENCIES;

  return [...agencies]
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return b.rating - a.rating;
    })
    .slice(0, 4);
}

export function toDemoView(property) {
  return {
    id: property.code,
    code: property.code,
    slug: property.slug,
    title: property.title,
    description: property.description,
    dealType: property.dealType,
    propertyType: property.propertyType,
    propertyTypeLabel: PROPERTY_TYPE_LABELS[property.propertyType] ?? property.propertyType,
    provinceId: property.provinceId,
    provinceName: property.provinceName,
    cityId: property.cityId,
    cityName: property.cityName,
    neighborhood: property.neighborhood,
    address: property.address,
    lat: property.lat,
    lng: property.lng,
    area: property.area,
    rooms: property.rooms,
    bathrooms: property.bathrooms,
    floor: property.floor,
    totalFloors: property.totalFloors,
    buildYear: property.buildYear,
    deposit: property.deposit,
    rent: property.rent,
    images: property.images,
    cover: property.cover,
    features: property.features,
    parkingCount: property.parkingCount ?? null,
    storageCount: property.storageCount ?? null,
    elevatorsCount: property.elevatorsCount ?? null,
    floorMaterial: property.floorMaterial ?? null,
    bathroomType: property.bathroomType ?? null,
    coolingSystem: property.coolingSystem ?? null,
    heatingSystem: property.heatingSystem ?? null,
    buildingOrientation: property.buildingOrientation ?? null,
    deedType: property.deedType ?? null,
    recreationalAmenities: property.recreationalAmenities ?? [],
    extraAmenities: property.extraAmenities ?? [],
    viewingHours: property.viewingHours ?? null,
    status: property.status ?? "active",
    agency: property.agency,
    isVerified: property.isVerified,
    isFeatured: property.isFeatured,
    viewsCount: property.viewsCount,
    favoritesCount: property.favoritesCount,
    createdAt:
      property.createdAt instanceof Date
        ? property.createdAt.toISOString()
        : property.createdAt,
    updatedAt:
      property.updatedAt instanceof Date
        ? property.updatedAt.toISOString()
        : property.updatedAt ?? null,
  };
}
