"use client";

import { motion } from "motion/react";

const CONFETTI_COLORS = ["#f05c5c", "#f7a1a1", "#bdbdbd", "#d9d9d9"];

const CONFETTI = Array.from({ length: 42 }, (_, i) => {
  const angle = (i * 137.508 * Math.PI) / 180;
  const radius = 30 + ((i * 17) % 23);
  const isDot = i % 4 === 0;
  const width = isDot ? 4 : i % 3 === 0 ? 4 : 5;
  const height = isDot ? 4 : 13 + (i % 3) * 3;

  return {
    id: i,
    left: 50 + Math.cos(angle) * radius,
    top: 50 + Math.sin(angle) * radius * 0.92,
    width,
    height,
    rotate: (i * 47) % 360,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: 0.25 + (i % 9) * 0.045,
    duration: 2.6 + (i % 5) * 0.25,
  };
});

/** مسیر مارپیچ تزئینی برای اطراف تیک سبز */
function buildSpiralPath() {
  const points = [];
  for (let t = 0; t <= 4 * Math.PI; t += 0.18) {
    const r = 3 + t * 2.1;
    const x = 30 + Math.cos(t) * r;
    const y = 30 + Math.sin(t) * r;
    points.push(`${points.length ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return points.join(" ");
}

const SPIRAL_PATH = buildSpiralPath();

const SPIRALS = [
  { left: "6%", top: "12%", size: 42, rotate: -18 },
  { left: "72%", top: "16%", size: 34, rotate: 26 },
  { left: "1%", top: "48%", size: 38, rotate: 12 },
  { left: "84%", top: "52%", size: 42, rotate: -28 },
  { left: "17%", top: "76%", size: 34, rotate: 42 },
  { left: "70%", top: "78%", size: 36, rotate: -12 },
];

/**
 * صفحهٔ موفقیت ثبت آگهی
 */
export default function ListingSuccess() {
  return (
    <div className="flex min-h-dvh w-full flex-col items-center px-6 pt-[16vh]">
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
        className="text-center text-h4 font-bold text-black lg:text-[30px]"
      >
        آگهی شما با موفقیت ثبت شد
      </motion.h1>

      <div className="relative mt-[10vh] flex h-[320px] w-[320px] items-center justify-center sm:h-[380px] sm:w-[380px] lg:mt-[6vh] lg:h-[42vh] lg:w-[52vw] lg:max-w-[750px]">
        {CONFETTI.map((piece) => (
          <motion.span
            key={piece.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -5, 0],
              rotate: [piece.rotate, piece.rotate + 14, piece.rotate],
            }}
            transition={{
              opacity: { delay: piece.delay, duration: 0.35 },
              scale: { delay: piece.delay, duration: 0.35 },
              y: {
                delay: piece.delay + 0.4,
                duration: piece.duration,
                repeat: Infinity,
                ease: "easeInOut",
              },
              rotate: {
                delay: piece.delay + 0.4,
                duration: piece.duration + 0.8,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            style={{
              position: "absolute",
              left: `${piece.left}%`,
              top: `${piece.top}%`,
              width: piece.width,
              height: piece.height,
              marginLeft: -piece.width / 2,
              marginTop: -piece.height / 2,
              borderRadius: piece.width === piece.height ? 999 : 2,
              backgroundColor: piece.color,
            }}
          />
        ))}

        {SPIRALS.map((spiral, i) => (
          <svg
            key={i}
            viewBox="0 0 60 60"
            fill="none"
            aria-hidden="true"
            className="absolute"
            style={{
              left: spiral.left,
              top: spiral.top,
              width: spiral.size,
              height: spiral.size,
              transform: `rotate(${spiral.rotate}deg)`,
            }}
          >
            <path
              d={SPIRAL_PATH}
              stroke="#bdbdbd"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.55 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.12,
            type: "spring",
            stiffness: 190,
            damping: 16,
          }}
          className="relative flex h-40 w-40 items-center justify-center rounded-full bg-[#12b76a] shadow-[0_18px_55px_rgba(18,183,106,0.28)] lg:h-52 lg:w-52"
        >
          <svg
            viewBox="0 0 64 64"
            fill="none"
            className="h-20 w-20 lg:h-28 lg:w-28"
            aria-hidden="true"
          >
            <motion.path
              d="M16 33l10 10 22-22"
              stroke="#ffffff"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.45, duration: 0.5, ease: "easeOut" }}
            />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}
