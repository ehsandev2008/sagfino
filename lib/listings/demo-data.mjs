/**
 * دادهٔ نمایشی آگهی‌های اجاره — کاملاً قطعی (deterministic)
 *
 * این داده‌ها فقط زمانی استفاده می‌شوند که دیتابیس خالی باشد یا در دسترس نباشد.
 * برای Seed کردن MongoDB هم از همین ماژول استفاده می‌شود تا دادهٔ صفحه و API یکی باشد.
 */

const RENT_IMAGES = [
  "/imags/rent images/pexels-vecislavas-popa-1571468 1.webp",
  "/imags/rent images/pexels-john-tekeridis-1428348.webp",
  "/imags/rent images/pexels-vecislavas-popa-1743227.webp",
  "/imags/rent images/unsplash_9rYfG8sWRVo.webp",
  "/imags/rent images/unsplash_mGZX2MOPR-s.webp",
  "/imags/rent images/unsplash_XyGvEj587Mc.webp",
  "/imags/rent images/unsplash_tHkJAMcO3QE.webp",
  "/imags/rent images/unsplash_hCU4fimRW-c.webp",
];

export const PROPERTY_TYPE_LABELS = {
  apartment: "آپارتمان",
  villa: "ویلا",
  office: "دفتر کار",
  store: "مغازه",
  land: "زمین",
};

export const PROPERTY_TYPE_OPTIONS = Object.entries(PROPERTY_TYPE_LABELS).map(
  ([value, label]) => ({ value, label })
);

/**
 * آژانس‌های املاک نمایشی.
 * شماره‌ها placeholder و برای دمو هستند.
 */
