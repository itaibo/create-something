import { existsSync, readdirSync, rmSync, statSync } from "fs";
import { join } from "path";

import { DB_SCRIPTS } from "../types.js";
import { editJson } from "../utils/fs.js";

const BUILD_ARTIFACTS = [
  "node_modules",
  ".next",
  ".expo",
  "package-lock.json",
  "pnpm-lock.yaml",
];

function removePath(path: string) {
  rmSync(path, {
    recursive: true,
    force: true,
    maxRetries: 5,
    retryDelay: 100,
  });
}

export function removeBuildArtifacts(dir: string) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    if (BUILD_ARTIFACTS.includes(entry)) {
      removePath(fullPath);
    } else if (statSync(fullPath).isDirectory()) {
      removeBuildArtifacts(fullPath);
    }
  }
}

export function removeNextApp(dir: string) {
  removePath(join(dir, "apps", "web"));
}

export function removeMobileApp(dir: string) {
  removePath(join(dir, "apps", "mobile"));
}

export function removeDatabase(dir: string) {
  removePath(join(dir, "packages", "db"));
  rmSync(join(dir, "docker-compose.yml"), {
    force: true,
    maxRetries: 5,
    retryDelay: 100,
  });

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
