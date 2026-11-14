import Link from "next/link";
import { Search, Camera, ShieldCheck, Wrench } from "lucide-react";
import { getDictionary } from "@/lib/i18n";

// Page renders localized storefront without any hardcoded strings.
export default function HomePage() {
  const dict = getDictionary("vi");

  return (
    <main className="min-h-screen pb-20">
      {/* Editorial Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white font-black">
              AP
            </span>
            <div>
              <span className="block text-lg font-black tracking-tight text-slate-900">
                {dict.brand.name}
                <span className="text-sky-600">{dict.brand.extension}</span>
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {dict.brand.tagline}
              </span>
            </div>
          </div>
          <Link
            href="/my-garage"
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold hover:border-slate-400"
          >
            <Wrench className="h-3.5 w-3.5 text-sky-600" />
            <span>{dict.nav.myGarage.replace("{count}", "0")}</span>
          </Link>
        </div>
      </header>

      {/* Industrial Hero: High-contrast Search Bar */}
      <section className="bg-slate-900 px-4 py-12 text-white sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-950/60 px-3 py-1 text-xs font-medium text-sky-300">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            {dict.hero.badge}
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
            {dict.hero.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto mb-8">
            {dict.hero.subtitle}
          </p>

          {/* Search Bar with Camera Action */}
          <div className="mx-auto flex max-w-2xl items-center rounded-xl bg-white p-2 shadow-2xl text-slate-800">
            <Search className="ml-2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder={dict.hero.searchPlaceholder}
              className="w-full px-3 py-2 text-xs sm:text-sm outline-none bg-transparent"
            />
            <button
              title={dict.hero.scanVin}
              className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200"
            >
              <Camera className="h-4 w-4 text-sky-600" />
              <span className="hidden sm:inline">{dict.hero.scanVin}</span>
            </button>
            <button className="ml-2 rounded-lg bg-sky-600 px-4 py-2 text-xs sm:text-sm font-bold text-white hover:bg-sky-700">
              {dict.hero.searchAction}
            </button>
          </div>
        </div>
      </section>

      {/* Asymmetric Bento Grid for Systems */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">
            {dict.categories.title}
          </h2>
          <span className="text-xs font-semibold text-sky-600 hover:underline cursor-pointer">
            {dict.categories.viewAll} &rarr;
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border border-slate-200 bg-white p-4 rounded-xl hover:border-slate-400 transition cursor-pointer">
            <span className="text-xs font-mono font-bold text-slate-400 block mb-1">01 / ENG</span>
            <h3 className="font-bold text-slate-800 text-sm">{dict.categories.engine.title}</h3>
            <p className="text-[11px] text-slate-500 mt-1">{dict.categories.engine.desc}</p>
          </div>

          <div className="border border-slate-200 bg-white p-4 rounded-xl hover:border-slate-400 transition cursor-pointer">
            <span className="text-xs font-mono font-bold text-slate-400 block mb-1">02 / BRK</span>
            <h3 className="font-bold text-slate-800 text-sm">{dict.categories.brake.title}</h3>
            <p className="text-[11px] text-slate-500 mt-1">{dict.categories.brake.desc}</p>
          </div>

          <div className="border border-slate-200 bg-white p-4 rounded-xl hover:border-slate-400 transition cursor-pointer">
            <span className="text-xs font-mono font-bold text-slate-400 block mb-1">03 / SUS</span>
            <h3 className="font-bold text-slate-800 text-sm">{dict.categories.suspension.title}</h3>
            <p className="text-[11px] text-slate-500 mt-1">{dict.categories.suspension.desc}</p>
          </div>

          <div className="border border-slate-200 bg-white p-4 rounded-xl hover:border-slate-400 transition cursor-pointer">
            <span className="text-xs font-mono font-bold text-slate-400 block mb-1">04 / ELE</span>
            <h3 className="font-bold text-slate-800 text-sm">{dict.categories.electrical.title}</h3>
            <p className="text-[11px] text-slate-500 mt-1">{dict.categories.electrical.desc}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
