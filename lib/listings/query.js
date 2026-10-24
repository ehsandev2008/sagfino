import { toFaDigits, toEnglishDigits } from "@/lib/auth";
import {
  AREA_RANGES,
  DEPOSIT_RANGES,
  FEATURE_LABELS,
  FEATURE_OPTIONS,
  PAGE_SIZE,
  PROPERTY_TYPE_LABELS,
  PROPERTY_TYPE_OPTIONS,
  RENT_RANGES,
  ROOM_OPTIONS,
  SORT_LABELS,
  SORT_OPTIONS,
} from "./constants";

const takeFirst = (value) => (Array.isArray(value) ? value[0] : value);

function cleanText(value, maxLength = 80) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function parseInteger(value, { min = 0, max = 1_000_000 } = {}) {
  const normalized = toEnglishDigits(String(value ?? "")).replace(/[^\d]/g, "");
  if (!normalized) return null;
  const number = Number(normalized);
  if (!Number.isFinite(number)) return null;
  return Math.min(max, Math.max(min, number));
}

function validValue(value, options) {
  return options.some((option) => option.value === value) ? value : "";
}

export function parseListingSearchParams(raw = {}) {
  const get = (key) => takeFirst(raw[key]);

  const type = validValue(String(get("type") ?? ""), PROPERTY_TYPE_OPTIONS);
  const area = validValue(String(get("area") ?? ""), AREA_RANGES);
  const rent = validValue(String(get("rent") ?? ""), RENT_RANGES);
  const deposit = validValue(String(get("deposit") ?? ""), DEPOSIT_RANGES);
  const sort = validValue(String(get("sort") ?? "newest"), SORT_OPTIONS) || "newest";

  const roomsRaw = get("rooms");
  let rooms = null;
  if (roomsRaw != null && roomsRaw !== "") {
    const parsed = parseInteger(roomsRaw, { min: 0, max: 4 });
    rooms = parsed;
  }

  const rawFeatures = String(get("features") ?? "")
    .split(",")
    .map((feature) => feature.trim())
    .filter((feature) => FEATURE_OPTIONS.some((option) => option.value === feature));

  const cityRaw = toEnglishDigits(String(get("city") ?? "")).replace(/[^\d]/g, "");
  const provinceRaw = toEnglishDigits(String(get("province") ?? "")).replace(
    /[^\d]/g,
    ""
  );

  return {
    city: cityRaw || null,
    province: provinceRaw || null,
    q: cleanText(get("q")),
    type,
    rooms,
    area,
    rent,
    deposit,
    minArea: parseInteger(get("minArea"), { min: 0, max: 5000 }),
    maxArea: parseInteger(get("maxArea"), { min: 0, max: 5000 }),
    minRent: parseInteger(get("minRent"), { min: 0, max: 100000 }),
    maxRent: parseInteger(get("maxRent"), { min: 0, max: 100000 }),
    minDeposit: parseInteger(get("minDeposit"), { min: 0, max: 1000000 }),
    maxDeposit: parseInteger(get("maxDeposit"), { min: 0, max: 1000000 }),
    features: [...new Set(rawFeatures)],
    sort,
    page: parseInteger(get("page"), { min: 1, max: 999 }) ?? 1,
    pageSize: PAGE_SIZE,
  };
}

/** بازهٔ عددی نهایی برای متراژ (متر) */
export function resolveAreaRange(filters) {
  const preset = AREA_RANGES.find((range) => range.value === filters.area);
  return {
    min: filters.minArea ?? preset?.min ?? null,
    max: filters.maxArea ?? preset?.max ?? null,
  };
}

/** بازهٔ اجاره به «میلیون تومان» */
export function resolveRentRange(filters) {
  const preset = RENT_RANGES.find((range) => range.value === filters.rent);
  return {
    min: filters.minRent ?? preset?.min ?? null,
    max: filters.maxRent ?? preset?.max ?? null,
  };
}

/** بازهٔ رهن به «میلیون تومان» */
export function resolveDepositRange(filters) {
  const preset = DEPOSIT_RANGES.find((range) => range.value === filters.deposit);
  return {
    min: filters.minDeposit ?? preset?.min ?? null,
    max: filters.maxDeposit ?? preset?.max ?? null,
  };
}

