"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Car,
  QrCode,
  Truck,
  Building2,
  Copy,
  Check,
  CreditCard,
  Banknote,
  AlertCircle,
  FileText,
  Clock,
  ArrowRight,
  Package,
} from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import { useAuth } from "@/features/auth/useAuth";
import { useCart } from "@/features/cart/useCart";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import OrderStatusTracker from "@/features/orders/OrderStatusTracker";

// CheckoutPage handles delivery information, dynamic VietQR generation, and order persistence.
export default function CheckoutPage() {
  const dict = getDictionary("vi");
  const cdict = dict.checkout;
  const router = useRouter();

  const { user, fetchUser, logout, isLoading: authLoading } = useAuth();
  const {
    items,
    isLoaded,
    cartCount,
    subtotalRetail,
    subtotalWholesale,
    clearCart,
  } = useCart();

  const [activeCarFilter, setActiveCarFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("ALL");

  // Delivery form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("HCM");
  const [vinNote, setVinNote] = useState("");
  const [shippingMethod, setShippingMethod] = useState<"EXPRESS" | "STANDARD">("EXPRESS");
  const [paymentMethod, setPaymentMethod] = useState<"VIETQR" | "COD">("VIETQR");

  // VAT invoice states
  const [requestVat, setRequestVat] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [taxCode, setTaxCode] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [vatEmail, setVatEmail] = useState("");

  // Process & modal states
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [orderCode, setOrderCode] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    fetchUser();
    const savedCar = localStorage.getItem("kv_active_car_filter");
    if (savedCar) {
      setActiveCarFilter(savedCar);
    }
  }, [fetchUser]);

  // Pre-fill user information when available
  useEffect(() => {
    if (user) {
      if (!fullName && user.full_name) setFullName(user.full_name);
      if (!phone && user.phone) setPhone(user.phone);
    }
  }, [user, fullName, phone]);

  const isGarageUser = user?.role === "GARAGE";
  const subtotal = isGarageUser ? subtotalWholesale : subtotalRetail;
  const isFreeShipping = subtotal >= 1000000 || isGarageUser;
  const shippingFee = isFreeShipping ? 0 : 35000;
  const totalAmount = subtotal + shippingFee;

  const formatVnd = (amount: number) =>
    new Intl.NumberFormat("vi-VN").format(amount) + " đ";

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      setErrorMsg(cdict.validationError);
      window.scrollTo({ top: 120, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);
    const newCode = `KV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderCode(newCode);

    // Save order record to localStorage for garage profile tracking
    const orderRecord = {
      orderCode: newCode,
      createdAt: new Date().toISOString(),
      items: items.map((i) => ({
        name: i.name,
        oem: i.oem_number,
        quantity: i.quantity,
        price: isGarageUser ? i.wholesale_price : i.retail_price,
      })),
      totalAmount,
      customerName: fullName,
      phone,
      address: `${address}, ${city === "HCM" ? "TP.HCM" : city === "HN" ? "Hà Nội" : "Tỉnh thành khác"}`,
      vinNote: vinNote || activeCarFilter,
      paymentMethod,
      status: paymentMethod === "VIETQR" ? "CHO_THANH_TOAN" : "DANG_XU_LY",
      requestVat,
      vatInfo: requestVat ? { companyName, taxCode, companyAddress, vatEmail } : null,
    };

    try {
      const existingRaw = localStorage.getItem("kv_user_orders");
      const list = existingRaw ? JSON.parse(existingRaw) : [];
      list.unshift(orderRecord);
      localStorage.setItem("kv_user_orders", JSON.stringify(list));
    } catch {
      // Fail-safe storage fallback
    }

    setIsSubmitting(false);

    if (paymentMethod === "VIETQR") {
      setShowQrModal(true);
    } else {
      clearCart();
      setIsSuccess(true);
    }
  };

  const handleConfirmTransfer = () => {
    setShowQrModal(false);
    clearCart();
    setIsSuccess(true);
  };

  // VietQR standard URL parameters
  const vietQrUrl = `https://img.vietqr.io/image/ICB-102876693333-compact2.png?amount=${totalAmount}&addInfo=${encodeURIComponent(
    orderCode
  )}&accountName=CONG%20TY%20TNHH%20PHU%20TUNG%20O%20TO%20KV`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Header
        dict={dict}
        user={user}
        isLoading={authLoading}
        logout={logout}
        activeCarFilter={activeCarFilter}
        onOpenProfile={() => {
          router.push("/ho-so");
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
          <Link href="/gio-hang" className="hover:text-sky-600 transition">
            {cdict.breadcrumbCart}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-semibold text-slate-900">{cdict.breadcrumbCheckout}</span>
        </div>

        {/* Success Screen */}
        {isSuccess ? (
          <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center shadow-xs">
            <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">
              {cdict.orderSuccessTitle}
            </h1>
            <p className="text-xs text-slate-500 mb-4">
              {cdict.orderSuccessSubtitle}{" "}
              <span className="font-mono font-bold text-sky-600 text-sm">{orderCode}</span>
            </p>

            {/* Live Order Dispatch Progress Tracker */}
            <OrderStatusTracker
              status={paymentMethod === "VIETQR" ? "CHO_THANH_TOAN" : "DANG_XU_LY"}
              dict={dict}
              className="mb-6 text-left"
            />

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-left text-xs space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-500">Khách hàng:</span>
                <span className="font-bold text-slate-900">{fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Số điện thoại:</span>
                <span className="font-bold text-slate-900">{phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Địa chỉ giao:</span>
                <span className="font-bold text-slate-900 text-right">{address}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-900">Tổng thanh toán:</span>
                <span className="font-black text-sky-600 text-sm">{formatVnd(totalAmount)}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              {cdict.orderSuccessDesc}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/ho-so"
                className="flex-1 min-h-[44px] rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                <span>{cdict.viewOrderInProfile}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/"
                className="flex-1 min-h-[44px] rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center transition"
              >
                <span>{cdict.backToHome}</span>
              </Link>
            </div>
          </div>
        ) : isLoaded && items.length === 0 ? (
          /* Empty Redirection */
          <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center max-w-md mx-auto shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-2">Giỏ hàng của bạn đang trống</h2>
            <p className="text-xs text-slate-500 mb-4">Hãy chọn phụ tùng trước khi thanh toán.</p>
            <Link
              href="/"
              className="inline-flex px-5 py-2.5 rounded-xl bg-sky-600 text-white text-xs font-bold"
            >
              Xem danh mục phụ tùng
            </Link>
          </div>
        ) : (
          /* Two-Column Checkout Form */
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Input Sections (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {errorMsg && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3 text-rose-900 text-xs shadow-xs">
                  <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* 1. Delivery Info */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Truck className="h-4 w-4 text-sky-600" />
                    <span>{cdict.shippingSection}</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">{cdict.shippingSubtitle}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {cdict.fullName} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={cdict.fullNamePlaceholder}
                      className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {cdict.phone} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={cdict.phonePlaceholder}
                      className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {cdict.city}
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden bg-white"
                  >
                    <option value="HCM">{cdict.cityHcm}</option>
                    <option value="HN">{cdict.cityHn}</option>
                    <option value="OTHER">{cdict.cityOther}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {cdict.address} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={cdict.addressPlaceholder}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {cdict.vinNote}
                  </label>
                  <input
                    type="text"
                    value={vinNote}
                    onChange={(e) => setVinNote(e.target.value)}
                    placeholder={cdict.vinNotePlaceholder}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                  {activeCarFilter && (
                    <span className="text-[11px] text-sky-700 mt-1 block font-medium">
                      {cdict.fitmentNotice.replace("{car}", activeCarFilter)}
                    </span>
                  )}
                </div>

                {/* Shipping speed selection */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    {cdict.shippingMethod}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-2.5 ${
                        shippingMethod === "EXPRESS"
                          ? "border-sky-500 bg-sky-50/50 ring-1 ring-sky-500"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={shippingMethod === "EXPRESS"}
                        onChange={() => setShippingMethod("EXPRESS")}
                        className="mt-0.5 text-sky-600 focus:ring-sky-500"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          {cdict.shippingExpress}
                        </span>
                        <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">
                          {cdict.shippingExpressDesc}
                        </span>
                      </div>
                    </label>

                    <label
                      className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-2.5 ${
                        shippingMethod === "STANDARD"
                          ? "border-sky-500 bg-sky-50/50 ring-1 ring-sky-500"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={shippingMethod === "STANDARD"}
                        onChange={() => setShippingMethod("STANDARD")}
                        className="mt-0.5 text-sky-600 focus:ring-sky-500"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          {cdict.shippingStandard}
                        </span>
                        <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">
                          {cdict.shippingStandardDesc}
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* 2. Payment Method */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-sky-600" />
                    <span>{cdict.paymentSection}</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">{cdict.paymentSubtitle}</p>
                </div>

                <div className="space-y-3">
                  <label
                    className={`p-4 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                      paymentMethod === "VIETQR"
                        ? "border-sky-500 bg-sky-50/50 ring-1 ring-sky-500"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "VIETQR"}
                      onChange={() => setPaymentMethod("VIETQR")}
                      className="mt-1 text-sky-600 focus:ring-sky-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <QrCode className="h-4 w-4 text-sky-600" />
                        <span className="text-xs font-bold text-slate-900">
                          {cdict.payVietQR}
                        </span>
                        <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-sky-600 text-white">
                          Khuyên dùng
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        {cdict.payVietQRDesc}
                      </p>
                    </div>
                  </label>

                  <label
                    className={`p-4 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                      paymentMethod === "COD"
                        ? "border-sky-500 bg-sky-50/50 ring-1 ring-sky-500"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                      className="mt-1 text-sky-600 focus:ring-sky-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Banknote className="h-4 w-4 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-900">
                          {cdict.payCOD}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        {cdict.payCODDesc}
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* 3. VAT Invoice Option */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-900 select-none">
                  <input
                    type="checkbox"
                    checked={requestVat}
                    onChange={(e) => setRequestVat(e.target.checked)}
                    className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 h-4 w-4"
                  />
                  <span>{cdict.vatCheckbox}</span>
                </label>

                {requestVat && (
                  <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {cdict.companyName}
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder={cdict.companyNamePlaceholder}
                        className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {cdict.taxCode}
                      </label>
                      <input
                        type="text"
                        value={taxCode}
                        onChange={(e) => setTaxCode(e.target.value)}
                        placeholder={cdict.taxCodePlaceholder}
                        className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {cdict.vatEmail}
                      </label>
                      <input
                        type="email"
                        value={vatEmail}
                        onChange={(e) => setVatEmail(e.target.value)}
                        placeholder={cdict.vatEmailPlaceholder}
                        className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {cdict.companyAddress}
                      </label>
                      <input
                        type="text"
                        value={companyAddress}
                        onChange={(e) => setCompanyAddress(e.target.value)}
                        placeholder={cdict.companyAddressPlaceholder}
                        className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Order Summary (5 cols, Sticky) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs sticky top-28 space-y-5">
                <h3 className="text-base font-black text-slate-900 tracking-tight pb-3 border-b border-slate-100 flex items-center justify-between">
                  <span>{cdict.orderSummary}</span>
                  <span className="text-xs font-bold text-slate-500">
                    {cdict.itemsCount.replace("{count}", cartCount.toString())}
                  </span>
                </h3>

                {/* Items Mini List */}
                <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="py-2.5 flex justify-between gap-3 text-xs">
                      <div>
                        <span className="font-bold text-slate-900 block leading-tight">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          OEM: {item.oem_number} • SL: {item.quantity}
                        </span>
                      </div>
                      <span className="font-bold text-slate-900 shrink-0">
                        {formatVnd(
                          (isGarageUser ? item.wholesale_price : item.retail_price) * item.quantity
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pricing Calculation */}
                <div className="pt-3 border-t border-slate-100 space-y-2.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>{cdict.subtotal}</span>
                    <span className="font-bold text-slate-900">{formatVnd(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>{cdict.shippingFee}</span>
                    <span className="font-bold text-emerald-600">
                      {isFreeShipping ? cdict.free : formatVnd(shippingFee)}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-3 border-t border-slate-100 flex items-end justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{cdict.total}</span>
                    <span className="text-[10px] text-slate-400">{cdict.vatIncluded}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-sky-600 tracking-tight">
                      {formatVnd(totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[48px] rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-sm flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>{cdict.processing}</span>
                  ) : (
                    <>
                      <span>{cdict.btnPlaceOrder}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                {/* KV Guarantees */}
                <div className="pt-3 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Cam kết 100% phụ tùng chuẩn mã OEM, xuất xứ minh bạch</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-sky-600 shrink-0" />
                    <span>Hỗ trợ kỹ thuật viên Gara kiểm tra số khung VIN 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* VietQR Modal */}
        {showQrModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
              <div className="text-center pb-4 border-b border-slate-100">
                <h3 className="text-lg font-black text-slate-900">
                  {cdict.vietqrModalTitle}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {cdict.vietqrModalSubtitle}
                </p>
              </div>

              {/* QR Image Container */}
              <div className="my-5 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={vietQrUrl}
                  alt="VietQR Phụ Tùng Ô Tô KV"
                  className="w-56 h-auto rounded-xl shadow-xs"
                />
                <span className="text-[10px] text-slate-400 mt-2">
                  Chuẩn VietQR liên ngân hàng NAPAS 247
                </span>
              </div>

              {/* Transfer Details Card */}
              <div className="space-y-2.5 text-xs bg-slate-50/60 p-4 rounded-2xl border border-slate-200/60 mb-5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">{cdict.bankName}:</span>
                  <span className="font-bold text-slate-900 text-right">{cdict.bankNameValue}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">{cdict.accountNumber}:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-sky-700 text-sm">
                      {cdict.accountNumberValue}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(cdict.accountNumberValue, "account")}
                      className="text-slate-400 hover:text-sky-600 p-1 rounded transition"
                      title={cdict.copy}
                    >
                      {copiedField === "account" ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">{cdict.accountName}:</span>
                  <span className="font-bold text-slate-900 text-right">{cdict.accountNameValue}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">{cdict.transferAmount}:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-black text-rose-600 text-sm">
                      {formatVnd(totalAmount)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(totalAmount.toString(), "amount")}
                      className="text-slate-400 hover:text-sky-600 p-1 rounded transition"
                      title={cdict.copy}
                    >
                      {copiedField === "amount" ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">{cdict.transferContent}:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-sky-700">{orderCode}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(orderCode, "content")}
                      className="text-slate-400 hover:text-sky-600 p-1 rounded transition"
                      title={cdict.copy}
                    >
                      {copiedField === "content" ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Confirmation CTA */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleConfirmTransfer}
                  className="w-full min-h-[44px] rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{cdict.confirmTransferred}</span>
                </button>
                <p className="text-[10px] text-center text-slate-400">
                  {cdict.waitingPayment}
                </p>
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
          router.push("/ho-so");
        }}
      />
    </div>
  );
}
