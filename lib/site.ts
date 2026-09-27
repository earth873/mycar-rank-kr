export const SITE_NAME = "내차몇위";
export const DATA_REFERENCE = "2025.12";
export const DATA_REFERENCE_LABEL = "2025년 12월 31일";

export function resolveSiteUrl(env: Record<string, string | undefined>) {
  const explicit = env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercel =
    env.VERCEL_PROJECT_PRODUCTION_URL?.trim() || env.VERCEL_URL?.trim();
  const url = new URL(
    explicit || (vercel ? `https://${vercel}` : "http://localhost:3000"),
  );
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "Site URL must be an HTTP(S) origin without credentials, a path, query, or fragment.",
    );
  }
  return url.origin;
}

export const siteUrl = resolveSiteUrl(process.env);
