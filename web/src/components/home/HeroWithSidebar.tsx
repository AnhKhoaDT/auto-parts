"use client";

import Link from "next/link";
import {
  ShieldCheck,
  Filter,
  RotateCcw,
  Wrench,
  ChevronRight,
  Disc,
  Cpu,
  Zap,
  Droplet,
  Layers,
} from "lucide-react";
import type { getDictionary } from "@/lib/i18n";

interface HeroWithSidebarProps {
  dict: ReturnType<typeof getDictionary>;
  selectedYear: string;
  setSelectedYear: (y: string) => void;
  selectedMake: string;
  setSelectedMake: (m: string) => void;
  selectedModel: string;
  setSelectedModel: (m: string) => void;
  selectedEngine: string;
  setSelectedEngine: (e: string) => void;
  activeCarFilter: string;
  onApplyVehicle: (e: React.FormEvent) => void;
  onResetVehicle: () => void;
}

// HeroWithSidebar eliminates empty sidebars by pairing a quick catalog drawer with the vehicle fitment hero.
export default function HeroWithSidebar({
  dict,
  selectedYear,
  setSelectedYear,
  selectedMake,
  setSelectedMake,
  selectedModel,
  setSelectedModel,
  selectedEngine,
  setSelectedEngine,
  activeCarFilter,
  onApplyVehicle,
  onResetVehicle,
}: HeroWithSidebarProps) {
  const quickCategories = [
    { id: "engine", slug: "phu-tung-dong-co", icon: Cpu, name: "Phụ tùng động cơ & máy", count: "1.240 mã" },
    { id: "brake", slug: "he-thong-phanh", icon: Disc, name: "Hệ thống phanh & má đĩa", count: "890 mã" },
    { id: "suspension", slug: "gam-giam-xoc", icon: Wrench, name: "Gầm, càng A & giảm xóc", count: "950 mã" },
    { id: "cooling", slug: "dien-dieu-hoa", icon: Zap, name: "Điện, lốc lạnh & điều hòa", count: "620 mã" },
    { id: "oil", slug: "dau-nhot-phu-gia", icon: Droplet, name: "Dầu nhớt, phụ gia & nước mát", count: "340 mã" },
  ];

  const popularMakes = [
    "Toyota",
    "Honda",
    "Mazda",
    "Hyundai",
    "Kia",
    "Ford",
    "Mitsubishi",
    "Mercedes-Benz",
  ];

  return (
    <div className="grid grid-cols-12 gap-4 lg:gap-6 items-start">
      {/* Left Sidebar: Quick Systems & Popular Makes (Desktop) */}
      <aside className="hidden lg:block lg:col-span-3 space-y-4">
        {/* Systems Category Drawer */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 pb-3 mb-2 border-b border-slate-100">
            <Layers className="h-4 w-4 text-sky-600" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Danh Mục Phụ Tùng
            </h3>
          </div>
          <ul className="space-y-1">
            {quickCategories.map((c) => {
              const Icon = c.icon;
              return (
                <li key={c.id}>
                  <Link
                    href={`/phu-tung?category=${c.slug}`}
                    className="flex items-center justify-between p-2 rounded-xl text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition group"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-slate-400 group-hover:text-sky-600 transition" />
                      <span className="font-medium">{c.name}</span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-sky-600 transition" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Popular Car Makes Selector */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-2 mb-3 border-b border-slate-100">
            Hãng Xe Phổ Biến
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {popularMakes.map((make) => {
              const isSelected = selectedMake === make;
              return (
                <button
                  key={make}
                  type="button"
                  onClick={() => setSelectedMake(make)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold text-center border transition ${
                    isSelected
                      ? "bg-sky-600 text-white border-sky-600 shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:border-sky-300 hover:bg-sky-50"
                  }`}
                >
                  {make}
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Right Column: Hero Banner + Vehicle Fitment Selector Widget */}
      <div className="col-span-12 lg:col-span-9 space-y-4">
        {/* Editorial Hero Technical Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-xl">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-sky-500/20 border border-sky-400/40 px-3 py-1 text-xs font-semibold text-sky-300">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>{dict.hero.badge}</span>
            </div>

            <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white mb-2 leading-tight">
              {dict.hero.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 mb-0 leading-relaxed">
              {dict.hero.subtitle}
            </p>
          </div>
        </div>

        {/* Vehicle Fitment Filter Bar (EPC Selector Widget) */}
        <form
          onSubmit={onApplyVehicle}
          className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-sky-600" />
              <h3 className="text-sm font-bold text-slate-900">{dict.vehicleFilter.title}</h3>
            </div>
            <span className="text-xs text-slate-500">{dict.vehicleFilter.subtitle}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {/* Year */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                {dict.vehicleFilter.selectYear}
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full min-h-[42px] rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-sky-600 focus:bg-white"
              >
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2019">2019</option>
                <option value="2018">2018</option>
              </select>
            </div>

            {/* Make */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                {dict.vehicleFilter.selectMake}
              </label>
              <select
                value={selectedMake}
                onChange={(e) => setSelectedMake(e.target.value)}
                className="w-full min-h-[42px] rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-sky-600 focus:bg-white"
              >
                <option value="Toyota">Toyota</option>
                <option value="Honda">Honda</option>
                <option value="Mazda">Mazda</option>
                <option value="Hyundai">Hyundai</option>
                <option value="Kia">Kia</option>
                <option value="Ford">Ford</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
                <option value="BMW">BMW</option>
              </select>
            </div>

            {/* Model */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                {dict.vehicleFilter.selectModel}
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full min-h-[42px] rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-sky-600 focus:bg-white"
              >
                <option value="Vios">Vios</option>
                <option value="Camry">Camry</option>
                <option value="Fortuner">Fortuner</option>
                <option value="Corolla Cross">Corolla Cross</option>
                <option value="Innova">Innova</option>
                <option value="City">City</option>
                <option value="CR-V">CR-V</option>
              </select>
            </div>

            {/* Engine */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                {dict.vehicleFilter.selectEngine}
              </label>
              <select
                value={selectedEngine}
                onChange={(e) => setSelectedEngine(e.target.value)}
                className="w-full min-h-[42px] rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-sky-600 focus:bg-white"
              >
                <option value="1.5L 2NR-FE">1.5L 2NR-FE (Xăng)</option>
                <option value="1.5L Hybrid">1.5L Hybrid</option>
                <option value="2.0L Dynamic Force">2.0L Dynamic Force</option>
                <option value="2.4L Diesel 2GD">2.4L Diesel 2GD-FTV</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
            {activeCarFilter ? (
              <div className="text-xs text-sky-700 font-medium">
                <span>{dict.vehicleFilter.selectedNotice}</span>
                <strong className="text-slate-900 block sm:inline sm:ml-1 font-bold">
                  {activeCarFilter}
                </strong>
              </div>
            ) : (
              <span className="text-xs text-slate-400">Chưa chọn xe</span>
            )}

            <div className="flex gap-2 shrink-0 justify-end">
              <button
                type="button"
                onClick={onResetVehicle}
                className="min-h-[40px] px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold flex items-center gap-1.5 transition shrink-0"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{dict.vehicleFilter.resetFilter}</span>
              </button>
              <button
                type="submit"
                className="min-h-[40px] px-5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-sm transition shrink-0"
              >
                {dict.vehicleFilter.applyFilter}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

