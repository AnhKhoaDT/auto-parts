"use client";

import { useState } from "react";
import {
  ClipboardCheck,
  Search,
  Truck,
  Check,
  Printer,
} from "lucide-react";
import type { getDictionary } from "@/lib/i18n";
import type { AdminOrder } from "./PackingSlipModal";

interface OrdersTableProps {
  dict: ReturnType<typeof getDictionary>;
  orders: AdminOrder[];
  onUpdateStatus: (orderCode: string, status: AdminOrder["status"]) => void;
  onPrintSlip: (order: AdminOrder) => void;
}

// OrdersTable renders order processing controls, status toggling, and VIN verification.
export default function OrdersTable({
  dict,
  orders,
  onUpdateStatus,
  onPrintSlip,
}: OrdersTableProps) {
  const [orderFilter, setOrderFilter] = useState<string>("ALL");
  const [orderSearch, setOrderSearch] = useState<string>("");

  const formatVnd = (amount: number) =>
    new Intl.NumberFormat("vi-VN").format(amount) + " đ";

  const filteredOrders = orders.filter((o) => {
    if (orderFilter !== "ALL" && o.status !== orderFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase().trim();
      const matchCode = o.orderCode.toLowerCase().includes(q);
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.phone.toLowerCase().includes(q);
      const matchVin = o.vinNote?.toLowerCase().includes(q);
      if (!matchCode && !matchName && !matchPhone && !matchVin) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ClipboardCheck className="h-6 w-6 text-sky-600" />
            <span>{dict.orders.title}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">{dict.orders.subtitle}</p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
          {[
            { key: "ALL", label: dict.orders.allFilter },
            { key: "DANG_XU_LY", label: dict.orders.processing },
            { key: "DANG_GIAO_2H", label: dict.orders.dispatching },
            { key: "HOAN_THANH", label: dict.orders.completed },
          ].map((st) => (
            <button
              key={st.key}
              type="button"
              onClick={() => setOrderFilter(st.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                orderFilter === st.key
                  ? "bg-sky-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2 max-w-md">
        <Search className="h-4 w-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={orderSearch}
          onChange={(e) => setOrderSearch(e.target.value)}
          placeholder={dict.orders.searchPlaceholder}
          className="w-full text-xs outline-hidden text-slate-900 placeholder-slate-400"
        />
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200 font-bold">
              <tr>
                <th className="py-3 px-4">{dict.orders.orderCode}</th>
                <th className="py-3 px-4">{dict.orders.customer}</th>
                <th className="py-3 px-4">{dict.orders.items}</th>
                <th className="py-3 px-4">{dict.orders.total}</th>
                <th className="py-3 px-4">{dict.orders.payment}</th>
                <th className="py-3 px-4">{dict.orders.status}</th>
                <th className="py-3 px-4 text-right">{dict.orders.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    {dict.orders.empty}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.orderCode} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-sky-700 block">
                        #{ord.orderCode}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(ord.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </td>

                    <td className="py-3 px-4 max-w-[200px]">
                      <span className="font-bold text-slate-900 block truncate">
                        {ord.customerName}
                      </span>
                      <span className="text-[10px] text-slate-500 block">{ord.phone}</span>
                      <span className="text-[10px] text-sky-700 font-medium block truncate">
                        Xe: {ord.vinNote || "Chưa nhập số khung"}
                      </span>
                    </td>

                    <td className="py-3 px-4 max-w-[250px]">
                      <div className="space-y-0.5">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="truncate text-[11px]">
                            <span className="font-bold text-slate-900">{item.quantity}x</span>{" "}
                            <span>{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-black text-slate-900 text-sm block">
                        {formatVnd(ord.totalAmount)}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          ord.paymentMethod === "VIETQR"
                            ? "bg-sky-50 text-sky-700 border border-sky-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {ord.paymentMethod}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          ord.status === "DANG_GIAO_2H"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : ord.status === "HOAN_THANH"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : ord.status === "CHO_THANH_TOAN"
                            ? "bg-sky-100 text-sky-800 border border-sky-200"
                            : "bg-slate-100 text-slate-800 border border-slate-200"
                        }`}
                      >
                        {ord.status === "DANG_GIAO_2H" && <Truck className="h-3 w-3" />}
                        {ord.status === "HOAN_THANH" && <Check className="h-3 w-3" />}
                        {ord.status === "DANG_GIAO_2H"
                          ? dict.orders.dispatching
                          : ord.status === "HOAN_THANH"
                          ? dict.orders.completed
                          : ord.status === "CHO_THANH_TOAN"
                          ? dict.orders.pendingPayment
                          : dict.orders.processing}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {ord.status === "DANG_XU_LY" && (
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(ord.orderCode, "DANG_GIAO_2H")}
                            className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-bold transition shadow-xs"
                          >
                            {dict.orders.approve2H}
                          </button>
                        )}

                        {ord.status === "DANG_GIAO_2H" && (
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(ord.orderCode, "HOAN_THANH")}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition shadow-xs"
                          >
                            {dict.orders.confirmPaid}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onPrintSlip(ord)}
                          title={dict.orders.printSlip}
                          className="p-1 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
                        >
                          <Printer className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
