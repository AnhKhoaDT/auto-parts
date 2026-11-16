"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound, ArrowRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import { getDictionary } from "@/lib/i18n";

// QuenMatKhauPage handles password recovery initiation at /quen-mat-khau.
export default function QuenMatKhauPage() {
  const dict = getDictionary("vi");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-slate-100 antialiased">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          href="/dang-nhap"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-sky-400 transition mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Quay lại đăng nhập</span>
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-sky-600/20 text-sky-400 border border-sky-500/30">
            <KeyRound className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {dict.auth.forgotModal.title}
            </h1>
            <p className="text-xs text-slate-400">
              {dict.auth.forgotModal.desc}
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {submitted ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-200 leading-relaxed flex items-start gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{dict.auth.forgotModal.sentSuccess}</span>
              </div>
              <Link
                href="/dang-nhap"
                className="w-full min-h-[44px] rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center justify-center transition"
              >
                Trở về trang Đăng nhập
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  {dict.auth.emailLabel}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={dict.auth.emailPlaceholder}
                  className="w-full min-h-[46px] rounded-xl bg-slate-950 border border-slate-700 px-4 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[46px] rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5"
              >
                <span>{dict.auth.forgotModal.submit}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

