"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  ExternalLink,
  Bell,
  Clock,
  ShieldCheck,
} from "lucide-react";
import type { getDictionary } from "@/lib/i18n";

interface AdminTopHeaderProps {
  dict: ReturnType<typeof getDictionary>;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenMobile: () => void;
  pendingOrdersCount: number;
}

// AdminTopHeader renders enterprise warehouse telemetry, quick search, and sidebar collapse toggle.
export default function AdminTopHeader({
  dict,
  isCollapsed,
  onToggleCollapse,
  onOpenMobile,
  pendingOrdersCount,
}: AdminTopHeaderProps) {
  const [timeString, setTimeString] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 border-b border-slate-200 bg-white px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
      {/* Left: Sidebar toggle buttons and warehouse operational status */}
      <div className="flex items-center gap-3">
        {/* Mobile toggle */}
        <button
          type="button"
          onClick={onOpenMobile}
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden transition"
          title="Mở menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Desktop collapse toggle */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden lg:flex p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
          title={isCollapsed ? dict.sidebar.expand : dict.sidebar.collapse}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-5 w-5 text-sky-700" />
          ) : (
            <PanelLeftClose className="h-5 w-5 text-slate-600" />
          )}
        </button>

        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 text-xs">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-bold text-slate-800">{dict.topbar.warehouseActive}</span>
        </div>
      </div>

      {/* Center: Search shortcut */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="w-full relative">
          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            readOnly
            placeholder={dict.topbar.searchShortcut}
            className="w-full pl-8 pr-12 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-600 placeholder-slate-400 focus:outline-none cursor-pointer hover:border-slate-300"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400 border border-slate-200 bg-white">
            ⌘K
          </span>
        </div>
      </div>

      {/* Right: Realtime Clock, Notifications & Storefront Link */}
      <div className="flex items-center gap-3 text-xs">
        {timeString && (
          <div className="hidden xl:flex items-center gap-1.5 font-mono text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-semibold">{timeString} (GMT+7)</span>
          </div>
        )}

        {/* Pending 2H notification indicator */}
        <div className="relative">
          <button
            type="button"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition relative"
            title="Đơn hàng chờ xử lý"
          >
            <Bell className="h-4 w-4" />
            {pendingOrdersCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-amber-500 text-[9px] font-black text-slate-950 flex items-center justify-center">
                {pendingOrdersCount}
              </span>
            )}
          </button>
        </div>

        {/* Link to customer Storefront */}
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-sky-500 bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 font-bold transition text-xs shadow-2xs"
        >
          <span>Xem Storefront</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </header>
  );
}
