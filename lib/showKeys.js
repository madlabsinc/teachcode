const fs = require('fs');
const showBanner = require('../utils/banner');
const chalk = require('chalk');

let showKeys = () => {
	showBanner();
	setTimeout( () => {
		
		if(!fs.existsSync(process.cwd() + '/config.json')){
		console.log(chalk.red('Config file doesn\'t exist!'));
		process.exit(1);
	}
	userData = fs.readFileSync(process.cwd() + '/config.json', 'utf8');
	userDataJSON = JSON.parse(userData);
  if(userDataJSON.keys.length === 0){
      console.log(chalk.magentaBright('\nLooks like this is your very first task. Fire in TeachCode fetchtask to start out!'));
  } else{
      userDataJSON.keys.map((item, key) => {
        console.log(chalk.green(`\nTask-${key}: ${item}`));
      });
  }
	}, 100);
}

module.exports = showKeys;
