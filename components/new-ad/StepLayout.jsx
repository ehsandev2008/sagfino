"use client";
import Image from "next/image";

export default function StepLayout({ children }) {
  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Left panel — form */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {children}
      </div>

      {/* Right panel — decorative photo (hidden on mobile) */}
      <div className="hidden lg:block w-[420px] xl:w-[500px] shrink-0 relative">
        <Image
          src="/photo.png"
          alt="real estate"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/10" />
      </div>
    </div>
  );
}
