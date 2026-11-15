"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Phone,
  MessageSquare,
  ShieldCheck,
  Search,
  Camera,
  Car,
  User as UserIcon,
  LogOut,
  Building2,
  ShoppingBag,
  Layers,
  Sparkles,
} from "lucide-react";
import type { getDictionary } from "@/lib/i18n";
import type { User } from "@/lib/api";
import VinScannerModal from "@/features/vin/VinScannerModal";
import type { DecodedVehicle } from "@/features/vin/vinDecoder";
import FastQuoteModal from "@/features/quote/FastQuoteModal";

interface HeaderProps {
  dict: ReturnType<typeof getDictionary>;
  user: User | null;
  isLoading: boolean;
  logout: () => void;
  activeCarFilter: string;
  onOpenProfile: () => void;
  cartCount: number;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchCategory: string;
  setSearchCategory: (c: string) => void;
}

// Header renders the utility bar, search, and navigation in light industrial theme.
export default function Header({
  dict,
  user,
  isLoading,
  logout,
  activeCarFilter,
  onOpenProfile,
  cartCount,
  searchQuery,
  setSearchQuery,
  searchCategory,
  setSearchCategory,
}: HeaderProps) {
  const router = useRouter();
  const [isVinScannerOpen, setIsVinScannerOpen] = useState(false);
  const [isFastQuoteOpen, setIsFastQuoteOpen] = useState(false);

  const handleApplyVinVehicle = (formatted: string, decoded: DecodedVehicle) => {
    localStorage.setItem("kv_active_car_filter", formatted);
    try {
      const existing = localStorage.getItem("kv_garage_vehicles");
      const list = existing ? JSON.parse(existing) : [];
      const newCar = {
        id: `vin-${Date.now()}`,
        user_id: user?.id || "guest",
        make: decoded.make,
        model: decoded.model,
        year: decoded.year,
        engine: decoded.engine,
        vin: decoded.vin,
        nickname: "Xe tra cứu từ VIN",
        is_default: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      localStorage.setItem("kv_garage_vehicles", JSON.stringify([newCar, ...list]));
    } catch {
      // Ignore JSON error
    }
    router.push(`/phu-tung?vehicle=${encodeURIComponent(formatted)}`);
  };

  return (
    <>
      {/* 01. Top Utility Hotline Bar (Deep Charcoal) */}
      <div className="w-full bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 xl:px-12 border-b border-slate-800">
        <div className="mx-auto max-w-[1560px] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-sky-400 font-bold hover:text-sky-300 transition">
              <Phone className="h-3.5 w-3.5" />
              <span>{dict.topBar.hotline}</span>
            </span>
            <span className="hidden md:flex items-center gap-1 text-emerald-400">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{dict.topBar.zalo}</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="hidden sm:inline text-slate-400">{dict.topBar.workingHours}</span>
            <span className="text-slate-300 flex items-center gap-1 font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-sky-400" />
              <span>{dict.topBar.genuineGuarantee}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 02 & 03: Pinned Sticky Navigation Wrapper */}
      <div className="w-full sticky top-0 z-50 shadow-md bg-white">
        {/* Main Header (Crisp White with Sky Blue accents) */}
        <header className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-[1560px] flex items-center justify-between px-4 sm:px-8 xl:px-12 py-2.5 sm:py-3 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-sky-600 text-white font-black text-sm sm:text-base shadow-sm shrink-0">
              KV
            </span>
            <div>
              <span className="block text-base sm:text-xl font-black tracking-tight text-slate-900 leading-none whitespace-nowrap">
                {dict.brand.name}
                <span className="text-sky-600">{dict.brand.extension}</span>
              </span>
              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider hidden sm:block mt-1">
                {dict.brand.tagline}
              </span>
            </div>
          </Link>

          {/* Mega Search Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                window.location.href = `/phu-tung?q=${encodeURIComponent(searchQuery.trim())}`;
              } else {
                window.location.href = "/phu-tung";
              }
            }}
            className="hidden lg:flex flex-1 max-w-2xl mx-6 items-center rounded-xl bg-slate-50 border-2 border-slate-200 focus-within:border-sky-600 focus-within:bg-white p-1 transition shadow-inner"
          >
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="bg-white text-slate-700 text-xs font-semibold rounded-lg px-2.5 py-1.5 border border-slate-200 outline-none cursor-pointer"
            >
              <option value="ALL">Tất cả nhóm</option>
              <option value="ENGINE">Phụ tùng máy</option>
              <option value="BRAKE">Gầm - Phanh</option>
              <option value="ELECTRICAL">Điện - Lạnh</option>
            </select>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={dict.hero.searchPlaceholder}
              className="w-full min-w-0 px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 bg-transparent outline-none"
            />
            <button
              type="button"
              onClick={() => setIsVinScannerOpen(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-slate-100 transition mr-1"
              title={dict.hero.scanVin}
            >
              <Camera className="h-4 w-4 text-sky-600" />
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              <Search className="h-3.5 w-3.5" />
              <span>{dict.hero.searchAction}</span>
            </button>
          </form>

          {/* Right Actions: My Garage, Profile, Cart */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* My Garage Indicator Link */}
            <Link
              href="/ho-so"
              className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100/70 px-2.5 sm:px-3 py-1.5 text-xs text-sky-800 transition shrink-0"
            >
              <Car className="h-4 w-4 text-sky-600 shrink-0" />
              <div className="text-left hidden sm:block">
                <span className="block text-[9px] uppercase font-bold text-sky-600 leading-none">
                  {dict.profileModal.garageVehicles.split(" ")[0]}
                </span>
                <span className="block text-xs font-bold text-slate-900 max-w-[130px] truncate leading-tight">
                  {activeCarFilter || "Chọn xe của bạn"}
                </span>
              </div>
            </Link>

            {/* User Session Profile Link */}
            {!isLoading && (
              <>
                {user ? (
                  <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                    <Link
                      href="/ho-so"
                      className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/80 py-1 px-2 sm:px-2.5 rounded-xl border border-slate-200 transition shrink-0"
                    >
                      {user.role === "GARAGE" ? (
                        <Building2 className="h-4 w-4 text-amber-600 shrink-0" />
                      ) : (
                        <UserIcon className="h-4 w-4 text-sky-600 shrink-0" />
                      )}
                      <div className="text-left">
                        <span className="hidden sm:block text-xs font-bold text-slate-800 leading-tight max-w-[100px] truncate">
                          {user.full_name}
                        </span>
                        <span className="text-[9px] uppercase font-bold text-sky-700 block leading-tight">
                          {user.role}
                        </span>
                      </div>
                    </Link>
                    <button
                      onClick={logout}
                      title={dict.nav.logout}
                      className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-xl border border-slate-200 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition shrink-0"
                    >
                      <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Link
                      href="/dang-nhap"
                      className="min-h-[36px] px-2.5 sm:px-3 flex items-center text-xs font-bold text-slate-700 hover:text-sky-600 transition"
                    >
                      {dict.nav.login}
                    </Link>
                    <Link
                      href="/dang-ky"
                      className="min-h-[36px] px-3 sm:px-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white shadow-sm flex items-center transition"
                    >
                      {dict.nav.register}
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Cart Trigger */}
            <Link
              href="/gio-hang"
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl border border-slate-200 bg-slate-100 hover:bg-sky-50 hover:border-sky-300 flex items-center justify-center relative text-slate-700 hover:text-sky-600 transition shrink-0"
              title="Giỏ hàng"
            >
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-sky-600 text-[9px] font-black text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* 03. Horizontal Mega Category Bar (Sky Blue Theme) */}
      <nav className="hidden md:block bg-slate-900 border-b border-slate-800 text-xs font-semibold text-slate-200">
        <div className="mx-auto max-w-[1560px] flex items-center justify-between px-4 sm:px-8 xl:px-12 py-2.5">
          <div className="flex items-center gap-6">
            <Link href="/phu-tung" className="flex items-center gap-2 text-sky-400 font-bold hover:text-sky-300 transition">
              <Layers className="h-4 w-4" />
              <span>{dict.megaNav.allCategories}</span>
            </Link>
            <Link href="/phu-tung?category=phu-tung-dong-co" className="hover:text-white transition">
              {dict.megaNav.engine}
            </Link>
            <Link href="/phu-tung?category=he-thong-phanh" className="hover:text-white transition">
              {dict.megaNav.brake}
            </Link>
            <Link href="/phu-tung?category=gam-giam-xoc" className="hover:text-white transition">
              {dict.megaNav.suspension}
            </Link>
            <Link href="/phu-tung?category=dien-dieu-hoa" className="hover:text-white transition">
              {dict.megaNav.cooling}
            </Link>
            <Link href="/phu-tung?category=dau-nhot-phu-gia" className="hover:text-white transition">
              {dict.megaNav.maintenance}
            </Link>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <button
              type="button"
              onClick={() => setIsFastQuoteOpen(true)}
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer transition"
            >
              <Sparkles className="h-3 w-3" />
              <span>{dict.megaNav.wholesalePolicy}</span>
            </button>
            <Link href="/bao-hanh" className="text-slate-400 hover:text-sky-400 transition">
              {dict.megaNav.warrantyCheck}
            </Link>
          </div>
        </div>
      </nav>
      </div>

      <VinScannerModal
        isOpen={isVinScannerOpen}
        onClose={() => setIsVinScannerOpen(false)}
        onSelectVehicle={handleApplyVinVehicle}
        dict={dict}
      />

      <FastQuoteModal
        isOpen={isFastQuoteOpen}
        onClose={() => setIsFastQuoteOpen(false)}
        dict={dict}
        initialCar={activeCarFilter}
      />
    </>
  );
}

