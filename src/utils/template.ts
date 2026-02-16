import { readFileSync, readdirSync, statSync, writeFileSync } from "fs";
import { extname, join } from "path";

export const PLACEHOLDER = "{{projectName}}";

const TEXT_EXTENSIONS = new Set([
  ".json",
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".yaml",
  ".yml",
  ".prisma",
  ".md",
  ".css",
  ".html",
]);

const TEXT_FILENAMES = new Set([".prettierrc", ".eslintrc", ".gitignore"]);

function isTextFile(filePath: string): boolean {
  const ext = extname(filePath);
  const name = filePath.split("/").pop() || "";

  if (TEXT_EXTENSIONS.has(ext)) return true;
  if (TEXT_FILENAMES.has(name)) return true;
  if (name.startsWith(".env")) return true;

  return false;
}

export function replaceInAllFiles(
  dir: string,
  search: string,
  replace: string,
) {
  const entries = readdirSync(dir);

  for (const entry of entries) {
    if (entry === "node_modules") continue;
    if (entry === "package-lock.json" || entry === "pnpm-lock.yaml") continue;

    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      replaceInAllFiles(fullPath, search, replace);
    } else if (isTextFile(fullPath)) {
      const content = readFileSync(fullPath, "utf-8");
      if (content.includes(search)) {
        writeFileSync(fullPath, content.replaceAll(search, replace));
      }
    }
  }
}
