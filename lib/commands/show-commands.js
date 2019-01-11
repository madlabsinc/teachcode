'use strict';

const fs = require('fs');
const showBanner = require('../utils/banner');
const chalk = require('chalk');
const Table = require('cli-table');
const program = require('commander');

let userData;
let userDataJSON;

let showCommands = () => {
	showBanner();
	setTimeout( () => {

	if (program.args.length > 1) {
			console.log(chalk.red(`\n ${chalk.yellow('showcommands')} don't take in any arguments`));
			process.exit(1);
	}

	if (!fs.existsSync(process.cwd() + '/config.json')) {
		console.log(chalk.red('Config file doesn\'t exist!\n'));
		process.exit(1);
	}

	userData = fs.readFileSync(process.cwd() + '/config.json', 'utf8');
	userDataJSON = JSON.parse(userData);
	console.log(chalk.green(`\nUser: ${userDataJSON.username}\t\t\t\t\t\tProgress: ${userDataJSON.taskCount + 1}/30\n`));

  let commands = new Table();

  commands.push({
  'teach-code init': 'Initialize all the tasks'
   	}, {
  'teach-code fetchtask <your_key>' : 'Fetch new task providing the key'
   	}, {
  'teach-code submit': 'Submits the current file'
   	}, {
  'teach-code showkeys': 'View any tasks by grabbing their keys'
	}, {
  'teach-code showcommands': 'Lists all the commands'
	});
  console.log(commands.toString());
	}, 100);
};

module.exports = showCommands;
