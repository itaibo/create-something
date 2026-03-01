import { cpSync, writeFileSync } from "fs";
import { join } from "path";
import prompts from "prompts";

import {
  generateDockerfile,
  generateDockerignore,
} from "./generators/docker-files.js";
import { generateReadme } from "./generators/readme.js";
import { removeDatabase, removeNextApp } from "./generators/remove.js";
import { downloadAndExtract } from "./utils/download.js";
import { isAvailable, run } from "./utils/exec.js";
import { PLACEHOLDER, replaceInAllFiles } from "./utils/template.js";

async function main() {
  const pm = process.env.npm_config_user_agent?.startsWith("pnpm")
    ? "pnpm"
    : "npm";

  const response = await prompts(
    [
      {
        type: "text",
        name: "name",
        message: "Project name",
        initial: "my-app",
      },
      {
        type: "confirm",
        name: "nextjs",
        message: "Include Next.js app with shadcn?",
        initial: true,
      },
      {
        type: "confirm",
        name: "database",
        message: "Include Prisma database?",
        initial: true,
      },
    ],
    {
      onCancel: () => {
        process.exit(1);
      },
    },
  );

  if (!response.name) {
    process.exit(1);
  }

  const dir = response.name;
  const cwd = process.cwd();
  const hasNextjs = response.nextjs ?? true;
  const hasDatabase = response.database ?? true;

  const templateFlagIdx = process.argv.indexOf("--local-template");
  const templateDir =
    templateFlagIdx !== -1 ? process.argv[templateFlagIdx + 1] : undefined;
  if (templateDir) {
    console.log("\nCopying local template...");
    cpSync(templateDir, join(cwd, dir), { recursive: true });
  } else {
    console.log("\nDownloading template...");
    await downloadAndExtract(pm, dir, cwd);
  }

  console.log("Configuring project...");
  const projectDir = join(cwd, dir);
  replaceInAllFiles(projectDir, PLACEHOLDER, dir);

  if (!hasNextjs) {
    removeNextApp(projectDir);
  }

  if (!hasDatabase) {
    removeDatabase(projectDir);
  }

  generateReadme(projectDir, dir, pm, { hasNextjs, hasDatabase });

  if (hasNextjs) {
    writeFileSync(
      join(projectDir, "Dockerfile"),
      generateDockerfile(pm, { hasDatabase }),
    );
    writeFileSync(join(projectDir, ".dockerignore"), generateDockerignore());
  }

  let env = `ENVIRONMENT=local\n`;
  if (hasDatabase) {
    env += `DATABASE_URL=postgresql://user:password@localhost:5432/${dir}?schema=public\n`;
  }
  writeFileSync(join(projectDir, ".env"), env);
  writeFileSync(join(projectDir, ".env.example"), env);

  console.log("Installing dependencies...");
  run(`${pm} install`, projectDir);

  if (isAvailable("git")) {
    run("git init", projectDir);
    run("git add -A", projectDir);
    run('git commit -m "Initial commit from create-something"', projectDir);
  }

  console.log(`\nDone! cd ${dir} to get started.`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
