import rawLocations from "@/lib/data/iran-locations.json";

export const locations = rawLocations;

const cityById = new Map(
  rawLocations.cities.map((city) => [String(city.id), city])
);
const provinceById = new Map(
  rawLocations.provinces.map((province) => [String(province.id), province])
);

export const provinces = rawLocations.provinces;
export const cities = rawLocations.cities;

export const popularCities = rawLocations.popularCityIds
  .map((id) => cityById.get(String(id)))
  .filter(Boolean);

export function normalizeSearchText(value = "") {
  return String(value)
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\u064B-\u0652\u0670\u0640]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/** تبدیل شناسهٔ شهر از URL به رقم معتبر */
export function normalizeCityId(value) {
  if (value == null || value === "" || value === "all") return null;
  const cleaned = String(value).replace(/[^\d]/g, "");
  if (!cleaned) return null;
  return cityById.get(cleaned) ?? null;
}

export function getCityById(value) {
  if (value == null) return null;
  return cityById.get(String(value)) ?? null;
}

export function getProvinceById(value) {
  if (value == null) return null;
  return provinceById.get(String(value)) ?? null;
}

export function getProvinceByName(name) {
  if (!name) return null;
  const target = normalizeSearchText(name);
  return (
    rawLocations.provinces.find(
      (province) => normalizeSearchText(province.name) === target
    ) ?? null
  );
}

/**
 * جست‌وجوی شهرها (برای autocomplete و API)
 * مرتب‌سازی: تطابق ابتدای نام، شهرهای بزرگ‌تر، سپس الفبا
 */
export function searchCities({ query = "", provinceId = null, limit = 30 } = {}) {
  const normalizedQuery = normalizeSearchText(query);
  const province = provinceId ? String(provinceId) : null;

  let result = rawLocations.cities;

  if (province) {
    result = result.filter((city) => String(city.provinceId) === province);
  }

  if (normalizedQuery) {
    result = result.filter((city) =>
      normalizeSearchText(city.name).includes(normalizedQuery)
    );
  }

  const score = (city) => {
    const name = normalizeSearchText(city.name);
    if (!normalizedQuery) return city.popular ? 0 : 1;
    if (name === normalizedQuery) return 0;
    if (name.startsWith(normalizedQuery)) return city.popular ? 1 : 2;
    return city.popular ? 3 : 4;
  };

  return [...result]
    .sort((a, b) => {
      const diff = score(a) - score(b);
      if (diff !== 0) return diff;
      return a.name.localeCompare(b.name, "fa");
    })
    .slice(0, limit);
}

/** شهرهای یک استان (برای انتخاب سریع) */
export function getCitiesOfProvince(provinceId, limit = 80) {
  if (!provinceId) return [];
  return rawLocations.cities
    .filter((city) => String(city.provinceId) === String(provinceId))
    .sort((a, b) => {
      if (a.popular !== b.popular) return a.popular ? -1 : 1;
      return a.name.localeCompare(b.name, "fa");
    })
    .slice(0, limit);
}

/** مرکز نقشه برای شهر (یا کل کشور) */
export function getMapCenter(city) {
  if (city?.lat != null && city?.lng != null) {
    return { lat: city.lat, lng: city.lng, zoom: 12 };
  }
  return { lat: 32.4279, lng: 53.688, zoom: 5 };
}

/** آیا شهر در لیست شهرهای پرجمعیت/محبوب است */
export function isPopularCity(cityId) {
  return rawLocations.popularCityIds.some(
    (id) => String(id) === String(cityId)
  );
}

/** فرمت کوتاه «شهر، استان» */
export function formatCityLabel(city) {
  if (!city) return "همه شهرها";
  return city.provinceName && city.provinceName !== city.name
    ? `${city.name}، ${city.provinceName}`
    : city.name;
}
