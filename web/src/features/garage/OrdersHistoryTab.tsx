"use client";

import Link from "next/link";
import { QrCode, ShoppingBag, Truck, CheckCircle2 } from "lucide-react";
import type { getDictionary } from "@/lib/i18n";
import OrderStatusTracker from "../orders/OrderStatusTracker";

export interface OrderItem {
  id: string;
  name: string;
  oem: string;
  price: number;
  quantity: number;
}

export interface UserOrder {
  orderCode: string;
  createdAt: string;
  paymentMethod: string;
  items: OrderItem[];
  totalAmount: number;
  shippingMethod?: string;
  status?: "DANG_XU_LY" | "DANG_GIAO_2H" | "HOAN_THANH" | "CHO_THANH_TOAN";
}

interface OrdersHistoryTabProps {
  dict: ReturnType<typeof getDictionary>;
  orders: UserOrder[];
}

// OrdersHistoryTab renders past order transactions with QR warranty certificate links.
export default function OrdersHistoryTab({ dict, orders }: OrdersHistoryTabProps) {
  const formatVND = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-6">
      <div className="pb-4 border-b border-slate-100">
        <h2 className="text-base sm:text-lg font-black text-slate-900">{dict.hoSoPage.tabOrders}</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Mỗi chi tiết phụ tùng đều tích hợp mã QR chống hàng giả và kích hoạt bảo hành điện tử.
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((ord) => (
          <div key={ord.orderCode} className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/60">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-sky-700">#{ord.orderCode}</span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500">
                  {new Date(ord.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
              {ord.status === "DANG_GIAO_2H" ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                  <Truck className="h-3 w-3 text-amber-600" />
                  <span>Đang Giao Hỏa Tốc 2H</span>
                </span>
              ) : ord.status === "HOAN_THANH" ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  <span>Đã Giao Thành Công</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                  {ord.paymentMethod === "VIETQR" ? "Đang Xử Lý (VietQR)" : "Đang Xử Lý (COD)"}
                </span>
              )}
            </div>

            <div className="py-3 text-xs text-slate-800 font-medium space-y-1">
              {ord.items?.map((item, idx) => (
                <p key={idx} className="flex justify-between">
                  <span>
                    {item.quantity}x {item.name} ({item.oem})
                  </span>
                  <span className="font-bold">{formatVND(item.price * item.quantity)}</span>
                </p>
              ))}
            </div>

            <OrderStatusTracker
              status={ord.status || (ord.paymentMethod === "VIETQR" ? "CHO_THANH_TOAN" : "DANG_XU_LY")}
              dict={dict}
              className="my-3"
            />

            <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-900">
                Tổng thanh toán: <strong className="text-sky-600 text-sm">{formatVND(ord.totalAmount)}</strong>
              </span>
              <Link
                href={`/bao-hanh?code=${ord.orderCode}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold transition"
              >
                <QrCode className="h-3.5 w-3.5 text-sky-600" />
                <span>Xem Tem Bảo Hành QR</span>
              </Link>
            </div>
          </div>
        ))}

        {/* Demo order to showcase completed warranty history */}
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/60">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-sky-700">#ORD-2026-9812</span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500">14/11/2026</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Đã Giao Thành Công
            </span>
          </div>

          <div className="py-3 text-xs text-slate-800 font-medium space-y-1">
            <p className="flex justify-between">
              <span>2x Bộ má phanh trước Denso Japan (04465-0D150)</span>
              <span className="font-bold">900.000 đ</span>
            </p>
            <p className="flex justify-between text-slate-500 text-[11px]">
              <span>4x Bugi Iridium Denso SC20HR11</span>
              <span className="font-bold text-slate-700">880.000 đ</span>
            </p>
          </div>

          <OrderStatusTracker status="HOAN_THANH" dict={dict} className="my-3" />

          <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-900">
              Tổng thanh toán: <strong className="text-sky-600 text-sm">1.780.000 đ</strong>
            </span>
            <Link
              href="/bao-hanh?code=KV-WAR-2026-04465"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold transition"
            >
              <QrCode className="h-3.5 w-3.5 text-sky-600" />
              <span>Xem Tem Bảo Hành QR</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
