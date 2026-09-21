import type { MetadataRoute } from "next";

const base="https://ironforge-athletics.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
 const routes=["/","/about","/programs","/personal-training","/classes","/membership","/trainers","/facilities","/transformations","/blog","/bmi","/contact","/login","/signup"];
 return routes.map(path=>({url:base+path,lastModified:new Date(),changeFrequency:"weekly",priority:path==="/" ? 1 : 0.7}));
}