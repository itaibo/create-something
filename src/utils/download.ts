import { createWriteStream, renameSync, rmSync } from "fs";
import { join } from "path";
import { Readable } from "stream";
import { pipeline } from "stream/promises";

import { PackageManager } from "../types.js";
import { run } from "./exec.js";

const REPO = "ossly/create-something";

export async function downloadAndExtract(
  pm: PackageManager,
  projectName: string,
  cwd: string,
) {
  const url = `https://github.com/${REPO}/releases/download/templates/template-${pm}.tar.gz`;
  const tarPath = join(cwd, ".template.tar.gz");

  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok || !response.body) {
    throw new Error(`Failed to download template: ${response.statusText}`);
  }

  const fileStream = createWriteStream(tarPath);
  await pipeline(Readable.fromWeb(response.body as any), fileStream);

  run(`tar xzf .template.tar.gz`, cwd);
  rmSync(tarPath);

  renameSync(join(cwd, "{{projectName}}"), join(cwd, projectName));
}
