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
  X,
  Wrench,
  CheckCircle2,
  ShieldCheck,
  KeyRound,
} from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import { authApi } from "@/lib/api";
import { useAuth } from "@/features/auth/useAuth";

// DangNhapPage serves the primary customer and garage login experience at /dang-nhap.
export default function DangNhapPage() {
  const router = useRouter();
  const dict = getDictionary("vi");
  const setUser = useAuth((s) => s.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await authApi.login({ email, password });
      setUser(res.user);
      router.push("/");
    } catch (err: unknown) {
      const apiErr = err as { code?: string; message?: string };
      if (apiErr.code === "INVALID_CREDENTIALS") {
        setErrorMsg(dict.auth.errors.invalidCredentials);
      } else {
        setErrorMsg(dict.auth.errors.networkError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotEmail) {
      setForgotSubmitted(true);
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
          <div className="hidden lg:block mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-sky-400 transition mb-6"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>{dict.auth.backToHome}</span>
            </Link>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
              {dict.auth.loginTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {dict.auth.loginSubtitle}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-5 rounded-xl bg-red-950/80 border border-red-800 p-3.5 flex items-center gap-3 text-xs text-red-200">
              <ShieldAlert className="h-4 w-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
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
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {dict.auth.passwordLabel}
                </label>
                <Link
                  href="/quen-mat-khau"
                  className="text-xs text-sky-400 hover:text-sky-300 transition font-medium"
                >
                  {dict.auth.forgotPassword}
                </Link>
              </div>

              {/* Password Input with Eye Visibility Toggle Button */}
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

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-sky-600 focus:ring-sky-500 focus:ring-offset-slate-950"
                />
                <span className="text-xs text-slate-400">
                  {dict.auth.rememberMe}
                </span>
              </label>
            </div>

            {/* Mobile Thumb-Zone Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] flex items-center justify-center gap-2 rounded-xl bg-sky-600 py-3 px-4 text-sm font-bold text-white hover:bg-sky-500 active:bg-sky-700 transition shadow-lg shadow-sky-600/20 disabled:opacity-50 mt-4"
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

          <div className="mt-8 border-t border-slate-800/80 pt-6 text-center text-xs text-slate-400">
            <span>{dict.auth.noAccount} </span>
            <Link
              href="/dang-ky"
              className="font-bold text-sky-400 hover:text-sky-300 transition inline-block py-1 px-1"
            >
              {dict.auth.registerNow} &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-sky-600/20 text-sky-400 border border-sky-500/30">
                <KeyRound className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                {dict.auth.forgotModal.title}
              </h3>
            </div>

            {forgotSubmitted ? (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-200 leading-relaxed">
                  {dict.auth.forgotModal.sentSuccess}
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full min-h-[44px] rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition"
                >
                  {dict.auth.forgotModal.close}
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  {dict.auth.forgotModal.desc}
                </p>

                <div>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder={dict.auth.emailPlaceholder}
                    className="w-full min-h-[44px] rounded-xl bg-slate-950 border border-slate-700 px-4 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 min-h-[44px] rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition"
                  >
                    {dict.auth.forgotModal.close}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 min-h-[44px] rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-500 transition shadow-sm"
                  >
                    {dict.auth.forgotModal.submit}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

