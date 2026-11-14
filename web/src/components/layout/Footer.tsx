"use client";

import type { getDictionary } from "@/lib/i18n";

interface FooterProps {
  dict: ReturnType<typeof getDictionary>;
}

// Footer renders multi-column enterprise automotive contact, hub addresses, and policies.
export default function Footer({ dict }: FooterProps) {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 pt-10 pb-8 px-4 sm:px-8 xl:px-12 mt-12">
      <div className="mx-auto max-w-[1560px] grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
        {/* Col 1: Company Profile */}
        <div className="md:col-span-1 space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600 text-white font-black text-xs">
              AP
            </span>
            <span className="text-base font-black text-white">
              {dict.brand.name}
              <span className="text-sky-400">{dict.brand.extension}</span>
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-300">
            {dict.footer.companyName}
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {dict.footer.addressHcm}
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {dict.footer.addressHn}
          </p>
          <p className="text-xs font-bold text-sky-400">
            {dict.footer.phone}
          </p>
        </div>

        {/* Col 2: Customer Care */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
            {dict.footer.colCustomerCare}
          </h4>
          <ul className="space-y-2 text-[11px]">
            <li className="hover:text-white cursor-pointer transition">{dict.footer.guideVin}</li>
            <li className="hover:text-white cursor-pointer transition">{dict.footer.warrantyPolicy}</li>
            <li className="hover:text-white cursor-pointer transition">{dict.footer.returnPolicy}</li>
            <li className="hover:text-white cursor-pointer transition">{dict.footer.shippingPolicy}</li>
          </ul>
        </div>

        {/* Col 3: About AutoParts Pro */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
            {dict.footer.colAbout}
          </h4>
          <ul className="space-y-2 text-[11px]">
            <li className="hover:text-white cursor-pointer transition">{dict.footer.aboutUs}</li>
            <li className="hover:text-white cursor-pointer transition">{dict.footer.genuineCommit}</li>
            <li className="hover:text-white cursor-pointer transition">{dict.footer.partnerGarages}</li>
            <li className="hover:text-white cursor-pointer transition">{dict.footer.recruitment}</li>
          </ul>
        </div>

        {/* Col 4: Payments & Security */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
            {dict.footer.colPayment}
          </h4>
          <p className="text-[11px] leading-relaxed text-slate-400 mb-3">
            {dict.footer.paymentDesc}
          </p>
          <div className="flex gap-2">
            <span className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-300">
              VietQR
            </span>
            <span className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-300">
              COD
            </span>
            <span className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-300">
              Visa / Master
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1560px] pt-6 border-t border-slate-800 text-center text-[11px] text-slate-500">
        {dict.footer.copyright}
      </div>
    </footer>
  );
}

