"use client";

import { useState } from "react";
import {
  Building2,
  X,
  Sparkles,
  Phone,
  Clock,
  Truck,
  Upload,
  CheckCircle2,
  FileText,
  Send,
  MessageSquare,
} from "lucide-react";
import type { getDictionary } from "@/lib/i18n";

interface FastQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  dict: ReturnType<typeof getDictionary>;
  initialCar?: string;
}

// FastQuoteModal enables B2B workshops and garages to request rapid wholesale parts quotes within 5 minutes.
export default function FastQuoteModal({
  isOpen,
  onClose,
  dict,
  initialCar = "",
}: FastQuoteModalProps) {
  const qdict = dict.fastQuote;

  const [garageName, setGarageName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleInfo, setVehicleInfo] = useState(initialCar);
  const [partList, setPartList] = useState("");
  const [isUrgent, setIsUrgent] = useState(true);
  const [attachedFile, setAttachedFile] = useState<string | null>(null);

  const [ticketCode, setTicketCode] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!garageName.trim() || !phone.trim() || !partList.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const code = `QUOTE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setTicketCode(code);
      setIsSubmitting(false);

      // Persist quote request to localStorage for offline resilience
      try {
        const raw = localStorage.getItem("kv_b2b_quotes");
        const list = raw ? JSON.parse(raw) : [];
        list.unshift({
          code,
          garageName,
          phone,
          vehicleInfo,
          partList,
          isUrgent,
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem("kv_b2b_quotes", JSON.stringify(list));
      } catch {
        // Fail-safe
      }
    }, 600);
  };

  const handleResetAndClose = () => {
    setTicketCode(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <span>{qdict.title}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                  B2B
                </span>
              </h2>
              <p className="text-[11px] text-slate-500">{qdict.subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {ticketCode ? (
          /* Success Screen */
          <div className="p-6 text-center space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">{qdict.successTitle}</h3>
              <p className="text-xs text-slate-500 mt-1">
                {qdict.successDesc} <strong className="text-sky-700 font-mono text-sm">{ticketCode}</strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-900 font-medium text-left space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-sky-950">
                <Clock className="h-4 w-4 text-sky-600" />
                <span>Cam kết phản hồi trong 5 phút</span>
              </div>
              <p>{qdict.successNote}</p>
              <div className="pt-2 border-t border-sky-200/60 flex items-center justify-between text-[11px] text-slate-600">
                <span>Hotline B2B Gara: <strong>097 3333 217</strong></span>
                <span className="text-emerald-700 font-bold">Zalo Online 24/7</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetAndClose}
              className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-sm"
            >
              {qdict.close}
            </button>
          </div>
        ) : (
          /* Quote Request Form */
          <form onSubmit={handleSubmit} className="px-6 py-4 overflow-y-auto space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {qdict.garageName} *
                </label>
                <input
                  type="text"
                  required
                  value={garageName}
                  onChange={(e) => setGarageName(e.target.value)}
                  placeholder="Gara AutoCare / Anh Dũng"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-sky-600 text-xs font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {qdict.phone} *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="098 xxxx xxx"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-sky-600 text-xs font-semibold outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {qdict.vehicleInfo}
              </label>
              <input
                type="text"
                value={vehicleInfo}
                onChange={(e) => setVehicleInfo(e.target.value)}
                placeholder="Toyota Vios (2021) 1.5L hoặc 17 ký tự VIN..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-sky-600 text-xs font-semibold outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {qdict.partList} *
              </label>
              <textarea
                rows={3}
                required
                value={partList}
                onChange={(e) => setPartList(e.target.value)}
                placeholder={qdict.partPlaceholder}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-sky-600 text-xs font-semibold outline-none"
              />
            </div>

            {/* Photo attachment simulation */}
            <div className="p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <Upload className="h-4 w-4 text-sky-600" />
                <span className="text-[11px] font-medium">
                  {attachedFile || qdict.uploadPhoto}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAttachedFile("so-dang-kiem-vios-2021.jpg")}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-bold hover:bg-slate-100 transition shadow-2xs"
              >
                {attachedFile ? "Đã đính kèm" : "Chọn ảnh mẫu"}
              </button>
            </div>

            {/* Express 2H checkbox */}
            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 cursor-pointer">
              <input
                type="checkbox"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                className="rounded border-amber-300 text-amber-600 focus:ring-amber-500 h-4 w-4"
              />
              <div className="text-xs">
                <span className="font-bold text-amber-900 flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5 text-amber-600" />
                  <span>{qdict.urgent2h}</span>
                </span>
              </div>
            </label>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isSubmitting ? "Đang gửi..." : qdict.submit}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