export const AGENCY_SEEDS = [
  {
    slug: "toosi",
    name: "مشاور املاک توسی",
    cityName: "تهران",
    district: "نیاوران",
    address: "تهران، نیاوران، خیابان شهید باهنر",
    logo: "/imags/amlak/agency-4.webp",
    rating: 4.9,
    reviewsCount: 412,
    activeAds: 4180,
    phones: ["02122740010", "09120000001"],
    verified: true,
    featured: true,
    since: 1382,
    about: "تخصص در املاک لوکس شمال تهران، مشاورهٔ حقوقی و قراردادهای اجاره.",
  },
  {
    slug: "valiasr",
    name: "مشاور املاک ولیعصر",
    cityName: "تهران",
    district: "ولیعصر",
    address: "تهران، خیابان ولیعصر، بالاتر از پارک‌وی",
    logo: "/imags/amlak/agency-2.webp",
    rating: 4.7,
    reviewsCount: 286,
    activeAds: 3520,
    phones: ["02188776655", "09120000002"],
    verified: true,
    featured: true,
    since: 1387,
    about: "اجاره و رهن آپارتمان در مرکز تهران با بازدید رایگان و قرارداد آنلاین.",
  },
  {
    slug: "fereshte",
    name: "مشاور املاک فرشته",
    cityName: "تهران",
    district: "فرشته",
    address: "تهران، خیابان فرشته، نبش کوچه بوعلی",
    logo: "/imags/amlak/agency-3.webp",
    rating: 4.6,
    reviewsCount: 198,
    activeAds: 2140,
    phones: ["02122334455", "09120000003"],
    verified: false,
    featured: true,
    since: 1390,
    about: "املاک مسکونی و اداری منطقهٔ ۱ و ۳ تهران، همراه با مشاورهٔ سرمایه‌گذاری.",
  },
  {
    slug: "sabz",
    name: "مشاور املاک سبز",
    cityName: "تهران",
    district: "پاسداران",
    address: "تهران، پاسداران، نبش گلستان دوم",
    logo: "/imags/amlak/agency-1.webp",
    rating: 4.5,
    reviewsCount: 167,
    activeAds: 1890,
    phones: ["02177889900", "09120000004"],
    verified: true,
    featured: false,
    since: 1393,
    about: "اجارهٔ خانه و آپارتمان در شرق تهران؛ تمرکز روی واحدهای بازسازی‌شده.",
  },
  {
    slug: "aramesh",
    name: "مشاور املاک آرامش",
    cityName: "مشهد",
    district: "وکیل‌آباد",
    address: "مشهد، بلوار وکیل‌آباد، بین وکیل‌آباد ۱۸ و ۲۰",
    logo: "/imags/amlak/agency-1.webp",
    rating: 4.8,
    reviewsCount: 231,
    activeAds: 1760,
    phones: ["05136060700", "09150000001"],
    verified: true,
    featured: true,
    since: 1389,
    about: "اجارهٔ آپارتمان و سوئیت مبله در مشهد، مناسب اقامت کوتاه و بلندمدت.",
  },
  {
    slug: "toos",
    name: "مشاور املاک طوس",
    cityName: "مشهد",
    district: "احمدآباد",
    address: "مشهد، خیابان احمدآباد، نبش خیابان پاستور",
    logo: "/imags/amlak/agency-2.webp",
    rating: 4.4,
    reviewsCount: 142,
    activeAds: 980,
    phones: ["05138455050", "09150000002"],
    verified: false,
    featured: false,
    since: 1395,
    about: "املاک مسکونی و تجاری در محدودهٔ حرم و مرکز شهر مشهد.",
  },
  {
    slug: "sepahan",
    name: "مشاور املاک سپاهان",
    cityName: "اصفهان",
    district: "مرداویج",
    address: "اصفهان، خیابان مرداویج، مجتمع سپاهان",
    logo: "/imags/amlak/agency-3.webp",
    rating: 4.8,
    reviewsCount: 264,
    activeAds: 1320,
    phones: ["03136244040", "09130000001"],
    verified: true,
    featured: true,
    since: 1385,
    about: "اجارهٔ آپارتمان در اصفهان با تیم بازدید و مشاورهٔ تخصصی محله‌محور.",
  },
  {
    slug: "siosepol",
    name: "مشاور املاک سی‌وسه‌پل",
    cityName: "اصفهان",
    district: "جلفا",
    address: "اصفهان، خیابان چهارباغ بالا، کوچه سی‌وسه‌پل",
    logo: "/imags/amlak/agency-4.webp",
    rating: 4.6,
    reviewsCount: 119,
    activeAds: 760,
    phones: ["03136662020", "09130000002"],
    verified: false,
    featured: false,
    since: 1394,
    about: "واحدهای اداری و تجاری در مرکز اصفهان و محدودهٔ چهارباغ.",
  },
  {
    slug: "pars",
    name: "مشاور املاک پارس",
    cityName: "شیراز",
    district: "معالی‌آباد",
    address: "شیراز، بلوار معالی‌آباد، نبش کوچه ۱۹",
    logo: "/imags/amlak/agency-1.webp",
    rating: 4.7,
    reviewsCount: 176,
    activeAds: 1180,
    phones: ["07136282200", "09170000001"],
    verified: true,
    featured: true,
    since: 1388,
    about: "اجارهٔ آپارتمان و ویلا در شیراز؛ پوشش معالی‌آباد، صدرا و فرهنگ‌شهر.",
  },
  {
    slug: "hafez",
    name: "مشاور املاک حافظیه",
    cityName: "شیراز",
    district: "فرهنگ‌شهر",
    address: "شیراز، بلوار رحمت، جنب فرهنگ‌شهر",
    logo: "/imags/amlak/agency-2.webp",
    rating: 4.3,
    reviewsCount: 98,
    activeAds: 540,
    phones: ["07136661010", "09170000002"],
    verified: false,
    featured: false,
    since: 1397,
    about: "املاک مسکونی اقتصادی و میان‌رده در شیراز.",
  },
  {
    slug: "alborz",
    name: "مشاور املاک البرز",
    cityName: "کرج",
    district: "عظیمیه",
    address: "کرج، عظیمیه، میدان اسبی",
    logo: "/imags/amlak/agency-3.webp",
    rating: 4.6,
    reviewsCount: 188,
    activeAds: 1420,
    phones: ["02632701010", "09100000001"],
    verified: true,
    featured: true,
    since: 1391,
    about: "اجارهٔ آپارتمان در کرج، با تمرکز روی عظیمیه، گوهردشت و مهرشهر.",
  },
  {
    slug: "mehregan",
    name: "مشاور املاک مهرگان",
    cityName: "کرج",
    district: "مهرشهر",
    address: "کرج، مهرشهر، بلوار ارم",
    logo: "/imags/amlak/agency-4.webp",
    rating: 4.2,
    reviewsCount: 76,
    activeAds: 430,
    phones: ["02633443030", "09100000002"],
    verified: false,
    featured: false,
    since: 1396,
    about: "خانه‌های اجاره‌ای و زمین در غرب کرج.",
  },
  {
    slug: "arg",
    name: "مشاور املاک ارک",
    cityName: "تبریز",
    district: "ولیعصر",
    address: "تبریز، خیابان ولیعصر، نبش فلکه بزرگ",
    logo: "/imags/amlak/agency-1.webp",
    rating: 4.7,
    reviewsCount: 154,
    activeAds: 890,
    phones: ["04133335500", "09140000001"],
    verified: true,
    featured: true,
    since: 1386,
    about: "اجارهٔ آپارتمان و دفتر کار در تبریز.",
  },
  {
    slug: "azerbaijan",
    name: "مشاور املاک آذربایجان",
    cityName: "تبریز",
    district: "باغمیشه",
    address: "تبریز، باغمیشه، بلوار توانیر",
    logo: "/imags/amlak/agency-2.webp",
    rating: 4.4,
    reviewsCount: 103,
    activeAds: 610,
    phones: ["04133667700", "09140000002"],
    verified: false,
    featured: false,
    since: 1398,
    about: "واحدهای مسکونی و اداری در باغمیشه و الهی‌پارک.",
  },
  {
    slug: "karun",
    name: "مشاور املاک کارون",
    cityName: "اهواز",
    district: "کیانپارس",
    address: "اهواز، کیانپارس، خیابان ۱۰ شرقی",
    logo: "/imags/amlak/agency-3.webp",
    rating: 4.5,
    reviewsCount: 112,
    activeAds: 670,
    phones: ["06133334400", "09160000001"],
    verified: true,
    featured: true,
    since: 1392,
    about: "اجارهٔ آپارتمان و ویلا در اهواز، با قرارداد آنلاین.",
  },
  {
    slug: "zeytoon",
    name: "مشاور املاک زیتون",
    cityName: "اهواز",
    district: "زیتون",
    address: "اهواز، بلوار گلستان، جنب پارک زیتون",
    logo: "/imags/amlak/agency-4.webp",
    rating: 4.1,
    reviewsCount: 64,
    activeAds: 310,
    phones: ["06132225500", "09160000002"],
    verified: false,
    featured: false,
    since: 1399,
    about: "املاک مسکونی مقرون‌به‌صرفه در اهواز.",
  },
  {
    slug: "pardisan",
    name: "مشاور املاک پردیسان",
    cityName: "قم",
    district: "پردیسان",
    address: "قم، شهرک پردیسان، بلوار دانشگاه",
    logo: "/imags/amlak/agency-1.webp",
    rating: 4.6,
    reviewsCount: 143,
    activeAds: 820,
    phones: ["02536668800", "09120000011"],
    verified: true,
    featured: true,
    since: 1390,
    about: "اجارهٔ آپارتمان در پردیسان و مرکز قم.",
  },
  {
    slug: "haram",
    name: "مشاور املاک حرم",
    cityName: "قم",
    district: "صفائیه",
    address: "قم، خیابان صفائیه، کوچه ۱۹",
    logo: "/imags/amlak/agency-2.webp",
    rating: 4.3,
    reviewsCount: 84,
    activeAds: 460,
    phones: ["02537779900", "09120000012"],
    verified: false,
    featured: false,
    since: 1397,
    about: "واحدهای کوتاه‌مدت و بلندمدت نزدیک حرم.",
  },
  {
    slug: "khazar",
    name: "مشاور املاک خزر",
    cityName: "رشت",
    district: "گلسار",
    address: "رشت، گلسار، بلوار دیلمان",
    logo: "/imags/amlak/agency-3.webp",
    rating: 4.8,
    reviewsCount: 201,
    activeAds: 940,
    phones: ["01333445500", "09110000001"],
    verified: true,
    featured: true,
    since: 1387,
    about: "اجارهٔ ویلا و آپارتمان در گیلان؛ گزینه‌های نزدیک دریا و جنگل.",
  },
  {
    slug: "gil",
    name: "مشاور املاک گیل",
    cityName: "رشت",
    district: "منظریه",
    address: "رشت، بلوار منظریه، جنب پارک",
    logo: "/imags/amlak/agency-4.webp",
    rating: 4.2,
    reviewsCount: 79,
    activeAds: 390,
    phones: ["01333336600", "09110000002"],
    verified: false,
    featured: false,
    since: 1398,
    about: "خانه‌های ویلایی و زمین در اطراف رشت.",
  },
  {
    slug: "kish",
    name: "مشاور املاک کیش",
    cityName: "کیش",
    district: "مروارید",
    address: "کیش، بلوار مروارید، مجتمع پارسیان",
    logo: "/imags/amlak/agency-2.webp",
    rating: 4.9,
    reviewsCount: 167,
    activeAds: 520,
    phones: ["07644442200", "09120000021"],
    verified: true,
    featured: true,
    since: 1391,
    about: "اجارهٔ سوئیت و آپارتمان مبله در کیش، ویژهٔ اقامت و سرمایه‌گذاری.",
  },
  {
    slug: "marjan",
    name: "مشاور املاک مرجان",
    cityName: "کیش",
    district: "نوبنیاد",
    address: "کیش، میدان امیرکبیر، مجتمع مرجان",
    logo: "/imags/amlak/agency-1.webp",
    rating: 4.5,
    reviewsCount: 92,
    activeAds: 280,
    phones: ["07644443300", "09120000022"],
    verified: false,
    featured: false,
    since: 1396,
    about: "واحدهای مبله و تجاری در جزیرهٔ کیش.",
  },
  {
    slug: "kavir",
    name: "مشاور املاک کویر",
    cityName: "یزد",
    district: "صفائیه",
    address: "یزد، بلوار صفائیه، نبش کوچه ۱۵",
    logo: "/imags/amlak/agency-1.webp",
    rating: 4.6,
    reviewsCount: 88,
    activeAds: 350,
    phones: ["03536223300", "09130000021"],
    verified: true,
    featured: false,
    since: 1393,
    about: "املاک مسکونی و سنتی در یزد.",
  },
  {
    slug: "bafat",
    name: "مشاور املاک بافت",
    cityName: "یزد",
    district: "بافت تاریخی",
    address: "یزد، خیابان قیام، محلهٔ فهادان",
    logo: "/imags/amlak/agency-2.webp",
    rating: 4.2,
    reviewsCount: 54,
    activeAds: 160,
    phones: ["03536224400", "09130000022"],
    verified: false,
    featured: false,
    since: 1399,
    about: "خانه‌های تاریخی بازسازی‌شده و اقامتگاه‌های یزد.",
  },
  {
    slug: "hormoz",
    name: "مشاور املاک هرمز",
    cityName: "بندر عباس",
    district: "بلوار ساحلی",
    address: "بندرعباس، بلوار ساحلی، جنب اسکلهٔ شهید حقانی",
    logo: "/imags/amlak/agency-3.webp",
    rating: 4.7,
    reviewsCount: 121,
    activeAds: 430,
    phones: ["07633334400", "09170000011"],
    verified: true,
    featured: true,
    since: 1392,
    about: "اجارهٔ آپارتمان و ویلا در بندرعباس و جزایر اطراف.",
  },
  {
    slug: "khalij",
    name: "مشاور املاک خلیج فارس",
    cityName: "بندر عباس",
    district: "گلشهر",
    address: "بندرعباس، بلوار امام موسی صدر، گلشهر شمالی",
    logo: "/imags/amlak/agency-4.webp",
    rating: 4.3,
    reviewsCount: 66,
    activeAds: 240,
    phones: ["07633335500", "09170000012"],
    verified: false,
    featured: false,
    since: 1398,
    about: "املاک مسکونی در بندرعباس.",
  },
  {
    slug: "goashir",
    name: "مشاور املاک گواشیر",
    cityName: "کرمان",
    district: "هفت‌باغ",
    address: "کرمان، بلوار هفت‌باغ، نبش خیابان شهید صدوقی",
    logo: "/imags/amlak/agency-1.webp",
    rating: 4.5,
    reviewsCount: 73,
    activeAds: 280,
    phones: ["03432224400", "09130000031"],
    verified: true,
    featured: false,
    since: 1394,
    about: "اجارهٔ آپارتمان در کرمان.",
  },
  {
    slug: "mahan",
    name: "مشاور املاک ماهان",
    cityName: "کرمان",
    district: "ماهان",
    address: "کرمان، بلوار جمهوری، جنب باغ ماهان",
    logo: "/imags/amlak/agency-2.webp",
    rating: 4.1,
    reviewsCount: 41,
    activeAds: 120,
    phones: ["03432225500", "09130000032"],
    verified: false,
    featured: false,
    since: 1399,
    about: "ویلا و زمین در محدودهٔ ماهان.",
  },
  {
    slug: "alvand",
    name: "مشاور املاک الوند",
    cityName: "همدان",
    district: "میدان آرامگاه بوعلی",
    address: "همدان، خیابان بوعلی، نبش میدان آرامگاه",
    logo: "/imags/amlak/agency-3.webp",
    rating: 4.4,
    reviewsCount: 59,
    activeAds: 190,
    phones: ["08132223300", "09180000001"],
    verified: true,
    featured: false,
    since: 1395,
    about: "املاک مسکونی در همدان.",
  },
  {
    slug: "urmia",
    name: "مشاور املاک ارومیه",
    cityName: "ارومیه",
    district: "خیام",
    address: "ارومیه، خیابان خیام، نبش کوچه ۱۲",
    logo: "/imags/amlak/agency-4.webp",
    rating: 4.3,
    reviewsCount: 47,
    activeAds: 170,
    phones: ["04432224400", "09140000021"],
    verified: false,
    featured: false,
    since: 1397,
    about: "خانه و آپارتمان اجاره‌ای در ارومیه.",
  },
  {
    slug: "tabarestan",
    name: "مشاور املاک طبرستان",
    cityName: "ساری",
    district: "بلوار خزر",
    address: "ساری، بلوار خزر، جنب پارک ملل",
    logo: "/imags/amlak/agency-1.webp",
    rating: 4.6,
    reviewsCount: 62,
    activeAds: 210,
    phones: ["01133334400", "09110000011"],
    verified: true,
    featured: false,
    since: 1394,
    about: "ویلا و آپارتمان در ساری و حومه.",
  },
];

