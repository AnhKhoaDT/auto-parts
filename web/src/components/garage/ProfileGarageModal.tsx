"use client";

import { useState } from "react";
import { Car, X, Plus, LogOut } from "lucide-react";
import type { getDictionary } from "@/lib/i18n";
import type { User } from "@/lib/api";

export interface GarageCar {
  id: string;
  name: string;
  vin: string;
  trim: string;
  isPrimary: boolean;
}

interface ProfileGarageModalProps {
  dict: ReturnType<typeof getDictionary>;
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  logout: () => void;
  garageVehicles: GarageCar[];
  activeCarFilter: string;
  onSelectGarageCar: (carName: string) => void;
  onAddCar: (make: string, model: string, year: string) => void;
}

// ProfileGarageModal allows customers and garages to switch active vehicles and view orders.
export default function ProfileGarageModal({
  dict,
  user,
  isOpen,
  onClose,
  logout,
  garageVehicles,
  activeCarFilter,
  onSelectGarageCar,
  onAddCar,
}: ProfileGarageModalProps) {
  const [showAddCarForm, setShowAddCarForm] = useState(false);
  const [newCarMake, setNewCarMake] = useState("");
  const [newCarModel, setNewCarModel] = useState("");
  const [newCarYear, setNewCarYear] = useState("2022");

  if (!isOpen) return null;

  const handleSubmitNewCar = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCarMake && newCarModel) {
      onAddCar(newCarMake, newCarModel, newCarYear);
      setNewCarMake("");
      setNewCarModel("");
      setShowAddCarForm(false);
    }
  };

  const formatVnd = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl relative text-slate-900">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
            <Car className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {dict.profileModal.title}
            </h3>
            <span className="text-xs text-slate-500">
              {user ? user.email : "Khách vãng lai"}
            </span>
          </div>
        </div>

        {/* User Details */}
        {user && (
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-5 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">{dict.profileModal.fullName}:</span>
              <strong className="text-slate-900">{user.full_name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{dict.profileModal.role}:</span>
              <span className="font-bold text-sky-700">
                {user.role === "GARAGE"
                  ? dict.profileModal.roleGarage
                  : dict.profileModal.roleCustomer}
              </span>
            </div>
          </div>
        )}

        {/* Garage Saved Vehicles Section */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {dict.profileModal.garageVehicles}
            </h4>
            <button
              type="button"
              onClick={() => setShowAddCarForm(!showAddCarForm)}
              className="text-xs text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{dict.profileModal.addVehicle}</span>
            </button>
          </div>

          {/* Add Car Form Dropdown */}
          {showAddCarForm && (
            <form
              onSubmit={handleSubmitNewCar}
              className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-3 space-y-3"
            >
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Hãng (Toyota)"
                  value={newCarMake}
                  onChange={(e) => setNewCarMake(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800"
                />
                <input
                  type="text"
                  required
                  placeholder="Model (Vios)"
                  value={newCarModel}
                  onChange={(e) => setNewCarModel(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800"
                />
                <select
                  value={newCarYear}
                  onChange={(e) => setNewCarYear(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800"
                >
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCarForm(false)}
                  className="px-3 py-1 rounded-lg bg-slate-200 text-xs text-slate-700 font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white shadow-xs"
                >
                  Lưu xe
                </button>
              </div>
            </form>
          )}

          {/* List of Vehicles */}
          <div className="space-y-2">
            {garageVehicles.map((car) => {
              const isCurrent = activeCarFilter === car.name;
              return (
                <div
                  key={car.id}
                  className={`p-3 rounded-xl border flex items-center justify-between transition ${
                    isCurrent
                      ? "bg-sky-50 border-sky-400 text-slate-900"
                      : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <div>
                    <strong className="block text-xs font-bold text-slate-900">
                      {car.name}
                    </strong>
                    <span className="text-[10px] font-mono text-slate-500">
                      VIN: {car.vin}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectGarageCar(car.name)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      isCurrent
                        ? "bg-sky-600 text-white shadow-xs"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    {isCurrent
                      ? dict.profileModal.currentlyFiltering
                      : dict.profileModal.selectThisCar}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
            {dict.profileModal.recentOrders}
          </h4>
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs bg-slate-50">
            <div className="flex justify-between bg-slate-100 p-2.5 border-b border-slate-200 text-[11px] font-mono text-slate-600">
              <span>#ORD-2026-9812</span>
              <span className="text-emerald-700 font-bold">
                {dict.profileModal.statusDelivered}
              </span>
            </div>
            <div className="p-2.5 flex justify-between items-center text-slate-800">
              <span>2x Má phanh trước Denso Japan</span>
              <strong className="text-slate-900 font-bold">{formatVnd(900000)}</strong>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 min-h-[42px] rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition"
          >
            {dict.profileModal.close}
          </button>
          {user && (
            <button
              type="button"
              onClick={() => {
                logout();
                onClose();
              }}
              className="min-h-[42px] px-4 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>{dict.profileModal.logout}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

