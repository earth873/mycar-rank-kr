import type { Metadata } from "next";
import { SITE_NAME, siteUrl } from "./site";
export { siteUrl } from "./site";
export function metadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}${path}` },
    openGraph: {
      title,
      description,
      url: `${siteUrl}${path}`,
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "website",
    },
    twitter: { card: "summary", title, description },
  };
}
