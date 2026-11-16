"use client";

import type { getDictionary } from "@/lib/i18n";

interface BrandsGridProps {
  dict: ReturnType<typeof getDictionary>;
}

// BrandsGrid renders authorized OEM manufacturer badges in a crisp, light grid.
export default function BrandsGrid({ dict }: BrandsGridProps) {
  return (
    <section className="border-t border-slate-200 pt-8">
      <div className="mb-5">
        <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
          {dict.brands.title}
        </h2>
        <p className="text-xs text-slate-500">{dict.brands.subtitle}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-left hover:border-sky-400 hover:shadow-xs transition">
          <span className="text-sm font-black text-slate-900 block mb-1">DENSO</span>
          <p className="text-[10px] text-slate-500 leading-tight">{dict.brands.denso}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-left hover:border-sky-400 hover:shadow-xs transition">
          <span className="text-sm font-black text-slate-900 block mb-1">AISIN</span>
          <p className="text-[10px] text-slate-500 leading-tight">{dict.brands.aisin}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-left hover:border-sky-400 hover:shadow-xs transition">
          <span className="text-sm font-black text-slate-900 block mb-1">KYB</span>
          <p className="text-[10px] text-slate-500 leading-tight">{dict.brands.kyb}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-left hover:border-sky-400 hover:shadow-xs transition">
          <span className="text-sm font-black text-slate-900 block mb-1">555 SANKEI</span>
          <p className="text-[10px] text-slate-500 leading-tight">{dict.brands.sankei}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-left hover:border-sky-400 hover:shadow-xs transition">
          <span className="text-sm font-black text-slate-900 block mb-1">BOSCH</span>
          <p className="text-[10px] text-slate-500 leading-tight">{dict.brands.bosch}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-left hover:border-sky-400 hover:shadow-xs transition">
          <span className="text-sm font-black text-slate-900 block mb-1">BREMBO</span>
          <p className="text-[10px] text-slate-500 leading-tight">{dict.brands.brembo}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-left hover:border-sky-400 hover:shadow-xs transition">
          <span className="text-sm font-black text-slate-900 block mb-1">TOKICO</span>
          <p className="text-[10px] text-slate-500 leading-tight">{dict.brands.tokico}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-left hover:border-sky-400 hover:shadow-xs transition">
          <span className="text-sm font-black text-slate-900 block mb-1">GATES</span>
          <p className="text-[10px] text-slate-500 leading-tight">{dict.brands.gates}</p>
        </div>
      </div>
    </section>
  );
}

