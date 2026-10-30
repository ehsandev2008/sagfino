"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { GalleryAdd, Trash } from "iconsax-react";
import { toast } from "../ui/toast/toast";

const MAX_IMAGES = 6;

const isImageFile = (file) =>
  ["image/png", "image/webp", "image/jpeg"].includes(file.type) ||
  /\.(png|webp|jpe?g)$/i.test(file.name);

const isVideoFile = (file) =>
  file.type === "video/mp4" || /\.mp4$/i.test(file.name);

/**
 * مرحله ۶: بارگذاری عکس‌ها و ویدئوی ملک
 */
export default function Step6Media({ data, onChange }) {
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const images = data.images || [];
  const video = data.video || null;

  const addImages = (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      toast.error("حداکثر ۶ عکس می‌توانید بارگذاری کنید");
      return;
    }

    const accepted = files.filter(isImageFile);
    if (!accepted.length) {
      toast.error("فقط فرمت‌های Png، Webp، Jpg و Jpeg مجاز هستند");
      return;
    }

    const next = accepted.slice(0, remaining).map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    if (accepted.length > remaining) {
      toast.info("فقط ۶ عکس اول انتخاب شد");
    }

    onChange({ images: [...images, ...next] });
  };

  const removeImage = (id) => {
    const target = images.find((image) => image.id === id);
    if (target) URL.revokeObjectURL(target.url);
    onChange({ images: images.filter((image) => image.id !== id) });
  };

  const addVideo = (file) => {
    if (!file) return;
    if (!isVideoFile(file)) {
      toast.error("فرمت ویدئو باید Mp4 باشد");
      return;
    }
    if (video?.url) URL.revokeObjectURL(video.url);
    onChange({
      video: {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: file.name,
        url: URL.createObjectURL(file),
      },
    });
  };

  const removeVideo = () => {
    if (video?.url) URL.revokeObjectURL(video.url);
    onChange({ video: null });
  };

  return (
    <div className="flex flex-col">
      <h2 className="text-right text-body-s font-medium text-gray-11 lg:text-[22px]">
        در این قسمت می‌توانید عکس و ویدئو ملک خود را بارگذاری کنید.
      </h2>

      <p className="mt-2 text-right text-body-xxs leading-5 text-gray-8 lg:text-body-xs">
        اضافه کردن عکس و ویدئو باعث افزایش بازدید آگهی شما می‌شود.
      </p>
      <p className="mt-1 text-right text-body-xxs leading-5 text-gray-8 lg:text-body-xs">
        فرمت عکس‌ها باید Png ، Webp ، Jpg ، Jpeg باشد.
      </p>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4">
        {Array.from({ length: MAX_IMAGES }).map((_, index) => {
          const image = images[index];

          if (image) {
            return (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.25 }}
                className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-1 lg:aspect-auto lg:h-[15vh]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={image.name}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  aria-label={`حذف ${image.name}`}
                  onClick={() => removeImage(image.id)}
                  className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-md bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/75"
                >
                  <Trash size="17" color="currentColor" />
                </button>
              </motion.div>
            );
          }

          return (
            <button
              key={`empty-${index}`}
              type="button"
              onClick={() => imageInputRef.current?.click()}
              aria-label="افزودن عکس"
              className="group flex aspect-[4/3] items-center justify-center rounded-lg border-2 border-dashed border-gray-5 bg-white text-gray-7 transition-colors hover:border-primary-tint-6 hover:bg-primary-tint-1/30 hover:text-primary lg:aspect-auto lg:h-[15vh]"
            >
              <GalleryAdd size="46" color="currentColor" variant="Linear" />
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex w-full flex-col items-start">
        {video ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 flex w-full flex-col items-start gap-2.5"
          >
            <div className="flex w-full items-center justify-center rounded-lg bg-gray-2 px-6 py-2.5 text-center text-body-xs text-gray-11 lg:w-[49%]">
              ویدئو با موفقیت بارگذاری شد
            </div>
            <button
              type="button"
              onClick={removeVideo}
              className="w-full rounded-lg border border-primary-tint-6 px-6 py-2.5 text-body-xs font-medium text-primary transition-colors hover:bg-primary-tint-1 lg:w-[32%]"
            >
              حذف ویدئو
            </button>
          </motion.div>
        ) : (
          <>
            <p className="text-right text-body-xxs leading-5 text-gray-8 lg:text-body-xs">
              فرمت ویدئو باید Mp4 باشد.
            </p>
            <p className="mt-1 text-right text-body-xxs leading-5 text-gray-8 lg:text-body-xs">
              ویدئوهای غیر مرتبط توسط پشتیبانی حذف خواهد شد
            </p>
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              className="mt-4 rounded-lg border border-gray-5 px-8 py-3 text-body-xs text-gray-11 transition-colors hover:border-gray-7 hover:bg-gray-1"
            >
              انتخاب ویدئو
            </button>
          </>
        )}
      </div>

      <input
        ref={imageInputRef}
        type="file"
        accept=".png,.webp,.jpg,.jpeg,image/png,image/webp,image/jpeg"
        multiple
        className="hidden"
        onChange={(e) => {
          addImages(e.target.files);
          e.target.value = "";
        }}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept=".mp4,video/mp4"
        className="hidden"
        onChange={(e) => {
          addVideo(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}
