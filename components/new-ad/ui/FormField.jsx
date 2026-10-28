"use client";

export default function FormField({
  label,
  required,
  placeholder,
  value,
  onChange,
  type = "text",
  icon,
  suffix,
  helper,
  error,
  inputMode,
  className = "",
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-[#353535]">
          {label}
          {required && <span className="text-[#CB1B1B] mr-1">*</span>}
        </label>
      )}
      <div
        className={`relative flex items-center rounded-xl border bg-white transition-all duration-200 ${
          error
            ? "border-[#CB1B1B] ring-2 ring-[#CB1B1B]/20"
            : "border-[#e1e1e1] focus-within:border-[#CB1B1B] focus-within:ring-2 focus-within:ring-[#CB1B1B]/20 hover:border-[#909090]"
        }`}
      >
        {suffix && (
          <span className="pr-3 pl-1 text-sm text-[#909090] border-r border-[#e1e1e1] ml-2 shrink-0">
            {suffix}
          </span>
        )}
        <input
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full py-3 px-4 text-sm text-[#212121] bg-transparent outline-none text-right placeholder:text-[#909090]"
          dir="rtl"
        />
        {icon && (
          <span className="absolute left-3 flex items-center text-[#909090]">
            {icon}
          </span>
        )}
      </div>
      {helper && !error && (
        <p className="text-xs text-[#909090] text-right">{helper}</p>
      )}
      {error && (
        <p className="text-xs text-[#CB1B1B] text-right">{error}</p>
      )}
    </div>
  );
}
