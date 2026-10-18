import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

const ROUTES: Array<{ path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" | "yearly" }> = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/chaos", priority: 0.9, changeFrequency: "daily" },
  { path: "/daily", priority: 0.9, changeFrequency: "daily" },
  { path: "/troll-lab", priority: 0.9, changeFrequency: "weekly" },
  { path: "/meme-studio", priority: 0.8, changeFrequency: "weekly" },
  { path: "/draw", priority: 0.8, changeFrequency: "weekly" },
  { path: "/games", priority: 0.8, changeFrequency: "weekly" },
  { path: "/explore", priority: 0.7, changeFrequency: "weekly" },
  { path: "/profile", priority: 0.4, changeFrequency: "monthly" },
  { path: "/t", priority: 0.5, changeFrequency: "monthly" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" },
  { path: "/community-guidelines", priority: 0.4, changeFrequency: "yearly" },
  { path: "/safety", priority: 0.4, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.3, changeFrequency: "yearly" },
  { path: "/report", priority: 0.3, changeFrequency: "yearly" },
  { path: "/cookie-preferences", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
