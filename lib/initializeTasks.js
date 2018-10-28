const showBanner = require('../utils/banner');
const fs = require('fs');
const inquirer= require('inquirer');
const chalk = require('chalk');
const shell = require('shelljs');
const os = require('os');

let taskCount = 0;

let initialize = () => {
	showBanner();
	
	shell.exec(`mkdir ${process.cwd()}/Teach-Code-solutions`);
	shell.cd('Teach-Code-solutions');

	setTimeout(() => {
		console.log('\nWelcome to Teach-Code\nGive your name below and type in:-\n');
		console.log(chalk.redBright('Teach-Code fetchtask\n'));
		inquirer.prompt([
				{
					name: 'username',
					type: 'input',
					message: 'What\'s your name:-'
				}
			])
		.then(answers => {
			fs.writeFileSync(process.cwd()+ '/config.json', `${answers.username}\n${taskCount}`);
		});
		}, 100);
}

module.exports = initialize;