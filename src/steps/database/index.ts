import { readFileSync } from "fs";
import { join } from "path";

import { DB_SCRIPTS, PackageManager, getWorkspaceDep } from "../../types.js";
import { run } from "../../utils/exec.js";
import {
  createDir,
  editJson,
  templatePath,
  writeJson,
  writeText,
} from "../../utils/fs.js";

export function setupDatabase(dir: string, pm: PackageManager) {
  const dbDir = join(dir, "packages", "db");
  createDir(dbDir);

  writeJson(join(dbDir, "package.json"), {
    name: "@repo/db",
    version: "0.0.0",
    private: true,
    type: "module",
    exports: {
      ".": "./src/index.ts",
    },
    scripts: {
      "db:generate": "prisma generate",
      "db:push": "prisma db push",
      "db:migrate": "prisma migrate dev",
      "db:studio": "prisma studio",
      "db:format": "prisma format --schema prisma/schema.prisma",
    },
  });

  run(`${pm} add @prisma/adapter-pg @prisma/client`, dbDir);
  run(`${pm} add -D prisma eslint typescript`, dbDir);

  // Add workspace deps after install (workspace:* is pnpm-only, npm uses *)
  const ws = getWorkspaceDep(pm);
  editJson(join(dbDir, "package.json"), (pkg) => {
    pkg.devDependencies = pkg.devDependencies || {};
    pkg.devDependencies["@repo/eslint-config"] = ws;
    pkg.devDependencies["@repo/typescript-config"] = ws;
  });

  writeJson(join(dbDir, "tsconfig.json"), {
    extends: "@repo/typescript-config/base.json",
    compilerOptions: {
      outDir: "./dist",
    },
    include: ["src"],
  });

  // Prisma schema
  const prismaDir = join(dbDir, "prisma");
  createDir(prismaDir);
  const schema = readFileSync(
    templatePath(import.meta.url, "schema.prisma"),
    "utf-8",
  );
  writeText(join(prismaDir, "schema.prisma"), schema);

  // Client singleton
  const srcDir = join(dbDir, "src");
  createDir(srcDir);
  const client = readFileSync(
    templatePath(import.meta.url, "client.ts"),
    "utf-8",
  );
  writeText(join(srcDir, "index.ts"), client);

  // Gitignore for generated Prisma client
  writeText(join(dbDir, ".gitignore"), "prisma/generated\n");

  // Prisma config
  const prismaConfig = readFileSync(
    templatePath(import.meta.url, "prisma.config.ts"),
    "utf-8",
  );
  writeText(join(dbDir, "prisma.config.ts"), prismaConfig);

  // ESLint config
  const eslintConfig = readFileSync(
    templatePath(import.meta.url, "eslint.config.mjs"),
    "utf-8",
  );
  writeText(join(dbDir, "eslint.config.mjs"), eslintConfig);

  // Add db tasks to turbo.json
  editJson(join(dir, "turbo.json"), (turbo) => {
    for (const script of DB_SCRIPTS) {
      turbo.tasks[script] = {
        cache: false,
        passThroughEnv: ["*"],
      };
    }
  });

  // Add db scripts to root package.json and update dev to start postgres
  editJson(join(dir, "package.json"), (pkg) => {
    pkg.scripts = pkg.scripts || {};
    pkg.scripts["dev"] =
      "docker compose up -d postgres && trap 'docker compose down' EXIT && dotenv -e .env -- turbo run dev";
    pkg.scripts["db:generate"] = "dotenv -e .env -- turbo db:generate";
    pkg.scripts["db:push"] = "dotenv -e .env -- turbo db:push";
    pkg.scripts["db:migrate"] = "dotenv -e .env -- turbo db:migrate";
    pkg.scripts["db:studio"] = "dotenv -e .env -- turbo db:studio";
    pkg.scripts["db:format"] = "dotenv -e .env -- turbo db:format";
  });

  // Docker Compose for Postgres
  const dockerCompose = readFileSync(
    templatePath(import.meta.url, "docker-compose.yml"),
    "utf-8",
  );
  writeText(join(dir, "docker-compose.yml"), dockerCompose);

  console.log("Prisma database package created at packages/db");
}
