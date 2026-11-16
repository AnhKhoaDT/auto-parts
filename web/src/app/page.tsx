"use client";

import { useEffect, useState } from "react";
import { getDictionary } from "@/lib/i18n";
import { useAuth } from "@/features/auth/useAuth";
import { useCart } from "@/features/cart/useCart";
import { catalogApi, Product as ApiProduct } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import HeroWithSidebar from "@/components/home/HeroWithSidebar";
import ValuePillars from "@/components/home/ValuePillars";
import CategoriesGrid from "@/components/home/CategoriesGrid";
import FeaturedProductTabs from "@/components/home/FeaturedProductTabs";
import BrandsGrid from "@/components/home/BrandsGrid";

// HomePage composes decoupled architectural components in a balanced Sky Blue, White, and Black theme.
export default function HomePage() {
  const dict = getDictionary("vi");
  const { user, fetchUser, logout, isLoading } = useAuth();

  // Vehicle selector filter states
  const [selectedYear, setSelectedYear] = useState("2021");
  const [selectedMake, setSelectedMake] = useState("Toyota");
  const [selectedModel, setSelectedModel] = useState("Vios");
  const [selectedEngine, setSelectedEngine] = useState("1.5L 2NR-FE");
  const [activeCarFilter, setActiveCarFilter] = useState("Toyota Vios (2018-2022) 1.5L");
  const [searchCategory, setSearchCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const { cartCount, addToCart } = useCart();
  const [apiProducts, setApiProducts] = useState<ApiProduct[]>([]);

  useEffect(() => {
    fetchUser();

    // Check active car filter from garage storage
    const savedFilter = localStorage.getItem("kv_active_car_filter");
    if (savedFilter) {
      setActiveCarFilter(savedFilter);
    }

    // Load real automotive products from backend catalog API
    catalogApi
      .getProducts({ limit: 12 })
      .then((res) => {
        if (res?.products && res.products.length > 0) {
          setApiProducts(res.products);
        }
      })
      .catch(() => {
        // Fallback gracefully to offline items
      });
  }, [fetchUser]);

  const handleApplyVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMake && selectedModel) {
      const formatted = `${selectedMake} ${selectedModel} (${selectedYear}) ${selectedEngine}`;
      setActiveCarFilter(formatted);
      localStorage.setItem("kv_active_car_filter", formatted);
    }
  };

  const handleResetVehicle = () => {
    setSelectedYear("");
    setSelectedMake("");
    setSelectedModel("");
    setSelectedEngine("");
    setActiveCarFilter("");
    localStorage.removeItem("kv_active_car_filter");
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 antialiased pb-20 md:pb-0 flex flex-col justify-between">
      {/* Decoupled Header Bar */}
      <Header
        dict={dict}
        user={user}
        isLoading={isLoading}
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

      {/* Main Body with Balanced Margins and Zero Empty Voids */}
      <main className="mx-auto max-w-[1560px] w-full px-4 sm:px-8 xl:px-12 py-6 space-y-8 flex-1">
        {/* Hero Banner with Left Catalog Drawer */}
        <HeroWithSidebar
          dict={dict}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedMake={selectedMake}
          setSelectedMake={setSelectedMake}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          selectedEngine={selectedEngine}
          setSelectedEngine={setSelectedEngine}
          activeCarFilter={activeCarFilter}
          onApplyVehicle={handleApplyVehicle}
          onResetVehicle={handleResetVehicle}
        />

        {/* 4 Technical Service Value Pillars */}
        <ValuePillars dict={dict} />

        {/* Categories Bento Grid */}
        <CategoriesGrid dict={dict} />

        {/* Featured Products with Tabs */}
        <FeaturedProductTabs
          dict={dict}
          onAddToCart={() => {
            const first = apiProducts?.[0];
            if (first) {
              addToCart({
                id: first.id,
                slug: first.slug,
                oem_number: first.oem_number,
                name: first.name,
                brand_name: first.brand_name || "OEM Parts",
                grade: first.grade,
                retail_price: first.retail_price,
                wholesale_price: first.wholesale_price,
                stock_quantity: first.stock_quantity,
                warranty_months: first.warranty_months,
              });
            }
          }}
          apiProducts={apiProducts}
        />

        {/* Global Partner Brands */}
        <BrandsGrid dict={dict} />
      </main>

      {/* Decoupled Footer */}
      <Footer dict={dict} />

      {/* Mobile Sticky Bottom Navigation */}
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
