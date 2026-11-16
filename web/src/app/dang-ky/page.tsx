"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  ShieldAlert,
  ArrowRight,
  Loader2,
  ChevronLeft,
  User as UserIcon,
  Building2,
  Wrench,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import { authApi } from "@/lib/api";
import { useAuth } from "@/features/auth/useAuth";

// DangKyPage registers retail car owners and automotive repair garages at /dang-ky.
export default function DangKyPage() {
  const router = useRouter();
  const dict = getDictionary("vi");
  const setUser = useAuth((s) => s.setUser);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"CUSTOMER" | "GARAGE">("CUSTOMER");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password.length < 8) {
      setErrorMsg(dict.auth.errors.weakPassword);
      return;
    }

    setLoading(true);

    try {
      const res = await authApi.register({
        email,
        password,
        full_name: fullName,
        phone: phone || undefined,
        role,
      });
      setUser(res.user);
      router.push("/");
    } catch (err: unknown) {
      const apiErr = err as { code?: string; message?: string };
      if (apiErr.code === "EMAIL_EXISTS") {
        setErrorMsg(dict.auth.errors.emailExists);
      } else if (apiErr.code === "WEAK_PASSWORD") {
        setErrorMsg(dict.auth.errors.weakPassword);
      } else {
        setErrorMsg(dict.auth.errors.networkError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:grid lg:grid-cols-12 text-slate-100 antialiased">
      {/* Left Column: Automotive Editorial Showcase (Desktop Only) */}
      <div className="hidden lg:flex lg:col-span-5 bg-slate-900 border-r border-slate-800 p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-white font-black text-base shadow-sm">
                KV
              </span>
              <span className="text-xl font-black tracking-tight text-white">
                {dict.brand.name}
                <span className="text-sky-400">{dict.brand.extension}</span>
              </span>
            </Link>
          </div>

          <div className="mb-4">
            <span className="inline-block text-[10px] font-mono font-bold tracking-widest text-sky-400 bg-sky-950/80 border border-sky-800/60 px-3 py-1 rounded-full uppercase">
              {dict.auth.showcase.tag}
            </span>
          </div>

          <h2 className="text-2xl xl:text-3xl font-extrabold tracking-tight text-white leading-tight mb-8">
            {dict.auth.showcase.heading}
          </h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-sky-400 border border-slate-700">
                <Wrench className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">
                  {dict.auth.showcase.feature1Title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {dict.auth.showcase.feature1Desc}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-emerald-400 border border-slate-700">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">
                  {dict.auth.showcase.feature2Title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {dict.auth.showcase.feature2Desc}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-amber-400 border border-slate-700">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">
                  {dict.auth.showcase.feature3Title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {dict.auth.showcase.feature3Desc}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 flex justify-between items-center">
          <span>{dict.brand.tagline}</span>
          <span className="font-mono">KV Auto v1.0</span>
        </div>
      </div>

      {/* Right Column: Ergonomic Form Workspace */}
      <div className="flex-1 lg:col-span-7 flex flex-col justify-center px-4 py-8 sm:px-8 lg:px-16 xl:px-24">
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-8 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600 text-white font-black text-xs">
              KV
            </span>
            <span className="font-black text-sm text-white">
              {dict.brand.name}
              <span className="text-sky-400">{dict.brand.extension}</span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>{dict.auth.backToHome}</span>
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto">
          <div className="hidden lg:block mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-sky-400 transition"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>{dict.auth.backToHome}</span>
            </Link>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
              {dict.auth.registerTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {dict.auth.registerSubtitle}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-5 rounded-xl bg-red-950/80 border border-red-800 p-3.5 flex items-center gap-3 text-xs text-red-200">
              <ShieldAlert className="h-4 w-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Account Type Selector Bento Cards */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                {dict.auth.accountTypeLabel}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("CUSTOMER")}
                  className={`flex flex-col text-left p-3.5 rounded-xl border transition ${
                    role === "CUSTOMER"
                      ? "border-sky-500 bg-sky-950/60 text-white ring-1 ring-sky-500"
                      : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <UserIcon className={`h-4 w-4 ${role === "CUSTOMER" ? "text-sky-400" : "text-slate-500"}`} />
                    <span className="text-xs font-bold">{dict.auth.roleCustomer}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    {dict.auth.roleCustomerDesc}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("GARAGE")}
                  className={`flex flex-col text-left p-3.5 rounded-xl border transition ${
                    role === "GARAGE"
                      ? "border-amber-500 bg-amber-950/40 text-white ring-1 ring-amber-500"
                      : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className={`h-4 w-4 ${role === "GARAGE" ? "text-amber-400" : "text-slate-500"}`} />
                    <span className="text-xs font-bold">{dict.auth.roleGarage}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    {dict.auth.roleGarageDesc}
                  </p>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                {dict.auth.fullNameLabel}
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={dict.auth.fullNamePlaceholder}
                className="w-full min-h-[46px] rounded-xl bg-slate-900 border border-slate-800 px-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
              />
            </div>

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
                className="w-full min-h-[46px] rounded-xl bg-slate-900 border border-slate-800 px-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                {dict.auth.phoneLabel}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={dict.auth.phonePlaceholder}
                className="w-full min-h-[46px] rounded-xl bg-slate-900 border border-slate-800 px-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                {dict.auth.passwordLabel}
              </label>
              {/* Password with Eye Visibility Toggle Button */}
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={dict.auth.passwordPlaceholder}
                  className="w-full min-h-[46px] rounded-xl bg-slate-900 border border-slate-800 pl-4 pr-12 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
                />
                <button
                  type="button"
                  aria-label={showPassword ? dict.auth.hidePassword : dict.auth.showPassword}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 bottom-0 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-slate-200 transition"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Thumb-Zone Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] flex items-center justify-center gap-2 rounded-xl bg-sky-600 py-3 px-4 text-sm font-bold text-white hover:bg-sky-500 active:bg-sky-700 transition shadow-lg shadow-sky-600/20 disabled:opacity-50 mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{dict.auth.loading}</span>
                </>
              ) : (
                <>
                  <span>{dict.auth.registerButton}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 border-t border-slate-800/80 pt-6 text-center text-xs text-slate-400">
            <span>{dict.auth.hasAccount} </span>
            <Link
              href="/dang-nhap"
              className="font-bold text-sky-400 hover:text-sky-300 transition inline-block py-1 px-1"
            >
              {dict.auth.loginNow} &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

