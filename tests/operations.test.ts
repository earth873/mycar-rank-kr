import { test } from "node:test";
import assert from "node:assert/strict";
import { runInNewContext } from "node:vm";
import { Children, isValidElement } from "react";
import GoogleAnalytics from "../components/GoogleAnalytics";
import { analyticsId, analyticsBootstrap, trackEvent } from "../lib/analytics";
import { googleVerification, metadata } from "../lib/seo";
import { getCar, carPath } from "../lib/cars";
import { ogCharacters, ogContent } from "../lib/og-content";
import supported from "../public/fonts/og-characters.json";

test("GA is optional, validates IDs, and is safe without a browser", () => {
  const old = process.env.NEXT_PUBLIC_GA_ID;
  try {
    delete process.env.NEXT_PUBLIC_GA_ID;
    assert.equal(GoogleAnalytics(), null);
    assert.equal(analyticsId(" "), undefined);
    assert.equal(analyticsId("bad<script>"), undefined);
    assert.doesNotThrow(() =>
      trackEvent({
        name: "search_select",
        car: "싼타페",
        manufacturer: "현대",
        rank: 6,
      }),
    );
    process.env.NEXT_PUBLIC_GA_ID = "G-TEST12345";
    const component = GoogleAnalytics();
    assert.ok(component);
    const scripts = Children.toArray(component.props.children).filter(
      isValidElement,
    );
    assert.equal(scripts.length, 2);
    const sandbox: Record<string, unknown> = {};
    sandbox.window = sandbox;
    runInNewContext(analyticsBootstrap("G-TEST12345"), sandbox);
    const commands = (sandbox.dataLayer as IArguments[]).map((x) =>
      Array.from(x),
    );
    assert.equal(commands.filter((c) => c[0] === "config").length, 1);
    assert.equal(commands[1][1], "G-TEST12345");
  } finally {
    if (old === undefined) delete process.env.NEXT_PUBLIC_GA_ID;
    else process.env.NEXT_PUBLIC_GA_ID = old;
  }
});

test("Search Console metadata includes only a nonempty verification token", () => {
  assert.equal(googleVerification(""), undefined);
  assert.equal(googleVerification("  "), undefined);
  assert.deepEqual(googleVerification(" test-token "), {
    google: "test-token",
  });
});

test("representative OG content matches unchanged data and every glyph is bundled", () => {
  for (const slug of ["현대-싼타페", "현대-그랜저", "기아-레이"]) {
    const car = getCar(slug)!;
    const content = ogContent(car);
    assert.equal(content.title, car.model_family);
    assert.equal(content.rank, `#${car.overall_rank}`);
    assert.equal(content.sales, car.display_sales);
    const meta = metadata(content.title, content.sales, carPath(slug));
    assert.ok(meta.twitter && "card" in meta.twitter);
    assert.equal(meta.twitter.card, "summary_large_image");
    assert.ok(JSON.stringify(meta.openGraph).includes("/og/"));
  }
  for (const char of ogCharacters())
    assert.ok(
      supported.includes(char),
      `Missing OG glyph ${char}: run npm run font:og`,
    );
});
