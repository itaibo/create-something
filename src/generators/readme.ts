import { writeFileSync } from "fs";
import { join } from "path";

import { PackageManager, getRunCmd } from "../types.js";

export function generateReadme(
  projectDir: string,
  projectName: string,
  pm: PackageManager,
  options: { hasNextjs: boolean; hasDatabase: boolean },
) {
  const runCmd = getRunCmd(pm);

  let content = `# ${projectName}\n\n`;

  content += `## Getting started\n\n`;
  content += `\`\`\`bash\n${pm} install\n\`\`\`\n\n`;

  content += `## Commands\n\n`;
  content += `| Command | Description |\n`;
  content += `| --- | --- |\n`;

  if (options.hasNextjs) {
    content += `| \`${runCmd} dev\` | Start development server |\n`;
    content += `| \`${runCmd} build\` | Build for production |\n`;
  }

  content += `| \`${runCmd} lint\` | Run ESLint |\n`;
  content += `| \`${runCmd} format\` | Format code with Prettier |\n`;

  if (options.hasDatabase) {
    content += `| \`${runCmd} db:generate\` | Generate Prisma client |\n`;
    content += `| \`${runCmd} db:push\` | Push schema to database |\n`;
    content += `| \`${runCmd} db:migrate\` | Run database migrations |\n`;
    content += `| \`${runCmd} db:studio\` | Open Prisma Studio |\n`;
  }

  content += `\n`;

  writeFileSync(join(projectDir, "README.md"), content);
}
