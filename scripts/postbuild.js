import { readFileSync, writeFileSync, cpSync, readdirSync } from "fs";

const file = "dist/index.js";
const content = readFileSync(file, "utf8");
writeFileSync(file, `#!/usr/bin/env node\n${content}`);

// Copy template folders from each step to dist
const stepsDir = "src/steps";
for (const step of readdirSync(stepsDir)) {
  try {
    cpSync(`${stepsDir}/${step}/template`, `dist/steps/${step}/template`, {
      recursive: true,
    });
  } catch {
    // Step has no template folder, skip
  }
}
