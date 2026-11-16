"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ShieldAlert, Lock, ArrowRight, Loader2 } from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import { adminAuthApi } from "@/lib/api";
import { useAdminAuth } from "@/features/auth/useAdminAuth";

// DangNhapPage serves admin and staff authentication at /dang-nhap.
export default function DangNhapPage() {
  const router = useRouter();
  const dict = getDictionary("vi");
  const setAdmin = useAdminAuth((s) => s.setAdmin);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await adminAuthApi.login({ email, password });
      if (res.user.role !== "ADMIN" && res.user.role !== "STAFF") {
        await adminAuthApi.logout();
        setErrorMsg(dict.auth.errors.unauthorizedRole);
        return;
      }

      setAdmin(res.user);
      router.push("/");
    } catch (err: unknown) {
      const apiErr = err as { code?: string; message?: string };
      if (apiErr.code === "INVALID_CREDENTIALS") {
        setErrorMsg(dict.auth.errors.invalidCredentials);
      } else if (apiErr.code === "FORBIDDEN") {
        setErrorMsg(dict.auth.errors.unauthorizedRole);
      } else {
        setErrorMsg(dict.auth.errors.networkError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-slate-100 antialiased">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-sky-600 text-white font-black text-xl mb-4 shadow-lg shadow-sky-600/30">
          <Lock className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white uppercase">
          {dict.auth.loginTitle}
        </h1>
        <p className="mt-2 text-xs text-slate-400">
          {dict.auth.loginSubtitle}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
          {errorMsg && (
            <div className="mb-6 rounded-lg bg-red-950/80 border border-red-800 p-3.5 flex items-center gap-2.5 text-xs text-red-300">
              <ShieldAlert className="h-4 w-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
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
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                {dict.auth.passwordLabel}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={dict.auth.passwordPlaceholder}
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-sky-600 py-2.5 px-4 text-xs sm:text-sm font-bold text-white hover:bg-sky-500 transition disabled:opacity-50 mt-4 shadow-md shadow-sky-600/20"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{dict.auth.loading}</span>
                </>
              ) : (
                <>
                  <span>{dict.auth.loginButton}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-800 pt-4 flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>Xác thực an toàn RBAC với tiền tố API /admin</span>
          </div>
        </div>
      </div>
    </div>
  );
}

