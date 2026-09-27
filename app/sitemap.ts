import type { MetadataRoute } from "next";
import { cars, brands, carPath, brandPath } from "@/lib/cars";
import { siteUrl } from "@/lib/seo";
import { staticRankingCategories } from "@/lib/ranking-categories";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/rank",
    "/about",
    ...staticRankingCategories.map((category) => category.path),
    ...brands.map(brandPath),
    ...cars.map((c) => carPath(c.slug)),
  ].map((path) => ({ url: siteUrl + path }));
}
