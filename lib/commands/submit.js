const showBanner = require('../utils/banner');
const { PythonShell } = require('python-shell');
const fs = require('fs');
const chalk = require('chalk');
const program = require('commander');

const keyStore = '123456789abcedefghijklmnopqrstuvwxyz';

let exercises = require('../workspace/config');
let userData;
let userDataJSON;
let generatedKey;

let generateKey = () => {
	let key = '';
	for (let i = 0; i < 36; i++)
		key += keyStore.charAt(Math.floor(Math.random() * keyStore.length));
	return key;
}

let submitTask = () => {
	showBanner();
	setTimeout( () => {

		if (program.args.length > 1) {
			console.log(chalk.red(`\n ${chalk.yellow('submit')} don't take in any arguments`));
			process.exit(1);
		}

		if (!fs.existsSync(process.cwd() + '/config.json')) {
			console.log(chalk.red(' Make sure that you are within the Teach-Code-solutions directory!\n'));
			console.log(chalk.magentaBright('\tcd Teach-Code-solutions may resolve the issue!\n'));
			process.exit(1);
	}

	userData = fs.readFileSync(process.cwd() + '/config.json', 'utf8');
	userDataJSON = JSON.parse(userData);

	if (userDataJSON.taskCount !== exercises.length)
		console.log(chalk.green(`\nUser: ${userDataJSON.username}\t\t\t\t\t\tProgress: ${userDataJSON.taskCount + 1}/30`));

	if (userDataJSON.taskCount === exercises.length) {
		console.log(chalk.greenBright(`\n  Congrats ${userDataJSON.username} you've made it through!\n  All tasks completed!\n`));
		process.exit(1);
	}

	if (userDataJSON.files.length === 0) {
		console.log(chalk.red('\n Use fetchtask to fetch your very first task'));
		process.exit(1);
	}

	if (userDataJSON.taskCount === userDataJSON.files.length) {
		console.log(chalk.yellow('\nTask already submitted!\n'));
		process.exit(1);
	}

	let submittedFile =  userDataJSON.files[userDataJSON.files.length - 1];
	let submittedFileContent = fs.readFileSync(submittedFile, 'utf8').toString().split('');

	if (submittedFileContent.length === 0) {
			console.log(chalk.red(`\n Solution file task${userDataJSON.taskCount + 1}.py is empty!\n`));
			process.exit(1);
	}

	let	solutionFile = __dirname + '/../workspace/' + exercises[userDataJSON.taskCount].op;

	PythonShell.run(submittedFile, null, (err, result) => {

		if (err) {
			console.log(chalk.red('\n\tOops there is something wrong with the syntax part!\n'));
			console.log(err.toString());
			process.exit(1);
		}

		PythonShell.run(solutionFile, null, (err, sol) => {

			if (err) {
				console.log(chalk.red('  ' + err.toString()));
				process.exit(1);
			}

			if (typeof result === undefined || typeof sol === undefined) {
					console.log(chalk.red(`\n Kindly have a look at task${userDataJSON.taskCount}.py`));
					process.exit(1);
			}
			try {
				if (result.toString() === sol.toString()) {
					userDataJSON.taskCount += 1;
					generatedKey = generateKey();
					userDataJSON.keys.push(generatedKey);
					userData = JSON.stringify(userDataJSON);
					fs.writeFileSync(process.cwd() + '/config.json', userData);
					console.log(chalk.greenBright('\n  Hurray you\'ve done it!\n  Key to access the next task: ' + generatedKey + '\n'));
				} else {
					console.log(chalk.yellowBright('\n  The solution doesn\'t meet all the output requirements. Have a look again!\n'));
				}
			} catch(err) {
				console.log(chalk.red(`\n There's something wrong with the file task${userDataJSON.taskCount + 1}.py\n`));
			}
		});
	});
	}, 100);
}

module.exports = submitTask;
