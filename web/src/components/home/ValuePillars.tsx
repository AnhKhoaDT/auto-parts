"use client";

import { Shield, Zap, CheckCircle2, Clock } from "lucide-react";
import type { getDictionary } from "@/lib/i18n";

interface ValuePillarsProps {
  dict: ReturnType<typeof getDictionary>;
}

// ValuePillars showcases trust guarantees using clean, white industrial cards.
export default function ValuePillars({ dict }: ValuePillarsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 shrink-0">
          <Shield className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
            {dict.valueProps.fitmentTitle}
          </h4>
          <p className="text-[11px] text-slate-500 leading-tight line-clamp-2 mt-0.5">
            {dict.valueProps.fitmentDesc}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 shrink-0">
          <Zap className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
            {dict.valueProps.speedTitle}
          </h4>
          <p className="text-[11px] text-slate-500 leading-tight line-clamp-2 mt-0.5">
            {dict.valueProps.speedDesc}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
            {dict.valueProps.warrantyTitle}
          </h4>
          <p className="text-[11px] text-slate-500 leading-tight line-clamp-2 mt-0.5">
            {dict.valueProps.warrantyDesc}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
          <Clock className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
            {dict.valueProps.returnTitle}
          </h4>
          <p className="text-[11px] text-slate-500 leading-tight line-clamp-2 mt-0.5">
            {dict.valueProps.returnDesc}
          </p>
        </div>
      </div>
    </div>
  );
}

