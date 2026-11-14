"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Car,
  User as UserIcon,
  ShoppingBag,
  QrCode,
  Wrench,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Building2,
  ShieldCheck,
  Calendar,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import { useAuth } from "@/features/auth/useAuth";
import { useCart } from "@/features/cart/useCart";
import { catalogApi, UserVehicle } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

type TabKey = "garage" | "profile" | "orders" | "maintenance";

// HoSoPage renders full-featured member profile, garage vehicle manager, and warranty tracker.
export default function HoSoPage() {
  const dict = getDictionary("vi");
  const router = useRouter();
  const { user, fetchUser, logout, isLoading } = useAuth();
  const { cartCount } = useCart();

  const [activeTab, setActiveTab] = useState<TabKey>("garage");
  const [vehicles, setVehicles] = useState<UserVehicle[]>([]);
  const [activeCarFilter, setActiveCarFilter] = useState<string>("Toyota Vios (2018-2022) 1.5L");
  const [isAddingCar, setIsAddingCar] = useState(false);
  const [carMessage, setCarMessage] = useState<string | null>(null);

  // Form state for adding new vehicle
  const [make, setMake] = useState("Toyota");
  const [model, setModel] = useState("Vios");
  const [year, setYear] = useState(2021);
  const [engine, setEngine] = useState("1.5L 2NR-FE (Xăng)");
  const [licensePlate, setLicensePlate] = useState("");
  const [vin, setVin] = useState("");
  const [nickname, setNickname] = useState("");

  // Search states for header
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("ALL");

  useEffect(() => {
    fetchUser();
    loadGarageVehicles();
  }, [fetchUser]);

  // loadGarageVehicles pulls cars from backend when authenticated or falls back to localStorage.
  const loadGarageVehicles = async () => {
    try {
      const res = await catalogApi.getUserVehicles();
      if (res?.vehicles && res.vehicles.length > 0) {
        setVehicles(res.vehicles);
        const def = res.vehicles.find((v) => v.is_default) || res.vehicles[0];
        setActiveCarFilter(`${def.make} ${def.model} (${def.year}) ${def.engine}`);
        return;
      }
    } catch {
      // Fallback to local storage for guests or offline mode
    }

    const saved = localStorage.getItem("kv_garage_vehicles");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setVehicles(parsed);
      } catch {
        // Ignore JSON error
      }
    } else {
      const initial: UserVehicle[] = [
        {
          id: "local-1",
          user_id: "guest",
          make: "Toyota",
          model: "Vios",
          year: 2021,
          engine: "1.5L 2NR-FE (Xăng)",
          license_plate: "51K-886.92",
          vin: "RL4BA12E0J1234567",
          nickname: "Xe cá nhân đi làm",
          is_default: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
      setVehicles(initial);
      localStorage.setItem("kv_garage_vehicles", JSON.stringify(initial));
    }
  };

  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarMessage(null);

    const payload = {
      make,
      model,
      year: Number(year),
      engine,
      license_plate: licensePlate.trim() || undefined,
      vin: vin.trim().toUpperCase() || undefined,
      nickname: nickname.trim() || undefined,
      is_default: vehicles.length === 0,
    };

    try {
      if (user) {
        const res = await catalogApi.addUserVehicle(payload);
        setVehicles((prev) => [res.vehicle, ...prev]);
      } else {
        const newCar: UserVehicle = {
          id: `local-${Date.now()}`,
          user_id: "guest",
          ...payload,
          is_default: vehicles.length === 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        const updated = [newCar, ...vehicles];
        setVehicles(updated);
        localStorage.setItem("kv_garage_vehicles", JSON.stringify(updated));
      }

      setCarMessage(dict.hoSoPage.savedSuccess);
      setIsAddingCar(false);
      setLicensePlate("");
      setVin("");
      setNickname("");
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? String(err.message) : "Lỗi lưu xe";
      setCarMessage(msg);
    }
  };

  const handleDeleteCar = async (id: string) => {
    try {
      if (user && !id.startsWith("local-")) {
        await catalogApi.deleteUserVehicle(id);
      }
      const updated = vehicles.filter((v) => v.id !== id);
      setVehicles(updated);
      localStorage.setItem("kv_garage_vehicles", JSON.stringify(updated));
    } catch {
      // Ignore deletion failure
    }
  };

  const handleSelectActiveCar = async (car: UserVehicle) => {
    const formatted = `${car.make} ${car.model} (${car.year}) ${car.engine}`;
    setActiveCarFilter(formatted);
    localStorage.setItem("kv_active_car_filter", formatted);

    if (user && !car.id.startsWith("local-")) {
      try {
        await catalogApi.setDefaultUserVehicle(car.id);
      } catch {
        // Fallback gracefully
      }
    }

    const updated = vehicles.map((v) => ({
      ...v,
      is_default: v.id === car.id,
    }));
    setVehicles(updated);
    localStorage.setItem("kv_garage_vehicles", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col pb-20 md:pb-12">
      <Header
        dict={dict}
        user={user}
        isLoading={isLoading}
        logout={logout}
        activeCarFilter={activeCarFilter}
        onOpenProfile={() => setActiveTab("profile")}
        cartCount={cartCount}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchCategory={searchCategory}
        setSearchCategory={setSearchCategory}
      />

      <main className="flex-1 mx-auto w-full max-w-[1560px] px-4 sm:px-8 xl:px-12 py-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-sky-600 transition">
            {dict.nav.home}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-semibold text-slate-900">{dict.hoSoPage.title}</span>
        </div>

        {/* Member Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 mb-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-sky-600 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-sm">
                {user ? user.full_name.slice(0, 2).toUpperCase() : "KV"}
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                    {user ? user.full_name : "Khách Hàng Khách Vãng Lai"}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-200">
                    {user?.role === "GARAGE" ? "Gara Đối Tác (B2B)" : "Chủ Xe Cá Nhân (B2C)"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {user ? user.email : "Đăng nhập tài khoản để đồng bộ xe lên đám mây và nhận giá sỉ đối tác."}
                </p>
              </div>
            </div>

            {!user && (
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/dang-nhap"
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-300 hover:border-sky-600 text-slate-800 transition"
                >
                  {dict.nav.login}
                </Link>
                <Link
                  href="/dang-ky"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-sky-600 hover:bg-sky-500 text-white transition shadow-sm"
                >
                  {dict.nav.register}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Layout with Bento Tabs Sidebar and Content Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation Tab Buttons */}
          <div className="lg:col-span-1 space-y-2">
            <button
              type="button"
              onClick={() => setActiveTab("garage")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition text-left ${
                activeTab === "garage"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "bg-white hover:bg-slate-100 border border-slate-200 text-slate-700"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Car className="h-4 w-4" />
                <span>{dict.hoSoPage.tabGarage}</span>
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                activeTab === "garage" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
              }`}>
                {vehicles.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition text-left ${
                activeTab === "profile"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "bg-white hover:bg-slate-100 border border-slate-200 text-slate-700"
              }`}
            >
              <UserIcon className="h-4 w-4" />
              <span>{dict.hoSoPage.tabProfile}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition text-left ${
                activeTab === "orders"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "bg-white hover:bg-slate-100 border border-slate-200 text-slate-700"
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>{dict.hoSoPage.tabOrders}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("maintenance")}
              className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition text-left ${
                activeTab === "maintenance"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "bg-white hover:bg-slate-100 border border-slate-200 text-slate-700"
              }`}
            >
              <Wrench className="h-4 w-4" />
              <span>Sổ Tay Bảo Dưỡng</span>
            </button>
          </div>

          {/* Active Tab Content Panel */}
          <div className="lg:col-span-3">
            {/* TAB 1: GARAGE CỦA TÔI */}
            {activeTab === "garage" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900">
                        {dict.hoSoPage.tabGarage}
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {dict.hoSoPage.garageIntro}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsAddingCar(!isAddingCar)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shrink-0 shadow-sm"
                    >
                      <Plus className="h-4 w-4" />
                      <span>{dict.hoSoPage.addNewCar}</span>
                    </button>
                  </div>

                  {carMessage && (
                    <div className="mt-4 p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-xs font-medium flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-sky-600 shrink-0" />
                      <span>{carMessage}</span>
                    </div>
                  )}

                  {/* Add New Car Form Card */}
                  {isAddingCar && (
                    <form onSubmit={handleSaveCar} className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-sky-600" />
                        <span>{dict.hoSoPage.addNewCar}</span>
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">{dict.hoSoPage.year}</label>
                          <input
                            type="number"
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            min={1990}
                            max={2026}
                            required
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold focus:border-sky-600 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">{dict.hoSoPage.make}</label>
                          <select
                            value={make}
                            onChange={(e) => setMake(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold focus:border-sky-600 outline-none"
                          >
                            <option value="Toyota">Toyota</option>
                            <option value="Honda">Honda</option>
                            <option value="Mazda">Mazda</option>
                            <option value="Hyundai">Hyundai</option>
                            <option value="Kia">Kia</option>
                            <option value="Ford">Ford</option>
                            <option value="Mitsubishi">Mitsubishi</option>
                            <option value="Mercedes-Benz">Mercedes-Benz</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">{dict.hoSoPage.model}</label>
                          <input
                            type="text"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            placeholder="Vios / City / Ranger..."
                            required
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold focus:border-sky-600 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">{dict.hoSoPage.engine}</label>
                          <input
                            type="text"
                            value={engine}
                            onChange={(e) => setEngine(e.target.value)}
                            placeholder="1.5L 2NR-FE"
                            required
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold focus:border-sky-600 outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">{dict.hoSoPage.licensePlate}</label>
                          <input
                            type="text"
                            value={licensePlate}
                            onChange={(e) => setLicensePlate(e.target.value)}
                            placeholder="VD: 51H-123.45"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold focus:border-sky-600 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">{dict.hoSoPage.vinNumber}</label>
                          <input
                            type="text"
                            value={vin}
                            onChange={(e) => setVin(e.target.value)}
                            maxLength={17}
                            placeholder="17 ký tự số khung"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold focus:border-sky-600 outline-none uppercase font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Gợi nhớ / Tên gọi xe</label>
                          <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder="Xe gia đình / Xe chạy dịch vụ"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold focus:border-sky-600 outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingCar(false)}
                          className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 transition"
                        >
                          {dict.hoSoPage.cancel}
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-sm"
                        >
                          {dict.hoSoPage.saveCar}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* List of Saved Vehicles */}
                  <div className="mt-6 space-y-4">
                    {vehicles.map((car) => {
                      const isActive = activeCarFilter.includes(car.make) && activeCarFilter.includes(car.model);
                      return (
                        <div
                          key={car.id}
                          className={`p-4 sm:p-5 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                            isActive
                              ? "bg-sky-50/70 border-sky-300 shadow-xs"
                              : "bg-white hover:bg-slate-50 border-slate-200"
                          }`}
                        >
                          <div className="flex items-start gap-3.5">
                            <div className={`p-3 rounded-xl shrink-0 ${isActive ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-700"}`}>
                              <Car className="h-6 w-6" />
                            </div>

                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="text-sm sm:text-base font-bold text-slate-900">
                                  {car.make} {car.model} ({car.year}) {car.engine}
                                </h4>
                                {isActive && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-600 text-white">
                                    {dict.hoSoPage.activeFiltering}
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                                {car.license_plate && (
                                  <span>
                                    Biển số: <strong className="text-slate-800">{car.license_plate}</strong>
                                  </span>
                                )}
                                {car.vin && (
                                  <span className="font-mono">
                                    VIN: <strong className="text-slate-800">{car.vin}</strong>
                                  </span>
                                )}
                                {car.nickname && (
                                  <span className="italic text-slate-600">({car.nickname})</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                            {!isActive ? (
                              <button
                                type="button"
                                onClick={() => handleSelectActiveCar(car)}
                                className="px-3.5 py-1.5 rounded-xl border border-sky-300 bg-white hover:bg-sky-50 text-sky-700 text-xs font-bold transition shadow-2xs"
                              >
                                {dict.hoSoPage.applyToFilter}
                              </button>
                            ) : (
                              <Link
                                href="/"
                                className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-sm"
                              >
                                Tra cứu phụ tùng xe này
                              </Link>
                            )}

                            <button
                              type="button"
                              onClick={() => handleDeleteCar(car.id)}
                              title={dict.hoSoPage.deleteCar}
                              className="h-8 w-8 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: THÔNG TIN TÀI KHOẢN */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-6">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">{dict.hoSoPage.tabProfile}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{dict.hoSoPage.personalIntro}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{dict.auth.fullNameLabel}</label>
                    <input
                      type="text"
                      readOnly
                      value={user?.full_name || "Nguyễn Văn Khách"}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{dict.auth.emailLabel}</label>
                    <input
                      type="email"
                      readOnly
                      value={user?.email || "khachhang@autoparts.store"}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{dict.auth.phoneLabel}</label>
                    <input
                      type="text"
                      readOnly
                      value={user?.phone || "097 3333 217"}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Cấp độ tài khoản</label>
                    <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-sky-700">
                      {user?.role === "GARAGE" ? (
                        <>
                          <Building2 className="h-4 w-4 text-amber-600" />
                          <span>Gara Sửa Chữa Đối Tác (B2B) - Chiết khấu 15-25%</span>
                        </>
                      ) : (
                        <>
                          <UserIcon className="h-4 w-4 text-sky-600" />
                          <span>Chủ Xe Cá Nhân (B2C) - Bảo hành chính hãng 12T</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{dict.hoSoPage.address}</label>
                  <textarea
                    rows={3}
                    placeholder="Nhập địa chỉ nhà riêng hoặc địa chỉ gara nhận phụ tùng hỏa tốc..."
                    defaultValue="Số 467 An Dương Vương, Phường Chợ Quán, Quận 5, TP. Hồ Chí Minh"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:border-sky-600 outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-sm"
                  >
                    {dict.hoSoPage.saveProfile}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: ĐƠN HÀNG & BẢO HÀNH QR */}
            {activeTab === "orders" && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-6">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">{dict.hoSoPage.tabOrders}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mỗi chi tiết phụ tùng đều tích hợp mã QR chống hàng giả và kích hoạt bảo hành điện tử.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/60">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-sky-700">#ORD-2026-9812</span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500">14/11/2026</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Đã Giao Thành Công
                      </span>
                    </div>

                    <div className="py-3 text-xs text-slate-800 font-medium space-y-1">
                      <p className="flex justify-between">
                        <span>2x Bộ má phanh trước Denso Japan (04465-0D150)</span>
                        <span className="font-bold">900.000 đ</span>
                      </p>
                      <p className="flex justify-between text-slate-500 text-[11px]">
                        <span>4x Bugi Iridium Denso SC20HR11</span>
                        <span className="font-bold text-slate-700">880.000 đ</span>
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        Tổng thanh toán: <strong className="text-sky-600 text-sm">1.780.000 đ</strong>
                      </span>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold transition"
                      >
                        <QrCode className="h-3.5 w-3.5 text-sky-600" />
                        <span>Xem Tem Bảo Hành QR</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: SỔ TAY BẢO DƯỠNG */}
            {activeTab === "maintenance" && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-6">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">Sổ Tay Bảo Dưỡng Ô Tô Định Kỳ</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Lịch trình khuyến nghị bảo dưỡng các cơ cấu phụ tùng hao mòn theo số km vận hành.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-sky-200 bg-sky-50/50">
                    <div className="flex items-center gap-2 text-sky-700 font-bold text-xs mb-2">
                      <Calendar className="h-4 w-4" />
                      <span>Cấp 1: Mỗi 5.000 KM</span>
                    </div>
                    <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                      <li>Thay dầu nhớt động cơ Motul / Castrol 5W-30</li>
                      <li>Vệ sinh lọc gió động cơ & lọc gió máy lạnh</li>
                      <li>Kiểm tra áp suất lốp & siết ốc bánh xe</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-2">
                      <Calendar className="h-4 w-4" />
                      <span>Cấp 2: Mỗi 10.000 KM</span>
                    </div>
                    <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                      <li>Thay lọc nhớt động cơ Denso / Bosch</li>
                      <li>Đảo lốp xe ô tô 4 bánh</li>
                      <li>Kiểm tra độ dày má phanh trước và sau</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/50">
                    <div className="flex items-center gap-2 text-amber-800 font-bold text-xs mb-2">
                      <Calendar className="h-4 w-4" />
                      <span>Cấp 3: Mỗi 20.000 KM - 40.000 KM</span>
                    </div>
                    <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                      <li>Thay lọc gió động cơ mới</li>
                      <li>Thay dầu phanh DOT4 & dầu trợ lực lái</li>
                      <li>Kiểm tra hệ thống gầm rô-tuyn càng A</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50/50">
                    <div className="flex items-center gap-2 text-purple-800 font-bold text-xs mb-2">
                      <Calendar className="h-4 w-4" />
                      <span>Cấp 4: Mỗi 80.000 KM - 100.000 KM</span>
                    </div>
                    <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                      <li>Thay bộ 4 bugi Iridium chân dài Denso</li>
                      <li>Thay dây curoa tổng Gates & nước làm mát đỏ</li>
                      <li>Thay dầu hộp số tự động CVT / AT</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer dict={dict} />
      <MobileBottomNav
        dict={dict}
        user={user}
        cartCount={cartCount}
        onOpenProfile={() => setActiveTab("profile")}
      />
    </div>
  );
}
