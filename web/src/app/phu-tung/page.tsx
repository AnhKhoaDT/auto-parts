"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ChevronRight,
  Filter,
  RotateCcw,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Car,
  Layers,
  ShoppingBag,
  ArrowUpDown,
  Check,
  Phone,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import { useAuth } from "@/features/auth/useAuth";
import { useCart } from "@/features/cart/useCart";
import { catalogApi, Product, Category, Brand } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

interface CatalogItem extends Product {
  compatibilities: {
    make: string;
    model: string;
    year_from?: number;
    year_to?: number;
  }[];
}

// Fallback seed catalog data for rich browsing and offline development.
const FALLBACK_PRODUCTS: CatalogItem[] = [
  {
    id: "d0000000-0000-0000-0000-000000000001",
    oem_number: "04465-0D150",
    sku: "BRK-DEN-04465",
    name: "Bộ Má Phanh Trước Denso Japan Chuẩn OEM",
    slug: "bo-ma-phanh-truoc-denso-japan-04465-0d150",
    brand_id: "b0000000-0000-0000-0000-000000000002",
    brand_name: "Denso Japan",
    category_id: "c0000000-0000-0000-0000-000000000002",
    category_name: "Hệ thống phanh & má đĩa",
    grade: "OEM_GENUINE",
    retail_price: 450000,
    wholesale_price: 370000,
    stock_quantity: 45,
    warranty_months: 12,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    compatibilities: [
      { make: "Toyota", model: "Vios", year_from: 2018, year_to: 2023 },
      { make: "Toyota", model: "Yaris", year_from: 2014, year_to: 2022 },
    ],
  },
  {
    id: "d0000000-0000-0000-0000-000000000002",
    oem_number: "90919-01253",
    sku: "ENG-DEN-SC20HR11",
    name: "Bugi Iridium Chân Dài Denso SC20HR11",
    slug: "bugi-iridium-chan-dai-denso-sc20hr11",
    brand_id: "b0000000-0000-0000-0000-000000000002",
    brand_name: "Denso Japan",
    category_id: "c0000000-0000-0000-0000-000000000001",
    category_name: "Phụ tùng động cơ & máy",
    grade: "OEM_GENUINE",
    retail_price: 220000,
    wholesale_price: 175000,
    stock_quantity: 120,
    warranty_months: 24,
    is_active: true,
    created_at: "2026-01-02T00:00:00Z",
    updated_at: "2026-01-02T00:00:00Z",
    compatibilities: [
      { make: "Toyota", model: "Vios", year_from: 2018, year_to: 2023 },
      { make: "Toyota", model: "Corolla Cross", year_from: 2020, year_to: 2024 },
      { make: "Toyota", model: "Altis", year_from: 2016, year_to: 2023 },
    ],
  },
  {
    id: "d0000000-0000-0000-0000-000000000003",
    oem_number: "0986-AF3-018",
    sku: "ENG-BOS-AF3018",
    name: "Lọc Gió Động Cơ Bosch High-Flow Chống Ẩm",
    slug: "loc-gio-dong-co-bosch-high-flow",
    brand_id: "b0000000-0000-0000-0000-000000000003",
    brand_name: "Bosch Germany",
    category_id: "c0000000-0000-0000-0000-000000000001",
    category_name: "Phụ tùng động cơ & máy",
    grade: "AFTERMARKET_PREMIUM",
    retail_price: 180000,
    wholesale_price: 135000,
    stock_quantity: 80,
    warranty_months: 6,
    is_active: true,
    created_at: "2026-01-03T00:00:00Z",
    updated_at: "2026-01-03T00:00:00Z",
    compatibilities: [
      { make: "Toyota", model: "Vios", year_from: 2016, year_to: 2023 },
      { make: "Toyota", model: "Yaris", year_from: 2016, year_to: 2022 },
    ],
  },
  {
    id: "d0000000-0000-0000-0000-000000000004",
    oem_number: "90915-YZZE2",
    sku: "ENG-DEN-YZZE2",
    name: "Lọc Dầu Nhớt Động Cơ Toyota Lexus Denso Japan",
    slug: "loc-dau-dong-co-toyota-lexus-denso-japan",
    brand_id: "b0000000-0000-0000-0000-000000000002",
    brand_name: "Denso Japan",
    category_id: "c0000000-0000-0000-0000-000000000001",
    category_name: "Phụ tùng động cơ & máy",
    grade: "OEM_GENUINE",
    retail_price: 110000,
    wholesale_price: 85000,
    stock_quantity: 200,
    warranty_months: 6,
    is_active: true,
    created_at: "2026-01-04T00:00:00Z",
    updated_at: "2026-01-04T00:00:00Z",
    compatibilities: [
      { make: "Toyota", model: "Vios", year_from: 2014, year_to: 2023 },
      { make: "Toyota", model: "Camry", year_from: 2012, year_to: 2023 },
      { make: "Toyota", model: "Corolla Altis", year_from: 2010, year_to: 2022 },
    ],
  },
  {
    id: "d0000000-0000-0000-0000-000000000005",
    oem_number: "88310-0D330",
    sku: "ELE-DEN-10S11C",
    name: "Lốc Lạnh Máy Nén Điều Hòa Denso 10S11C Chuẩn Hãng",
    slug: "loc-lanh-dieu-hoa-denso-10s11c",
    brand_id: "b0000000-0000-0000-0000-000000000002",
    brand_name: "Denso Japan",
    category_id: "c0000000-0000-0000-0000-000000000004",
    category_name: "Điện, lốc lạnh & điều hòa",
    grade: "OEM_GENUINE",
    retail_price: 4850000,
    wholesale_price: 4100000,
    stock_quantity: 15,
    warranty_months: 18,
    is_active: true,
    created_at: "2026-01-05T00:00:00Z",
    updated_at: "2026-01-05T00:00:00Z",
    compatibilities: [
      { make: "Toyota", model: "Vios", year_from: 2018, year_to: 2022 },
      { make: "Toyota", model: "Yaris", year_from: 2018, year_to: 2022 },
    ],
  },
  {
    id: "d0000000-0000-0000-0000-000000000006",
    oem_number: "48510-0D590",
    sku: "SUS-KYB-333338",
    name: "Cặp Phuộc Nhún Giảm Xóc Trước KYB Excel-G Gas",
    slug: "phuoc-nhun-giam-xoc-truoc-kyb-excel-g",
    brand_id: "b0000000-0000-0000-0000-000000000005",
    brand_name: "KYB Japan",
    category_id: "c0000000-0000-0000-0000-000000000003",
    category_name: "Gầm, càng A & giảm xóc",
    grade: "OEM_GENUINE",
    retail_price: 1650000,
    wholesale_price: 1380000,
    stock_quantity: 28,
    warranty_months: 18,
    is_active: true,
    created_at: "2026-01-06T00:00:00Z",
    updated_at: "2026-01-06T00:00:00Z",
    compatibilities: [
      { make: "Toyota", model: "Vios", year_from: 2018, year_to: 2023 },
    ],
  },
  {
    id: "d0000000-0000-0000-0000-000000000007",
    oem_number: "45022-TG0-T00",
    sku: "BRK-BRE-P28073",
    name: "Bộ Má Phanh Trước Gốm Ceramic Brembo Italy",
    slug: "bo-ma-phanh-truoc-brembo-italy",
    brand_id: "b0000000-0000-0000-0000-000000000004",
    brand_name: "Brembo Italy",
    category_id: "c0000000-0000-0000-0000-000000000002",
    category_name: "Hệ thống phanh & má đĩa",
    grade: "AFTERMARKET_PREMIUM",
    retail_price: 890000,
    wholesale_price: 720000,
    stock_quantity: 35,
    warranty_months: 12,
    is_active: true,
    created_at: "2026-01-07T00:00:00Z",
    updated_at: "2026-01-07T00:00:00Z",
    compatibilities: [
      { make: "Honda", model: "City", year_from: 2014, year_to: 2023 },
      { make: "Honda", model: "Civic", year_from: 2016, year_to: 2022 },
    ],
  },
  {
    id: "d0000000-0000-0000-0000-000000000008",
    oem_number: "KD45-32-280",
    sku: "SUS-555-SE1811",
    name: "Cặp Rô-tuyn Lái Ngoài 555 Sankei Japan",
    slug: "cap-ro-tuyn-lai-ngoai-555-sankei",
    brand_id: "b0000000-0000-0000-0000-000000000006",
    brand_name: "555 Sankei",
    category_id: "c0000000-0000-0000-0000-000000000003",
    category_name: "Gầm, càng A & giảm xóc",
    grade: "OEM_GENUINE",
    retail_price: 750000,
    wholesale_price: 590000,
    stock_quantity: 40,
    warranty_months: 12,
    is_active: true,
    created_at: "2026-01-08T00:00:00Z",
    updated_at: "2026-01-08T00:00:00Z",
    compatibilities: [
      { make: "Mazda", model: "Mazda 3", year_from: 2015, year_to: 2022 },
      { make: "Mazda", model: "CX-5", year_from: 2016, year_to: 2023 },
    ],
  },
];

