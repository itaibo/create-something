import { existsSync, readdirSync, rmSync, statSync } from "fs";
import { join } from "path";

import { DB_SCRIPTS } from "../types.js";
import { editJson } from "../utils/fs.js";

const BUILD_ARTIFACTS = [
  "node_modules",
  ".next",
  "package-lock.json",
  "pnpm-lock.yaml",
];

export function removeBuildArtifacts(dir: string) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    if (BUILD_ARTIFACTS.includes(entry)) {
      rmSync(fullPath, { recursive: true, force: true });
    } else if (statSync(fullPath).isDirectory()) {
      removeBuildArtifacts(fullPath);
    }
  }
}

export function removeNextApp(dir: string) {
  rmSync(join(dir, "apps", "web"), { recursive: true, force: true });
}

export function removeDatabase(dir: string) {
  rmSync(join(dir, "packages", "db"), { recursive: true, force: true });
  rmSync(join(dir, "docker-compose.yml"), { force: true });

  editJson(join(dir, "turbo.json"), (turbo) => {
    for (const script of DB_SCRIPTS) {
      delete turbo.tasks[script];
    }
  });

  editJson(join(dir, "package.json"), (pkg) => {
    for (const script of DB_SCRIPTS) {
      delete pkg.scripts[script];
    }
    pkg.scripts["dev"] = "turbo run dev";
  });

  // Remove @repo/db dependency from web app (if web app exists)
  const webPkgPath = join(dir, "apps", "web", "package.json");
  if (existsSync(webPkgPath)) {
    editJson(webPkgPath, (pkg) => {
      delete pkg.dependencies["@repo/db"];
    });
  }
}
