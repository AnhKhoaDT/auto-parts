"use client";

import Link from "next/link";
import { Home, Search, Wrench, ShoppingBag, User as UserIcon } from "lucide-react";
import type { getDictionary } from "@/lib/i18n";
import type { User } from "@/lib/api";

interface MobileBottomNavProps {
  dict: ReturnType<typeof getDictionary>;
  user: User | null;
  cartCount: number;
  onOpenProfile: () => void;
}

// MobileBottomNav ensures thumb-friendly mobile ergonomics adhering to the thumb-zone rule.
export default function MobileBottomNav({
  dict,
  user,
  cartCount,
  onOpenProfile,
}: MobileBottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 md:hidden px-2 py-1 shadow-lg">
      <div className="grid grid-cols-5 items-center">
        <Link
          href="/"
          className="flex flex-col items-center justify-center min-h-[48px] py-1 text-sky-600 text-[10px] font-bold"
        >
          <Home className="h-5 w-5 mb-0.5" />
          <span>{dict.bottomNav.home}</span>
        </Link>

        <button
          type="button"
          className="flex flex-col items-center justify-center min-h-[48px] py-1 text-slate-500 hover:text-slate-900 text-[10px] font-medium"
        >
          <Search className="h-5 w-5 mb-0.5" />
          <span>{dict.bottomNav.search}</span>
        </button>

        <Link
          href="/ho-so"
          className="flex flex-col items-center justify-center min-h-[48px] py-1 text-slate-500 hover:text-slate-900 text-[10px] font-medium"
        >
          <Wrench className="h-5 w-5 mb-0.5" />
          <span>{dict.bottomNav.garage}</span>
        </Link>

        <Link
          href="/gio-hang"
          className="flex flex-col items-center justify-center min-h-[48px] py-1 text-slate-500 hover:text-slate-900 text-[10px] font-medium relative"
        >
          <ShoppingBag className="h-5 w-5 mb-0.5" />
          <span>{dict.bottomNav.cart}</span>
          {cartCount > 0 && (
            <span className="absolute top-1 right-3 flex h-4 w-4 items-center justify-center rounded-full bg-sky-600 text-[9px] font-bold text-white">
              {cartCount}
            </span>
          )}
        </Link>

        <Link
          href={user ? "/ho-so" : "/dang-nhap"}
          className="flex flex-col items-center justify-center min-h-[48px] py-1 text-slate-500 hover:text-slate-900 text-[10px] font-medium"
        >
          <UserIcon className="h-5 w-5 mb-0.5" />
          <span>{user ? user.full_name.split(" ")[0] : dict.bottomNav.account}</span>
        </Link>
      </div>
    </nav>
  );
}

