const showBanner = require('../utils/banner');
const { PythonShell } = require('python-shell');
const fs = require('fs');
const shell = require('shelljs');

shell.cd('Teach-Code-solutions');

let exercises = require('../workspace/config');
let userData = fs.readFileSync(process.cwd() + '/config.json', 'utf8').toString().split('\n');
let taskCount = userData[1].taskCount;

let submitTask = (file) => {
	showBanner();
	setTimeout( () => {
		if(!fs.existsSync(process.cwd() + '/config.json')){
		console.log('Config file doesn\'t exist!');
		process.exit(1);
	}
	PythonShell.run(file, null, (err, result) => {
		if(err) {
			console.log(err.toString());
			process.exit(1);
		}	
		if(result.toString() === exercises[taskCount].op){
			// console.log(exercises[0].task);
			taskCount++;
			userData[1].taskCount = taskCount;
			fs.writeFileSync(process.cwd() + '/config.json', userData);
		}else{
			console.log('Something went wrong!');
		}
	})
	}, 100);
}

module.exports = submitTask; 