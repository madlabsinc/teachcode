const showBanner = require('../utils/banner');
const { PythonShell } = require('python-shell');
const fs = require('fs');
const shell = require('shelljs');

const keyStore = '123456789#%&*abcedefghijklmnopqrstuvwxyz-+';

let exercises = require('../workspace/config');
let userData;
let userDataJSON;
let generatedKey;
// let taskCount;

let generateKey = () => {
	let key = '';
	for(let i = 0; i < 36; i++)
		key += keyStore.charAt(Math.floor(Math.random() * keyStore.length));
	return key;
}

let submitTask = (file) => {
	showBanner();
	setTimeout( () => {
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
	userData = fs.readFileSync(process.cwd() + '/config.json', 'utf8');
	userDataJSON = JSON.parse(userData);
	// let taskCount = userData[1];
	PythonShell.run(file, null, (err, result) => {
		if(err) {
			console.log(err.toString());
			process.exit(1);
		}
		if(result.toString() === exercises[userDataJSON.taskCount].op){
			userDataJSON.taskCount += 1;
			// taskCount++;
			// userData[1] = taskCount;
			// fs.writeFileSync(process.cwd() + '/config.json', userData.join('\n'));
			generatedKey = generateKey();
			userDataJSON.keys.push(generatedKey);
			userData = JSON.stringify(userDataJSON);
			fs.writeFileSync(process.cwd() + '/config.json', userData);
			console.log('\nHurray you\'ve done it!\n');
			console.log(generatedKey);
		} else{
			console.log('Something went wrong!');
		}
	})
	}, 100);
}

module.exports = submitTask;
