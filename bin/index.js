#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const program = require('commander');
const didYouMean = require('didyoumean');

const { version } = require('../package');

const logger = require('../src/utils/logger');

const initTasks = require('../src/commands/init');
const fetchTask = require('../src/commands/tasks');
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
  .description('Fetch tasks to be worked upon')
  .action(fetchTask);

program
  .command('showkeys')
  .description('Shows keys of all the completed tasks')
  .action(showKeys);

const suggestCommands = cmd => {
  const availableCommands = program.commands.map(c => c._name);

  // Get a suggestion from didyoumean.js based on the input.
  const suggestion = didYouMean(cmd, availableCommands);
  if (suggestion) {
    logger.info(` Did you mean ${chalk.yellow(suggestion)}?`);
  }
};

// Validation for unknown commands
program.on('command:*', ([cmd]) => {
  program.outputHelp();
  console.log();
  logger.error(` Unknown command ${chalk.yellow(cmd)}.`);
  console.log();
  suggestCommands(cmd);
});

program.parse(process.argv);
