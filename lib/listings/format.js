import { toFaDigits } from "@/lib/auth";

const faNumber = new Intl.NumberFormat("en-US");

/** عدد با جداکنندهٔ هزارگان فارسی: ۱۲٬۴۵۰ */
export function formatNumberFa(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "۰";
  return toFaDigits(faNumber.format(number)).replace(/,/g, "٬");
}

/**
 * مبلغ تومانی به شکل خوانا:
 * ۱٬۲۵۰٬۰۰۰٬۰۰۰ → «۱ میلیارد و ۲۵۰ میلیون تومان»
 */
export function formatPrice(value) {
  const amount = Math.max(0, Math.round(Number(value) || 0));
  if (amount === 0) return "توافقی";

  const billions = Math.floor(amount / 1_000_000_000);
  const millions = Math.round((amount % 1_000_000_000) / 1_000_000);

  if (billions > 0 && millions > 0) {
    return `${toFaDigits(billions)} میلیارد و ${toFaDigits(millions)} میلیون تومان`;
  }
  if (billions > 0) {
    return `${toFaDigits(billions)} میلیارد تومان`;
  }
  if (millions > 0) {
    return `${toFaDigits(millions)} میلیون تومان`;
  }
  return `${formatNumberFa(amount)} تومان`;
}

/**
 * نسخهٔ فشردهٔ مبلغ برای کارت‌های آگهی:
 * ۴٬۱۵۰٬۰۰۰٬۰۰۰ → «۴٫۱۵ میلیارد»
 * ۴۶٬۰۰۰٬۰۰۰ → «۴۶ میلیون»
 */
export function formatPriceCompact(value) {
  const amount = Math.max(0, Math.round(Number(value) || 0));
  if (amount === 0) return "توافقی";

  if (amount >= 1_000_000_000) {
    const billions = Math.round((amount / 1_000_000_000) * 100) / 100;
    return `${toFaDigits(String(billions).replace(".", "٫"))} میلیارد`;
  }
  if (amount >= 1_000_000) {
    return `${toFaDigits(Math.round(amount / 1_000_000))} میلیون`;
  }
  return formatNumberFa(amount);
}

/** نسخهٔ کوتاه مبلغ برای پین نقشه */
export function formatPriceShort(value) {
  const amount = Math.max(0, Math.round(Number(value) || 0));
  if (amount >= 1_000_000_000) {
    const billions = Math.round((amount / 1_000_000_000) * 10) / 10;
    return `${toFaDigits(String(billions).replace(".", "٫"))} میلیارد`;
  }
  if (amount >= 1_000_000) {
    return `${toFaDigits(Math.round(amount / 1_000_000))} میلیون`;
  }
  return formatNumberFa(amount);
}

export function formatArea(value) {
  return `${formatNumberFa(value)} متر`;
}

export function formatRooms(value) {
  const rooms = Number(value) || 0;
  if (rooms === 0) return "بدون اتاق";
  if (rooms >= 5) return "۵+ اتاق";
  return `${toFaDigits(rooms)} اتاق`;
}

export function formatRelativeTime(value, now = Date.now()) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const diff = Math.max(0, now - date.getTime());
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (minutes < 5) return "همین حالا";
  if (minutes < 60) return `${toFaDigits(minutes)} دقیقه پیش`;
  if (hours < 24) return `${toFaDigits(hours)} ساعت پیش`;
  if (days === 1) return "دیروز";
  if (days < 7) return `${toFaDigits(days)} روز پیش`;
  if (days < 30) return `${toFaDigits(Math.floor(days / 7))} هفته پیش`;
  if (days < 365) return `${toFaDigits(Math.floor(days / 30))} ماه پیش`;
  return `${toFaDigits(Math.floor(days / 365))} سال پیش`;
}

export function formatDateFa(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/** «۳ اتاق · ۱۲۰ متر · طبقهٔ ۳» */
export function formatSpecs(property) {
  const parts = [];
  if (property.rooms > 0) parts.push(`${toFaDigits(property.rooms)} اتاق`);
  parts.push(formatArea(property.area));
  if (property.floor > 0) parts.push(`طبقهٔ ${toFaDigits(property.floor)}`);
  return parts.join(" · ");
}
