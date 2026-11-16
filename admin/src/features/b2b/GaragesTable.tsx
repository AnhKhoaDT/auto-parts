"use client";

import { Users, Check } from "lucide-react";
import type { getDictionary } from "@/lib/i18n";

interface GaragesTableProps {
  dict: ReturnType<typeof getDictionary>;
}

// GaragesTable renders the B2B partner network and credit limit ledger.
export default function GaragesTable({ dict }: GaragesTableProps) {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Users className="h-6 w-6 text-sky-600" />
          <span>{dict.b2b.title}</span>
        </h1>
        <p className="text-xs text-slate-500">{dict.b2b.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block mb-1">
            Tổng Gara Đối Tác
          </span>
          <div className="text-2xl font-black text-slate-900">158 Gara</div>
          <span className="text-[10px] text-emerald-600 font-bold">Toàn quốc</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block mb-1">
            Tổng Hạn Mức Cấp
          </span>
          <div className="text-2xl font-black text-sky-600">3.2 Tỷ VNĐ</div>
          <span className="text-[10px] text-slate-500 font-medium">Bảo lãnh công nợ 30 ngày</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block mb-1">
            Đơn Hàng Gara Tuần Này
          </span>
          <div className="text-2xl font-black text-emerald-600">340 Đơn</div>
          <span className="text-[10px] text-emerald-700 font-bold">100% Giao 2H đạt chuẩn</span>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200 font-bold">
            <tr>
              <th className="py-3 px-4">{dict.b2b.garageName}</th>
              <th className="py-3 px-4">{dict.b2b.manager}</th>
              <th className="py-3 px-4">{dict.b2b.phone}</th>
              <th className="py-3 px-4">{dict.b2b.tier}</th>
              <th className="py-3 px-4">{dict.b2b.discount}</th>
              <th className="py-3 px-4">{dict.b2b.creditLimit}</th>
              <th className="py-3 px-4">{dict.b2b.status}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            <tr className="hover:bg-slate-50 transition">
              <td className="py-3 px-4">
                <span className="font-bold text-slate-900 block">Gara AutoCare Tân Bình</span>
                <span className="text-[10px] text-slate-400">120 Trường Chinh, Tân Bình, TP.HCM</span>
              </td>
              <td className="py-3 px-4 font-medium">Kỹ sư Trần Văn Hưng</td>
              <td className="py-3 px-4 font-mono font-bold text-slate-600">097 3333 217</td>
              <td className="py-3 px-4">
                <span className="bg-amber-100 text-amber-800 font-black text-[10px] px-2 py-0.5 rounded-full border border-amber-200">
                  VÀNG (Gold)
                </span>
              </td>
              <td className="py-3 px-4 font-black text-sky-600">20%</td>
              <td className="py-3 px-4 font-bold">50.000.000 đ</td>
              <td className="py-3 px-4">
                <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                  <Check className="h-3 w-3" /> {dict.b2b.active}
                </span>
              </td>
            </tr>
            <tr className="hover:bg-slate-50 transition">
              <td className="py-3 px-4">
                <span className="font-bold text-slate-900 block">Gara Quang Vũ Q.5</span>
                <span className="text-[10px] text-slate-400">467 An Dương Vương, Q.5, TP.HCM</span>
              </td>
              <td className="py-3 px-4 font-medium">Nguyễn Quang Vũ</td>
              <td className="py-3 px-4 font-mono font-bold text-slate-600">090 9999 112</td>
              <td className="py-3 px-4">
                <span className="bg-sky-100 text-sky-800 font-black text-[10px] px-2 py-0.5 rounded-full border border-sky-200">
                  KIM CƯƠNG
                </span>
              </td>
              <td className="py-3 px-4 font-black text-sky-600">25%</td>
              <td className="py-3 px-4 font-bold">120.000.000 đ</td>
              <td className="py-3 px-4">
                <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                  <Check className="h-3 w-3" /> {dict.b2b.active}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
