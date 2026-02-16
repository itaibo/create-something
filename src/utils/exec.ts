import { execSync } from "child_process";

export function run(cmd: string, cwd?: string) {
  execSync(cmd, { cwd, stdio: "inherit" });
}
