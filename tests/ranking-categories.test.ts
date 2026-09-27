import { test } from "node:test";
import assert from "node:assert/strict";
import { cars, brands, brandPath, carPath } from "../lib/cars";
import { categoryGroup } from "../lib/rankings";
import {
  rankingCategories,
  staticRankingCategories,
  getRankingCategory,
  getRankingCategoryForCar,
} from "../lib/ranking-categories";
import sitemap from "../app/sitemap";
import { siteUrl } from "../lib/seo";
import Page, {
  dynamicParams,
  generateStaticParams,
  generateMetadata,
} from "../app/rank/[category]/page";

test("category slugs are unique and only substantial groups are generated", () => {
  assert.equal(
    new Set(rankingCategories.map((c) => c.slug)).size,
    rankingCategories.length,
  );
  assert.deepEqual(
    generateStaticParams(),
    staticRankingCategories.map((c) => ({ category: c.slug })),
  );
  for (const c of staticRankingCategories) assert.ok(c.cars.length >= 3);
  for (const slug of ["suv", "sedan", "compact"])
    assert.ok(getRankingCategory(slug));
});

test("groups contain exactly their source cars in descending sales order without modifying source ranks", () => {
  const snapshot = JSON.stringify(cars);
  for (const category of staticRankingCategories) {
    assert.deepEqual(
      new Set(category.cars.map((c) => c.slug)),
      new Set(
        cars
          .filter((c) => categoryGroup(c.category) === category.group)
          .map((c) => c.slug),
      ),
    );
    category.cars.forEach((car, index) => {
      assert.equal(getRankingCategoryForCar(car.category), category);
      if (index)
        assert.ok(
          category.cars[index - 1].estimated_domestic_sales >=
            car.estimated_domestic_sales,
        );
    });
  }
  assert.equal(JSON.stringify(cars), snapshot);
});

test("sitemap includes every generated category and existing route without duplicates", () => {
  const expected = [
    "",
    "/rank",
    "/about",
    ...brands.map(brandPath),
    ...cars.map((c) => carPath(c.slug)),
    ...staticRankingCategories.map((c) => c.path),
  ].map((path) => siteUrl + path);
  assert.deepEqual(
    new Set(sitemap().map((entry) => entry.url)),
    new Set(expected),
  );
  assert.equal(sitemap().length, expected.length);
});

test("unknown categories reject page and metadata with 404 and disable runtime params", async () => {
  assert.equal(dynamicParams, false);
  assert.equal(getRankingCategory("not-existing"), undefined);
  const props = { params: Promise.resolve({ category: "not-existing" }) };
  for (const render of [Page, generateMetadata])
    await assert.rejects(() => render(props), /NEXT_HTTP_ERROR_FALLBACK;404/);
});

test("category metadata has distinct titles descriptions canonical and social cards", async () => {
  const descriptions = new Set();
  for (const c of staticRankingCategories) {
    const result = await generateMetadata({
      params: Promise.resolve({ category: c.slug }),
    });
    assert.equal(result.title, c.title);
    assert.equal(result.alternates?.canonical, siteUrl + c.path);
    assert.equal(result.openGraph?.description, c.description);
    assert.equal(result.twitter?.description, c.description);
    descriptions.add(result.description);
  }
  assert.equal(descriptions.size, staticRankingCategories.length);
});
