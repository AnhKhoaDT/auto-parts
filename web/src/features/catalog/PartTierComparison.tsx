"use client";

import { ShieldCheck, Award, CheckCircle2, ShoppingCart, Sparkles } from "lucide-react";
import type { getDictionary } from "@/lib/i18n";
import type { Product } from "@/lib/api";

interface PartTierComparisonProps {
  product: Product;
  dict: ReturnType<typeof getDictionary>;
  onAddToCart: (p: Product) => void;
  isGarageUser: boolean;
}

// PartTierComparison allows customers and garages to compare Genuine vs OEM vs Aftermarket tiers for the same OEM.
export default function PartTierComparison({
  product,
  dict,
  onAddToCart,
  isGarageUser,
}: PartTierComparisonProps) {
  const pdict = dict.productDetail;

  const baseRetail = product.retail_price;
  const baseWholesale = product.wholesale_price;

  const tiers = [
    {
      key: "GENUINE",
      name: pdict.tierGenuine,
      badge: "Hàng Hãng",
      brand: `${product.brand_name || "Toyota"} Genuine Parts`,
      country: "Nhật Bản / Thái Lan",
      retailPrice: Math.round(baseRetail * 1.6 / 10000) * 10000,
      wholesalePrice: Math.round(baseWholesale * 1.55 / 10000) * 10000,
      warranty: "18-24 Tháng",
      durability: "100%",
      desc: pdict.tierGenuineDesc,
      isCurrent: product.grade === "GENUINE",
      isBestChoice: false,
    },
    {
      key: "OEM",
      name: pdict.tierOEM,
      badge: pdict.tierBestChoice,
      brand: "Denso / Bosch Japan OEM",
      country: "Nhật Bản",
      retailPrice: baseRetail,
      wholesalePrice: baseWholesale,
      warranty: "12 Tháng",
      durability: "99%",
      desc: pdict.tierOEMDesc,
      isCurrent: product.grade === "OEM" || !product.grade,
      isBestChoice: true,
    },
    {
      key: "AFTERMARKET",
      name: pdict.tierAftermarket,
      badge: "Tiết Kiệm",
      brand: "MK Kashiyama / 555 Japan",
      country: "Nhật Bản / Indonesia",
      retailPrice: Math.round(baseRetail * 0.65 / 10000) * 10000,
      wholesalePrice: Math.round(baseWholesale * 0.68 / 10000) * 10000,
      warranty: "6 Tháng",
      durability: "85%",
      desc: pdict.tierAftermarketDesc,
      isCurrent: product.grade === "AFTERMARKET",
      isBestChoice: false,
    },
  ];

  const formatVnd = (amount: number) =>
    new Intl.NumberFormat("vi-VN").format(amount) + " đ";

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-100">
        <div>
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Award className="h-5 w-5 text-sky-600" />
            <span>{pdict.tierTitle}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{pdict.tierSubtitle}</p>
        </div>
        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 self-start sm:self-auto border border-slate-200">
          OEM: {product.oem_number}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        {tiers.map((tier) => {
          const effectivePrice = isGarageUser ? tier.wholesalePrice : tier.retailPrice;

          return (
            <div
              key={tier.key}
              className={`rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition border ${
                tier.isBestChoice
                  ? "border-sky-500 bg-sky-50/30 ring-1 ring-sky-500/20 shadow-xs"
                  : "border-slate-200 bg-slate-50/50 hover:bg-slate-50"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      tier.isBestChoice
                        ? "bg-sky-600 text-white"
                        : tier.key === "GENUINE"
                        ? "bg-rose-100 text-rose-800 border border-rose-200"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {tier.badge}
                  </span>
                  {tier.isCurrent && (
                    <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                      {pdict.tierCurrent}
                    </span>
                  )}
                </div>

                <h4 className="font-black text-sm text-slate-900">{tier.name}</h4>
                <p className="text-xs text-slate-600 font-semibold mt-0.5">{tier.brand}</p>
                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">{tier.desc}</p>

                <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>{pdict.tierDurability}:</span>
                    <strong className="text-slate-900">{tier.durability}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>{pdict.warrantyMonths}:</span>
                    <strong className="text-slate-900">{tier.warranty}</strong>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-200">
                <div className="mb-3">
                  <span className="text-[11px] text-slate-500 block">
                    {isGarageUser ? pdict.wholesalePrice : pdict.retailPrice}
                  </span>
                  <div className="text-base font-black text-sky-700">
                    {formatVnd(effectivePrice)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onAddToCart({
                      ...product,
                      retail_price: tier.retailPrice,
                      wholesale_price: tier.wholesalePrice,
                      name: `${product.name} [${tier.name}]`,
                    })
                  }
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs ${
                    tier.isBestChoice
                      ? "bg-sky-600 hover:bg-sky-500 text-white"
                      : "bg-white hover:bg-slate-100 text-slate-800 border border-slate-300"
                  }`}
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  <span>{tier.isCurrent ? pdict.addToCart : pdict.tierSelect}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
