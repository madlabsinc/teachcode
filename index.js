#!/usr/bin/env node

'use strict'

// Importing depedencies
const program = require('commander');
const chalk = require('chalk');

// Linking excercise files
let initialize = require('./lib/commands/initializeTasks');
let fetchTask = require('./lib/commands/fetchTask');
let submitTask = require('./lib/commands/submitTask');
let showKeys = require('./lib/commands/showKeys');
let showCommands = require('./lib/commands/showCommands');
let versionInfo = require('./lib/versionInfo');


program
.command('version')
.description('Outputs version and local development environment information')
.action(versionInfo);

program
.command('init')
.description('Initialize challenges')
.action(initialize);

program
.command('submit')
.description('Submits current task')
.action(submitTask);

program
.command('fetchtask <key>')
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

program
  .arguments('<command>')
  .action((cmd) => {
    program.outputHelp()
    console.log(`  ` + chalk.red(`\n  Unknown command ${chalk.yellow(cmd)}.`))
    console.log()
});

program.parse(process.argv);

if(!program.args.length){
	program.help();
}