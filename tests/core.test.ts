import { test } from "node:test";
import assert from "node:assert/strict";
import data from "../data/cars.json";
import index from "../data/car_search_index.json";
import { searchCars } from "../lib/search";
import { nearby, categoryGroup } from "../lib/rankings";
import { getCar, decodeSegment } from "../lib/cars";

test("Korean route params resolve in raw and encoded forms", () => {
  const slug = "현대-싼타페";
  assert.equal(getCar(slug)?.model_family, "싼타페");
  assert.equal(getCar(encodeURIComponent(slug))?.model_family, "싼타페");
  assert.equal(decodeSegment(encodeURIComponent("현대")), "현대");
  assert.equal(getCar("%invalid"), undefined);
});
test("Korean, English, brand names and family substrings find the right car", () => {
  for (const [query, name] of [
    ["싼타페", "싼타페"],
    ["Santa Fe", "싼타페"],
    ["현대 싼타페", "싼타페"],
    ["그랜저", "그랜저"],
    ["레이", "레이"],
    ["스파크", "마티즈/스파크"],
  ])
    assert.equal(searchCars(index, query)[0]?.model_family, name);
});
test("every source model can be found and search stays bounded", () => {
  for (const car of data)
    assert.ok(
      searchCars(index, car.model_family).some((c) => c.slug === car.slug),
    );
  assert.equal(searchCars(index, "   ").length, 0);
  assert.equal(searchCars(index, "없는차량zz").length, 0);
  assert.ok(searchCars(index, "현대").length <= 8);
});
test("nearby ranks include two each side and handle edges", () => {
  assert.deepEqual(
    nearby(data, data[5].slug).map((c) => c.overall_rank),
    [4, 5, 6, 7, 8],
  );
  assert.equal(nearby(data, data[0].slug).length, 3);
  assert.equal(nearby(data, data.at(-1)!.slug).length, 3);
  assert.deepEqual(nearby(data, "missing"), []);
});
test("category grouping includes electrified sedans and SUVs", () => {
  assert.equal(categoryGroup("전기SUV"), "SUV");
  assert.equal(categoryGroup("전기세단"), "세단");
  assert.equal(categoryGroup("경상용"), "상용");
  assert.equal(categoryGroup("경차"), "경차");
});
