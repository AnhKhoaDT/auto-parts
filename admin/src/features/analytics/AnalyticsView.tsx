"use client";

import { BarChart3 } from "lucide-react";
import type { getDictionary } from "@/lib/i18n";

interface AnalyticsViewProps {
  dict: ReturnType<typeof getDictionary>;
}

// AnalyticsView renders revenue shares, 2H express dispatch KPIs, and fitment accuracy.
export default function AnalyticsView({ dict }: AnalyticsViewProps) {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-sky-600" />
          <span>{dict.analytics.title}</span>
        </h1>
        <p className="text-xs text-slate-500">{dict.analytics.subtitle}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            {dict.analytics.revenueTotal}
          </span>
          <div className="text-2xl font-black text-slate-900">485.600.000 đ</div>
          <span className="text-[10px] text-emerald-600 font-bold">+18.4% so với tháng trước</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            {dict.analytics.revenueB2B}
          </span>
          <div className="text-2xl font-black text-sky-600">72.4%</div>
          <span className="text-[10px] text-slate-500 font-medium">Doanh số ổn định từ Gara</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            {dict.analytics.onTimeRate}
          </span>
          <div className="text-2xl font-black text-emerald-600">98.6%</div>
          <span className="text-[10px] text-emerald-700 font-medium">Giao tận cầu nâng &lt; 120p</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            {dict.analytics.fitmentAccuracy}
          </span>
          <div className="text-2xl font-black text-sky-700">99.8%</div>
          <span className="text-[10px] text-slate-500 font-medium">Tỷ lệ đổi trả &lt; 0.2%</span>
        </div>
      </div>
    </div>
  );
}
