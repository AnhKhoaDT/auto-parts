"use client";

import { useState } from "react";
import {
  Camera,
  X,
  Scan,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Car,
  Globe,
  Calendar,
  Layers,
  ArrowRight,
  Upload,
} from "lucide-react";
import type { getDictionary } from "@/lib/i18n";
import { decodeVin, SAMPLE_VINS, DecodedVehicle } from "./vinDecoder";

interface VinScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVehicle: (carString: string, vehicle: DecodedVehicle) => void;
  dict: ReturnType<typeof getDictionary>;
}

// VinScannerModal provides real-time VIN decoding, camera viewfinder simulation, and 1-click fitment application.
export default function VinScannerModal({
  isOpen,
  onClose,
  onSelectVehicle,
  dict,
}: VinScannerModalProps) {
  const vdict = dict.vinScanner;
  const [mode, setMode] = useState<"MANUAL" | "CAMERA">("MANUAL");
  const [vinInput, setVinInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [decoded, setDecoded] = useState<DecodedVehicle | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDecode = (input: string) => {
    const clean = input.trim().toUpperCase();
    setVinInput(clean);
    setError(null);

    if (clean.length === 17) {
      const res = decodeVin(clean);
      if (res) {
        setDecoded(res);
        return;
      }
    }

    if (clean.length > 0 && clean.length !== 17) {
      setDecoded(null);
    }
  };

  const handleApply = () => {
    if (!decoded) return;
    const formatted = `${decoded.make} ${decoded.model} (${decoded.year}) ${decoded.engine}`;
    onSelectVehicle(formatted, decoded);
    onClose();
  };

  const handleSimulateScan = (sampleVin: string) => {
    setIsScanning(true);
    setError(null);
    setTimeout(() => {
      setIsScanning(false);
      handleDecode(sampleVin);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900">{vdict.title}</h2>
              <p className="text-[11px] text-slate-500">{vdict.subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 pt-4 pb-2">
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold text-slate-700">
            <button
              type="button"
              onClick={() => setMode("MANUAL")}
              className={`py-2 rounded-xl transition ${
                mode === "MANUAL" ? "bg-white text-sky-700 shadow-xs" : "hover:text-slate-900"
              }`}
            >
              {vdict.tabInput}
            </button>
            <button
              type="button"
              onClick={() => setMode("CAMERA")}
              className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                mode === "CAMERA" ? "bg-white text-sky-700 shadow-xs" : "hover:text-slate-900"
              }`}
            >
              <Scan className="h-3.5 w-3.5 text-sky-600" />
              <span>{vdict.tabScan}</span>
            </button>
          </div>
        </div>

        {/* Body content */}
        <div className="px-6 py-3 overflow-y-auto space-y-4">
          {mode === "MANUAL" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  17 Ký Tự Số Khung VIN (Vehicle Identification Number)
                </label>
                <input
                  type="text"
                  maxLength={17}
                  value={vinInput}
                  onChange={(e) => handleDecode(e.target.value)}
                  placeholder={vdict.vinPlaceholder}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-sky-600 text-sm font-mono font-bold tracking-widest text-slate-900 uppercase outline-none transition"
                />
                <div className="flex justify-between items-center mt-1.5 text-[11px] text-slate-400 font-medium">
                  <span>Tiêu chuẩn ISO 3779 (Loại bỏ I, O, Q)</span>
                  <span className={vinInput.length === 17 ? "text-emerald-600 font-bold" : "text-slate-500"}>
                    {vinInput.length}/17 ký tự
                  </span>
                </div>
              </div>

              {/* Sample VIN buttons */}
              <div>
                <span className="text-[11px] font-bold text-slate-600 block mb-2">{vdict.sampleVins}</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SAMPLE_VINS.map((s) => (
                    <button
                      key={s.vin}
                      type="button"
                      onClick={() => handleDecode(s.vin)}
                      className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50/50 transition group"
                    >
                      <div className="text-xs font-bold text-slate-800 group-hover:text-sky-700">{s.label}</div>
                      <div className="text-[10px] font-mono text-slate-500">{s.vin}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Camera Scan simulation */
            <div className="space-y-4">
              <div className="relative rounded-2xl bg-slate-900 border border-slate-800 p-6 overflow-hidden flex flex-col items-center justify-center min-h-[200px] text-center">
                {/* Viewfinder frame */}
                <div className="relative w-64 h-32 border-2 border-sky-400/80 rounded-xl flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-sky-500/10" />
                  {isScanning && (
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-b from-sky-400 to-sky-200 shadow-lg shadow-sky-400 animate-pulse top-1/2 -translate-y-1/2" />
                  )}
                  <span className="font-mono text-xs text-sky-200 font-semibold tracking-wider px-2 z-10">
                    {isScanning ? vdict.simulatingScan : vdict.scanTitle}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    disabled={isScanning}
                    onClick={() => handleSimulateScan("RL4BA12E0J1234567")}
                    className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Camera className="h-4 w-4" />
                    <span>Quét Thử Đăng Kiểm Vios</span>
                  </button>
                  <button
                    type="button"
                    disabled={isScanning}
                    onClick={() => handleSimulateScan("MNBFF2500P8123456")}
                    className="px-3.5 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Quét Thử Ranger 2.0L</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Decoded Specification Card */}
          {decoded && (
            <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 pb-2.5 border-b border-sky-200/80 text-sky-900 font-bold text-xs">
                <CheckCircle2 className="h-4 w-4 text-sky-600" />
                <span>{vdict.decodedTitle}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px] block">{vdict.make} &amp; {vdict.model}</span>
                  <strong className="text-slate-900 text-sm font-black">{decoded.make} {decoded.model}</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">{vdict.year}</span>
                  <strong className="text-slate-900 text-sm font-black">{decoded.year}</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">{vdict.engine}</span>
                  <strong className="text-slate-800 font-bold">{decoded.engine}</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">{vdict.country}</span>
                  <strong className="text-slate-800 font-bold">{decoded.country}</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition"
          >
            {vdict.close}
          </button>
          <button
            type="button"
            disabled={!decoded}
            onClick={handleApply}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm ${
              decoded
                ? "bg-sky-600 hover:bg-sky-500 text-white cursor-pointer"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            <span>{vdict.applyFilter}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
