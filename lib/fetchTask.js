const showBanner = require('../utils/banner');
const fs = require('fs');
const shell = require('shelljs');

let exercises = require('../workspace/config');
let userData;
let userDataJSON;
// let username;
// let taskCount;

let fetchTask = () => {
	showBanner();
	setTimeout(() => {
		/* try{
			shell.cd('Teach-Code-solutions');
		}catch(e){
			console.log('Error!');
		} */
		if(!fs.existsSync(process.cwd() + '/config.json')){
		console.log('Config file doesn\'t exist!');
		process.exit(1);
	}
		// userData = fs.readFileSync(process.cwd() + '/config.json', 'utf8').toString().split('\n');
		// username = userData[0];
		// taskCount = userData[1];
		// console.log(`\nUser: ${username}`);
		// console.log(`\n${exercises[taskCount].task}\n`);
		userData = fs.readFileSync(process.cwd() + '/config.json', 'utf8');
		userDataJSON = JSON.parse(userData);
		console.log(`\nUser: ${userDataJSON.username}`);
		console.log(`\n${exercises[userDataJSON.taskCount].task}\n`)
		}, 100);
}

module.exports = fetchTask;
