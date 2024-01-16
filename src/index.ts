import { promisify } from 'util';
import { exec as syncExec } from 'child_process';
const exec = promisify(syncExec);

const BASE_TEMPLATE_URL = 'https://raw.githubusercontent.com/itaibo/create-something/main/templates';

const TEMPLATES = {
  basic: [
    `wget -O package.json ${BASE_TEMPLATE_URL}/basic/package-template.json`,
    `wget -O tsconfig.json ${BASE_TEMPLATE_URL}/basic/tsconfig-template.json`,
    `wget -O jest.config.js ${BASE_TEMPLATE_URL}/basic/jest.config-template.js`,
    `wget -O .gitignore ${BASE_TEMPLATE_URL}/basic/.gitignore-template.js`,
    `mkdir src && touch src/index.ts`,
    `mkdir tests && touch tests/index.test.ts`,
  ],
};

const main = async () => {
  // Get all commands
  const commands = TEMPLATES['basic'];

  // Wrap them in the async executor
  const asyncCommands = commands.map(command => exec(command));

  // Execute all commands at once
  console.log('Starting something new...');
  await Promise.all(asyncCommands);

  // NPM install
  console.log('Installing packages...');
  await exec('npm i');

  // End
  console.log('Have fun!');
};

main().catch(console.error);
