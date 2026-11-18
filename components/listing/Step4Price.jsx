"use client";

import FormInput from "./FormInput";

/** فرمت‌کننده عدد با جداکننده هزارگان */
function formatPrice(value) {
  if (!value) return "";
  const num = value.replace(/\D/g, "");
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * مرحله ۴: اطلاعات قیمتی ملک
 * فروش: قیمت کل، قیمت هر متر و وام قابل انتقال
 * اجاره/رهن: ودیعه و اجاره ماهانه
 * اجاره روزانه: اجاره روزانه
 */
export default function Step4Price({ data, onChange, errors }) {
  const transactionType = data.transactionType || "rent";
  const isSale = transactionType === "sale";
  const isDailyRent = transactionType === "daily-rent";
  const isRent = transactionType === "rent" || transactionType === "mortgage";

  return (
    <div className="flex flex-col">
      <h2 className="text-right text-h4 font-bold text-black lg:text-[30px]">
        اطلاعات مالی را وارد کنید
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-[10.5vh] lg:gap-5">
        {isRent ? (
          <>
            <FormInput
              size="lg"
              label="مبلغ رهن"
              placeholder="مبلغ رهن (تومان)"
              type="text"
              inputMode="numeric"
              value={formatPrice(data.deposit || "")}
              onChange={(e) =>
                onChange({ deposit: e.target.value.replace(/\D/g, "") })
              }
              suffix="تومان"
              error={errors?.deposit}
            />
            <FormInput
              size="lg"
              label="اجاره ماهانه"
              placeholder="اجاره ماهانه (تومان)"
              type="text"
              inputMode="numeric"
              value={formatPrice(data.monthlyRent || "")}
              onChange={(e) =>
                onChange({ monthlyRent: e.target.value.replace(/\D/g, "") })
              }
              suffix="تومان"
              error={errors?.monthlyRent}
            />
          </>
        ) : (
          <FormInput
            size="lg"
            label={isSale ? "قیمت کل" : isDailyRent ? "اجاره روزانه" : "قیمت"}
            placeholder={
              isSale
                ? "قیمت کل (تومان)"
                : isDailyRent
                  ? "اجاره روزانه (تومان)"
                  : "قیمت (تومان)"
            }
            type="text"
            inputMode="numeric"
            value={formatPrice(data.price || "")}
            onChange={(e) =>
              onChange({ price: e.target.value.replace(/\D/g, "") })
            }
            suffix="تومان"
            error={errors?.price}
          />
        )}
      </div>

      {isSale && (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-5">
          <FormInput
            size="lg"
            label="قیمت هر متر"
            placeholder="قیمت هر متر مربع"
            type="text"
            inputMode="numeric"
            value={formatPrice(data.pricePerMeter || "")}
            onChange={(e) =>
              onChange({ pricePerMeter: e.target.value.replace(/\D/g, "") })
            }
            suffix="تومان"
            error={errors?.pricePerMeter}
          />
          <FormInput
            size="lg"
            label="مبلغ وام قابل انتقال"
            placeholder="مبلغ وام قابل انتقال (اختیاری)"
            type="text"
            inputMode="numeric"
            value={formatPrice(data.loanAmount || "")}
            onChange={(e) =>
              onChange({ loanAmount: e.target.value.replace(/\D/g, "") })
            }
            suffix="تومان"
            error={errors?.loanAmount}
          />
        </div>
      )}
    </div>
  );
}
