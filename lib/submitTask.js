const showBanner = require('../utils/banner');
const { PythonShell } = require('python-shell');
const fs = require('fs');

let exercises = require('../workspace/config');

let submitTask = (file) => {
	showBanner();
	setTimeout( () => {
		if(!fs.existsSync('config.json')){
		console.log('File doesn\'t exist!');
		process.exit(1);
	}
	console.log(exercises[0].task);
	PythonShell.run(file, null, (err, result) => {
		if(err) {
			console.log(err.toString());
			process.exit(1);
		}	
		if(result.toString() === 'Hello World'){
			console.log(exercises[0].task);
		}else{
			console.log('Something went wrong!');
		}
	})
	}, 100);
}

module.exports = submitTask;