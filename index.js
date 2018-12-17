#!/usr/bin/env node

'use strict'

// Importing depedencies
const program = require('commander');
const shell = require('shelljs');
const fs = require('fs');
const { PythonShell } = require('python-shell');
const showBanner = require('./utils/banner');
const exercises = require('./lib/workspace/config');

// Linking excercise files
let initialize = require('./lib/initializeTasks');
let fetchTask = require('./lib/fetchTask');
let submitTask = require('./lib/submitTask');
let showKeys = require('./lib/showKeys');
let showCommands = require('./lib/showCommands');
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


program.parse(process.argv);

if(!program.args.length){
	program.help();
}