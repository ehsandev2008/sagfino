"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CloseCircle, Clock } from "iconsax-react";
import Link from "next/link";
import Logo from "../Logo";
import { toast } from "../ui/toast/toast";
import {
  isValidIranianPhone,
  requestLoginCode,
  toEnglishDigits,
  toFaDigits,
  verifyLoginCode,
} from "../../lib/auth";
import { useAuth } from "../../context/AuthContext";
import OtpInput from "./OtpInput";

const CODE_LENGTH = 5;
const RESEND_SECONDS = 120;

/** مودال ورود دومرحله‌ای: شماره موبایل ← کد تأیید */
export default function LoginModal() {
  const { loginOpen: open, closeLogin: onClose, login } = useAuth();
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [code, setCode] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const verifyingRef = useRef(false);

  // شروع تمیز: با هر بار بسته شدن، فرم ریست می‌شود تا باز شدن بعدی تمیز باشد
  const handleClose = useCallback(() => {
    setStep("phone");
    setCode("");
    setSecondsLeft(RESEND_SECONDS);
    setVerifying(false);
    verifyingRef.current = false;
    onClose();
  }, [onClose]);

  // قفل اسکرول + بستن با Escape
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

  // شمارش معکوس ارسال مجدد
  useEffect(() => {
    if (!open || step !== "code" || secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [open, step, secondsLeft]);

  const handleSendCode = async (e) => {
    e?.preventDefault();
    if (!isValidIranianPhone(phone)) {
      toast.error("شماره موبایل وارد شده معتبر نیست");
      return;
    }
    if (!accepted) {
      toast.error("برای ادامه، با قوانین سقفینو موافقت کنید");
      return;
    }
    setSending(true);
    try {
      await requestLoginCode(phone);
      setCode("");
      setSecondsLeft(RESEND_SECONDS);
      setStep("code");
    } finally {
      setSending(false);
    }
  };

  const handleVerify = useCallback(
    async (value) => {
      if (verifyingRef.current) return;
      verifyingRef.current = true;
      setVerifying(true);
      try {
        const { ok } = await verifyLoginCode(phone, value);
        if (ok) {
          login(toEnglishDigits(phone).trim());
          handleClose();
          toast.success("به سقفینو خوش آمدید");
        } else {
          toast.error("کد وارد شده صحیح نیست");
          setCode("");
        }
      } finally {
        setVerifying(false);
        verifyingRef.current = false;
      }
    },
    [phone, login, handleClose]
  );

  // ثبت خودکار وقتی هر ۵ رقم کامل شد
  useEffect(() => {
    if (open && step === "code" && code.length === CODE_LENGTH) handleVerify(code);
  }, [open, step, code, handleVerify]);

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
          aria-label="ورود"
          className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/50"
          />
          <motion.div
            initial={{ opacity: 0, y: 48, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.97, transition: { duration: 0.2 } }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="relative max-h-[92dvh] w-full max-w-[440px] overflow-y-auto rounded-t-3xl bg-white p-6 sm:rounded-3xl sm:p-8"
          >
            <button
              type="button"
              aria-label="بستن"
              onClick={handleClose}
              className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-gray-9 transition-colors hover:bg-gray-2 hover:text-black"
            >
              <CloseCircle size="24" color="currentColor" />
            </button>

            <div className="mb-6 flex justify-center sm:hidden">
              <Logo />
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {step === "phone" ? (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="text-center text-h4 font-bold text-black">ورود</h2>
                  <p className="mt-4 text-center text-body-xs text-black">
                    به سقفینو خوش آمدید
                  </p>
                  <p className="mt-2 text-center text-body-xxs text-gray-9">
                    لطفا برای ورود شماره موبایل خود را وارد کنید
                  </p>

                  <form onSubmit={handleSendCode} className="mt-6">
                    <input
                      value={phone}
                      onChange={(e) =>
                        setPhone(toEnglishDigits(e.target.value).replace(/\D/g, "").slice(0, 11))
                      }
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      placeholder="شماره موبایل"
                      aria-label="شماره موبایل"
                      dir="ltr"
                      className="w-full rounded-md border border-gray-5 bg-white px-4 py-3.5 text-center text-body-xs tracking-widest text-black outline-none transition-all placeholder:text-gray-7 focus:border-primary focus:ring-2 focus:ring-primary/25"
                    />

                    <label className="mt-4 flex cursor-pointer items-center gap-2 text-body-xxs text-gray-9">
                      <input
                        type="checkbox"
                        checked={accepted}
                        onChange={(e) => setAccepted(e.target.checked)}
                        className="h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-md border border-gray-5 bg-white transition-all checked:border-primary checked:bg-primary checked:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22white%22 stroke-width=%223.5%22%3E%3Cpath d=%22M5 13l4 4L19 7%22/%3E%3C/svg%3E')] checked:bg-center checked:bg-no-repeat"
                      />
                      با
                      <Link href="/terms" className="text-primary">
                        قوانین سقفینو
                      </Link>
                      موافق هستم
                    </label>

                    <button
                      type="submit"
                      disabled={sending}
                      className="mt-6 w-full rounded-md bg-primary py-3.5 text-button-lg text-white transition-colors hover:bg-primary-shade-1 disabled:opacity-60"
                    >
                      {sending ? "در حال ارسال…" : "ورود"}
                    </button>
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
                  <h2 className="text-center text-h4 font-bold text-black">کد تأیید</h2>
                  <p className="mt-4 text-center text-body-xxs leading-7 text-gray-11">
                    کد ارسال‌شده به شماره {toFaDigits(toEnglishDigits(phone))} را وارد کنید
                  </p>
                  <button
                    type="button"
                    onClick={() => setStep("phone")}
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
                        <span>
                          {timerLabel} تا دریافت مجدد کد
                        </span>
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

                  <button
                    type="button"
                    onClick={() => code.length === CODE_LENGTH && handleVerify(code)}
                    disabled={verifying || code.length !== CODE_LENGTH}
                    className="mt-6 w-full rounded-md bg-primary py-3.5 text-button-lg text-white transition-colors hover:bg-primary-shade-1 disabled:opacity-60"
                  >
                    {verifying ? "در حال بررسی…" : "تأیید"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
