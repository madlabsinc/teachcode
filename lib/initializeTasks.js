const showBanner = require('../utils/banner');
const fs = require('fs');
const inquirer= require('inquirer');
const chalk = require('chalk');
let obj;

let initialize = () => {
	showBanner();

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
			fs.writeFileSync('config.json', answers.username);
		});
		}, 100);
}

module.exports = initialize;