"use client";

import { useState } from "react";
import { Search, Plus, ArrowUpRight } from "lucide-react";
import type { getDictionary } from "@/lib/i18n";

export interface InventoryPart {
  id: string;
  oem: string;
  name: string;
  brand: string;
  compatible: string;
  location: string;
  stock: number;
  minThreshold: number;
  price: number;
}

interface FitmentMatrixTableProps {
  dict: ReturnType<typeof getDictionary>;
  parts: InventoryPart[];
  onOpenAddModal: () => void;
}

// FitmentMatrixTable renders the catalog of SKUs mapped to multi-model vehicle fitment.
export default function FitmentMatrixTable({
  dict,
  parts,
  onOpenAddModal,
}: FitmentMatrixTableProps) {
  const [partSearch, setPartSearch] = useState<string>("");

  const filteredParts = parts.filter((p) => {
    if (partSearch.trim()) {
      const q = partSearch.toLowerCase().trim();
      return (
        p.oem.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.compatible.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {dict.fitment.title}
          </h1>
          <p className="text-xs text-slate-500">{dict.fitment.subtitle}</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 rounded-xl bg-sky-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-sky-500 shadow-xs transition"
          >
            <Plus className="h-3.5 w-3.5" /> {dict.fitment.addPart}
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3 max-w-md">
        <div className="flex items-center gap-2 w-full">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={partSearch}
            onChange={(e) => setPartSearch(e.target.value)}
            placeholder={dict.fitment.filterPlaceholder}
            className="w-full outline-hidden text-xs text-slate-800"
          />
        </div>
      </div>

      {/* Fitment Matrix Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200 font-bold">
              <tr>
                <th className="py-2.5 px-4">{dict.fitment.table.oem}</th>
                <th className="py-2.5 px-4">{dict.fitment.table.name}</th>
                <th className="py-2.5 px-4">{dict.fitment.table.origin}</th>
                <th className="py-2.5 px-4">{dict.fitment.table.compatible}</th>
                <th className="py-2.5 px-4">{dict.fitment.table.location}</th>
                <th className="py-2.5 px-4">{dict.fitment.table.stock}</th>
                <th className="py-2.5 px-4 text-right">{dict.fitment.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredParts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-mono font-bold text-sky-700">{p.oem}</td>
                  <td className="py-3 px-4 font-medium">{p.name}</td>
                  <td className="py-3 px-4">{p.brand}</td>
                  <td className="py-3 px-4">
                    <span className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px]">
                      {p.compatible}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">{p.location}</td>
                  <td className="py-3 px-4 font-bold text-emerald-600">
                    {p.stock} {dict.fitment.table.unit}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      className="text-sky-600 hover:text-sky-800 font-semibold inline-flex items-center gap-1"
                    >
                      {dict.fitment.table.edit} <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
