export type PackageManager = "pnpm" | "npm";

export function getDlx(pm: PackageManager): string {
  return pm === "pnpm" ? "pnpm dlx" : "npx";
}

export function getRunCmd(pm: PackageManager): string {
  return pm === "pnpm" ? "pnpm" : "npm run";
}

export function getWorkspaceDep(pm: PackageManager): string {
  return pm === "pnpm" ? "workspace:*" : "*";
}

export const DB_SCRIPTS = [
  "db:generate",
  "db:push",
  "db:migrate",
  "db:studio",
  "db:format",
] as const;
