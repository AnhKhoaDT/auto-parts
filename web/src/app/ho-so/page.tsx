"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Car,
  User as UserIcon,
  ShoppingBag,
  Wrench,
  ChevronRight,
} from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import { useAuth } from "@/features/auth/useAuth";
import { useCart } from "@/features/cart/useCart";
import { catalogApi, UserVehicle } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import GarageVehicleTab from "@/features/garage/GarageVehicleTab";
import UserProfileTab from "@/features/garage/UserProfileTab";
import OrdersHistoryTab, { UserOrder } from "@/features/garage/OrdersHistoryTab";
import MaintenanceBookTab from "@/features/garage/MaintenanceBookTab";

type TabKey = "garage" | "profile" | "orders" | "maintenance";

// HoSoPage renders member profile and composes decoupled garage and operations tabs.
export default function HoSoPage() {
  const dict = getDictionary("vi");
  const router = useRouter();
  const { user, fetchUser, logout, isLoading } = useAuth();
  const { cartCount } = useCart();

  const [activeTab, setActiveTab] = useState<TabKey>("garage");
  const [vehicles, setVehicles] = useState<UserVehicle[]>([]);
  const [activeCarFilter, setActiveCarFilter] = useState<string>("Toyota Vios (2018-2022) 1.5L");
  const [userOrders, setUserOrders] = useState<UserOrder[]>([]);

  // Search states for header
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("ALL");

  useEffect(() => {
    fetchUser();
    loadGarageVehicles();
    try {
      const raw = localStorage.getItem("kv_user_orders");
      if (raw) setUserOrders(JSON.parse(raw));
    } catch {
      // Ignore JSON error
    }
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

  const handleAddCar = async (newCar: {
    make: string;
    model: string;
    year: number;
    engine: string;
    license_plate?: string;
    vin?: string;
    nickname?: string;
  }) => {
    const payload = {
      ...newCar,
      is_default: vehicles.length === 0,
    };

    if (user) {
      const res = await catalogApi.addUserVehicle(payload);
      setVehicles((prev) => [res.vehicle, ...prev]);
    } else {
      const carRecord: UserVehicle = {
        id: `local-${Date.now()}`,
        user_id: "guest",
        ...payload,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const updated = [carRecord, ...vehicles];
      setVehicles(updated);
      localStorage.setItem("kv_garage_vehicles", JSON.stringify(updated));
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

  const handleApplyCar = async (carString: string) => {
    setActiveCarFilter(carString);
    localStorage.setItem("kv_active_car_filter", carString);
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
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] ${
                  activeTab === "garage" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
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
            {activeTab === "garage" && (
              <GarageVehicleTab
                dict={dict}
                vehicles={vehicles}
                activeCarFilter={activeCarFilter}
                onApplyCar={handleApplyCar}
                onDeleteCar={handleDeleteCar}
                onAddCar={handleAddCar}
              />
            )}

            {activeTab === "profile" && <UserProfileTab dict={dict} user={user} />}

            {activeTab === "orders" && <OrdersHistoryTab dict={dict} orders={userOrders} />}

            {activeTab === "maintenance" && <MaintenanceBookTab dict={dict} />}
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
