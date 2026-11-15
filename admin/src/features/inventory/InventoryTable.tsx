"use client";

import { Boxes, Minus, Plus } from "lucide-react";
import type { getDictionary } from "@/lib/i18n";
import type { InventoryPart } from "../fitment/FitmentMatrixTable";

interface InventoryTableProps {
  dict: ReturnType<typeof getDictionary>;
  parts: InventoryPart[];
  onAdjustStock: (partId: string, delta: number) => void;
}

// InventoryTable provides real-time warehouse inventory controls and threshold monitoring.
export default function InventoryTable({
  dict,
  parts,
  onAdjustStock,
}: InventoryTableProps) {
  const formatVnd = (amount: number) =>
    new Intl.NumberFormat("vi-VN").format(amount) + " đ";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Boxes className="h-6 w-6 text-sky-600" />
            <span>Quản Lý Tồn Kho & Kệ Hàng</span>
          </h1>
          <p className="text-xs text-slate-500">
            Điều chỉnh số lượng thực tế, vị trí ô kệ tại kho Hà Nội & TP.HCM
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200 font-bold">
            <tr>
              <th className="py-3 px-4">Mã OEM</th>
              <th className="py-3 px-4">Tên Phụ Tùng</th>
              <th className="py-3 px-4">Vị Trí Kệ Kho</th>
              <th className="py-3 px-4">Giá Bán Lẻ</th>
              <th className="py-3 px-4 text-center">Tồn Hiện Tại</th>
              <th className="py-3 px-4 text-right">Điều Chỉnh Kho</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {parts.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 transition">
                <td className="py-3 px-4 font-mono font-bold text-sky-700">{p.oem}</td>
                <td className="py-3 px-4 font-medium">{p.name}</td>
                <td className="py-3 px-4 font-mono font-bold text-slate-700">{p.location}</td>
                <td className="py-3 px-4 font-bold text-slate-900">{formatVnd(p.price)}</td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`font-black text-sm ${
                      p.stock <= p.minThreshold ? "text-amber-600" : "text-emerald-600"
                    }`}
                  >
                    {p.stock}
                  </span>
                  {p.stock <= p.minThreshold && (
                    <span className="block text-[9px] text-amber-600 font-bold">
                      Sắp hết hàng
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="inline-flex items-center gap-1 border border-slate-200 rounded-lg p-0.5 bg-slate-50">
                    <button
                      type="button"
                      onClick={() => onAdjustStock(p.id, -1)}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600 transition"
                      title="Giảm 1"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center font-bold text-xs">{p.stock}</span>
                    <button
                      type="button"
                      onClick={() => onAdjustStock(p.id, 1)}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600 transition"
                      title="Tăng 1"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
