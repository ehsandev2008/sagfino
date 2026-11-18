"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import CustomDropdown from "./CustomDropdown";
import FormInput from "./FormInput";

const LocationPicker = dynamic(() => import("./LocationPicker"), {
  ssr: false,
  loading: () => (
    <div className="grid h-64 place-items-center rounded-xl border border-gray-4 bg-gray-2 text-sm text-gray-8">
      در حال آماده‌سازی نقشه…
    </div>
  ),
});

/**
 * مرحله ۱: استان، شهر و آدرس ملک
 */
export default function Step1Address({ data, onChange, errors }) {
  const [provinces, setProvinces] = useState([]);
  const [cityState, setCityState] = useState({
    provinceId: "",
    cities: [],
  });

  useEffect(() => {
    let active = true;

    fetch("/api/locations/provinces")
      .then((response) => response.json())
      .then((json) => {
        if (active) setProvinces(json.provinces ?? []);
      })
      .catch(() => {
        if (active) setProvinces([]);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!data.provinceId) return;

    let active = true;
    const provinceId = data.provinceId;

    fetch(
      `/api/locations/cities?province=${encodeURIComponent(
        provinceId
      )}&limit=200`
    )
      .then((response) => response.json())
      .then((json) => {
        if (active) {
          setCityState({ provinceId, cities: json.cities ?? [] });
        }
      })
      .catch(() => {
        if (active) {
          setCityState({ provinceId, cities: [] });
        }
      });

    return () => {
      active = false;
    };
  }, [data.provinceId]);

  // شهرها فقط وقتی معتبرند که مربوط به استان انتخاب‌شده باشند.
  const cities = useMemo(
    () => (cityState.provinceId === data.provinceId ? cityState.cities : []),
    [cityState, data.provinceId]
  );
  const citiesLoading =
    Boolean(data.provinceId) && cityState.provinceId !== data.provinceId;

  const provinceOptions = useMemo(
    () =>
      provinces.map((province) => ({
        value: String(province.id),
        label: province.name,
      })),
    [provinces]
  );

  const cityOptions = useMemo(
    () =>
      cities.map((city) => ({
        value: String(city.id),
        label: city.name,
      })),
    [cities]
  );

  const handleProvinceChange = (value) => {
    const province = provinces.find((item) => String(item.id) === value);
    onChange({
      provinceId: value,
      provinceName: province?.name ?? "",
      cityId: "",
      cityName: "",
      cityLat: null,
      cityLng: null,
      locationLat: null,
      locationLng: null,
    });
  };

  const handleCityChange = (value) => {
    const city = cities.find((item) => String(item.id) === value);
    onChange({
      cityId: value,
      cityName: city?.name ?? "",
      provinceName: city?.provinceName ?? data.provinceName ?? "",
      cityLat: city?.lat ?? null,
      cityLng: city?.lng ?? null,
      locationLat: null,
      locationLng: null,
    });
  };

  const hasLocation =
    Number.isFinite(Number(data.locationLat)) &&
    Number.isFinite(Number(data.locationLng)) &&
    data.locationLat != null &&
    data.locationLng != null;

  const mapCenter =
    data.cityLat != null &&
    data.cityLng != null &&
    Number.isFinite(Number(data.cityLat)) &&
    Number.isFinite(Number(data.cityLng))
      ? {
          lat: Number(data.cityLat),
          lng: Number(data.cityLng),
          zoom: 12,
        }
      : { lat: 32.4279, lng: 53.688, zoom: 5 };

  return (
    <div className="flex flex-col">
      <h2 className="text-right text-h4 font-bold text-black lg:text-[30px]">
        لطفا موارد زیر را تکمیل کنید
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-[10.5vh] lg:gap-5">
        <CustomDropdown
          size="lg"
          label="استان"
          placeholder="استان را انتخاب کنید"
          options={provinceOptions}
          value={data.provinceId || ""}
          onChange={handleProvinceChange}
          error={errors?.provinceId}
        />
        <CustomDropdown
          size="lg"
          label="شهر"
          placeholder={
            citiesLoading ? "در حال بارگذاری شهرها..." : "شهر را انتخاب کنید"
          }
          options={cityOptions}
          value={data.cityId || ""}
          onChange={handleCityChange}
          error={errors?.cityId}
        />
        <FormInput
          size="lg"
          label="خیابان اصلی"
          placeholder="آدرس خود را وارد کنید"
          value={data.mainStreet || ""}
          onChange={(e) => onChange({ mainStreet: e.target.value })}
          error={errors?.mainStreet}
          autoComplete="address-line1"
        />
        <FormInput
          size="lg"
          label="خیابان فرعی/کوچه"
          placeholder="جزئیات آدرس را وارد کنید"
          value={data.sideStreet || ""}
          onChange={(e) => onChange({ sideStreet: e.target.value })}
          error={errors?.sideStreet}
          autoComplete="address-line2"
        />
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-gray-11 sm:text-base">
              موقعیت ملک روی نقشه
            </h3>
            <p className="mt-1 text-xs leading-6 text-gray-8 sm:text-sm">
              برای مشخص‌کردن موقعیت دقیق، روی نقشه کلیک کنید.
            </p>
          </div>
          {hasLocation && (
            <button
              type="button"
              onClick={() =>
                onChange({ locationLat: null, locationLng: null })
              }
              className="shrink-0 rounded-lg px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary-tint-1 sm:text-sm"
            >
              حذف موقعیت
            </button>
          )}
        </div>

        <LocationPicker
          center={mapCenter}
          position={
            hasLocation
              ? {
                  lat: Number(data.locationLat),
                  lng: Number(data.locationLng),
                }
              : null
          }
          onSelect={({ lat, lng }) =>
            onChange({ locationLat: lat, locationLng: lng })
          }
        />
        <p aria-live="polite" className="mt-2 text-xs text-gray-8">
          {hasLocation
            ? "موقعیت انتخاب‌شده ذخیره می‌شود و در صفحهٔ آگهی نمایش داده خواهد شد."
            : "انتخاب موقعیت روی نقشه اختیاری است."}
        </p>
      </div>
    </div>
  );
}
