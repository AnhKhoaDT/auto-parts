"use client";

import { useState } from "react";
import { Plus, CheckCircle2, Sparkles, Car, Check, Trash2 } from "lucide-react";
import type { getDictionary } from "@/lib/i18n";
import type { UserVehicle } from "@/lib/api";

interface GarageVehicleTabProps {
  dict: ReturnType<typeof getDictionary>;
  vehicles: UserVehicle[];
  activeCarFilter: string;
  onApplyCar: (carString: string) => void;
  onDeleteCar: (vehicleId: string) => void;
  onAddCar: (newCar: {
    make: string;
    model: string;
    year: number;
    engine: string;
    license_plate?: string;
    vin?: string;
    nickname?: string;
  }) => Promise<void>;
}

// GarageVehicleTab renders customer garage vehicles, default filter selection, and new vehicle registration.
export default function GarageVehicleTab({
  dict,
  vehicles,
  activeCarFilter,
  onApplyCar,
  onDeleteCar,
  onAddCar,
}: GarageVehicleTabProps) {
  const [isAddingCar, setIsAddingCar] = useState(false);
  const [carMessage, setCarMessage] = useState<string | null>(null);

  const [make, setMake] = useState("Toyota");
  const [model, setModel] = useState("Vios");
  const [year, setYear] = useState(2021);
  const [engine, setEngine] = useState("1.5L 2NR-FE (Xăng)");
  const [licensePlate, setLicensePlate] = useState("");
  const [vin, setVin] = useState("");
  const [nickname, setNickname] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddCar({
      make,
      model,
      year,
      engine,
      license_plate: licensePlate.trim() || undefined,
      vin: vin.trim().toUpperCase() || undefined,
      nickname: nickname.trim() || undefined,
    });

    setCarMessage("Đã lưu xe mới vào Garage thành công!");
    setIsAddingCar(false);
    setTimeout(() => setCarMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              {dict.hoSoPage.tabGarage}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {dict.hoSoPage.garageIntro}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddingCar(!isAddingCar)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shrink-0 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>{dict.hoSoPage.addNewCar}</span>
          </button>
        </div>

        {carMessage && (
          <div className="mt-4 p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-sky-600 shrink-0" />
            <span>{carMessage}</span>
          </div>
        )}

        {/* Add New Car Form Card */}
        {isAddingCar && (
          <form onSubmit={handleSubmit} className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-sky-600" />
              <span>{dict.hoSoPage.addNewCar}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">{dict.hoSoPage.year}</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  min={1990}
                  max={2026}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold focus:border-sky-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">{dict.hoSoPage.make}</label>
                <select
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold focus:border-sky-600 outline-none"
                >
                  <option value="Toyota">Toyota</option>
                  <option value="Honda">Honda</option>
                  <option value="Mazda">Mazda</option>
                  <option value="Hyundai">Hyundai</option>
                  <option value="Kia">Kia</option>
                  <option value="Ford">Ford</option>
                  <option value="Mitsubishi">Mitsubishi</option>
                  <option value="Mercedes-Benz">Mercedes-Benz</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">{dict.hoSoPage.model}</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Vios / City / Ranger..."
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold focus:border-sky-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">{dict.hoSoPage.engine}</label>
                <input
                  type="text"
                  value={engine}
                  onChange={(e) => setEngine(e.target.value)}
                  placeholder="1.5L 2NR-FE"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold focus:border-sky-600 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">{dict.hoSoPage.licensePlate}</label>
                <input
                  type="text"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  placeholder="VD: 51H-123.45"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold focus:border-sky-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">{dict.hoSoPage.vinNumber}</label>
                <input
                  type="text"
                  value={vin}
                  onChange={(e) => setVin(e.target.value)}
                  maxLength={17}
                  placeholder="17 ký tự số khung"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold focus:border-sky-600 outline-none uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Gợi nhớ / Tên gọi xe</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="VD: Xe nhà / Xe Gara 01"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold focus:border-sky-600 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-xs"
              >
                {dict.hoSoPage.saveCar}
              </button>
              <button
                type="button"
                onClick={() => setIsAddingCar(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition"
              >
                {dict.hoSoPage.cancel}
              </button>
            </div>
          </form>
        )}

        {/* Vehicles List */}
        <div className="mt-6 space-y-4">
          {vehicles.map((v) => {
            const formatted = `${v.make} ${v.model} (${v.year}) ${v.engine}`;
            const isCurrentlyFiltering = activeCarFilter.includes(v.model) && activeCarFilter.includes(v.make);

            return (
              <div
                key={v.id}
                className={`p-4 sm:p-5 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCurrentlyFiltering
                    ? "border-sky-500 bg-sky-50/40 ring-1 ring-sky-500/30"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-sky-100/80 text-sky-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Car className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{formatted}</h3>
                      {v.nickname && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                          {v.nickname}
                        </span>
                      )}
                      {v.is_default && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                          {dict.hoSoPage.defaultVehicle}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-slate-500 font-mono">
                      {v.license_plate && (
                        <span>
                          Biển số: <strong className="text-slate-800">{v.license_plate}</strong>
                        </span>
                      )}
                      {v.vin && (
                        <span>
                          VIN: <strong className="text-slate-800">{v.vin}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  {isCurrentlyFiltering ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                      <Check className="h-3.5 w-3.5" />
                      <span>{dict.hoSoPage.activeFiltering}</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onApplyCar(formatted)}
                      className="px-3 py-1.5 rounded-xl border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold transition"
                    >
                      {dict.hoSoPage.applyToFilter}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onDeleteCar(v.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title={dict.hoSoPage.deleteCar}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
