import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL || "https://ironforge-athletics-deyoungtech.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", "/about", "/programs", "/personal-training", "/classes", "/membership", "/trainers", "/facilities", "/transformations", "/blog", "/bmi", "/contact", "/login", "/signup"];
  return routes.map((path) => ({
    url: base + path,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
