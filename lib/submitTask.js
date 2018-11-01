const showBanner = require('../utils/banner');
const { PythonShell } = require('python-shell');
const fs = require('fs');
const shell = require('shelljs');
const chalk = require('chalk');
const os = require('os');

const keyStore = '123456789abcedefghijklmnopqrstuvwxyz';

let exercises = require(__dirname + '/workspace/config');
let userData;
let userDataJSON;
let generatedKey;

let generateKey = () => {
	let key = '';
	for(let i = 0; i < 36; i++)
		key += keyStore.charAt(Math.floor(Math.random() * keyStore.length));
	return key;
}

let submitTask = () => {
	showBanner();
	setTimeout( () => {
		if(!fs.existsSync(process.cwd() + '/config.json')){
		console.log(chalk.red('Make sure that you are within the Teach-Code-solutions directory!'));
		process.exit(1);
	}

	userData = fs.readFileSync(process.cwd() + '/config.json', 'utf8');
	userDataJSON = JSON.parse(userData);

	if(userDataJSON.taskCount === exercises.length){
		console.log('\nNo more tasks available!');
		process.exit(1);
	}

	let submittedFile =  userDataJSON.files[userDataJSON.files.length - 1];
	if(os.platform() === 'win32')
		let solutionFile = __dirname + exercises[userDataJSON.taskCount].op;
	else
		let solutionFile = __dirname + '/workspace/' + exercises[userDataJSON.taskCount].op;

	PythonShell.run(submittedFile, null, (err, result) => {

		if(err) {
			console.log(err.toString());
			process.exit(1);
		}

		PythonShell.run(solutionFile, null, (err, sol) => {
			if(err) {
				console.log(chalk.red('/toops there is something wrong with the syntax part!\n\n'))
				console.log(chalk.red('  ' + err.toString()));
				process.exit(1);
			}
			if(result.toString() === sol.toString()){
				userDataJSON.taskCount += 1;
				generatedKey = generateKey();
				userDataJSON.keys.push(generatedKey);
				userData = JSON.stringify(userDataJSON);
				fs.writeFileSync(process.cwd() + '/config.json', userData);
				console.log(chalk.greenBright('\n\tHurray you\'ve done it!\n\tKey to access the next task: ' + generatedKey));
			} else{
				console.log(chalk.yellowBright('  The solution doesn\'t meet all the output requirements. Have a look again!\n'));
			}
		});
	});
	}, 100);
}

module.exports = submitTask;
