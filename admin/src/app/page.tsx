"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import { useAdminAuth } from "@/features/auth/useAdminAuth";
import AdminSidebar, { AdminTab } from "@/components/layout/AdminSidebar";
import AdminTopHeader from "@/components/layout/AdminTopHeader";
import OrdersTable from "@/features/orders/OrdersTable";
import PackingSlipModal, { AdminOrder } from "@/features/orders/PackingSlipModal";
import FitmentMatrixTable, { InventoryPart } from "@/features/fitment/FitmentMatrixTable";
import AddPartModal from "@/features/fitment/AddPartModal";
import InventoryTable from "@/features/inventory/InventoryTable";
import GaragesTable from "@/features/b2b/GaragesTable";
import AnalyticsView from "@/features/analytics/AnalyticsView";

const DEFAULT_ORDERS: AdminOrder[] = [
  {
    orderCode: "KV-2026-9812",
    createdAt: "2026-11-15T10:30:00Z",
    customerName: "Nguyễn Văn Khách (Gara AutoCare)",
    phone: "097 3333 217",
    address: "467 An Dương Vương, P. Chợ Quán, Q.5, TP.HCM",
    vinNote: "Toyota Vios 1.5L (2021) - VIN: RL4BA12E0J1234567",
    items: [
      { name: "Bộ má phanh trước Denso Japan", oem: "04465-0D150", quantity: 2, price: 370000 },
      { name: "Bugi Iridium Chân Dài Denso SC20HR11", oem: "90919-01253", quantity: 4, price: 175000 },
    ],
    totalAmount: 1440000,
    paymentMethod: "VIETQR",
    status: "DANG_XU_LY",
  },
  {
    orderCode: "KV-2026-9450",
    createdAt: "2026-11-15T14:15:00Z",
    customerName: "Trần Văn Bình",
    phone: "091 8888 920",
    address: "88 Tam Trinh, Q. Hoàng Mai, Hà Nội",
    vinNote: "Toyota Corolla Cross 1.8L (2022)",
    items: [
      { name: "Cặp Phuộc Nhún Giảm Xóc Trước KYB Excel-G", oem: "48510-0D590", quantity: 1, price: 1650000 },
    ],
    totalAmount: 1650000,
    paymentMethod: "COD",
    status: "DANG_GIAO_2H",
  },
  {
    orderCode: "KV-2026-9110",
    createdAt: "2026-11-14T09:00:00Z",
    customerName: "Gara Quang Vũ",
    phone: "090 9999 112",
    address: "235 Quốc Lộ 13, TP. Thủ Đức, TP.HCM",
    vinNote: "Mazda 3 (2020) 1.5L",
    items: [
      { name: "Lốc Lạnh Điều Hòa Denso 10S11C Chuẩn Hãng", oem: "88310-0D330", quantity: 1, price: 4100000 },
    ],
    totalAmount: 4100000,
    paymentMethod: "VIETQR",
    status: "HOAN_THANH",
  },
];

const INITIAL_PARTS: InventoryPart[] = [
  {
    id: "p1",
    oem: "04465-0D150",
    name: "Bộ má phanh đĩa trước chuẩn OEM",
    brand: "Denso Japan",
    compatible: "Toyota Vios 2014-2023, Yaris",
    location: "HCM-A2-K03",
    stock: 45,
    minThreshold: 10,
    price: 450000,
  },
  {
    id: "p2",
    oem: "90919-01253",
    name: "Bugi Iridium Chân Dài Denso SC20HR11",
    brand: "Denso Japan",
    compatible: "Toyota Vios, Altis, Corolla Cross",
    location: "HCM-B1-K08",
    stock: 120,
    minThreshold: 20,
    price: 220000,
  },
  {
    id: "p3",
    oem: "17801-0Y040",
    name: "Lọc gió động cơ High-Flow chống ẩm",
    brand: "Bosch Germany",
    compatible: "Toyota Vios, Altis (2016-2023)",
    location: "HN-C3-K12",
    stock: 8,
    minThreshold: 15,
    price: 180000,
  },
  {
    id: "p4",
    oem: "88310-0D330",
    name: "Lốc lạnh máy nén điều hòa Denso 10S11C",
    brand: "Denso Japan",
    compatible: "Toyota Vios, Yaris (2018-2022)",
    location: "HCM-D1-K02",
    stock: 15,
    minThreshold: 5,
    price: 4850000,
  },
  {
    id: "p5",
    oem: "48510-0D590",
    name: "Cặp phuộc nhún giảm xóc trước KYB Excel-G",
    brand: "KYB Japan",
    compatible: "Toyota Vios 2018-2023",
    location: "HN-A1-K05",
    stock: 6,
    minThreshold: 8,
    price: 1650000,
  },
];

