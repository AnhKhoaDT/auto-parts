import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Phụ Tùng Ô Tô KV | Tra Cứu Phụ Tùng Chính Hãng & Gara",
  description: "Hệ thống Cung ứng Phụ tùng Ô tô & Mạng lưới Gara Phụ Tùng Ô Tô KV",
};

// RootLayout wraps storefront layout with responsive viewport settings.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}

