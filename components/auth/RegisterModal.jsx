"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CloseCircle, Clock } from "iconsax-react";
import FormInput from "../listing/FormInput";
import { useAuth } from "../../context/AuthContext";
import OtpInput from "./OtpInput";
import {
  isValidIranianPhone,
  requestLoginCode,
  toEnglishDigits,
  toFaDigits,
  verifyLoginCode,
} from "../../lib/auth";
import { toast } from "../ui/toast/toast";

const CODE_LENGTH = 5;
const RESEND_SECONDS = 120;

/**
 * مودال ثبت‌نام — ابتدا اطلاعات نام و شماره و سپس تأیید کد
 * بعد از تأیید موفق، کاربر به فرم ثبت آگهی هدایت می‌شود.
 */
export default function RegisterModal({ open, onClose, onSuccess }) {
  const { login } = useAuth();
  const [phase, setPhase] = useState("info"); // info | code
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [errors, setErrors] = useState({});

  const reset = useCallback(() => {
    setPhase("info");
    setName("");
    setPhone("");
    setCode("");
    setSecondsLeft(RESEND_SECONDS);
    setSending(false);
    setVerifying(false);
    setErrors({});
  }, []);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  // قفل اسکرول
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, handleClose]);

  // شمارنده معکوس
  useEffect(() => {
    if (!open || phase !== "code" || secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [open, phase, secondsLeft]);

  const handleSubmitInfo = async (e) => {
    e?.preventDefault();
    const newErrors = {};
    if (!name.trim()) newErrors.name = "نام و نام خانوادگی الزامی است";
    if (!isValidIranianPhone(phone))
      newErrors.phone = "شماره موبایل معتبر نیست";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSending(true);
    try {
      await requestLoginCode(phone);
      setCode("");
      setSecondsLeft(RESEND_SECONDS);
      setPhase("code");
    } finally {
      setSending(false);
    }
  };

  const handleVerify = useCallback(
    async (value) => {
      if (verifying) return;
      setVerifying(true);
      try {
        const { ok } = await verifyLoginCode(phone, value);
        if (ok) {
          login(toEnglishDigits(phone).trim());
          handleClose();
          onSuccess?.();
        } else {
          toast.error("کد وارد شده صحیح نیست");
          setCode("");
        }
      } finally {
        setVerifying(false);
      }
    },
    [phone, login, handleClose, onSuccess, verifying]
  );

  // تأیید خودکار — با تأخیر کوتاه تا setState داخل بدنهٔ افکت رخ ندهد
  useEffect(() => {
    if (!open || phase !== "code" || code.length !== CODE_LENGTH) return;
    const timer = setTimeout(() => handleVerify(code), 50);
    return () => clearTimeout(timer);
  }, [open, phase, code, handleVerify]);

  const handleResend = async () => {
    setSending(true);
    try {
      await requestLoginCode(phone);
      setCode("");
      setSecondsLeft(RESEND_SECONDS);
      toast.info("کد تأیید جدید ارسال شد");
    } finally {
      setSending(false);
    }
  };

  const timerLabel = `${toFaDigits(Math.floor(secondsLeft / 60))}:${toFaDigits(
    String(secondsLeft % 60).padStart(2, "0")
  )}`;

  return (
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="ثبت نام"
          className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-4"
        >
          {/* بک‌دراپ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
          />

          {/* بدنه مودال */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: 40,
              scale: 0.96,
              transition: { duration: 0.2 },
            }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="relative max-h-[92dvh] w-full max-w-[420px] overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-8"
          >
            {/* دکمه بستن */}
            <button
              type="button"
              aria-label="بستن"
              onClick={handleClose}
              className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-gray-9 transition-colors hover:bg-gray-2 hover:text-black"
            >
              <CloseCircle size="24" color="currentColor" />
            </button>

            <AnimatePresence mode="wait" initial={false}>
              {phase === "info" ? (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="text-center text-h4 font-bold text-black">
                    ثبت نام
                  </h2>
                  <p className="mt-3 text-center text-body-xxs text-gray-9">
                    در این مرحله حساب کاربری بسازید
                  </p>
                  <p className="mt-1 text-center text-caption-md text-gray-7">
                    برای ثبت آگهی اطلاعات زیر را تکمیل کنید.
                  </p>

                  <form
                    onSubmit={handleSubmitInfo}
                    className="mt-6 flex flex-col gap-4"
                  >
                    <FormInput
                      label="نام و نام خانوادگی"
                      placeholder="نام و نام خانوادگی خود را وارد کنید"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      error={errors.name}
                    />
                    <FormInput
                      label="شماره موبایل"
                      placeholder="۰۹XXXXXXXXX"
                      type="tel"
                      inputMode="numeric"
                      dir="ltr"
                      value={phone}
                      onChange={(e) =>
                        setPhone(
                          toEnglishDigits(e.target.value)
                            .replace(/\D/g, "")
                            .slice(0, 11)
                        )
                      }
                      error={errors.phone}
                    />

                    <motion.button
                      type="submit"
                      disabled={sending}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-2 w-full rounded-xl bg-primary py-3.5 text-button-lg text-white transition-colors hover:bg-primary-shade-1 disabled:opacity-60"
                    >
                      {sending ? "در حال ارسال…" : "ثبت اطلاعات"}
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="code"
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="text-center text-h4 font-bold text-black">
                    کد تأیید
                  </h2>
                  <p className="mt-4 text-center text-body-xxs leading-7 text-gray-11">
                    کد ارسال‌شده به شماره{" "}
                    {toFaDigits(toEnglishDigits(phone))} را وارد کنید
                  </p>
                  <button
                    type="button"
                    onClick={() => setPhase("info")}
                    className="mx-auto mt-1 block text-body-xxs text-gray-8 transition-colors hover:text-primary"
                  >
                    ویرایش شماره موبایل
                  </button>

                  <div className="mt-6">
                    <OtpInput
                      length={CODE_LENGTH}
                      value={code}
                      onChange={setCode}
                      disabled={verifying}
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-2 text-body-xxs text-gray-9">
                    {secondsLeft > 0 ? (
                      <>
                        <Clock size="18" color="currentColor" />
                        <span>{timerLabel} تا دریافت مجدد کد</span>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={sending}
                        className="text-button-s text-primary transition-colors hover:text-primary-shade-1 disabled:opacity-60"
                      >
                        {sending ? "در حال ارسال…" : "ارسال مجدد کد"}
                      </button>
                    )}
                  </div>

                  <motion.button
                    type="button"
                    onClick={() =>
                      code.length === CODE_LENGTH && handleVerify(code)
                    }
                    disabled={verifying || code.length !== CODE_LENGTH}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-6 w-full rounded-xl bg-primary py-3.5 text-button-lg text-white transition-colors hover:bg-primary-shade-1 disabled:opacity-60"
                  >
                    {verifying ? "در حال بررسی…" : "تأیید"}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
