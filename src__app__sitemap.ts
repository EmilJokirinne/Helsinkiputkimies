import type { MetadataRoute } from "next";
import { services } from "@/content/services";
import { latestVerification } from "@/data/companies";
import { absoluteUrl } from "@/lib/site";
import { STATIC_ROUTES } from "@/lib/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const priceUpdated = latestVerification ? new Date(latestVerification) : undefined;
  const priceRoutes = new Set(["/", "/putkimiehen-hinnat", "/putkiliikkeiden-vertailu"]);
  return [
    ...STATIC_ROUTES.map((path) => ({
      url: absoluteUrl(path),
      lastModified: priceRoutes.has(path) ? priceUpdated : undefined,
      changeFrequency: (priceRoutes.has(path) ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: path === "/" ? 1 : priceRoutes.has(path) ? 0.9 : 0.6,
    })),
    ...services.map((s) => ({
      url: absoluteUrl(s.href),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
