"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { Profile, Lock, Eye, EyeSlash } from "iconsax-react";

export default function RegisterStep({ onSubmit }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = "نام الزامی است";
    if (!form.lastName.trim()) errs.lastName = "نام خانوادگی الزامی است";
    if (form.password.length < 6) errs.password = "رمز عبور باید حداقل ۶ کاراکتر باشد";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit(form);
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-[#212121] mb-1">ساخت حساب کاربری</h2>
        <p className="text-sm text-[#909090]">
          برای ثبت آگهی ابتدا اطلاعات خود را وارد کنید
        </p>
      </div>

      {/* First Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#353535]">
          نام <span className="text-[#CB1B1B]">*</span>
        </label>
        <div
          className={`flex items-center rounded-xl border bg-white transition-all duration-200 ${
            errors.firstName
              ? "border-[#CB1B1B] ring-2 ring-[#CB1B1B]/20"
              : "border-[#e1e1e1] focus-within:border-[#CB1B1B] focus-within:ring-2 focus-within:ring-[#CB1B1B]/20"
          }`}
        >
          <input
            type="text"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            placeholder="نام خود را وارد کنید"
            className="flex-1 py-3 px-4 text-sm bg-transparent outline-none text-right placeholder:text-[#909090] text-[#212121]"
          />
          <span className="pl-3 pr-1 text-[#909090]">
            <Profile size={20} />
          </span>
        </div>
        {errors.firstName && (
          <p className="text-xs text-[#CB1B1B] text-right">{errors.firstName}</p>
        )}
      </div>

      {/* Last Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#353535]">
          نام خانوادگی <span className="text-[#CB1B1B]">*</span>
        </label>
        <div
          className={`flex items-center rounded-xl border bg-white transition-all duration-200 ${
            errors.lastName
              ? "border-[#CB1B1B] ring-2 ring-[#CB1B1B]/20"
              : "border-[#e1e1e1] focus-within:border-[#CB1B1B] focus-within:ring-2 focus-within:ring-[#CB1B1B]/20"
          }`}
        >
          <input
            type="text"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            placeholder="نام خانوادگی خود را وارد کنید"
            className="flex-1 py-3 px-4 text-sm bg-transparent outline-none text-right placeholder:text-[#909090] text-[#212121]"
          />
          <span className="pl-3 pr-1 text-[#909090]">
            <Profile size={20} />
          </span>
        </div>
        {errors.lastName && (
          <p className="text-xs text-[#CB1B1B] text-right">{errors.lastName}</p>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#353535]">
          رمز عبور <span className="text-[#CB1B1B]">*</span>
        </label>
        <div
          className={`flex items-center rounded-xl border bg-white transition-all duration-200 ${
            errors.password
              ? "border-[#CB1B1B] ring-2 ring-[#CB1B1B]/20"
              : "border-[#e1e1e1] focus-within:border-[#CB1B1B] focus-within:ring-2 focus-within:ring-[#CB1B1B]/20"
          }`}
        >
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            className="pl-3 pr-1 text-[#909090] hover:text-[#353535] transition-colors"
          >
            {showPass ? <EyeSlash size={20} /> : <Eye size={20} />}
          </button>
          <input
            type={showPass ? "text" : "password"}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="رمز عبور"
            dir="ltr"
            className="flex-1 py-3 px-4 text-sm bg-transparent outline-none text-left placeholder:text-[#909090] placeholder:text-right text-[#212121]"
          />
          <span className="pl-3 pr-1 text-[#909090]">
            <Lock size={20} />
          </span>
        </div>
        <p className="text-xs text-[#CB1B1B] text-right">
          لطفا به انگلیسی تایپ کنید
        </p>
        {errors.password && (
          <p className="text-xs text-[#CB1B1B] text-right">{errors.password}</p>
        )}
      </div>

      {/* Submit */}
      <motion.button
        type="button"
        onClick={handleSubmit}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.01 }}
        className="w-full py-3.5 rounded-xl bg-[#CB1B1B] text-white font-semibold text-sm shadow-sm hover:bg-[#b01818] transition-colors duration-200 mt-2"
      >
        ثبت اطلاعات
      </motion.button>
    </div>
  );
}
