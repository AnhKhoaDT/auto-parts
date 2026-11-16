"use client";

import {
  Car,
  Boxes,
  ClipboardCheck,
  Users,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Shield,
} from "lucide-react";
import type { getDictionary } from "@/lib/i18n";
import type { AdminUser } from "@/lib/api";

export type AdminTab = "orders" | "vehicles" | "inventory" | "b2b" | "analytics";

interface AdminSidebarProps {
  dict: ReturnType<typeof getDictionary>;
  admin: AdminUser;
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  pendingOrdersCount: number;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

// AdminSidebar provides collapsible, high-density industrial control navigation with mobile drawer support.
export default function AdminSidebar({
  dict,
  admin,
  activeTab,
  onTabChange,
  pendingOrdersCount,
  onLogout,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}: AdminSidebarProps) {
  const navItems = [
    {
      key: "orders" as AdminTab,
      label: dict.nav.orders,
      icon: ClipboardCheck,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : null,
    },
    {
      key: "vehicles" as AdminTab,
      label: dict.nav.vehicles,
      icon: Car,
      badge: null,
    },
    {
      key: "inventory" as AdminTab,
      label: dict.nav.inventory,
      icon: Boxes,
      badge: null,
    },
    {
      key: "b2b" as AdminTab,
      label: dict.nav.b2b,
      icon: Users,
      badge: null,
    },
    {
      key: "analytics" as AdminTab,
      label: dict.nav.analytics,
      icon: BarChart3,
      badge: null,
    },
  ];

  const handleSelectTab = (tab: AdminTab) => {
    onTabChange(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 flex flex-col justify-between border-r border-slate-800 bg-slate-950 text-slate-300 transition-all duration-300 ease-in-out shrink-0 select-none ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "w-18" : "w-64"}`}
      >
        <div>
          {/* Header Brand & Toggle */}
          <div className="flex items-center justify-between px-3.5 py-4 border-b border-slate-850 h-14">
            <div className={`flex items-center gap-2.5 overflow-hidden ${isCollapsed ? "mx-auto" : ""}`}>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-600 font-black text-white text-xs shrink-0 shadow-sm">
                KV
              </span>
              {!isCollapsed && (
                <div className="truncate">
                  <span className="font-black text-sm tracking-wide text-white block leading-tight truncate">
                    {dict.brand.title}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">
                    {dict.sidebar.controlCenter}
                  </span>
                </div>
              )}
            </div>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Section */}
          <div className="p-2 space-y-1">
            {!isCollapsed && (
              <span className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                {dict.sidebar.operations}
              </span>
            )}

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.key;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleSelectTab(item.key)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center rounded-xl transition text-left group relative ${
                      isCollapsed
                        ? "justify-center p-3"
                        : "gap-3 px-3 py-2.5 text-xs font-bold"
                    } ${
                      isActive
                        ? "bg-sky-600 text-white shadow-xs"
                        : "text-slate-400 hover:bg-slate-900 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />

                    {!isCollapsed && (
                      <>
                        <span className="truncate">{item.label}</span>
                        {item.badge !== null && (
                          <span className="ml-auto flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-amber-500 text-[9px] font-black text-slate-950">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}

                    {/* Dot badge on collapsed mode */}
                    {isCollapsed && item.badge !== null && (
                      <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-slate-950" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer: Admin Identity & Collapse Action */}
        <div className="p-2 border-t border-slate-850 space-y-2">
          {/* Quick Collapse Toggle at bottom */}
          <div className="hidden lg:flex justify-end">
            <button
              type="button"
              onClick={onToggleCollapse}
              title={isCollapsed ? dict.sidebar.expand : dict.sidebar.collapse}
              className={`w-full flex items-center rounded-xl p-2 text-slate-500 hover:text-slate-300 hover:bg-slate-900 transition text-xs font-semibold ${
                isCollapsed ? "justify-center" : "gap-2"
              }`}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4 shrink-0" />
                  <span>{dict.sidebar.collapse}</span>
                </>
              )}
            </button>
          </div>

          {/* User Profile info */}
          <div
            className={`p-2 rounded-xl bg-slate-900/90 border border-slate-850 flex items-center ${
              isCollapsed ? "justify-center" : "justify-between gap-2"
            }`}
          >
            {isCollapsed ? (
              <button
                type="button"
                onClick={onLogout}
                title={`${admin.full_name} (${admin.role}) - ${dict.auth.logout}`}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
              >
                <LogOut className="h-4 w-4" />
              </button>
            ) : (
              <>
                <div className="truncate">
                  <span className="block text-xs font-bold text-white truncate">
                    {admin.full_name}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Shield className="h-3 w-3 text-sky-400 shrink-0" />
                    <span className="text-[10px] font-mono font-bold text-sky-400 uppercase">
                      {admin.role}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  title={dict.auth.logout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
