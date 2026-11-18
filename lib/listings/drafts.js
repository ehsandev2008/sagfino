/**
 * ذخیره‌سازی پیش‌نویس آگهی‌های ثبت‌شده در مرورگر.
 *
 * چون هنوز API ثبت آگهی در سمت سرور وجود ندارد، آگهی تازه‌ساخته‌شده
 * همراه با فایل تصاویر و ویدئو در IndexedDB ذخیره می‌شود تا صفحهٔ
 * جزئیات همان آگهی بعد از ثبت و حتی بعد از رفرش قابل نمایش باشد.
 */

const DB_NAME = "sagfino-listings";
const DB_VERSION = 1;
const DRAFT_STORE = "drafts";
const MEDIA_STORE = "media";

let dbPromise = null;

function openDatabase() {
  if (typeof window === "undefined" || !window.indexedDB) {
    return Promise.reject(new Error("IndexedDB در این مرورگر پشتیبانی نمی‌شود"));
  }

  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(DRAFT_STORE)) {
        db.createObjectStore(DRAFT_STORE, { keyPath: "code" });
      }
      if (!db.objectStoreNames.contains(MEDIA_STORE)) {
        db.createObjectStore(MEDIA_STORE, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

function requestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function transactionDone(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

/** ساخت شناسهٔ یکتا برای آگهی تازه‌ثبت‌شده */
export function createListingCode() {
  const time = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `AD-${time}-${random}`;
}

/**
 * ذخیرهٔ آگهی و رسانه‌های آن.
 * @param {{draft: Object, images?: Array, video?: Object|null}} payload
 * @returns {Promise<string>} کد آگهی
 */
export async function saveListingDraft({ draft, images = [], video = null }) {
  const db = await openDatabase();
  const transaction = db.transaction(
    [DRAFT_STORE, MEDIA_STORE],
    "readwrite"
  );
  const mediaStore = transaction.objectStore(MEDIA_STORE);

  const imageMeta = [];
  images.forEach((image, index) => {
    const file = image?.file ?? image?.blob;
    if (!file) return;

    const id = `image-${draft.code}-${index}`;
    mediaStore.put({
      id,
      name: image.name ?? file.name ?? "",
      type: file.type ?? "",
      blob: file,
    });
    imageMeta.push({
      id,
      name: image.name ?? file.name ?? "",
      type: file.type ?? "",
    });
  });

  let videoMeta = null;
  const videoFile = video?.file ?? video?.blob;
  if (videoFile) {
    const id = `video-${draft.code}`;
    mediaStore.put({
      id,
      name: video.name ?? videoFile.name ?? "",
      type: videoFile.type ?? "",
      blob: videoFile,
    });
    videoMeta = {
      id,
      name: video.name ?? videoFile.name ?? "",
      type: videoFile.type ?? "",
    };
  }

  transaction.objectStore(DRAFT_STORE).put({
    ...draft,
    images: imageMeta,
    video: videoMeta,
  });

  await transactionDone(transaction);
  return draft.code;
}

/**
 * خواندن آگهی ذخیره‌شده و ساخت URL موقت برای تصاویر و ویدئو.
 * فراخوان باید URLها را هنگام unmount آزاد کند.
 */
export async function getListingDraft(code) {
  const db = await openDatabase();
  const draft = await requestToPromise(
    db.transaction(DRAFT_STORE, "readonly").objectStore(DRAFT_STORE).get(code)
  );

  if (!draft) return null;

  const mediaStore = db
    .transaction(MEDIA_STORE, "readonly")
    .objectStore(MEDIA_STORE);

  const imageMetas = draft.images ?? [];

  // همهٔ درخواست‌ها را هم‌زمان روی همان تراکنش باز می‌کنیم تا تراکنش
  // بین خواندن‌های متوالی غیرفعال نشود.
  const imageRequests = imageMetas.map((meta) =>
    requestToPromise(mediaStore.get(meta.id))
  );
  const videoRequest = draft.video?.id
    ? requestToPromise(mediaStore.get(draft.video.id))
    : Promise.resolve(null);

  const [imageResults, videoMedia] = await Promise.all([
    Promise.all(imageRequests),
    videoRequest,
  ]);

  const images = imageMetas
    .map((meta, index) => {
      const media = imageResults[index];
      return media?.blob
        ? { ...meta, url: URL.createObjectURL(media.blob) }
        : null;
    })
    .filter(Boolean);

  const video =
    draft.video && videoMedia?.blob
      ? { ...draft.video, url: URL.createObjectURL(videoMedia.blob) }
      : null;

  return { draft, images, video };
}
