import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolveSiteUrl } from "../lib/site.ts";

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
for (const route of ["/car/[slug]", "/brand/[brand]"])
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
  if (path === "/") assert.equal(schema(html, "WebSite").url, site);
}
for (const [i, car] of cars.entries()) {
  const html = await get(carPaths[i]);
  assert.ok(
    html.includes(car.model_family) && html.includes(car.display_sales),
    car.slug,
  );
  canonical(html, carPaths[i]);
  const crumbs = schema(html, "BreadcrumbList").itemListElement;
  assert.equal(crumbs.at(-1).item, site + carPaths[i]);
  assert.equal(crumbs.at(-1).name, car.model_family);
}
for (const path of ["/car/not-existing", "/brand/not-existing"])
  assert.equal((await fetch(base + path)).status, 404, path);
const sitemap = await get("/sitemap.xml");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
const expected = ["", "/rank", "/about", ...brandPaths, ...carPaths].map(
  (p) => site + p,
);
assert.equal(urls.length, 3 + brands.length + cars.length);
assert.deepEqual(new Set(urls), new Set(expected));
const robots = await get("/robots.txt");
assert.ok(robots.includes(`Sitemap: ${site}/sitemap.xml`));
console.log(
  `PASS: ${cars.length} static car pages, ${brands.length} static brands, ${urls.length} sitemap URLs; canonical, JSON-LD, robots, and unknown-route 404s.`,
);