/** ساخت آدرس صفحه بر اساس وضعیت فیلترها */
export function buildListingHref(filters, overrides = {}) {
  const merged = { ...filters, ...overrides };
  const params = new URLSearchParams();

  if (merged.city) params.set("city", String(merged.city));
  else if (merged.province) params.set("province", String(merged.province));
  if (merged.q) params.set("q", merged.q);
  if (merged.type) params.set("type", merged.type);
  if (merged.rooms != null && merged.rooms !== "") params.set("rooms", String(merged.rooms));
  if (merged.area) params.set("area", merged.area);
  if (merged.minArea != null) params.set("minArea", String(merged.minArea));
  if (merged.maxArea != null) params.set("maxArea", String(merged.maxArea));
  if (merged.rent) params.set("rent", merged.rent);
  if (merged.minRent != null) params.set("minRent", String(merged.minRent));
  if (merged.maxRent != null) params.set("maxRent", String(merged.maxRent));
  if (merged.deposit) params.set("deposit", merged.deposit);
  if (merged.minDeposit != null) params.set("minDeposit", String(merged.minDeposit));
  if (merged.maxDeposit != null) params.set("maxDeposit", String(merged.maxDeposit));
  if (merged.features?.length) params.set("features", merged.features.join(","));
  if (merged.sort && merged.sort !== "newest") params.set("sort", merged.sort);
  if (merged.page && Number(merged.page) > 1) params.set("page", String(merged.page));

  const query = params.toString();
  return query ? `/rent?${query}` : "/rent";
}

export function countActiveFilters(filters) {
  let count = 0;
  if (filters.city || filters.province) count += 1;
  if (filters.q) count += 1;
  if (filters.type) count += 1;
  if (filters.rooms != null && filters.rooms !== "") count += 1;
  if (filters.area) count += 1;
  if (
    filters.minArea != null ||
    filters.maxArea != null
  )
    count += 1;
  if (filters.rent || filters.minRent != null || filters.maxRent != null) count += 1;
  if (
    filters.deposit ||
    filters.minDeposit != null ||
    filters.maxDeposit != null
  )
    count += 1;
  if (filters.features?.length) count += filters.features.length;
  return count;
}

function rangeLabel(min, max, unit) {
  if (min != null && max != null) {
    return `${toFaDigits(min)} تا ${toFaDigits(max)} ${unit}`;
  }
  if (min != null) return `بیش از ${toFaDigits(min)} ${unit}`;
  if (max != null) return `تا ${toFaDigits(max)} ${unit}`;
  return "";
}

/**
 * چیپ‌های فیلتر فعال برای نمایش زیر نوار فیلتر.
 * key برای حذف فیلتر استفاده می‌شود.
 */
export function getActiveFilterChips(filters, labels = {}) {
  const chips = [];

  if (filters.city && labels.cityName) {
    chips.push({ key: "location", label: labels.cityName });
  } else if (filters.province && labels.provinceName) {
    chips.push({ key: "location", label: `استان ${labels.provinceName}` });
  }

  if (filters.q) {
    chips.push({ key: "q", label: `جست‌وجو: «${filters.q}»` });
  }

  if (filters.type) {
    chips.push({
      key: "type",
      label: PROPERTY_TYPE_LABELS[filters.type] ?? filters.type,
    });
  }

  if (filters.rooms != null && filters.rooms !== "") {
    if (Number(filters.rooms) >= 4) {
      chips.push({ key: "rooms", label: "۴ اتاق و بیشتر" });
    } else if (Number(filters.rooms) === 0) {
      chips.push({ key: "rooms", label: "بدون اتاق" });
    } else {
      const label = ROOM_OPTIONS.find(
        (option) => Number(option.value) === Number(filters.rooms)
      )?.label;
      chips.push({ key: "rooms", label: label ?? `${toFaDigits(filters.rooms)} اتاق` });
    }
  }

  if (filters.area) {
    const label = AREA_RANGES.find((range) => range.value === filters.area)?.label;
    if (label) chips.push({ key: "area", label });
  } else if (filters.minArea != null || filters.maxArea != null) {
    chips.push({
      key: "area",
      label: rangeLabel(filters.minArea, filters.maxArea, "متر"),
    });
  }

  if (filters.rent) {
    const label = RENT_RANGES.find((range) => range.value === filters.rent)?.label;
    if (label) chips.push({ key: "rent", label: `اجاره ${label.replace("تا ", "تا ")}` });
  } else if (filters.minRent != null || filters.maxRent != null) {
    chips.push({
      key: "rent",
      label: `اجاره ${rangeLabel(filters.minRent, filters.maxRent, "میلیون")}`,
    });
  }

  if (filters.deposit) {
    const label = DEPOSIT_RANGES.find(
      (range) => range.value === filters.deposit
    )?.label;
    if (label) chips.push({ key: "deposit", label: `رهن ${label}` });
  } else if (filters.minDeposit != null || filters.maxDeposit != null) {
    chips.push({
      key: "deposit",
      label: `رهن ${rangeLabel(filters.minDeposit, filters.maxDeposit, "میلیون")}`,
    });
  }

  for (const feature of filters.features ?? []) {
    chips.push({
      key: `feature:${feature}`,
      label: FEATURE_LABELS[feature] ?? feature,
    });
  }

  return chips;
}

export function sortLabel(sort) {
  return SORT_LABELS[sort] ?? SORT_LABELS.newest;
}
