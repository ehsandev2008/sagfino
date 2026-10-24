<div align="center">

# سقفینو | Sagfino

### بازار آنلاین املاک و مستغلات ایران

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3-61DAFB?logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.7-47A248?logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-Private-red)]()

<br/>

**سقفینو** یک پلتفرم فارسی و راست‌به‌چپ برای جست‌وجوی املاک و مستغلات است که با Next.js App Router، React 19 و Tailwind CSS 4 توسعه داده می‌شود.

طراحی رابط کاربری بر پایه فایل‌های Figma و با تمرکز بر تجربه موبایل، انیمیشن‌های نرم و دسترس‌پذیری انجام شده است.

</div>

---

## درباره پروژه

سقفینو دو تجربه مستقل دارد:

- **صفحه مهمان:** معرفی خدمات، دسته‌بندی املاک، مشاورین و مجله سقفینو
- **صفحه کاربر واردشده (Home Pro):** آگهی‌های اجاره، خدمات، جست‌وجوهای پیشنهادی، املاک برتر و مشاورین برتر تهران

ورود در حال حاضر به صورت **دمو** پیاده‌سازی شده و شامل دریافت شماره موبایل و کد تأیید است. شماره و کد دمو در `lib/auth.js` قرار دارند و کد تأیید عمداً در رابط کاربری نمایش داده نمی‌شود.

---

## ویژگی‌ها

- طراحی کامل **RTL** با فونت شبنم (Shabnam FD)
- رابط کاربری واکنش‌گرا برای موبایل، تبلت و دسکتاپ
- هدر شناور با مخفی‌شدن هوشمند هنگام اسکرول و منوی موبایل
- ورود دومرحله‌ای دمو (شماره موبایل + کد تأیید) همراه با اعتبارسنجی
- سیستم توست سفارشی با انیمیشن Motion
- صفحه مهمان با بخش‌های Hero، راهنما، دسته‌بندی املاک، مشاورین و بلاگ
- صفحه Home Pro با بخش‌های Hero، آگهی‌های اجاره، خدمات، جست‌وجوهای پیشنهادی، املاک برتر و مشاورین برتر
- کاروسل اسکرولی با Snap در موبایل و گرید چندستونه در دسکتاپ
- **پاپ‌آپ اطلاعات آژانس** با انیمیشن GSAP، باز شدن از محل کارت، بستن با Escape، قفل اسکرول و مدیریت فوکوس
- انیمیشن‌های ورود بخش‌ها با GSAP و ScrollTrigger
- پشتیبانی از `prefers-reduced-motion`
- پایه اتصال به MongoDB و مدل‌های آماده برای توسعه APIها

---

## پشته فناوری

| بخش | فناوری |
|---|---|
| فریم‌ورک | Next.js 16.4 (App Router + Turbopack) |
| رابط کاربری | React 19.3 |
| استایل | Tailwind CSS 4 |
| انیمیشن | GSAP 3.15، ScrollTrigger، `@gsap/react`، Motion |
| آیکون‌ها | Iconsax React |
| دیتابیس | MongoDB Driver 7.7 (درایور رسمی) |
| فونت | Shabnam FD (لوکال در `public/Fonts`) |
| زبان | JavaScript (بدون TypeScript) |

---

## نصب و راه‌اندازی

### پیش‌نیازها

- **Node.js** نسخه `20.9` یا بالاتر
- **npm** (یا pnpm/yarn)
- **MongoDB** به صورت لوکال یا MongoDB Atlas

### مراحل اجرا

```bash
# 1. دریافت سورس
git clone https://github.com/ehsandev2008/sagfino.git
cd sagfino

# 2. نصب وابستگی‌ها
npm install
```

فایل `.env.local` را در ریشه پروژه بسازید:

```env
MONGODB_URI=mongodb://localhost:27017/sagfino
```

در صورت استفاده از Atlas، رشته اتصال اختصاصی خود را جایگزین کنید.

```bash
# 3. اجرای محیط توسعه
npm run dev
```

