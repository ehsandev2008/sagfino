/**
 * سرویس احراز هویت (فعلا موک — بدون وب‌سرویس)
 *
 * TODO: وقتی داشبورد ادمین توسعه داده شد، بدنه این توابع را با
 * فراخوانی وب‌سرویس واقعی جایگزین کن (سیگنATURE توابع عوض نمی‌شود).
 */

export const DEMO_PHONE = "09115640861";
export const DEMO_CODE = "11111";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** تبدیل ارقام فارسی/عربی به انگلیسی */
export function toEnglishDigits(value = "") {
  return String(value)
    .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
    .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
}

/** تبدیل ارقام انگلیسی به فارسی (برای نمایش) */
export function toFaDigits(value = "") {
  return String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
}

/** اعتبارسنجی شماره موبایل ایران */
export function isValidIranianPhone(phone) {
  return /^09\d{9}$/.test(toEnglishDigits(phone).trim());
}

/** ارسال کد تأیید به شماره موبایل */
export async function requestLoginCode(phone) {
  await wait(900);
  return { ok: true, phone: toEnglishDigits(phone).trim() };
}

/** بررسی کد تأیید — در حالت دمو فقط DEMO_CODE قبول است */
export async function verifyLoginCode(phone, code) {
  await wait(900);
  return { ok: toEnglishDigits(code).trim() === DEMO_CODE };
}
