import { copyFileSync, rmSync } from "fs";
import { join } from "path";

import { PackageManager } from "../../types.js";
import { run } from "../../utils/exec.js";
import { templatePath } from "../../utils/fs.js";

export function createMonorepo(dir: string, pm: PackageManager, dlx: string) {
  console.log("Creating monorepo...");
  run(
    `${dlx} create-turbo@latest ${dir} --package-manager ${pm} --skip-install`,
  );

  const toRemove = [
    ".vscode",
    "apps/docs",
    "apps/web",
    "packages/ui",
    "README.md",
  ];
  for (const item of toRemove) {
    rmSync(join(dir, item), { recursive: true, force: true });
  }

  copyFileSync(
    templatePath(import.meta.url, ".env.example"),
    join(dir, ".env.example"),
  );

  const workspaceFlag = pm === "pnpm" ? "-w" : "";
  run(
    `${pm} install -D @trivago/prettier-plugin-sort-imports @types/node dotenv-cli ${workspaceFlag}`.trim(),
    dir,
  );
}
