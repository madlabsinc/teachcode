const showBanner = require('../utils/banner');
const fs = require('fs');
const shell = require('shelljs');
const chalk = require('chalk');
const os = require('os');

let exercises = require(__dirname + '/workspace/config');
let userData;
let userDataJSON;

let fetchTask = (key) => {
	showBanner();
	setTimeout(() => {
		if(!fs.existsSync(process.cwd() + '/config.json')){
		console.log(chalk.red('Make sure that you are within the Teach-Code-solutions directory!'));
		process.exit(1);
	}

		userData = fs.readFileSync(process.cwd() + '/config.json', 'utf8');
		userDataJSON = JSON.parse(userData);

		let fileName = `task${userDataJSON.taskCount + 1}.py`;

		for(let index = 0; index < userDataJSON.keys.length - 1; index++ ){
			if(userDataJSON.keys[index] === key){
				console.log(chalk.yellowBright('\n\n This task is already completed! \n\n'));
				console.log(chalk.green(`\nUser: ${userDataJSON.username}`));
				console.log(chalk.green(`\n${exercises[index].task}\n`));
				process.exit(1);
			}
		}

		if(userDataJSON.keys[userDataJSON.keys.length - 1] === key){
			if(os.platform() !== 'win32')
				shell.exec(`touch ${fileName}`);
			else
					shell.exec(`notepad ${fileName}`);

			userDataJSON.files.push(fileName);
			userData = JSON.stringify(userDataJSON);
			fs.writeFileSync(process.cwd() + '/config.json', userData);

			console.log(chalk.green(`\nUser: ${userDataJSON.username}`));
			console.log(chalk.green(`\n${exercises[userDataJSON.taskCount].task}\n`));
		} else{
			console.log(chalk.red('\nMake sure that you\'ve grabbed the key correctly!'));
		}

		}, 100);
}

module.exports = fetchTask;
