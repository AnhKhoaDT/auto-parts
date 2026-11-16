"use client";

import { Calendar, Wrench, ShieldCheck, AlertTriangle } from "lucide-react";
import type { getDictionary } from "@/lib/i18n";

interface MaintenanceBookTabProps {
  dict: ReturnType<typeof getDictionary>;
}

// MaintenanceBookTab displays vehicle periodic service intervals and wear-and-tear replacement guidance.
export default function MaintenanceBookTab({ dict }: MaintenanceBookTabProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-6">
      <div className="pb-4 border-b border-slate-100">
        <h2 className="text-base sm:text-lg font-black text-slate-900">Sổ Tay Bảo Dưỡng Ô Tô Định Kỳ</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Lịch trình khuyến nghị bảo dưỡng các cơ cấu phụ tùng hao mòn theo số km vận hành.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Stage 1: 5.000 km */}
        <div className="p-4 rounded-2xl border border-sky-200 bg-sky-50/50">
          <div className="flex items-center gap-2 text-sky-700 font-bold text-xs mb-2">
            <Calendar className="h-4 w-4" />
            <span>Cấp 1: Mỗi 5.000 KM</span>
          </div>
          <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
            <li>Thay dầu nhớt động cơ Motul / Castrol 5W-30</li>
            <li>Vệ sinh lọc gió động cơ &amp; lọc gió máy lạnh</li>
            <li>Kiểm tra áp suất lốp &amp; siết ốc bánh xe</li>
          </ul>
        </div>

        {/* Stage 2: 10.000 km */}
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

        {/* Stage 3: 20.000 - 40.000 km */}
        <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/50">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs mb-2">
            <Calendar className="h-4 w-4" />
            <span>Cấp 3: Mỗi 20.000 KM - 40.000 KM</span>
          </div>
          <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
            <li>Thay lọc gió động cơ &amp; lọc gió điều hòa than hoạt tính</li>
            <li>Thay dầu phanh DOT4 &amp; dầu trợ lực lái</li>
            <li>Kiểm tra hệ thống gầm rô-tuyn càng A, giảm xóc</li>
          </ul>
        </div>

        {/* Stage 4: 80.000 - 100.000 km */}
        <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50/50">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-xs mb-2">
            <Calendar className="h-4 w-4" />
            <span>Cấp 4: Mỗi 80.000 KM - 100.000 KM</span>
          </div>
          <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
            <li>Thay bộ 4 bugi Iridium chân dài Denso / NGK</li>
            <li>Thay dây curoa tổng Gates &amp; nước làm mát đỏ</li>
            <li>Thay dầu hộp số tự động CVT / AT tuần hoàn</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
