import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Phụ Tùng Ô Tô KV - Quản Trị Hệ Thống",
  description: "Cổng điều hành và quản lý phụ tùng, đơn hàng Gara Phụ Tùng Ô Tô KV",
};

// RootLayout provides workspace layout for AutoParts operational admin.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-slate-100 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}

