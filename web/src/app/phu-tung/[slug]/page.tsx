"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Car,
  Package,
  Truck,
  QrCode,
  ShoppingCart,
  Phone,
  AlertTriangle,
  Zap,
  PackageCheck,
  Star,
  Building2,
  Info,
} from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import { useAuth } from "@/features/auth/useAuth";
import { useCart } from "@/features/cart/useCart";
import { catalogApi, ProductDetail, Product, VehicleCompatibility } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import PartTierComparison from "@/features/catalog/PartTierComparison";

const STATIC_PRODUCTS: Record<string, ProductDetail> = {
  "bo-ma-phanh-truoc-denso-japan-04465-0d150": {
    id: "d0000000-0000-0000-0000-000000000001",
    oem_number: "04465-0D150",
    sku: "BRK-DEN-04465",
    name: "Bộ Má Phanh Trước Denso Japan Chuẩn OEM",
    slug: "bo-ma-phanh-truoc-denso-japan-04465-0d150",
    brand_id: "b0000000-0000-0000-0000-000000000002",
    brand_name: "Denso Japan",
    brand_country: "Japan",
    category_id: "c0000000-0000-0000-0000-000000000002",
    category_name: "Hệ thống phanh & má đĩa",
    grade: "OEM_GENUINE",
    retail_price: 450000,
    wholesale_price: 370000,
    stock_quantity: 45,
    warranty_months: 12,
    description: "Má phanh trước Denso Japan bằng hợp chất gốm ceramic cao cấp, êm ái không gây xước đĩa, giảm bụi phanh tối đa. Được sản xuất trực tiếp tại nhà máy Denso Nhật Bản theo tiêu chuẩn OEM dành riêng cho dòng Toyota Vios và các dòng xe Toyota phổ biến tại Việt Nam.",
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    compatibilities: [
      { vehicle_id: "a0000000-0000-0000-0000-000000000001", make: "Toyota", model: "Vios", year_from: 2018, year_to: 2023, engine: "1.5L 2NR-FE (Xăng)", fuel_type: "GASOLINE", position: "FRONT", notes: "Vị trí lắp: 2 má phanh bánh trước" },
    ],
  },
  "bugi-iridium-chan-dai-denso-sc20hr11": {
    id: "d0000000-0000-0000-0000-000000000002",
    oem_number: "90919-01253",
    sku: "ENG-DEN-SC20HR11",
    name: "Bugi Iridium Chân Dài Denso SC20HR11",
    slug: "bugi-iridium-chan-dai-denso-sc20hr11",
    brand_id: "b0000000-0000-0000-0000-000000000002",
    brand_name: "Denso Japan",
    brand_country: "Japan",
    category_id: "c0000000-0000-0000-0000-000000000001",
    category_name: "Phụ tùng động cơ & máy",
    grade: "OEM_GENUINE",
    retail_price: 220000,
    wholesale_price: 175000,
    stock_quantity: 120,
    warranty_months: 24,
    description: "Bugi Iridium cao cấp độ bền 100.000km, đánh lửa cực nhạy, tiết kiệm nhiên liệu và ổn định vòng tua. Điện cực Iridium siêu mảnh 0.4mm giúp mồi lửa chính xác hơn so với bugi thép thông thường.",
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    compatibilities: [
      { vehicle_id: "a0000000-0000-0000-0000-000000000001", make: "Toyota", model: "Vios", year_from: 2018, year_to: 2023, engine: "1.5L 2NR-FE (Xăng)", fuel_type: "GASOLINE", position: "ENGINE", notes: "Bộ 4 bugi cho động cơ 2NR-FE" },
      { vehicle_id: "a0000000-0000-0000-0000-000000000002", make: "Toyota", model: "Corolla Cross", year_from: 2020, year_to: 2024, engine: "1.8L 2ZR-FE / Hybrid", fuel_type: "HYBRID", position: "ENGINE", notes: "Bộ 4 bugi cho động cơ xăng 2ZR-FE" },
    ],
  },
};

