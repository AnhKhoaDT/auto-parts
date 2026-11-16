"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { getDictionary } from "@/lib/i18n";
import type { InventoryPart } from "./FitmentMatrixTable";

interface AddPartModalProps {
  dict: ReturnType<typeof getDictionary>;
  isOpen: boolean;
  onClose: () => void;
  onAddPart: (part: InventoryPart) => void;
}

// AddPartModal provides a form to register new parts and their cross-compatible car models.
export default function AddPartModal({
  dict,
  isOpen,
  onClose,
  onAddPart,
}: AddPartModalProps) {
  const [oem, setOem] = useState("");
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("Denso Japan");
  const [compatible, setCompatible] = useState("");
  const [location, setLocation] = useState("HCM-A1-K01");
  const [stock, setStock] = useState(20);
  const [price, setPrice] = useState(350000);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oem.trim() || !name.trim()) return;

    onAddPart({
      id: `p-${Date.now()}`,
      oem: oem.trim(),
      name: name.trim(),
      brand,
      compatible: compatible.trim() || "Toyota, Honda phổ biến",
      location: location.trim(),
      stock: Number(stock) || 1,
      minThreshold: 5,
      price: Number(price) || 100000,
    });

    setOem("");
    setName("");
    setCompatible("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 text-slate-900">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-black uppercase text-slate-900 tracking-wider">
            Thêm Mã Phụ Tùng Mới Vào Kho
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="my-4 space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Mã OEM gốc *</label>
            <input
              type="text"
              required
              value={oem}
              onChange={(e) => setOem(e.target.value)}
              placeholder="VD: 04465-0D150 hoặc 90919-01253"
              className="w-full h-9 px-3 rounded-xl border border-slate-300 font-mono font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Tên phụ tùng *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Bộ má phanh trước Denso Japan"
              className="w-full h-9 px-3 rounded-xl border border-slate-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Hãng sản xuất</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full h-9 px-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="Denso Japan">Denso Japan</option>
                <option value="Bosch Germany">Bosch Germany</option>
                <option value="KYB Japan">KYB Japan</option>
                <option value="Aisin Japan">Aisin Japan</option>
                <option value="555 Sankei">555 Sankei</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Vị trí kệ kho</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="VD: HCM-A2-K03"
                className="w-full h-9 px-3 rounded-xl border border-slate-300 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Dòng xe tương thích</label>
            <input
              type="text"
              value={compatible}
              onChange={(e) => setCompatible(e.target.value)}
              placeholder="VD: Toyota Vios 2014-2023, Yaris"
              className="w-full h-9 px-3 rounded-xl border border-slate-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Số lượng nhập ban đầu</label>
              <input
                type="number"
                min={1}
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full h-9 px-3 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Giá bán lẻ (VNĐ)</label>
              <input
                type="number"
                step={10000}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full h-9 px-3 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex gap-2">
            <button
              type="submit"
              className="flex-1 min-h-[40px] rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-xs transition"
            >
              Lưu Phụ Tùng Vào Kho
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 min-h-[40px] rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
