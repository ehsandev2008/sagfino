import Image from "next/image";
import Link from "next/link";

/**
 * لوگوی سقفینو
 * @param {"sm" | "lg"} size - sm برای هدر، lg برای فوتر
 */
export default function Logo({ size = "sm" }) {
  const dims =
    size === "lg"
      ? { src: "/logos/logo-primary-lg.webp", width: 180, height: 86 }
      : { src: "/logos/logo-primary.webp", width: 120, height: 57 };

  return (
    <Link href="/" aria-label="سقفینو - صفحه اصلی" className="shrink-0">
      <Image
        src={dims.src}
        alt="سقفینو"
        width={dims.width}
        height={dims.height}
        priority
        className="h-auto w-[104px] lg:w-[120px]"
      />
    </Link>
  );
}
