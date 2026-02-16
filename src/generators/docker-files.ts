import { PackageManager } from "../types.js";

export function generateDockerfile(
  pm: PackageManager,
  options: { hasDatabase: boolean },
): string {
  const isPnpm = pm === "pnpm";
  const installCmd = isPnpm
    ? "corepack enable pnpm && pnpm install --frozen-lockfile"
    : "npm ci";
  const lockfile = isPnpm ? "pnpm-lock.yaml" : "package-lock.json";

  const prismaLines = options.hasDatabase
    ? [
        "",
        "RUN npm i -g prisma",
        "ENV NODE_PATH=/usr/local/lib/node_modules",
        "",
        "# Copy Prisma schema, config, and migrations for migrate deploy",
        "COPY --from=installer /app/packages/db/prisma ./packages/db/prisma",
        "COPY --from=installer /app/packages/db/prisma.config.ts ./packages/db/prisma.config.ts",
      ]
    : [];

  const startCmd = options.hasDatabase
    ? 'CMD ["sh", "-c", "prisma migrate deploy --config packages/db/prisma.config.ts --schema packages/db/prisma/schema.prisma && node apps/web/server.js"]'
    : 'CMD ["node", "apps/web/server.js"]';

  const lines = [
    "FROM node:20-alpine AS base",
    "",
    "# ---",
    "FROM base AS pruner",
    "RUN npm i -g turbo@latest",
    "WORKDIR /app",
    "COPY . .",
    "RUN turbo prune web --docker",
    "",
    "# ---",
    "FROM base AS installer",
    "WORKDIR /app",
    "",
    "# Install dependencies from pruned lockfile",
    `COPY --from=pruner /app/out/json/${lockfile} ./`,
    "COPY --from=pruner /app/out/json/ .",
    `RUN ${installCmd}`,
    "",
    "# Build the project",
    "COPY --from=pruner /app/out/full/ .",
    "RUN npx turbo build --filter=web",
    "",
    "# ---",
    "FROM base AS runner",
    "WORKDIR /app",
    "",
    "RUN addgroup --system --gid 1001 nodejs",
    "RUN adduser --system --uid 1001 nextjs",
    "",
    "COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./",
    "COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static",
    "COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public",
    ...prismaLines,
    "",
    "USER nextjs",
    "ENV PORT=3000",
    "EXPOSE 3000",
    "",
    startCmd,
    "",
  ];

  return lines.join("\n");
}

export function generateDockerignore(): string {
  return ["node_modules", ".next", ".env", ".env.local", ""].join("\n");
}