const CITY_PLAN = [
  {
    name: "تهران",
    aliases: [],
    count: 46,
    multiplier: 1.55,
    neighborhoods: [
      "سعادت‌آباد",
      "زعفرانیه",
      "نیاوران",
      "پاسداران",
      "ولنجک",
      "جردن",
      "شهرک غرب",
      "ونک",
      "تجریش",
      "الهیه",
      "امیرآباد",
      "گیشا",
      "اکباتان",
      "قیطریه",
      "میرداماد",
    ],
  },
  {
    name: "مشهد",
    aliases: [],
    count: 16,
    multiplier: 1.0,
    neighborhoods: ["احمدآباد", "وکیل‌آباد", "هاشمیه", "ملک‌آباد", "سجاد", "کوهسنگی", "الهیه"],
  },
  {
    name: "اصفهان",
    aliases: [],
    count: 14,
    multiplier: 0.95,
    neighborhoods: ["مرداویج", "جلفا", "چهارباغ", "سپاهان‌شهر", "ملک‌شهر", "خانه اصفهان", "مفتح"],
  },
  {
    name: "شیراز",
    aliases: [],
    count: 12,
    multiplier: 0.92,
    neighborhoods: ["معالی‌آباد", "قصردشت", "صدرا", "فرهنگ‌شهر", "زندیه", "رحمت"],
  },
  {
    name: "کرج",
    aliases: [],
    count: 12,
    multiplier: 0.9,
    neighborhoods: ["عظیمیه", "گوهردشت", "مهرشهر", "جهانشهر", "کیانمهر", "گلشهر"],
  },
  {
    name: "تبریز",
    aliases: [],
    count: 10,
    multiplier: 0.88,
    neighborhoods: ["ولیعصر", "الهی‌پارک", "باغمیشه", "شهناز", "یاغچیان", "ویلا شهر"],
  },
  {
    name: "اهواز",
    aliases: [],
    count: 8,
    multiplier: 0.82,
    neighborhoods: ["کیانپارس", "زیتون", "گلستان", "امانیه", "پادادشهر"],
  },
  {
    name: "قم",
    aliases: [],
    count: 8,
    multiplier: 0.85,
    neighborhoods: ["پردیسان", "صفائیه", "شهید بهشتی", "امیرکبیر", "سه راه بازار"],
  },
  {
    name: "رشت",
    aliases: [],
    count: 8,
    multiplier: 0.86,
    neighborhoods: ["گلسار", "منظریه", "پره‌سر", "نخودچراغی", "پیرسرا"],
  },
  {
    name: "کیش",
    aliases: [],
    count: 6,
    multiplier: 1.35,
    neighborhoods: ["مروارید", "نوبنیاد", "سفین", "میرمهنا", "دافس"],
  },
  {
    name: "یزد",
    aliases: ["یزد_منطقه تاریخی"],
    count: 6,
    multiplier: 0.75,
    neighborhoods: ["صفائیه", "آزادشهر", "بافت تاریخی", "فهادان", "مهدی‌آباد"],
  },
  {
    name: "بندر عباس",
    aliases: ["بندرعباس"],
    count: 6,
    multiplier: 0.8,
    neighborhoods: ["بلوار ساحلی", "گلشهر", "شهرک پیامبر اعظم", "نخل ناخدا", "خواجه عطا", "سورو"],
  },
  {
    name: "کرمان",
    aliases: [],
    count: 4,
    multiplier: 0.72,
    neighborhoods: ["هفت‌باغ", "ماهان", "گلسار", "شهرک مطهری"],
  },
  {
    name: "همدان",
    aliases: [],
    count: 4,
    multiplier: 0.7,
    neighborhoods: ["بوعلی", "الوند", "گنجنامه", "شهرک مدنی"],
  },
  {
    name: "ارومیه",
    aliases: [],
    count: 4,
    multiplier: 0.72,
    neighborhoods: ["خیام", "والفجر", "اراضی", "کوی لاله"],
  },
  {
    name: "ساری",
    aliases: [],
    count: 4,
    multiplier: 0.74,
    neighborhoods: ["بلوار خزر", "پارک ملل", "قائم‌شهر", "امیرمازندرانی"],
  },
];

