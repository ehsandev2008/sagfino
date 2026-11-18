"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { toFaDigits } from "../../lib/auth";

const LINE_COUNT = 10;
const SAFETY_GAP = 2;

function normalizeLines(value) {
  const source = Array.isArray(value) ? value : [];

  return Array.from({ length: LINE_COUNT }, (_, index) =>
    typeof source[index] === "string" ? source[index] : ""
  );
}

/**
 * مرحله ۵: توضیحات آزاد در ده خط شماره‌دار.
 *
 * هر خط یک ورودی جداگانه است؛ وقتی متن از عرض خط بیشتر شود، بخش سرریز
 * به‌صورت خودکار به خط بعدی منتقل می‌شود و فوکوس هم به همان خط می‌رود.
 * چسباندن متن چندخطی هم بین خطوط توزیع می‌شود.
 */
export default function Step5Description({ data, onChange }) {
  const lines = useMemo(
    () => normalizeLines(data.descriptionLines),
    [data.descriptionLines]
  );

  const inputsRef = useRef([]);
  const canvasRef = useRef(null);
  const pendingFocusRef = useRef(null);

  // بعد از رندر، فوکوس و مکان‌نما را روی خط مقصد قرار می‌دهد.
  useEffect(() => {
    const pending = pendingFocusRef.current;
    if (!pending) return;

    pendingFocusRef.current = null;
    const input = inputsRef.current[pending.index];
    if (!input) return;

    input.focus();
    const position = Math.max(
      0,
      Math.min(pending.position ?? input.value.length, input.value.length)
    );
    input.setSelectionRange(position, position);
  }, [data.descriptionLines]);

  /** اندازه‌گیری عرض متن با همان فونت ورودی جاری */
  const measure = useCallback((text) => {
    if (!text || typeof window === "undefined") return 0;

    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }

    const context = canvasRef.current.getContext("2d");
    const input = inputsRef.current[0];
    if (!context || !input) return 0;

    const style = window.getComputedStyle(input);
    context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;

    return context.measureText(text).width;
  }, []);

  /** عرض قابل استفادهٔ داخل ورودی، بدون پدینگ افقی */
  const availableWidth = useCallback((index) => {
    const input = inputsRef.current[index] ?? inputsRef.current[0];
    if (!input) return 0;

    const style = window.getComputedStyle(input);
    const padding =
      (parseFloat(style.paddingLeft) || 0) +
      (parseFloat(style.paddingRight) || 0);

    return Math.max(0, input.clientWidth - padding - SAFETY_GAP);
  }, []);

  /**
   * متن را به دو بخش «جا می‌شود» و «سرریز» تقسیم می‌کند.
   * تا حد امکان شکست در مرز واژه انجام می‌شود.
   */
  const splitLine = useCallback(
    (text, width) => {
      if (!text || width <= 0) return { head: "", tail: text };
      if (measure(text) <= width) return { head: text, tail: "" };

      const chars = Array.from(text);
      let low = 1;
      let high = chars.length;

      while (low < high) {
        const middle = Math.ceil((low + high) / 2);
        const candidate = chars.slice(0, middle).join("");

        if (measure(candidate) <= width) low = middle;
        else high = middle - 1;
      }

      let splitAt = low;

      // اگر فاصله‌ای نزدیک انتهای خط هست، واژه را نشکن.
      for (let cursor = splitAt - 1; cursor > 0; cursor -= 1) {
        if (chars[cursor] === " " || chars[cursor] === "\u00A0") {
          splitAt = cursor;
          break;
        }
      }

      return {
        head: chars.slice(0, splitAt).join(""),
        tail: chars
          .slice(splitAt)
          .join("")
          .replace(/^[ \u00A0]+/, ""),
      };
    },
    [measure]
  );

  /**
   * سرریز هر خط را به خط بعد می‌ریزد.
   * `focus` موقعیت مکان‌نما را در آرایهٔ خطوط قبل از جابه‌جایی نگه می‌دارد
   * تا پس از توزیع، مکان‌نما روی خط درست قرار بگیرد.
   */
  const reflow = useCallback(
    (nextLines, startIndex, focus) => {
      let nextFocus = focus;

      for (let index = startIndex; index < LINE_COUNT - 1; index += 1) {
        const current = nextLines[index] ?? "";
        const width = availableWidth(index);

        if (!width || !current) continue;
        if (measure(current) <= width) continue;

        const { head, tail } = splitLine(current, width);

        if (!tail) {
          // فقط فاصله‌های انتهایی سرریز شده‌اند؛ خط بعدی فعال شود.
          nextLines[index] = head;
          if (nextFocus?.index === index && nextFocus.position > head.length) {
            nextFocus = { index: index + 1, position: 0 };
          }
          continue;
        }

        const existing = nextLines[index + 1] ?? "";
        nextLines[index] = head;
        nextLines[index + 1] = tail + existing;

        const trimmedSpaces = current.length - head.length - tail.length;

        if (nextFocus?.index === index) {
          if (nextFocus.position > head.length) {
            nextFocus = {
              index: index + 1,
              position: Math.max(
                0,
                nextFocus.position - head.length - trimmedSpaces
              ),
            };
          }
        } else if (nextFocus?.index === index + 1) {
          nextFocus = {
            ...nextFocus,
            position: nextFocus.position + tail.length,
          };
        }
      }

      return nextFocus;
    },
    [availableWidth, measure, splitLine]
  );

  const commit = useCallback(
    (nextLines, focus) => {
      onChange({
        descriptionLines: nextLines,
        description: nextLines
          .filter((line) => line.trim())
          .join("\n"),
      });

      pendingFocusRef.current = focus;
    },
    [onChange]
  );

  const handleChange = (index, event) => {
    const input = event.currentTarget;
    const value = input.value;
    const caret = input.selectionStart ?? value.length;

    const nextLines = [...lines];
    nextLines[index] = value;

    const focus = reflow(nextLines, index, { index, position: caret });
    commit(nextLines, focus);
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      const input = event.currentTarget;
      const current = lines[index] ?? "";
      const caret = input.selectionStart ?? current.length;
      const before = current.slice(0, caret);
      const after = current.slice(caret);

      if (!after) {
        const target = inputsRef.current[index + 1];
        if (!target) return;
        target.focus();
        target.setSelectionRange(target.value.length, target.value.length);
        return;
      }

      const nextLines = [...lines];
      nextLines[index] = before;
      nextLines[index + 1] = after + (nextLines[index + 1] ?? "");

      const focus = reflow(nextLines, index, {
        index: index + 1,
        position: after.length,
      });
      commit(nextLines, focus);
      return;
    }

    if (event.key === "Backspace") {
      const input = event.currentTarget;

      if (
        index === 0 ||
        input.selectionStart !== 0 ||
        input.selectionEnd !== 0
      ) {
        return;
      }

      event.preventDefault();

      const previous = lines[index - 1] ?? "";
      const current = lines[index] ?? "";
      const nextLines = [...lines];
      nextLines[index - 1] = previous + current;
      nextLines[index] = "";

      const focus = reflow(nextLines, index - 1, {
        index: index - 1,
        position: previous.length,
      });
      commit(nextLines, focus);
    }
  };

  const handlePaste = (index, event) => {
    const text = event.clipboardData?.getData("text") ?? "";
    if (!text) return;

    const input = event.currentTarget;
    const current = lines[index] ?? "";
    const selectionStart = input.selectionStart ?? current.length;
    const selectionEnd = input.selectionEnd ?? selectionStart;
    const before = current.slice(0, selectionStart);
    const after = current.slice(selectionEnd);
    const segments = text.replace(/\r\n?/g, "\n").split("\n");

    event.preventDefault();

    const nextLines = [...lines];

    if (segments.length === 1) {
      nextLines[index] = before + segments[0] + after;

      const focus = reflow(nextLines, index, {
        index,
        position: before.length + segments[0].length,
      });
      commit(nextLines, focus);
      return;
    }

    // متن چندخطی: هر بخش روی یک خط می‌نشیند و محتوای قبلی حفظ می‌شود.
    nextLines[index] = before + segments[0];
    let lastIndex = index;

    for (let segment = 1; segment < segments.length; segment += 1) {
      if (lastIndex + 1 >= LINE_COUNT) {
        nextLines[lastIndex] = `${nextLines[lastIndex]} ${segments[segment]}`;
        continue;
      }

      lastIndex += 1;
      const existing = nextLines[lastIndex] ?? "";
      nextLines[lastIndex] = existing
        ? `${segments[segment]} ${existing}`
        : segments[segment];
    }

    if (after) {
      nextLines[lastIndex] = `${nextLines[lastIndex]}${after}`;
    }

    const focus = reflow(nextLines, index, {
      index: lastIndex,
      position: (nextLines[lastIndex] ?? "").length,
    });
    commit(nextLines, focus);
  };

  return (
    <div className="flex flex-col">
      <h2 className="text-right text-body-s font-medium text-gray-11 lg:text-[22px]">
        اگر توضیحات اضافی دارید در این قسمت بنویسید
      </h2>

      <div className="mt-8 flex w-full flex-col lg:mt-[5vh] lg:w-[62%] lg:me-auto">
        {Array.from({ length: LINE_COUNT }).map((_, index) => (
          <div
            key={index}
            className="flex h-10 items-center gap-2 sm:h-11 lg:h-[4.2vh] 2xl:h-[4.6vh]"
          >
            <span className="w-6 shrink-0 text-center text-body-xs text-gray-7 lg:text-body-s">
              {toFaDigits(index + 1)}
            </span>
            <input
              ref={(element) => {
                inputsRef.current[index] = element;
              }}
              type="text"
              value={lines[index]}
              onChange={(event) => handleChange(index, event)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              onPaste={(event) => handlePaste(index, event)}
              aria-label={`توضیح خط ${toFaDigits(index + 1)}`}
              className="h-full min-w-0 flex-1 border-b border-dashed border-gray-4 bg-transparent px-1 text-body-xs text-black outline-none transition-colors focus:border-primary/60"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