// AdminDashboard composes decoupled operation modules for warehouse, fitment, and orders.
export default function AdminDashboard() {
  const router = useRouter();
  const dict = getDictionary("vi");
  const { admin, isLoading, fetchAdmin, logout } = useAdminAuth();

  const [activeTab, setActiveTab] = useState<AdminTab>("orders");
  const [orders, setOrders] = useState<AdminOrder[]>(DEFAULT_ORDERS);
  const [parts, setParts] = useState<InventoryPart[]>(INITIAL_PARTS);

  const [printingOrder, setPrintingOrder] = useState<AdminOrder | null>(null);
  const [showAddPartModal, setShowAddPartModal] = useState(false);

  // Collapsible sidebar state persisted in localStorage
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("kv_admin_sidebar_collapsed");
      if (saved !== null) {
        setIsSidebarCollapsed(saved === "true");
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleToggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("kv_admin_sidebar_collapsed", String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  useEffect(() => {
    fetchAdmin().then((res) => {
      if (!res) router.push("/dang-nhap");
    });

    try {
      const raw = localStorage.getItem("kv_user_orders");
      if (raw) {
        const storedOrders = JSON.parse(raw);
        if (Array.isArray(storedOrders) && storedOrders.length > 0) {
          const merged: AdminOrder[] = storedOrders.map((so: any) => ({
            orderCode: so.orderCode,
            createdAt: so.createdAt,
            customerName: so.customerName || "Khách Hàng",
            phone: so.phone || "09x xxx xxxx",
            address: so.address || "Chưa cập nhật",
            vinNote: so.vinNote || "Không có ghi chú VIN",
            items: so.items || [],
            totalAmount: so.totalAmount || 0,
            paymentMethod: so.paymentMethod || "COD",
            status: so.status || "DANG_XU_LY",
          }));

          const existingCodes = new Set(merged.map((m) => m.orderCode));
          const leftovers = DEFAULT_ORDERS.filter((d) => !existingCodes.has(d.orderCode));
          setOrders([...merged, ...leftovers]);
        }
      }
    } catch {
      // Keep defaults
    }
  }, [fetchAdmin, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/dang-nhap");
  };

  const handleUpdateOrderStatus = (orderCode: string, newStatus: AdminOrder["status"]) => {
    const updated = orders.map((o) => (o.orderCode === orderCode ? { ...o, status: newStatus } : o));
    setOrders(updated);
    try {
      localStorage.setItem("kv_user_orders", JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleAdjustStock = (partId: string, delta: number) => {
    setParts((prev) =>
      prev.map((p) => (p.id === partId ? { ...p, stock: Math.max(0, p.stock + delta) } : p))
    );
  };

  const handleAddPart = (newPart: InventoryPart) => {
    setParts([newPart, ...parts]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
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
          href="/dang-nhap"
          className="rounded-lg bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-500 transition"
        >
          {dict.auth.loginButton}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900 overflow-x-hidden">
      <AdminSidebar
        dict={dict}
        admin={admin}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingOrdersCount={orders.filter((o) => o.status === "DANG_XU_LY").length}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebarCollapse}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopHeader
          dict={dict}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebarCollapse}
          onOpenMobile={() => setIsMobileSidebarOpen(true)}
          pendingOrdersCount={orders.filter((o) => o.status === "DANG_XU_LY").length}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === "orders" && (
            <OrdersTable
              dict={dict}
              orders={orders}
              onUpdateStatus={handleUpdateOrderStatus}
              onPrintSlip={(ord) => setPrintingOrder(ord)}
            />
          )}

          {activeTab === "vehicles" && (
            <FitmentMatrixTable
              dict={dict}
              parts={parts}
              onOpenAddModal={() => setShowAddPartModal(true)}
            />
          )}

          {activeTab === "inventory" && (
            <InventoryTable
              dict={dict}
              parts={parts}
              onAdjustStock={handleAdjustStock}
            />
          )}

          {activeTab === "b2b" && <GaragesTable dict={dict} />}

          {activeTab === "analytics" && <AnalyticsView dict={dict} />}
        </main>
      </div>

      <PackingSlipModal
        dict={dict}
        order={printingOrder}
        onClose={() => setPrintingOrder(null)}
      />

      <AddPartModal
        dict={dict}
        isOpen={showAddPartModal}
        onClose={() => setShowAddPartModal(false)}
        onAddPart={handleAddPart}
      />
    </div>
  );
}
