import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Phụ Tùng Ô Tô KV | Tra Cứu Phụ Tùng Chính Hãng & Gara",
  description: "Hệ thống Cung ứng Phụ tùng Ô tô & Mạng lưới Gara Phụ Tùng Ô Tô KV. Tra cứu số khung VIN, bảo hành điện tử QR, giao hỏa tốc 2H.",
  metadataBase: new URL("https://phutungotokv.vn"),
  keywords: [
    "phụ tùng ô tô",
    "phụ tùng toyota vios",
    "bảo hành điện tử QR",
    "tra cứu số khung VIN",
    "má phanh denso",
    "phụ tùng ô tô chính hãng",
  ],
};

// RootLayout wraps storefront layout with responsive viewport settings and JSON-LD schema.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoPartsStore",
    "name": "Phụ Tùng Ô Tô KV",
    "url": "https://phutungotokv.vn",
    "logo": "https://phutungotokv.vn/logo.png",
    "telephone": "+84973333217",
    "priceRange": "₫₫",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "467 An Dương Vương, Phường Chợ Quán",
      "addressLocality": "Quận 5",
      "addressRegion": "Hồ Chí Minh",
      "addressCountry": "VN",
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "08:00",
        "closes": "18:00",
      },
    ],
  };

  return (
    <html lang="vi">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
