import type { MetadataRoute } from "next";
import { cars, brands, carPath, brandPath } from "@/lib/cars";
import { siteUrl } from "@/lib/seo";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/rank",
    "/about",
    ...brands.map(brandPath),
    ...cars.map((c) => carPath(c.slug)),
  ].map((path) => ({ url: siteUrl + path }));
}
