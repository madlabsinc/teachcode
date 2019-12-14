#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const program = require('commander');
const didYouMean = require('didyoumean');

const { version } = require('../package');

const initTasks = require('../src/commands/init');
const fetchTask = require('../src/commands/tasks');
const showCommands = require('../src/commands/commands');
const showKeys = require('../src/commands/keys');
const submitTask = require('../src/commands/submit');

// Defining all the available commands
program
  .name('teachcode')
  .version(version)
  .usage('<command> [options]');

program
  .command('init')
  .description('Initialize challenges')
  .action(initTasks);

program
  .command('submit')
  .description('Submits current task')
  .action(submitTask);

program
  .command('fetchtask [key]')
  .description('Fetches any task as per the key supplied')
  .action(fetchTask);

program
  .command('showkeys')
  .description('Shows keys of all the completed tasks')
  .action(showKeys);

program
  .command('showcommands')
  .description('Shows all commands available')
  .action(showCommands);

const suggestCommands = cmd => {
  const availableCommands = program.commands.map(c => c._name);

  // Get a suggestion from didyoumean.js based on the input.
  const suggestion = didYouMean(cmd, availableCommands);
  if (suggestion) {
    console.log(`  ` + chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`));
  }
};

// Validates any random command fired in
program.arguments('<command>').action(cmd => {
  program.outputHelp();
  console.log(`  ` + chalk.red(`\n  Unknown command ${chalk.yellow(cmd)}.`));
  console.log();
  suggestCommands(cmd);
});

program.parse(process.argv);

// Outputs help if no argument is provided
if (!program.args.length) {
  program.help();
}
