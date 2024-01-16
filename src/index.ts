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

  // Install packages
  // Check if Bun is installed. If so, use Bun
  const { stdout: bunInstalled } = await exec('which bun');

  if (bunInstalled) {
    console.log('Installing packages using Bun...');
    await exec('bun i');
  }

  if (!bunInstalled) {
    console.log('Installing packages...');
    await exec('npm i');
  }

  // End
  console.log('Have fun!');
};

main().catch(console.error);
