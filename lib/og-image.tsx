import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Car } from "./types";
import { ogContent } from "./og-content";

let font: Promise<Buffer> | undefined;
export async function ogImage(car?: Car) {
  font ??= readFile(join(process.cwd(), "public/fonts/naecha-og.ttf"));
  const data = await font;
  const c = ogContent(car);
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#fafbf8",
        color: "#172f29",
        fontFamily: "Naecha",
        padding: "48px 64px",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "2px solid #dfe7df",
          paddingBottom: 24,
        }}
      >
        <div style={{ display: "flex", fontSize: 34, color: "#176b4a" }}>
          {c.site}
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#567165" }}>
          {c.footer}
        </div>
      </div>
      <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 40 }}>
        <div style={{ display: "flex", flexDirection: "column", width: 680 }}>
          <div
            style={{
              display: "flex",
              fontSize: 23,
              color: "#567165",
              marginBottom: 14,
            }}
          >
            {c.manufacturer}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: car && c.title.length > 18 ? 38 : 52,
              lineHeight: 1.25,
              wordBreak: "keep-all",
              marginBottom: 18,
            }}
          >
            {c.title}
          </div>
          {!car && (
            <div
              style={{
                display: "flex",
                fontSize: 42,
                color: "#176b4a",
                marginBottom: 20,
              }}
            >
              {c.subtitle}
            </div>
          )}
          <div
            style={{
              display: "flex",
              fontSize: 21,
              color: "#567165",
              marginTop: 18,
            }}
          >
            {c.salesLabel}
          </div>
          <div
            style={{ display: "flex", fontSize: car ? 46 : 32, marginTop: 6 }}
          >
            {c.sales}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            width: 310,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            background: "#edf3e8",
            borderRadius: 28,
            padding: "26px 16px",
          }}
        >
          {car && (
            <div style={{ display: "flex", fontSize: 21 }}>{c.subtitle}</div>
          )}
          <div
            style={{
              display: "flex",
              fontSize: car && car.overall_rank >= 100 ? 120 : 160,
              lineHeight: 1.3,
              color: "#176b4a",
            }}
          >
            {c.rank}
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 22,
          color: "#567165",
          borderTop: "2px solid #dfe7df",
          paddingTop: 22,
        }}
      >
        {c.detail}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Naecha", data, weight: 700, style: "normal" }],
    },
  );
}
