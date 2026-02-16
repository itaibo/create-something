import { copyFileSync } from "fs";
import { join } from "path";

import { templatePath } from "../../utils/fs.js";

export function setupPrettier(dir: string) {
  copyFileSync(
    templatePath(import.meta.url, ".prettierrc"),
    join(dir, ".prettierrc"),
  );
}
