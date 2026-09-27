import { readdirSync, mkdirSync, statSync, lstatSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const root = fileURLToPath(new URL("../", import.meta.url));
const folders = [
  "app",
  "components",
  "data",
  "lib",
  "public",
  "scripts",
  "tests",
];
const files = [
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "next-env.d.ts",
  "eslint.config.mjs",
  "postcss.config.mjs",
  ".gitignore",
  ".env.example",
  "README.md",
  "VERIFICATION.md",
];
function collect(folder) {
  for (const entry of readdirSync(join(root, folder), {
    withFileTypes: true,
  })) {
    if (entry.isSymbolicLink())
      throw new Error("Symlink source is not supported");
    if (
      ["node_modules", ".next", ".git", "dist"].includes(entry.name) ||
      entry.name.startsWith(".env") ||
      entry.name.endsWith(".tsbuildinfo")
    )
      continue;
    const relative = `${folder}/${entry.name}`;
    if (entry.isDirectory()) collect(relative);
    else if (entry.isFile()) files.push(relative);
  }
}
folders.forEach(collect);
for (const path of files)
  if (lstatSync(join(root, path)).isSymbolicLink())
    throw new Error("Symlink source is not supported");
const output = join(root, "dist", "naecha-source.zip");
mkdirSync(join(root, "dist"), { recursive: true });
// Windows ships BSD tar, which selects ZIP format from the .zip extension.
// On other systems, install bsdtar or set SOURCE_ARCHIVER to its executable.
const archiver =
  process.env.SOURCE_ARCHIVER ||
  (process.platform === "win32" ? "tar.exe" : "bsdtar");
const entries = [...files];
if (!readdirSync(join(root, "public")).length) entries.push("public");
execFileSync(archiver, ["-a", "-c", "-f", output, "--", ...entries], {
  cwd: root,
  stdio: "inherit",
});
console.log(
  `Source files: ${files.length}; source bytes: ${files.reduce((sum, p) => sum + statSync(join(root, p)).size, 0)}; ZIP bytes: ${statSync(output).size}`,
);
console.log(output);
