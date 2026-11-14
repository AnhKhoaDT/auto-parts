import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoParts Admin Portal | Operations & Fitment Management",
  description: "High-performance automotive operations and WMS portal",
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

