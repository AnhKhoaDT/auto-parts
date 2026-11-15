"use client";

import { FileCheck, PackageCheck, Truck, ShieldCheck, Check } from "lucide-react";
import type { getDictionary } from "@/lib/i18n";

export type OrderProgressStatus =
  | "CHO_THANH_TOAN"
  | "DANG_XU_LY"
  | "DANG_GIAO_2H"
  | "HOAN_THANH";

interface OrderStatusTrackerProps {
  status: OrderProgressStatus | string;
  dict: ReturnType<typeof getDictionary>;
  className?: string;
}

// OrderStatusTracker visualizes real-time 4-stage parts dispatch pipeline from warehouse to garage.
export default function OrderStatusTracker({
  status,
  dict,
  className = "",
}: OrderStatusTrackerProps) {
  const tdict = dict.orderTracker;

  const getStepIndex = (st: string) => {
    switch (st) {
      case "CHO_THANH_TOAN":
        return 0;
      case "DANG_XU_LY":
        return 1;
      case "DANG_GIAO_2H":
        return 2;
      case "HOAN_THANH":
        return 3;
      default:
        return 1;
    }
  };

  const activeIndex = getStepIndex(status);

  const steps = [
    {
      label: tdict.stepReceived,
      desc: tdict.stepReceivedDesc,
      icon: FileCheck,
    },
    {
      label: tdict.stepPacking,
      desc: tdict.stepPackingDesc,
      icon: PackageCheck,
    },
    {
      label: tdict.stepShipping,
      desc: tdict.stepShippingDesc,
      icon: Truck,
    },
    {
      label: tdict.stepCompleted,
      desc: tdict.stepCompletedDesc,
      icon: ShieldCheck,
    },
  ];

  return (
    <div className={`p-4 rounded-2xl bg-slate-50 border border-slate-200/90 ${className}`}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isPassed = idx < activeIndex;
          const isCurrent = idx === activeIndex;

          return (
            <div
              key={s.label}
              className={`flex flex-col items-center text-center p-2 rounded-xl transition ${
                isCurrent
                  ? "bg-white border border-sky-300 shadow-2xs"
                  : isPassed
                  ? "opacity-90"
                  : "opacity-40"
              }`}
            >
              <div
                className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 mb-2 transition font-bold text-xs ${
                  isPassed
                    ? "bg-emerald-600 text-white shadow-2xs"
                    : isCurrent
                    ? idx === 2
                      ? "bg-amber-500 text-slate-950 animate-pulse shadow-sm"
                      : "bg-sky-600 text-white shadow-sm"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {isPassed ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>

              <span
                className={`text-xs font-bold block leading-tight ${
                  isCurrent ? "text-slate-900" : isPassed ? "text-emerald-800" : "text-slate-500"
                }`}
              >
                {s.label}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 leading-snug line-clamp-1">
                {s.desc}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
