"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  AlertTriangle,
  Info,
  Car,
  ShieldCheck,
  Truck,
  RotateCcw,
  QrCode,
  ArrowRight,
  Building2,
  FileText,
} from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import { useAuth } from "@/features/auth/useAuth";
import { useCart, CartItem } from "@/features/cart/useCart";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

// CartPage renders shopping cart with real-time vehicle fitment warnings.
export default function CartPage() {
  const dict = getDictionary("vi");
  const cdict = dict.cart;
  const { user, fetchUser, logout, isLoading: authLoading } = useAuth();
  const {
    items,
    isLoaded,
    cartCount,
    subtotalRetail,
    subtotalWholesale,
    updateQuantity,
    removeFromCart,
    clearCart,
    checkFitment,
  } = useCart();

  const [activeCarFilter, setActiveCarFilter] = useState<string>("");
  const [requestVat, setRequestVat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("ALL");

  useEffect(() => {
    fetchUser();
    const savedCar = localStorage.getItem("kv_active_car_filter");
    if (savedCar) {
      setActiveCarFilter(savedCar);
    }
  }, [fetchUser]);

  const isGarageUser = user?.role === "GARAGE";
  const subtotal = isGarageUser ? subtotalWholesale : subtotalRetail;
  const wholesaleSavings = subtotalRetail - subtotalWholesale;

  // Free 2H shipping for orders > 1.000.000 VND or partner garages
  const isFreeShipping = subtotal >= 1000000 || isGarageUser;
  const shippingFee = isFreeShipping ? 0 : 35000;
  const totalAmount = subtotal + shippingFee;

  const formatVnd = (amount: number) =>
    new Intl.NumberFormat("vi-VN").format(amount) + " đ";

  // Count items incompatible with active garage car
  const incompatibleItems = items.filter(
    (item) => checkFitment(item, activeCarFilter) === "INCOMPATIBLE"
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Header
        dict={dict}
        user={user}
        isLoading={authLoading}
        logout={logout}
        activeCarFilter={activeCarFilter}
        onOpenProfile={() => {
          window.location.href = "/ho-so";
        }}
        cartCount={cartCount}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchCategory={searchCategory}
        setSearchCategory={setSearchCategory}
      />

      <main className="flex-1 mx-auto max-w-[1560px] w-full px-4 sm:px-8 xl:px-12 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-sky-600 transition">
            {cdict.breadcrumbHome}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-semibold text-slate-900">{cdict.breadcrumbCart}</span>
        </div>

        {/* Page Heading */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <ShoppingBag className="h-6 w-6 text-sky-600" />
              <span>{cdict.title}</span>
              <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-700">
                {cartCount}
              </span>
            </h1>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>{cdict.clearCart}</span>
            </button>
          )}
        </div>

        {/* Active Vehicle Fitment Banner */}
        <div className="mb-6 rounded-2xl border p-4 bg-white shadow-xs transition">
          {activeCarFilter ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                  <Car className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    {cdict.activeCarBanner}
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    {activeCarFilter}
                  </span>
                </div>
              </div>
              <Link
                href="/ho-so"
                className="text-xs font-bold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 px-3.5 py-2 rounded-xl transition flex items-center gap-1 self-start sm:self-auto shrink-0"
              >
                <span>{cdict.changeCar}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                  <Info className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-700">
                    {cdict.noActiveCar}
                  </span>
                </div>
              </div>
              <Link
                href="/ho-so"
                className="text-xs font-bold text-slate-900 hover:text-sky-600 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition shrink-0"
              >
                {cdict.selectCarNow}
              </Link>
            </div>
          )}
        </div>

        {/* Empty Cart View */}
        {isLoaded && items.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-10 sm:p-16 text-center max-w-xl mx-auto shadow-xs">
            <div className="h-20 w-20 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-5">
              <ShoppingBag className="h-10 w-10" />
            </div>
            <h2 className="text-lg font-black text-slate-900 mb-2">
              {cdict.emptyTitle}
            </h2>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              {cdict.emptyDesc}
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-black transition shadow-sm"
            >
              <span>{cdict.emptyAction}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          /* Two Column Cart Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Cart Items (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Incompatibility Global Alert Banner if any */}
              {activeCarFilter && incompatibleItems.length > 0 && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 text-rose-900 shadow-xs">
                  <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold">
                      {cdict.incompatibleAlertTitle}
                    </h4>
                    <p className="text-[11px] text-rose-700 mt-0.5">
                      {cdict.incompatibleAlertDesc
                        .replace("{count}", incompatibleItems.length.toString())
                        .replace("{car}", activeCarFilter)}
                    </p>
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 shadow-xs overflow-hidden">
                {items.map((item) => {
                  const fitStatus = checkFitment(item, activeCarFilter);
                  const isItemIncompatible = fitStatus === "INCOMPATIBLE";
                  const isItemCompatible = fitStatus === "COMPATIBLE";
                  const itemPrice = isGarageUser ? item.wholesale_price : item.retail_price;
                  const lineTotal = itemPrice * item.quantity;

                  return (
                    <div
                      key={item.id}
                      className={`p-4 sm:p-5 transition flex flex-col sm:flex-row gap-4 justify-between items-start ${
                        isItemIncompatible ? "bg-rose-50/40" : "hover:bg-slate-50/60"
                      }`}
                    >
                      {/* Left: Info */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              item.grade === "OEM_GENUINE"
                                ? "bg-sky-50 text-sky-700 border border-sky-200"
                                : item.grade === "GENUINE"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-slate-100 text-slate-700 border border-slate-200"
                            }`}
                          >
                            {item.grade === "OEM_GENUINE"
                              ? cdict.gradeOEM
                              : item.grade === "GENUINE"
                              ? cdict.gradeGenuine
                              : cdict.gradeAftermarket}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            OEM: {item.oem_number}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            • {item.brand_name}
                          </span>
                        </div>

                        <Link
                          href={`/phu-tung/${item.slug}`}
                          className="font-bold text-sm text-slate-900 hover:text-sky-600 transition block mb-2 leading-snug"
                        >
                          {item.name}
                        </Link>

                        {/* Fitment Status Badge */}
                        <div className="mb-3">
                          {isItemCompatible ? (
                            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                              <span>{cdict.compatibleBadge}</span>
                            </div>
                          ) : isItemIncompatible ? (
                            <div className="space-y-1">
                              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                                <AlertTriangle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                                <span>
                                  {cdict.incompatibleBadge.replace("{car}", activeCarFilter)}
                                </span>
                              </div>
                              <p className="text-[10px] text-rose-600 leading-tight">
                                {cdict.incompatibleDetail}
                              </p>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 text-[10px] font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                              <Info className="h-3 w-3 shrink-0" />
                              <span>{cdict.unknownBadge}</span>
                            </div>
                          )}
                        </div>

                        {/* Warranty & Badges */}
                        <div className="text-[10px] text-slate-400 flex items-center gap-3">
                          <span>
                            {cdict.warranty.replace("{months}", item.warranty_months.toString())}
                          </span>
                        </div>
                      </div>

                      {/* Right: Quantity & Pricing */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        {/* Price Unit */}
                        <div className="text-left sm:text-right">
                          <div className="text-sm font-black text-slate-900">
                            {formatVnd(lineTotal)}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {formatVnd(itemPrice)} / chiếc
                          </div>
                          {isGarageUser && (
                            <span className="inline-block mt-0.5 text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              {cdict.wholesaleBadge}
                            </span>
                          )}
                        </div>

                        {/* Stepper + Remove */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition"
                              title="Giảm"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-8 text-center text-xs font-black text-slate-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition"
                              title="Tăng"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                            title={cdict.remove}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Continue Shopping Link */}
              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-xs font-bold text-sky-600 hover:text-sky-700 transition"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                  <span>{cdict.continueShopping}</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Order Summary (4 cols, Sticky) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs sticky top-28 space-y-5">
                <h3 className="text-base font-black text-slate-900 tracking-tight pb-3 border-b border-slate-100 flex items-center justify-between">
                  <span>{cdict.summaryTitle}</span>
                  <span className="text-xs font-bold text-slate-500">
                    {cartCount} sản phẩm
                  </span>
                </h3>

                {/* Pricing Breakdown */}
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>{cdict.subtotal}</span>
                    <span className="font-bold text-slate-900">{formatVnd(subtotal)}</span>
                  </div>

                  {isGarageUser && wholesaleSavings > 0 && (
                    <div className="flex justify-between text-amber-700 bg-amber-50 p-2 rounded-xl border border-amber-100 font-medium">
                      <span>{cdict.wholesaleBadge}</span>
                      <span className="font-bold">-{formatVnd(wholesaleSavings)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600">
                    <div>
                      <span>{cdict.shippingFee}</span>
                      <p className="text-[10px] text-slate-400">{cdict.shippingNote}</p>
                    </div>
                    <span className="font-bold text-emerald-600">
                      {isFreeShipping ? cdict.shippingFree : formatVnd(shippingFee)}
                    </span>
                  </div>
                </div>

                {/* VAT Request Toggle */}
                <div className="pt-3 border-t border-slate-100">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 select-none">
                    <input
                      type="checkbox"
                      checked={requestVat}
                      onChange={(e) => setRequestVat(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 h-4 w-4"
                    />
                    <span className="text-[11px] leading-tight">
                      {cdict.vatCheckbox}
                    </span>
                  </label>
                </div>

                {/* Total */}
                <div className="pt-3 border-t border-slate-100 flex items-end justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      {cdict.total}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {cdict.vatIncluded}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-sky-600 tracking-tight">
                      {formatVnd(totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/thanh-toan"
                  className="w-full min-h-[48px] rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <span>{cdict.checkoutBtn}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                {/* Trust Pillars */}
                <div className="pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <QrCode className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                    <span>{cdict.guarantee1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                    <span>{cdict.guarantee2}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                    <span>{cdict.guarantee3}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>{cdict.guarantee4}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer dict={dict} />
      <MobileBottomNav
        dict={dict}
        user={user}
        cartCount={cartCount}
        onOpenProfile={() => {
          window.location.href = "/ho-so";
        }}
      />
    </div>
  );
}
