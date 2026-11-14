"use client";

import type { getDictionary } from "@/lib/i18n";

interface CategoriesGridProps {
  dict: ReturnType<typeof getDictionary>;
}

// CategoriesGrid renders the automotive mechanical systems in high-contrast bento cards.
export default function CategoriesGrid({ dict }: CategoriesGridProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            {dict.categories.title}
          </h2>
          <span className="text-xs text-slate-500">
            Tra cứu linh kiện theo từng hệ thống cơ cấu hoạt động
          </span>
        </div>
        <span className="text-xs font-bold text-sky-600 hover:text-sky-700 cursor-pointer">
          {dict.categories.viewAll} &rarr;
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="border border-slate-200 bg-white p-4 rounded-2xl hover:border-sky-500 hover:shadow-md transition cursor-pointer group shadow-xs">
          <span className="text-[10px] font-mono font-bold text-slate-400 block mb-1 group-hover:text-sky-600 transition">
            01 / ENG
          </span>
          <h3 className="font-bold text-slate-900 text-sm">{dict.categories.engine.title}</h3>
          <p className="text-[11px] text-slate-500 mt-1 leading-snug">{dict.categories.engine.desc}</p>
        </div>

        <div className="border border-slate-200 bg-white p-4 rounded-2xl hover:border-sky-500 hover:shadow-md transition cursor-pointer group shadow-xs">
          <span className="text-[10px] font-mono font-bold text-slate-400 block mb-1 group-hover:text-sky-600 transition">
            02 / BRK
          </span>
          <h3 className="font-bold text-slate-900 text-sm">{dict.categories.brake.title}</h3>
          <p className="text-[11px] text-slate-500 mt-1 leading-snug">{dict.categories.brake.desc}</p>
        </div>

        <div className="border border-slate-200 bg-white p-4 rounded-2xl hover:border-sky-500 hover:shadow-md transition cursor-pointer group shadow-xs">
          <span className="text-[10px] font-mono font-bold text-slate-400 block mb-1 group-hover:text-sky-600 transition">
            03 / SUS
          </span>
          <h3 className="font-bold text-slate-900 text-sm">{dict.categories.suspension.title}</h3>
          <p className="text-[11px] text-slate-500 mt-1 leading-snug">{dict.categories.suspension.desc}</p>
        </div>

        <div className="border border-slate-200 bg-white p-4 rounded-2xl hover:border-sky-500 hover:shadow-md transition cursor-pointer group shadow-xs">
          <span className="text-[10px] font-mono font-bold text-slate-400 block mb-1 group-hover:text-sky-600 transition">
            04 / ELE
          </span>
          <h3 className="font-bold text-slate-900 text-sm">{dict.categories.electrical.title}</h3>
          <p className="text-[11px] text-slate-500 mt-1 leading-snug">{dict.categories.electrical.desc}</p>
        </div>
      </div>
    </section>
  );
}

