"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, PackageCheck } from "lucide-react";
import type { getDictionary } from "@/lib/i18n";
import type { Product as ApiProduct } from "@/lib/api";

interface DisplayProduct {
  id: string;
  slug: string;
  oem: string;
  name: string;
  brand: string;
  grade: string;
  price: number;
  originalPrice: number;
  warrantyMonths: number;
  compatible: string;
  tab: string;
}

interface FeaturedProductTabsProps {
  dict: ReturnType<typeof getDictionary>;
  onAddToCart: () => void;
  apiProducts?: ApiProduct[];
}

// FeaturedProductTabs renders tabbed products in a crisp light e-commerce layout.
export default function FeaturedProductTabs({
  dict,
  onAddToCart,
  apiProducts,
}: FeaturedProductTabsProps) {
  const [activeTab, setActiveTab] = useState<"COMPATIBLE" | "MAINTENANCE" | "WHOLESALE">("COMPATIBLE");

  const sampleProducts: DisplayProduct[] = [
    {
      id: "1",
      slug: "bo-ma-phanh-truoc-denso-japan-04465-0d150",
      oem: "04465-0D150",
      name: "Bộ Má Phanh Trước Denso Japan Chuẩn OEM",
      brand: "Denso Japan",
      grade: "OEM",
      price: 450000,
      originalPrice: 580000,
      warrantyMonths: 12,
      compatible: "Toyota Vios, Yaris (2014 - 2023)",
      tab: "COMPATIBLE",
    },
    {
      id: "2",
      slug: "bugi-iridium-chan-dai-denso-sc20hr11",
      oem: "17801-0Y040",
      name: "Lọc Gió Động Cơ Bosch High-Flow Chống Ẩm",
      brand: "Bosch Germany",
      grade: "AFTERMARKET",
      price: 180000,
      originalPrice: 240000,
      warrantyMonths: 6,
      compatible: "Toyota Vios, Altis (2016 - 2023)",
      tab: "MAINTENANCE",
    },
    {
      id: "3",
      slug: "bugi-iridium-chan-dai-denso-sc20hr11",
      oem: "90919-01253",
      name: "Bugi Iridium Chân Dài Denso SC20HR11",
      brand: "Denso Japan",
      grade: "OEM",
      price: 220000,
      originalPrice: 280000,
      warrantyMonths: 24,
      compatible: "Toyota Vios, Corolla Cross, Altis",
      tab: "MAINTENANCE",
    },
    {
      id: "4",
      slug: "bo-ma-phanh-truoc-denso-japan-04465-0d150",
      oem: "48510-0D590",
      name: "Cặp Phuộc Nhún Giảm Xóc Trước KYB Excel-G Gas",
      brand: "KYB Japan",
      grade: "OEM",
      price: 1650000,
      originalPrice: 1950000,
      warrantyMonths: 18,
      compatible: "Toyota Vios (2018 - 2023)",
      tab: "WHOLESALE",
    },
    {
      id: "5",
      slug: "bo-ma-phanh-truoc-denso-japan-04465-0d150",
      oem: "08880-83389",
      name: "Dầu Động Cơ Motul 8100 X-cess Gen2 5W-40 (4L)",
      brand: "Motul France",
      grade: "AFTERMARKET",
      price: 950000,
      originalPrice: 1150000,
      warrantyMonths: 6,
      compatible: "Động cơ xăng & diesel phổ thông",
      tab: "MAINTENANCE",
    },
    {
      id: "6",
      slug: "bo-ma-phanh-truoc-denso-japan-04465-0d150",
      oem: "88310-0D330",
      name: "Lốc Lạnh Máy Nén Điều Hòa Denso 10S11C Chuẩn Hãng",
      brand: "Denso Japan",
      grade: "OEM",
      price: 4850000,
      originalPrice: 5600000,
      warrantyMonths: 18,
      compatible: "Toyota Vios, Yaris (2018 - 2022)",
      tab: "WHOLESALE",
    },
  ];

  // Convert API products when available
  const displayList: DisplayProduct[] =
    apiProducts && apiProducts.length > 0
      ? apiProducts.map((p, idx) => ({
          id: p.id,
          slug: p.slug,
          oem: p.oem_number,
          name: p.name,
          brand: p.brand_name || "OEM Parts",
          grade: p.grade === "OEM_GENUINE" ? "OEM" : p.grade === "AFTERMARKET_PREMIUM" ? "AFTERMARKET" : "GENUINE",
          price: p.retail_price,
          originalPrice: Math.round(p.retail_price * 1.22),
          warrantyMonths: p.warranty_months,
          compatible: "Toyota Vios, Corolla Cross, City, Mazda 3",
          tab: idx % 3 === 0 ? "COMPATIBLE" : idx % 3 === 1 ? "MAINTENANCE" : "WHOLESALE",
        }))
      : sampleProducts;

  const formatVnd = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
  };

  const filtered = displayList.filter((p) => {
    if (activeTab === "COMPATIBLE") return true;
    return p.tab === activeTab;
  });

  return (
    <section>
      <div className="mb-5 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            {dict.featured.title}
          </h2>
          <p className="text-xs text-slate-500">
            {dict.featured.subtitle}
          </p>
        </div>

        {/* Product Filter Tabs */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("COMPATIBLE")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === "COMPATIBLE"
                ? "bg-sky-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            Chuẩn xe đang chọn
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("MAINTENANCE")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === "MAINTENANCE"
                ? "bg-sky-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            Bảo dưỡng định kỳ
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("WHOLESALE")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === "WHOLESALE"
                ? "bg-sky-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            Bán chạy cho Gara
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between hover:border-sky-500 hover:shadow-md transition shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    p.grade === "GENUINE"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : p.grade === "OEM"
                      ? "bg-sky-50 text-sky-700 border border-sky-200"
                      : "bg-slate-100 text-slate-700 border border-slate-200"
                  }`}
                >
                  {p.grade === "GENUINE"
                    ? dict.featured.genuine
                    : p.grade === "OEM"
                    ? dict.featured.oem
                    : "Aftermarket"}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  OEM: {p.oem}
                </span>
              </div>

              <Link href={`/phu-tung/${p.slug}`}>
                <h3 className="font-bold text-slate-900 text-sm mb-1 leading-snug line-clamp-2 hover:text-sky-600 transition">
                  {p.name}
                </h3>
              </Link>

              <span className="text-xs text-slate-500 block mb-2 font-medium">
                {p.brand}
              </span>

              <div className="text-[11px] text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  <span className="truncate">
                    {dict.featured.compatible.replace("{vehicles}", p.compatible)}
                  </span>
                </div>
                <div className="text-slate-500 text-[10px]">
                  {dict.featured.warranty.replace("{months}", p.warrantyMonths.toString())}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-base font-black text-sky-700">
                  {formatVnd(p.price)}
                </span>
                <span className="text-xs text-slate-400 line-through">
                  {formatVnd(p.originalPrice)}
                </span>
              </div>

              <button
                type="button"
                onClick={onAddToCart}
                className="w-full min-h-[42px] bg-slate-900 hover:bg-sky-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs active:scale-[0.98]"
              >
                <PackageCheck className="h-4 w-4" />
                <span>{dict.featured.addToCart}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
