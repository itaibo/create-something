import { execSync } from "child_process";

export function run(cmd: string, cwd?: string, silent?: boolean) {
  execSync(cmd, { cwd, stdio: silent ? "ignore" : "inherit" });
}

export function isAvailable(cmd: string): boolean {
  try {
    execSync(`which ${cmd}`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}
