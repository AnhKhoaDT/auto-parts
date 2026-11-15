"use client";

import { useState } from "react";
import { User as UserIcon, Building2, CheckCircle2 } from "lucide-react";
import type { getDictionary } from "@/lib/i18n";
import type { User } from "@/lib/api";

interface UserProfileTabProps {
  dict: ReturnType<typeof getDictionary>;
  user: User | null;
}

// UserProfileTab renders member contact information and wholesale tier level.
export default function UserProfileTab({ dict, user }: UserProfileTabProps) {
  const [address, setAddress] = useState(
    "Số 467 An Dương Vương, Phường Chợ Quán, Quận 5, TP. Hồ Chí Minh"
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900">{dict.hoSoPage.tabProfile}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{dict.hoSoPage.personalIntro}</p>
        </div>
        {saveSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{dict.hoSoPage.savedSuccess}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">{dict.auth.fullNameLabel}</label>
          <input
            type="text"
            readOnly
            value={user?.full_name || "Nguyễn Văn Khách"}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">{dict.auth.emailLabel}</label>
          <input
            type="email"
            readOnly
            value={user?.email || "khachhang@autoparts.store"}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">{dict.auth.phoneLabel}</label>
          <input
            type="text"
            readOnly
            value={user?.phone || "097 3333 217"}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Cấp độ tài khoản</label>
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-sky-700">
            {user?.role === "GARAGE" ? (
              <>
                <Building2 className="h-4 w-4 text-amber-600" />
                <span>Gara Sửa Chữa Đối Tác (B2B) - Chiết khấu 15-25%</span>
              </>
            ) : (
              <>
                <UserIcon className="h-4 w-4 text-sky-600" />
                <span>Chủ Xe Cá Nhân (B2C) - Bảo hành chính hãng 12T</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">{dict.hoSoPage.address}</label>
        <textarea
          rows={3}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Nhập địa chỉ nhà riêng hoặc địa chỉ gara nhận phụ tùng hỏa tốc..."
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:border-sky-600 outline-none"
        />
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-sm"
        >
          {dict.hoSoPage.saveProfile}
        </button>
      </div>
    </form>
  );
}
