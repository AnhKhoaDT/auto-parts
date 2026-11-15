"use client";

import { Printer, X } from "lucide-react";
import type { getDictionary } from "@/lib/i18n";

export interface AdminOrderItem {
  name: string;
  oem: string;
  quantity: number;
  price: number;
}

export interface AdminOrder {
  orderCode: string;
  createdAt: string;
  customerName: string;
  phone: string;
  address: string;
  vinNote?: string;
  items: AdminOrderItem[];
  totalAmount: number;
  paymentMethod: "VIETQR" | "COD";
  status: "CHO_THANH_TOAN" | "DANG_XU_LY" | "DANG_GIAO_2H" | "HOAN_THANH" | "DA_HUY";
}

interface PackingSlipModalProps {
  dict: ReturnType<typeof getDictionary>;
  order: AdminOrder | null;
  onClose: () => void;
}

// PackingSlipModal displays an official printable warehouse slip for 2H express delivery.
export default function PackingSlipModal({
  dict,
  order,
  onClose,
}: PackingSlipModalProps) {
  if (!order) return null;

  const formatVnd = (amount: number) =>
    new Intl.NumberFormat("vi-VN").format(amount) + " đ";

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 text-slate-900">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Printer className="h-4 w-4 text-sky-600" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-900">
              {dict.orders.packingSlipTitle}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="my-5 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-3 font-mono">
          <div className="flex justify-between">
            <span className="font-bold">MÃ ĐƠN HÀNG:</span>
            <span className="font-bold text-sky-700">#{order.orderCode}</span>
          </div>
          <div className="flex justify-between">
            <span>NGÀY XUẤT:</span>
            <span>{new Date(order.createdAt).toLocaleDateString("vi-VN")}</span>
          </div>
          <div className="flex justify-between">
            <span>KHÁCH HÀNG:</span>
            <span className="font-bold">{order.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span>ĐIỆN THOẠI:</span>
            <span>{order.phone}</span>
          </div>
          <div>
            <span>ĐỊA CHỈ GIAO:</span>
            <p className="font-sans font-bold text-slate-900 mt-0.5">{order.address}</p>
          </div>
          <div>
            <span>ĐỐI SOÁT XE/VIN:</span>
            <p className="font-sans font-bold text-sky-700 mt-0.5">{order.vinNote}</p>
          </div>

          <div className="pt-2 border-t border-slate-200 space-y-1">
            <span className="font-bold block">DANH MỤC LINH KIỆN:</span>
            {order.items.map((it, idx) => (
              <div key={idx} className="flex justify-between text-[11px]">
                <span>
                  {it.quantity}x {it.name} ({it.oem})
                </span>
                <span className="font-bold">{formatVnd(it.price * it.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold">
            <span>TỔNG THU:</span>
            <span className="text-sky-600">{formatVnd(order.totalAmount)}</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 mb-5 leading-tight">
          {dict.orders.packingSlipNote}
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 min-h-[40px] rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            <Printer className="h-4 w-4" />
            <span>In Phiếu Ngay</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 min-h-[40px] rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition"
          >
            {dict.orders.close}
          </button>
        </div>
      </div>
    </div>
  );
}
