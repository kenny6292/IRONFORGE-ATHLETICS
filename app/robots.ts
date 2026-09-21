import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
 return { rules: { userAgent: "*", allow: "/" }, sitemap: "https://ironforge-athletics.vercel.app/sitemap.xml" };
}