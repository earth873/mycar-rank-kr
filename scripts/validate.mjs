import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import assert from "node:assert/strict";

export function validateData(cars, index) {
  assert.ok(
    Array.isArray(cars) && cars.length > 0,
    "Cars must be a nonempty array",
  );
  assert.ok(Array.isArray(index), "Search index must be an array");
  const slugs = new Set(cars.map((c) => c.slug));
  assert.equal(slugs.size, cars.length, "Duplicate slug");
  const ranks = cars.map((c) => c.overall_rank).sort((a, b) => a - b);
  assert.equal(new Set(ranks).size, cars.length, "Duplicate overall rank");
  assert.deepEqual(
    ranks,
    Array.from({ length: cars.length }, (_, i) => i + 1),
    "Ranks must be contiguous from 1 to N",
  );
  for (const c of cars) {
    for (const key of ["slug", "manufacturer", "model_family"]) {
      assert.ok(typeof c[key] === "string" && c[key].trim(), `Missing ${key}`);
    }
    assert.ok(
      Number.isFinite(c.estimated_domestic_sales) &&
        c.estimated_domestic_sales >= 0,
      `Invalid sales: ${c.slug}`,
    );
  }
  assert.equal(index.length, cars.length, "Search index count mismatch");
  const searchSlugs = new Set(index.map((c) => c.slug));
  assert.equal(searchSlugs.size, index.length, "Duplicate search slug");
  for (const slug of searchSlugs)
    assert.ok(slugs.has(slug), `Unknown search slug: ${slug}`);
  for (const slug of slugs)
    assert.ok(searchSlugs.has(slug), `Missing search slug: ${slug}`);
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const read = (name) =>
    JSON.parse(
      readFileSync(new URL(`../data/${name}.json`, import.meta.url), "utf8"),
    );
  const cars = read("cars"),
    index = read("car_search_index");
  validateData(cars, index);
  console.log(
    `PASS: ${cars.length} cars, ${new Set(cars.map((c) => c.manufacturer)).size} brands, ${index.length} search entries; no duplicate slugs/ranks; ranks 1–${cars.length}.`,
  );
}
