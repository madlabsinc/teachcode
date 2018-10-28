const showBanner = require('../utils/banner');
const { PythonShell } = require('python-shell');
const fs = require('fs');
const shell = require('shelljs');

let exercises = require('../workspace/config');
let userData;
let taskCount;

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
	let userData = fs.readFileSync(process.cwd() + '/config.json', 'utf8').toString().split('\n');
	let taskCount = userData[1];
	PythonShell.run(file, null, (err, result) => {
		if(err) {
			console.log(err.toString());
			process.exit(1);
		}	
		if(result.toString() === exercises[taskCount].op){
			taskCount++;
			userData[1] = taskCount;
			fs.writeFileSync(process.cwd() + '/config.json', userData.join('\n'));
		}else{
			console.log('Something went wrong!');
		}
	})
	}, 100);
}

module.exports = submitTask; 