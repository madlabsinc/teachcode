const showBanner = require('../utils/banner');
const fs = require('fs');
const inquirer= require('inquirer');
const chalk = require('chalk');
const shell = require('shelljs');
const os = require('os');

let taskCount = 0;

let initialize = () => {
	showBanner();

	if(fs.existsSync(process.cwd() + '/Teach-Code-solutions' || process.cwd() + '/config.json')){
		console.log(chalk.red('  Teach-Code-solutions directory already already exists in the current directory\n'));
		console.log(chalk.blue('  Exiting!!'));
		process.exit(1);
	}
	if(os.platform() !== 'win32')
		shell.exec(`mkdir ${process.cwd()}/Teach-Code-solutions`);
	else
		shell.exec(`mkdir Teach-Code-solutions`);
	shell.cd('Teach-Code-solutions');

	setTimeout(() => {

		console.log(chalk.green('\nWelcome to Teach-Code\nGive your name below and type in:-\n'));
		console.log(chalk.blueBright('cd Teach-Code-solutions\nteach-code fetchtask 5e06b81d-e9ac-4321-8a97-4785ffce8146\n'));
		inquirer.prompt([
				{
					name: 'username',
					type: 'input',
					message: 'What\'s your name:-'
				}
			])
		.then(answers => {
			fs.writeFileSync(process.cwd()+ '/config.json', `{\n  "username": "${answers.username}",\n "taskCount": ${taskCount},\n "keys": ["5e06b81d-e9ac-4321-8a97-4785ffce8146"]\n,\n "files": []}`);
		});
		}, 100);
}

module.exports = initialize;
