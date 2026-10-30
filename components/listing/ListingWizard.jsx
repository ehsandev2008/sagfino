"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import StepProgress from "./StepProgress";
import Step1Address from "./Step1Address";
import Step2TypeSelect from "./Step2TypeSelect";
import Step3Details from "./Step3Details";
import Step4Price from "./Step4Price";
import Step5Description from "./Step5Description";
import Step6Media from "./Step6Media";
import ListingSuccess from "./ListingSuccess";
import ListingError from "./ListingError";

const TOTAL_STEPS = 6;
const DESCRIPTION_LINES = Array.from({ length: 10 }, () => "");

const stepVariants = {
  enter: (direction) => ({
    opacity: 0,
    x: direction > 0 ? 36 : -36,
  }),
  center: { opacity: 1, x: 0 },
  exit: (direction) => ({
    opacity: 0,
    x: direction > 0 ? -36 : 36,
  }),
};

/** اعتبارسنجی هر مرحله — خروجی: آبجکت خطاها یا null */
function validateStep(step, data) {
  const errors = {};

  switch (step) {
    case 0:
      if (!data.mainStreet?.trim()) {
        errors.mainStreet = "خیابان اصلی الزامی است";
      }
      break;
    case 1:
      if (!data.transactionType) {
        errors.transactionType = "نوع معامله الزامی است";
      }
      if (!data.propertyType) {
        errors.propertyType = "نوع ملک الزامی است";
      }
      break;
    case 2:
      if (!data.neighborhood) {
        errors.neighborhood = "محله الزامی است";
      }
      if (!data.area) {
        errors.area = "متراژ الزامی است";
      }
      if (!data.rooms) {
        errors.rooms = "تعداد اتاق الزامی است";
      }
      break;
    case 3:
      if (
        data.transactionType === "rent" ||
        data.transactionType === "mortgage"
      ) {
        if (!data.deposit) errors.deposit = "مبلغ رهن الزامی است";
        if (!data.monthlyRent) errors.monthlyRent = "اجاره ماهانه الزامی است";
      } else if (!data.price) {
        errors.price = "قیمت الزامی است";
      }
      break;
    default:
      break;
  }

  return Object.keys(errors).length ? errors : null;
}

/** تصویر ثابت کنار فرم — در دسکتاپ سمت چپ و تمام‌قد */
function SidePhoto() {
  return (
    <aside className="relative hidden shrink-0 lg:block lg:h-dvh lg:w-[35%] xl:w-[34.5%]">
      <Image
        src="/Photo.png"
        alt="نمای ساختمان مدرن"
        fill
        priority
        sizes="(min-width: 1024px) 35vw, 0vw"
        className="object-cover"
      />
    </aside>
  );
}

/**
 * ویزارد ثبت آگهی — ۶ مرحله، تمام‌صفحه و بدون هدر/فوتر.
 * ترتیب مراحل مطابق تصاویر مرجع: آدرس، نوع ملک، مشخصات، قیمت،
 * توضیحات و در پایان تصاویر/ویدئو.
 */
