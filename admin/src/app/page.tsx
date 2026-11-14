"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Car,
  Boxes,
  ClipboardCheck,
  Users,
  BarChart3,
  Search,
  Plus,
  ArrowUpRight,
  LogOut,
  ShieldCheck,
  Lock,
  AlertTriangle,
  Layers,
} from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import { useAdminAuth } from "@/features/auth/useAdminAuth";

// AdminDashboard renders the operations portal verifying authentication and role permissions.
export default function AdminDashboard() {
  const router = useRouter();
  const dict = getDictionary("vi");
  const { admin, isLoading, fetchAdmin, logout } = useAdminAuth();

  useEffect(() => {
    fetchAdmin().then((res) => {
      if (!res) {
        router.push("/dang-nhap");
      }
    });
  }, [fetchAdmin, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/dang-nhap");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <span>{dict.auth.loading}</span>
        </div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 p-4">
        <Lock className="h-10 w-10 text-amber-500 mb-3" />
        <h2 className="text-base font-bold text-white mb-2">{dict.auth.loginRequired}</h2>
        <Link
          href="/login"
          className="rounded-lg bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-500 transition"
        >
          {dict.auth.loginButton}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* High-density Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-950 p-4 text-slate-300 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2.5 px-2 py-3 mb-6 border-b border-slate-800">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600 font-black text-white text-xs">
              AP
            </span>
            <div>
              <span className="font-black text-sm tracking-wide text-white block leading-none">
                {dict.brand.title}
              </span>
              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                Control Center
              </span>
            </div>
          </div>

          <nav className="space-y-1 text-xs">
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg bg-sky-600/20 px-3 py-2 text-sky-400 font-bold border border-sky-500/30"
            >
              <Car className="h-4 w-4" /> {dict.nav.vehicles}
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-900 text-slate-400 hover:text-white transition"
            >
              <Boxes className="h-4 w-4" /> {dict.nav.inventory}
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-900 text-slate-400 hover:text-white transition"
            >
              <ClipboardCheck className="h-4 w-4" /> {dict.nav.orders}
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-900 text-slate-400 hover:text-white transition"
            >
              <Users className="h-4 w-4" /> {dict.nav.b2b}
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-900 text-slate-400 hover:text-white transition"
            >
              <BarChart3 className="h-4 w-4" /> {dict.nav.analytics}
            </a>
          </nav>
        </div>

        {/* Authenticated Admin Badge & Sign Out */}
        <div className="border-t border-slate-800 pt-3">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
            <div className="truncate">
              <span className="block text-xs font-bold text-white truncate">
                {admin.full_name}
              </span>
              <span className="text-[10px] font-mono text-sky-400 block font-bold">
                [{admin.role}]
              </span>
            </div>
            <button
              onClick={handleLogout}
              title={dict.auth.logout}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400 transition"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 mb-6 gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {dict.fitment.title}
            </h1>
            <p className="text-xs text-slate-500">
              {dict.fitment.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs transition">
              {dict.fitment.importExcel}
            </button>
            <button className="flex items-center gap-1.5 rounded-lg bg-sky-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-sky-500 shadow-xs transition">
              <Plus className="h-3.5 w-3.5" /> {dict.fitment.addPart}
            </button>
          </div>
        </div>

        {/* 4 Key Metrics Bento Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              {dict.metrics.totalProducts}
            </span>
            <div className="text-2xl font-black text-slate-900">12,450</div>
            <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
              +140 SKU tuần này
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              {dict.metrics.fitmentVehicles}
            </span>
            <div className="text-2xl font-black text-slate-900">48 Dòng Xe</div>
            <span className="text-[10px] text-sky-600 font-semibold mt-1 block">
              Toyota, Honda, Ford, Mazda
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              {dict.metrics.stockWarning}
            </span>
            <div className="text-2xl font-black text-amber-600">8 SKU</div>
            <span className="text-[10px] text-amber-700 font-semibold mt-1 block">
              Chạm ngưỡng tồn kho tối thiểu
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              {dict.metrics.pendingOrders}
            </span>
            <div className="text-2xl font-black text-sky-600">5 Đơn Hàng</div>
            <span className="text-[10px] text-slate-500 font-semibold mt-1 block">
              Cần đối soát số khung VIN
            </span>
          </div>
        </div>

        {/* Operational Filter Table */}
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500 w-full max-w-sm">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder={dict.fitment.filterPlaceholder}
                className="w-full outline-none text-xs text-slate-800"
              />
            </div>
            <span className="text-[11px] font-mono text-slate-400 shrink-0">
              {dict.fitment.recordCount.replace("{count}", "1,248")}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-4 font-bold">{dict.fitment.table.oem}</th>
                  <th className="py-2.5 px-4 font-bold">{dict.fitment.table.name}</th>
                  <th className="py-2.5 px-4 font-bold">{dict.fitment.table.origin}</th>
                  <th className="py-2.5 px-4 font-bold">{dict.fitment.table.compatible}</th>
                  <th className="py-2.5 px-4 font-bold">{dict.fitment.table.location}</th>
                  <th className="py-2.5 px-4 font-bold">{dict.fitment.table.stock}</th>
                  <th className="py-2.5 px-4 font-bold text-right">{dict.fitment.table.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-mono font-bold text-sky-700">04465-0D150</td>
                  <td className="py-3 px-4 font-medium">Bộ má phanh đĩa trước</td>
                  <td className="py-3 px-4">Denso (Nhật Bản)</td>
                  <td className="py-3 px-4">
                    <span className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px]">
                      Toyota Vios 2014-2022 (4 {dict.fitment.table.variants})
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">HN-A2-K03</td>
                  <td className="py-3 px-4 font-bold text-emerald-600">48 {dict.fitment.table.unit}</td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-sky-600 hover:text-sky-800 font-semibold inline-flex items-center gap-1">
                      {dict.fitment.table.edit} <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-mono font-bold text-sky-700">17801-0Y040</td>
                  <td className="py-3 px-4 font-medium">Lọc gió động cơ</td>
                  <td className="py-3 px-4">Toyota Genuine (Thái Lan)</td>
                  <td className="py-3 px-4">
                    <span className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px]">
                      Toyota Vios, Yaris, Altis
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">HN-B1-K08</td>
                  <td className="py-3 px-4 font-bold text-emerald-600">120 {dict.fitment.table.unit}</td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-sky-600 hover:text-sky-800 font-semibold inline-flex items-center gap-1">
                      {dict.fitment.table.edit} <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
