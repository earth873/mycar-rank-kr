import type { Metadata } from "next";
import { SITE_NAME, siteUrl } from "./site";
export { siteUrl } from "./site";
export function googleVerification(
  token = process.env.GOOGLE_SITE_VERIFICATION,
) {
  return token?.trim() ? { google: token.trim() } : undefined;
}
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
      images: [
        {
          url: `${siteUrl}${path.startsWith("/car/") ? path.replace("/car/", "/og/") : "/og/site"}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        `${siteUrl}${path.startsWith("/car/") ? path.replace("/car/", "/og/") : "/og/site"}`,
      ],
    },
  };
}
