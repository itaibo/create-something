import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

export function createDir(path: string) {
  mkdirSync(path, { recursive: true });
}

export function writeJson(path: string, data: unknown) {
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
}

export function editJson(
  path: string,
  fn: (data: Record<string, any>) => void,
) {
  const data = JSON.parse(readFileSync(path, "utf-8"));
  fn(data);
  writeJson(path, data);
}

export function writeText(path: string, content: string) {
  writeFileSync(path, content);
}

export function templatePath(importMetaUrl: string, ...parts: string[]) {
  return join(dirname(fileURLToPath(importMetaUrl)), "template", ...parts);
}
