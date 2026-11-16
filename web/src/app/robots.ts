import { MetadataRoute } from "next";

// robots generates search engine crawler directives adhering to Next.js metadata standards.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/ho-so/admin/"],
      },
    ],
    sitemap: "https://phutungotokv.vn/sitemap.xml",
  };
}
