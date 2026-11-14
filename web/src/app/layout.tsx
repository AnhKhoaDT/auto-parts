import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoParts Storefront | Professional Automotive Catalog",
  description: "Next.js 14 Automotive Parts & Garage Storefront",
};

// RootLayout wraps storefront layout with responsive viewport settings.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}

