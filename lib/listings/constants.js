/** گزینه‌های مشترک فیلترها — قابل استفاده در سرور و کلاینت */

export const PAGE_SIZE = 12;

export const PROPERTY_TYPE_OPTIONS = [
  { value: "", label: "همه انواع ملک" },
  { value: "apartment", label: "آپارتمان" },
  { value: "villa", label: "ویلا" },
  { value: "office", label: "دفتر کار" },
  { value: "store", label: "مغازه" },
  { value: "land", label: "زمین" },
];

export const PROPERTY_TYPE_LABELS = Object.fromEntries(
  PROPERTY_TYPE_OPTIONS.filter((option) => option.value).map((option) => [
    option.value,
    option.label,
  ])
);

export const ROOM_OPTIONS = [
  { value: "", label: "همه" },
  { value: "0", label: "بدون اتاق" },
  { value: "1", label: "۱ اتاق" },
  { value: "2", label: "۲ اتاق" },
  { value: "3", label: "۳ اتاق" },
  { value: "4", label: "۴ اتاق و بیشتر" },
];

export const AREA_RANGES = [
  { value: "", label: "همه متراژها" },
  { value: "0-50", label: "تا ۵۰ متر", min: 0, max: 50 },
  { value: "50-100", label: "۵۰ تا ۱۰۰ متر", min: 50, max: 100 },
  { value: "100-150", label: "۱۰۰ تا ۱۵۰ متر", min: 100, max: 150 },
  { value: "150-200", label: "۱۵۰ تا ۲۰۰ متر", min: 150, max: 200 },
  { value: "200-", label: "بیش از ۲۰۰ متر", min: 200, max: null },
];

export const RENT_RANGES = [
  { value: "", label: "همه اجاره‌ها" },
  { value: "0-10", label: "تا ۱۰ میلیون", min: 0, max: 10 },
  { value: "10-20", label: "۱۰ تا ۲۰ میلیون", min: 10, max: 20 },
  { value: "20-30", label: "۲۰ تا ۳۰ میلیون", min: 20, max: 30 },
  { value: "30-50", label: "۳۰ تا ۵۰ میلیون", min: 30, max: 50 },
  { value: "50-", label: "بیش از ۵۰ میلیون", min: 50, max: null },
];

export const DEPOSIT_RANGES = [
  { value: "", label: "همه رهن‌ها" },
  { value: "0-500", label: "تا ۵۰۰ میلیون", min: 0, max: 500 },
  { value: "500-1000", label: "۵۰۰ میلیون تا ۱ میلیارد", min: 500, max: 1000 },
  { value: "1000-2000", label: "۱ تا ۲ میلیارد", min: 1000, max: 2000 },
  { value: "2000-", label: "بیش از ۲ میلیارد", min: 2000, max: null },
];

export const SORT_OPTIONS = [
  { value: "newest", label: "جدیدترین" },
  { value: "cheapest", label: "کم‌ترین اجاره" },
  { value: "most-expensive", label: "بیشترین اجاره" },
  { value: "largest", label: "بیشترین متراژ" },
];

export const SORT_LABELS = Object.fromEntries(
  SORT_OPTIONS.map((option) => [option.value, option.label])
);

export const FEATURE_OPTIONS = [
  { value: "parking", label: "پارکینگ" },
  { value: "elevator", label: "آسانسور" },
  { value: "storage", label: "انباری" },
  { value: "balcony", label: "بالکن" },
  { value: "pool", label: "استخر" },
  { value: "furnished", label: "مبله" },
];

export const FEATURE_LABELS = Object.fromEntries(
  FEATURE_OPTIONS.map((option) => [option.value, option.label])
);

// داده‌های دمو از برچسب‌های فارسی استفاده می‌کنند؛ برای فیلتر امکانات
export const FEATURE_TO_DEMO_LABEL = {
  parking: "پارکینگ",
  elevator: "آسانسور",
  storage: "انباری",
  balcony: "بالکن",
  pool: "استخر",
  furnished: "مبله",
};

export const SORT_QUERY = {
  newest: { createdAt: -1, _id: -1 },
  cheapest: { rent: 1, createdAt: -1 },
  "most-expensive": { rent: -1, createdAt: -1 },
  largest: { area: -1, createdAt: -1 },
};