سایت در آدرس [http://localhost:3000](http://localhost:3000) در دسترس خواهد بود.

> برای مشاهده Home Pro کافی است از دکمه «ورود» در هدر استفاده کنید. اطلاعات ورود دمو در `lib/auth.js` تعریف شده است.

### اسکریپت‌ها

| دستور | توضیح |
|---|---|
| `npm run dev` | اجرای محیط توسعه با Turbopack |
| `npm run build` | ساخت نسخه Production |
| `npm run start` | اجرای نسخه Production |
| `npm run lint` | بررسی کدها با ESLint |

---

## ساختار پروژه

```text
sagfino/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── send-code/route.js
│   │   │   ├── verify-code/route.js
│   │   │   └── logout/route.js
│   │   └── properties/[id]/route.js
│   ├── globals.css              # توکن‌های طراحی، فونت و استایل‌های پایه
│   ├── layout.js                # لایه اصلی، RTL و فونت
│   └── page.js                  # انتخاب صفحه مهمان / Home Pro
│
├── components/
│   ├── anim/gsap.js             # پیکربندی مشترک GSAP
│   ├── auth/
│   │   ├── AuthProvider.jsx     # وضعیت ورود و کنترل مودال
│   │   ├── LoginModal.jsx       # مودال ورود دومرحله‌ای
│   │   └── OtpInput.jsx         # ورودی کد تأیید
│   ├── home/                    # بخش‌های صفحه مهمان
│   │   ├── HeroSection.jsx
│   │   ├── SearchCard.jsx
│   │   ├── HelpSection.jsx
│   │   ├── PropertyTypes.jsx
│   │   ├── AdvisorsSection.jsx
│   │   └── BlogSection.jsx
│   ├── home-pro/                # بخش‌های صفحه کاربر واردشده
│   │   ├── HeroProSection.jsx
│   │   ├── RentListings.jsx
│   │   ├── ServicesSection.jsx
│   │   ├── SuggestedSearches.jsx
│   │   ├── top-agencies/
│   │   │   ├── TopAgenciesSection.jsx
│   │   │   ├── AgencyCard.jsx
│   │   │   └── AgencyModal.jsx
│   │   └── top-advisors/
│   │       ├── TopAdvisorsSection.jsx
│   │       └── AdvisorCard.jsx
│   ├── ui/
│   │   ├── Carousel.jsx
│   │   ├── Reveal.jsx           # ریویل اسکرولی با GSAP
│   │   └── toast/               # سیستم اعلان سفارشی
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── Logo.jsx
│   └── ExpandableGroup.jsx
│
├── context/
│   └── AuthContext.jsx
│
├── lib/
│   ├── auth.js                  # منطق ورود دمو و ابزار ارقام فارسی
│   ├── mongodb.js               # اتصال MongoDB
│   ├── constants.js
│   └── db/connect.js
│
├── models/                      # مدل‌های MongoDB
│   ├── User.js
│   ├── Property.js
│   ├── Agent.js
│   ├── Agency.js
│   ├── Favorite.js
│   ├── BlogPost.js
│   ├── Category.js
│   ├── Inquiry.js
│   └── index.js
│
├── public/
│   ├── Fonts/                   # فونت Shabnam FD
│   ├── logos/
│   └── imags/
│
├── scripts/
│   └── convert-images.mjs       # تبدیل تصاویر PNG به WebP
│
├── next.config.mjs
├── jsconfig.json                # alias مسیر @/*
└── package.json
```

---

## صفحه‌ها و بخش‌ها

### صفحه مهمان

ترتیب بخش‌ها در `app/page.js`:

1. Hero
2. Help
3. PropertyTypes
4. Advisors
5. Blog

### صفحه Home Pro

پس از ورود، همان مسیر `/` نسخه حرفه‌ای را نمایش می‌دهد:

1. HeroPro
2. RentListings
3. Services
4. SuggestedSearches
5. TopAgencies
6. TopAdvisors

### پاپ‌آپ آژانس

با کلیک روی هر کارت «املاک برتر تهران»، پاپ‌آپ تمام‌صفحه همان آژانس باز می‌شود و اطلاعات زیر را نمایش می‌دهد:

- لوگوی آژانس
- نام آژانس
- شماره‌های تماس (قابل کلیک با `tel:`)

پاپ‌آپ با GSAP از محل کارت باز و به همان سمت بسته می‌شود و شامل مدیریت فوکوس، بستن با `Escape` و قفل اسکرول است.

---

## APIهای موجود

| متد | مسیر | توضیح |
|---|---|---|
| `POST` | `/api/auth/send-code` | اعتبارسنجی شماره و ارسال کد تأیید (دمو) |
| `POST` | `/api/auth/verify-code` | بررسی کد، ساخت/یافت کاربر و ثبت کوکی ورود |
| `POST` | `/api/auth/logout` | خروج از حساب |
| `GET` | `/api/properties/:id` | دریافت اطلاعات یک ملک و افزایش بازدید |

نمونه بدنه درخواست ورود:

```json
{
  "phone": "09xxxxxxxxx",
  "code": "xxxxx"
}
```

> رابط کاربری ورود فعلاً از منطق دمو در `lib/auth.js` استفاده می‌کند و اتصال کامل به APIهای احراز هویت از مراحل بعدی توسعه است.

---

## طراحی و انیمیشن

- توکن‌های رنگ، تایپوگرافی و شعاع گوشه‌ها در `app/globals.css` تعریف شده‌اند.
- رنگ اصلی برند: `#CB1B1B`
- فونت Shabnam FD به صورت لوکال بارگذاری می‌شود.
- بخش‌های صفحه با کامپوننت `Reveal` و ترکیب GSAP + ScrollTrigger ظاهر می‌شوند.
- پاپ‌آپ آژانس از تکنیک FLIP برای باز شدن از کارت تا تمام‌صفحه استفاده می‌کند.
- انیمیشن‌های غیرضروری برای کاربرانی که `prefers-reduced-motion` را فعال کرده‌اند، حذف می‌شوند.
- عرض محتوای اصلی در دسکتاپ `80%` و در موبایل تمام عرض با فاصله کناری است.

---

## مدل‌های داده

مدل‌های MongoDB در پوشه `models` قرار دارند و هر کدام توابع کمکی موردنیاز خود را export می‌کنند:

`User`، `Property`، `Agent`، `Agency`، `Favorite`، `BlogPost`، `Category` و `Inquiry`.

اتصال دیتابیس از طریق `lib/mongodb.js` و با استفاده از `MONGODB_URI` انجام می‌شود.

---

## وضعیت فعلی و محدودیت‌ها

این پروژه در حال توسعه است. موارد زیر هنوز تکمیل نشده‌اند:

- احراز هویت واقعی و ارسال پیامک (OTP فعلی دمو است)
- اتصال فرم ورود به APIهای سمت سرور
- مسیرهای CRUD کامل برای املاک، مشاورین، آژانس‌ها، علاقه‌مندی‌ها، بلاگ و دسته‌بندی‌ها
- صفحات جزئیات ملک و آژانس (لینک‌های ناوبری فعلاً placeholder هستند)
- شماره‌های تماس آژانس‌ها در صفحه Home Pro داده نمایشی هستند

---

## مشارکت

1. پروژه را Fork کنید.
2. یک Branch جدید بسازید:

```bash
git checkout -b feature/your-feature
```

3. تغییرات را Commit کنید:

```bash
git commit -m "feat: add your feature"
```

4. Branch را Push کنید:

```bash
git push origin feature/your-feature
```

5. Pull Request ارسال کنید.

---

## لایسنس

این پروژه خصوصی است و استفاده، انتشار یا بازتوزیع آن بدون اجازه مالک پروژه مجاز نیست.

---

<div align="center">

ساخته‌شده با ❤️ برای **سقفینو**

</div>
