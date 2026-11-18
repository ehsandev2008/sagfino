import { Suspense } from "react";
import { connection } from "next/server";
import AgentDirectory from "@/components/agents/AgentDirectory";
import ADVISORS from "@/components/home-pro/top-advisors/advisors";
import {
  getCityById,
  getProvinceById,
  normalizeSearchText,
} from "@/lib/listings/locations";

export const metadata = {
  title: "مشاورین املاک | سقفینو",
  description: "مشاوران املاک معتبر را در شهر خود پیدا کنید.",
};

export default function AgentsPage({ searchParams }) {
  return (
    <Suspense
      fallback={
        <main
          dir="rtl"
          className="mx-auto min-h-64 w-[calc(100%-1.5rem)] max-w-[1224px] py-12 text-center text-gray-8 sm:w-[calc(100%-3rem)]"
          role="status"
        >
          در حال بارگذاری مشاورین…
        </main>
      }
    >
      <AgentDirectoryPage searchParams={searchParams} />
    </Suspense>
  );
}

async function AgentDirectoryPage({ searchParams }) {
  await connection();
  const raw = await searchParams;
  const first = (value) => (Array.isArray(value) ? value[0] : value);
  const query = String(first(raw.q) ?? "").trim().slice(0, 80);
  const cityId = String(first(raw.city) ?? "").replace(/[^\d]/g, "");
  const provinceId = String(first(raw.province) ?? "").replace(/[^\d]/g, "");
  const selectedCity = cityId ? getCityById(cityId) : null;
  const selectedProvince =
    !selectedCity && provinceId ? getProvinceById(provinceId) : null;
  const normalizedQuery = normalizeSearchText(query);
  const advisors = ADVISORS.filter((advisor) => {
    const matchesQuery =
      !normalizedQuery ||
      normalizeSearchText(`${advisor.name} ${advisor.office}`).includes(
        normalizedQuery
      );
    const matchesCity =
      !selectedCity || advisor.cityName === selectedCity.name;
    const matchesProvince =
      !selectedProvince || advisor.cityName === selectedProvince.name;

    return matchesQuery && matchesCity && matchesProvince;
  });

  return (
    <AgentDirectory
      advisors={advisors}
      query={query}
      selectedCity={selectedCity}
      selectedProvince={selectedProvince}
    />
  );
}
