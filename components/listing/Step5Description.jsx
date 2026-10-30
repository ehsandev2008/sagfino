"use client";

import { toFaDigits } from "../../lib/auth";

const LINE_COUNT = 10;

/**
 * مرحله ۵: توضیحات آزاد در ده خط شماره‌دار
 */
export default function Step5Description({ data, onChange }) {
  const lines =
    Array.isArray(data.descriptionLines) && data.descriptionLines.length
      ? data.descriptionLines
      : Array.from({ length: LINE_COUNT }, () => "");

  const setLine = (index, value) => {
    const next = [...lines];
    next[index] = value;
    onChange({
      descriptionLines: next,
      description: next.filter((line) => line.trim()).join("\n"),
    });
  };

  return (
    <div className="flex flex-col">
      <h2 className="text-right text-body-s font-medium text-gray-11 lg:text-[22px]">
        اگر توضیحات اضافی دارید در این قسمت بنویسید
      </h2>

      <div className="mt-8 flex w-full flex-col lg:mt-[5vh] lg:w-[62%] lg:me-auto">
        {Array.from({ length: LINE_COUNT }).map((_, i) => (
          <div
            key={i}
            className="flex h-10 items-center gap-2 sm:h-11 lg:h-[4.2vh] 2xl:h-[4.6vh]"
          >
            <span className="w-6 shrink-0 text-center text-body-xs text-gray-7 lg:text-body-s">
              {toFaDigits(i + 1)}
            </span>
            <input
              type="text"
              value={lines[i] || ""}
              onChange={(e) => setLine(i, e.target.value)}
              aria-label={`توضیح خط ${toFaDigits(i + 1)}`}
              className="h-full min-w-0 flex-1 border-b border-dashed border-gray-4 bg-transparent px-1 text-body-xs text-black outline-none transition-colors focus:border-primary/60"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
