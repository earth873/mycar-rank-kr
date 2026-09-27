import { mkdir, writeFile } from "node:fs/promises";
import { ogCharacters } from "../lib/og-content";

// Only public display text is used for a licensed Google Fonts subset request.
async function main() {
  const characters = ogCharacters();
  const cssUrl =
    "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700&text=" +
    encodeURIComponent(characters);
  const cssResponse = await fetch(cssUrl);
  if (!cssResponse.ok) throw new Error(`Font CSS: ${cssResponse.status}`);
  const css = await cssResponse.text();
  const source = css.match(
    /src:\s*url\(([^)]+)\)\s*format\('(truetype|woff)'\)/,
  );
  if (!source || new URL(source[1]).hostname !== "fonts.gstatic.com")
    throw new Error("Expected a Google Fonts TTF/WOFF subset");
  const fontResponse = await fetch(source[1]);
  if (!fontResponse.ok) throw new Error(`Font: ${fontResponse.status}`);
  const data = Buffer.from(await fontResponse.arrayBuffer());
  const licenseResponse = await fetch(
    "https://raw.githubusercontent.com/google/fonts/main/ofl/notosanskr/OFL.txt",
  );
  if (!licenseResponse.ok) throw new Error("Font license could not be loaded");
  const license = await licenseResponse.text();
  if (!license.includes("SIL OPEN FONT LICENSE"))
    throw new Error("Unexpected license");
  await mkdir("public/fonts", { recursive: true });
  await writeFile("public/fonts/naecha-og.ttf", data);
  await writeFile("public/fonts/OFL.txt", license);
  await writeFile(
    "public/fonts/og-characters.json",
    JSON.stringify(characters) + "\n",
  );
  console.log(
    `Saved licensed ${source[2]} subset: ${data.length} bytes, ${characters.length} characters. No font download is needed at build/runtime.`,
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
