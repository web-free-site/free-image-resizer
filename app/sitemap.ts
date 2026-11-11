import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { tools } from "@/lib/tools";
import { legalSlugs } from "@/lib/legal";

const base = "https://free-image-resizer.web-free.site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", ...tools.map((t) => t.slug), ...legalSlugs];
  return locales.flatMap((locale) =>
    paths.map((p) => ({
      url: p ? `${base}/${locale}/${p}/` : `${base}/${locale}/`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.8,
    })),
  );
}