const BUILDING_TYPES = [
  { type: "apartment", weight: 58 },
  { type: "villa", weight: 10 },
  { type: "office", weight: 12 },
  { type: "store", weight: 10 },
  { type: "land", weight: 10 },
];

const STREETS = [
  "خیابان اصلی",
  "بلوار بهار",
  "خیابان شهید بهشتی",
  "کوچه یاس",
  "بلوار امام",
  "خیابان آزادی",
  "کوچه بهارستان",
  "بلوار سرو",
  "خیابان مدرس",
  "کوچه شقایق",
];

const FEATURES = [
  "پارکینگ",
  "آسانسور",
  "انباری",
  "بالکن",
  "استخر",
  "سونا",
  "سیستم امنیتی",
  "مبله",
  "کولر گازی",
  "شوفاژ",
];

const TYPE_RANGES = {
  apartment: { area: [45, 260], rooms: [0, 4], deposit: [100, 4500], rent: [8, 85] },
  villa: { area: [150, 620], rooms: [2, 5], deposit: [500, 9500], rent: [20, 160] },
  office: { area: [50, 300], rooms: [0, 3], deposit: [200, 3200], rent: [12, 110] },
  store: { area: [20, 150], rooms: [0, 0], deposit: [150, 2600], rent: [10, 90] },
  land: { area: [250, 1800], rooms: [0, 0], deposit: [400, 7500], rent: [15, 140] },
};

