"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import StepLayout from "./StepLayout";
import StepIndicator from "./StepIndicator";
import RegisterStep from "./RegisterStep";
import Step1Address from "./steps/Step1Address";
import Step2DealType from "./steps/Step2DealType";
import Step3PropertyDetails from "./steps/Step3PropertyDetails";
import Step4Amenities from "./steps/Step4Amenities";
import Step5Placeholder from "./steps/Step5Placeholder";
import Step6Placeholder from "./steps/Step6Placeholder";

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

export default function NewAdFlow() {
  // stage: 'register' | 'steps'
  const [stage, setStage] = useState("register");
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [userData, setUserData] = useState({});
  const [formData, setFormData] = useState({
    // Step 1
    mainStreet: "",
    subStreet: "",
    // Step 2
    dealType: "",
    propertyType: "",
    mortgage: "",
    rent: "",
    convertible: false,
    // Step 3
    area: "",
    rooms: "",
    floor: "",
    totalFloors: "",
    // Step 4
    parking: false,
    hasBathroom: false,
    bathroomType: "",
    storage: false,
    elevator: false,
    coolingSystem: "",
    floorMaterial: "",
    heatingSystem: "",
  });

  const updateFormData = (patch) => setFormData((prev) => ({ ...prev, ...patch }));

  const goNext = () => {
    setDirection(1);
    setCurrentStep((s) => Math.min(s + 1, 6));
  };

  const goPrev = () => {
    setDirection(-1);
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  const handleRegisterSubmit = (data) => {
    setUserData(data);
    setStage("steps");
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      // TODO: POST to API
      await new Promise((r) => setTimeout(r, 1500)); // simulate
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const stepProps = {
    data: formData,
    onChange: updateFormData,
    onNext: goNext,
    onPrev: goPrev,
  };

  if (submitted) {
    return (
      <StepLayout>
        <div className="flex-1 flex items-center justify-center px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M8 20L16 28L32 12" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#212121] mb-2">آگهی شما ثبت شد!</h2>
            <p className="text-[#909090] text-sm">
              آگهی شما با موفقیت ثبت گردید و پس از تأیید نمایش داده خواهد شد.
            </p>
            <a
              href="/"
              className="inline-block mt-6 px-8 py-3 bg-[#CB1B1B] text-white rounded-xl text-sm font-semibold hover:bg-[#b01818] transition-colors"
            >
              بازگشت به صفحه اصلی
            </a>
          </motion.div>
        </div>
      </StepLayout>
    );
  }

  return (
    <StepLayout>
      <div className="flex-1 px-6 md:px-12 lg:px-16 py-10 max-w-xl w-full mx-auto lg:mx-0">
        {/* Logo */}
        <div className="mb-8">
          <a href="/">
            <img
              src="/logos/logo-primary.webp"
              alt="سقفینو"
              className="h-8"
              onError={(e) => {
                e.target.src = "/logos/logo-primary-lg.webp";
              }}
            />
          </a>
        </div>

        {stage === "register" ? (
          <motion.div
            key="register"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <RegisterStep onSubmit={handleRegisterSubmit} />
          </motion.div>
        ) : (
          <div>
            <StepIndicator currentStep={currentStep} />

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {currentStep === 1 && <Step1Address {...stepProps} />}
                {currentStep === 2 && <Step2DealType {...stepProps} />}
                {currentStep === 3 && <Step3PropertyDetails {...stepProps} />}
                {currentStep === 4 && <Step4Amenities {...stepProps} />}
                {currentStep === 5 && <Step5Placeholder {...stepProps} />}
                {currentStep === 6 && (
                  <Step6Placeholder
                    {...stepProps}
                    onSubmit={handleFinalSubmit}
                    loading={loading}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </StepLayout>
  );
}
