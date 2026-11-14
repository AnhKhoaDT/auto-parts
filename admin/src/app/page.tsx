import {
  Car,
  Boxes,
  ClipboardCheck,
  Users,
  BarChart3,
  Search,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { getDictionary } from "@/lib/i18n";

// AdminDashboard renders key metrics and vehicle fitment mapping workspace without hardcoded text.
export default function AdminDashboard() {
  const dict = getDictionary("vi");

  return (
    <div className="flex min-h-screen">
      {/* High-density Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900 p-4 text-slate-300">
        <div className="flex items-center gap-2 px-2 py-3 mb-6 border-b border-slate-800">
          <span className="flex h-7 w-7 items-center justify-center rounded bg-sky-500 font-bold text-white text-xs">
            AP
          </span>
          <span className="font-bold text-sm tracking-wide text-white">
            {dict.brand.title}
          </span>
        </div>

        <nav className="space-y-1 text-xs">
          <a href="#" className="flex items-center gap-3 rounded-lg bg-sky-600/20 px-3 py-2 text-sky-400 font-semibold">
            <Car className="h-4 w-4" /> {dict.nav.vehicles}
          </a>
          <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-800 text-slate-400 hover:text-white">
            <Boxes className="h-4 w-4" /> {dict.nav.inventory}
          </a>
          <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-800 text-slate-400 hover:text-white">
            <ClipboardCheck className="h-4 w-4" /> {dict.nav.orders}
          </a>
          <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-800 text-slate-400 hover:text-white">
            <Users className="h-4 w-4" /> {dict.nav.b2b}
          </a>
          <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-800 text-slate-400 hover:text-white">
            <BarChart3 className="h-4 w-4" /> {dict.nav.analytics}
          </a>
        </nav>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 p-6">
        {/* Top Operational Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {dict.fitment.title}
            </h1>
            <p className="text-xs text-slate-500">
              {dict.fitment.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
              {dict.fitment.importExcel}
            </button>
            <button className="flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-700">
              <Plus className="h-3.5 w-3.5" /> {dict.fitment.addPart}
            </button>
          </div>
        </div>

        {/* Operational Filter Table */}
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500 w-80">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder={dict.fitment.filterPlaceholder}
                className="w-full outline-none text-xs text-slate-800"
              />
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {dict.fitment.recordCount.replace("{count}", "1,248")}
            </span>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="py-2.5 px-4 font-bold">{dict.fitment.table.oem}</th>
                <th className="py-2.5 px-4 font-bold">{dict.fitment.table.name}</th>
                <th className="py-2.5 px-4 font-bold">{dict.fitment.table.origin}</th>
                <th className="py-2.5 px-4 font-bold">{dict.fitment.table.compatible}</th>
                <th className="py-2.5 px-4 font-bold">{dict.fitment.table.location}</th>
                <th className="py-2.5 px-4 font-bold">{dict.fitment.table.stock}</th>
                <th className="py-2.5 px-4 font-bold text-right">{dict.fitment.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-mono font-bold text-sky-700">04465-0D150</td>
                <td className="py-3 px-4 font-medium">Bộ má phanh đĩa trước</td>
                <td className="py-3 px-4">Denso (Nhật Bản)</td>
                <td className="py-3 px-4">
                  <span className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px]">
                    Toyota Vios 2014-2022 (4 {dict.fitment.table.variants})
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-slate-500">HN-A2-K03</td>
                <td className="py-3 px-4 font-bold text-emerald-600">48 {dict.fitment.table.unit}</td>
                <td className="py-3 px-4 text-right">
                  <button className="text-sky-600 hover:text-sky-800 font-semibold inline-flex items-center gap-1">
                    {dict.fitment.table.edit} <ArrowUpRight className="h-3 w-3" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