const CATEGORIES_LIST = [
  { slug: "ALL", name: "Tất cả nhóm phụ tùng" },
  { slug: "phu-tung-dong-co", name: "Phụ tùng động cơ & máy" },
  { slug: "he-thong-phanh", name: "Hệ thống phanh & má đĩa" },
  { slug: "gam-giam-xoc", name: "Gầm, càng A & giảm xóc" },
  { slug: "dien-dieu-hoa", name: "Điện, lốc lạnh & điều hòa" },
  { slug: "dau-nhot-phu-gia", name: "Dầu nhớt & phụ gia" },
];

const BRANDS_LIST = [
  { slug: "ALL", name: "Tất cả thương hiệu" },
  { slug: "denso", name: "Denso Japan" },
  { slug: "bosch", name: "Bosch Germany" },
  { slug: "kyb", name: "KYB Japan" },
  { slug: "brembo", name: "Brembo Italy" },
  { slug: "aisin", name: "Aisin Japan" },
  { slug: "555-sankei", name: "555 Sankei" },
  { slug: "motul", name: "Motul France" },
];

const MAKES_LIST = [
  "ALL",
  "Toyota",
  "Honda",
  "Mazda",
  "Hyundai",
  "Kia",
  "Ford",
  "Mitsubishi",
  "Mercedes-Benz",
];