// PRNG قطعی (Mulberry32)
function createRandom(seed = 13961375) {
  let t = seed >>> 0;
  return function random() {
    t += 0x6d2b79f5;
    let value = t;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = (random, list) => list[Math.floor(random() * list.length)];
const between = (random, min, max) => min + random() * (max - min);
const roundTo = (value, step) => Math.max(step, Math.round(value / step) * step);
const faDigits = (value) =>
  String(value).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[digit]);

function shuffle(random, list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function findCity(locations, plan) {
  const allNames = [plan.name, ...plan.aliases];
  for (const name of allNames) {
    const exact = locations.cities.find((city) => city.name === name);
    if (exact) return exact;
  }
  return locations.cities.find((city) => allNames.includes(city.name)) ?? null;
}

/**
 * ساخت آگهی‌های نمایشی.
 * @param {{cities: Array<{id:number,name:string,provinceName:string,lat:number,lng:number}>}} locations
 * @param {{now?: number, startIndex?: number}} options
 */
export function createDemoProperties(locations, options = {}) {
  const now = options.now ?? Date.now();
  const startIndex = options.startIndex ?? 0;
  const random = createRandom(61551035);

  const plans = CITY_PLAN.map((plan) => ({
    ...plan,
    city: findCity(locations, plan),
  })).filter((plan) => plan.city);

  const assignment = shuffle(
    random,
    plans.flatMap((plan) => Array.from({ length: plan.count }, () => plan))
  );

  // Weighted property type pool
  const typePool = BUILDING_TYPES.flatMap(({ type, weight }) =>
    Array.from({ length: weight }, () => type)
  );

  const agenciesByCity = new Map();
  for (const agency of AGENCY_SEEDS) {
    const list = agenciesByCity.get(agency.cityName) ?? [];
    list.push(agency);
    agenciesByCity.set(agency.cityName, list);
  }

  return assignment.map((plan, index) => {
    const { city, multiplier, neighborhoods } = plan;
    const propertyType = pick(random, typePool);
    const range = TYPE_RANGES[propertyType];

    const area = Math.round(between(random, ...range.area));
    const rooms =
      propertyType === "apartment"
        ? Math.floor(between(random, ...range.rooms))
        : Math.floor(between(random, ...range.rooms));

    const neighborhood = pick(random, neighborhoods);
    const street = pick(random, STREETS);
    const floor =
      propertyType === "apartment" || propertyType === "office"
        ? Math.max(0, Math.floor(between(random, 0, 12)))
        : 0;
    const totalFloors =
      propertyType === "apartment" || propertyType === "office"
        ? Math.max(floor + 1, Math.floor(between(random, 2, 16)))
        : 1;
    const buildYear = Math.floor(between(random, 1380, 1404));

    const deposit = roundTo(
      between(random, ...range.deposit) * multiplier,
      50
    ) * 1_000_000;
    const rent = roundTo(between(random, ...range.rent) * multiplier, 1) * 1_000_000;

    const agencies = agenciesByCity.get(city.name) ?? AGENCY_SEEDS.slice(0, 4);
    const agency = agencies[index % agencies.length];

    const features = shuffle(random, FEATURES).slice(
      0,
      propertyType === "land" ? 2 : 3 + Math.floor(random() * 3)
    );

    // مختصات حدودی حول مرکز شهر (برای نمایش روی نقشه)
    const spread = city.name === "تهران" ? 0.09 : 0.035;
    const lat = Number((city.lat + between(random, -spread, spread)).toFixed(5));
    const lng = Number((city.lng + between(random, -spread, spread)).toFixed(5));

    const imageStart = Math.floor(random() * RENT_IMAGES.length);
    const images = [
      RENT_IMAGES[imageStart % RENT_IMAGES.length],
      RENT_IMAGES[(imageStart + 3) % RENT_IMAGES.length],
      RENT_IMAGES[(imageStart + 5) % RENT_IMAGES.length],
    ];

    const code = `SG-${51000 + startIndex + index}`;
    const ageHours = index * 6.4 + between(random, 0, 5.5);
    const createdAt = new Date(now - ageHours * 60 * 60 * 1000);

    const title = `اجاره ${PROPERTY_TYPE_LABELS[propertyType]} ${faDigits(area)} متری در ${neighborhood}`;

    return {
      code,
      slug: `rent-${51000 + startIndex + index}`,
      title,
      description: `${PROPERTY_TYPE_LABELS[propertyType]} ${faDigits(area)} متری با ${faDigits(
        rooms
      )} اتاق در ${neighborhood}، ${city.name}. مناسب سکونت خانواده و با دسترسی خوب به مراکز خرید و حمل‌ونقل عمومی.`,
      dealType: "rent",
      propertyType,
      provinceId: city.provinceId,
      provinceName: city.provinceName,
      cityId: city.id,
      cityName: city.name,
      neighborhood,
      address: `${city.name}، ${neighborhood}، ${street}`,
      lat,
      lng,
      area,
      rooms,
      bathrooms: Math.max(1, Math.min(rooms, 3)),
      floor,
      totalFloors,
      buildYear,
      deposit,
      rent,
      images,
      cover: images[0],
      features,
      agency: {
        slug: agency.slug,
        name: agency.name,
        logo: agency.logo,
        phones: [...agency.phones],
        verified: agency.verified,
        rating: agency.rating,
        reviewsCount: agency.reviewsCount,
        cityName: agency.cityName,
        district: agency.district,
      },
      isVerified: index % 4 !== 0,
      isFeatured: index % 29 === 0,
      viewsCount: Math.floor(between(random, 80, 5200)),
      favoritesCount: Math.floor(between(random, 0, 240)),
      createdAt,
      updatedAt: createdAt,
      status: "active",
    };
  });
}

/** آژانس‌های نمایشی به همراه شمارندهٔ آگهی */
export function createDemoAgencies() {
  return AGENCY_SEEDS.map((agency) => ({
    ...agency,
    phones: [...agency.phones],
    createdAt: new Date(Date.now() - 240 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  }));
}
