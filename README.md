<div align="center">

# 🏠 سقفینو — Sagfino

### بازار آنلاین املاک و مستغلات ایران

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3-61DAFB?logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.7-47A248?logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-Private-red)]()

<br/>

**سقفینو** یک پلتفرم جامع املاک و مستغلات است که تجربه‌ی کاربری روان و مدرنی را برای جستجو، خرید، اجاره و مشاوره ملک فراهم می‌کند.

[شروع کنید](#-شروع-سریع) · [مستندات API](#-مستندات-api) · [معماری](#-معماری-پروژه)

</div>

---

## ✨ ویژگی‌های کلیدی

| ویژگی | توضیح |
|---|---|
| 🔐 **احراز هویت OTP** | ورود امن با کد یکبار مصرف SMS |
| 🏘️ **مدیریت املاک** | ثبت، ویرایش و جستجوی پیشرفته‌ی ملک |
| 👨‍💼 **مشاوران املاک** | پروفایل و مدیریت مشاوران حرفه‌ای |
| 🏢 **آژانس‌های املاک** | ثبت و مدیریت بنگاه‌های معاملاتی |
| ❤️ **علاقه‌مندی‌ها** | ذخیره‌ی ملک‌های موردعلاقه |
| 📝 **بلاگ** | مقالات و اخبار حوزه‌ی مسکن |
| 📂 **دسته‌بندی‌ها** | سازماندهی انواع ملک (مسکونی، تجاری، ویلایی، آپارتمان) |
| 🎬 **انیمیشن‌ها** | انیمیشن‌های روان با GSAP و Motion |
| 📱 **طراحی واکنش‌گرا** | تجربه‌ی یکپارچه در تمامی دستگاه‌ها |
| 🌙 **RTL کامل** | پشتیبانی کامل از چینش راست‌به‌چپ فارسی |

---

## 🛠️ تکنولوژی‌ها

```
Frontend                Backend               Database
├── Next.js 16.4        ├── API Routes         └── MongoDB 7.7
├── React 19.3          ├── JWT Auth
├── Tailwind CSS 4      └── RESTful API
├── GSAP 3.15
├── Motion 14.3
└── Iconsax React
```

---

## 📁 معماری پروژه

```
sagfino/
├── app/                          # App Router (Next.js)
│   ├── layout.js                 # لایه‌ی اصلی (RTL + فونت Shabnam)
│   ├── page.js                   # صفحه‌ی اصلی (Landing / Dashboard)
│   ├── globals.css               # استایل‌های سراسری + Tailwind
│   └── api/                      # API Routes
│       ├── auth/                 # احراز هویت
│       │   ├── send-code/        #   ارسال کد OTP
│       │   ├── verify-code/      #   تایید کد OTP
│       │   └── logout/           #   خروج
│       ├── properties/           # مدیریت املاک
│       │   └── [id]/             #   عملیات تکی ملک
│       ├── agents/               # مشاوران
│       ├── agencies/             # آژانس‌ها
│       ├── users/                # کاربران
│       │   └── profile/          #   پروفایل کاربر
│       ├── favorites/            # علاقه‌مندی‌ها
│       ├── blog/                 # مقالات بلاگ
│       ├── categories/           # دسته‌بندی‌ها
│       └── health/               # وضعیت سلامت سرور
│
├── components/                   # کامپوننت‌های React
│   ├── Header.jsx                # هدر سایت
│   ├── Footer.jsx                # فوتر سایت
│   ├── Logo.jsx                  # لوگو
│   ├── ExpandableGroup.jsx       # گروه‌بندی بازشونده
│   ├── home/                     # کامپوننت‌های صفحه‌ی اصلی
│   │   ├── HeroSection.jsx       #   بخش Hero
│   │   ├── SearchCard.jsx        #   کارت جستجو
│   │   ├── HelpSection.jsx       #   بخش راهنما
│   │   ├── PropertyTypes.jsx     #   انواع ملک
│   │   ├── AdvisorsSection.jsx   #   مشاوران
│   │   └── BlogSection.jsx       #   بلاگ
│   ├── home-pro/                 # صفحه‌ی کاربران لاگین‌شده
│   │   ├── HeroProSection.jsx    #   Hero ویژه
│   │   └── RentListings.jsx      #   لیست اجاره‌ها
│   ├── auth/                     # احراز هویت
│   │   ├── AuthProvider.jsx      #   Provider احراز هویت
│   │   ├── LoginModal.jsx        #   مودال ورود
│   │   └── OtpInput.jsx          #   ورودی OTP
│   ├── ui/                       # کامپوننت‌های UI عمومی
│   │   ├── Reveal.jsx            #   انیمیشن ظاهر شدن
│   │   ├── Carousel.jsx          #   اسلایدر
│   │   └── toast/                #   نوتیفیکیشن Toast
│   └── anim/                     # تنظیمات انیمیشن
│       └── gsap.js               #   کانفیگ GSAP
│
├── models/                       # مدل‌های MongoDB
│   ├── User.js                   # کاربر
│   ├── Property.js               # ملک
│   ├── Agent.js                  # مشاور
│   ├── Agency.js                 # آژانس
│   ├── Favorite.js               # علاقه‌مندی
│   ├── BlogPost.js               # پست بلاگ
│   ├── Category.js               # دسته‌بندی
│   ├── Inquiry.js                # استعلام
│   └── index.js                  # Export مرکزی
│
├── context/                      # React Context
│   └── AuthContext.jsx           # Context احراز هویت
│
├── lib/                          # توابع کمکی
│   ├── auth.js                   # منطق احراز هویت
│   ├── mongodb.js                # اتصال MongoDB
│   ├── constants.js              # ثابت‌ها
│   └── db/
│       └── connect.js            # مدیریت اتصال DB
│
└── public/                       # فایل‌های استاتیک
    ├── Fonts/                    # فونت Shabnam (5 وزن)
    ├── logos/                    # لوگوهای سقفینو
    └── imags/                    # تصاویر سایت
```

---

## 🚀 شروع سریع

### پیش‌نیازها

- **Node.js** ≥ 18.x
- **npm** یا **yarn**
- **MongoDB** (محلی یا Atlas)

### نصب و راه‌اندازی

```bash
# 1. کلون ریپازیتوری
git clone https://github.com/ehsandev2008/sagfino.git
cd sagfino

# 2. نصب وابستگی‌ها
npm install

# 3. ساخت فایل تنظیمات محیط
cp .env.example .env.local
```

فایل `.env.local` را با مقادیر مناسب پر کنید:

```env
MONGODB_URI=mongodb://localhost:27017/sagfino
JWT_SECRET=your-secret-key
SMS_API_KEY=your-sms-api-key
```

```bash
# 4. اجرای سرور توسعه
npm run dev
```

اپلیکیشن روی آدرس [http://localhost:3000](http://localhost:3000) در دسترس خواهد بود.

### اسکریپت‌ها

| دستور | توضیح |
|---|---|
| `npm run dev` | اجرای سرور توسعه (Turbopack) |
| `npm run build` | ساخت نسخه‌ی Production |
| `npm run start` | اجرای نسخه‌ی Production |
| `npm run lint` | بررسی کد با ESLint |

---

## 📡 مستندات API

### احراز هویت (Auth)

| متد | مسیر | توضیح |
|---|---|---|
| `POST` | `/api/auth/send-code` | ارسال کد OTP به شماره موبایل |
| `POST` | `/api/auth/verify-code` | تایید کد OTP و دریافت توکن |
| `POST` | `/api/auth/logout` | خروج از حساب کاربری |

### املاک (Properties)

| متد | مسیر | توضیح |
|---|---|---|
| `GET` | `/api/properties` | دریافت لیست املاک |
| `GET` | `/api/properties/:id` | دریافت جزئیات یک ملک |
| `POST` | `/api/properties` | ثبت ملک جدید |
| `PUT` | `/api/properties/:id` | ویرایش ملک |
| `DELETE` | `/api/properties/:id` | حذف ملک |

### سایر Endpointها

| مسیر | توضیح |
|---|---|
| `/api/agents` | مدیریت مشاوران |
| `/api/agencies` | مدیریت آژانس‌ها |
| `/api/users/profile` | پروفایل کاربر |
| `/api/favorites` | علاقه‌مندی‌ها |
| `/api/blog` | مقالات بلاگ |
| `/api/categories` | دسته‌بندی‌ها |
| `/api/health` | بررسی سلامت سرور |

---

## 🎨 فونت و طراحی

پروژه از فونت **شبنم** (Shabnam) در ۵ وزن مختلف استفاده می‌کند:

- `Shabnam-Thin` — نازک
- `Shabnam-Light` — سبک
- `Shabnam` — معمولی
- `Shabnam-Medium` — متوسط
- `Shabnam-Bold` — ضخیم

رنگ‌بندی پروژه بر اساس Tailwind CSS با پالت سفارشی تنظیم شده است.

---

## 🤝 مشارکت

1. ریپازیتوری را Fork کنید
2. یک Branch جدید بسازید (`git checkout -b feature/amazing-feature`)
3. تغییرات را Commit کنید (`git commit -m 'Add amazing feature'`)
4. به Branch خود Push کنید (`git push origin feature/amazing-feature`)
5. یک Pull Request ایجاد کنید

---

## 📄 لایسنس

این پروژه خصوصی (Private) است و تحت مالکیت تیم سقفینو می‌باشد.

---

<div align="center">

ساخته شده با ❤️ توسط تیم **سقفینو**

</div>
#   s a g f i n o  
 