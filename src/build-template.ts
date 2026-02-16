import { mkdirSync, renameSync, rmSync } from "fs";

import { removeBuildArtifacts } from "./generators/remove.js";
import { setupDatabase } from "./steps/database/index.js";
import { createMonorepo } from "./steps/monorepo/index.js";
import { setupPrettier } from "./steps/prettier/index.js";
import { setupNextjs } from "./steps/nextjs/index.js";
import { PackageManager, getDlx } from "./types.js";
import { PLACEHOLDER, replaceInAllFiles } from "./utils/template.js";

const pm = process.argv[2] as PackageManager;
if (!pm || !["pnpm", "npm"].includes(pm)) {
  console.error("Usage: node build-template.js <pnpm|npm>");
  process.exit(1);
}

const dlx = getDlx(pm);
const outputDir = "output";
const buildName = "template";

// Clean and create output directory
rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });
process.chdir(outputDir);

// Run all scaffolding steps with a temporary name
createMonorepo(buildName, pm, dlx);
setupPrettier(buildName);
setupNextjs(buildName, pm, dlx);
setupDatabase(buildName, pm);

// Remove build artifacts (node_modules, .next, etc.) recursively
removeBuildArtifacts(buildName);

// Replace the build name with the placeholder in all file contents
replaceInAllFiles(buildName, buildName, PLACEHOLDER);

// Rename directory to placeholder name
renameSync(buildName, PLACEHOLDER);

console.log(`Template built at ${outputDir}/${PLACEHOLDER}`);
