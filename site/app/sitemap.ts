import type { MetadataRoute } from "next";
import { entries } from "@/content/entries";
import { categories } from "@/content/categories";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const now = new Date().toISOString();
  const staticRoutes = [
    "",
    "/cases",
    "/timeline",
    "/topics",
    "/data",
    "/about",
    "/submit",
    "/support",
    "/shop",
    "/reading-list",
    "/promises",
    "/newsletter",
    "/methodology",
    "/standards",
    "/corrections",
  ].map((p) => ({
    url: `${base}${p}/`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1.0 : 0.7,
  }));
  const entryRoutes = entries.map((e) => ({
    url: `${base}/cases/${e.slug}/`,
    lastModified: e.lastUpdated,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  const topicRoutes = categories.map((c) => ({
    url: `${base}/topics/${c.slug}/`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));
  return [...staticRoutes, ...entryRoutes, ...topicRoutes];
}
