import { test } from "node:test";
import assert from "node:assert/strict";
import data from "../data/cars.json";
import index from "../data/car_search_index.json";
import { cars } from "../lib/cars";
import { validateData } from "../scripts/validate.mjs";
import { resolveSiteUrl } from "../lib/site";

test("current dataset validates and sorted ranks cover 1 through N", () => {
  validateData(data, index);
  assert.deepEqual(
    cars.map((c) => c.overall_rank),
    Array.from({ length: cars.length }, (_, i) => i + 1),
  );
});

test("validator accepts growing fixture datasets without a fixed model count", () => {
  // Test-only fixtures are never saved to the production JSON files.
  for (const count of [1, 150, 200, 300]) {
    const fixtures = Array.from({ length: count }, (_, i) => ({
      slug: `fixture-${i}`,
      overall_rank: i + 1,
      manufacturer: "Test",
      model_family: `Model ${i}`,
      estimated_domestic_sales: i,
    }));
    validateData(
      fixtures,
      fixtures.map((c) => ({ slug: c.slug })),
    );
  }
});

test("validator rejects duplicates, gaps, missing fields, invalid sales and search mismatches", () => {
  const valid = [
    {
      slug: "a",
      overall_rank: 1,
      manufacturer: "Test",
      model_family: "A",
      estimated_domestic_sales: 0,
    },
    {
      slug: "b",
      overall_rank: 2,
      manufacturer: "Test",
      model_family: "B",
      estimated_domestic_sales: 10,
    },
  ];
  const search = valid.map((c) => ({ slug: c.slug }));
  for (const change of [
    { slug: "a" },
    { overall_rank: 1 },
    { overall_rank: 3 },
    { manufacturer: "" },
    { model_family: "" },
    { slug: "" },
    { estimated_domestic_sales: -1 },
    { estimated_domestic_sales: NaN },
    { estimated_domestic_sales: "10" },
  ]) {
    assert.throws(() =>
      validateData([valid[0], { ...valid[1], ...change }], search),
    );
  }
  assert.throws(() => validateData([], []));
  assert.throws(() => validateData(valid, [search[0]]));
  assert.throws(() => validateData(valid, [search[0], search[0]]));
  assert.throws(() => validateData(valid, [search[0], { slug: "unknown" }]));
});

test("site URL uses explicit domain, Vercel production, deployment, then local fallback", () => {
  const env = {
    NEXT_PUBLIC_SITE_URL: " https://mycar.example/ ",
    VERCEL_PROJECT_PRODUCTION_URL: "production.vercel.app",
    VERCEL_URL: "preview.vercel.app",
  };
  assert.equal(resolveSiteUrl(env), "https://mycar.example");
  assert.equal(
    resolveSiteUrl({ ...env, NEXT_PUBLIC_SITE_URL: "" }),
    "https://production.vercel.app",
  );
  assert.equal(
    resolveSiteUrl({ VERCEL_URL: "preview.vercel.app" }),
    "https://preview.vercel.app",
  );
  assert.equal(resolveSiteUrl({}), "http://localhost:3000");
  for (const value of [
    "invalid",
    "ftp://example.com",
    "https://example.com/path",
    "https://user:password@example.com",
  ])
    assert.throws(() => resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: value }));
});
