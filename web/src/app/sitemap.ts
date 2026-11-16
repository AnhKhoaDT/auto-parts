import { MetadataRoute } from "next";

// sitemap generates dynamic XML sitemap for SEO discovery across automotive catalog routes.
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://phutungotokv.vn";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/phu-tung`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bao-hanh`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const productSlugs = [
    "bo-ma-phanh-truoc-denso-japan-04465-0d150",
    "loc-dau-dong-co-toyota-vios-yaris-90915-yzze1",
    "bugi-iridium-chan-dai-denso-sc20hr11",
    "cap-phuoc-nhun-giam-xoc-truoc-kyb-excel-g",
    "loc-lanh-dieu-hoa-denso-10s11c-chuan-hang",
    "loc-gio-dong-co-cao-cap-bosch-toyota-vios",
  ];

  const productRoutes: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${baseUrl}/phu-tung/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
