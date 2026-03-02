import { rmSync } from "fs";
import { join } from "path";

import { PackageManager, getWorkspaceDep } from "../../types.js";
import { run } from "../../utils/exec.js";
import { editJson } from "../../utils/fs.js";

export function setupMobile(
  dir: string,
  pm: PackageManager,
  dlx: string,
) {
  const appsDir = join(dir, "apps");

  run(
    `${dlx} create-expo-app@latest --template default@sdk-55 mobile`,
    appsDir,
  );

  const mobileDir = join(appsDir, "mobile");

  // Remove files managed by the monorepo root
  rmSync(join(mobileDir, ".gitignore"), { force: true });
  rmSync(join(mobileDir, "README.md"), { force: true });
  rmSync(join(mobileDir, "pnpm-lock.yaml"), { force: true });
  rmSync(join(mobileDir, "package-lock.json"), { force: true });

  // Update package.json with workspace dependencies and dev script
  const ws = getWorkspaceDep(pm);
  editJson(join(mobileDir, "package.json"), (pkg) => {
    pkg.scripts["dev"] = "expo start";
    pkg.devDependencies["@repo/eslint-config"] = ws;
    pkg.devDependencies["@repo/typescript-config"] = ws;
  });
}