// ProductDetailPage renders full automotive spare part specifications and fitment checker.
export default function ProductDetailPage() {
  const dict = getDictionary("vi");
  const pd = dict.productDetail;
  const router = useRouter();
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : Array.isArray(params.slug) ? params.slug[0] : "";

  const { user, fetchUser, logout, isLoading } = useAuth();
  const { addToCart, cartCount } = useCart();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("ALL");

  // Active car from garage stored in localStorage
  const [activeCarFilter, setActiveCarFilter] = useState<string>("");
  const [fitmentStatus, setFitmentStatus] = useState<"compatible" | "incompatible" | "unknown">("unknown");

  useEffect(() => {
    fetchUser();
    const saved = localStorage.getItem("kv_active_car_filter");
    if (saved) setActiveCarFilter(saved);
  }, [fetchUser]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    catalogApi
      .getProductBySlug(slug)
      .then((res) => {
        setProduct(res.product);
        // Check fitment against active car
        if (activeCarFilter && res.product.compatibilities?.length > 0) {
          checkFitment(res.product.compatibilities, activeCarFilter);
        } else if (!activeCarFilter) {
          setFitmentStatus("unknown");
        }
        // Load related products
        return catalogApi.getRelatedProducts(res.product.id);
      })
      .then((res) => {
        if (res?.products) setRelated(res.products);
      })
      .catch(() => {
        // Fallback to static seed data for development without backend
        const fallback = STATIC_PRODUCTS[slug];
        if (fallback) {
          setProduct(fallback);
          if (activeCarFilter && fallback.compatibilities?.length > 0) {
            checkFitment(fallback.compatibilities, activeCarFilter);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [slug, activeCarFilter]);

  const checkFitment = (compatibilities: VehicleCompatibility[], filter: string) => {
    const lc = filter.toLowerCase();
    const match = compatibilities.some((c) => {
      const makeMatch = lc.includes(c.make.toLowerCase());
      const modelMatch = lc.includes(c.model.toLowerCase());
      return makeMatch && modelMatch;
    });
    setFitmentStatus(match ? "compatible" : "incompatible");
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      slug: product.slug,
      oem_number: product.oem_number,
      name: product.name,
      brand_name: product.brand_name || "OEM Parts",
      image_url: product.image_url,
      grade: product.grade,
      retail_price: product.retail_price,
      wholesale_price: product.wholesale_price,
      stock_quantity: product.stock_quantity,
      warranty_months: product.warranty_months,
      compatibilities: product.compatibilities?.map((c) => ({
        make: c.make,
        model: c.model,
        year_from: c.year_from,
        year_to: c.year_to,
        engine: c.engine,
      })),
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const isGarageUser = user?.role === "GARAGE";

  const handleAddTierToCart = (p: Product) => {
    if (!product) return;
    addToCart({
      id: `${p.id}-${p.grade || "tier"}`,
      slug: p.slug,
      oem_number: p.oem_number,
      name: p.name,
      brand_name: p.brand_name || "OEM Parts",
      image_url: p.image_url,
      grade: p.grade,
      retail_price: p.retail_price,
      wholesale_price: p.wholesale_price,
      stock_quantity: p.stock_quantity,
      warranty_months: p.warranty_months,
      compatibilities: product.compatibilities?.map((c) => ({
        make: c.make,
        model: c.model,
        year_from: c.year_from,
        year_to: c.year_to,
        engine: c.engine,
      })),
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleOrderNow = () => {
    handleAddToCart();
    router.push("/gio-hang");
  };

  const formatVnd = (amount: number) =>
    new Intl.NumberFormat("vi-VN").format(amount) + " đ";

  const gradeLabel = (grade: string) => {
    if (grade === "OEM_GENUINE") return pd.gradeOEM;
    if (grade === "AFTERMARKET_PREMIUM") return pd.gradeAftermarket;
    return pd.gradeGenuine;
  };

  const gradeColors = (grade: string) => {
    if (grade === "OEM_GENUINE") return "bg-sky-50 text-sky-800 border border-sky-300";
    if (grade === "AFTERMARKET_PREMIUM") return "bg-slate-100 text-slate-800 border border-slate-300";
    return "bg-emerald-50 text-emerald-800 border border-emerald-300";
  };

  const positionLabel = (pos?: string) => {
    const map: Record<string, string> = {
      FRONT: "Bánh trước",
      REAR: "Bánh sau",
      ENGINE: "Khoang máy",
      FRONT_LEFT: "Trước trái",
      FRONT_RIGHT: "Trước phải",
    };
    return pos ? (map[pos] || pos) : "—";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 rounded-full border-4 border-sky-600 border-t-transparent animate-spin mx-auto" />
          <p className="text-sm text-slate-500 font-medium">Đang tải thông tin phụ tùng...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header
          dict={dict}
          user={user}
          isLoading={isLoading}
          logout={logout}
          activeCarFilter={activeCarFilter}
          onOpenProfile={() => { window.location.href = "/ho-so"; }}
          cartCount={cartCount}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchCategory={searchCategory}
          setSearchCategory={setSearchCategory}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-sm px-6">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
            <h1 className="text-lg font-black text-slate-900">Không tìm thấy phụ tùng</h1>
            <p className="text-sm text-slate-500">Mã phụ tùng không tồn tại hoặc đã ngừng kinh doanh.</p>
            <Link href="/" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-500 transition">
              Quay về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col pb-20 md:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            sku: product.sku || product.oem_number,
            mpn: product.oem_number,
            brand: {
              "@type": "Brand",
              name: product.brand_name || "OEM",
            },
            description: product.description || product.name,
            image: product.image_url ? [product.image_url] : [],
            offers: {
              "@type": "Offer",
              priceCurrency: "VND",
              price: product.retail_price,
              availability:
                product.stock_quantity > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
              seller: {
                "@type": "Organization",
                name: "Phụ Tùng Ô Tô KV",
              },
            },
          }),
        }}
      />
      <Header
        dict={dict}
        user={user}
        isLoading={isLoading}
        logout={logout}
        activeCarFilter={activeCarFilter}
        onOpenProfile={() => { window.location.href = "/ho-so"; }}
        cartCount={cartCount}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchCategory={searchCategory}
        setSearchCategory={setSearchCategory}
      />

      <main className="flex-1 mx-auto w-full max-w-[1560px] px-4 sm:px-8 xl:px-12 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-sky-600 transition">{pd.breadcrumbHome}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/" className="hover:text-sky-600 transition">{pd.breadcrumbCatalog}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
        </nav>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10">
          {/* LEFT: Product image placeholder + grade badge */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col items-center justify-center min-h-[320px] relative">
              {/* Grade badge */}
              <span className={`absolute top-4 left-4 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${gradeColors(product.grade)}`}>
                {gradeLabel(product.grade)}
              </span>

              {/* Product visual placeholder (no image_url yet) */}
              <div className="w-40 h-40 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <Package className="h-16 w-16 text-slate-300" />
              </div>

              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-mono bg-slate-100 px-3 py-1 rounded-lg text-slate-700 font-bold">
                  OEM: {product.oem_number}
                </span>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center gap-3 text-xs text-slate-700">
                <ShieldCheck className="h-5 w-5 text-sky-600 shrink-0" />
                <span><strong>100%</strong> phụ tùng có mã QR chống hàng giả xác minh nguồn gốc</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-700">
                <Truck className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>Giao hỏa tốc <strong>2H</strong> đến cầu nâng Gara nội thành (đặt trước 15:30)</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-700">
                <QrCode className="h-5 w-5 text-sky-600 shrink-0" />
                <span>Kích hoạt <strong>bảo hành điện tử {product.warranty_months} tháng</strong> qua quét QR khi nhận hàng</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Product detail + purchase */}
          <div className="lg:col-span-3 space-y-5">
            {/* Title & Specs */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mb-1">
                {product.name}
              </h1>
              <p className="text-xs text-slate-500 mb-4">
                {product.brand_name}
                {product.brand_country && ` · Sản xuất tại ${product.brand_country}`}
              </p>

              {/* Key specs grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                {[
                  { label: pd.oemNumber, value: product.oem_number, mono: true },
                  { label: pd.sku, value: product.sku, mono: true },
                  { label: pd.brand, value: product.brand_name },
                  { label: pd.category, value: product.category_name },
                  { label: pd.warrantyMonths, value: pd.warrantyMonthsValue.replace("{months}", String(product.warranty_months)) },
                  {
                    label: pd.stockStatus,
                    value: product.stock_quantity > 0
                      ? pd.inStock.replace("{qty}", String(product.stock_quantity))
                      : pd.outOfStock,
                  },
                ].map((spec) => (
                  <div key={spec.label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">
                      {spec.label}
                    </span>
                    <span className={`text-xs font-bold text-slate-900 break-all ${spec.mono ? "font-mono" : ""}`}>
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="border-t border-slate-100 pt-5">
                <div className="flex flex-wrap items-end gap-6">
                  <div>
                    <span className="block text-xs font-bold text-slate-500 mb-0.5">{pd.retailPrice}</span>
                    <span className="text-2xl sm:text-3xl font-black text-sky-700">
                      {formatVnd(product.retail_price)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-500 mb-0.5">
                      {pd.wholesalePrice}
                      <span className="text-amber-600 ml-1">({pd.wholesalePriceNote})</span>
                    </span>
                    <span className="text-lg font-black text-amber-700">
                      {formatVnd(product.wholesale_price)}
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-5">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex-1 min-h-[48px] flex items-center justify-center gap-2 rounded-xl text-sm font-black transition shadow-sm ${
                    addedToCart
                      ? "bg-emerald-600 text-white"
                      : "bg-sky-600 hover:bg-sky-500 text-white"
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      <span>Đã thêm vào giỏ!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5" />
                      <span>{pd.addToCart}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleOrderNow}
                  className="flex-1 min-h-[48px] flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-black transition shadow-sm"
                >
                  <PackageCheck className="h-5 w-5" />
                  <span>{pd.orderNow}</span>
                </button>

                <a
                  href="tel:0973333217"
                  className="sm:w-auto w-full min-h-[48px] flex items-center justify-center gap-2 rounded-xl border-2 border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-800 text-sm font-black transition"
                >
                  <Phone className="h-4 w-4" />
                  <span className="hidden sm:inline">{pd.contactConsult}</span>
                  <span className="sm:hidden">Hotline tư vấn</span>
                </a>
              </div>
            </div>

            {/* FITMENT CHECKER WIDGET */}
            <div className={`rounded-2xl border p-5 shadow-xs ${
              fitmentStatus === "compatible"
                ? "bg-emerald-50/80 border-emerald-300"
                : fitmentStatus === "incompatible"
                ? "bg-red-50/80 border-red-300"
                : "bg-sky-50/80 border-sky-200"
            }`}>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 mb-3">
                <Car className={`h-5 w-5 ${
                  fitmentStatus === "compatible" ? "text-emerald-600" :
                  fitmentStatus === "incompatible" ? "text-red-600" : "text-sky-600"
                }`} />
                <span>{pd.fitmentTitle}</span>
              </h3>

              {fitmentStatus === "compatible" && (
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-7 w-7 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-sm font-black text-emerald-800">{pd.fitmentCompatible}</p>
                    <p className="text-xs text-emerald-700 mt-0.5">{activeCarFilter}</p>
                  </div>
                </div>
              )}

              {fitmentStatus === "incompatible" && (
                <div className="flex items-center gap-3">
                  <XCircle className="h-7 w-7 text-red-600 shrink-0" />
                  <div>
                    <p className="text-sm font-black text-red-800">{pd.fitmentIncompatible}</p>
                    <p className="text-xs text-red-700 mt-0.5">{activeCarFilter}</p>
                    <Link href="/ho-so" className="inline-flex items-center gap-1 text-xs text-sky-600 font-bold mt-1.5 hover:underline">
                      <Car className="h-3.5 w-3.5" /> {pd.fitmentAction}
                    </Link>
                  </div>
                </div>
              )}

              {fitmentStatus === "unknown" && (
                <div className="flex items-center gap-3">
                  <Info className="h-7 w-7 text-sky-600 shrink-0" />
                  <div>
                    <p className="text-sm font-black text-sky-800">{pd.fitmentUnknown}</p>
                    <Link href="/ho-so" className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition">
                      <Car className="h-3.5 w-3.5" /> {pd.fitmentAction}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* OEM QUALITY TIER COMPARISON */}
        <div className="mb-8">
          <PartTierComparison
            product={product}
            dict={dict}
            onAddToCart={handleAddTierToCart}
            isGarageUser={isGarageUser}
          />
        </div>

        {/* COMPATIBILITY TABLE */}
        {product.compatibilities && product.compatibilities.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs mb-8">
            <h2 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-sky-600" />
              {pd.compatTableTitle}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-3 py-2.5 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">{pd.compatTableMake}</th>
                    <th className="px-3 py-2.5 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">{pd.compatTableModel}</th>
                    <th className="px-3 py-2.5 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">{pd.compatTableYear}</th>
                    <th className="px-3 py-2.5 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">{pd.compatTableEngine}</th>
                    <th className="px-3 py-2.5 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">{pd.compatTablePosition}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {product.compatibilities.map((c) => {
                    const isMycar = activeCarFilter.toLowerCase().includes(c.make.toLowerCase()) &&
                      activeCarFilter.toLowerCase().includes(c.model.toLowerCase());
                    return (
                      <tr key={`${c.vehicle_id}`}
                        className={`transition ${isMycar ? "bg-sky-50 font-bold" : "hover:bg-slate-50"}`}>
                        <td className="px-3 py-2.5 text-slate-900">
                          {isMycar && <span className="inline-block w-2 h-2 rounded-full bg-sky-600 mr-1.5 align-middle" />}
                          {c.make}
                        </td>
                        <td className="px-3 py-2.5 text-slate-900">{c.model}</td>
                        <td className="px-3 py-2.5 text-slate-700">{c.year_from}–{c.year_to}</td>
                        <td className="px-3 py-2.5 text-slate-700">{c.engine}</td>
                        <td className="px-3 py-2.5">
                          <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-bold">
                            {positionLabel(c.position)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DESCRIPTION + WARRANTY + SHIPPING */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Description */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
            <h2 className="text-base font-black text-slate-900 mb-3 flex items-center gap-2">
              <Info className="h-5 w-5 text-sky-600" />
              {pd.descTitle}
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              {product.description || "Phụ tùng chính hãng được nhập khẩu trực tiếp từ nhà sản xuất gốc. Đảm bảo chuẩn mã OEM, lắp vừa khớp 100% và bảo hành đầy đủ theo chính sách của hãng."}
            </p>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Star, label: "Phân cấp", value: gradeLabel(product.grade) },
                { icon: Zap, label: "Mã OEM", value: product.oem_number },
                { icon: ShieldCheck, label: "Bảo hành", value: `${product.warranty_months} tháng` },
                { icon: Building2, label: "Xuất xứ", value: product.brand_country || "Nhật Bản" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                  <Icon className="h-4 w-4 text-sky-600 mx-auto mb-1" />
                  <span className="block text-[10px] text-slate-500 font-bold mb-0.5">{label}</span>
                  <span className="block text-xs font-black text-slate-900 leading-tight">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Warranty + Shipping */}
          <div className="space-y-4">
            <div className="bg-sky-50/70 rounded-2xl border border-sky-200 p-4 shadow-xs">
              <h3 className="text-xs font-black text-sky-900 flex items-center gap-2 mb-2">
                <QrCode className="h-4 w-4" /> {pd.warrantyQrTitle}
              </h3>
              <p className="text-[11px] text-sky-800 leading-relaxed">{pd.warrantyQrDesc}</p>
            </div>
            <div className="bg-emerald-50/70 rounded-2xl border border-emerald-200 p-4 shadow-xs">
              <h3 className="text-xs font-black text-emerald-900 flex items-center gap-2 mb-2">
                <Truck className="h-4 w-4" /> {pd.shippingTitle}
              </h3>
              <p className="text-[11px] text-emerald-800 leading-relaxed">{pd.shippingDesc}</p>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {related.length > 0 && (
          <div className="mb-10">
            <h2 className="text-base font-black text-slate-900 mb-4">{pd.relatedTitle}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/phu-tung/${p.slug}`}
                  className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-sky-500 hover:shadow-md transition shadow-xs group"
                >
                  <div className="h-16 w-full bg-slate-50 rounded-xl flex items-center justify-center mb-3">
                    <Package className="h-8 w-8 text-slate-300" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 block mb-1">{p.oem_number}</span>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug mb-2 group-hover:text-sky-700 transition">
                    {p.name}
                  </h4>
                  <span className="text-sm font-black text-sky-700">
                    {formatVnd(p.retail_price)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer dict={dict} />
      <MobileBottomNav
        dict={dict}
        user={user}
        cartCount={cartCount}
        onOpenProfile={() => { window.location.href = "/ho-so"; }}
      />
    </div>
  );
}

