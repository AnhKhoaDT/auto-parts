"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ChevronRight,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Car,
  Search,
  Camera,
  AlertTriangle,
  Building2,
  FileCheck2,
  Sparkles,
  Phone,
  RotateCcw,
  Gauge,
  Calendar,
  Check,
} from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import { useAuth } from "@/features/auth/useAuth";
import { useCart } from "@/features/cart/useCart";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

interface WarrantyRecord {
  code: string;
  orderCode: string;
  partName: string;
  oemNumber: string;
  sku: string;
  brand: string;
  grade: "OEM_GENUINE" | "GENUINE" | "AFTERMARKET_PREMIUM";
  status: "ACTIVE" | "PENDING" | "EXPIRED";
  purchaseDate: string;
  warrantyMonths: number;
  activationDate?: string;
  expirationDate?: string;
  vehicleMakeModel?: string;
  licensePlate?: string;
  vin?: string;
  odometer?: string;
  installedGarage?: string;
}

const INITIAL_WARRANTY_DB: WarrantyRecord[] = [
  {
    code: "KV-WAR-2026-04465",
    orderCode: "ORD-2026-9812",
    partName: "Bộ Má Phanh Trước Denso Japan Chuẩn OEM",
    oemNumber: "04465-0D150",
    sku: "BRK-DEN-04465",
    brand: "Denso Japan (Nhật Bản)",
    grade: "OEM_GENUINE",
    status: "ACTIVE",
    purchaseDate: "14/11/2026",
    warrantyMonths: 12,
    activationDate: "14/11/2026",
    expirationDate: "14/11/2027",
    vehicleMakeModel: "Toyota Vios 1.5L (2021)",
    licensePlate: "51K-982.15",
    vin: "RL4BA12E0J1234567",
    odometer: "42.500 km",
    installedGarage: "Gara AutoCare Tân Bình (Đối tác KV)",
  },
  {
    code: "KV-WAR-2026-SC20HR11",
    orderCode: "ORD-2026-9812",
    partName: "Bugi Iridium Chân Dài Denso SC20HR11",
    oemNumber: "90919-01253",
    sku: "ENG-DEN-SC20HR11",
    brand: "Denso Japan (Nhật Bản)",
    grade: "OEM_GENUINE",
    status: "ACTIVE",
    purchaseDate: "14/11/2026",
    warrantyMonths: 24,
    activationDate: "14/11/2026",
    expirationDate: "14/11/2028",
    vehicleMakeModel: "Toyota Vios 1.5L (2021)",
    licensePlate: "51K-982.15",
    vin: "RL4BA12E0J1234567",
    odometer: "42.500 km",
    installedGarage: "Gara AutoCare Tân Bình (Đối tác KV)",
  },
  {
    code: "KV-WAR-2026-NEW",
    orderCode: "KV-2026-8899",
    partName: "Lốc Lạnh Máy Nén Điều Hòa Denso 10S11C Chuẩn Hãng",
    oemNumber: "88310-0D330",
    sku: "ELE-DEN-10S11C",
    brand: "Denso Japan (Nhật Bản)",
    grade: "OEM_GENUINE",
    status: "PENDING",
    purchaseDate: "15/11/2026",
    warrantyMonths: 18,
  },
];

