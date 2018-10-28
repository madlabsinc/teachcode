const showBanner = require('../utils/banner');
const fs = require('fs');

let progress;
let username;

let fetchTask = () => {
	showBanner();
	setTimeout(() => {
		if(!fs.existsSync('config.json')){
		console.log('File doesn\'t exist!');
		process.exit(1);
	}
		username = fs.readFileSync('config.json', 'utf8').toString().split('\n')[0];
		console.log(`Hey ${username}`);
		}, 100);
}

module.exports = fetchTask;