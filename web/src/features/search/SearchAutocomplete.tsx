"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Search, ChevronRight, Package, ArrowRight, Tag } from "lucide-react";
import type { getDictionary } from "@/lib/i18n";

export interface AutocompleteItem {
  slug: string;
  name: string;
  oem: string;
  brand: string;
  price: number;
  category: string;
}

const CATALOG_INDEX: AutocompleteItem[] = [
  {
    slug: "bo-ma-phanh-truoc-denso-japan-04465-0d150",
    name: "Bộ má phanh trước Denso Japan chuẩn OEM",
    oem: "04465-0D150",
    brand: "Denso Japan",
    price: 450000,
    category: "Phanh - Thắng",
  },
  {
    slug: "loc-dau-dong-co-toyota-vios-yaris-90915-yzze1",
    name: "Lọc dầu nhớt động cơ Toyota Vios Yaris",
    oem: "90915-YZZE1",
    brand: "Toyota Genuine",
    price: 95000,
    category: "Bảo Dưỡng Nhanh",
  },
  {
    slug: "bugi-iridium-chan-dai-denso-sc20hr11",
    name: "Bugi Iridium chân dài Denso SC20HR11",
    oem: "90919-01253",
    brand: "Denso Japan",
    price: 220000,
    category: "Hệ Thống Đánh Lửa",
  },
  {
    slug: "cap-phuoc-nhun-giam-xoc-truoc-kyb-excel-g",
    name: "Cặp phuộc nhún giảm xóc trước KYB Excel-G",
    oem: "48510-0D590",
    brand: "KYB Japan",
    price: 1650000,
    category: "Hệ Thống Gầm",
  },
  {
    slug: "loc-lanh-dieu-hoa-denso-10s11c-chuan-hang",
    name: "Lốc lạnh điều hòa Denso 10S11C chuẩn hãng",
    oem: "88310-0D330",
    brand: "Denso Japan",
    price: 4100000,
    category: "Điều Hòa - Làm Mát",
  },
  {
    slug: "loc-gio-dong-co-cao-cap-bosch-toyota-vios",
    name: "Lọc gió động cơ cao cấp Bosch Toyota Vios",
    oem: "17801-0Y040",
    brand: "Bosch Germany",
    price: 180000,
    category: "Lọc Gió - Lọc Khí",
  },
];

interface SearchAutocompleteProps {
  query: string;
  isOpen: boolean;
  onClose: () => void;
  dict: ReturnType<typeof getDictionary>;
}

// SearchAutocomplete renders instant search results, OEM number matching, and category shortcuts.
export default function SearchAutocomplete({
  query,
  isOpen,
  onClose,
  dict,
}: SearchAutocompleteProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sdict = dict.searchAutocomplete;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || query.trim().length < 2) return null;

  const q = query.toLowerCase().trim();
  const matched = CATALOG_INDEX.filter((item) => {
    return (
      item.name.toLowerCase().includes(q) ||
      item.oem.toLowerCase().includes(q) ||
      item.brand.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  }).slice(0, 4);

  const formatVnd = (amount: number) =>
    new Intl.NumberFormat("vi-VN").format(amount) + " đ";

  return (
    <div
      ref={containerRef}
      className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200/90 shadow-2xl overflow-hidden z-50 animate-in fade-in duration-150"
    >
      <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-bold uppercase tracking-wider">
        <span>{sdict.suggestedParts}</span>
        <span className="font-normal lowercase font-mono">"{query}"</span>
      </div>

      {matched.length > 0 ? (
        <div className="divide-y divide-slate-100">
          {matched.map((item) => (
            <Link
              key={item.slug}
              href={`/phu-tung/${item.slug}`}
              onClick={onClose}
              className="flex items-center justify-between p-3 hover:bg-sky-50/60 transition group"
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="h-9 w-9 rounded-xl bg-slate-100 group-hover:bg-sky-100 text-slate-600 group-hover:text-sky-700 flex items-center justify-center shrink-0 transition">
                  <Package className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-sky-700 truncate">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium mt-0.5">
                    <span className="font-mono text-sky-700 font-bold bg-sky-50 px-1 rounded">
                      OEM: {item.oem}
                    </span>
                    <span>•</span>
                    <span>{item.brand}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-black text-slate-900 block">
                  {formatVnd(item.price)}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {item.category}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center text-xs text-slate-500">
          <p>{sdict.noResults}</p>
          <p className="text-[11px] text-slate-400 mt-1">{sdict.pressEnter}</p>
        </div>
      )}

      {/* Footer link to all search results */}
      <Link
        href={`/phu-tung?q=${encodeURIComponent(query)}`}
        onClick={onClose}
        className="block px-4 py-2.5 bg-slate-50 hover:bg-sky-50 text-sky-700 text-xs font-bold transition text-center border-t border-slate-100"
      >
        <span className="inline-flex items-center gap-1.5">
          <span>{sdict.viewAll} "{query}"</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </Link>
    </div>
  );
}
