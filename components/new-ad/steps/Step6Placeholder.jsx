"use client";
import StepNav from "../ui/StepNav";

export default function Step6Placeholder({ data, onChange, onSubmit, onPrev, loading }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-[#212121] mb-1">مرحله ۶</h2>
        <p className="text-sm text-[#909090]">این مرحله به زودی تکمیل می‌شود</p>
      </div>
      <div className="flex items-center justify-center h-32 rounded-xl border-2 border-dashed border-[#e1e1e1] text-[#909090] text-sm">
        در انتظار طراحی...
      </div>
      <StepNav
        onNext={onSubmit}
        onPrev={onPrev}
        nextLabel="ثبت آگهی"
        loading={loading}
      />
    </div>
  );
}
