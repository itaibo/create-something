import { execSync } from "child_process";

export function run(cmd: string, cwd?: string) {
  execSync(cmd, { cwd, stdio: "inherit" });
}

export function isAvailable(cmd: string): boolean {
  try {
    execSync(`which ${cmd}`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}
