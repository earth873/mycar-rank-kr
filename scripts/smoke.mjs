import assert from "node:assert/strict";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { resolveSiteUrl } from "../lib/site.ts";
import { analyticsId } from "../lib/analytics.ts";
import { staticRankingCategories } from "../lib/ranking-categories.ts";
import { brandLabel, carPath } from "../lib/cars.ts";

const base = process.env.TEST_BASE_URL || "http://localhost:3000";
// Use TEST_SITE_URL when checking a build produced with a different environment.
const site = process.env.TEST_SITE_URL || resolveSiteUrl(process.env);
const read = (p) =>
  JSON.parse(readFileSync(new URL(p, import.meta.url), "utf8"));
const cars = read("../data/cars.json");
const brands = [...new Set(cars.map((c) => c.manufacturer))];
const carPaths = cars.map((c) => "/car/" + encodeURIComponent(c.slug));
const brandPaths = brands.map(
  (b) => "/brand/" + encodeURIComponent(b.replaceAll("/", "-")),
);
const manifest = read("../.next/prerender-manifest.json");
const staticCarPaths = Object.keys(manifest.routes).filter((p) =>
  p.startsWith("/car/"),
);
const staticBrandPaths = Object.keys(manifest.routes).filter((p) =>
  p.startsWith("/brand/"),
);
assert.deepEqual(
  new Set(staticCarPaths.map(decodeURIComponent)),
  new Set(carPaths.map(decodeURIComponent)),
);
assert.deepEqual(
  new Set(staticBrandPaths.map(decodeURIComponent)),
  new Set(brandPaths.map(decodeURIComponent)),
);
const categoryPaths = staticRankingCategories.map((c) => c.path);
assert.deepEqual(
  new Set(Object.keys(manifest.routes).filter((p) => p.startsWith("/rank/"))),
  new Set(categoryPaths),
);
for (const route of ["/car/[slug]", "/brand/[brand]", "/rank/[category]"])
  assert.equal(
    manifest.dynamicRoutes[route].fallback,
    false,
    "No runtime route generation",
  );

async function get(path) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, path);
  return response.text();
}
function canonical(html, path) {
  const tag = html.match(/<link\b[^>]*rel="canonical"[^>]*>/)?.[0];
  assert.ok(tag, `Missing canonical: ${path}`);
  assert.equal(
    new URL(tag.match(/href="([^"]+)"/)?.[1]).href,
    new URL(site + path).href,
    `Canonical mismatch: ${path}`,
  );
}
function metaContent(html, name) {
  return [...html.matchAll(/<meta\b[^>]*>/g)]
    .find((m) => m[0].includes(`="${name}"`))?.[0]
    .match(/content="([^"]*)"/)?.[1];
}
function ogMetadata(html, path) {
  const expected =
    site +
    (path.startsWith("/car/") ? path.replace("/car/", "/og/") : "/og/site");
  assert.equal(metaContent(html, "og:image"), expected);
  assert.equal(metaContent(html, "twitter:image"), expected);
  assert.equal(metaContent(html, "twitter:card"), "summary_large_image");
}
function schema(html, type) {
  const schemas = [
    ...html.matchAll(
      /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
    ),
  ].map((m) => JSON.parse(m[1]));
  const result = schemas.find((s) => s["@type"] === type);
  assert.ok(result, `Missing ${type}`);
  return result;
}
for (const path of ["/", "/rank", "/about", ...brandPaths]) {
  const html = await get(path);
  canonical(html, path);
  ogMetadata(html, path);
  if (path === "/") {
    assert.equal(
      html.includes("googletagmanager.com/gtag/js"),
      !!analyticsId(),
    );
    assert.equal(
      metaContent(html, "google-site-verification"),
      process.env.GOOGLE_SITE_VERIFICATION?.trim() || undefined,
    );
  }
  if (path === "/") assert.equal(schema(html, "WebSite").url, site);
}
for (const [i, car] of cars.entries()) {
  const html = await get(carPaths[i]);
  assert.ok(
    html.includes(car.model_family) && html.includes(car.display_sales),
    car.slug,
  );
  canonical(html, carPaths[i]);
  ogMetadata(html, carPaths[i]);
  const crumbs = schema(html, "BreadcrumbList").itemListElement;
  assert.equal(crumbs.at(-1).item, site + carPaths[i]);
  assert.equal(crumbs.at(-1).name, car.model_family);
}
for (const category of staticRankingCategories) {
  const html = await get(category.path);
  canonical(html, category.path);
  ogMetadata(html, category.path);
  assert.ok(html.includes(`<h1>${category.heading}</h1>`));
  assert.ok(html.includes(`<title>${category.title} | 내차몇위</title>`));
  assert.equal(metaContent(html, "description"), category.description);
  assert.equal(
    schema(html, "BreadcrumbList").itemListElement.at(-1).item,
    site + category.path,
  );
  assert.deepEqual(
    schema(html, "ItemList").itemListElement,
    category.cars.map((car, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${brandLabel(car.manufacturer)} ${car.model_family}`,
      url: site + carPath(car.slug),
    })),
  );
  const ranks = [
    ...html.matchAll(/<span class="rank-number [^"]*">(\d+)<\/span>/g),
  ].map((m) => Number(m[1]));
  assert.deepEqual(
    ranks,
    category.cars.map((_, index) => index + 1),
  );
  for (const car of category.cars)
    assert.ok(html.includes(`href="${carPath(car.slug)}"`));
}
for (const path of [
  "/car/not-existing",
  "/brand/not-existing",
  "/rank/not-existing",
])
  assert.equal((await fetch(base + path)).status, 404, path);
const sitemap = await get("/sitemap.xml");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
const expected = [
  "",
  "/rank",
  "/about",
  ...categoryPaths,
  ...brandPaths,
  ...carPaths,
].map((p) => site + p);
assert.equal(urls.length, expected.length);
assert.deepEqual(new Set(urls), new Set(expected));
const robots = await get("/robots.txt");
assert.ok(robots.includes(`Sitemap: ${site}/sitemap.xml`));
const ogSlugs = ["site", ...cars.map((c) => c.slug)];
assert.equal(
  Object.keys(manifest.routes).filter((p) => p.startsWith("/og/")).length,
  ogSlugs.length,
);
assert.equal(manifest.dynamicRoutes["/og/[slug]"].fallback, false);
mkdirSync(new URL("../dist/og-checks/", import.meta.url), { recursive: true });
for (const slug of ogSlugs) {
  const response = await fetch(base + "/og/" + encodeURIComponent(slug));
  assert.equal(response.status, 200, slug);
  assert.ok(
    response.headers.get("content-type")?.startsWith("image/png"),
    slug,
  );
  const png = Buffer.from(await response.arrayBuffer());
  assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", slug);
  assert.equal(png.readUInt32BE(16), 1200, slug);
  assert.equal(png.readUInt32BE(20), 630, slug);
  if (["site", "현대-싼타페", "현대-그랜저", "기아-레이"].includes(slug))
    writeFileSync(
      new URL(`../dist/og-checks/${slug}.png`, import.meta.url),
      png,
    );
}
assert.equal((await fetch(base + "/og/not-existing")).status, 404);
console.log(
  `PASS: ${ogSlugs.length} static 1200×630 PNG images, OG/Twitter links, optional GA/verification, unknown OG 404.`,
);
console.log(
  `PASS: ${cars.length} static car pages, ${brands.length} static brands, ${categoryPaths.length} static categories, ${urls.length} sitemap URLs; canonical, JSON-LD, ranks, robots, and unknown-route 404s.`,
);