// Inner Catalog Component reading search params
function CatalogContent() {
  const dict = getDictionary("vi");
  const cp = dict.catalogPage;
  const router = useRouter();
  const searchParams = useSearchParams();

  const { user, fetchUser, logout, isLoading: authLoading } = useAuth();
  const { cartCount, addToCart } = useCart();

  // URL state sync
  const initialCategory = searchParams.get("category") || "ALL";
  const initialBrand = searchParams.get("brand") || "ALL";
  const initialMake = searchParams.get("make") || "ALL";
  const initialSearch = searchParams.get("q") || "";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [selectedMake, setSelectedMake] = useState(initialMake);
  const [selectedGrade, setSelectedGrade] = useState("ALL");
  const [selectedPriceRange, setSelectedPriceRange] = useState("ALL");
  const [onlyCompatible, setOnlyCompatible] = useState(false);
  const [sortBy, setSortBy] = useState<"NEWEST" | "PRICE_ASC" | "PRICE_DESC">("NEWEST");
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [headerSearchQuery, setHeaderSearchQuery] = useState("");
  const [headerSearchCategory, setHeaderSearchCategory] = useState("ALL");

  const [activeCarFilter, setActiveCarFilter] = useState<string>("");
  const [products, setProducts] = useState<CatalogItem[]>(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  useEffect(() => {
    fetchUser();
    const saved = localStorage.getItem("kv_active_car_filter");
    if (saved) {
      setActiveCarFilter(saved);
    }
  }, [fetchUser]);

  // Load from API when available
  useEffect(() => {
    setLoading(true);
    catalogApi
      .getProducts({ limit: 50 })
      .then((res) => {
        if (res?.products && res.products.length > 0) {
          // Merge API items with fallback compatibilities
          const merged: CatalogItem[] = res.products.map((p) => {
            const fallback = FALLBACK_PRODUCTS.find((f) => f.slug === p.slug || f.id === p.id);
            return {
              ...p,
              compatibilities: fallback?.compatibilities || [
                { make: "Toyota", model: "Vios", year_from: 2018, year_to: 2023 },
              ],
            };
          });
          setProducts(merged);
        }
      })
      .catch(() => {
        // Keeps FALLBACK_PRODUCTS seamlessly
      })
      .finally(() => setLoading(false));
  }, []);

  const isGarageUser = user?.role === "GARAGE";

  const formatVnd = (amount: number) =>
    new Intl.NumberFormat("vi-VN").format(amount) + " đ";

  // Check product fitment against active car filter
  const getFitmentStatus = (item: CatalogItem): "COMPATIBLE" | "INCOMPATIBLE" | "UNVERIFIED" => {
    if (!activeCarFilter) return "UNVERIFIED";
    const lower = activeCarFilter.toLowerCase();
    const isMatch = item.compatibilities.some(
      (c) => lower.includes(c.make.toLowerCase()) && lower.includes(c.model.toLowerCase())
    );
    return isMatch ? "COMPATIBLE" : "INCOMPATIBLE";
  };

  // Filter & Sort Pipeline
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== "ALL") {
          const catObj = CATEGORIES_LIST.find((c) => c.slug === selectedCategory);
          if (catObj && !p.category_name?.toLowerCase().includes(catObj.name.toLowerCase().slice(0, 8))) {
            return false;
          }
        }

        // Brand filter
        if (selectedBrand !== "ALL") {
          const brandObj = BRANDS_LIST.find((b) => b.slug === selectedBrand);
          if (brandObj && !p.brand_name?.toLowerCase().includes(brandObj.name.toLowerCase().slice(0, 4))) {
            return false;
          }
        }

        // Vehicle Make filter
        if (selectedMake !== "ALL") {
          const matchesMake = p.compatibilities.some(
            (c) => c.make.toLowerCase() === selectedMake.toLowerCase()
          );
          if (!matchesMake) return false;
        }

        // Quality Grade filter
        if (selectedGrade !== "ALL" && p.grade !== selectedGrade) {
          return false;
        }

        // Price range filter
        const price = isGarageUser ? p.wholesale_price : p.retail_price;
        if (selectedPriceRange === "UNDER_500K" && price >= 500000) return false;
        if (selectedPriceRange === "500K_2M" && (price < 500000 || price > 2000000)) return false;
        if (selectedPriceRange === "2M_5M" && (price < 2000000 || price > 5000000)) return false;
        if (selectedPriceRange === "OVER_5M" && price <= 5000000) return false;

        // "Only compatible" checkbox
        if (onlyCompatible && activeCarFilter) {
          if (getFitmentStatus(p) !== "COMPATIBLE") return false;
        }

        // Search keyword
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchOem = p.oem_number.toLowerCase().includes(q);
          const matchSku = p.sku.toLowerCase().includes(q);
          const matchBrand = p.brand_name?.toLowerCase().includes(q);
          if (!matchName && !matchOem && !matchSku && !matchBrand) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = isGarageUser ? a.wholesale_price : a.retail_price;
        const priceB = isGarageUser ? b.wholesale_price : b.retail_price;
        if (sortBy === "PRICE_ASC") return priceA - priceB;
        if (sortBy === "PRICE_DESC") return priceB - priceA;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [
    products,
    selectedCategory,
    selectedBrand,
    selectedMake,
    selectedGrade,
    selectedPriceRange,
    onlyCompatible,
    activeCarFilter,
    searchQuery,
    sortBy,
    isGarageUser,
  ]);

  const handleResetFilters = () => {
    setSelectedCategory("ALL");
    setSelectedBrand("ALL");
    setSelectedMake("ALL");
    setSelectedGrade("ALL");
    setSelectedPriceRange("ALL");
    setOnlyCompatible(false);
    setSearchQuery("");
  };

  const handleQuickAdd = (p: CatalogItem) => {
    addToCart({
      id: p.id,
      slug: p.slug,
      oem_number: p.oem_number,
      name: p.name,
      brand_name: p.brand_name || "OEM Parts",
      grade: p.grade,
      retail_price: p.retail_price,
      wholesale_price: p.wholesale_price,
      stock_quantity: p.stock_quantity,
      warranty_months: p.warranty_months,
      compatibilities: p.compatibilities,
    });
    setJustAddedId(p.id);
    setTimeout(() => setJustAddedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Header
        dict={dict}
        user={user}
        isLoading={authLoading}
        logout={logout}
        activeCarFilter={activeCarFilter}
        onOpenProfile={() => router.push("/ho-so")}
        cartCount={cartCount}
        searchQuery={headerSearchQuery}
        setSearchQuery={setHeaderSearchQuery}
        searchCategory={headerSearchCategory}
        setSearchCategory={setHeaderSearchCategory}
      />

      <main className="flex-1 mx-auto max-w-[1560px] w-full px-4 sm:px-8 xl:px-12 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
          <Link href="/" className="hover:text-sky-600 transition">
            {cp.breadcrumbHome}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-semibold text-slate-900">{cp.breadcrumbCatalog}</span>
        </div>

        {/* Page Title & Active Car Bar */}
        <div className="mb-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {cp.title}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">{cp.subtitle}</p>
            </div>

            {/* Garage Fitment Quick Selector */}
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2">
              <Car className="h-4 w-4 text-sky-600 shrink-0" />
              {activeCarFilter ? (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">{cp.activeCarNotice}</span>
                  <span className="font-black text-slate-900">{activeCarFilter}</span>
                  <Link
                    href="/ho-so"
                    className="text-sky-600 hover:text-sky-700 font-bold ml-1 transition"
                  >
                    ({cp.changeCar})
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">{cp.noCarNotice}</span>
                  <Link
                    href="/ho-so"
                    className="text-sky-600 font-bold hover:underline"
                  >
                    {cp.selectCar}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Catalog Main Layout: Sidebar (3 cols) + Grid (9 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Filter Sidebar */}
          <aside className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-sm font-black text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-sky-600" />
                {cp.filterTitle}
              </span>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-slate-400 hover:text-rose-600 flex items-center gap-1 transition"
              >
                <RotateCcw className="h-3 w-3" />
                <span>{cp.resetFilter}</span>
              </button>
            </div>

            {/* Keyword Search Input */}
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nhập tên, mã OEM, SKU..."
                  className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Only Compatible Toggle */}
            {activeCarFilter && (
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-sky-50 border border-sky-100 cursor-pointer select-none text-xs text-sky-900">
                <input
                  type="checkbox"
                  checked={onlyCompatible}
                  onChange={(e) => setOnlyCompatible(e.target.checked)}
                  className="mt-0.5 rounded border-sky-300 text-sky-600 focus:ring-sky-500 h-4 w-4"
                />
                <span className="font-bold leading-tight">{cp.onlyCompatible}</span>
              </label>
            )}

            {/* Filter by Vehicle Make */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                {cp.filterVehicle}
              </label>
              <select
                value={selectedMake}
                onChange={(e) => setSelectedMake(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              >
                {MAKES_LIST.map((m) => (
                  <option key={m} value={m}>
                    {m === "ALL" ? cp.allVehicles : m}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Category */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                {cp.filterCategory}
              </label>
              <div className="space-y-1">
                {CATEGORIES_LIST.map((cat) => (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                      selectedCategory === cat.slug
                        ? "bg-sky-600 text-white shadow-xs"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>{cat.name}</span>
                    {selectedCategory === cat.slug && <Check className="h-3.5 w-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter by Brand */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                {cp.filterBrand}
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              >
                {BRANDS_LIST.map((b) => (
                  <option key={b.slug} value={b.slug}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Quality Grade */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                {cp.filterGrade}
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { value: "ALL", label: cp.allGrades },
                  { value: "OEM_GENUINE", label: cp.gradeOEM },
                  { value: "GENUINE", label: cp.gradeGenuine },
                  { value: "AFTERMARKET_PREMIUM", label: cp.gradeAftermarket },
                ].map((g) => (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => setSelectedGrade(g.value)}
                    className={`text-left px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      selectedGrade === g.value
                        ? "bg-slate-900 text-white font-bold"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter by Price Range */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                {cp.filterPrice}
              </label>
              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              >
                <option value="ALL">{cp.allPrices}</option>
                <option value="UNDER_500K">{cp.priceUnder500}</option>
                <option value="500K_2M">{cp.price500to2m}</option>
                <option value="2M_5M">{cp.price2mto5m}</option>
                <option value="OVER_5M">{cp.priceOver5m}</option>
              </select>
            </div>
          </aside>

          {/* Right Column: Catalog Grid */}
          <div className="lg:col-span-9 space-y-4">
            {/* Header Control Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl px-5 py-3.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs font-bold text-slate-700">
                {cp.resultsCount.replace("{count}", filteredProducts.length.toString())}
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-xs text-slate-400">{cp.sortBy}</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="h-8 px-2.5 rounded-lg border border-slate-300 text-xs font-bold bg-white text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                >
                  <option value="NEWEST">{cp.sortNewest}</option>
                  <option value="PRICE_ASC">{cp.sortPriceAsc}</option>
                  <option value="PRICE_DESC">{cp.sortPriceDesc}</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-10 sm:p-14 text-center shadow-xs">
                <div className="h-16 w-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="text-base font-black text-slate-900 mb-1">
                  {cp.emptyTitle}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
                  {cp.emptyDesc}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition"
                  >
                    {cp.clearAllFilters}
                  </button>
                  <a
                    href="tel:0973333217"
                    className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 transition"
                  >
                    <Phone className="h-3.5 w-3.5 text-sky-600" />
                    <span>{cp.callConsultant}</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProducts.map((p) => {
                  const fitStatus = getFitmentStatus(p);
                  const isItemJustAdded = justAddedId === p.id;
                  const displayPrice = isGarageUser ? p.wholesale_price : p.retail_price;

                  return (
                    <div
                      key={p.id}
                      className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between hover:border-sky-500 hover:shadow-md transition shadow-xs group"
                    >
                      <div>
                        {/* Grade and OEM Code */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              p.grade === "OEM_GENUINE"
                                ? "bg-sky-50 text-sky-700 border border-sky-200"
                                : p.grade === "GENUINE"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-slate-100 text-slate-700 border border-slate-200"
                            }`}
                          >
                            {p.grade === "OEM_GENUINE"
                              ? cp.gradeOEM
                              : p.grade === "GENUINE"
                              ? cp.gradeGenuine
                              : cp.gradeAftermarket}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            OEM: {p.oem_number}
                          </span>
                        </div>

                        {/* Part Name */}
                        <Link href={`/phu-tung/${p.slug}`}>
                          <h3 className="font-bold text-slate-900 text-sm mb-1 leading-snug line-clamp-2 group-hover:text-sky-600 transition">
                            {p.name}
                          </h3>
                        </Link>

                        <span className="text-xs text-slate-500 block mb-2 font-medium">
                          {p.brand_name}
                        </span>

                        {/* Fitment Indicator */}
                        <div className="mb-3">
                          {fitStatus === "COMPATIBLE" ? (
                            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                              <span>{cp.compatible.replace("{car}", activeCarFilter)}</span>
                            </div>
                          ) : fitStatus === "INCOMPATIBLE" ? (
                            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                              <AlertTriangle className="h-3 w-3 text-rose-600 shrink-0" />
                              <span>{cp.incompatible.replace("{car}", activeCarFilter)}</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                              <span>{cp.unverified}</span>
                            </div>
                          )}
                        </div>

                        {/* Warranty */}
                        <div className="text-[10px] text-slate-400 mb-3">
                          {cp.warranty.replace("{months}", p.warranty_months.toString())}
                        </div>
                      </div>

                      {/* Pricing and Action */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div>
                          <div className="text-sm font-black text-slate-900">
                            {formatVnd(displayPrice)}
                          </div>
                          {isGarageUser && (
                            <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1 py-0.5 rounded border border-amber-200 block mt-0.5">
                              {cp.wholesalePrice}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleQuickAdd(p)}
                          className={`min-h-[36px] px-3 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            isItemJustAdded
                              ? "bg-emerald-600 text-white"
                              : "bg-sky-600 hover:bg-sky-500 text-white shadow-xs"
                          }`}
                        >
                          {isItemJustAdded ? (
                            <>
                              <Check className="h-3.5 w-3.5" />
                              <span>{cp.added}</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="h-3.5 w-3.5" />
                              <span>{cp.addToCart}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer dict={dict} />
      <MobileBottomNav
        dict={dict}
        user={user}
        cartCount={cartCount}
        onOpenProfile={() => router.push("/ho-so")}
      />
    </div>
  );
}

// Wrapper with Suspense for Next.js useSearchParams
export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <div className="h-10 w-10 rounded-full border-4 border-sky-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
