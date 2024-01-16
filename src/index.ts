import { promisify } from 'util';

import { exec as syncExec } from 'child_process';
const exec = promisify(syncExec);

import { getCommands } from './lib/get-commands';

const main = async () => {
  // Get all commands
  const commands = await getCommands('basic');

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
