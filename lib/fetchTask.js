const showBanner = require('../utils/banner');
const fs = require('fs');
const shell = require('shelljs');

let exercises = require('../workspace/config');

shell.cd('Teach-Code-solutions');
let userData = fs.readFileSync(process.cwd() + '/config.json', 'utf8').toString().split('\n');

let progress;
let username;
let taskCount;

let fetchTask = () => {
	showBanner();
	setTimeout(() => {
		if(!fs.existsSync(process.cwd() + '/config.json')){
		console.log('Config file doesn\'t exist!');
		process.exit(1);
	}
		username = userData[0].name;
		taskCount = userData[1].taskCount;
		console.log(`\nHey ${username}\n\n${excercises[taskCount].task}`);
		}, 100);
}

module.exports = fetchTask; 