function WarrantyContent() {
  const dict = getDictionary("vi");
  const wp = dict.warranty;
  const router = useRouter();
  const searchParams = useSearchParams();

  const { user, fetchUser, logout, isLoading: authLoading } = useAuth();
  const { cartCount } = useCart();

  const initialCode = searchParams.get("code") || searchParams.get("order") || "KV-WAR-2026-04465";

  const [searchInput, setSearchInput] = useState(initialCode);
  const [activeRecord, setActiveRecord] = useState<WarrantyRecord | null>(null);
  const [hasSearched, setHasSearched] = useState(true);
  const [records, setRecords] = useState<WarrantyRecord[]>(INITIAL_WARRANTY_DB);

  // Form states for activating warranty
  const [actLicensePlate, setActLicensePlate] = useState("");
  const [actOdometer, setActOdometer] = useState("");
  const [actGarage, setActGarage] = useState("");
  const [isActivating, setIsActivating] = useState(false);
  const [activateSuccess, setActivateSuccess] = useState(false);

  // Header states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("ALL");
  const [activeCarFilter, setActiveCarFilter] = useState<string>("");

  useEffect(() => {
    fetchUser();
    const saved = localStorage.getItem("kv_active_car_filter");
    if (saved) setActiveCarFilter(saved);

    // Initial search
    performSearch(initialCode);
  }, [fetchUser, initialCode]);

  const performSearch = (codeToSearch: string) => {
    const term = codeToSearch.trim().toLowerCase();
    if (!term) return;

    const found = records.find(
      (r) =>
        r.code.toLowerCase() === term ||
        r.orderCode.toLowerCase() === term ||
        r.oemNumber.toLowerCase() === term ||
        (r.licensePlate && r.licensePlate.toLowerCase() === term)
    );

    setActiveRecord(found || null);
    setHasSearched(true);
    setActivateSuccess(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchInput);
  };

  const handleActivateWarranty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRecord) return;

    setIsActivating(true);
    setTimeout(() => {
      const now = new Date();
      const activationStr = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
      const expDate = new Date(now);
      expDate.setMonth(expDate.getMonth() + activeRecord.warrantyMonths);
      const expirationStr = `${expDate.getDate()}/${expDate.getMonth() + 1}/${expDate.getFullYear()}`;

      const updatedRecord: WarrantyRecord = {
        ...activeRecord,
        status: "ACTIVE",
        activationDate: activationStr,
        expirationDate: expirationStr,
        licensePlate: actLicensePlate.trim() || "Chưa nhập biển số",
        odometer: actOdometer.trim() || "0 km",
        installedGarage: actGarage.trim() || "Gara đối tác KV",
        vehicleMakeModel: activeCarFilter || "Xe thành viên KV",
      };

      const updatedList = records.map((r) =>
        r.code === activeRecord.code ? updatedRecord : r
      );
      setRecords(updatedList);
      setActiveRecord(updatedRecord);
      setIsActivating(false);
      setActivateSuccess(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Header
        dict={dict}
        user={user}
        isLoading={authLoading}
        logout={logout}
        activeCarFilter={activeCarFilter}
        onOpenProfile={() => router.push("/ho-so")}
        cartCount={cartCount}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchCategory={searchCategory}
        setSearchCategory={setSearchCategory}
      />

      <main className="flex-1 mx-auto max-w-[1560px] w-full px-4 sm:px-8 xl:px-12 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
          <Link href="/" className="hover:text-sky-600 transition">
            {wp.breadcrumbHome}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-semibold text-slate-900">{wp.breadcrumbWarranty}</span>
        </div>

        {/* Page Header */}
        <div className="mb-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="max-w-2xl">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <QrCode className="h-6 w-6 text-sky-600" />
              <span>{wp.title}</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">{wp.subtitle}</p>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="mt-5 max-w-xl">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={wp.inputPlaceholder}
                  className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>
              <button
                type="submit"
                className="px-5 h-11 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition shadow-sm shrink-0 flex items-center gap-2"
              >
                <span>{wp.btnSearch}</span>
              </button>
            </div>

            {/* Quick sample chips */}
            <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px] text-slate-500">
              <span className="font-semibold">{wp.sampleCodes}</span>
              <button
                type="button"
                onClick={() => {
                  setSearchInput("KV-WAR-2026-04465");
                  performSearch("KV-WAR-2026-04465");
                }}
                className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-sky-50 hover:text-sky-600 font-mono transition"
              >
                KV-WAR-2026-04465 (Đang bảo hành)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchInput("KV-WAR-2026-NEW");
                  performSearch("KV-WAR-2026-NEW");
                }}
                className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-sky-50 hover:text-sky-600 font-mono transition"
              >
                KV-WAR-2026-NEW (Chưa kích hoạt)
              </button>
            </div>
          </form>
        </div>

        {/* Content Section: Warranty Card & Details */}
        {hasSearched && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {activeRecord ? (
              <>
                {/* Left Column: Official Electronic Warranty Card (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Holographic Card Container */}
                  <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
                    {/* Anti-counterfeiting decorative mesh */}
                    <div className="absolute -right-12 -top-12 w-48 h-48 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

                    {/* Card Top: KV Brand & Status Badge */}
                    <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sky-400 text-sm tracking-wider">
                            {wp.cardCompany}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block tracking-widest uppercase mt-0.5">
                          {wp.cardTitle}
                        </span>
                      </div>

                      {activeRecord.status === "ACTIVE" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          <span>{wp.statusActive}</span>
                        </span>
                      ) : activeRecord.status === "PENDING" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-400 border border-amber-500/40">
                          <Clock className="h-3.5 w-3.5 text-amber-400" />
                          <span>{wp.statusPending}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-400 border border-rose-500/40">
                          <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                          <span>{wp.statusExpired}</span>
                        </span>
                      )}
                    </div>

                    {/* Card Body: Part & Code */}
                    <div className="my-6 space-y-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                          {wp.partName}
                        </span>
                        <h2 className="text-base sm:text-lg font-black text-white mt-0.5">
                          {activeRecord.partName}
                        </h2>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block">{wp.oemNumber}</span>
                          <span className="font-mono font-bold text-sky-300">
                            {activeRecord.oemNumber}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">{wp.brand}</span>
                          <span className="font-bold text-slate-200">{activeRecord.brand}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">{wp.warrantyPeriod}</span>
                          <span className="font-bold text-emerald-400">
                            {activeRecord.warrantyMonths} Tháng
                          </span>
                        </div>
                      </div>

                      {/* Vehicle & Installation info */}
                      {activeRecord.status === "ACTIVE" && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 block">
                              {wp.licensePlate}
                            </span>
                            <span className="font-bold text-white">
                              {activeRecord.licensePlate || "N/A"}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">{wp.odometer}</span>
                            <span className="font-bold text-white">
                              {activeRecord.odometer || "N/A"}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">
                              Hạn bảo hành đến
                            </span>
                            <span className="font-bold text-amber-400">
                              {activeRecord.expirationDate || "N/A"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Footer: Dual QR Code representation & Serial */}
                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">
                          Mã tem bảo hành (Serial)
                        </span>
                        <span className="font-mono font-black text-sky-400 text-xs sm:text-sm">
                          {activeRecord.code}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-white text-slate-900">
                          <QrCode className="h-7 w-7" />
                        </div>
                        <span className="text-[9px] text-slate-400 max-w-[120px] leading-tight hidden sm:block">
                          {wp.cardSecurityNote}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Form to Activate Warranty if PENDING */}
                  {activeRecord.status === "PENDING" && (
                    <div className="bg-white border-2 border-amber-300 rounded-3xl p-6 shadow-xs space-y-4">
                      {activateSuccess ? (
                        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
                          <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
                          <h4 className="text-sm font-black text-emerald-900">
                            {wp.activateSuccessTitle}
                          </h4>
                          <p className="text-xs text-emerald-700 leading-relaxed">
                            {wp.activateSuccessDesc}
                          </p>
                        </div>
                      ) : (
                        <form onSubmit={handleActivateWarranty} className="space-y-4">
                          <div>
                            <h3 className="text-sm font-black text-slate-900">
                              {wp.activateSectionTitle}
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {wp.activateSubtitle}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">
                                {wp.inputLicensePlate} <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                value={actLicensePlate}
                                onChange={(e) => setActLicensePlate(e.target.value)}
                                placeholder={wp.inputLicensePlatePlaceholder}
                                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">
                                {wp.inputOdometer}
                              </label>
                              <input
                                type="text"
                                value={actOdometer}
                                onChange={(e) => setActOdometer(e.target.value)}
                                placeholder={wp.inputOdometerPlaceholder}
                                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              {wp.inputGarage}
                            </label>
                            <input
                              type="text"
                              value={actGarage}
                              onChange={(e) => setActGarage(e.target.value)}
                              placeholder={wp.inputGaragePlaceholder}
                              className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={isActivating}
                            className="w-full min-h-[44px] rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-50"
                          >
                            {isActivating ? (
                              <span>{wp.activating}</span>
                            ) : (
                              <>
                                <Check className="h-4 w-4" />
                                <span>{wp.btnActivate}</span>
                              </>
                            )}
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Column: Policies & Verification Badges (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
                    <h3 className="text-base font-black text-slate-900 tracking-tight pb-3 border-b border-slate-100 flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-emerald-600" />
                      <span>{wp.policyTitle}</span>
                    </h3>

                    <div className="space-y-3.5 text-xs text-slate-600">
                      <div className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-[10px]">
                          1
                        </div>
                        <p className="leading-snug pt-0.5">{wp.policy1}</p>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 font-bold text-[10px]">
                          2
                        </div>
                        <p className="leading-snug pt-0.5">{wp.policy2}</p>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 font-bold text-[10px]">
                          3
                        </div>
                        <p className="leading-snug pt-0.5">{wp.policy3}</p>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 font-bold text-[10px]">
                          4
                        </div>
                        <p className="leading-snug pt-0.5">{wp.policy4}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 text-xs">
                      <a
                        href="tel:0973333217"
                        className="w-full min-h-[44px] rounded-xl border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold flex items-center justify-center gap-2 transition"
                      >
                        <Phone className="h-4 w-4" />
                        <span>{wp.supportHotline}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Not Found Card */
              <div className="lg:col-span-12 bg-white border border-slate-200 rounded-3xl p-10 sm:p-14 text-center max-w-xl mx-auto shadow-xs">
                <div className="h-16 w-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8" />
                </div>
                <h3 className="text-base font-black text-slate-900 mb-1">
                  {wp.notFoundTitle}
                </h3>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                  {wp.notFoundDesc}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput("KV-WAR-2026-04465");
                      performSearch("KV-WAR-2026-04465");
                    }}
                    className="px-5 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs"
                  >
                    Thử tra mã mẫu KV-WAR-2026-04465
                  </button>
                  <a
                    href="tel:0973333217"
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                  >
                    Gọi tổng đài hỗ trợ
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer dict={dict} />
      <MobileBottomNav
        dict={dict}
        user={user}
        cartCount={cartCount}
        onOpenProfile={() => router.push("/ho-so")}
      />
    </div>
  );
}

export default function WarrantyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <div className="h-10 w-10 rounded-full border-4 border-sky-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <WarrantyContent />
    </Suspense>
  );
}