export default function ListingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    descriptionLines: DESCRIPTION_LINES,
    images: [],
    video: null,
  });
  const [errors, setErrors] = useState({});
  const [direction, setDirection] = useState(1);
  const [status, setStatus] = useState("form"); // form | submitting | success | error

  // نگه‌داشتن آخرین فایل‌ها برای آزادسازی Object URL هنگام خروج
  const mediaRef = useRef({ images: [], video: null });
  useEffect(() => {
    mediaRef.current = {
      images: formData.images || [],
      video: formData.video || null,
    };
  }, [formData.images, formData.video]);

  useEffect(() => {
    return () => {
      mediaRef.current.images.forEach((image) => {
        if (image?.url) URL.revokeObjectURL(image.url);
      });
      if (mediaRef.current.video?.url) {
        URL.revokeObjectURL(mediaRef.current.video.url);
      }
    };
  }, []);

  const updateData = useCallback((partial) => {
    setFormData((prev) => ({ ...prev, ...partial }));
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(partial).forEach((key) => delete next[key]);
      return next;
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (status === "submitting") return;
    setStatus("submitting");

    // شبیه‌سازی ارتباط با سرور؛ در نسخهٔ نهایی به API ثبت آگهی وصل می‌شود.
    await new Promise((resolve) => setTimeout(resolve, 1200));

    if (!formData.images?.length) {
      setStatus("error");
      return;
    }

    setStatus("success");
  }, [formData.images, status]);

  const goNext = () => {
    if (status === "submitting") return;

    const stepErrors = validateStep(currentStep, formData);
    if (stepErrors) {
      setErrors(stepErrors);
      return;
    }

    setErrors({});

    if (currentStep === TOTAL_STEPS - 1) {
      handleSubmit();
      return;
    }

    setDirection(1);
    setCurrentStep((step) => step + 1);
  };

  const goBack = () => {
    if (currentStep === 0 || status === "submitting") return;
    setDirection(-1);
    setCurrentStep((step) => step - 1);
    setErrors({});
  };

  const handleBackToForm = () => {
    setStatus("form");
    setDirection(-1);
    setCurrentStep(TOTAL_STEPS - 1);
    setErrors({});
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Step1Address
            data={formData}
            onChange={updateData}
            errors={errors}
          />
        );
      case 1:
        return (
          <Step2TypeSelect
            data={formData}
            onChange={updateData}
            errors={errors}
          />
        );
      case 2:
        return (
          <Step3Details
            data={formData}
            onChange={updateData}
            errors={errors}
          />
        );
      case 3:
        return (
          <Step4Price
            data={formData}
            onChange={updateData}
            errors={errors}
          />
        );
      case 4:
        return <Step5Description data={formData} onChange={updateData} />;
      case 5:
        return <Step6Media data={formData} onChange={updateData} />;
      default:
        return null;
    }
  };

  if (status === "success" || status === "error") {
    return (
      <div className="flex min-h-dvh flex-col bg-white lg:h-dvh lg:flex-row lg:overflow-hidden">
        <div className="flex min-h-dvh flex-1 flex-col lg:h-dvh lg:overflow-y-auto">
          {status === "success" ? (
            <ListingSuccess />
          ) : (
            <ListingError onBack={handleBackToForm} />
          )}
        </div>
        <SidePhoto />
      </div>
    );
  }

  const isDescription = currentStep === 4;
  const isMedia = currentStep === 5;
  const isSubmitting = status === "submitting";

  return (
    <div className="flex min-h-dvh flex-col bg-white lg:h-dvh lg:flex-row lg:overflow-hidden">
      {/* پنل فرم — در RTL سمت راست قرار می‌گیرد */}
      <div className="flex min-h-dvh flex-1 flex-col lg:h-dvh lg:overflow-y-auto">
        <div className="mx-auto flex w-full max-w-[780px] flex-1 flex-col px-5 pb-[8vh] pt-[10vh] sm:px-8 lg:px-12 lg:pt-[15vh] 2xl:max-w-[1000px] 2xl:pt-[16vh]">
          <StepProgress
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
          />

          <div className="mt-[5vh] flex flex-1 flex-col lg:mt-[7vh] 2xl:mt-[8vh]">
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
                className="flex flex-col"
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            <div
              className={`flex items-center justify-center gap-6 sm:gap-9 ${
                isDescription || isMedia
                  ? "mt-[6vh] lg:mt-[7vh] 2xl:mt-[8vh]"
                  : "mt-[7vh] lg:mt-[8vh] 2xl:mt-[9vh]"
              }`}
            >
              <button
                type="button"
                onClick={goBack}
                aria-disabled={currentStep === 0}
                className={`w-full max-w-[180px] rounded-lg border border-primary-tint-6 px-4 py-3 text-body-xs font-medium text-primary transition-colors hover:bg-primary-tint-1 sm:max-w-[210px] lg:text-body-s lg:leading-6 ${
                  currentStep === 0 ? "cursor-default" : ""
                }`}
              >
                قبلی
              </button>

              <button
                type="button"
                onClick={goNext}
                disabled={isSubmitting}
                className="flex w-full max-w-[180px] items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-body-xs font-medium text-white transition-colors hover:bg-primary-shade-1 disabled:cursor-wait disabled:opacity-70 sm:max-w-[210px] lg:text-body-s lg:leading-6"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    در حال ثبت...
                  </>
                ) : isMedia ? (
                  "ثبت نهایی"
                ) : (
                  "ادامه"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* تصویر سمت چپ — فقط دسکتاپ */}
      <SidePhoto />
    </div>
  );
}
